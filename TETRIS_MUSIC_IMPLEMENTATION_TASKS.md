# Tetris Theme (Korobeiniki) Implementation Tasks

## Overview
Implement the classic Tetris theme "Korobeiniki" using Web Audio API with NES-style square wave synthesis. The music should sync with game speed, playing faster as the level increases.

## Sheet Music Analysis
The sheet music shows the classic Tetris theme in 4/4 time with both treble (melody) and bass (accompaniment) parts.

### Key Signature and Structure
- Key: E minor / G major (1 sharp - F#)
- Time Signature: 4/4
- Tempo: Variable based on game speed (100-200 BPM)
- Structure: Main theme (measures 1-8) with repeat, then "fine" section (measures 9-14)

## Task List

### Task 1: Map Musical Notes to Frequencies
Create a note-to-frequency mapping for all notes used in the Tetris theme.

**Notes Required:**
- Treble clef (melody): E4, F#4, G4, A4, B4, C5, D5, E5, F#5, G5
- Bass clef (accompaniment): E2, E3, G3, A3, B3, C4, D4

**Frequency Table:**
```typescript
const NOTE_FREQUENCIES = {
  // Bass notes (octave 2-3)
  'E2': 82.41,
  'E3': 164.81,
  'F#3': 185.00,
  'G3': 196.00,
  'A3': 220.00,
  'B3': 246.94,
  'C4': 261.63,
  'D4': 293.66,
  
  // Melody notes (octave 4-5)
  'E4': 329.63,
  'F#4': 369.99,
  'G4': 392.00,
  'A4': 440.00,
  'B4': 493.88,
  'C5': 523.25,
  'D5': 587.33,
  'E5': 659.25,
  'F#5': 739.99,
  'G5': 783.99,
};
```

### Task 2: Transcribe Measures 1-4 (Main Theme Part 1)
Transcribe the first 4 measures of the melody from the sheet music.

**Measure 1:**
- E5 (quarter note)
- B4 (eighth note)
- C5 (eighth note)
- D5 (quarter note)
- C5 (eighth note)
- B4 (eighth note)

**Measure 2:**
- A4 (quarter note)
- A4 (eighth note)
- C5 (eighth note)
- E5 (quarter note)
- D5 (eighth note)
- C5 (eighth note)

**Measure 3:**
- B4 (dotted quarter note)
- C5 (eighth note)
- D5 (quarter note)
- E5 (quarter note)

**Measure 4:**
- C5 (quarter note)
- A4 (quarter note)
- A4 (quarter note)
- Rest (quarter note)

### Task 3: Transcribe Measures 5-8 (Main Theme Part 2)
Continue transcribing measures 5-8.

**Measure 5:**
- Rest (eighth note)
- D5 (eighth note)
- F#5 (quarter note)
- A5 (quarter note)
- G5 (eighth note)
- F#5 (eighth note)

**Measure 6:**
- E5 (dotted quarter note)
- C5 (eighth note)
- E5 (quarter note)
- D5 (eighth note)
- C5 (eighth note)

**Measure 7:**
- B4 (quarter note)
- B4 (eighth note)
- C5 (eighth note)
- D5 (quarter note)
- E5 (quarter note)

**Measure 8:**
- C5 (quarter note)
- A4 (quarter note)
- A4 (quarter note)
- Rest (quarter note)

### Task 4: Transcribe Bass Line (Measures 1-8)
Transcribe the bass accompaniment pattern.

**Bass Pattern (repeating):**
The bass follows a pattern of root notes with fifth intervals:
- Measure 1-2: E3 + octave jumps, with chord tones
- Measure 3-4: Similar pattern following chord progression
- Measures 5-8: Continue the pattern

**Bass consists of:**
- Low root notes (E2, A2, B2, etc.)
- Mid-range chord tones (E3, G3, A3, B3, C4, D4)
- Rhythmic pattern: Usually root on beat 1 and 3, chord tones on 2 and 4

### Task 5: Implement Dual-Channel Audio System
Create a two-channel audio system for melody and bass.

**Requirements:**
- Separate oscillators for melody (square wave) and bass (square wave)
- Independent gain control for each channel
- Melody volume: ~0.12
- Bass volume: ~0.08
- Both channels mix to master volume

**Implementation:**
```typescript
private playDualChannelNote(
  melodyFreq: number,
  bassFreq: number,
  duration: number
): void {
  // Play melody note
  if (melodyFreq > 0) {
    this.playMusicNote(melodyFreq, duration, 0.12);
  }
  
  // Play bass note
  if (bassFreq > 0) {
    this.playMusicNote(bassFreq, duration, 0.08);
  }
}
```

### Task 6: Create Note Sequence Data Structure
Build a data structure to hold the complete melody and bass sequence.

**Structure:**
```typescript
interface MusicNote {
  melodyFreq: number;  // 0 for rest
  bassFreq: number;    // 0 for rest
  beats: number;       // Duration in beats (0.25 = sixteenth, 0.5 = eighth, 1 = quarter)
}

const tetrisTheme: MusicNote[] = [
  // Measure 1
  { melodyFreq: NOTE_FREQUENCIES.E5, bassFreq: NOTE_FREQUENCIES.E3, beats: 1 },
  { melodyFreq: NOTE_FREQUENCIES.B4, bassFreq: NOTE_FREQUENCIES.E2, beats: 0.5 },
  // ... continue for all notes
];
```

### Task 7: Implement Main Theme Loop (Measures 1-8)
Replace the placeholder melody in `playMusicSequence()` with the transcribed Tetris theme.

**Steps:**
1. Convert all transcribed notes to the MusicNote format
2. Include both melody and bass frequencies
3. Add proper timing for quarter notes (1 beat), eighth notes (0.5 beats), etc.
4. Ensure the sequence loops properly at measure 8

### Task 8: Transcribe "Fine" Section (Measures 9-14)
Transcribe the second part of the theme (the "fine" ending section).

**Measure 9-10:**
- D5 (half note) → C5 (half note)
- Bass: D4 chord pattern → C4 chord pattern

**Measure 11-12:**
- B4 (half note) → A4 (half note with #)
- Bass: B3 chord pattern → A3 chord pattern

**Measure 13-14:**
- G4 (half note)
- B4 (half note)
- Bass: G3 chord pattern

### Task 9: Implement Full Theme with Repeat
Create complete playback structure:
1. Play main theme (measures 1-8)
2. Repeat main theme (measures 1-8)
3. Play fine section (measures 9-14)
4. Loop back to start

### Task 10: Optimize Tempo Scaling
Ensure music tempo properly scales with game speed.

**Current mapping:**
- Game speed: 1000ms → Tempo: 100 BPM
- Game speed: 100ms → Tempo: 200 BPM

**Verify:**
- Music remains recognizable at all speeds
- Note timing stays synchronized
- No audio glitches during tempo transitions

### Task 11: Add Grace Notes and Articulation
Add subtle musical touches:
- Slight envelope shaping for note attacks
- Minimal note separation (staccato feel) where appropriate
- Ensure smooth transitions between measures

### Task 12: Test and Debug
- Test music playback at various game speeds
- Verify loop timing is seamless
- Check that music stops/starts properly with game state
- Ensure music volume doesn't overpower sound effects
- Verify memory cleanup (no audio context leaks)

## Technical Notes

### Note Duration Calculations
- Whole note (4 beats): `getMusicNoteLength(4)`
- Half note (2 beats): `getMusicNoteLength(2)`
- Quarter note (1 beat): `getMusicNoteLength(1)`
- Eighth note (0.5 beats): `getMusicNoteLength(0.5)`
- Sixteenth note (0.25 beats): `getMusicNoteLength(0.25)`
- Dotted quarter (1.5 beats): `getMusicNoteLength(1.5)`

### Audio Synthesis Parameters
- Wave type: `'square'` (NES-style)
- Melody volume: 0.12
- Bass volume: 0.08
- Note envelope: Exponential decay
- Master volume: 0.3 (set in constructor)

### Performance Considerations
- Pre-calculate all note timings
- Use `setTimeout` for scheduling (already implemented)
- Clean up oscillators after use (already handled by Web Audio API)
- Limit concurrent oscillators to avoid audio distortion

## Testing Checklist
- [ ] All notes play at correct pitches
- [ ] Melody is recognizable as Tetris theme
- [ ] Bass line provides proper harmonic support
- [ ] Music loops seamlessly
- [ ] Tempo increases correctly with game speed
- [ ] Music can be toggled on/off
- [ ] Sound effects work alongside music
- [ ] No audio artifacts or glitches
- [ ] Memory usage remains stable during long play sessions

## Reference
- Original sheet music: `/specs/tetris-sheet-music.pdf`
- Original composer: Nikolay Nekrasov (traditional Russian folk song "Korobeiniki")
- Arrangement: Nintendo/The Tetris Company
