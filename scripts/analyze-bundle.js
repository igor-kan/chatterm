#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes Next.js bundle sizes and provides optimization recommendations
 */

const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

class BundleAnalyzer {
  constructor() {
    this.projectRoot = process.cwd()
    this.buildDir = path.join(this.projectRoot, '.next')
    this.outputFile = path.join(this.projectRoot, 'bundle-analysis.json')
  }

  async analyze() {
    console.log('🔍 Starting bundle analysis...')

    // Check if .next directory exists
    if (!fs.existsSync(this.buildDir)) {
      console.log('📦 Building project for analysis...')
      try {
        execSync('npm run build', { stdio: 'inherit' })
      } catch (error) {
        console.error('❌ Build failed:', error.message)
        process.exit(1)
      }
    }

    const analysis = {
      timestamp: new Date().toISOString(),
      project: this.getProjectName(),
      bundles: this.analyzeBundles(),
      pages: this.analyzePages(),
      recommendations: []
    }

    // Generate recommendations
    analysis.recommendations = this.generateRecommendations(analysis)

    // Save analysis
    fs.writeFileSync(this.outputFile, JSON.stringify(analysis, null, 2))

    // Display results
    this.displayResults(analysis)

    return analysis
  }

  getProjectName() {
    try {
      const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
      return packageJson.name || 'unknown'
    } catch (error) {
      return 'unknown'
    }
  }

  analyzeBundles() {
    const bundles = []
    const staticDir = path.join(this.buildDir, 'static')

    if (!fs.existsSync(staticDir)) {
      console.warn('⚠️  Static directory not found')
      return bundles
    }

    // Analyze chunks
    const chunksDir = path.join(staticDir, 'chunks')
    if (fs.existsSync(chunksDir)) {
      const chunkFiles = fs.readdirSync(chunksDir)
        .filter(file => file.endsWith('.js'))
        .map(file => {
          const filePath = path.join(chunksDir, file)
          const stats = fs.statSync(filePath)
          return {
            name: file,
            type: 'chunk',
            size: stats.size,
            sizeHuman: this.formatBytes(stats.size)
          }
        })
        .sort((a, b) => b.size - a.size)

      bundles.push(...chunkFiles)
    }

    // Analyze CSS
    const cssDir = path.join(staticDir, 'css')
    if (fs.existsSync(cssDir)) {
      const cssFiles = fs.readdirSync(cssDir)
        .filter(file => file.endsWith('.css'))
        .map(file => {
          const filePath = path.join(cssDir, file)
          const stats = fs.statSync(filePath)
          return {
            name: file,
            type: 'css',
            size: stats.size,
            sizeHuman: this.formatBytes(stats.size)
          }
        })
        .sort((a, b) => b.size - a.size)

      bundles.push(...cssFiles)
    }

    return bundles
  }

  analyzePages() {
    const pages = []
    const serverDir = path.join(this.buildDir, 'server')
    const pagesManifest = path.join(this.buildDir, 'server', 'pages-manifest.json')

    if (!fs.existsSync(pagesManifest)) {
      return pages
    }

    try {
      const manifest = JSON.parse(fs.readFileSync(pagesManifest, 'utf8'))
      
      Object.entries(manifest).forEach(([route, filePath]) => {
        const fullPath = path.join(this.buildDir, filePath)
        if (fs.existsSync(fullPath)) {
          const stats = fs.statSync(fullPath)
          pages.push({
            route,
            file: filePath,
            size: stats.size,
            sizeHuman: this.formatBytes(stats.size)
          })
        }
      })
    } catch (error) {
      console.warn('⚠️  Could not analyze pages:', error.message)
    }

    return pages.sort((a, b) => b.size - a.size)
  }

  generateRecommendations(analysis) {
    const recommendations = []
    const largeBundles = analysis.bundles.filter(bundle => bundle.size > 250000) // 250KB
    const largePages = analysis.pages.filter(page => page.size > 100000) // 100KB

    if (largeBundles.length > 0) {
      recommendations.push({
        type: 'bundle-size',
        severity: 'warning',
        message: `Found ${largeBundles.length} large bundles (>250KB)`,
        details: largeBundles.map(b => `${b.name}: ${b.sizeHuman}`),
        suggestions: [
          'Consider code splitting for large bundles',
          'Use dynamic imports for heavy components',
          'Optimize third-party libraries',
          'Remove unused dependencies'
        ]
      })
    }

    if (largePages.length > 0) {
      recommendations.push({
        type: 'page-size',
        severity: 'info',
        message: `Found ${largePages.length} large pages (>100KB)`,
        details: largePages.map(p => `${p.route}: ${p.sizeHuman}`),
        suggestions: [
          'Implement lazy loading for components',
          'Use getStaticProps for data fetching',
          'Consider server-side rendering',
          'Optimize images and media assets'
        ]
      })
    }

    // Check for common optimization opportunities
    const hasLargeChunks = analysis.bundles.some(b => 
      b.name.includes('vendor') && b.size > 500000
    )

    if (hasLargeChunks) {
      recommendations.push({
        type: 'vendor-chunks',
        severity: 'warning',
        message: 'Large vendor chunks detected',
        suggestions: [
          'Split vendor chunks by library type',
          'Use webpack splitChunks configuration',
          'Consider tree-shaking unused exports',
          'Upgrade to latest versions of dependencies'
        ]
      })
    }

    // Check for CSS optimization
    const largeCss = analysis.bundles.filter(b => b.type === 'css' && b.size > 50000)
    if (largeCss.length > 0) {
      recommendations.push({
        type: 'css-size',
        severity: 'info',
        message: 'Large CSS bundles detected',
        details: largeCss.map(c => `${c.name}: ${c.sizeHuman}`),
        suggestions: [
          'Enable CSS purging in production',
          'Use critical CSS extraction',
          'Consider CSS-in-JS solutions',
          'Remove unused CSS rules'
        ]
      })
    }

    return recommendations
  }

  displayResults(analysis) {
    console.log('\n📊 Bundle Analysis Results')
    console.log('=' .repeat(50))
    
    console.log(`\n📦 Project: ${analysis.project}`)
    console.log(`🕐 Analyzed at: ${analysis.timestamp}`)

    // Top bundles
    console.log('\n🏆 Largest Bundles:')
    analysis.bundles.slice(0, 10).forEach((bundle, index) => {
      const icon = bundle.size > 250000 ? '🔴' : bundle.size > 100000 ? '🟡' : '🟢'
      console.log(`  ${index + 1}. ${icon} ${bundle.name} (${bundle.sizeHuman})`)
    })

    // Top pages
    if (analysis.pages.length > 0) {
      console.log('\n📄 Largest Pages:')
      analysis.pages.slice(0, 5).forEach((page, index) => {
        const icon = page.size > 100000 ? '🔴' : page.size > 50000 ? '🟡' : '🟢'
        console.log(`  ${index + 1}. ${icon} ${page.route} (${page.sizeHuman})`)
      })
    }

    // Recommendations
    if (analysis.recommendations.length > 0) {
      console.log('\n💡 Optimization Recommendations:')
      analysis.recommendations.forEach((rec, index) => {
        const icon = rec.severity === 'warning' ? '⚠️' : 'ℹ️'
        console.log(`\n  ${index + 1}. ${icon} ${rec.message}`)
        
        if (rec.details) {
          rec.details.forEach(detail => console.log(`     - ${detail}`))
        }
        
        console.log('     Suggestions:')
        rec.suggestions.forEach(suggestion => console.log(`     • ${suggestion}`))
      })
    } else {
      console.log('\n✅ No major optimization opportunities found!')
    }

    console.log(`\n📄 Detailed analysis saved to: ${this.outputFile}`)
    console.log('\n🚀 To analyze with webpack-bundle-analyzer, run: npm run analyze')
  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }
}

// Run analysis if called directly
if (require.main === module) {
  const analyzer = new BundleAnalyzer()
  analyzer.analyze().catch(error => {
    console.error('❌ Analysis failed:', error.message)
    process.exit(1)
  })
}

module.exports = BundleAnalyzer