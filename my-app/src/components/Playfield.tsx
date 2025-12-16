/**
 * Playfield Component
 * 
 * Renders the 10x20 game board
 */

import { memo } from 'react';
import type { Cell, Tetromino as TetrominoType } from '../game/types';
import { Tetromino } from './Tetromino';

interface PlayfieldProps {
  grid: Readonly<Cell[][]>;
  currentPiece: TetrominoType | null;
  ghostPiece: TetrominoType | null;
  clearingLines?: number[];
  lockingPiece?: boolean;
}

export const Playfield = memo(function Playfield({ grid, currentPiece, ghostPiece, clearingLines = [], lockingPiece = false }: PlayfieldProps) {
  // Only render visible rows (20-39)
  const visibleGrid = grid.slice(20, 40);

  return (
    <div className="playfield">
      {visibleGrid.map((row, y) =>
        row.map((cell, x) => {
          // Check if this row is being cleared (y is 0-indexed from visible grid)
          const actualRow = y + 20; // Convert to actual grid row
          const isClearing = clearingLines.includes(actualRow);
          
          return (
            <div
              key={`${y}-${x}`}
              className={`${cell.isEmpty ? 'cell' : 'cell locked-block'} ${isClearing ? 'clearing' : ''}`}
              style={{
                gridRow: y + 1,
                gridColumn: x + 1,
                backgroundColor: cell.isEmpty ? 'transparent' : (cell.color || '#666'),
              }}
            />
          );
        })
      )}
      
      {/* Ghost piece */}
      {ghostPiece && <Tetromino tetromino={ghostPiece} isGhost={true} />}
      
      {/* Current piece with lock animation */}
      {currentPiece && <Tetromino tetromino={currentPiece} isLocking={lockingPiece} />}
    </div>
  );
});
