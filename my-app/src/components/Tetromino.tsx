/**
 * Tetromino Component
 * 
 * Renders a tetromino piece at a specific position
 */

import type { Tetromino as TetrominoType } from '../game/types';

interface TetrominoProps {
  tetromino: TetrominoType;
  isGhost?: boolean;
}

export function Tetromino({ tetromino, isGhost = false }: TetrominoProps) {
  const { matrix, position, color } = tetromino;

  return (
    <>
      {matrix.map((row, y) =>
        row.map((cell, x) => {
          if (!cell) return null;

          const gridRow = position.row + y;
          const gridCol = position.col + x;

          // Only render if in visible area (rows 20-39)
          // Allow row 19 for pieces that spawn but haven't moved down yet
          if (gridRow < 19 || gridRow >= 40) return null;

          // Convert grid coordinates to display coordinates
          // Playfield displays rows 20-39 as CSS grid rows 1-20
          // Row 19 should display as row 0 (off-screen above), but we clamp to row 1 for spawn visibility
          const displayRow = Math.max(1, gridRow - 20 + 1);

          return (
            <div
              key={`${y}-${x}`}
              className={`tetromino-block ${isGhost ? 'ghost' : ''}`}
              style={{
                gridRow: displayRow,
                gridColumn: gridCol + 1,
                backgroundColor: isGhost ? 'transparent' : color,
                borderColor: isGhost ? color : undefined,
              }}
            />
          );
        })
      )}
    </>
  );
}
