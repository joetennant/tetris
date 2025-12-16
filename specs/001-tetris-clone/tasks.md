# Tasks: Tetris Clone Game

**Input**: Design documents from `/specs/001-tetris-clone/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: This feature specification emphasizes testability. Unit tests are included for core game logic to ensure correctness of algorithms (SRS, 7-bag, collision detection).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `- [ ] [ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

All paths relative to `my-app/` directory:
- Game logic: `src/game/`
- React components: `src/components/`
- Custom hooks: `src/hooks/`
- Tests: `tests/unit/`, `tests/integration/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and testing framework setup

- [ ] T001 Install Vitest and testing dependencies: `npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom`
- [ ] T002 Update vite.config.ts with test configuration (globals: true, environment: jsdom, setupFiles)
- [ ] T003 [P] Create src/setupTests.ts with jest-dom matchers
- [ ] T004 [P] Update tsconfig.json to include vitest/globals and @testing-library/jest-dom types
- [ ] T005 [P] Add test scripts to package.json: test, test:ui, test:coverage
- [ ] T006 [P] Create src/game/ directory for core game logic
- [ ] T007 [P] Create src/components/ directory for React components
- [ ] T008 [P] Create src/hooks/ directory for custom hooks
- [ ] T009 [P] Create tests/unit/ directory for unit tests
- [ ] T010 [P] Create tests/integration/ directory for integration tests

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core type definitions and constants that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T011 [P] Copy contracts/types.ts to src/game/types.ts (TypeScript interfaces and enums)
- [ ] T012 [P] Copy contracts/constants.ts to src/game/constants.ts (tetromino shapes, colors, SRS wall kicks)
- [ ] T013 Create src/game/tetrominoes.ts with tetromino factory functions using constants
- [ ] T014 Verify all type imports resolve correctly across game/ directory

**Checkpoint**: Foundation ready - type system established, user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Basic Tetromino Gameplay (Priority: P1) 🎯 MVP

**Goal**: Deliver core Tetris gameplay - pieces spawn, move, rotate with SRS, lock, clear lines, and detect game over

**Independent Test**: Start game → piece falls → move left/right → rotate → hard drop → line clears → game continues until game over

### Unit Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [ ] T015 [P] [US1] Create tests/unit/Randomizer.test.ts with basic randomizer initialization test
- [ ] T016 [P] [US1] Create tests/unit/Playfield.test.ts with empty grid initialization test
- [ ] T017 [P] [US1] Create tests/unit/TetrominoController.test.ts with basic collision detection test
- [ ] T018 [P] [US1] Add test in Randomizer.test.ts: verify all 7 pieces appear once per 7 draws (7-bag fairness)
- [ ] T019 [P] [US1] Add test in Playfield.test.ts: collision detection with bottom boundary
- [ ] T020 [P] [US1] Add test in Playfield.test.ts: collision detection with side walls
- [ ] T021 [P] [US1] Add test in Playfield.test.ts: collision detection with locked pieces
- [ ] T022 [P] [US1] Add test in Playfield.test.ts: detect single completed line
- [ ] T023 [P] [US1] Add test in Playfield.test.ts: detect multiple completed lines simultaneously
- [ ] T024 [P] [US1] Add test in Playfield.test.ts: clear lines and collapse rows correctly
- [ ] T025 [P] [US1] Add test in TetrominoController.test.ts: SRS rotation with no obstacles
- [ ] T026 [P] [US1] Add test in TetrominoController.test.ts: SRS wall kick sequence (attempt all 5 offsets)
- [ ] T027 [P] [US1] Add test in TetrominoController.test.ts: I-piece uses unique kick table
- [ ] T028 [P] [US1] Add test in TetrominoController.test.ts: O-piece rotation is no-op (symmetrical)

### Implementation for User Story 1

**Core Game Logic (Framework-Agnostic)**

- [ ] T029 [P] [US1] Implement src/game/Randomizer.ts: SevenBagRandomizer class with Fisher-Yates shuffle
- [ ] T030 [P] [US1] Implement src/game/Playfield.ts: initialize 40x10 grid with Cell objects
- [ ] T031 [US1] Add Playfield.isValidPosition(tetromino, position): collision detection algorithm
- [ ] T032 [US1] Add Playfield.lockPiece(tetromino): transfer piece blocks to grid cells
- [ ] T033 [US1] Add Playfield.detectCompletedLines(): scan grid for full rows, return indices
- [ ] T034 [US1] Add Playfield.clearLines(rowIndices): remove rows and shift down
- [ ] T035 [US1] Add Playfield.isGameOver(): check if spawn position is blocked
- [ ] T036 [P] [US1] Implement src/game/TetrominoController.ts: constructor with playfield reference
- [ ] T037 [US1] Add TetrominoController.rotate(tetromino, direction): apply SRS with wall kick attempts
- [ ] T038 [US1] Add TetrominoController.move(tetromino, dx, dy): translate position with collision check
- [ ] T039 [US1] Add TetrominoController.hardDrop(tetromino): drop to lowest valid position instantly
- [ ] T040 [US1] Implement src/game/GameState.ts: GameStateManager class with initial state setup
- [ ] T041 [US1] Add GameState.spawnPiece(): get piece from randomizer, place at spawn position
- [ ] T042 [US1] Add GameState.update(deltaTime): handle automatic falling based on fallSpeed
- [ ] T043 [US1] Add GameState.handleLockDelay(deltaTime): manage lock timer and reset counter
- [ ] T044 [US1] Add GameState.lockCurrentPiece(): lock piece, check lines, spawn next, handle game over
- [ ] T045 [US1] Add GameState.handleInput(input): process player input commands (move, rotate, drop)
- [ ] T046 [US1] Add GameState.start(): initialize new game state
- [ ] T047 [US1] Add GameState.pause/resume(): toggle game status

**React Integration**

- [ ] T048 [P] [US1] Implement src/hooks/useGameLoop.ts: custom hook with requestAnimationFrame
- [ ] T049 [P] [US1] Implement src/hooks/useKeyboard.ts: track key press/release state
- [ ] T050 [US1] Implement src/hooks/useGameState.ts: wrap GameStateManager, expose state and control functions
- [ ] T051 [US1] Create src/components/Playfield.tsx: render 10x20 grid using CSS Grid layout
- [ ] T052 [US1] Create src/components/Tetromino.tsx: render tetromino blocks at position
- [ ] T053 [US1] Add ScorePanel.tsx basic structure: display score, level, lines cleared
- [ ] T054 [US1] Create src/components/GameOverlay.tsx: show pause and game over states
- [ ] T055 [US1] Create src/components/Game.tsx: main container integrating all components
- [ ] T056 [US1] Update src/App.tsx: render Game component
- [ ] T057 [US1] Add CSS styling for playfield grid and tetromino blocks with colors from constants
- [ ] T058 [US1] Wire keyboard input to GameState.handleInput() in Game component
- [ ] T059 [US1] Wire game loop to GameState.update() in Game component
- [ ] T060 [US1] Test automatic piece falling at correct speed

**Integration Test**

- [ ] T061 [US1] Create tests/integration/GameState.test.ts: full game cycle (spawn → move → lock → clear → spawn)

**Checkpoint**: At this point, User Story 1 should be fully functional - playable Tetris with core mechanics

---

## Phase 4: User Story 2 - Visual Guidance and Preview (Priority: P2)

**Goal**: Add ghost piece preview and next piece display for better strategic gameplay

**Independent Test**: Play game → ghost piece appears below current piece → next piece visible in preview area → preview updates on piece lock

### Implementation for User Story 2

- [ ] T062 [P] [US2] Add TetrominoController.calculateGhostPosition(tetromino): drop until collision, return position
- [ ] T063 [P] [US2] Create src/components/GhostPiece.tsx: render translucent tetromino at ghost position
- [ ] T064 [P] [US2] Create src/components/NextPiece.tsx: render next piece preview with matrix
- [ ] T065 [US2] Update GameState to maintain nextPieces queue (at least 1 piece)
- [ ] T066 [US2] Integrate GhostPiece component in Playfield.tsx using ghost position calculation
- [ ] T067 [US2] Integrate NextPiece component in Game.tsx showing first piece from queue
- [ ] T068 [US2] Add CSS styling for ghost piece (50% opacity, outlined blocks)
- [ ] T069 [US2] Add CSS styling for next piece preview area
- [ ] T070 [US2] Test ghost piece updates in real-time as current piece moves/rotates
- [ ] T071 [US2] Test next piece preview updates when piece locks

**Checkpoint**: At this point, User Stories 1 AND 2 work - core gameplay with visual guidance

---

## Phase 5: User Story 3 - Hold Functionality (Priority: P3)

**Goal**: Enable hold/swap mechanic for strategic piece management

**Independent Test**: Press hold key → current piece moves to hold area → next piece spawns. Press hold again → pieces swap. Verify one hold per piece limit.

### Unit Tests for User Story 3

- [ ] T072 [P] [US3] Add test in tests/unit/GameState.test.ts: hold with empty hold area stores piece and spawns next
- [ ] T073 [P] [US3] Add test in tests/unit/GameState.test.ts: hold with existing piece swaps correctly
- [ ] T074 [P] [US3] Add test in tests/unit/GameState.test.ts: second hold before lock is blocked (canHold flag)

### Implementation for User Story 3

- [ ] T075 [US3] Add GameState.handleHold(): implement hold/swap logic with canHold flag enforcement
- [ ] T076 [US3] Update GameState.lockCurrentPiece(): reset canHold flag to true on lock
- [ ] T077 [US3] Add Input.HOLD case in GameState.handleInput()
- [ ] T078 [P] [US3] Create src/components/HoldPiece.tsx: render held piece in dedicated area
- [ ] T079 [US3] Integrate HoldPiece component in Game.tsx
- [ ] T080 [US3] Add CSS styling for hold area (similar to next piece preview)
- [ ] T081 [US3] Wire hold key (C/Shift) to hold action in keyboard handler
- [ ] T082 [US3] Test hold with empty area
- [ ] T083 [US3] Test swap with existing piece
- [ ] T084 [US3] Test one hold per piece enforcement

**Checkpoint**: All core gameplay features complete (US1 + US2 + US3)

---

## Phase 6: User Story 4 - Progressive Difficulty and Scoring (Priority: P4)

**Goal**: Add scoring system and level progression with increasing speed

**Independent Test**: Clear lines → score increases based on line count → level increases every 10 lines → piece fall speed increases

### Unit Tests for User Story 4

- [ ] T085 [P] [US4] Create tests/unit/ScoreManager.test.ts: single line awards 100 × level points
- [ ] T086 [P] [US4] Add test in ScoreManager.test.ts: double (2 lines) awards 300 × level points
- [ ] T087 [P] [US4] Add test in ScoreManager.test.ts: triple (3 lines) awards 500 × level points
- [ ] T088 [P] [US4] Add test in ScoreManager.test.ts: Tetris (4 lines) awards 800 × level points
- [ ] T089 [P] [US4] Add test in ScoreManager.test.ts: soft drop awards 1 point per cell
- [ ] T090 [P] [US4] Add test in ScoreManager.test.ts: hard drop awards 2 points per cell
- [ ] T091 [P] [US4] Add test in ScoreManager.test.ts: level increases at 10, 20, 30 lines cleared
- [ ] T092 [P] [US4] Add test in ScoreManager.test.ts: fall speed decreases by 10% per level

### Implementation for User Story 4

- [ ] T093 [P] [US4] Implement src/game/ScoreManager.ts: ScoreManager class with scoring formulas
- [ ] T094 [US4] Add ScoreManager.calculateLineScore(linesCleared, level): apply scoring table
- [ ] T095 [US4] Add ScoreManager.calculateDropScore(distance, isHardDrop): calculate drop points
- [ ] T096 [US4] Add ScoreManager.calculateFallSpeed(level): apply speed formula
- [ ] T097 [US4] Add ScoreManager.shouldLevelUp(linesCleared, currentLevel): check 10-line threshold
- [ ] T098 [US4] Integrate ScoreManager in GameState constructor
- [ ] T099 [US4] Update GameState.lockCurrentPiece(): award line clear score after clearing
- [ ] T100 [US4] Update GameState.hardDrop(): award drop bonus points
- [ ] T101 [US4] Update GameState: check and apply level up after line clear
- [ ] T102 [US4] Update GameState: recalculate fallSpeed when level increases
- [ ] T103 [US4] Update ScorePanel.tsx: display score, level, lines with real-time updates
- [ ] T104 [US4] Add CSS styling for score panel with clear labels
- [ ] T105 [US4] Test single line clear scoring
- [ ] T106 [US4] Test Tetris (4 lines) bonus scoring
- [ ] T107 [US4] Test level progression at 10 lines
- [ ] T108 [US4] Test fall speed increase on level up

**Checkpoint**: Complete progression system - scoring and increasing difficulty

---

## Phase 7: User Story 5 - Standard Piece Generation (Priority: P5)

**Goal**: Replace any placeholder randomization with official 7-bag algorithm

**Independent Test**: Track 14+ consecutive pieces → verify each 7-piece cycle contains all shapes exactly once

### Implementation for User Story 5

- [ ] T109 [US5] Verify Randomizer.ts implements Fisher-Yates shuffle correctly (should already be done in T029)
- [ ] T110 [US5] Verify GameState uses Randomizer for all piece generation (should already be done)
- [ ] T111 [US5] Run existing Randomizer.test.ts: confirm 7-bag fairness test passes
- [ ] T112 [US5] Manual test: play game for 20+ pieces, track sequence, verify no piece appears twice before all 7 appear

**Checkpoint**: All user stories complete - full feature set implemented

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T113 [P] Add keyboard control reference overlay (show controls on screen)
- [ ] T114 [P] Add smooth line clear animation in Playfield.tsx
- [ ] T115 [P] Add piece lock animation (flash before locking)
- [ ] T116 [P] Optimize rendering: use React.memo for pure components
- [ ] T117 [P] Add responsive design CSS for different screen sizes
- [ ] T118 [P] Add proper TypeScript strict mode and resolve any type issues
- [ ] T119 Test game at high speeds (level 10+) and verify 60 FPS maintained
- [ ] T120 Run full test suite: `npm test` and ensure all tests pass
- [ ] T121 Generate test coverage report: `npm run test:coverage` and review
- [ ] T122 [P] Update README.md with game controls and build instructions
- [ ] T123 [P] Add inline code comments for complex algorithms (SRS wall kicks, 7-bag)
- [ ] T124 Validate against quickstart.md implementation steps
- [ ] T125 Final playtest: verify all acceptance scenarios from spec.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed) OR
  - Sequentially in priority order: US1 → US2 → US3 → US4 → US5
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational - No dependencies on other stories ✅ MVP
- **User Story 2 (P2)**: Can start after Foundational - Independent (adds visual features to US1)
- **User Story 3 (P3)**: Can start after Foundational - Independent (adds hold mechanic to US1)
- **User Story 4 (P4)**: Can start after Foundational - Independent (adds scoring to US1)
- **User Story 5 (P5)**: Likely already implemented in US1 (Randomizer.ts) - validation only

### Within Each User Story

1. Tests FIRST (write and verify they FAIL)
2. Core game logic implementation (framework-agnostic classes)
3. React integration (components and hooks)
4. CSS styling
5. Manual testing and validation
6. Integration tests (if applicable)

### Parallel Opportunities

- **Setup Phase**: All tasks marked [P] can run in parallel (T003-T010)
- **Foundational Phase**: T011 and T012 can run in parallel
- **User Story 1 Tests**: All unit tests (T015-T028) can run in parallel
- **User Story 1 Implementation**: 
  - T029 (Randomizer), T030 (Playfield), T036 (TetrominoController) can start in parallel
  - T048 (useGameLoop), T049 (useKeyboard) can run in parallel
  - Component creation (T051-T055) can run in parallel after game logic is ready
- **User Story 2**: T062-T064 can run in parallel
- **User Story 4 Tests**: All ScoreManager tests (T085-T092) can run in parallel
- **Polish Phase**: Most tasks marked [P] can run in parallel (T113-T118, T122-T123)

**Across User Stories**: Once Foundational is complete, different developers can work on US1, US2, US3, US4 in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all unit tests together (write tests first):
npm test -- Randomizer.test.ts &
npm test -- Playfield.test.ts &
npm test -- TetrominoController.test.ts &

# Implement core classes in parallel:
# Developer A: Randomizer.ts
# Developer B: Playfield.ts
# Developer C: TetrominoController.ts

# Create React components in parallel:
# Developer D: Playfield.tsx
# Developer E: Tetromino.tsx
# Developer F: ScorePanel.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T010)
2. Complete Phase 2: Foundational (T011-T014) - CRITICAL GATE
3. Complete Phase 3: User Story 1 (T015-T061)
4. **STOP and VALIDATE**: Play the game - verify core mechanics work
5. Deploy/demo minimal playable Tetris

**MVP Scope**: Pieces fall, rotate with SRS, move left/right, hard drop, lines clear, game over detection. This is a complete, playable Tetris game.

### Incremental Delivery

1. **Foundation** (Setup + Foundational) → Type system established
2. **MVP** (+ User Story 1) → Playable Tetris → Deploy
3. **Enhanced** (+ User Story 2) → Ghost piece + preview → Deploy
4. **Strategic** (+ User Story 3) → Hold functionality → Deploy
5. **Progression** (+ User Story 4) → Scoring + levels → Deploy
6. **Validated** (+ User Story 5) → 7-bag verified → Deploy
7. **Polished** (+ Phase 8) → Final release

Each increment adds value without breaking previous functionality.

### Parallel Team Strategy

With 3+ developers after Foundational phase:

- **Developer A**: User Story 1 (core gameplay)
- **Developer B**: User Story 2 (visual guidance) - can start in parallel with A
- **Developer C**: User Story 4 (scoring) - can start in parallel with A
- **Developer D**: User Story 3 (hold) - can start after A has basic GameState

Stories integrate independently into the game.

---

## Task Summary

- **Total Tasks**: 125 tasks
- **Phase 1 (Setup)**: 10 tasks
- **Phase 2 (Foundational)**: 4 tasks (BLOCKING)
- **Phase 3 (US1 - Basic Gameplay)**: 47 tasks (includes 14 unit tests + 1 integration test)
- **Phase 4 (US2 - Visual Guidance)**: 10 tasks
- **Phase 5 (US3 - Hold)**: 13 tasks (includes 3 unit tests)
- **Phase 6 (US4 - Scoring)**: 16 tasks (includes 8 unit tests)
- **Phase 7 (US5 - 7-Bag Validation)**: 4 tasks
- **Phase 8 (Polish)**: 13 tasks

**Parallel Opportunities**: 42 tasks marked [P] can run concurrently with other tasks

**MVP Estimate**: ~64 tasks (Setup + Foundational + US1) delivers playable Tetris

---

## Notes

- All tasks follow strict checklist format: `- [ ] [ID] [P?] [Story] Description with file path`
- Tests are included for critical game logic (collision, SRS, scoring, 7-bag fairness)
- Each user story is independently testable and deliverable
- Framework-agnostic game logic enables comprehensive unit testing
- React components are thin wrappers around game logic
- Commit after each logical task group or checkpoint
- Run tests frequently during development: `npm test -- --watch`
- Use `npm run dev` for live development server
- MVP (User Story 1) is the recommended first target - complete, playable Tetris
