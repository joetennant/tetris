import { describe, it, expect, beforeEach } from 'vitest';
import { SevenBagRandomizer } from '../../src/game/Randomizer';
import { ALL_TETROMINO_TYPES } from '../../src/game/constants';

describe('SevenBagRandomizer', () => {
  let randomizer: SevenBagRandomizer;

  beforeEach(() => {
    randomizer = new SevenBagRandomizer();
  });

  it('should initialize without errors', () => {
    expect(randomizer).toBeDefined();
  });

  it('should return a tetromino type on next()', () => {
    const piece = randomizer.next();
    expect(ALL_TETROMINO_TYPES).toContain(piece);
  });

  it('should ensure all 7 pieces appear once per 7 draws (7-bag fairness)', () => {
    const firstBag: string[] = [];
    
    // Draw 7 pieces
    for (let i = 0; i < 7; i++) {
      firstBag.push(randomizer.next());
    }
    
    // Check all 7 unique pieces appeared
    const uniquePieces = new Set(firstBag);
    expect(uniquePieces.size).toBe(7);
    
    // Verify each type appeared exactly once
    ALL_TETROMINO_TYPES.forEach(type => {
      expect(firstBag.filter(p => p === type).length).toBe(1);
    });
  });

  it('should refill bag after 7 draws and maintain fairness', () => {
    const pieces: string[] = [];
    
    // Draw 14 pieces (2 complete bags)
    for (let i = 0; i < 14; i++) {
      pieces.push(randomizer.next());
    }
    
    // Check first 7 and second 7 each contain all types
    const firstBag = pieces.slice(0, 7);
    const secondBag = pieces.slice(7, 14);
    
    expect(new Set(firstBag).size).toBe(7);
    expect(new Set(secondBag).size).toBe(7);
  });
});
