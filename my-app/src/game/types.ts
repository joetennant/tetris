/**
 * Core Type Definitions for Tetris Clone
 * 
 * This file defines all TypeScript types and interfaces for the game.
 * These contracts serve as the single source of truth for type safety.
 */

// ============================================================================
// Enumerations
// ============================================================================

/**
 * The seven standard Tetris tetromino shapes per Tetris Guideline
 */
export type TetrominoType = 'I' | 'J' | 'L' | 'O' | 'S' | 'T' | 'Z';

/**
 * Game status states
 */
export const GameStatus = {
  READY: 'ready',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver'
} as const;

export type GameStatus = typeof GameStatus[keyof typeof GameStatus];

/**
 * Player input commands
 */
export const Input = {
  MOVE_LEFT: 'moveLeft',
  MOVE_RIGHT: 'moveRight',
  ROTATE_CW: 'rotateCW',
  ROTATE_CCW: 'rotateCCW',
  SOFT_DROP: 'softDrop',
  HARD_DROP: 'hardDrop',
  HOLD: 'hold',
  PAUSE: 'pause',
  RESTART: 'restart'
} as const;

export type Input = typeof Input[keyof typeof Input];

/**
 * Rotation direction
 */
export const RotationDirection = {
  CLOCKWISE: 1,
  COUNTER_CLOCKWISE: -1
} as const;

export type RotationDirection = typeof RotationDirection[keyof typeof RotationDirection];

// ============================================================================
// Position & Grid
// ============================================================================

/**
 * A position in the playfield grid
 */
export interface Position {
  row: number;  // 0-39 (0-19 buffer zone, 20-39 visible area)
  col: number;  // 0-9
}

/**
 * A single cell in the playfield grid
 */
export interface Cell {
  isEmpty: boolean;
  color: string | null;  // Hex color if occupied, null if empty
}

// ============================================================================
// Tetromino
// ============================================================================

/**
 * A tetromino piece with its current state
 */
export interface Tetromino {
  type: TetrominoType;
  rotation: number;        // 0-3
  position: Position;
  matrix: boolean[][];     // Shape representation (true = filled block)
  color: string;          // Hex color code
}

/**
 * Rotation state data for a tetromino type
 * Contains all 4 rotation matrices and spawn position
 */
export interface RotationState {
  matrices: boolean[][][];  // 4 matrices, one per rotation
  spawnRow: number;
  spawnCol: number;
}

/**
 * Map of tetromino types to their rotation states
 */
export type RotationStates = {
  [key in TetrominoType]: RotationState;
};

// ============================================================================
// Wall Kicks (SRS)
// ============================================================================

/**
 * Wall kick offset [dx, dy]
 */
export type KickOffset = [number, number];

/**
 * Table of kick offsets for rotation transitions
 * Key format: "0→1", "1→2", etc.
 */
export type KickTable = {
  [key: string]: KickOffset[];
};

/**
 * SRS wall kick data for all tetromino types
 */
export interface WallKickData {
  normal: KickTable;  // For J, L, S, T, Z
  i: KickTable;       // Unique kicks for I piece
}

// ============================================================================
// Playfield
// ============================================================================

/**
 * The game board
 */
export interface Playfield {
  grid: Cell[][];          // 40 rows x 10 columns
  width: number;           // Always 10
  height: number;          // Always 40 (20 visible + 20 buffer)
  visibleHeight: number;   // Always 20
}

// ============================================================================
// Game State
// ============================================================================

/**
 * Complete game state
 */
export interface GameState {
  playfield: Playfield;
  currentPiece: Tetromino | null;
  heldPiece: Tetromino | null;
  nextPieces: Tetromino[];
  canHold: boolean;
  score: number;
  level: number;
  linesCleared: number;
  gameStatus: GameStatus;
  fallSpeed: number;         // ms between automatic drops
  lockDelay: number;         // ms before piece locks
  lockResets: number;        // count of lock delay resets this piece
  lastDropTime: number;      // timestamp of last automatic drop
  lastLockMoveTime: number;  // timestamp of last move that reset lock
}

// ============================================================================
// Scoring
// ============================================================================

/**
 * Score values for different actions
 */
export interface ScoreValues {
  SINGLE: number;    // 1 line
  DOUBLE: number;    // 2 lines
  TRIPLE: number;    // 3 lines
  TETRIS: number;    // 4 lines
  SOFT_DROP: number; // Per cell
  HARD_DROP: number; // Per cell
}

/**
 * Line clear result
 */
export interface LineClearResult {
  linesCleared: number;
  baseScore: number;
}

// ============================================================================
// Game Configuration
// ============================================================================

/**
 * Configuration constants
 */
export interface GameConfig {
  PLAYFIELD_WIDTH: number;
  PLAYFIELD_HEIGHT: number;
  VISIBLE_HEIGHT: number;
  BUFFER_HEIGHT: number;
  
  INITIAL_LEVEL: number;
  LINES_PER_LEVEL: number;
  
  BASE_FALL_SPEED: number;    // ms at level 1
  FALL_SPEED_MULTIPLIER: number; // speed increase per level
  
  LOCK_DELAY: number;         // ms
  MAX_LOCK_RESETS: number;
  
  NEXT_PIECES_COUNT: number;  // How many pieces to show in preview
}

// ============================================================================
// Public API Interfaces
// ============================================================================

/**
 * Game controller public API
 */
export interface IGameController {
  // State access
  getState(): Readonly<GameState>;
  
  // Game lifecycle
  start(): void;
  pause(): void;
  resume(): void;
  restart(): void;
  
  // Input handling
  handleInput(input: Input): void;
  
  // Game loop (called by animation frame)
  update(deltaTime: number): void;
}

/**
 * Playfield operations API
 */
export interface IPlayfield {
  isValidPosition(tetromino: Tetromino, position: Position): boolean;
  lockPiece(tetromino: Tetromino): void;
  detectCompletedLines(): number[];
  clearLines(rows: number[]): void;
  isGameOver(): boolean;
  getGrid(): Readonly<Cell[][]>;
}

/**
 * Tetromino controller API
 */
export interface ITetrominoController {
  rotate(tetromino: Tetromino, direction: RotationDirection): Tetromino | null;
  move(tetromino: Tetromino, dx: number, dy: number): Tetromino | null;
  hardDrop(tetromino: Tetromino): { tetromino: Tetromino; distance: number };
  calculateGhostPosition(tetromino: Tetromino): Position;
}

/**
 * Randomizer API (7-bag)
 */
export interface IRandomizer {
  next(): TetrominoType;
  peek(count: number): TetrominoType[];
  reset(): void;
}

/**
 * Score manager API
 */
export interface IScoreManager {
  calculateLineScore(linesCleared: number, level: number): number;
  calculateDropScore(distance: number, isHardDrop: boolean): number;
  calculateFallSpeed(level: number): number;
  shouldLevelUp(linesCleared: number, currentLevel: number): boolean;
}

// ============================================================================
// React Hook Interfaces
// ============================================================================

/**
 * Game state hook return type
 */
export interface UseGameStateReturn {
  gameState: GameState;
  handleInput: (input: Input) => void;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
}

/**
 * Game loop hook callback signature
 */
export type GameLoopCallback = (deltaTime: number, elapsedTime: number) => void;

/**
 * Keyboard hook return type
 */
export interface UseKeyboardReturn {
  isKeyPressed: (key: string) => boolean;
  getKeysPressed: () => string[];
}
