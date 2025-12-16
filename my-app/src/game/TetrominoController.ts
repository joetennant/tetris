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
   * Rotate tetromino with SRS (Super Rotation System) wall kicks
   * 
   * SRS Algorithm:
   * 1. Calculate new rotation state (0, 1, 2, or 3)
   * 2. Get the new piece matrix for that rotation
   * 3. Select appropriate wall kick table (I-piece has unique offsets)
   * 4. Try up to 5 positions in sequence:
   *    - Test 1: Basic rotation (no offset)
   *    - Test 2-5: Wall kick offsets (defined by SRS tables)
   * 5. Return first position that doesn't collide
   * 6. If all tests fail, rotation is not allowed
   * 
   * Wall Kicks:
   * - Allow pieces to "kick" off walls when rotating
   * - Enable advanced techniques like T-spins
   * - I-piece uses different offsets than other pieces
   * - Offsets depend on rotation direction (CW vs CCW)
   * 
   * References:
   * - https://tetris.wiki/Super_Rotation_System
   * - https://tetris.wiki/SRS#Wall_Kicks
   * 
   * @param tetromino - The piece to rotate
   * @param direction - 1 for clockwise, -1 for counter-clockwise
   * @returns Rotated piece with new position, or null if rotation blocked
   */
  rotate(
    tetromino: Tetromino,
    direction: RotationDirection
  ): Tetromino | null {
    // Calculate new rotation state (0-3)
    // +4 ensures positive result for modulo with negative numbers
    const newRotation = (tetromino.rotation + direction + 4) % 4;
    
    // Get the piece matrix for the new rotation
    const newMatrix = TETROMINO_SHAPES[tetromino.type][newRotation];

    // Select wall kick table
    // I-piece has different kick offsets than J, L, O, S, T, Z
    const kicks =
      tetromino.type === 'I' ? SRS_WALL_KICKS.i : SRS_WALL_KICKS.normal;

    // Build kick table key
    // Format: "0→1" (rotation 0 to 1), "2→3", etc.
    const fromRot = tetromino.rotation;
    const toRot = newRotation;
    
    // For counter-clockwise rotation, we use reverse mapping
    // CCW from 1 to 0 uses the same offsets as CW from 0 to 1
    const key =
      direction === 1
        ? `${fromRot}→${toRot}`  // Clockwise
        : `${toRot}→${fromRot}`;  // Counter-clockwise (reversed)

    const kickOffsets = kicks[key as keyof typeof kicks];

    if (!kickOffsets) {
      // No kick table found - try basic rotation without offset
      // This shouldn't happen with proper SRS tables, but provides fallback
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

    // Try each of the 5 wall kick tests in sequence
    // Test 1 is always (0, 0) - basic rotation
    // Tests 2-5 are the actual wall kicks
    for (const [dx, dy] of kickOffsets) {
      const testPos: Position = {
        // Note: dy is inverted in SRS specification
        // SRS uses +y as up, we use +y as down
        row: tetromino.position.row - dy,
        col: tetromino.position.col + dx,
      };

      // Test if piece fits at this position
      if (
        this.playfield.isValidPosition(
          { ...tetromino, matrix: newMatrix },
          testPos
        )
      ) {
        // Success! This kick works
        return {
          ...tetromino,
          rotation: newRotation,
          position: testPos,
          matrix: newMatrix,
        };
      }
    }

    // All 5 kicks failed - rotation not possible
    return null;
  }

  /**
   * Move tetromino by offset (dx, dy)
   * 
   * @param tetromino - The piece to move
   * @param dx - Horizontal offset (negative = left, positive = right)
   * @param dy - Vertical offset (negative = up, positive = down)
   * @returns Moved piece, or null if blocked by collision
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
   * 
   * Algorithm:
   * 1. Start at current position
   * 2. Check if piece can move down one row
   * 3. If yes, move down and increment distance counter
   * 4. Repeat until piece hits obstacle
   * 5. Return final position and distance dropped
   * 
   * @param tetromino - The piece to drop
   * @returns Object with final tetromino position and distance dropped
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
   * 
   * Uses hard drop algorithm to find landing position without actually
   * moving the piece. This shows the player where the piece will land
   * if they press hard drop.
   * 
   * @param tetromino - The piece to calculate ghost position for
   * @returns Position where piece would land
   */
  calculateGhostPosition(tetromino: Tetromino): Position {
    const result = this.hardDrop(tetromino);
    return result.tetromino.position;
  }
}
