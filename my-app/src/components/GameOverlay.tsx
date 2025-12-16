/**
 * Game Overlay Component
 * 
 * Shows pause and game over screens
 */

import { GameStatus } from '../game/types';

interface GameOverlayProps {
  gameStatus: string;
  score: number;
  onStart: () => void;
  onResume: () => void;
}

export function GameOverlay({ gameStatus, score, onStart, onResume }: GameOverlayProps) {
  if (gameStatus === GameStatus.PLAYING) {
    return null;
  }

  if (gameStatus === GameStatus.PAUSED) {
    return (
      <div className="game-overlay">
        <div className="overlay-content">
          <h2>Paused</h2>
          <p>Press P to resume</p>
          <button onClick={onResume}>Resume</button>
        </div>
      </div>
    );
  }

  if (gameStatus === GameStatus.GAME_OVER) {
    return (
      <div className="game-overlay">
        <div className="overlay-content">
          <h2>Game Over</h2>
          <p className="final-score">Score: {score.toLocaleString()}</p>
          <button onClick={onStart}>Play Again</button>
        </div>
      </div>
    );
  }

  // READY state
  return (
    <div className="game-overlay">
      <div className="overlay-content">
        <h1>Tetris</h1>
        <div className="controls-info">
          <p><strong>Controls:</strong></p>
          <p>← → : Move Left/Right</p>
          <p>↓ : Soft Drop</p>
          <p>Space : Hard Drop</p>
          <p>↑ (or X) : Rotate Clockwise</p>
          <p>Z (or Ctrl) : Rotate Counter-Clockwise</p>
          <p>C (or Shift) : Hold Piece</p>
          <p>P (or Esc) : Pause</p>
        </div>
        <button onClick={onStart}>Start Game</button>
      </div>
    </div>
  );
}
