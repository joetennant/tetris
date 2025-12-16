# Phase 9: Graphics, Animation & Sound Enhancement

**Created**: 2025-12-16  
**Status**: 🚧 **Planning**

---

## 🎯 Overview

Enhance the visual and audio experience of the Tetris game with improved animations, better ghost piece visualization, and classic Tetris sound effects.

**Goals**:
1. Create more impressive line clear animations
2. Improve ghost piece visuals
3. Add ghost piece toggle control
4. Implement classic Tetris sound effects

---

## 📋 Task Breakdown

### Part A: Enhanced Line Clear Animation

**Current State**: Simple fade animation (300ms)

**Target State**: Impressive multi-stage animation with:
- Initial flash (white flash)
- Pulsing/blinking effect
- Color shifts
- Fade out with particle-like effect
- Celebration visual for Tetris (4 lines)

---

#### T-P9-001: Design Enhanced Line Clear Animation
**Type**: Design  
**Priority**: High  
**Effort**: 1 hour

**Requirements**:
- Research classic Tetris line clear animations
- Design multi-stage animation sequence
- Define timing for each stage
- Consider different animations for 1/2/3/4 lines

**Animation Stages**:
1. **Flash** (50ms): Bright white flash on cleared lines
2. **Pulse** (150ms): Rapid brightness pulse (3-4 pulses)
3. **Color Shift** (100ms): Shift through colors (white → yellow → white)
4. **Fade Out** (200ms): Dissolve effect with reduced opacity
5. **Total Duration**: ~500ms (increased from 300ms)

**Special Effects**:
- **Tetris (4 lines)**: Extra bright flash, longer pulse, gold color
- **Multi-line**: More intense effects for more lines

**Files**: Planning document

---

#### T-P9-002: Implement CSS Keyframe Animations
**Type**: Implementation  
**Priority**: High  
**Effort**: 2 hours

**Tasks**:
1. Create new keyframe animations in App.css
2. Define animation stages (flash → pulse → color-shift → fade)
3. Add different animation classes for 1/2/3/4 line clears
4. Implement timing functions (ease-in-out, cubic-bezier)
5. Test animation performance (maintain 60 FPS)

**CSS Classes to Add**:
- `.clearing-line` → Current basic animation (replace)
- `.clearing-line-1` → Single line clear
- `.clearing-line-2` → Double line clear
- `.clearing-line-3` → Triple line clear
- `.clearing-line-4` → Tetris (special animation)

**Keyframes to Create**:
```css
@keyframes line-clear-flash { /* White flash */ }
@keyframes line-clear-pulse { /* Brightness pulse */ }
@keyframes line-clear-color-shift { /* Color changes */ }
@keyframes line-clear-fade { /* Dissolve effect */ }
@keyframes tetris-celebration { /* Special 4-line effect */ }
```

**Files**: `src/App.css`

---

#### T-P9-003: Update GameState to Track Line Clear Count
**Type**: Implementation  
**Priority**: High  
**Effort**: 1 hour

**Tasks**:
1. Pass line clear count to animation system
2. Update `clearingLines` state to include count metadata
3. Emit line clear count in state updates

**Changes Needed**:
```typescript
// types.ts
interface GameState {
  clearingLines: number[];        // Current
  clearingLineCount?: number;     // NEW: 1, 2, 3, or 4
}
```

**Files**: `src/game/types.ts`, `src/game/GameState.ts`

---

#### T-P9-004: Apply Dynamic Animation Classes in Playfield
**Type**: Implementation  
**Priority**: High  
**Effort**: 1 hour

**Tasks**:
1. Update Playfield component to use line count
2. Apply correct animation class based on count
3. Test all animation variants (1/2/3/4 lines)

**Logic**:
```tsx
const animationClass = clearingLineCount === 4 
  ? 'clearing-line-4' 
  : clearingLineCount === 3 
  ? 'clearing-line-3'
  : clearingLineCount === 2
  ? 'clearing-line-2'
  : 'clearing-line-1';
```

**Files**: `src/components/Playfield.tsx`

---

#### T-P9-005: Test Line Clear Animations
**Type**: Testing  
**Priority**: High  
**Effort**: 1 hour

**Test Cases**:
1. Single line clear → Basic animation
2. Double line clear → Enhanced animation
3. Triple line clear → Strong animation
4. Tetris (4 lines) → Celebration animation
5. Multiple simultaneous animations → No performance issues
6. Animation timing → Matches delay (500ms)

**Verification**:
- [ ] Animations visually impressive
- [ ] 60 FPS maintained
- [ ] No stuttering or lag
- [ ] Tetris animation special/satisfying

**Files**: Manual testing

---

### Part B: Enhanced Ghost Piece Visuals

**Current State**: Semi-transparent piece with same colors

**Target State**: Distinctive visual style:
- Outlined/bordered appearance
- Different color scheme (lighter/desaturated)
- Subtle animation (optional pulse)
- Clear distinction from active piece

---

#### T-P9-006: Design Ghost Piece Visual Style
**Type**: Design  
**Priority**: Medium  
**Effort**: 30 minutes

**Options to Consider**:
1. **Outline Style**: Hollow blocks with borders only
2. **Wireframe Style**: Grid pattern overlay
3. **Desaturated Style**: Faded colors with border
4. **Glow Style**: Soft glow effect around edges

**Recommended**: Outline + Desaturated
- Clear distinction from active piece
- Easy to see landing position
- Doesn't obscure locked blocks
- Classic Tetris aesthetic

**Files**: Design notes

---

#### T-P9-007: Implement Enhanced Ghost Piece CSS
**Type**: Implementation  
**Priority**: Medium  
**Effort**: 1 hour

**Tasks**:
1. Create new CSS class for ghost piece blocks
2. Implement outline/border style
3. Add desaturated colors
4. Optional: Add subtle pulse animation
5. Ensure visibility on all backgrounds

**CSS Changes**:
```css
.tetromino-block.ghost {
  background: transparent;
  border: 2px solid currentColor;
  opacity: 0.5;
  box-shadow: inset 0 0 8px rgba(255, 255, 255, 0.3);
}

/* Optional pulse */
@keyframes ghost-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.7; }
}
```

**Files**: `src/App.css`

---

#### T-P9-008: Update Tetromino Component for Ghost Styling
**Type**: Implementation  
**Priority**: Medium  
**Effort**: 30 minutes

**Tasks**:
1. Apply ghost class to ghost piece blocks
2. Pass ghost flag to block rendering
3. Test visual distinction

**Files**: `src/components/Tetromino.tsx`

---

#### T-P9-009: Add Ghost Piece Toggle Input
**Type**: Implementation  
**Priority**: Medium  
**Effort**: 1 hour

**Tasks**:
1. Add `TOGGLE_GHOST` input to types
2. Add keyboard binding (G key)
3. Add state flag `ghostPieceVisible: boolean`
4. Toggle visibility in GameState
5. Update UI to conditionally render ghost

**Input Addition**:
```typescript
export const Input = {
  // ... existing ...
  TOGGLE_GHOST: 'toggleGhost',
} as const;
```

**State Addition**:
```typescript
interface GameState {
  // ... existing ...
  ghostPieceVisible: boolean;  // Default: true
}
```

**Files**: `src/game/types.ts`, `src/game/GameState.ts`, `src/components/Game.tsx`

---

#### T-P9-010: Add Ghost Toggle to Controls Display
**Type**: Implementation  
**Priority**: Low  
**Effort**: 15 minutes

**Tasks**:
1. Add ghost toggle hint to Controls component
2. Show current state in debug panel (optional)

**Files**: `src/components/Controls.tsx`, `src/components/DebugPanel.tsx` (optional)

---

#### T-P9-011: Test Ghost Piece Enhancements
**Type**: Testing  
**Priority**: Medium  
**Effort**: 30 minutes

**Test Cases**:
1. Ghost piece visually distinct from active piece
2. Landing position clearly visible
3. Doesn't obscure locked blocks
4. G key toggles ghost on/off
5. State persists during gameplay
6. Works on all tetromino types

**Files**: Manual testing

---

### Part C: Classic Tetris Sound Effects

**Sounds Needed**:
1. Piece move (left/right)
2. Piece rotate
3. Soft drop
4. Hard drop / piece lock
5. Line clear (different sounds for 1/2/3/4 lines)
6. Level up
7. Game over

---

#### T-P9-012: Source/Create Sound Effects
**Type**: Asset Creation  
**Priority**: Medium  
**Effort**: 2 hours

**Options**:
1. **Use Public Domain Sounds**: Classic NES Tetris sounds
2. **Create New Sounds**: 8-bit style with online tools
3. **Use Sound Libraries**: Freesound.org, OpenGameArt

**Sound Requirements**:
- Format: MP3 or OGG (web-friendly)
- Duration: Short (50-500ms)
- Size: Small (<50KB each)
- License: Public domain or compatible

**Sound List**:
- `move.mp3` (or .ogg) - Piece shift
- `rotate.mp3` - Piece rotation
- `soft-drop.mp3` - Soft drop tick
- `hard-drop.mp3` - Hard drop thud
- `lock.mp3` - Piece lock click
- `line-clear-1.mp3` - Single line
- `line-clear-2.mp3` - Double line
- `line-clear-3.mp3` - Triple line
- `line-clear-4.mp3` - Tetris! (special)
- `level-up.mp3` - Level increase
- `game-over.mp3` - Game over sound

**Files**: `my-app/public/sounds/` (new directory)

---

#### T-P9-013: Create Sound Manager Class
**Type**: Implementation  
**Priority**: Medium  
**Effort**: 2 hours

**Requirements**:
1. Preload all sound files
2. Play sounds without blocking game loop
3. Handle volume control
4. Prevent sound overlap (multiple plays)
5. Mute/unmute functionality

**Class Structure**:
```typescript
// src/game/SoundManager.ts
export class SoundManager {
  private sounds: Map<string, HTMLAudioElement>;
  private muted: boolean;
  private volume: number;
  
  constructor();
  preload(soundFiles: Record<string, string>): Promise<void>;
  play(soundName: string): void;
  setVolume(volume: number): void;
  mute(): void;
  unmute(): void;
}
```

**Files**: `src/game/SoundManager.ts` (new)

---

#### T-P9-014: Integrate Sound Manager with GameState
**Type**: Implementation  
**Priority**: Medium  
**Effort**: 1 hour

**Tasks**:
1. Add SoundManager instance to GameState
2. Call play() on game events
3. Handle sound loading on game start
4. Add mute state to GameState

**Integration Points**:
```typescript
// In GameState
handleInput(input) {
  switch(input) {
    case Input.MOVE_LEFT:
    case Input.MOVE_RIGHT:
      if (moved) this.soundManager.play('move');
      break;
    case Input.ROTATE_CW:
    case Input.ROTATE_CCW:
      if (rotated) this.soundManager.play('rotate');
      break;
    // ... etc
  }
}
```

**Files**: `src/game/GameState.ts`

---

#### T-P9-015: Add Sound Toggle Input
**Type**: Implementation  
**Priority**: Medium  
**Effort**: 30 minutes

**Tasks**:
1. Add `TOGGLE_SOUND` input
2. Add keyboard binding (M key for mute)
3. Toggle sound manager mute state
4. Persist preference (localStorage optional)

**Files**: `src/game/types.ts`, `src/components/Game.tsx`

---

#### T-P9-016: Add Sound Controls to UI
**Type**: Implementation  
**Priority**: Low  
**Effort**: 30 minutes

**Tasks**:
1. Add mute button or indicator
2. Show sound status in controls
3. Optional: Volume slider

**Files**: `src/components/Controls.tsx`

---

#### T-P9-017: Test Sound System
**Type**: Testing  
**Priority**: Medium  
**Effort**: 1 hour

**Test Cases**:
1. All sounds play at correct times
2. No audio lag or delay
3. Sounds don't overlap annoyingly
4. Mute toggle works
5. Volume control works (if implemented)
6. Sounds work on different browsers
7. No performance impact

**Browser Testing**:
- Chrome
- Firefox
- Safari (if available)
- Mobile browsers

**Files**: Manual testing

---

## 📊 Phase Summary

### Tasks by Priority

**High Priority** (Must Have):
- T-P9-001: Design line clear animation
- T-P9-002: Implement CSS animations
- T-P9-003: Track line clear count
- T-P9-004: Apply dynamic classes
- T-P9-005: Test animations

**Medium Priority** (Should Have):
- T-P9-006: Design ghost piece style
- T-P9-007: Implement ghost CSS
- T-P9-008: Update Tetromino component
- T-P9-009: Add ghost toggle
- T-P9-011: Test ghost enhancements
- T-P9-012: Source sound effects
- T-P9-013: Create Sound Manager
- T-P9-014: Integrate sounds
- T-P9-015: Add sound toggle
- T-P9-017: Test sound system

**Low Priority** (Nice to Have):
- T-P9-010: Add ghost toggle to controls
- T-P9-016: Add sound controls to UI

### Effort Estimation

| Part | Tasks | Est. Time |
|------|-------|-----------|
| **Part A: Line Clear Animation** | 5 | 6 hours |
| **Part B: Ghost Piece** | 6 | 4 hours |
| **Part C: Sound Effects** | 6 | 7 hours |
| **Total** | 17 | ~17 hours |

### Dependencies

```
Part A (Animation)
├─ T-P9-001 → T-P9-002
├─ T-P9-002 → T-P9-003
├─ T-P9-003 → T-P9-004
└─ T-P9-004 → T-P9-005

Part B (Ghost)
├─ T-P9-006 → T-P9-007
├─ T-P9-007 → T-P9-008
├─ T-P9-008 → T-P9-009
├─ T-P9-009 → T-P9-010
└─ T-P9-009 → T-P9-011

Part C (Sound)
├─ T-P9-012 → T-P9-013
├─ T-P9-013 → T-P9-014
├─ T-P9-014 → T-P9-015
├─ T-P9-015 → T-P9-016
└─ T-P9-015 → T-P9-017
```

---

## 🎨 Design Specifications

### Line Clear Animation Stages

**Single Line (1 line)**:
```
0ms:    Flash white (brightness: 200%)
50ms:   Pulse start (2 pulses)
200ms:  Fade begin (opacity: 1 → 0)
400ms:  Complete (removed)
```

**Double Line (2 lines)**:
```
0ms:    Flash white (brightness: 250%)
50ms:   Pulse start (3 pulses)
200ms:  Color shift (white → yellow)
300ms:  Fade begin
450ms:  Complete
```

**Triple Line (3 lines)**:
```
0ms:    Flash bright (brightness: 300%)
50ms:   Pulse start (4 pulses, faster)
200ms:  Color shift (white → yellow → orange)
350ms:  Fade begin
500ms:  Complete
```

**Tetris (4 lines)**:
```
0ms:    Flash VERY bright (brightness: 400%)
50ms:   Pulse start (5 pulses, fastest)
200ms:  Color shift (white → gold → white → gold)
350ms:  Shimmer effect
450ms:  Fade begin
600ms:  Complete
```

### Ghost Piece Styles

**Option 1: Outline (Recommended)**
```css
background: transparent;
border: 2px solid currentColor;
opacity: 0.5;
```

**Option 2: Wireframe**
```css
background: repeating-linear-gradient(
  45deg,
  transparent,
  transparent 2px,
  currentColor 2px,
  currentColor 4px
);
opacity: 0.3;
```

**Option 3: Glow**
```css
background: transparent;
box-shadow: 
  0 0 10px currentColor,
  inset 0 0 10px currentColor;
opacity: 0.4;
```

---

## 🎵 Sound Design Guidelines

### Sound Characteristics

**Move/Rotate Sounds**:
- Very short (50-100ms)
- Low volume (30-40%)
- High pitch, crisp
- 8-bit style

**Drop Sounds**:
- Short (100-200ms)
- Medium volume (50-60%)
- Lower pitch, solid
- Distinct thud/click

**Line Clear Sounds**:
- Medium length (200-500ms)
- Varies by line count
- Rising pitch sequence
- Satisfying "complete" feel

**Tetris Sound** (4 lines):
- Longer (500-800ms)
- Louder (70-80%)
- Triumphant fanfare
- Special celebration

**Level Up**:
- Medium (300-400ms)
- Medium-high volume (60%)
- Ascending pitch
- Achievement sound

**Game Over**:
- Longer (800-1000ms)
- Medium volume (50%)
- Descending pitch
- Sad/final tone

---

## 🧪 Testing Strategy

### Animation Testing
1. Visual inspection at 60 FPS
2. Test all line clear counts (1-4)
3. Test simultaneous clears (rare, but possible)
4. Performance profiling
5. Cross-browser testing

### Ghost Piece Testing
1. Verify visibility on all colors
2. Test toggle functionality
3. Verify landing position accuracy
4. Test with all piece types
5. Mobile/tablet testing

### Sound Testing
1. Latency testing (< 50ms delay)
2. Browser compatibility
3. Mobile browser testing
4. Volume level balancing
5. No audio clipping or distortion
6. Rapid-fire testing (no overlap issues)

---

## 📝 Acceptance Criteria

### Part A: Line Clear Animation ✅
- [ ] T-P9-001: Animation design documented
- [ ] T-P9-002: CSS keyframes implemented
- [ ] T-P9-003: Line count tracked in state
- [ ] T-P9-004: Dynamic classes applied
- [ ] T-P9-005: All animations tested and working
- [ ] Special Tetris (4-line) animation impressive
- [ ] 60 FPS maintained during animations
- [ ] No visual glitches or artifacts

### Part B: Ghost Piece Enhancement ✅
- [ ] T-P9-006: Visual style designed
- [ ] T-P9-007: CSS implemented
- [ ] T-P9-008: Tetromino component updated
- [ ] T-P9-009: Toggle functionality working
- [ ] T-P9-010: Controls display updated
- [ ] T-P9-011: All tests passed
- [ ] Ghost piece clearly distinct from active piece
- [ ] Landing position easily visible
- [ ] G key toggles ghost on/off

### Part C: Sound Effects ✅
- [ ] T-P9-012: All sound files sourced/created
- [ ] T-P9-013: SoundManager class created
- [ ] T-P9-014: Sounds integrated with game
- [ ] T-P9-015: Mute toggle implemented
- [ ] T-P9-016: UI controls added
- [ ] T-P9-017: All sounds tested
- [ ] No audio lag (<50ms)
- [ ] M key mutes/unmutes sound
- [ ] Sounds enhance gameplay (not annoying)

---

## 🚀 Rollout Plan

### Phase 9.1: Line Clear Animation (Week 1)
- Complete T-P9-001 through T-P9-005
- Test and refine animations
- Deploy and gather feedback

### Phase 9.2: Ghost Piece Enhancement (Week 2)
- Complete T-P9-006 through T-P9-011
- Test visual improvements
- Deploy and gather feedback

### Phase 9.3: Sound Effects (Week 3)
- Complete T-P9-012 through T-P9-017
- Test sound system
- Deploy and gather feedback

### Phase 9.4: Polish & Refinement (Week 4)
- Address feedback
- Fine-tune animations
- Balance sound levels
- Final testing
- Production release

---

## 📚 Resources

### Animation Resources
- CSS Tricks: Keyframe Animations
- MDN: Using CSS Animations
- Easing functions: cubic-bezier.com

### Sound Resources
- **Freesound.org**: Free sound effects
- **OpenGameArt.org**: Game audio assets
- **Beepbox.co**: Create 8-bit sounds
- **SFXR**: Classic game sound generator
- **Audacity**: Audio editing (free)

### Testing Tools
- Chrome DevTools: Performance profiling
- Firefox Developer Tools: Animation inspector
- Lighthouse: Performance audit

---

## 💡 Future Enhancements (Phase 10+)

### Visual Enhancements
- Particle effects on line clear
- Screen shake on Tetris
- Background animations
- Piece trail effects
- Combo multiplier display

### Audio Enhancements
- Background music (main theme)
- Music speed-up at high levels
- Stereo panning for movement
- Echo/reverb on Tetris
- Voice announcements ("Tetris!")

### Advanced Features
- Custom themes (visual + audio)
- Sound/music volume sliders
- Animation speed options
- Accessibility mode (reduced motion)
- Colorblind-friendly palettes

---

**Status**: Ready to Begin  
**Priority**: High (User Experience)  
**Risk**: Low (Non-breaking changes)  
**Dependencies**: None (builds on existing code)
