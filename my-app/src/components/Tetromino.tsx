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

          // Render if in visible area (rows 20-39) or just above (row 19 for spawn visibility)
          if (gridRow < 19 || gridRow >= 40) return null;

          return (
            <div
              key={`${y}-${x}`}
              className={`tetromino-block ${isGhost ? 'ghost' : ''}`}
              style={{
                gridRow: gridRow - 19,
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
