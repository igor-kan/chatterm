/** @type {import('@next/bundle-analyzer')} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  
  // Bundle optimization
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'date-fns',
      'recharts',
      'framer-motion',
    ],
  },
  
  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Bundle size optimizations
    if (!dev && !isServer) {
      // Tree shake unused exports
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
      
      // Optimize chunks
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            chunks: 'all',
          },
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|@headlessui)[\\/]/,
            name: 'ui-components',
            priority: 20,
            chunks: 'all',
          },
          icons: {
            test: /[\\/]node_modules[\\/](lucide-react|@radix-ui\/react-icons)[\\/]/,
            name: 'icons',
            priority: 20,
            chunks: 'all',
          },
          charts: {
            test: /[\\/]node_modules[\\/](recharts|d3)[\\/]/,
            name: 'charts',
            priority: 20,
            chunks: 'all',
          },
        },
      }
    }
    
    // Bundle analyzer configuration
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: isServer ? 8888 : 8889,
          openAnalyzer: true,
          reportFilename: `${isServer ? 'server' : 'client'}-bundle-report.html`,
          generateStatsFile: true,
          statsFilename: `${isServer ? 'server' : 'client'}-stats.json`,
        })
      )
    }
    
    return config
  },
  
  // Build size monitoring
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  
  // Compression
  compress: true,
  
  // Performance budgets (will show warnings)
  ...(process.env.NODE_ENV === 'production' && {
    webpack: (config, options) => {
      // Production-only optimizations
      if (!options.dev) {
        // Warn on large bundles
        config.performance = {
          hints: 'warning',
          maxAssetSize: 250000, // 250KB
          maxEntrypointSize: 500000, // 500KB
        }
      }
      return config
    },
  }),
}

module.exports = withBundleAnalyzer(nextConfig)