# Phase 9: Graphics & Sound - Quick Start Guide

**Date**: 2025-12-16  
**Status**: 🚧 **Ready to Begin**

---

## 🎯 What We're Building

Enhance the game with impressive visuals and classic Tetris sounds:
1. **Better line clear animations** - Flash, pulse, and fade effects
2. **Improved ghost piece** - Outline style + toggle control (G key)
3. **Classic Tetris sounds** - Movement, drops, line clears, etc.

---

## 📋 Quick Task List

### Part A: Line Clear Animation (6 hours)
1. ✅ **T-P9-001**: Design animation sequence (1h)
2. ⏳ **T-P9-002**: Create CSS keyframes (2h)
3. ⏳ **T-P9-003**: Track line count in GameState (1h)
4. ⏳ **T-P9-004**: Apply dynamic animation classes (1h)
5. ⏳ **T-P9-005**: Test all animations (1h)

### Part B: Ghost Piece (4 hours)
6. ✅ **T-P9-006**: Design outline style (30min)
7. ⏳ **T-P9-007**: Implement ghost CSS (1h)
8. ⏳ **T-P9-008**: Update Tetromino component (30min)
9. ⏳ **T-P9-009**: Add ghost toggle (G key) (1h)
10. ⏳ **T-P9-010**: Update controls display (15min)
11. ⏳ **T-P9-011**: Test ghost features (30min)

### Part C: Sound Effects (7 hours)
12. ⏳ **T-P9-012**: Find/create sound files (2h)
13. ⏳ **T-P9-013**: Build SoundManager class (2h)
14. ⏳ **T-P9-014**: Integrate with GameState (1h)
15. ⏳ **T-P9-015**: Add mute toggle (M key) (30min)
16. ⏳ **T-P9-016**: Add sound UI controls (30min)
17. ⏳ **T-P9-017**: Test sound system (1h)

**Total**: 17 tasks, ~17 hours

---

## 🚀 Implementation Order

### Week 1: Animations
Start with Part A (most impactful, no dependencies)

### Week 2: Ghost Piece
Continue with Part B (visual polish)

### Week 3: Sound
Finish with Part C (requires audio assets)

---

## 🎨 Design Specs Summary

### Line Clear Animations

**Single Line** (400ms):
- Flash → Pulse (2x) → Fade

**Double Line** (450ms):
- Bright flash → Pulse (3x) → Color shift → Fade

**Triple Line** (500ms):
- Very bright flash → Pulse (4x) → Multi-color shift → Fade

**Tetris (4 lines)** (600ms):
- ULTRA bright flash → Pulse (5x) → Gold shimmer → Fade
- Special celebration effect!

### Ghost Piece Style

**Recommended**: Outline + Semi-transparent
```css
background: transparent;
border: 2px solid currentColor;
opacity: 0.5;
box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.3);
```

**Controls**:
- **G key**: Toggle ghost on/off
- Default: Visible

### Sound Effects Needed

| Action | Sound | Duration | Volume |
|--------|-------|----------|--------|
| Move | `move.mp3` | 50-100ms | 30-40% |
| Rotate | `rotate.mp3` | 50-100ms | 30-40% |
| Soft Drop | `soft-drop.mp3` | 50ms | 30% |
| Hard Drop | `hard-drop.mp3` | 100-200ms | 50-60% |
| Lock | `lock.mp3` | 100ms | 40% |
| 1 Line | `line-clear-1.mp3` | 200ms | 50% |
| 2 Lines | `line-clear-2.mp3` | 300ms | 55% |
| 3 Lines | `line-clear-3.mp3` | 400ms | 60% |
| Tetris! | `line-clear-4.mp3` | 500-800ms | 70-80% |
| Level Up | `level-up.mp3` | 300-400ms | 60% |
| Game Over | `game-over.mp3` | 800-1000ms | 50% |

**Controls**:
- **M key**: Mute/unmute sounds

---

## 🔧 New Files to Create

```
my-app/
├── public/
│   └── sounds/              # NEW
│       ├── move.mp3
│       ├── rotate.mp3
│       ├── soft-drop.mp3
│       ├── hard-drop.mp3
│       ├── lock.mp3
│       ├── line-clear-1.mp3
│       ├── line-clear-2.mp3
│       ├── line-clear-3.mp3
│       ├── line-clear-4.mp3
│       ├── level-up.mp3
│       └── game-over.mp3
├── src/
    └── game/
        └── SoundManager.ts  # NEW
```

---

## 📝 Key Changes Summary

### Types (types.ts)
```typescript
// Add new inputs
TOGGLE_GHOST: 'toggleGhost',
TOGGLE_SOUND: 'toggleSound',

// Add new state
interface GameState {
  clearingLineCount?: number;     // For animation
  ghostPieceVisible: boolean;     // For ghost toggle
  soundEnabled: boolean;          // For audio
}
```

### Game State (GameState.ts)
```typescript
// Add sound manager
private soundManager: SoundManager;

// Track line count
private clearingLineCount: number;

// Play sounds on actions
handleInput(input) {
  if (moved) this.soundManager.play('move');
  // etc.
}
```

### CSS (App.css)
```css
/* New keyframes */
@keyframes line-clear-flash { ... }
@keyframes line-clear-pulse { ... }
@keyframes tetris-celebration { ... }

/* New ghost styles */
.tetromino-block.ghost { ... }

/* Animation classes */
.clearing-line-1 { ... }
.clearing-line-2 { ... }
.clearing-line-3 { ... }
.clearing-line-4 { ... }
```

---

## 🧪 Testing Checklist

### Animations
- [ ] Single line clear animates
- [ ] Double line clear enhanced
- [ ] Triple line clear stronger
- [ ] Tetris (4 lines) celebration!
- [ ] 60 FPS maintained
- [ ] No visual glitches

### Ghost Piece
- [ ] Outline style visible
- [ ] Clearly distinct from active piece
- [ ] G key toggles on/off
- [ ] Works with all pieces
- [ ] Landing position accurate

### Sound
- [ ] All sounds play correctly
- [ ] No audio lag (<50ms)
- [ ] M key mutes/unmutes
- [ ] Volume levels balanced
- [ ] No annoying repetition
- [ ] Works on Chrome/Firefox/Safari

---

## 🎯 Success Criteria

**Phase 9 Complete When**:
1. ✅ Line clears have impressive multi-stage animations
2. ✅ Tetris (4 lines) has special celebration effect
3. ✅ Ghost piece has distinct outline style
4. ✅ G key toggles ghost visibility
5. ✅ All classic Tetris sounds implemented
6. ✅ M key mutes/unmutes audio
7. ✅ 60 FPS maintained with all effects
8. ✅ All 17 tasks completed
9. ✅ Manual testing passed
10. ✅ User feedback positive

---

## 📚 Resources

### Sound Sources
- **Freesound.org** - Free sound library
- **OpenGameArt.org** - Game audio
- **SFXR** - Generate 8-bit sounds
- **Beepbox.co** - Create chiptune sounds

### Tools
- **Audacity** - Edit audio (free)
- **Chrome DevTools** - Test animations
- **cubic-bezier.com** - Easing functions

---

## 💡 Quick Tips

### For Animations
1. Start simple, add complexity
2. Test at 0.5x speed in DevTools
3. Use `animation-fill-mode: forwards`
4. Combine multiple animations with commas

### For Ghost Piece
1. Test on different colored backgrounds
2. Ensure outline is always visible
3. Consider adding subtle pulse (optional)

### For Sounds
1. Keep files small (<50KB)
2. Use Web Audio API for precise timing
3. Preload all sounds on game start
4. Test rapid-fire events (rotation spam)

---

## 🚀 Getting Started

### Step 1: Set Up
```bash
cd my-app
mkdir -p public/sounds
# Download/create sound files
```

### Step 2: Start with Animations
1. Open `src/App.css`
2. Create keyframe animations
3. Test with single line clear
4. Expand to multiple lines
5. Add Tetris celebration

### Step 3: Ghost Piece
1. Update `src/App.css` for ghost styling
2. Modify `src/components/Tetromino.tsx`
3. Add toggle in `src/game/GameState.ts`
4. Test visibility

### Step 4: Sound System
1. Create `src/game/SoundManager.ts`
2. Integrate with `GameState.ts`
3. Add mute toggle
4. Test all sounds

---

## 📊 Progress Tracking

```
Phase 9 Progress: [    ] 0/17 tasks (0%)

Part A: [    ] 0/5 (0%)
Part B: [    ] 0/6 (0%)
Part C: [    ] 0/6 (0%)
```

---

**Created**: 2025-12-16  
**Status**: Ready to begin  
**First Task**: T-P9-002 (Implement CSS animations)  
**Estimated Completion**: 3 weeks
