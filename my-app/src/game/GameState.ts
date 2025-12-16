/**
 * Game State Manager
 * 
 * Central coordinator for game logic, manages pieces, scoring,
 * level progression, and game loop updates.
 */

import type { GameState, Tetromino, Input as InputType, IPlayfield } from './types';
import { GameStatus, Input, RotationDirection } from './types';
import { Playfield } from './Playfield';
import { TetrominoController } from './TetrominoController';
import { SevenBagRandomizer } from './Randomizer';
import { createTetromino } from './tetrominoes';
import { GAME_CONFIG, SCORE_VALUES } from './constants';

export class GameStateManager {
  private state: GameState;
  private playfield: IPlayfield;
  private controller: TetrominoController;
  private randomizer: SevenBagRandomizer;

  constructor() {
    this.playfield = new Playfield();
    this.controller = new TetrominoController(this.playfield);
    this.randomizer = new SevenBagRandomizer();
    this.state = this.createInitialState();
  }

  /**
   * Create initial game state
   */
  private createInitialState(): GameState {
    const nextPieces: Tetromino[] = [];
    for (let i = 0; i < GAME_CONFIG.NEXT_PIECES_COUNT + 1; i++) {
      nextPieces.push(createTetromino(this.randomizer.next()));
    }

    return {
      playfield: this.playfield,
      currentPiece: null,
      heldPiece: null,
      nextPieces,
      canHold: true,
      score: 0,
      level: GAME_CONFIG.INITIAL_LEVEL,
      linesCleared: 0,
      gameStatus: GameStatus.READY,
      fallSpeed: GAME_CONFIG.BASE_FALL_SPEED,
      lockDelay: GAME_CONFIG.LOCK_DELAY,
      lockResets: 0,
      lastDropTime: 0,
      lastLockMoveTime: 0,
    };
  }

  /**
   * Get current game state (read-only)
   */
  getState(): Readonly<GameState> {
    return this.state;
  }

  /**
   * Start new game
   */
  start(): void {
    this.playfield.reset();
    this.randomizer.reset();
    this.state = this.createInitialState();
    this.spawnPiece();
    this.state.gameStatus = GameStatus.PLAYING;
  }

  /**
   * Pause game
   */
  pause(): void {
    if (this.state.gameStatus === GameStatus.PLAYING) {
      this.state.gameStatus = GameStatus.PAUSED;
    }
  }

  /**
   * Resume game
   */
  resume(): void {
    if (this.state.gameStatus === GameStatus.PAUSED) {
      this.state.gameStatus = GameStatus.PLAYING;
    }
  }

  /**
   * Spawn next piece
   */
  private spawnPiece(): void {
    if (this.state.nextPieces.length === 0) {
      this.state.nextPieces.push(createTetromino(this.randomizer.next()));
    }

    this.state.currentPiece = this.state.nextPieces.shift()!;
    this.state.nextPieces.push(createTetromino(this.randomizer.next()));
    this.state.canHold = true;
    this.state.lockResets = 0;
    this.state.lastLockMoveTime = 0;

    // Check game over
    if (!this.playfield.isValidPosition(this.state.currentPiece, this.state.currentPiece.position)) {
      this.state.gameStatus = GameStatus.GAME_OVER;
    }
  }

  /**
   * Game loop update
   */
  update(deltaTime: number): void {
    if (this.state.gameStatus !== GameStatus.PLAYING || !this.state.currentPiece) {
      return;
    }

    // Automatic falling
    this.state.lastDropTime += deltaTime;
    if (this.state.lastDropTime >= this.state.fallSpeed) {
      this.dropPieceOneRow();
      this.state.lastDropTime = 0;
    }

    // Lock delay handling
    if (this.isPieceLanded()) {
      this.handleLockDelay(deltaTime);
    }
  }

  /**
   * Drop piece one row
   */
  private dropPieceOneRow(): void {
    if (!this.state.currentPiece) return;

    const moved = this.controller.move(this.state.currentPiece, 0, 1);
    if (moved) {
      this.state.currentPiece = moved;
    }
  }

  /**
   * Check if piece has landed
   */
  private isPieceLanded(): boolean {
    if (!this.state.currentPiece) return false;
    
    const below = this.controller.move(this.state.currentPiece, 0, 1);
    return below === null;
  }

  /**
   * Handle lock delay timing
   */
  handleLockDelay(deltaTime: number): void {
    if (!this.state.currentPiece) return;

    this.state.lastLockMoveTime += deltaTime;

    if (this.state.lastLockMoveTime >= this.state.lockDelay) {
      this.lockCurrentPiece();
    }
  }

  /**
   * Lock current piece
   */
  lockCurrentPiece(): void {
    if (!this.state.currentPiece) return;

    // Lock piece into playfield
    this.playfield.lockPiece(this.state.currentPiece);

    // Check for completed lines
    const completedLines = this.playfield.detectCompletedLines();
    if (completedLines.length > 0) {
      this.playfield.clearLines(completedLines);
      
      // Award score
      const lineScore = this.calculateLineScore(completedLines.length);
      this.state.score += lineScore;
      this.state.linesCleared += completedLines.length;

      // Check for level up
      const newLevel = Math.floor(this.state.linesCleared / GAME_CONFIG.LINES_PER_LEVEL) + 1;
      if (newLevel > this.state.level) {
        this.state.level = newLevel;
        this.state.fallSpeed = this.calculateFallSpeed(this.state.level);
      }
    }

    // Spawn next piece
    this.spawnPiece();
  }

  /**
   * Calculate score for line clears
   */
  private calculateLineScore(linesCleared: number): number {
    const baseScores: Record<number, number> = {
      1: SCORE_VALUES.SINGLE,
      2: SCORE_VALUES.DOUBLE,
      3: SCORE_VALUES.TRIPLE,
      4: SCORE_VALUES.TETRIS,
    };

    const baseScore = baseScores[linesCleared] || 0;
    return baseScore * this.state.level;
  }

  /**
   * Calculate fall speed for level
   */
  private calculateFallSpeed(level: number): number {
    return GAME_CONFIG.BASE_FALL_SPEED * Math.pow(GAME_CONFIG.FALL_SPEED_MULTIPLIER, level - 1);
  }

  /**
   * Handle player input
   */
  handleInput(input: InputType): void {
    if (this.state.gameStatus !== GameStatus.PLAYING || !this.state.currentPiece) {
      // Handle pause in any state
      if (input === Input.PAUSE) {
        if (this.state.gameStatus === GameStatus.PLAYING) {
          this.pause();
        } else if (this.state.gameStatus === GameStatus.PAUSED) {
          this.resume();
        }
      }
      return;
    }

    let moved = false;

    switch (input) {
      case Input.MOVE_LEFT:
        const movedLeft = this.controller.move(this.state.currentPiece, -1, 0);
        if (movedLeft) {
          this.state.currentPiece = movedLeft;
          moved = true;
        }
        break;

      case Input.MOVE_RIGHT:
        const movedRight = this.controller.move(this.state.currentPiece, 1, 0);
        if (movedRight) {
          this.state.currentPiece = movedRight;
          moved = true;
        }
        break;

      case Input.ROTATE_CW:
        const rotatedCW = this.controller.rotate(this.state.currentPiece, RotationDirection.CLOCKWISE);
        if (rotatedCW) {
          this.state.currentPiece = rotatedCW;
          moved = true;
        }
        break;

      case Input.ROTATE_CCW:
        const rotatedCCW = this.controller.rotate(this.state.currentPiece, RotationDirection.COUNTER_CLOCKWISE);
        if (rotatedCCW) {
          this.state.currentPiece = rotatedCCW;
          moved = true;
        }
        break;

      case Input.SOFT_DROP:
        const droppedSoft = this.controller.move(this.state.currentPiece, 0, 1);
        if (droppedSoft) {
          this.state.currentPiece = droppedSoft;
          this.state.score += SCORE_VALUES.SOFT_DROP;
        }
        break;

      case Input.HARD_DROP:
        const result = this.controller.hardDrop(this.state.currentPiece);
        this.state.currentPiece = result.tetromino;
        this.state.score += result.distance * SCORE_VALUES.HARD_DROP;
        this.lockCurrentPiece();
        break;

      case Input.HOLD:
        this.handleHold();
        break;

      case Input.PAUSE:
        this.pause();
        break;

      case Input.RESTART:
        this.start();
        break;
    }

    // Reset lock delay if piece moved/rotated
    if (moved && this.isPieceLanded()) {
      if (this.state.lockResets < GAME_CONFIG.MAX_LOCK_RESETS) {
        this.state.lastLockMoveTime = 0;
        this.state.lockResets++;
      }
    }
  }

  /**
   * Handle hold/swap mechanic
   */
  private handleHold(): void {
    if (!this.state.canHold || !this.state.currentPiece) return;

    if (this.state.heldPiece === null) {
      // Store current piece and spawn next
      this.state.heldPiece = createTetromino(this.state.currentPiece.type);
      this.spawnPiece();
    } else {
      // Swap current and held
      const temp = this.state.currentPiece.type;
      this.state.currentPiece = createTetromino(this.state.heldPiece.type);
      this.state.heldPiece = createTetromino(temp);
    }

    this.state.canHold = false;
  }
}
