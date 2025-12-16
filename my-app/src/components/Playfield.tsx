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
  clearingLineCount?: number;
  droppingRows?: Map<number, number>;
  lockingPiece?: boolean;
}

export const Playfield = memo(function Playfield({ 
  grid, 
  currentPiece, 
  ghostPiece, 
  clearingLines = [], 
  clearingLineCount = 0,
  droppingRows = new Map(),
  lockingPiece = false 
}: PlayfieldProps) {
  // Only render visible rows (20-39)
  const visibleGrid = grid.slice(20, 40);

  // Determine animation class based on line count
  const getAnimationClass = (isClearing: boolean): string => {
    if (!isClearing) return '';
    if (clearingLineCount === 4) return 'clearing-4';
    if (clearingLineCount === 3) return 'clearing-3';
    if (clearingLineCount === 2) return 'clearing-2';
    if (clearingLineCount === 1) return 'clearing-1';
    return 'clearing'; // fallback
  };

  return (
    <div className="playfield">
      {visibleGrid.map((row, y) =>
        row.map((cell, x) => {
          // Check if this row is being cleared (y is 0-indexed from visible grid)
          const actualRow = y + 20; // Convert to actual grid row
          const isClearing = clearingLines.includes(actualRow);
          const animationClass = getAnimationClass(isClearing);
          
          // Check if this row is dropping
          const newRow = droppingRows.get(actualRow);
          const isDropping = newRow !== undefined;
          const dropDistance = isDropping ? (newRow - actualRow) * 100 : 0; // 100% = one cell height
          
          return (
            <div
              key={`${y}-${x}`}
              className={`${cell.isEmpty ? 'cell' : 'cell locked-block'} ${animationClass} ${isDropping ? 'dropping' : ''}`}
              style={{
                gridRow: y + 1,
                gridColumn: x + 1,
                backgroundColor: cell.isEmpty ? 'transparent' : (cell.color || '#666'),
                '--drop-distance': `${dropDistance}%`,
              } as React.CSSProperties & { '--drop-distance': string }}
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
