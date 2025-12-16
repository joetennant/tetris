/**
 * 7-Bag Randomizer for Tetris
 * 
 * Implements the official Tetris Guideline randomizer that ensures
 * all 7 tetromino types appear exactly once before any repeats.
 */

import type { TetrominoType } from './types';
import { ALL_TETROMINO_TYPES } from './constants';

export class SevenBagRandomizer {
  private bag: TetrominoType[] = [];

  constructor() {
    this.refillBag();
  }

  /**
   * Get the next tetromino type from the bag
   * Refills bag automatically when empty
   */
  next(): TetrominoType {
    if (this.bag.length === 0) {
      this.refillBag();
    }
    return this.bag.pop()!;
  }

  /**
   * Peek at upcoming pieces without removing them
   */
  peek(count: number): TetrominoType[] {
    const result: TetrominoType[] = [];
    const tempBag = [...this.bag];
    
    for (let i = 0; i < count; i++) {
      if (tempBag.length === 0) {
        // Simulate refill
        tempBag.push(...this.shuffle([...ALL_TETROMINO_TYPES]));
      }
      result.push(tempBag.pop()!);
    }
    
    return result;
  }

  /**
   * Reset the randomizer (for new game)
   */
  reset(): void {
    this.bag = [];
    this.refillBag();
  }

  /**
   * Refill the bag with all 7 pieces in random order
   */
  private refillBag(): void {
    this.bag = this.shuffle([...ALL_TETROMINO_TYPES]);
  }

  /**
   * Fisher-Yates shuffle algorithm
   */
  private shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
}
