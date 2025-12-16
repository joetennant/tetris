/**
 * Score Manager
 * 
 * Handles all scoring calculations and level progression logic
 * according to Tetris Guideline standards.
 */

import { GAME_CONFIG, SCORE_VALUES } from './constants';
import type { IScoreManager } from './types';

export class ScoreManager implements IScoreManager {
  /**
   * Calculate score for line clears
   * @param linesCleared Number of lines cleared (1-4)
   * @param level Current level
   * @returns Score to award
   */
  calculateLineScore(linesCleared: number, level: number): number {
    const baseScores: Record<number, number> = {
      1: SCORE_VALUES.SINGLE,   // 100
      2: SCORE_VALUES.DOUBLE,   // 300
      3: SCORE_VALUES.TRIPLE,   // 500
      4: SCORE_VALUES.TETRIS,   // 800
    };

    const baseScore = baseScores[linesCleared] || 0;
    return baseScore * level;
  }

  /**
   * Calculate score for drop actions
   * @param distance Number of cells dropped
   * @param isHardDrop Whether this is a hard drop (2 pts/cell) or soft drop (1 pt/cell)
   * @returns Score to award
   */
  calculateDropScore(distance: number, isHardDrop: boolean): number {
    if (distance <= 0) {
      return 0;
    }

    const pointsPerCell = isHardDrop ? SCORE_VALUES.HARD_DROP : SCORE_VALUES.SOFT_DROP;
    return distance * pointsPerCell;
  }

  /**
   * Calculate fall speed for a given level
   * @param level Current level
   * @returns Fall speed in milliseconds
   */
  calculateFallSpeed(level: number): number {
    // Speed decreases by 10% per level (multiplier = 0.9)
    // Level 1: 1000ms
    // Level 2: 900ms
    // Level 3: 810ms
    // etc.
    return GAME_CONFIG.BASE_FALL_SPEED * Math.pow(GAME_CONFIG.FALL_SPEED_MULTIPLIER, level - 1);
  }

  /**
   * Check if player should level up
   * @param linesCleared Total lines cleared so far
   * @param currentLevel Current level
   * @returns True if player should level up
   */
  shouldLevelUp(linesCleared: number, currentLevel: number): boolean {
    const expectedLevel = this.getLevel(linesCleared);
    return expectedLevel > currentLevel;
  }

  /**
   * Get the level based on total lines cleared
   * @param linesCleared Total lines cleared
   * @returns Current level (1-based)
   */
  getLevel(linesCleared: number): number {
    return Math.floor(linesCleared / GAME_CONFIG.LINES_PER_LEVEL) + 1;
  }
}
