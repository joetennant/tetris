/**
 * Score Panel Component
 * 
 * Displays score, level, and lines cleared
 */

interface ScorePanelProps {
  score: number;
  level: number;
  linesCleared: number;
}

export function ScorePanel({ score, level, linesCleared }: ScorePanelProps) {
  return (
    <div className="score-panel">
      <div className="score-item">
        <div className="score-label">Score</div>
        <div className="score-value">{score.toLocaleString()}</div>
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
}
