# Research: Tetris Clone Game

**Phase**: 0 - Outline & Research  
**Date**: 2025-12-16  
**Status**: Complete

## Overview

This document consolidates research findings for implementing a Tetris clone following the official Tetris Guideline. Research focused on testing framework selection, Super Rotation System implementation, game loop architecture, and piece randomization algorithms.

---

## 1. Testing Framework Selection

### Decision: Vitest + React Testing Library

**Rationale**:
- **Native Vite Integration**: Vitest is designed specifically for Vite projects, sharing the same configuration and transformation pipeline. This eliminates the configuration complexity present in Jest + Vite setups.
- **Performance**: Vitest leverages Vite's hot module replacement and runs tests in parallel, providing significantly faster test execution than Jest.
- **TypeScript Support**: Native TypeScript support without additional configuration or babel transforms.
- **Familiar API**: Jest-compatible API (describe, it, expect) makes migration from Jest trivial and reduces learning curve.
- **React Testing Library Compatibility**: Works seamlessly with @testing-library/react for component testing.

**Alternatives Considered**:
- **Jest**: Traditional choice but requires additional Vite configuration (vite-jest), slower execution, and more complex setup for ESM modules.
- **Cypress Component Testing**: Good for integration tests but heavier weight than needed for unit testing game logic.

**Implementation Requirements**:
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Configuration** (`vite.config.ts`):
```typescript
test: {
  globals: true,
  environment: 'jsdom',
  setupFiles: './src/setupTests.ts',
}
```

**References**:
- https://blog.incubyte.co/blog/vitest-react-testing-library-guide/
- https://dev.to/samuel_kinuthia/testing-react-applications-with-vitest-a-comprehensive-guide-2jm8
- https://makersden.io/blog/guide-to-react-testing-library-vitest

---

## 2. Super Rotation System (SRS) Implementation

### Decision: Implement SRS with Wall Kick Tables

**Rationale**:
- **Official Standard**: SRS is mandated by the Tetris Guideline for all compliant games since 2001.
- **Player Expectations**: Modern Tetris players expect SRS behavior, including T-spins and wall kicks.
- **Well-Documented**: Complete kick tables and rotation matrices are publicly available from TetrisWiki and Hard Drop Wiki.
- **Enables Advanced Techniques**: Proper SRS implementation enables T-spins, which are core to modern competitive Tetris.

**Algorithm Overview**:
1. Rotate piece matrix (transpose + reverse for 90° clockwise)
2. Look up appropriate kick table (different for I-piece vs JLSTZ pieces; O-piece has no kicks)
3. For each kick offset in sequence, attempt to place rotated piece
4. First successful placement (no collision) wins; if all fail, rotation is blocked

**Wall Kick Tables**:

**JLSTZ Pieces** (5 kicks per rotation):
```typescript
const SRS_KICKS_NORMAL = {
  '0→1': [[0,0], [-1,0], [-1,+1], [0,-2], [-1,-2]],
  '1→0': [[0,0], [+1,0], [+1,-1], [0,+2], [+1,+2]],
  '1→2': [[0,0], [+1,0], [+1,-1], [0,+2], [+1,+2]],
  '2→1': [[0,0], [-1,0], [-1,+1], [0,-2], [-1,-2]],
  '2→3': [[0,0], [+1,0], [+1,+1], [0,-2], [+1,-2]],
  '3→2': [[0,0], [-1,0], [-1,-1], [0,+2], [-1,+2]],
  '3→0': [[0,0], [-1,0], [-1,-1], [0,+2], [-1,+2]],
  '0→3': [[0,0], [+1,0], [+1,+1], [0,-2], [+1,-2]],
};
```

**I-Piece** (unique kicks):
```typescript
const SRS_KICKS_I = {
  '0→1': [[0,0], [-2,0], [+1,0], [-2,-1], [+1,+2]],
  '1→0': [[0,0], [+2,0], [-1,0], [+2,+1], [-1,-2]],
  '1→2': [[0,0], [-1,0], [+2,0], [-1,+2], [+2,-1]],
  '2→1': [[0,0], [+1,0], [-2,0], [+1,-2], [-2,+1]],
  '2→3': [[0,0], [+2,0], [-1,0], [+2,+1], [-1,-2]],
  '3→2': [[0,0], [-2,0], [+1,0], [-2,-1], [+1,+2]],
  '3→0': [[0,0], [+1,0], [-2,0], [+1,-2], [-2,+1]],
  '0→3': [[0,0], [-1,0], [+2,0], [-1,+2], [+2,-1]],
};
```

**O-Piece**: No rotation kicks (piece is symmetrical)

**Rotation States**:
- 0: Spawn orientation (flat side down)
- 1: Rotated 90° clockwise
- 2: Rotated 180° (upside down)
- 3: Rotated 270° clockwise (90° counter-clockwise)

**Alternatives Considered**:
- **Original Nintendo Rotation System (NRS)**: Simpler but doesn't support T-spins; not guideline-compliant.
- **Sega Rotation System**: Similar issues; outdated standard.

**References**:
- https://tetris.wiki/Super_Rotation_System
- https://harddrop.com/wiki/SRS
- https://www.four.lol/srs/kicks-overview
- https://github.com/brown2020/opentetris (TypeScript example)

---

## 3. Game Loop Architecture

### Decision: Custom useGameLoop Hook with requestAnimationFrame

**Rationale**:
- **60 FPS Target**: requestAnimationFrame automatically synchronizes with browser refresh rate (typically 60Hz).
- **Performance**: Browser-optimized; automatically pauses when tab is hidden.
- **Delta Time Support**: Passing delta time to updates enables frame-rate independent physics.
- **React Integration**: Custom hook pattern cleanly integrates with React component lifecycle.

**Implementation Pattern**:
```typescript
export function useGameLoop(onFrame: (delta: number, elapsed: number) => void) {
  const animationId = useRef<number>();
  const lastTime = useRef<number>(performance.now());
  const startTime = useRef<number>(performance.now());

  useEffect(() => {
    function tick(currentTime: number) {
      const delta = currentTime - lastTime.current;
      lastTime.current = currentTime;
      onFrame(delta, currentTime - startTime.current);
      animationId.current = requestAnimationFrame(tick);
    }
    animationId.current = requestAnimationFrame(tick);
    return () => animationId.current && cancelAnimationFrame(animationId.current);
  }, [onFrame]);
}
```

**Best Practices**:
1. **Use refs for mutable state**: Avoids unnecessary re-renders
2. **Clean up on unmount**: Always cancel animation frame to prevent memory leaks
3. **Single game loop**: One centralized loop rather than multiple scattered loops
4. **Time delta calculations**: Use `performance.now()` for high-precision timing
5. **Fixed timestep for physics**: Consider accumulator pattern for deterministic updates

**Fixed Timestep Pattern** (if needed for precise physics):
```typescript
const FIXED_TIMESTEP = 16.67; // 60 updates per second
let accumulator = 0;

function tick(currentTime: number) {
  const delta = currentTime - lastTime.current;
  accumulator += delta;
  
  while (accumulator >= FIXED_TIMESTEP) {
    updateGameState(FIXED_TIMESTEP); // deterministic update
    accumulator -= FIXED_TIMESTEP;
  }
  
  render(); // render at actual frame rate
}
```

**Alternatives Considered**:
- **setInterval**: Less precise, doesn't sync with refresh rate, continues when tab hidden.
- **setTimeout recursive**: Similar issues to setInterval; not frame-synchronized.
- **Third-party libraries** (react-game-loop, use-animation-frame): Adds dependency for simple functionality.

**References**:
- https://css-tricks.com/using-requestanimationframe-with-react-hooks/
- https://blog.openreplay.com/use-requestanimationframe-in-react-for-smoothest-animations/
- https://fsjs.dev/beyond-basics-requestanimationframe-techniques-game-development/
- https://dev.to/stormsidali2001/building-a-professional-game-loop-in-typescript-from-basic-to-advanced-implementation-eo8

---

## 4. 7-Bag Randomizer Algorithm

### Decision: Implement 7-Bag Randomizer with Fisher-Yates Shuffle

**Rationale**:
- **Guideline Requirement**: Official Tetris Guideline mandates 7-bag randomizer for fair piece distribution.
- **Prevents Droughts**: Guarantees each of the 7 pieces appears once per 7-piece cycle, eliminating frustrating droughts or floods.
- **Simple Implementation**: Straightforward algorithm using standard Fisher-Yates shuffle.
- **Player Satisfaction**: Players can plan strategy knowing worst-case piece wait is 7 pieces.

**Algorithm**:
1. Create array of 7 tetromino types: ['I', 'J', 'L', 'O', 'S', 'T', 'Z']
2. Shuffle array using Fisher-Yates algorithm
3. Pop pieces from bag as needed
4. When bag is empty, refill and reshuffle

**Implementation**:
```typescript
class SevenBagRandomizer {
  private bag: TetrominoType[] = [];
  
  constructor() {
    this.refillBag();
  }
  
  next(): TetrominoType {
    if (this.bag.length === 0) {
      this.refillBag();
    }
    return this.bag.pop()!;
  }
  
  private refillBag(): void {
    this.bag = this.shuffle([...TETROMINO_TYPES]);
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

**Properties**:
- **Fairness**: Each piece appears exactly once per 7-piece bag
- **Randomness**: Shuffle ensures unpredictable ordering within each bag
- **Testability**: Can inject seed or mock shuffle for deterministic testing
- **Preview Support**: Can peek ahead into current bag for multi-piece preview

**Alternatives Considered**:
- **Pure Random (Math.random())**: Original Tetris method; causes unfair droughts and floods.
- **TGM Randomizer**: History-based system (4-piece history); more complex, still allows short droughts.
- **Weighted Random**: Can reduce droughts but doesn't guarantee fairness like 7-bag.

**References**:
- https://tetris.fandom.com/wiki/Random_Generator
- https://harddrop.com/wiki/Random_Generator
- https://dev.to/sleeplessbyte/tetris-building-a-game-using-javascript-3j6f
- https://max-we.github.io/Tetris-Gymnasium/components/randomizer/

---

## 5. Additional Technical Decisions

### Keyboard Input Handling

**Decision**: Custom useKeyboard hook with key repeat handling

**Rationale**:
- Tetris requires specific input behavior (DAS - Delayed Auto Shift, ARR - Auto Repeat Rate)
- Standard browser keydown/keyup events don't provide enough control
- Need to track key state and implement custom repeat logic

**Pattern**:
```typescript
export function useKeyboard() {
  const keysPressed = useRef<Set<string>>(new Set());
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!keysPressed.current.has(e.key)) {
        keysPressed.current.add(e.key);
        // Handle initial key press
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key);
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  return keysPressed.current;
}
```

### Canvas vs DOM Rendering

**Decision**: Use HTML/CSS Grid for playfield rendering

**Rationale**:
- Simpler implementation for block-based game
- Easier to style and debug than canvas
- Performance sufficient for 10x20 grid at 60 FPS
- React reconciliation handles updates efficiently
- Better accessibility (can inspect DOM)

**Alternative**: Canvas rendering would be needed for particle effects or more complex visuals, but not required for MVP.

---

## Summary

All NEEDS CLARIFICATION items from Technical Context have been resolved:

1. ✅ **Testing**: Vitest + React Testing Library (native Vite integration)
2. ✅ **SRS Implementation**: Wall kick tables documented with reference implementations
3. ✅ **Game Loop**: Custom useGameLoop hook with requestAnimationFrame
4. ✅ **Randomizer**: 7-bag algorithm with Fisher-Yates shuffle
5. ✅ **Input Handling**: Custom useKeyboard hook for precise control
6. ✅ **Rendering**: HTML/CSS Grid approach for simplicity

Ready to proceed to Phase 1: Design & Contracts.
