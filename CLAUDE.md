# Chatterm - Management Platform

## Project Overview
A terminal-based interface for managing and organizing ChatGPT conversations. Experience ChatGPT through a nostalgic terminal interface with file system navigation and conversation management.

## Technology Stack
- **Framework**: Next.js
- **Language**: TypeScript
- **Runtime**: React 18.2.0
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Form Management**: React Hook Form + Zod validation
- **Deployment**: GitHub Pages

## Key Features
- Modern responsive web application
- TypeScript for type safety
- Accessible UI components with Radix UI
- Advanced form handling and validation
- Interactive data visualization
- Dark/light theme switching
- Chrome extension integration
- Browser interaction capabilities

## Core Dependencies
- **UI Framework**: Radix UI component suite
- **Styling**: class-variance-authority, clsx, tailwind-merge
- **Forms**: react-hook-form with Zod validation
- **Recharts**: Data visualization and charts
- **Date Fns**: Date manipulation utilities
- **Lucide React**: Icon library
- **Next Themes**: Theme management
- **Sonner**: Toast notifications
- **Cmdk**: Command palette
- **Vaul**: Mobile-optimized modals

## Development Commands
```bash
# Development server
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Export static files
npm run export

# Deploy to GitHub Pages
npm run deploy

```

## Project Structure
```
chatterm/
├── app/                     # Next.js App Router
├── components/              # React components
├── lib/                     # Utility functions
├── hooks/                   # Custom React hooks
├── public/                  # Static assets
├── styles/                  # Stylesheets
├── next.config.mjs          # Configuration
├── tailwind.config.ts       # Configuration
├── tsconfig.json            # Configuration
└── package.json             # Dependencies
```

## Deployment
- **Platform**: GitHub Pages
- **URL**: https://igor-kan.github.io/chatterm
- **Build**: Static site generation
- **CI/CD**: Automated deployment via gh-pages

## Development Notes
- Uses Next.js App Router for modern React development
- Implements comprehensive form validation with Zod
- Includes accessibility features through Radix UI
- Supports dark/light theme switching

## Chrome Extension Features
- **Manifest V3**: Modern extension architecture
- **Content Scripts**: Page interaction capabilities
- **Background Service Worker**: Background processing
- **Popup Interface**: React-based popup UI
- **Storage API**: Local data persistence

## Extension Setup
1. Build the extension with `npm run build`
2. Load unpacked extension in Chrome Developer Mode
3. Configure permissions as needed
4. Test functionality in target websites

## Testing & Quality
- TypeScript for type safety

## Future Enhancements
- Cross-browser compatibility
- Advanced extension features
- Integration with more platforms
- Enhanced security features
- Offline functionality

