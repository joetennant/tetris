# Implementation Plan: Tetris Clone Game

**Branch**: `001-tetris-clone` | **Date**: 2025-12-16 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-tetris-clone/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build a Tetris clone game following the official Tetris Guideline specifications. The game will be implemented as a React/TypeScript web application using Vite for build tooling. Core features include: 7 standard tetrominoes with proper colors, 10x20 playfield with buffer zone, Super Rotation System (SRS) for piece rotation and wall kicks, 7-bag randomizer for fair piece distribution, ghost piece preview, hold functionality, progressive difficulty scaling, and standard scoring system. The implementation will prioritize 60 FPS smooth gameplay with responsive controls (<50ms input latency).

## Technical Context

**Language/Version**: TypeScript 5.9.3  
**Primary Dependencies**: React 19.2.0, Vite 7.2.4  
**Storage**: N/A (in-memory game state; localStorage for optional high scores)  
**Testing**: Vitest + React Testing Library + jsdom (native Vite integration)  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge - ES2020+)
**Project Type**: Web application (single-page game)  
**Performance Goals**: 60 FPS rendering, <50ms input response, <500ms line clear animation  
**Constraints**: Client-side only (no backend), keyboard-only input initially, must maintain 60 FPS even at high speeds  
**Scale/Scope**: Single-player game, ~2000-3000 LOC estimated, 1 main game screen + UI overlays

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Initial Check (Pre-Phase 0)**: ✅ PASSED  
No constitution file found - proceeding with standard best practices.

**Post-Phase 1 Check**: ✅ PASSED

**Design Principles Applied**:
- ✅ **Separation of Concerns**: Game logic (`game/`) is framework-agnostic and independently testable
- ✅ **Type Safety**: Complete TypeScript type definitions in contracts
- ✅ **Testing Strategy**: Vitest + React Testing Library configured for unit and integration tests
- ✅ **Component Architecture**: Clear hierarchy with single responsibility
- ✅ **Performance**: 60 FPS target with optimized game loop using requestAnimationFrame
- ✅ **Maintainability**: Modular structure following documented architecture patterns

**Complexity Justification**: N/A - No constitutional violations

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
my-app/                          # Existing Vite + React application
├── src/
│   ├── components/              # React UI components
│   │   ├── Game.tsx            # Main game container component
│   │   ├── Playfield.tsx       # Game board rendering
│   │   ├── Tetromino.tsx       # Piece rendering component
│   │   ├── GhostPiece.tsx      # Ghost piece overlay
│   │   ├── NextPiece.tsx       # Next piece preview
│   │   ├── HoldPiece.tsx       # Hold area display
│   │   ├── ScorePanel.tsx      # Score, level, lines display
│   │   └── GameOverlay.tsx     # Pause, game over screens
│   │
│   ├── game/                    # Core game logic (framework-agnostic)
│   │   ├── types.ts            # TypeScript interfaces and types
│   │   ├── constants.ts        # Game constants (colors, dimensions, scoring)
│   │   ├── tetrominoes.ts      # Tetromino shapes and rotations (SRS)
│   │   ├── GameState.ts        # Game state management class
│   │   ├── Playfield.ts        # Playfield logic (collision, line clearing)
│   │   ├── TetrominoController.ts  # Piece movement and rotation logic
│   │   ├── Randomizer.ts       # 7-bag randomizer implementation
│   │   └── ScoreManager.ts     # Scoring and level progression
│   │
│   ├── hooks/                   # React custom hooks
│   │   ├── useGameLoop.ts      # Game loop with requestAnimationFrame
│   │   ├── useKeyboard.ts      # Keyboard input handling
│   │   └── useGameState.ts     # Game state management hook
│   │
│   ├── utils/                   # Utility functions
│   │   └── srs.ts              # Super Rotation System wall kick data
│   │
│   ├── App.tsx                  # Root application component
│   └── main.tsx                 # Application entry point
│
└── tests/                       # Test files
    ├── unit/                    # Unit tests for game logic
    │   ├── Randomizer.test.ts
    │   ├── Playfield.test.ts
    │   ├── TetrominoController.test.ts
    │   └── ScoreManager.test.ts
    │
    └── integration/             # Integration tests
        └── GameState.test.ts
```

**Structure Decision**: Using the existing `my-app/` Vite + React project structure. Game logic is separated into a framework-agnostic `game/` directory to enable testability and potential future reuse. React components in `components/` handle rendering and user interaction. Custom hooks in `hooks/` manage the game loop, input handling, and state integration with React.

## Complexity Tracking

> **No constitution violations - this section is not applicable**
