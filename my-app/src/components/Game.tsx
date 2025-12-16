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
import { Input, GameStatus } from '../game/types';
import { TetrominoController } from '../game/TetrominoController';

export function Game() {
  const { gameState, handleInput, update, startGame, resumeGame } = useGameState();
  const { onKey } = useKeyboard();

  // Setup keyboard controls
  useEffect(() => {
    onKey('ArrowLeft', () => handleInput(Input.MOVE_LEFT));
    onKey('a', () => handleInput(Input.MOVE_LEFT));
    onKey('A', () => handleInput(Input.MOVE_LEFT));
    
    onKey('ArrowRight', () => handleInput(Input.MOVE_RIGHT));
    onKey('d', () => handleInput(Input.MOVE_RIGHT));
    onKey('D', () => handleInput(Input.MOVE_RIGHT));
    
    onKey('ArrowDown', () => handleInput(Input.SOFT_DROP));
    onKey('s', () => handleInput(Input.SOFT_DROP));
    onKey('S', () => handleInput(Input.SOFT_DROP));
    
    onKey(' ', () => handleInput(Input.HARD_DROP));
    onKey('ArrowUp', () => handleInput(Input.HARD_DROP));
    onKey('w', () => handleInput(Input.HARD_DROP));
    onKey('W', () => handleInput(Input.HARD_DROP));
    
    onKey('x', () => handleInput(Input.ROTATE_CW));
    onKey('X', () => handleInput(Input.ROTATE_CW));
    
    onKey('z', () => handleInput(Input.ROTATE_CCW));
    onKey('Z', () => handleInput(Input.ROTATE_CCW));
    onKey('Control', () => handleInput(Input.ROTATE_CCW));
    
    onKey('c', () => handleInput(Input.HOLD));
    onKey('C', () => handleInput(Input.HOLD));
    onKey('Shift', () => handleInput(Input.HOLD));
    
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
    <div className="game-container">
      <div className="game-main">
        <Playfield
          grid={gameState.playfield.getGrid()}
          currentPiece={gameState.currentPiece}
          ghostPiece={ghostPiece}
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
                  {row.map((cell, x) => (
                    <div
                      key={x}
                      className="preview-cell"
                      style={{
                        backgroundColor: cell ? gameState.nextPieces[0].color : 'transparent',
                        border: cell ? '1px solid rgba(0,0,0,0.3)' : 'none',
                      }}
                    />
                  ))}
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
                  {row.map((cell, x) => (
                    <div
                      key={x}
                      className="preview-cell"
                      style={{
                        backgroundColor: cell ? gameState.heldPiece!.color : 'transparent',
                        border: cell ? '1px solid rgba(0,0,0,0.3)' : 'none',
                      }}
                    />
                  ))}
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
  );
}
