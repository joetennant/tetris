/**
 * Unit Tests for ScoreManager
 * 
 * Tests the scoring formulas and level progression logic
 * according to Tetris Guideline standards.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { ScoreManager } from '../../src/game/ScoreManager';

describe('ScoreManager', () => {
  let scoreManager: ScoreManager;

  beforeEach(() => {
    scoreManager = new ScoreManager();
  });

  describe('calculateLineScore', () => {
    // T085: Single line awards 100 × level points
    it('should award 100 × level points for single line clear', () => {
      expect(scoreManager.calculateLineScore(1, 1)).toBe(100);
      expect(scoreManager.calculateLineScore(1, 2)).toBe(200);
      expect(scoreManager.calculateLineScore(1, 5)).toBe(500);
      expect(scoreManager.calculateLineScore(1, 10)).toBe(1000);
    });

    // T086: Double (2 lines) awards 300 × level points
    it('should award 300 × level points for double line clear', () => {
      expect(scoreManager.calculateLineScore(2, 1)).toBe(300);
      expect(scoreManager.calculateLineScore(2, 2)).toBe(600);
      expect(scoreManager.calculateLineScore(2, 5)).toBe(1500);
      expect(scoreManager.calculateLineScore(2, 10)).toBe(3000);
    });

    // T087: Triple (3 lines) awards 500 × level points
    it('should award 500 × level points for triple line clear', () => {
      expect(scoreManager.calculateLineScore(3, 1)).toBe(500);
      expect(scoreManager.calculateLineScore(3, 2)).toBe(1000);
      expect(scoreManager.calculateLineScore(3, 5)).toBe(2500);
      expect(scoreManager.calculateLineScore(3, 10)).toBe(5000);
    });

    // T088: Tetris (4 lines) awards 800 × level points
    it('should award 800 × level points for Tetris (4 lines)', () => {
      expect(scoreManager.calculateLineScore(4, 1)).toBe(800);
      expect(scoreManager.calculateLineScore(4, 2)).toBe(1600);
      expect(scoreManager.calculateLineScore(4, 5)).toBe(4000);
      expect(scoreManager.calculateLineScore(4, 10)).toBe(8000);
    });

    it('should return 0 for 0 or invalid line counts', () => {
      expect(scoreManager.calculateLineScore(0, 1)).toBe(0);
      expect(scoreManager.calculateLineScore(5, 1)).toBe(0);
      expect(scoreManager.calculateLineScore(-1, 1)).toBe(0);
    });
  });

  describe('calculateDropScore', () => {
    // T089: Soft drop awards 1 point per cell
    it('should award 1 point per cell for soft drop', () => {
      expect(scoreManager.calculateDropScore(1, false)).toBe(1);
      expect(scoreManager.calculateDropScore(5, false)).toBe(5);
      expect(scoreManager.calculateDropScore(10, false)).toBe(10);
      expect(scoreManager.calculateDropScore(20, false)).toBe(20);
    });

    // T090: Hard drop awards 2 points per cell
    it('should award 2 points per cell for hard drop', () => {
      expect(scoreManager.calculateDropScore(1, true)).toBe(2);
      expect(scoreManager.calculateDropScore(5, true)).toBe(10);
      expect(scoreManager.calculateDropScore(10, true)).toBe(20);
      expect(scoreManager.calculateDropScore(20, true)).toBe(40);
    });

    it('should return 0 for 0 or negative distance', () => {
      expect(scoreManager.calculateDropScore(0, false)).toBe(0);
      expect(scoreManager.calculateDropScore(0, true)).toBe(0);
      expect(scoreManager.calculateDropScore(-1, false)).toBe(0);
      expect(scoreManager.calculateDropScore(-1, true)).toBe(0);
    });
  });

  describe('shouldLevelUp', () => {
    // T097: Level increases at 10, 20, 30 lines cleared
    it('should return true when crossing 10-line threshold', () => {
      expect(scoreManager.shouldLevelUp(10, 1)).toBe(true);
      expect(scoreManager.shouldLevelUp(20, 2)).toBe(true);
      expect(scoreManager.shouldLevelUp(30, 3)).toBe(true);
      expect(scoreManager.shouldLevelUp(100, 10)).toBe(true);
    });

    it('should return false when not crossing threshold', () => {
      expect(scoreManager.shouldLevelUp(5, 1)).toBe(false);
      expect(scoreManager.shouldLevelUp(9, 1)).toBe(false);
      expect(scoreManager.shouldLevelUp(15, 2)).toBe(false);
      expect(scoreManager.shouldLevelUp(19, 2)).toBe(false);
    });

    it('should handle edge case at exactly 10 lines per level', () => {
      expect(scoreManager.shouldLevelUp(10, 1)).toBe(true);
      expect(scoreManager.shouldLevelUp(20, 2)).toBe(true);
      expect(scoreManager.shouldLevelUp(21, 2)).toBe(true);
    });
  });

  describe('calculateFallSpeed', () => {
    // T092: Fall speed decreases by 10% per level
    it('should decrease fall speed by 10% per level', () => {
      const baseSpeed = 1000; // 1 second base

      // Level 1: 1000ms
      expect(scoreManager.calculateFallSpeed(1)).toBe(1000);

      // Level 2: 1000 * 0.9 = 900ms
      expect(scoreManager.calculateFallSpeed(2)).toBe(900);

      // Level 3: 1000 * 0.9^2 = 810ms
      expect(scoreManager.calculateFallSpeed(3)).toBe(810);

      // Level 5: 1000 * 0.9^4 = 656.1ms
      expect(scoreManager.calculateFallSpeed(5)).toBeCloseTo(656.1, 1);

      // Level 10: 1000 * 0.9^9 ≈ 387.42ms
      expect(scoreManager.calculateFallSpeed(10)).toBeCloseTo(387.42, 1);
    });

    it('should handle level 1 as baseline', () => {
      expect(scoreManager.calculateFallSpeed(1)).toBe(1000);
    });

    it('should handle very high levels', () => {
      const speedLevel20 = scoreManager.calculateFallSpeed(20);
      const speedLevel21 = scoreManager.calculateFallSpeed(21);
      
      // Speed should keep decreasing
      expect(speedLevel21).toBeLessThan(speedLevel20);
      
      // Should still be positive
      expect(speedLevel20).toBeGreaterThan(0);
    });
  });

  describe('getLevel', () => {
    it('should calculate correct level from lines cleared', () => {
      expect(scoreManager.getLevel(0)).toBe(1);
      expect(scoreManager.getLevel(5)).toBe(1);
      expect(scoreManager.getLevel(9)).toBe(1);
      expect(scoreManager.getLevel(10)).toBe(2);
      expect(scoreManager.getLevel(15)).toBe(2);
      expect(scoreManager.getLevel(19)).toBe(2);
      expect(scoreManager.getLevel(20)).toBe(3);
      expect(scoreManager.getLevel(50)).toBe(6);
      expect(scoreManager.getLevel(100)).toBe(11);
    });
  });
});
