# Data Model: Tetris Clone Game

**Phase**: 1 - Design & Contracts  
**Date**: 2025-12-16  
**Status**: Complete

## Overview

This document defines the core data entities and their relationships for the Tetris clone game. The data model is designed to be framework-agnostic, enabling testability and potential reuse across different UI implementations.

---

## Core Entities

### 1. TetrominoType

Enumeration of the seven standard Tetris piece types.

**Type Definition**:
```typescript
type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';
```

**Properties**:
- Each type has a unique color (per Tetris Guideline)
- Each type has 4 rotation states (except O which is symmetrical)
- Each type has specific spawn orientation

---

### 2. Tetromino

Represents a single game piece with its current state.

**Fields**:
- `type: TetrominoType` - The shape type (I, J, L, O, S, T, Z)
- `rotation: number` - Current rotation state (0-3, where 0 is spawn orientation)
- `position: Position` - Current grid position (row, column)
- `matrix: boolean[][]` - 2D array representing the piece shape (true = filled block)
- `color: string` - Hex color code for rendering

**Relationships**:
- Belongs to exactly one GameState (as currentPiece, heldPiece, or nextPiece)

**State Transitions**:
- `spawn()` → Place at top-center of playfield in rotation 0
- `rotate(direction)` → Change rotation state (with SRS wall kicks)
- `move(dx, dy)` → Translate position
- `drop()` → Move down until collision, then lock

**Validation Rules**:
- Position must be within playfield bounds (with buffer zone)
- Rotation must be 0-3
- Matrix dimensions vary by type and rotation (2x2 for O, 3x3 or 4x4 for others)

---

### 3. Position

Represents a coordinate in the playfield grid.

**Fields**:
- `row: number` - Vertical position (0 = top of buffer zone, 20 = top of visible playfield)
- `col: number` - Horizontal position (0-9 for visible playfield)

**Validation Rules**:
- `row >= 0` (can be in buffer zone above visible area)
- `0 <= col <= 9` (within 10-column playfield)

---

### 4. Cell

Represents a single grid cell in the playfield.

**Fields**:
- `isEmpty: boolean` - True if cell is empty, false if occupied by locked piece
- `color: string | null` - Hex color if occupied, null if empty

**Relationships**:
- Part of Playfield grid

**State Transitions**:
- Empty → Occupied (when piece locks)
- Occupied → Empty (when line clears)

---

### 5. Playfield

The game board where pieces are placed and lines are cleared.

**Fields**:
- `grid: Cell[][]` - 2D array of cells (dimensions: 40 rows x 10 columns)
  - Rows 0-19: Buffer zone (hidden, for piece spawning)
  - Rows 20-39: Visible playing area
- `width: number` - Always 10 (constant)
- `height: number` - Always 40 (20 buffer + 20 visible, constant)

**Methods**:
- `isValidPosition(tetromino, position)` - Check collision detection
- `lockPiece(tetromino)` - Transfer piece blocks to grid
- `detectCompletedLines()` - Find full rows
- `clearLines(rows)` - Remove rows and shift down
- `isGameOver()` - Check if any blocks in rows 20+ at spawn time

**Validation Rules**:
- Grid must always be 40x10 dimensions
- Each cell must be valid Cell object
- Completed line = all 10 cells in row are occupied

---

### 6. GameState

Central state container for the entire game.

**Fields**:
- `playfield: Playfield` - The game board
- `currentPiece: Tetromino | null` - Currently falling piece
- `heldPiece: Tetromino | null` - Piece in hold area (null if empty)
- `nextPieces: Tetromino[]` - Queue of upcoming pieces (at least 1, up to 6)
- `canHold: boolean` - Whether hold is allowed (false after hold until piece locks)
- `score: number` - Current score (non-negative)
- `level: number` - Current level (starts at 1)
- `linesCleared: number` - Total lines cleared (non-negative)
- `gameStatus: GameStatus` - Current game state (playing, paused, gameOver)
- `fallSpeed: number` - Milliseconds between automatic drops (decreases with level)
- `lockDelay: number` - Milliseconds before piece locks after landing
- `lockResets: number` - Count of lock delay resets (max 15 per piece)

**Relationships**:
- Contains one Playfield
- References current, held, and next Tetrominoes
- Managed by GameController

**State Transitions**:
```
READY → PLAYING (on start)
PLAYING → PAUSED (on pause)
PAUSED → PLAYING (on resume)
PLAYING → GAME_OVER (on top-out)
GAME_OVER → READY (on restart)
```

**Validation Rules**:
- `level >= 1`
- `score >= 0`
- `linesCleared >= 0`
- `nextPieces.length >= 1`
- `lockResets <= 15`
- `currentPiece` must be null if gameStatus is not PLAYING

---

### 7. GameStatus

Enumeration of possible game states.

**Type Definition**:
```typescript
enum GameStatus {
  READY = 'ready',         // Initial state before game starts
  PLAYING = 'playing',     // Active gameplay
  PAUSED = 'paused',       // Game paused by player
  GAME_OVER = 'gameOver'   // Game ended (top-out)
}
```

---

### 8. Input

Represents player input commands.

**Type Definition**:
```typescript
enum Input {
  MOVE_LEFT = 'moveLeft',
  MOVE_RIGHT = 'moveRight',
  ROTATE_CW = 'rotateCW',      // Clockwise
  ROTATE_CCW = 'rotateCCW',    // Counter-clockwise
  SOFT_DROP = 'softDrop',
  HARD_DROP = 'hardDrop',
  HOLD = 'hold',
  PAUSE = 'pause',
  RESTART = 'restart'
}
```

---

## Supporting Entities

### 9. RotationState

Defines rotation data for each tetromino type.

**Fields**:
- `matrices: boolean[][][]` - Array of 4 rotation matrices (one per rotation state)
- `spawnRow: number` - Initial row position for this piece type
- `spawnCol: number` - Initial column position for this piece type

**Usage**:
- Looked up by TetrominoType to get shape data
- Used during rotation to get new matrix
- Referenced during spawn to place piece correctly

---

### 10. WallKickData

Defines SRS wall kick offsets for rotation attempts.

**Fields**:
- `normalKicks: KickTable` - Kick data for J, L, S, T, Z pieces
- `iKicks: KickTable` - Unique kick data for I piece
- `oKicks: null` - O piece has no kicks (symmetrical)

**KickTable Type**:
```typescript
type KickTable = {
  [key: string]: [number, number][];  // e.g., '0→1': [[0,0], [-1,0], ...]
}
```

**Usage**:
- Accessed during rotation to get kick sequence
- Each entry maps rotation transition to array of position offsets
- Offsets tried in order until valid position found

---

### 11. Score Calculation

Defines scoring rules.

**Constants**:
```typescript
const SCORE_VALUES = {
  SINGLE: 100,   // 1 line cleared
  DOUBLE: 300,   // 2 lines cleared
  TRIPLE: 500,   // 3 lines cleared
  TETRIS: 800,   // 4 lines cleared
  SOFT_DROP: 1,  // Per cell soft dropped
  HARD_DROP: 2   // Per cell hard dropped
};
```

**Formula**:
- `finalScore = baseScore * level`
- Clearing multiple lines simultaneously awards bonus points
- Drop bonuses encourage aggressive play

---

## Entity Relationships Diagram

```
GameState
├── playfield: Playfield
│   └── grid: Cell[][]
├── currentPiece: Tetromino
│   ├── type: TetrominoType
│   ├── position: Position
│   └── matrix: boolean[][]
├── heldPiece: Tetromino | null
├── nextPieces: Tetromino[]
├── score: number
├── level: number
├── linesCleared: number
└── gameStatus: GameStatus

TetrominoType (enum)
├── I, J, L, O, S, T, Z
└── Maps to RotationState

RotationState
├── matrices: boolean[][][]
└── spawn position

WallKickData
├── normalKicks: KickTable
└── iKicks: KickTable
```

---

## Data Flow

### Game Initialization
1. Create empty Playfield (40x10 grid of empty Cells)
2. Initialize SevenBagRandomizer
3. Generate initial nextPieces queue (1-6 pieces)
4. Set initial GameState values (score=0, level=1, status=READY)

### Piece Spawning
1. Pop first piece from nextPieces queue
2. Set as currentPiece at spawn position
3. Add new piece to end of nextPieces queue (from randomizer)
4. Reset canHold to true

### Piece Movement
1. Receive Input command
2. Calculate new position/rotation
3. Check collision via Playfield.isValidPosition()
4. If valid: update Tetromino position/rotation
5. If invalid: ignore input or attempt wall kicks (for rotation)

### Piece Locking
1. Piece lands (collision below)
2. Start lock delay timer
3. If piece moves/rotates successfully: reset timer (max 15 resets)
4. When timer expires: lock piece
5. Transfer piece blocks to Playfield grid
6. Check for completed lines
7. Clear lines and award score
8. Check game over condition
9. Spawn next piece

### Line Clearing
1. Scan Playfield.grid for completed rows
2. Remove completed rows from grid
3. Shift all rows above down by cleared count
4. Add empty rows at top (in buffer zone)
5. Update linesCleared and score
6. Check for level up (every 10 lines)
7. Update fallSpeed based on new level

### Hold Mechanic
1. Receive Hold input
2. Check canHold flag (must be true)
3. If heldPiece is null:
   - Move currentPiece to heldPiece
   - Spawn next piece from queue
4. If heldPiece exists:
   - Swap currentPiece and heldPiece
   - Reset swapped piece to spawn position
5. Set canHold to false

---

## Immutability and State Management

**Principles**:
- GameState updates should be immutable (create new state, don't mutate)
- Playfield grid can be mutated directly (performance optimization for game loop)
- Tetromino objects are immutable (create new instance when rotating/moving)

**React Integration**:
- GameState stored in React state (useState or useReducer)
- Updates trigger re-renders
- Game loop references latest state via useRef
- Input handlers dispatch state updates

---

## Validation Summary

**Playfield Validation**:
- ✅ 40 rows x 10 columns
- ✅ Rows 20-39 visible, 0-19 buffer
- ✅ All cells valid (isEmpty + color)

**Tetromino Validation**:
- ✅ Position within bounds
- ✅ Rotation 0-3
- ✅ Valid matrix for type
- ✅ Correct color per guideline

**GameState Validation**:
- ✅ Non-negative score, level ≥ 1, lines ≥ 0
- ✅ Valid gameStatus transition
- ✅ nextPieces not empty
- ✅ canHold logic enforced

**Physics Validation**:
- ✅ No collision when moving/rotating
- ✅ SRS wall kicks attempted in order
- ✅ Lock delay respects resets limit
- ✅ Lines cleared only when row full

---

## Testing Considerations

**Unit Test Targets**:
- Playfield collision detection
- SRS rotation with wall kicks
- 7-bag randomizer fairness
- Score calculation accuracy
- Line clearing logic
- Game over detection

**Integration Test Targets**:
- Complete gameplay cycle (spawn → move → lock → clear → spawn)
- Hold mechanic state transitions
- Level progression and speed increases
- Pause/resume state management

---

## Summary

The data model provides a clean separation between game logic and presentation. Core entities (Playfield, Tetromino, GameState) are framework-agnostic and fully testable. The model enforces Tetris Guideline requirements through validation rules and state transitions.

**Key Design Decisions**:
- Immutable state updates for React compatibility
- Framework-agnostic core logic for testability
- Explicit validation rules for guideline compliance
- Clear entity relationships and data flow
- Performance-optimized where needed (grid mutation)

Ready to generate API contracts and quickstart guide.
