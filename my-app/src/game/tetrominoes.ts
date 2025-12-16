/**
 * Tetromino factory functions
 * 
 * Creates tetromino instances using shapes and colors from constants
 */

import type { Tetromino, TetrominoType, Position } from './types';
import {
  TETROMINO_SHAPES,
  TETROMINO_COLORS,
  SPAWN_POSITIONS,
} from './constants';

/**
 * Create a new tetromino at its spawn position
 */
export function createTetromino(type: TetrominoType): Tetromino {
  const spawnPos = SPAWN_POSITIONS[type];
  const matrix = TETROMINO_SHAPES[type][0]; // Rotation 0 (spawn orientation)
  const color = TETROMINO_COLORS[type];

  return {
    type,
    rotation: 0,
    position: { row: spawnPos.row, col: spawnPos.col },
    matrix,
    color,
  };
}

/**
 * Create a tetromino at a specific position and rotation
 */
export function createTetrominoAt(
  type: TetrominoType,
  position: Position,
  rotation: number = 0
): Tetromino {
  const matrix = TETROMINO_SHAPES[type][rotation];
  const color = TETROMINO_COLORS[type];

  return {
    type,
    rotation,
    position: { ...position },
    matrix,
    color,
  };
}

/**
 * Get the rotation matrix for a specific type and rotation state
 */
export function getRotationMatrix(
  type: TetrominoType,
  rotation: number
): boolean[][] {
  return TETROMINO_SHAPES[type][rotation];
}

/**
 * Clone a tetromino (useful for immutable updates)
 */
export function cloneTetromino(tetromino: Tetromino): Tetromino {
  return {
    ...tetromino,
    position: { ...tetromino.position },
    matrix: tetromino.matrix.map(row => [...row]),
  };
}
