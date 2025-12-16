/**
 * Playfield Component
 * 
 * Renders the 10x20 game board
 */

import type { Cell, Tetromino as TetrominoType } from '../game/types';
import { Tetromino } from './Tetromino';

interface PlayfieldProps {
  grid: Readonly<Cell[][]>;
  currentPiece: TetrominoType | null;
  ghostPiece: TetrominoType | null;
}

export function Playfield({ grid, currentPiece, ghostPiece }: PlayfieldProps) {
  // Only render visible rows (20-39)
  const visibleGrid = grid.slice(20, 40);

  return (
    <div className="playfield">
      {visibleGrid.map((row, y) =>
        row.map((cell, x) => (
          <div
            key={`${y}-${x}`}
            className="cell"
            style={{
              gridRow: y + 1,
              gridColumn: x + 1,
              backgroundColor: cell.isEmpty ? '#222' : cell.color || '#666',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          />
        ))
      )}
      
      {/* Ghost piece */}
      {ghostPiece && <Tetromino tetromino={ghostPiece} isGhost={true} />}
      
      {/* Current piece */}
      {currentPiece && <Tetromino tetromino={currentPiece} />}
    </div>
  );
}
