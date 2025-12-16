/**
 * Playfield - Game Board Management
 * 
 * Manages the 40x10 grid (20 visible + 20 buffer rows),
 * collision detection, line clearing, and game over detection.
 */

import type { Cell, Tetromino, Position } from './types';
import { GAME_CONFIG } from './constants';

export class Playfield {
  private grid: Cell[][];
  public readonly width = GAME_CONFIG.PLAYFIELD_WIDTH;
  public readonly height = GAME_CONFIG.PLAYFIELD_HEIGHT;
  public readonly visibleHeight = GAME_CONFIG.VISIBLE_HEIGHT;

  constructor() {
    this.grid = this.initializeGrid();
  }

  /**
   * Initialize empty grid
   */
  private initializeGrid(): Cell[][] {
    const grid: Cell[][] = [];
    for (let row = 0; row < this.height; row++) {
      grid[row] = [];
      for (let col = 0; col < this.width; col++) {
        grid[row][col] = {
          isEmpty: true,
          color: null,
        };
      }
    }
    return grid;
  }

  /**
   * Get read-only grid for rendering
   */
  getGrid(): Readonly<Cell[][]> {
    return this.grid;
  }

  /**
   * Check if tetromino can be placed at position without collision
   */
  isValidPosition(tetromino: Tetromino, position: Position): boolean {
    const { matrix } = tetromino;
    const { row, col } = position;

    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x]) {
          const gridRow = row + y;
          const gridCol = col + x;

          // Check boundaries
          if (
            gridRow < 0 ||
            gridRow >= this.height ||
            gridCol < 0 ||
            gridCol >= this.width
          ) {
            return false;
          }

          // Check collision with locked pieces
          if (!this.grid[gridRow][gridCol].isEmpty) {
            return false;
          }
        }
      }
    }

    return true;
  }

  /**
   * Lock tetromino into grid
   */
  lockPiece(tetromino: Tetromino): void {
    const { matrix, position, color } = tetromino;

    for (let y = 0; y < matrix.length; y++) {
      for (let x = 0; x < matrix[y].length; x++) {
        if (matrix[y][x]) {
          const gridRow = position.row + y;
          const gridCol = position.col + x;

          if (
            gridRow >= 0 &&
            gridRow < this.height &&
            gridCol >= 0 &&
            gridCol < this.width
          ) {
            this.grid[gridRow][gridCol] = {
              isEmpty: false,
              color,
            };
          }
        }
      }
    }
  }

  /**
   * Detect completed lines (full rows)
   */
  detectCompletedLines(): number[] {
    const completedLines: number[] = [];

    for (let row = 0; row < this.height; row++) {
      const isComplete = this.grid[row].every(cell => !cell.isEmpty);
      if (isComplete) {
        completedLines.push(row);
      }
    }

    return completedLines;
  }

  /**
   * Clear lines and collapse rows above
   */
  clearLines(rowIndices: number[]): void {
    if (rowIndices.length === 0) return;

    // Sort rows from bottom to top
    const sortedRows = [...rowIndices].sort((a, b) => b - a);

    // Remove completed rows
    for (const row of sortedRows) {
      this.grid.splice(row, 1);
    }

    // Add empty rows at top
    for (let i = 0; i < rowIndices.length; i++) {
      const emptyRow: Cell[] = [];
      for (let col = 0; col < this.width; col++) {
        emptyRow.push({ isEmpty: true, color: null });
      }
      this.grid.unshift(emptyRow);
    }
  }

  /**
   * Check if game is over (spawn position blocked)
   */
  isGameOver(): boolean {
    // Check if spawn rows (0-2) in center columns have any locked pieces
    const spawnRows = [0, 1, 2];
    const spawnCols = [3, 4, 5, 6]; // Center columns

    for (const row of spawnRows) {
      for (const col of spawnCols) {
        if (!this.grid[row][col].isEmpty) {
          return true;
        }
      }
    }

    return false;
  }

  /**
   * Reset playfield (for new game)
   */
  reset(): void {
    this.grid = this.initializeGrid();
  }
}
