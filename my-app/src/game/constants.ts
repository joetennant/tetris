/**
 * Game Constants for Tetris Clone
 * 
 * All constant values used throughout the game, following the Tetris Guideline.
 */

import type { GameConfig, ScoreValues, TetrominoType } from './types';

// ============================================================================
// Game Configuration
// ============================================================================

export const GAME_CONFIG: GameConfig = {
  // Playfield dimensions
  PLAYFIELD_WIDTH: 10,
  PLAYFIELD_HEIGHT: 40,
  VISIBLE_HEIGHT: 20,
  BUFFER_HEIGHT: 20,
  
  // Level progression
  INITIAL_LEVEL: 1,
  LINES_PER_LEVEL: 10,
  
  // Timing (all in milliseconds)
  BASE_FALL_SPEED: 1000,        // 1 second at level 1
  FALL_SPEED_MULTIPLIER: 0.9,   // 10% faster per level
  LOCK_DELAY: 500,
  MAX_LOCK_RESETS: 15,
  
  // UI
  NEXT_PIECES_COUNT: 1,  // Can be increased to 3-6 for enhanced preview
};

// ============================================================================
// Tetromino Colors (Tetris Guideline Standard)
// ============================================================================

export const TETROMINO_COLORS: Record<TetrominoType, string> = {
  I: '#00e5ff', // Bright cyan (vibrant)
  J: '#4169ff', // Bright blue (vibrant)
  L: '#ff8c00', // Bright orange (vibrant)
  O: '#ffd700', // Bright yellow (vibrant)
  S: '#00ff88', // Bright green (vibrant)
  T: '#d946ff', // Bright purple (vibrant)
  Z: '#ff4757', // Bright red (vibrant)
};

// ============================================================================
// Scoring Values
// ============================================================================

export const SCORE_VALUES: ScoreValues = {
  SINGLE: 100,   // 1 line cleared
  DOUBLE: 300,   // 2 lines cleared
  TRIPLE: 500,   // 3 lines cleared
  TETRIS: 800,   // 4 lines cleared (bonus!)
  SOFT_DROP: 1,  // Per cell soft dropped
  HARD_DROP: 2,  // Per cell hard dropped
};

// ============================================================================
// Keyboard Mappings
// ============================================================================

export const KEY_BINDINGS = {
  MOVE_LEFT: ['ArrowLeft', 'a', 'A'],
  MOVE_RIGHT: ['ArrowRight', 'd', 'D'],
  SOFT_DROP: ['ArrowDown', 's', 'S'],
  HARD_DROP: [' ', 'ArrowUp', 'w', 'W'], // Space or Up arrow
  ROTATE_CW: ['x', 'X', 'ArrowUp'],
  ROTATE_CCW: ['z', 'Z', 'Control'],
  HOLD: ['c', 'C', 'Shift'],
  PAUSE: ['p', 'P', 'Escape'],
} as const;

// ============================================================================
// Tetromino Shapes (Rotation Matrices)
// ============================================================================

/**
 * Shape definitions for all tetrominoes
 * Each shape has 4 rotation states (0-3)
 * true = filled block, false = empty
 */

export const I_SHAPE = [
  // Rotation 0 (horizontal)
  [
    [false, false, false, false],
    [true,  true,  true,  true],
    [false, false, false, false],
    [false, false, false, false],
  ],
  // Rotation 1 (vertical)
  [
    [false, false, true,  false],
    [false, false, true,  false],
    [false, false, true,  false],
    [false, false, true,  false],
  ],
  // Rotation 2 (horizontal, reversed)
  [
    [false, false, false, false],
    [false, false, false, false],
    [true,  true,  true,  true],
    [false, false, false, false],
  ],
  // Rotation 3 (vertical, reversed)
  [
    [false, true,  false, false],
    [false, true,  false, false],
    [false, true,  false, false],
    [false, true,  false, false],
  ],
];

export const J_SHAPE = [
  // Rotation 0
  [
    [true,  false, false],
    [true,  true,  true],
    [false, false, false],
  ],
  // Rotation 1
  [
    [false, true,  true],
    [false, true,  false],
    [false, true,  false],
  ],
  // Rotation 2
  [
    [false, false, false],
    [true,  true,  true],
    [false, false, true],
  ],
  // Rotation 3
  [
    [false, true,  false],
    [false, true,  false],
    [true,  true,  false],
  ],
];

export const L_SHAPE = [
  // Rotation 0
  [
    [false, false, true],
    [true,  true,  true],
    [false, false, false],
  ],
  // Rotation 1
  [
    [false, true,  false],
    [false, true,  false],
    [false, true,  true],
  ],
  // Rotation 2
  [
    [false, false, false],
    [true,  true,  true],
    [true,  false, false],
  ],
  // Rotation 3
  [
    [true,  true,  false],
    [false, true,  false],
    [false, true,  false],
  ],
];

export const O_SHAPE = [
  // Rotation 0 (all rotations identical)
  [
    [false, true,  true,  false],
    [false, true,  true,  false],
    [false, false, false, false],
    [false, false, false, false],
  ],
  // Rotation 1 (same)
  [
    [false, true,  true,  false],
    [false, true,  true,  false],
    [false, false, false, false],
    [false, false, false, false],
  ],
  // Rotation 2 (same)
  [
    [false, true,  true,  false],
    [false, true,  true,  false],
    [false, false, false, false],
    [false, false, false, false],
  ],
  // Rotation 3 (same)
  [
    [false, true,  true,  false],
    [false, true,  true,  false],
    [false, false, false, false],
    [false, false, false, false],
  ],
];

export const S_SHAPE = [
  // Rotation 0
  [
    [false, true,  true],
    [true,  true,  false],
    [false, false, false],
  ],
  // Rotation 1
  [
    [false, true,  false],
    [false, true,  true],
    [false, false, true],
  ],
  // Rotation 2
  [
    [false, false, false],
    [false, true,  true],
    [true,  true,  false],
  ],
  // Rotation 3
  [
    [true,  false, false],
    [true,  true,  false],
    [false, true,  false],
  ],
];

export const T_SHAPE = [
  // Rotation 0
  [
    [false, true,  false],
    [true,  true,  true],
    [false, false, false],
  ],
  // Rotation 1
  [
    [false, true,  false],
    [false, true,  true],
    [false, true,  false],
  ],
  // Rotation 2
  [
    [false, false, false],
    [true,  true,  true],
    [false, true,  false],
  ],
  // Rotation 3
  [
    [false, true,  false],
    [true,  true,  false],
    [false, true,  false],
  ],
];

export const Z_SHAPE = [
  // Rotation 0
  [
    [true,  true,  false],
    [false, true,  true],
    [false, false, false],
  ],
  // Rotation 1
  [
    [false, false, true],
    [false, true,  true],
    [false, true,  false],
  ],
  // Rotation 2
  [
    [false, false, false],
    [true,  true,  false],
    [false, true,  true],
  ],
  // Rotation 3
  [
    [false, true,  false],
    [true,  true,  false],
    [true,  false, false],
  ],
];

/**
 * Map of all tetromino shapes
 */
export const TETROMINO_SHAPES = {
  I: I_SHAPE,
  J: J_SHAPE,
  L: L_SHAPE,
  O: O_SHAPE,
  S: S_SHAPE,
  T: T_SHAPE,
  Z: Z_SHAPE,
};

/**
 * Spawn positions for each tetromino type
 * row: relative to top of buffer zone
 * col: centered in 10-column playfield
 */
export const SPAWN_POSITIONS: Record<TetrominoType, { row: number; col: number }> = {
  // Spawn at row 19-20 (top of visible area) so pieces are visible when they appear
  I: { row: 19, col: 3 },
  J: { row: 19, col: 3 },
  L: { row: 19, col: 3 },
  O: { row: 19, col: 4 },
  S: { row: 19, col: 3 },
  T: { row: 19, col: 3 },
  Z: { row: 19, col: 3 },
};

// ============================================================================
// SRS Wall Kick Data
// ============================================================================

/**
 * Wall kick offsets for JLSTZ pieces
 * Format: "fromRotation→toRotation": [[dx, dy], ...]
 * Offsets are tried in order until valid position found
 */
export const SRS_WALL_KICKS_NORMAL = {
  '0→1': [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]],
  '1→0': [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]],
  '1→2': [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]],
  '2→1': [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]],
  '2→3': [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]],
  '3→2': [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]],
  '3→0': [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]],
  '0→3': [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]],
};

/**
 * Wall kick offsets for I piece (different from JLSTZ)
 */
export const SRS_WALL_KICKS_I = {
  '0→1': [[0, 0], [-2, 0], [+1, 0], [-2, -1], [+1, +2]],
  '1→0': [[0, 0], [+2, 0], [-1, 0], [+2, +1], [-1, -2]],
  '1→2': [[0, 0], [-1, 0], [+2, 0], [-1, +2], [+2, -1]],
  '2→1': [[0, 0], [+1, 0], [-2, 0], [+1, -2], [-2, +1]],
  '2→3': [[0, 0], [+2, 0], [-1, 0], [+2, +1], [-1, -2]],
  '3→2': [[0, 0], [-2, 0], [+1, 0], [-2, -1], [+1, +2]],
  '3→0': [[0, 0], [+1, 0], [-2, 0], [+1, -2], [-2, +1]],
  '0→3': [[0, 0], [-1, 0], [+2, 0], [-1, +2], [+2, -1]],
};

/**
 * Combined wall kick data
 */
export const SRS_WALL_KICKS = {
  normal: SRS_WALL_KICKS_NORMAL,
  i: SRS_WALL_KICKS_I,
};

// ============================================================================
// All Tetromino Types (for randomizer)
// ============================================================================

export const ALL_TETROMINO_TYPES: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];
