# Feature Specification: Tetris Clone Game

**Feature Branch**: `001-tetris-clone`  
**Created**: 2025-12-16  
**Status**: Draft  
**Input**: User description: "Build a tetris clone. Refer to the game specifications here: https://tetris.wiki/Tetris_Guideline"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Basic Tetromino Gameplay (Priority: P1)

A player starts a new game and manipulates falling tetromino pieces (7 distinct shapes) within a 10-column by 20-row playfield. The player rotates pieces, moves them left/right, and drops them to build complete horizontal lines. When a line is completed, it clears from the playfield. The game ends when pieces stack to the top of the visible playfield.

**Why this priority**: This is the core mechanic of Tetris - without piece manipulation and line clearing, there is no game. This forms the minimum viable experience.

**Independent Test**: Can be fully tested by starting a game, receiving falling pieces, moving/rotating them, and completing at least one line clear. Delivers the fundamental Tetris gameplay experience.

**Acceptance Scenarios**:

1. **Given** a new game is started, **When** the game begins, **Then** a tetromino appears at the top center of the playfield and begins falling at a steady rate
2. **Given** a tetromino is falling, **When** the player presses left or right controls, **Then** the piece moves one column in that direction (if space is available)
3. **Given** a tetromino is falling, **When** the player presses the rotate control, **Then** the piece rotates 90 degrees clockwise following Super Rotation System rules
4. **Given** a tetromino is falling, **When** the player presses soft drop, **Then** the piece falls faster until it locks on the surface
5. **Given** a tetromino is falling, **When** the player presses hard drop, **Then** the piece instantly drops to the lowest available position and locks immediately
6. **Given** pieces have created a complete horizontal line, **When** the line completes, **Then** that line disappears and all rows above shift down by one
7. **Given** pieces are stacked, **When** any piece locks with part of it above row 20, **Then** the game ends

---

### User Story 2 - Visual Guidance and Preview (Priority: P2)

A player sees a ghost piece showing where the current tetromino will land and can view the next piece(s) coming up. This allows strategic planning and reduces trial-and-error gameplay.

**Why this priority**: Essential for modern Tetris playability and player satisfaction. Without preview capabilities, the game becomes frustrating rather than strategic.

**Independent Test**: Can be tested by playing a game and observing that ghost pieces appear, and the next piece preview updates correctly. Delivers enhanced gameplay experience independent of scoring or advanced features.

**Acceptance Scenarios**:

1. **Given** a tetromino is falling, **When** the piece is in any position, **Then** a translucent ghost piece appears at the lowest position the piece would occupy if hard-dropped
2. **Given** the game is running, **When** at any moment, **Then** the next piece to spawn is visible in a preview area
3. **Given** a piece locks into place, **When** the next piece spawns, **Then** the preview area updates to show the subsequent upcoming piece

---

### User Story 3 - Hold Functionality (Priority: P3)

A player can hold the current falling tetromino and swap it with the piece in the hold area (or place it there if empty). This enables strategic gameplay by saving pieces for optimal placement.

**Why this priority**: Adds strategic depth and is part of modern Tetris guidelines, but the core game is playable without it.

**Independent Test**: Can be tested by pressing the hold button during gameplay and verifying pieces swap correctly. Delivers advanced strategy capability independently.

**Acceptance Scenarios**:

1. **Given** a tetromino is falling and hold area is empty, **When** the player presses hold, **Then** the current piece moves to hold area and the next piece spawns
2. **Given** a tetromino is falling and hold area contains a piece, **When** the player presses hold, **Then** the current piece and held piece swap positions
3. **Given** a piece was just swapped from hold, **When** the player presses hold again before the piece locks, **Then** nothing happens (one hold per piece)

---

### User Story 4 - Progressive Difficulty and Scoring (Priority: P4)

As the player clears lines, the game speed increases gradually, making the game progressively more challenging. The player earns points based on lines cleared, with bonus points for clearing multiple lines simultaneously.

**Why this priority**: Provides long-term engagement and replayability, but the core tetromino mechanics work without scoring.

**Independent Test**: Can be tested by clearing lines and verifying speed increases and score calculations are correct. Delivers progression system independently.

**Acceptance Scenarios**:

1. **Given** the game starts at level 1, **When** the player clears 10 lines, **Then** the level increases and pieces fall faster
2. **Given** a player clears one line, **When** the line clears, **Then** base points are awarded
3. **Given** a player clears four lines simultaneously, **When** the lines clear, **Then** bonus points are awarded (Tetris bonus)
4. **Given** the game is in progress, **When** at any time, **Then** current score, level, and lines cleared are displayed

---

### User Story 5 - Standard Piece Generation (Priority: P5)

The game uses the 7-bag randomizer system, ensuring each of the seven tetromino shapes appears exactly once before any shape repeats. This provides fair and predictable piece distribution.

**Why this priority**: Improves fairness and reduces frustrating droughts, but basic random generation would still create a playable game.

**Independent Test**: Can be tested by tracking piece sequences over 14+ pieces and verifying each shape appears once per 7-piece cycle. Delivers fair randomization independently.

**Acceptance Scenarios**:

1. **Given** a new game starts, **When** 7 pieces spawn, **Then** all 7 unique tetromino shapes appear exactly once
2. **Given** 7 pieces have spawned, **When** the next 7 pieces spawn, **Then** again all 7 shapes appear exactly once

---

### Edge Cases

- What happens when a player attempts to rotate a piece against a wall or other pieces? (Wall kicks should apply per Super Rotation System)
- What happens when a player attempts to move a piece outside the playfield boundaries? (Movement should be blocked)
- What happens when multiple lines are cleared simultaneously at the top of the playfield? (All completed lines clear, rows above collapse down)
- What happens if a piece spawns but immediately collides with existing pieces? (Game over condition)
- What happens when soft drop is held while piece is already at the bottom? (Piece locks according to lock delay rules)
- What happens when a player presses multiple movement keys simultaneously? (Most recent input takes priority, or inputs queue appropriately)

## Requirements *(mandatory)*

### Functional Requirements

#### Playfield & Display
- **FR-001**: Game MUST provide a playfield that is 10 columns wide and 20 rows tall (visible area)
- **FR-002**: Game MUST provide a buffer zone above row 20 for piece spawning and manipulation
- **FR-003**: Game MUST display the current score, level, and lines cleared count
- **FR-004**: Game MUST display the next piece preview
- **FR-005**: Game MUST display a hold area showing the held piece (if any)
- **FR-006**: Game MUST display a ghost piece showing where the current piece will land

#### Tetrominoes
- **FR-007**: Game MUST implement all seven standard tetromino shapes: I, O, T, S, Z, J, L
- **FR-008**: Each tetromino MUST display in its standard color: I-cyan, O-yellow, T-purple, S-green, Z-red, J-blue, L-orange
- **FR-009**: Tetrominoes MUST spawn horizontally centered (rounded left if needed) at rows 21-22
- **FR-010**: Tetrominoes MUST spawn with flat side down (J, L, T spawn flat-side first)
- **FR-011**: Game MUST use 7-bag randomizer: all 7 pieces appear once before any repeat

#### Piece Movement & Rotation
- **FR-012**: Players MUST be able to move pieces left and right one column at a time
- **FR-013**: Players MUST be able to rotate pieces 90 degrees clockwise
- **FR-014**: Players MUST be able to rotate pieces 90 degrees counter-clockwise
- **FR-015**: Game MUST implement Super Rotation System (SRS) for rotation and wall kicks
- **FR-016**: Pieces MUST NOT move beyond playfield boundaries (columns 1-10)
- **FR-017**: Pieces MUST NOT move through locked pieces

#### Piece Dropping
- **FR-018**: Pieces MUST automatically fall downward at a rate determined by current level
- **FR-019**: Players MUST be able to soft drop (accelerate downward movement)
- **FR-020**: Players MUST be able to hard drop (instantly drop to lowest position and lock immediately)
- **FR-021**: Pieces MUST lock into place after landing and a brief lock delay period
- **FR-022**: Lock delay MUST reset when piece successfully moves or rotates (up to a maximum number of resets)

#### Hold Functionality
- **FR-023**: Players MUST be able to hold the current piece and swap with held piece
- **FR-024**: Players MUST be limited to one hold action per piece (until piece locks)
- **FR-025**: When hold area is empty, held piece MUST be stored and next piece spawns
- **FR-026**: When hold area contains a piece, current and held pieces MUST swap

#### Line Clearing
- **FR-027**: Game MUST detect when a horizontal row is completely filled
- **FR-028**: Game MUST clear all completed rows simultaneously
- **FR-029**: Game MUST collapse rows above cleared lines downward
- **FR-030**: Game MUST award points for cleared lines
- **FR-031**: Game MUST award bonus points for clearing 4 lines simultaneously (Tetris)

#### Game Progression
- **FR-032**: Game MUST start at level 1
- **FR-033**: Game MUST increase level after every 10 lines cleared
- **FR-034**: Piece fall speed MUST increase with each level increase
- **FR-035**: Game MUST track total lines cleared across all levels

#### Game States
- **FR-036**: Game MUST provide a start/new game function
- **FR-037**: Game MUST provide a pause function that freezes gameplay
- **FR-038**: Game MUST detect game over condition when a piece locks with part above row 20
- **FR-039**: Game MUST display game over state and final score
- **FR-040**: Players MUST be able to restart after game over

#### Controls
- **FR-041**: Game MUST respond to left movement input
- **FR-042**: Game MUST respond to right movement input
- **FR-043**: Game MUST respond to soft drop input
- **FR-044**: Game MUST respond to hard drop input
- **FR-045**: Game MUST respond to clockwise rotation input
- **FR-046**: Game MUST respond to counter-clockwise rotation input
- **FR-047**: Game MUST respond to hold input
- **FR-048**: Game MUST respond to pause input

### Key Entities

- **Tetromino**: A game piece made of 4 connected blocks in one of 7 shapes (I, O, T, S, Z, J, L). Has shape type, rotation state, position (row, column), and color. Can be in falling, locked, held, or preview state.

- **Playfield**: The game board consisting of a 10x20 grid of cells plus buffer rows above. Each cell can be empty or occupied by a locked block. Tracks all locked pieces.

- **Game State**: The current state of the game including active piece, held piece, next piece queue, score, level, lines cleared, and game status (playing, paused, game over).

- **Block**: The individual unit that makes up tetrominoes. Has position and color. Four blocks form one tetromino.

- **Line**: A horizontal row in the playfield. Can be complete (all 10 cells filled) or incomplete. Complete lines are cleared.

- **Score**: Cumulative points earned through line clears. Calculated based on number of lines cleared simultaneously and current level.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Players can start a new game and see the first tetromino piece appear within 1 second
- **SC-002**: Piece movement (left, right, rotate) responds to player input within 50 milliseconds
- **SC-003**: Game maintains smooth visual updates at 60 frames per second during active gameplay
- **SC-004**: Line clearing animation completes and rows collapse within 500 milliseconds
- **SC-005**: Players can successfully complete at least 10 line clears in a single game session
- **SC-006**: All seven tetromino shapes appear at least once within any 7-piece sequence (7-bag verification)
- **SC-007**: Ghost piece position updates instantly (same frame) when active piece moves
- **SC-008**: Game correctly ends when pieces stack above row 20
- **SC-009**: Hold function successfully swaps pieces 100% of the time when allowed
- **SC-010**: Rotation system allows T-spin maneuvers through proper wall kick implementation
- **SC-011**: Players can pause and resume game without loss of game state
- **SC-012**: Score calculation accurately awards points based on line clear type (single, double, triple, Tetris)

## Assumptions

- **Single Player**: Game is designed for single-player experience (no multiplayer or competitive modes)
- **Platform**: Game will run in a standard browser or desktop environment with keyboard input
- **Input Device**: Primary input is keyboard; no touch or gamepad support required initially
- **Scoring System**: Standard Tetris scoring formula: Single=100, Double=300, Triple=500, Tetris=800 points × level
- **Level Progression**: Level increases every 10 lines cleared, following classic Tetris progression
- **Fall Speed**: Base fall speed at level 1 is approximately 1 row per second, increasing by 10% per level
- **Lock Delay**: Pieces have approximately 500ms lock delay after landing, resettable up to 15 times
- **Preview Pieces**: Game shows at least 1 next piece; showing 3-6 next pieces is recommended but not required
- **Visual Style**: Game uses distinct colored blocks for each tetromino type; specific visual polish is implementation-dependent
- **Audio**: Background music and sound effects are optional and not part of core requirements
- **Persistence**: High scores and game state persistence are optional features, not required for MVP
- **Controls Mapping**: Standard keyboard controls (arrow keys for movement, Z/X for rotation, Space for hard drop, C for hold, P for pause)
