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
          if (gridRow < 20 || gridRow >= 40) return null;

          return (
            <div
              key={`${y}-${x}`}
              className={`tetromino-block ${isGhost ? 'ghost' : ''}`}
              style={{
                gridRow: gridRow - 19, // Adjust for visible area (row 20 = grid row 1)
                gridColumn: gridCol + 1,
                backgroundColor: isGhost ? 'transparent' : color,
                border: isGhost ? `2px solid ${color}` : `1px solid rgba(0,0,0,0.3)`,
                opacity: isGhost ? 0.3 : 1,
              }}
            />
          );
        })
      )}
    </>
  );
}
