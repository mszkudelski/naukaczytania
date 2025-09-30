# Nauka Czytania - Preact Demo

This is a demonstration of how the Nauka Czytania (Learn to Read) app could be restructured using Preact.

## Current Features Implemented

- ✅ Basic component architecture with Context providers
- ✅ Game state management with useReducer
- ✅ Audio context for TTS and sound effects
- ✅ Responsive design with Tailwind CSS
- ✅ Start screen and basic game flow
- ✅ Progress tracking and localStorage integration

## Features Not Yet Implemented (from original app)

- ❌ All 12 game levels with complete content
- ❌ Master mode modal and level selection
- ❌ Complete question generation algorithm
- ❌ All modal dialogs (level up, end game, resume)
- ❌ Advanced audio features and voice selection
- ❌ Level progression and scoring logic

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Architecture Overview

### Context Providers
- `GameProvider`: Manages game state, levels, scoring
- `AudioProvider`: Handles TTS, sound effects, audio initialization

### Components
- `StartScreen`: Landing page with start button
- `GameScreen`: Main game interface
- `ProgressBar`: Visual progress indicator
- `TargetDisplay`: Shows letter/syllable/word to identify
- `OptionsGrid`: Multiple choice buttons
- `FeedbackDisplay`: Shows correct/incorrect feedback
- `ScoreDisplay`: Shows current score

### Key Features
- Component-based architecture for maintainability
- Context-based state management
- Responsive design optimized for mobile
- Accessibility features maintained
- Performance optimized with Preact (3KB runtime)

## Bundle Size Comparison

- **Original**: ~54KB HTML + CDN dependencies
- **Preact Version**: Estimated ~20-25KB total bundle
- **Performance**: Improved rendering with Virtual DOM
- **Maintainability**: Significantly improved with component architecture

This demo proves the feasibility of the Preact migration and showcases the improved code organization and developer experience.