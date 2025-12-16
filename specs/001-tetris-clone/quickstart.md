# Quickstart Guide: Tetris Clone Development

**Feature**: Tetris Clone Game  
**Branch**: `001-tetris-clone`  
**Last Updated**: 2025-12-16

## Overview

This quickstart guide provides developers with everything needed to begin implementing the Tetris clone. It covers setup, architecture, key algorithms, and development workflow.

---

## Prerequisites

- Node.js 18+ and npm
- Git
- Modern web browser (Chrome, Firefox, Safari, or Edge)
- Basic knowledge of TypeScript and React

---

## Quick Setup

### 1. Install Dependencies

```bash
cd my-app
npm install

# Install testing dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

### 2. Update Vite Configuration

Add test configuration to `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
})
```

### 3. Create Test Setup File

Create `my-app/src/setupTests.ts`:

```typescript
import '@testing-library/jest-dom'
import { expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)
```

### 4. Update package.json Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage"
  }
}
```

### 5. Update TypeScript Configuration

Add to `tsconfig.json`:

```json
{
  "compilerOptions": {
    "types": ["vitest/globals", "@testing-library/jest-dom"]
  }
}
```

---

## Architecture Overview

### Directory Structure

```
my-app/src/
├── game/                    # Core game logic (framework-agnostic)
│   ├── types.ts            # TypeScript interfaces
│   ├── constants.ts        # Game constants and SRS data
│   ├── GameState.ts        # Main game state manager
│   ├── Playfield.ts        # Collision detection, line clearing
│   ├── TetrominoController.ts  # Movement, rotation, SRS
│   ├── Randomizer.ts       # 7-bag randomizer
│   └── ScoreManager.ts     # Scoring and level logic
│
├── components/              # React UI components
│   ├── Game.tsx            # Main game container
│   ├── Playfield.tsx       # Renders game board
│   ├── Tetromino.tsx       # Renders individual pieces
│   ├── NextPiece.tsx       # Preview area
│   ├── HoldPiece.tsx       # Hold area
│   └── ScorePanel.tsx      # UI stats display
│
├── hooks/                   # Custom React hooks
│   ├── useGameLoop.ts      # Animation frame loop
│   ├── useKeyboard.ts      # Input handling
│   └── useGameState.ts     # State management
│
└── utils/
    └── helpers.ts
```

### Key Separation of Concerns

1. **Game Logic** (`game/`): Pure TypeScript, no React dependencies. Fully unit testable.
2. **UI Components** (`components/`): React presentation layer. Receives state, emits events.
3. **Hooks** (`hooks/`): Bridge between game logic and React. Manages lifecycle.

---

## Core Implementation Steps

### Phase 1: Foundation (P1 - Basic Gameplay)

#### 1.1 Create Type Definitions

Start by copying the contracts:

```bash
# From specs directory
cp specs/001-tetris-clone/contracts/types.ts my-app/src/game/
cp specs/001-tetris-clone/contracts/constants.ts my-app/src/game/
```

#### 1.2 Implement Playfield

**File**: `src/game/Playfield.ts`

Key responsibilities:
- Initialize 40x10 grid (20 buffer + 20 visible)
- Collision detection: `isValidPosition(tetromino, position)`
- Lock piece into grid: `lockPiece(tetromino)`
- Detect completed lines: `detectCompletedLines()`
- Clear lines and collapse: `clearLines(rowIndices)`

**Test First** (TDD):
```typescript
// tests/unit/Playfield.test.ts
describe('Playfield', () => {
  it('initializes with empty 40x10 grid', () => {
    const playfield = new Playfield();
    expect(playfield.grid).toHaveLength(40);
    expect(playfield.grid[0]).toHaveLength(10);
  });

  it('detects collision with bottom boundary', () => {
    const playfield = new Playfield();
    const piece = createTestPiece({ row: 39, col: 4 });
    expect(playfield.isValidPosition(piece, { row: 40, col: 4 })).toBe(false);
  });
});
```

#### 1.3 Implement 7-Bag Randomizer

**File**: `src/game/Randomizer.ts`

Algorithm:
```typescript
class SevenBagRandomizer {
  private bag: TetrominoType[] = [];

  next(): TetrominoType {
    if (this.bag.length === 0) {
      this.refillBag();
    }
    return this.bag.pop()!;
  }

  private refillBag(): void {
    this.bag = this.shuffle([...ALL_TETROMINO_TYPES]);
  }

  private shuffle<T>(array: T[]): T[] {
    // Fisher-Yates shuffle
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
```

**Test**:
```typescript
it('ensures all 7 pieces appear once per 7 draws', () => {
  const randomizer = new SevenBagRandomizer();
  const pieces = Array.from({ length: 7 }, () => randomizer.next());
  const uniquePieces = new Set(pieces);
  expect(uniquePieces.size).toBe(7);
});
```

#### 1.4 Implement SRS Rotation

**File**: `src/game/TetrominoController.ts`

Wall kick algorithm:
```typescript
rotate(tetromino: Tetromino, direction: RotationDirection): Tetromino | null {
  const newRotation = (tetromino.rotation + direction + 4) % 4;
  const newMatrix = TETROMINO_SHAPES[tetromino.type][newRotation];
  
  // Get appropriate kick table
  const kicks = tetromino.type === 'I' 
    ? SRS_WALL_KICKS.i 
    : SRS_WALL_KICKS.normal;
  
  const key = `${tetromino.rotation}→${newRotation}`;
  const kickOffsets = kicks[key];
  
  // Try each kick offset
  for (const [dx, dy] of kickOffsets) {
    const testPos = {
      row: tetromino.position.row + dy,
      col: tetromino.position.col + dx,
    };
    
    if (this.playfield.isValidPosition({ ...tetromino, matrix: newMatrix }, testPos)) {
      return {
        ...tetromino,
        rotation: newRotation,
        position: testPos,
        matrix: newMatrix,
      };
    }
  }
  
  return null; // All kicks failed
}
```

#### 1.5 Implement Game Loop Hook

**File**: `src/hooks/useGameLoop.ts`

```typescript
export function useGameLoop(callback: GameLoopCallback) {
  const animationId = useRef<number>();
  const lastTime = useRef<number>(performance.now());
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick(currentTime: number) {
      const delta = currentTime - lastTime.current;
      lastTime.current = currentTime;
      callbackRef.current(delta, currentTime);
      animationId.current = requestAnimationFrame(tick);
    }
    
    animationId.current = requestAnimationFrame(tick);
    
    return () => {
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, []);
}
```

#### 1.6 Implement Main Game State

**File**: `src/game/GameState.ts`

Central coordinator:
- Manages playfield, pieces, score, level
- Handles piece spawning, locking, line clearing
- Implements game loop update logic
- Enforces game rules

```typescript
class GameStateManager {
  private state: GameState;
  private randomizer: SevenBagRandomizer;
  
  update(deltaTime: number): void {
    if (this.state.gameStatus !== GameStatus.PLAYING) return;
    
    // Automatic falling
    this.state.lastDropTime += deltaTime;
    if (this.state.lastDropTime >= this.state.fallSpeed) {
      this.dropPieceOneRow();
      this.state.lastDropTime = 0;
    }
    
    // Lock delay handling
    if (this.isPieceLanded()) {
      this.handleLockDelay(deltaTime);
    }
  }
  
  handleInput(input: Input): void {
    switch (input) {
      case Input.MOVE_LEFT:
        this.movePiece(-1, 0);
        break;
      case Input.MOVE_RIGHT:
        this.movePiece(1, 0);
        break;
      case Input.ROTATE_CW:
        this.rotatePiece(RotationDirection.CLOCKWISE);
        break;
      case Input.HARD_DROP:
        this.hardDrop();
        break;
      // ... other inputs
    }
  }
}
```

---

### Phase 2: Visual Guidance (P2)

#### 2.1 Ghost Piece Calculation

**File**: `src/game/TetrominoController.ts`

```typescript
calculateGhostPosition(tetromino: Tetromino): Position {
  let ghostPos = { ...tetromino.position };
  
  // Drop until collision
  while (this.playfield.isValidPosition(tetromino, { 
    row: ghostPos.row + 1, 
    col: ghostPos.col 
  })) {
    ghostPos.row++;
  }
  
  return ghostPos;
}
```

#### 2.2 Next Piece Preview

**Component**: `src/components/NextPiece.tsx`

```tsx
export function NextPiece({ piece }: { piece: Tetromino }) {
  return (
    <div className="next-piece-container">
      <h3>Next</h3>
      <div className="piece-preview">
        {piece.matrix.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <div 
                key={j} 
                className={cell ? 'block' : 'empty'}
                style={{ backgroundColor: cell ? piece.color : 'transparent' }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

### Phase 3: Hold Functionality (P3)

**File**: `src/game/GameState.ts`

```typescript
handleHold(): void {
  if (!this.state.canHold || !this.state.currentPiece) return;
  
  if (this.state.heldPiece === null) {
    // Store current piece, spawn next
    this.state.heldPiece = this.state.currentPiece;
    this.spawnNextPiece();
  } else {
    // Swap current and held
    const temp = this.state.currentPiece;
    this.state.currentPiece = this.resetPieceToSpawn(this.state.heldPiece);
    this.state.heldPiece = temp;
  }
  
  this.state.canHold = false;
}
```

---

## Testing Strategy

### Unit Tests

Focus on pure logic in `game/` directory:

```typescript
// Playfield collision detection
// SRS rotation and wall kicks
// 7-bag randomizer fairness
// Score calculation
// Level progression
```

### Integration Tests

Test interactions between modules:

```typescript
// Complete game cycle: spawn → move → lock → clear → spawn
// Hold mechanic state changes
// Game over detection
```

### Component Tests

Test React UI components:

```typescript
// Piece rendering
// User input handling
// State display (score, level)
```

---

## Development Workflow

### 1. Start with Tests (TDD)

```bash
npm test -- Randomizer.test.ts
```

Write failing test → Implement feature → Test passes → Refactor

### 2. Run Dev Server

```bash
npm run dev
```

Open http://localhost:5173

### 3. Iterate on Features

Follow priority order (P1 → P2 → P3 → P4 → P5):
1. Basic gameplay (move, rotate, drop, clear)
2. Ghost piece and preview
3. Hold functionality
4. Scoring and levels
5. 7-bag randomizer

### 4. Visual Debugging

Use React DevTools to inspect state. Add debug overlay:

```tsx
{process.env.NODE_ENV === 'development' && (
  <DebugOverlay gameState={gameState} />
)}
```

---

## Common Pitfalls & Solutions

### Problem: Pieces fall through locked blocks

**Solution**: Ensure collision detection checks both boundaries AND locked cells in grid.

### Problem: Rotation doesn't work near walls

**Solution**: Implement all 5 SRS wall kick offsets in correct order.

### Problem: Game stutters or skips frames

**Solution**: Use delta time for movement calculations, not frame count. Ensure single game loop.

### Problem: Input feels unresponsive

**Solution**: Implement DAS (Delayed Auto Shift) for held keys. Process input immediately, not just on game tick.

### Problem: 7-bag randomizer repeats pieces

**Solution**: Verify Fisher-Yates shuffle implementation. Test that bag refills correctly.

---

## Performance Considerations

1. **Avoid Unnecessary Re-renders**: Use `React.memo` for pure components
2. **Batch State Updates**: Update game state once per frame, not per input
3. **Optimize Grid Rendering**: Use CSS Grid, not individual divs per cell
4. **Profile with React DevTools**: Check for expensive renders

---

## Debugging Tips

### Enable Debug Mode

```typescript
const DEBUG = true;

if (DEBUG) {
  console.log('Current piece:', state.currentPiece);
  console.log('Collision:', isColliding);
}
```

### Visualize Hit Boxes

```css
.debug .piece-block {
  outline: 1px solid red;
}
```

### Slow Motion Mode

```typescript
const DEBUG_SPEED = 0.1; // 10% speed
const adjustedDelta = deltaTime * (DEBUG ? DEBUG_SPEED : 1);
```

---

## Next Steps

After completing the quickstart:

1. Review `specs/001-tetris-clone/spec.md` for complete requirements
2. Check `specs/001-tetris-clone/data-model.md` for entity details
3. Reference `specs/001-tetris-clone/research.md` for algorithm details
4. Begin Phase 2: Create task breakdown with `/speckit.tasks`

---

## Resources

- **Tetris Guideline**: https://tetris.wiki/Tetris_Guideline
- **SRS Details**: https://tetris.wiki/Super_Rotation_System
- **Vitest Docs**: https://vitest.dev
- **React Testing Library**: https://testing-library.com/react

---

## Support

For questions or issues during implementation:
1. Review specification documents in `specs/001-tetris-clone/`
2. Check research findings for algorithm details
3. Run tests to verify implementation correctness
4. Use browser DevTools for visual debugging

Happy coding! 🎮
