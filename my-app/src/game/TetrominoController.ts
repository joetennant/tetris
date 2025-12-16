/**
 * Tetromino Controller - Piece Movement and Rotation
 * 
 * Handles piece movement, rotation with SRS (Super Rotation System),
 * wall kicks, and hard drop functionality.
 */

import type { Tetromino, RotationDirection, Position, IPlayfield } from './types';
import { SRS_WALL_KICKS, TETROMINO_SHAPES } from './constants';
// import { cloneTetromino } from './tetrominoes';

export class TetrominoController {
  private playfield: IPlayfield;
  
  constructor(playfield: IPlayfield) {
    this.playfield = playfield;
  }

  /**
   * Rotate tetromino with SRS wall kicks
   */
  rotate(
    tetromino: Tetromino,
    direction: RotationDirection
  ): Tetromino | null {
    const newRotation = (tetromino.rotation + direction + 4) % 4;
    const newMatrix = TETROMINO_SHAPES[tetromino.type][newRotation];

    // Get appropriate kick table
    const kicks =
      tetromino.type === 'I' ? SRS_WALL_KICKS.i : SRS_WALL_KICKS.normal;

    // Build kick key (e.g., "0→1" or "1→0")
    const fromRot = tetromino.rotation;
    const toRot = newRotation;
    
    // For counter-clockwise, we need reverse mapping
    const key =
      direction === 1
        ? `${fromRot}→${toRot}`
        : `${toRot}→${fromRot}`;

    const kickOffsets = kicks[key as keyof typeof kicks];

    if (!kickOffsets) {
      // Fallback: try without kicks
      if (
        this.playfield.isValidPosition(
          { ...tetromino, matrix: newMatrix },
          tetromino.position
        )
      ) {
        return {
          ...tetromino,
          rotation: newRotation,
          matrix: newMatrix,
        };
      }
      return null;
    }

    // Try each kick offset in sequence
    for (const [dx, dy] of kickOffsets) {
      const testPos: Position = {
        row: tetromino.position.row - dy, // Note: dy is inverted in SRS
        col: tetromino.position.col + dx,
      };

      if (
        this.playfield.isValidPosition(
          { ...tetromino, matrix: newMatrix },
          testPos
        )
      ) {
        return {
          ...tetromino,
          rotation: newRotation,
          position: testPos,
          matrix: newMatrix,
        };
      }
    }

    // All kicks failed
    return null;
  }

  /**
   * Move tetromino by offset (dx, dy)
   */
  move(tetromino: Tetromino, dx: number, dy: number): Tetromino | null {
    const newPosition: Position = {
      row: tetromino.position.row + dy,
      col: tetromino.position.col + dx,
    };

    if (this.playfield.isValidPosition(tetromino, newPosition)) {
      return {
        ...tetromino,
        position: newPosition,
      };
    }

    return null;
  }

  /**
   * Hard drop: instantly drop to lowest valid position
   */
  hardDrop(tetromino: Tetromino): { tetromino: Tetromino; distance: number } {
    let dropDistance = 0;
    let currentPos = { ...tetromino.position };

    // Drop until collision
    while (
      this.playfield.isValidPosition(tetromino, {
        row: currentPos.row + 1,
        col: currentPos.col,
      })
    ) {
      currentPos.row++;
      dropDistance++;
    }

    return {
      tetromino: {
        ...tetromino,
        position: currentPos,
      },
      distance: dropDistance,
    };
  }

  /**
   * Calculate ghost piece position (preview of where piece will land)
   */
  calculateGhostPosition(tetromino: Tetromino): Position {
    const result = this.hardDrop(tetromino);
    return result.tetromino.position;
  }
}
