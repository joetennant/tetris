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
import { ScoreManager } from './ScoreManager';
import { createTetromino } from './tetrominoes';
import { GAME_CONFIG } from './constants';
import { soundManager } from './SoundManager';

export class GameStateManager {
  private state: GameState;
  private playfield: IPlayfield;
  private controller: TetrominoController;
  private randomizer: SevenBagRandomizer;
  private scoreManager: ScoreManager;

  constructor() {
    this.playfield = new Playfield();
    this.controller = new TetrominoController(this.playfield);
    this.randomizer = new SevenBagRandomizer();
    this.scoreManager = new ScoreManager();
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
      debugMode: false,
      clearingLines: [],
      clearingLineCount: 0,
      lockingPiece: false,
      ghostPieceVisible: true,
      droppingRows: new Map(),
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
    soundManager.startMusic(this.state.fallSpeed);
  }

  /**
   * Pause game
   */
  pause(): void {
    if (this.state.gameStatus === GameStatus.PLAYING) {
      this.state.gameStatus = GameStatus.PAUSED;
      soundManager.stopMusic();
    }
  }

  /**
   * Resume game
   */
  resume(): void {
    if (this.state.gameStatus === GameStatus.PAUSED) {
      this.state.gameStatus = GameStatus.PLAYING;
      soundManager.startMusic(this.state.fallSpeed);
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

    // Check game over at spawn position
    if (!this.playfield.isValidPosition(this.state.currentPiece, this.state.currentPiece.position)) {
      this.state.currentPiece = null; // Clear current piece to prevent rendering issues
      this.state.gameStatus = GameStatus.GAME_OVER;
      soundManager.stopMusic();
      soundManager.playGameOver();
      return;
    }

    // Tetris Guideline: Piece must "move down immediately after appearing"
    const movedDown = this.controller.move(this.state.currentPiece, 0, 1);
    if (movedDown) {
      this.state.currentPiece = movedDown;
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

    // Show lock animation in the last 200ms before locking
    if (this.state.lastLockMoveTime >= this.state.lockDelay - 200 && 
        this.state.lastLockMoveTime < this.state.lockDelay) {
      this.state.lockingPiece = true;
    }

    if (this.state.lastLockMoveTime >= this.state.lockDelay) {
      this.lockCurrentPiece();
    }
  }

  /**
   * Lock current piece
   */
  lockCurrentPiece(): void {
    if (!this.state.currentPiece) return;

    // Tetris Guideline: Check if piece locks completely above visible area (row 20)
    // Game over if ALL blocks of piece are in buffer zone (rows 0-19)
    const piece = this.state.currentPiece;
    let lowestBlockRow = -1; // Lowest block = highest row number
    
    for (let r = 0; r < piece.matrix.length; r++) {
      for (let c = 0; c < piece.matrix[r].length; c++) {
        if (piece.matrix[r][c]) {
          const actualRow = piece.position.row + r;
          // Track the lowest block (highest row number)
          if (lowestBlockRow === -1 || actualRow > lowestBlockRow) {
            lowestBlockRow = actualRow;
          }
        }
      }
    }

    // If even the lowest block is above row 20, entire piece is in buffer zone
    if (lowestBlockRow !== -1 && lowestBlockRow < 20) {
      this.playfield.lockPiece(this.state.currentPiece);
      this.state.currentPiece = null; // Clear current piece to prevent rendering issues
      this.state.gameStatus = GameStatus.GAME_OVER;
      soundManager.stopMusic();
      soundManager.playGameOver();
      return;
    }

    // Reset locking animation
    this.state.lockingPiece = false;

    // Lock piece into playfield
    this.playfield.lockPiece(this.state.currentPiece);
    soundManager.playLand();

    // Check for completed lines
    const completedLines = this.playfield.detectCompletedLines();
    if (completedLines.length > 0) {
      // Mark lines as clearing for animation
      this.state.clearingLines = completedLines;
      this.state.clearingLineCount = completedLines.length;
      
      // Play appropriate line clear sound
      if (completedLines.length === 4) {
        soundManager.playTetris();
      } else if (completedLines.length === 3) {
        soundManager.playTripleLineClear();
      } else if (completedLines.length === 2) {
        soundManager.playDoubleLineClear();
      } else {
        soundManager.playLineClear();
      }
      
      // Award score immediately
      const lineScore = this.scoreManager.calculateLineScore(completedLines.length, this.state.level);
      this.state.score += lineScore;
      const previousLevel = this.state.level;
      this.state.linesCleared += completedLines.length;

      // Check for level up
      if (this.scoreManager.shouldLevelUp(this.state.linesCleared, this.state.level)) {
        this.state.level = this.scoreManager.getLevel(this.state.linesCleared);
        this.state.fallSpeed = this.scoreManager.calculateFallSpeed(this.state.level);
        soundManager.updateMusicTempo(this.state.fallSpeed);
        if (this.state.level > previousLevel) {
          soundManager.playLevelUp();
        }
      }

      // Determine animation duration based on line count
      const clearDuration = completedLines.length === 4 ? 800 : 
                           completedLines.length === 3 ? 500 :
                           completedLines.length === 2 ? 450 : 400;
      
      const dropDuration = 200; // Time for lines to drop down

      // After clear animation, actually clear the lines and start drop animation
      setTimeout(() => {
        // Calculate which rows will drop and by how much
        const droppingRows = new Map<number, number>();
        const sortedClearedLines = [...completedLines].sort((a, b) => a - b);
        
        // For each row above the cleared lines, calculate its new position
        for (let row = 0; row < 40; row++) {
          if (!sortedClearedLines.includes(row)) {
            // Count how many cleared lines are below this row
            const dropAmount = sortedClearedLines.filter(clearedRow => clearedRow > row).length;
            if (dropAmount > 0) {
              droppingRows.set(row, row + dropAmount);
            }
          }
        }
        
        this.state.droppingRows = droppingRows;
        this.state.clearingLines = [];
        this.state.clearingLineCount = 0;
        
        // Clear lines from playfield
        this.playfield.clearLines(completedLines);
        
        // After drop animation, reset dropping state
        setTimeout(() => {
          this.state.droppingRows = new Map();
        }, dropDuration);
      }, clearDuration);
    }

    // Spawn next piece
    this.spawnPiece();
  }



  /**
   * Handle player input
   */
  handleInput(input: InputType): void {
    // Handle toggle commands anytime
    if (input === Input.DEBUG_TOGGLE) {
      this.state.debugMode = !this.state.debugMode;
      return;
    }

    if (input === Input.TOGGLE_GHOST) {
      this.state.ghostPieceVisible = !this.state.ghostPieceVisible;
      return;
    }

    if (this.state.debugMode) {
      if (input === Input.DEBUG_LEVEL_UP) {
        this.state.level = Math.min(this.state.level + 1, 99);
        this.state.fallSpeed = this.scoreManager.calculateFallSpeed(this.state.level);
        soundManager.updateMusicTempo(this.state.fallSpeed);
        return;
      }
      if (input === Input.DEBUG_LEVEL_DOWN) {
        this.state.level = Math.max(this.state.level - 1, 1);
        this.state.fallSpeed = this.scoreManager.calculateFallSpeed(this.state.level);
        soundManager.updateMusicTempo(this.state.fallSpeed);
        return;
      }
      if (input === Input.DEBUG_SCORE_UP_SMALL) {
        this.state.score = Math.max(0, this.state.score + 1000);
        return;
      }
      if (input === Input.DEBUG_SCORE_DOWN_SMALL) {
        this.state.score = Math.max(0, this.state.score - 1000);
        return;
      }
      if (input === Input.DEBUG_SCORE_UP_LARGE) {
        this.state.score = Math.max(0, this.state.score + 10000);
        return;
      }
      if (input === Input.DEBUG_SCORE_DOWN_LARGE) {
        this.state.score = Math.max(0, this.state.score - 10000);
        return;
      }
      if (input === Input.DEBUG_CLEAR_1_LINE) {
        this.setupLineClearTest(1);
        return;
      }
      if (input === Input.DEBUG_CLEAR_2_LINES) {
        this.setupLineClearTest(2);
        return;
      }
      if (input === Input.DEBUG_CLEAR_3_LINES) {
        this.setupLineClearTest(3);
        return;
      }
      if (input === Input.DEBUG_CLEAR_4_LINES) {
        this.setupLineClearTest(4);
        return;
      }
    }

    if (this.state.gameStatus !== GameStatus.PLAYING || !this.state.currentPiece) {
      // Handle pause in any state
      if (input === Input.PAUSE) {
        if (this.state.gameStatus === GameStatus.PLAYING) {
          this.pause();
        } else if (this.state.gameStatus === GameStatus.PAUSED) {
          this.resume();
        }
      }
      // Handle new game in any state
      if (input === Input.NEW_GAME) {
        this.start();
        return;
      }
      // Handle sound toggle in any state
      if (input === Input.TOGGLE_SOUND) {
        const newEnabled = !soundManager.isEnabled();
        soundManager.setEnabled(newEnabled);
        soundManager.setMusicEnabled(newEnabled);
        if (!newEnabled) {
          soundManager.stopMusic();
        } else if (this.state.gameStatus === GameStatus.PLAYING) {
          soundManager.startMusic(this.state.fallSpeed);
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
          soundManager.playMove();
        }
        break;

      case Input.MOVE_RIGHT:
        const movedRight = this.controller.move(this.state.currentPiece, 1, 0);
        if (movedRight) {
          this.state.currentPiece = movedRight;
          moved = true;
          soundManager.playMove();
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
          this.state.score += this.scoreManager.calculateDropScore(1, false);
        }
        break;

      case Input.HARD_DROP:
        const result = this.controller.hardDrop(this.state.currentPiece, true);
        this.state.currentPiece = result.tetromino;
        this.state.score += this.scoreManager.calculateDropScore(result.distance, true);
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

      case Input.NEW_GAME:
        this.start();
        break;

      case Input.TOGGLE_SOUND:
        soundManager.setEnabled(!soundManager.isEnabled());
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

    soundManager.playHold();

    if (this.state.heldPiece === null) {
      // Store current piece and spawn next
      this.state.heldPiece = createTetromino(this.state.currentPiece.type);
      this.spawnPiece();
    } else {
      // Swap current and held
      const temp = this.state.currentPiece.type;
      this.state.currentPiece = createTetromino(this.state.heldPiece.type);
      this.state.heldPiece = createTetromino(temp);
      
      // Reset lock delay counters for swapped piece
      this.state.lockResets = 0;
      this.state.lastLockMoveTime = 0;
      
      // Check if swapped piece can spawn at spawn position
      if (!this.playfield.isValidPosition(this.state.currentPiece, this.state.currentPiece.position)) {
        // Game over if piece can't spawn
        this.state.currentPiece = null; // Clear current piece to prevent rendering issues
        this.state.gameStatus = GameStatus.GAME_OVER;
        soundManager.playGameOver();
        return;
      }
      
      // Tetris Guideline: Piece must move down immediately after appearing
      const movedDown = this.controller.move(this.state.currentPiece, 0, 1);
      if (movedDown) {
        this.state.currentPiece = movedDown;
      }
    }

    this.state.canHold = false;
  }

  /**
   * Setup playfield for testing line clears (debug mode)
   */
  private setupLineClearTest(lineCount: 1 | 2 | 3 | 4): void {
    if (!this.state.debugMode) return;

    // Reset playfield
    this.playfield.reset();

    // Fill bottom N rows, leaving one column empty
    const grid = this.playfield.getGrid();
    const emptyColumn = 4; // Leave middle column empty for dropping piece
    
    for (let line = 0; line < lineCount; line++) {
      const row = 39 - line; // Bottom row is 39
      for (let col = 0; col < 10; col++) {
        if (col !== emptyColumn) {
          grid[row][col] = { filled: true, color: '#666666' };
        }
      }
    }

    // Spawn I piece above the empty column for easy testing
    if (this.state.currentPiece) {
      const iPiece = createTetromino('I');
      iPiece.position.col = emptyColumn - 1; // Center I piece over gap
      this.state.currentPiece = iPiece;
    }
  }
}
