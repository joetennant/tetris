/**
 * Game Component
 * 
 * Main container that integrates all game components and handles game loop
 */

import { useEffect, useMemo } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useGameLoop } from '../hooks/useGameLoop';
import { useKeyboard } from '../hooks/useKeyboard';
import { Playfield } from './Playfield';
import { ScorePanel } from './ScorePanel';
import { GameOverlay } from './GameOverlay';
import { Controls } from './Controls';
import { Input, GameStatus } from '../game/types';
import { TetrominoController } from '../game/TetrominoController';

export function Game() {
  const { gameState, handleInput, update, startGame, resumeGame } = useGameState();
  const { onKey } = useKeyboard();

  // Setup keyboard controls (following Tetris Guideline)
  useEffect(() => {
    // Left and right arrow keys: Piece shifting
    onKey('ArrowLeft', () => handleInput(Input.MOVE_LEFT));
    onKey('ArrowRight', () => handleInput(Input.MOVE_RIGHT));
    
    // Down arrow key: Non-locking soft drop
    onKey('ArrowDown', () => handleInput(Input.SOFT_DROP));
    
    // Space bar: Locking hard drop
    onKey(' ', () => handleInput(Input.HARD_DROP));
    
    // Up arrow key: Rotating 90 degrees clockwise
    onKey('ArrowUp', () => handleInput(Input.ROTATE_CW));
    
    // Z key / Left Control key: Rotating 90 degrees counterclockwise
    onKey('z', () => handleInput(Input.ROTATE_CCW));
    onKey('Z', () => handleInput(Input.ROTATE_CCW));
    onKey('Control', () => handleInput(Input.ROTATE_CCW));
    
    // C key / Shift key: Hold piece
    onKey('c', () => handleInput(Input.HOLD));
    onKey('C', () => handleInput(Input.HOLD));
    onKey('Shift', () => handleInput(Input.HOLD));
    
    // Additional common controls (not in guideline but nice to have)
    onKey('x', () => handleInput(Input.ROTATE_CW)); // Alternative rotate CW
    onKey('X', () => handleInput(Input.ROTATE_CW));
    
    // Pause
    onKey('p', () => handleInput(Input.PAUSE));
    onKey('P', () => handleInput(Input.PAUSE));
    onKey('Escape', () => handleInput(Input.PAUSE));
  }, [handleInput, onKey]);

  // Game loop
  const isActive = gameState?.gameStatus === GameStatus.PLAYING;
  useGameLoop(update, isActive);

  // Calculate ghost piece position
  const ghostPiece = useMemo(() => {
    if (!gameState?.currentPiece || !gameState?.playfield) return null;
    
    const controller = new TetrominoController(gameState.playfield);
    const ghostPosition = controller.calculateGhostPosition(gameState.currentPiece);
    
    return {
      ...gameState.currentPiece,
      position: ghostPosition,
    };
  }, [gameState?.currentPiece, gameState?.playfield]);

  if (!gameState) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="game-container">
        <div className="game-main">
          <Playfield
            grid={gameState.playfield.getGrid()}
            currentPiece={gameState.gameStatus === GameStatus.PLAYING ? gameState.currentPiece : null}
            ghostPiece={gameState.gameStatus === GameStatus.PLAYING ? ghostPiece : null}
          />
        </div>
        
        <div className="game-sidebar">
          <ScorePanel
            score={gameState.score}
            level={gameState.level}
            linesCleared={gameState.linesCleared}
          />
          
          {gameState.nextPieces.length > 0 && (
            <div className="next-piece-container">
              <h3>Next</h3>
              <div className="next-piece-preview">
                {gameState.nextPieces[0].matrix.map((row, y) => (
                  <div key={y} className="preview-row">
                    {row.map((cell, x) => 
                      cell ? (
                        <div
                          key={x}
                          className="preview-cell"
                          style={{
                            backgroundColor: gameState.nextPieces[0].color,
                          }}
                        />
                      ) : (
                        <div key={x} className="preview-cell-empty" />
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {gameState.heldPiece && (
            <div className="hold-piece-container">
              <h3>Hold</h3>
              <div className="hold-piece-preview">
                {gameState.heldPiece.matrix.map((row, y) => (
                  <div key={y} className="preview-row">
                    {row.map((cell, x) => 
                      cell ? (
                        <div
                          key={x}
                          className="preview-cell"
                          style={{
                            backgroundColor: gameState.heldPiece!.color,
                          }}
                        />
                      ) : (
                        <div key={x} className="preview-cell-empty" />
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      
        <GameOverlay
          gameStatus={gameState.gameStatus}
          score={gameState.score}
          onStart={startGame}
          onResume={resumeGame}
        />
      </div>
      
      <Controls />
    </>
  );
}
