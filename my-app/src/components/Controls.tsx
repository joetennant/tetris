/**
 * Controls Display Component
 * 
 * Shows keyboard controls for the game
 */

export function Controls() {
  return (
    <div className="controls-display">
      <div className="controls-section">
        <h4>Movement</h4>
        <div className="control-item">
          <kbd>←</kbd><kbd>→</kbd>
          <span>Move</span>
        </div>
        <div className="control-item">
          <kbd>↓</kbd>
          <span>Soft Drop</span>
        </div>
        <div className="control-item">
          <kbd>Space</kbd>
          <span>Hard Drop</span>
        </div>
      </div>

      <div className="controls-section">
        <h4>Rotation</h4>
        <div className="control-item">
          <kbd>↑</kbd> <span>or</span> <kbd>X</kbd>
          <span>Rotate CW</span>
        </div>
        <div className="control-item">
          <kbd>Z</kbd> <span>or</span> <kbd>Ctrl</kbd>
          <span>Rotate CCW</span>
        </div>
      </div>

      <div className="controls-section">
        <h4>Special</h4>
        <div className="control-item">
          <kbd>C</kbd> <span>or</span> <kbd>Shift</kbd>
          <span>Hold</span>
        </div>
        <div className="control-item">
          <kbd>G</kbd>
          <span>Toggle Ghost</span>
        </div>
        <div className="control-item">
          <kbd>M</kbd>
          <span>Toggle Music/Sound</span>
        </div>
        <div className="control-item">
          <kbd>P</kbd> <span>or</span> <kbd>Esc</kbd>
          <span>Pause</span>
        </div>
      </div>
    </div>
  );
}
