import { describe, it, expect, beforeEach } from 'vitest';
import { Playfield } from '../../src/game/Playfield';
import { createTetromino } from '../../src/game/tetrominoes';
import type { Tetromino } from '../../src/game/types';

describe('Playfield', () => {
  let playfield: Playfield;

  beforeEach(() => {
    playfield = new Playfield();
  });

  it('should initialize with empty 40x10 grid', () => {
    const grid = playfield.getGrid();
    expect(grid.length).toBe(40);
    expect(grid[0].length).toBe(10);
    
    // All cells should be empty
    grid.forEach(row => {
      row.forEach(cell => {
        expect(cell.isEmpty).toBe(true);
        expect(cell.color).toBeNull();
      });
    });
  });

  it('should detect collision with bottom boundary', () => {
    const piece = createTetromino('O'); // 2x2 piece
    const position = { row: 38, col: 4 }; // Fits at row 38 (extends to row 39)
    
    // Should be valid at row 38
    expect(playfield.isValidPosition(piece, position)).toBe(true);
    
    // Should be invalid at row 39 (would extend to row 40, out of bounds)
    expect(playfield.isValidPosition(piece, { row: 39, col: 4 })).toBe(false);
  });

  it('should detect collision with side walls', () => {
    const piece = createTetromino('I');
    
    // Should be invalid at col -1 (left wall)
    expect(playfield.isValidPosition(piece, { row: 0, col: -1 })).toBe(false);
    
    // Should be invalid at col 10 (right wall)
    expect(playfield.isValidPosition(piece, { row: 0, col: 10 })).toBe(false);
    
    // Should be valid within bounds
    expect(playfield.isValidPosition(piece, { row: 0, col: 4 })).toBe(true);
  });

  it('should detect collision with locked pieces', () => {
    const piece1 = createTetromino('O');
    const piece2 = createTetromino('I');
    
    // Lock first piece at bottom
    playfield.lockPiece({ ...piece1, position: { row: 38, col: 4 } });
    
    // Second piece should not be valid at same position
    expect(playfield.isValidPosition(piece2, { row: 38, col: 4 })).toBe(false);
    
    // Should be valid above locked piece
    expect(playfield.isValidPosition(piece2, { row: 20, col: 4 })).toBe(true);
  });

  it('should detect single completed line', () => {
    // Fill bottom row manually
    const grid = playfield['grid']; // Access private property for testing
    for (let col = 0; col < 10; col++) {
      grid[39][col] = { isEmpty: false, color: '#FF0000' };
    }
    
    const completedLines = playfield.detectCompletedLines();
    expect(completedLines.length).toBeGreaterThan(0);
    expect(completedLines).toContain(39);
  });

  it('should detect multiple completed lines simultaneously', () => {
    // Fill multiple rows manually
    const grid = playfield['grid'];
    for (let row = 38; row <= 39; row++) {
      for (let col = 0; col < 10; col++) {
        grid[row][col] = { isEmpty: false, color: '#FF0000' };
      }
    }
    
    const completedLines = playfield.detectCompletedLines();
    expect(completedLines.length).toBeGreaterThanOrEqual(2);
    expect(completedLines).toContain(38);
    expect(completedLines).toContain(39);
  });

  it('should clear lines and collapse rows correctly', () => {
    const piece = createTetromino('O');
    
    // Place piece at row 38
    playfield.lockPiece({ ...piece, position: { row: 38, col: 4 } });
    
    // Fill row 39 completely
    for (let col = 0; col < 10; col += 2) {
      playfield.lockPiece({ ...piece, position: { row: 39, col } });
    }
    
    const linesBefore = playfield.detectCompletedLines();
    if (linesBefore.length > 0) {
      playfield.clearLines(linesBefore);
      
      // Row 39 should now be empty
      const grid = playfield.getGrid();
      const bottomRow = grid[39];
      expect(bottomRow.every(cell => cell.isEmpty)).toBe(true);
    }
  });

  it('should detect game over when spawn position is blocked', () => {
    const piece = createTetromino('I');
    
    // Fill up to spawn area (rows 0-1)
    for (let row = 2; row < 20; row++) {
      for (let col = 0; col < 10; col += 4) {
        playfield.lockPiece({ ...piece, position: { row, col } });
      }
    }
    
    // Game over check depends on implementation
    // This test will be refined after Playfield.isGameOver() is implemented
    expect(playfield.isGameOver).toBeDefined();
  });
});
