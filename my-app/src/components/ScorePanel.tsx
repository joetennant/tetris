/**
 * Score Panel Component
 * 
 * Displays score, level, and lines cleared
 */

import { memo } from 'react';

interface ScorePanelProps {
  score: number;
  level: number;
  linesCleared: number;
}

export const ScorePanel = memo(function ScorePanel({ score, level, linesCleared }: ScorePanelProps) {
  // Dynamic font size class based on score length
  const getScoreSizeClass = (value: number): string => {
    const length = value.toString().length;
    if (length >= 7) return 'score-value-xs';
    if (length >= 5) return 'score-value-sm';
    return 'score-value';
  };

  return (
    <div className="score-panel">
      <div className="score-item">
        <div className="score-label">Score</div>
        <div className={getScoreSizeClass(score)}>{score.toLocaleString()}</div>
      </div>
      <div className="score-item">
        <div className="score-label">Level</div>
        <div className="score-value">{level}</div>
      </div>
      <div className="score-item">
        <div className="score-label">Lines</div>
        <div className="score-value">{linesCleared}</div>
      </div>
    </div>
  );
});
