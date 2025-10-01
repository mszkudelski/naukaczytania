# Nauka Czytania - Learning to Read

A Polish educational reading game for children, built with Preact.

## Features

- 12 progressive levels from letters to complex words
- Audio support with Polish speech synthesis
- Progress tracking with localStorage
- Master mode for level selection
- Responsive design for mobile and desktop
- Game state persistence

## Development

### Prerequisites

- Node.js (version 16 or higher)
- npm

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Open http://localhost:3000 in your browser

### Build for Production

```bash
npm run build
```

This creates a `dist/` folder with optimized files ready for deployment.

### Preview Production Build

```bash
npm run preview
```

## Deployment

### Netlify

The project includes a `netlify.toml` configuration file for easy deployment to Netlify:

- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Node Version**: 18
- Includes SPA redirect rules and security headers
- Optimized caching for static assets

Simply connect your GitHub repository to Netlify and it will automatically deploy using these settings.

## Architecture

The application has been migrated from vanilla JavaScript to Preact for better maintainability and state management:

- **Components**: Modular UI components in `src/components/`
- **Hooks**: Custom hooks for game state management in `src/hooks/`
- **Utils**: Game logic, audio utilities, and data in `src/utils/`
- **Styling**: CSS extracted to `src/style.css`

## Game Levels

1. **Level 1-3**: Basic and Polish letters
2. **Level 4-9**: Two and three-letter syllables
3. **Level 10-12**: Complete words and phrases

Each level progressively increases in difficulty and includes audio support for pronunciation practice.