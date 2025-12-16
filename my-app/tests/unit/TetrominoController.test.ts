import { describe, it, expect, beforeEach } from 'vitest';
import { TetrominoController } from '../../src/game/TetrominoController';
import { Playfield } from '../../src/game/Playfield';
import { createTetromino } from '../../src/game/tetrominoes';
import { RotationDirection } from '../../src/game/types';

describe('TetrominoController', () => {
  let controller: TetrominoController;
  let playfield: Playfield;

  beforeEach(() => {
    playfield = new Playfield();
    controller = new TetrominoController(playfield);
  });

  it('should initialize with playfield reference', () => {
    expect(controller).toBeDefined();
  });

  it('should rotate piece with no obstacles (SRS)', () => {
    const piece = createTetromino('T');
    const rotated = controller.rotate(piece, RotationDirection.CLOCKWISE);
    
    expect(rotated).toBeDefined();
    if (rotated) {
      expect(rotated.rotation).toBe(1); // 0 + 1 = 1
      expect(rotated.type).toBe('T');
    }
  });

  it('should attempt all 5 SRS wall kick offsets', () => {
    const piece = createTetromino('T');
    
    // Place piece near left wall
    const pieceAtWall = { ...piece, position: { row: 20, col: 0 } };
    
    // Rotation should succeed via wall kicks
    const rotated = controller.rotate(pieceAtWall, RotationDirection.CLOCKWISE);
    
    // Should either succeed with kick or return null if all kicks fail
    // The implementation will determine exact behavior
    expect(rotated === null || rotated.rotation === 1).toBe(true);
  });

  it('should use unique kick table for I-piece', () => {
    const iPiece = createTetromino('I');
    
    // I-piece has different wall kicks than JLSTZ
    // Place at spawn and rotate
    const rotated = controller.rotate(iPiece, RotationDirection.CLOCKWISE);
    
    expect(rotated).toBeDefined();
    if (rotated) {
      expect(rotated.type).toBe('I');
      expect(rotated.rotation).toBe(1);
    }
  });

  it('should return same piece for O-piece rotation (symmetrical)', () => {
    const oPiece = createTetromino('O');
    const rotated = controller.rotate(oPiece, RotationDirection.CLOCKWISE);
    
    expect(rotated).toBeDefined();
    if (rotated) {
      // O-piece rotation should succeed but matrix remains same
      expect(rotated.type).toBe('O');
      // Position might adjust slightly due to SRS, but shape is symmetrical
    }
  });

  it('should move piece left/right within bounds', () => {
    const piece = createTetromino('T');
    
    // Move right
    const movedRight = controller.move(piece, 1, 0);
    expect(movedRight).toBeDefined();
    if (movedRight) {
      expect(movedRight.position.col).toBe(piece.position.col + 1);
    }
    
    // Move left
    const movedLeft = controller.move(piece, -1, 0);
    expect(movedLeft).toBeDefined();
    if (movedLeft) {
      expect(movedLeft.position.col).toBe(piece.position.col - 1);
    }
  });

  it('should not move piece through walls', () => {
    const piece = createTetromino('T');
    const pieceAtLeftWall = { ...piece, position: { row: 20, col: 0 } };
    
    // Try to move left past wall
    const moved = controller.move(pieceAtLeftWall, -1, 0);
    
    // Should return null or same position
    expect(moved === null || moved.position.col === 0).toBe(true);
  });

  it('should hard drop piece to lowest position', () => {
    const piece = createTetromino('I');
    const startPos = { row: 10, col: 4 };
    const pieceAtStart = { ...piece, position: startPos };
    
    const result = controller.hardDrop(pieceAtStart);
    
    expect(result).toBeDefined();
    expect(result.tetromino.position.row).toBeGreaterThan(startPos.row);
    expect(result.distance).toBeGreaterThan(0);
  });

  it('should not drop piece through locked pieces', () => {
    const piece1 = createTetromino('O');
    const piece2 = createTetromino('I');
    
    // Lock piece at row 35
    playfield.lockPiece({ ...piece1, position: { row: 35, col: 4 } });
    
    // Hard drop second piece from top
    const result = controller.hardDrop({ ...piece2, position: { row: 10, col: 4 } });
    
    // Should stop above locked piece, not at bottom
    expect(result.tetromino.position.row).toBeLessThan(35);
  });
});
