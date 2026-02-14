# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nephilim Wars is a React-based tabletop RPG companion application featuring character creation, tactical combat, 3D dice rolling, bestiary management, and an AI-powered lore oracle. The app includes a RAG-enabled "Scribe" assistant powered by Cloudflare Workers AI.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # Run ESLint
npm run ingest    # Ingest knowledge base for the Scribe AI
```

## Architecture

### Frontend Stack
- **React 19** with Vite (rolldown-vite)
- **Tailwind CSS** with custom theme (parchment, gold, crimson colors; Cinzel/EB Garamond fonts)
- **React Three Fiber** for 3D components (Tabernacle viewer)
- **Babylon.js** for 3D dice physics (dice-box-main library)

### Key Directory Structure
```
src/
  pages/          # Main screen components (CharacterGenerator, CombatScreen, BestiaryScreen)
  components/     # Reusable UI components (DiceRollerModal, CharacterSheet, ActionDeck)
  hooks/          # Custom hooks (useCombatEngine, useScribeTTS)
  utils/          # Game logic (combatRules, storage, validation)
  types/          # Type definitions (combatTypes.js)

public/
  DiceRoller/     # 3D dice roller (dice-box-main library)
  encyclopedia/    # Static lore HTML pages
  archaeology/    # Archaeological evidence pages
  rules/          # Combat rules HTML
  humble-tabernacle/ # Religious content
  data/           # JSON data (bestiary.json, creatures.json)

functions/        # Cloudflare Workers for AI features
  scribe.js       # RAG-enabled AI assistant
  oracle.js       # Rules oracle AI
```

### State Management
- React useState/useReducer for local state
- localStorage via `src/utils/storage.js` for character persistence
- Combat state managed in `src/hooks/useCombatEngine.jsx`

### Data Files
- `public/data/bestiary.json` - Monster statistics
- `public/data/creatures.json` - Creature definitions
- `public/data/combat-bestiary.json` - Combat-optimized creature data

### External Integrations
- **Hugging Face API** - Text generation via `/api-hf` proxy
- **Cloudflare Workers AI** - Scribe chat with Vectorize RAG
- **Kokoro TTS** - Text-to-speech for the Scribe voice

### Theming
Custom Tailwind theme in `tailwind.config.js`:
- Colors: `parchment-*`, `gold-*`, `crimson`, `sacred-blue`
- Fonts: `cinzel`, `garamond`, `unifraktur`
