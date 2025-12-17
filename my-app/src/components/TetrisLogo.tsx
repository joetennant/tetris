/**
 * TetrisLogo Component
 * 
 * 3D block-style logo with Soviet-inspired design
 */

import './TetrisLogo.css';

export function TetrisLogo() {
  return (
    <div className="tetris-logo">
      <div className="logo-blocks">
        {/* T */}
        <div className="block-letter t-letter">
          <div className="block-3d block-red" style={{ gridColumn: '1 / 4', gridRow: '1' }}></div>
          <div className="block-3d block-red" style={{ gridColumn: '2', gridRow: '2' }}></div>
          <div className="block-3d block-red" style={{ gridColumn: '2', gridRow: '3' }}></div>
          <div className="block-3d block-red" style={{ gridColumn: '2', gridRow: '4' }}></div>
        </div>
        
        {/* E */}
        <div className="block-letter e-letter">
          <div className="block-3d block-yellow" style={{ gridColumn: '1 / 4', gridRow: '1' }}></div>
          <div className="block-3d block-yellow" style={{ gridColumn: '1', gridRow: '2' }}></div>
          <div className="block-3d block-yellow" style={{ gridColumn: '1 / 3', gridRow: '3' }}></div>
          <div className="block-3d block-yellow" style={{ gridColumn: '1', gridRow: '4' }}></div>
          <div className="block-3d block-yellow" style={{ gridColumn: '1 / 4', gridRow: '5' }}></div>
        </div>
        
        {/* T */}
        <div className="block-letter t-letter">
          <div className="block-3d block-green" style={{ gridColumn: '1 / 4', gridRow: '1' }}></div>
          <div className="block-3d block-green" style={{ gridColumn: '2', gridRow: '2' }}></div>
          <div className="block-3d block-green" style={{ gridColumn: '2', gridRow: '3' }}></div>
          <div className="block-3d block-green" style={{ gridColumn: '2', gridRow: '4' }}></div>
        </div>
        
        {/* R */}
        <div className="block-letter r-letter">
          <div className="block-3d block-cyan" style={{ gridColumn: '1 / 3', gridRow: '1' }}></div>
          <div className="block-3d block-cyan" style={{ gridColumn: '1', gridRow: '2' }}></div>
          <div className="block-3d block-cyan" style={{ gridColumn: '3', gridRow: '2' }}></div>
          <div className="block-3d block-cyan" style={{ gridColumn: '1 / 3', gridRow: '3' }}></div>
          <div className="block-3d block-cyan" style={{ gridColumn: '2', gridRow: '4' }}></div>
          <div className="block-3d block-cyan" style={{ gridColumn: '3', gridRow: '5' }}></div>
        </div>
        
        {/* I */}
        <div className="block-letter i-letter">
          <div className="block-3d block-blue" style={{ gridColumn: '1 / 4', gridRow: '1' }}></div>
          <div className="block-3d block-blue" style={{ gridColumn: '2', gridRow: '2' }}></div>
          <div className="block-3d block-blue" style={{ gridColumn: '2', gridRow: '3' }}></div>
          <div className="block-3d block-blue" style={{ gridColumn: '2', gridRow: '4' }}></div>
          <div className="block-3d block-blue" style={{ gridColumn: '1 / 4', gridRow: '5' }}></div>
        </div>
        
        {/* S */}
        <div className="block-letter s-letter">
          <div className="block-3d block-purple" style={{ gridColumn: '1 / 4', gridRow: '1' }}></div>
          <div className="block-3d block-purple" style={{ gridColumn: '1', gridRow: '2' }}></div>
          <div className="block-3d block-purple" style={{ gridColumn: '1 / 4', gridRow: '3' }}></div>
          <div className="block-3d block-purple" style={{ gridColumn: '3', gridRow: '4' }}></div>
          <div className="block-3d block-purple" style={{ gridColumn: '1 / 4', gridRow: '5' }}></div>
        </div>
      </div>
      
      {/* Soviet-inspired star accents */}
      <div className="logo-accent accent-left">★</div>
      <div className="logo-accent accent-right">★</div>
    </div>
  );
}
