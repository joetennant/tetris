/**
 * Debug Panel Component
 * 
 * Displays internal game metrics for debugging and verification
 */

import { memo } from 'react';
import type { GameState } from '../game/types';

interface DebugPanelProps {
  gameState: GameState;
}

export const DebugPanel = memo(function DebugPanel({ gameState }: DebugPanelProps) {
  if (!gameState.debugMode) return null;

  return (
    <div className="debug-panel">
      <div className="debug-header">🐛 DEBUG MODE</div>
      <div className="debug-content">
        <div className="debug-row">
          <span className="debug-label">Score:</span>
          <span className="debug-value">{gameState.score.toLocaleString()}</span>
        </div>
        <div className="debug-row">
          <span className="debug-label">Fall Speed:</span>
          <span className="debug-value">{gameState.fallSpeed.toFixed(0)} ms</span>
        </div>
        <div className="debug-row">
          <span className="debug-label">Level:</span>
          <span className="debug-value">{gameState.level}</span>
        </div>
        <div className="debug-row">
          <span className="debug-label">Lock Delay:</span>
          <span className="debug-value">{gameState.lockDelay} ms</span>
        </div>
        <div className="debug-row">
          <span className="debug-label">Lock Resets:</span>
          <span className="debug-value">{gameState.lockResets} / 15</span>
        </div>
        <div className="debug-controls">
          <div className="debug-control-hint">
            <kbd>D</kbd> Toggle Debug
          </div>
          <div className="debug-control-hint">
            <kbd>+</kbd> Level Up | <kbd>-</kbd> Level Down
          </div>
          <div className="debug-control-hint">
            <kbd>]</kbd> Score +1000 | <kbd>[</kbd> Score -1000
          </div>
          <div className="debug-control-hint">
            <kbd>{'}'}</kbd> Score +10000 | <kbd>{'{'}</kbd> Score -10000
          </div>
        </div>
      </div>
    </div>
  );
});
