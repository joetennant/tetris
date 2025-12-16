/**
 * SoundManager - Generates classic NES/Gameboy-style Tetris sounds using Web Audio API
 */
export class SoundManager {
  private audioContext: AudioContext | null = null;
  private masterVolume: GainNode | null = null;
  private enabled: boolean = true;
  private musicEnabled: boolean = true;
  private currentMusicTimeout: number | null = null;
  private musicTempo: number = 150; // BPM
  private isMusicPlaying: boolean = false;

  constructor() {
    this.initAudio();
  }

  private initAudio(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.masterVolume = this.audioContext.createGain();
      this.masterVolume.gain.value = 0.3;
      this.masterVolume.connect(this.audioContext.destination);
    } catch (e) {
      console.warn('Web Audio API not supported');
      this.enabled = false;
    }
  }

  private playTone(frequency: number, duration: number, volume: number = 0.3, type: OscillatorType = 'square'): void {
    if (!this.enabled || !this.audioContext || !this.masterVolume) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.masterVolume);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }



  // Piece movement (short blip)
  public playMove(): void {
    this.playTone(200, 0.05, 0.15);
  }

  // Piece rotation (quick chirp)
  public playRotate(): void {
    if (!this.enabled || !this.audioContext || !this.masterVolume) return;
    this.playTone(300, 0.03, 0.2);
    setTimeout(() => {
      if (this.enabled) this.playTone(400, 0.03, 0.15);
    }, 30);
  }

  // Piece lands (thud)
  public playLand(): void {
    this.playTone(150, 0.1, 0.08, 'triangle');
  }

  // Hard drop (whoosh down)
  public playHardDrop(): void {
    if (!this.enabled || !this.audioContext || !this.masterVolume) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.15);

    gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

    oscillator.connect(gainNode);
    gainNode.connect(this.masterVolume!);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + 0.15);
  }

  // Hold piece (soft pop)
  public playHold(): void {
    this.playTone(350, 0.08, 0.2);
  }

  // Line clear (single line)
  public playLineClear(): void {
    if (!this.enabled || !this.audioContext || !this.masterVolume) return;
    
    // Ascending arpeggio
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5
    notes.forEach((note, i) => {
      setTimeout(() => {
        if (this.enabled) this.playTone(note, 0.15, 0.25);
      }, i * 50);
    });
  }

  // Double line clear
  public playDoubleLineClear(): void {
    if (!this.enabled || !this.audioContext || !this.masterVolume) return;
    
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((note, i) => {
      setTimeout(() => {
        if (this.enabled) this.playTone(note, 0.15, 0.25);
      }, i * 40);
    });
  }

  // Triple line clear
  public playTripleLineClear(): void {
    if (!this.enabled || !this.audioContext || !this.masterVolume) return;
    
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    notes.forEach((note, i) => {
      setTimeout(() => {
        if (this.enabled) this.playTone(note, 0.18, 0.25);
      }, i * 35);
    });
  }

  // Tetris (4 lines) - special fanfare
  public playTetris(): void {
    if (!this.enabled || !this.audioContext || !this.masterVolume) return;
    
    // Victory fanfare
    const melody = [
      { freq: 523.25, time: 0 },     // C5
      { freq: 659.25, time: 80 },    // E5
      { freq: 783.99, time: 160 },   // G5
      { freq: 1046.50, time: 240 },  // C6
      { freq: 1318.51, time: 320 },  // E6
      { freq: 1568.00, time: 400 },  // G6
    ];
    
    melody.forEach(note => {
      setTimeout(() => {
        if (this.enabled) this.playTone(note.freq, 0.2, 0.3);
      }, note.time);
    });
  }

  // Level up
  public playLevelUp(): void {
    if (!this.enabled || !this.audioContext || !this.masterVolume) return;
    
    const notes = [392.00, 523.25, 659.25, 783.99, 1046.50]; // G4, C5, E5, G5, C6
    notes.forEach((note, i) => {
      setTimeout(() => {
        if (this.enabled) this.playTone(note, 0.12, 0.25);
      }, i * 50);
    });
  }

  // Game over
  public playGameOver(): void {
    if (!this.enabled || !this.audioContext || !this.masterVolume) return;
    
    // Descending sad trombone
    const notes = [523.25, 493.88, 440.00, 392.00, 349.23]; // C5, B4, A4, G4, F4
    notes.forEach((note, i) => {
      setTimeout(() => {
        if (this.enabled) this.playTone(note, 0.3, 0.2, 'triangle');
      }, i * 150);
    });
  }

  // Invalid move (error beep)
  public playInvalid(): void {
    this.playTone(100, 0.1, 0.2);
  }

  public setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public setVolume(volume: number): void {
    if (this.masterVolume) {
      this.masterVolume.gain.value = Math.max(0, Math.min(1, volume));
    }
  }

  // Background music methods
  private playMusicNote(frequency: number, duration: number, volume: number = 0.15): void {
    if (!this.musicEnabled || !this.enabled || !this.audioContext || !this.masterVolume) return;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.type = 'square';
    oscillator.frequency.value = frequency;

    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(this.masterVolume);

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  private getMusicNoteLength(beats: number): number {
    // Convert beats to milliseconds based on current tempo
    return (60000 / this.musicTempo) * beats;
  }

  private playMusicSequence(): void {
    if (!this.musicEnabled || !this.enabled) return;

    // Enhanced Tetris Theme (Korobeiniki) - Sophisticated arrangement
    // Main melody with harmony, countermelody, and rich bass
    const melody = [
      // Measure 1
      { freq: 659.25, beats: 1 },    // E5
      { freq: 493.88, beats: 0.5 },  // B4
      { freq: 523.25, beats: 0.5 },  // C5
      { freq: 587.33, beats: 1 },    // D5
      { freq: 523.25, beats: 0.5 },  // C5
      { freq: 493.88, beats: 0.5 },  // B4
      
      // Measure 2
      { freq: 440.00, beats: 1 },    // A4
      { freq: 440.00, beats: 0.5 },  // A4
      { freq: 523.25, beats: 0.5 },  // C5
      { freq: 659.25, beats: 1 },    // E5
      { freq: 587.33, beats: 0.5 },  // D5
      { freq: 523.25, beats: 0.5 },  // C5
      
      // Measure 3
      { freq: 493.88, beats: 1.5 },  // B4
      { freq: 523.25, beats: 0.5 },  // C5
      { freq: 587.33, beats: 1 },    // D5
      { freq: 659.25, beats: 1 },    // E5
      
      // Measure 4
      { freq: 523.25, beats: 1 },    // C5
      { freq: 440.00, beats: 1 },    // A4
      { freq: 440.00, beats: 1 },    // A4
      { freq: 0, beats: 0.5 },       // rest
      { freq: 587.33, beats: 0.5 },  // D5
      
      // Measure 5 (bridge section)
      { freq: 698.46, beats: 1 },    // F5
      { freq: 880.00, beats: 0.5 },  // A5
      { freq: 698.46, beats: 0.5 },  // F5
      { freq: 659.25, beats: 1 },    // E5
      { freq: 523.25, beats: 0.5 },  // C5
      { freq: 659.25, beats: 0.5 },  // E5
      
      // Measure 6
      { freq: 587.33, beats: 1.5 },  // D5
      { freq: 523.25, beats: 0.5 },  // C5
      { freq: 493.88, beats: 1 },    // B4
      { freq: 493.88, beats: 0.5 },  // B4
      { freq: 523.25, beats: 0.5 },  // C5
      
      // Measure 7
      { freq: 587.33, beats: 1 },    // D5
      { freq: 659.25, beats: 1 },    // E5
      { freq: 523.25, beats: 1 },    // C5
      { freq: 440.00, beats: 1 },    // A4
      
      // Measure 8
      { freq: 440.00, beats: 2 },    // A4
      { freq: 0, beats: 2 },         // rest
    ];

    // Harmony line (third above or below melody)
    const harmony = [
      // Measure 1
      { freq: 523.25, beats: 1 },    // C5 (harmony)
      { freq: 392.00, beats: 0.5 },  // G4
      { freq: 440.00, beats: 0.5 },  // A4
      { freq: 493.88, beats: 1 },    // B4
      { freq: 440.00, beats: 0.5 },  // A4
      { freq: 392.00, beats: 0.5 },  // G4
      
      // Measure 2
      { freq: 329.63, beats: 1 },    // E4
      { freq: 329.63, beats: 0.5 },  // E4
      { freq: 392.00, beats: 0.5 },  // G4
      { freq: 523.25, beats: 1 },    // C5
      { freq: 493.88, beats: 0.5 },  // B4
      { freq: 440.00, beats: 0.5 },  // A4
      
      // Measure 3
      { freq: 392.00, beats: 1.5 },  // G4
      { freq: 440.00, beats: 0.5 },  // A4
      { freq: 493.88, beats: 1 },    // B4
      { freq: 523.25, beats: 1 },    // C5
      
      // Measure 4
      { freq: 440.00, beats: 1 },    // A4
      { freq: 329.63, beats: 1 },    // E4
      { freq: 329.63, beats: 1 },    // E4
      { freq: 0, beats: 0.5 },       // rest
      { freq: 493.88, beats: 0.5 },  // B4
      
      // Measure 5
      { freq: 587.33, beats: 1 },    // D5
      { freq: 698.46, beats: 0.5 },  // F5
      { freq: 587.33, beats: 0.5 },  // D5
      { freq: 523.25, beats: 1 },    // C5
      { freq: 440.00, beats: 0.5 },  // A4
      { freq: 523.25, beats: 0.5 },  // C5
      
      // Measure 6
      { freq: 493.88, beats: 1.5 },  // B4
      { freq: 440.00, beats: 0.5 },  // A4
      { freq: 392.00, beats: 1 },    // G4
      { freq: 392.00, beats: 0.5 },  // G4
      { freq: 440.00, beats: 0.5 },  // A4
      
      // Measure 7
      { freq: 493.88, beats: 1 },    // B4
      { freq: 523.25, beats: 1 },    // C5
      { freq: 440.00, beats: 1 },    // A4
      { freq: 329.63, beats: 1 },    // E4
      
      // Measure 8
      { freq: 329.63, beats: 2 },    // E4
      { freq: 0, beats: 2 },         // rest
    ];

    // Walking bass line with chord roots and fifths
    const bass = [
      // Measure 1
      { freq: 164.81, beats: 1 },    // E3
      { freq: 246.94, beats: 1 },    // B3 (fifth)
      { freq: 196.00, beats: 1 },    // G3
      { freq: 246.94, beats: 1 },    // B3
      
      // Measure 2
      { freq: 220.00, beats: 1 },    // A3
      { freq: 329.63, beats: 1 },    // E4 (fifth)
      { freq: 164.81, beats: 1 },    // E3
      { freq: 246.94, beats: 1 },    // B3
      
      // Measure 3
      { freq: 246.94, beats: 1 },    // B3
      { freq: 196.00, beats: 1 },    // G3
      { freq: 196.00, beats: 1 },    // G3
      { freq: 293.66, beats: 1 },    // D4 (fifth)
      
      // Measure 4
      { freq: 220.00, beats: 1 },    // A3
      { freq: 329.63, beats: 1 },    // E4
      { freq: 220.00, beats: 1 },    // A3
      { freq: 196.00, beats: 1 },    // G3
      
      // Measure 5
      { freq: 174.61, beats: 1 },    // F3
      { freq: 261.63, beats: 1 },    // C4 (fifth)
      { freq: 220.00, beats: 1 },    // A3
      { freq: 329.63, beats: 1 },    // E4
      
      // Measure 6
      { freq: 196.00, beats: 1 },    // G3
      { freq: 293.66, beats: 1 },    // D4
      { freq: 246.94, beats: 1 },    // B3
      { freq: 196.00, beats: 1 },    // G3
      
      // Measure 7
      { freq: 196.00, beats: 1 },    // G3
      { freq: 293.66, beats: 1 },    // D4
      { freq: 220.00, beats: 1 },    // A3
      { freq: 329.63, beats: 1 },    // E4
      
      // Measure 8
      { freq: 220.00, beats: 1.5 },  // A3
      { freq: 164.81, beats: 0.5 },  // E3 (walkdown)
      { freq: 0, beats: 2 },         // rest
    ];

    // Countermelody (plays during second half of loop for interest)
    const counter = [
      // Measures 1-4: rest
      { freq: 0, beats: 16 },
      
      // Measure 5: active countermelody
      { freq: 440.00, beats: 0.5 },  // A4
      { freq: 523.25, beats: 0.5 },  // C5
      { freq: 659.25, beats: 1 },    // E5
      { freq: 587.33, beats: 1 },    // D5
      { freq: 440.00, beats: 1 },    // A4
      
      // Measure 6
      { freq: 493.88, beats: 0.5 },  // B4
      { freq: 587.33, beats: 0.5 },  // D5
      { freq: 523.25, beats: 1 },    // C5
      { freq: 392.00, beats: 0.5 },  // G4
      { freq: 440.00, beats: 0.5 },  // A4
      { freq: 493.88, beats: 1 },    // B4
      
      // Measure 7
      { freq: 523.25, beats: 0.5 },  // C5
      { freq: 587.33, beats: 0.5 },  // D5
      { freq: 659.25, beats: 1 },    // E5
      { freq: 587.33, beats: 1 },    // D5
      { freq: 523.25, beats: 1 },    // C5
      
      // Measure 8
      { freq: 440.00, beats: 1 },    // A4
      { freq: 329.63, beats: 1 },    // E4
      { freq: 0, beats: 2 },         // rest
    ];

    let currentTime = 0;
    
    // Play melody
    melody.forEach((note) => {
      if (note.freq > 0) {
        setTimeout(() => {
          if (this.isMusicPlaying) {
            const duration = this.getMusicNoteLength(note.beats);
            this.playMusicNote(note.freq, duration / 1000, 0.09);
          }
        }, currentTime);
      }
      currentTime += this.getMusicNoteLength(note.beats);
    });

    // Play harmony
    let harmonyTime = 0;
    harmony.forEach((note) => {
      if (note.freq > 0) {
        setTimeout(() => {
          if (this.isMusicPlaying) {
            const duration = this.getMusicNoteLength(note.beats);
            this.playMusicNote(note.freq, duration / 1000, 0.06);
          }
        }, harmonyTime);
      }
      harmonyTime += this.getMusicNoteLength(note.beats);
    });

    // Play bass
    let bassTime = 0;
    bass.forEach((note) => {
      if (note.freq > 0) {
        setTimeout(() => {
          if (this.isMusicPlaying) {
            const duration = this.getMusicNoteLength(note.beats);
            this.playMusicNote(note.freq, duration / 1000, 0.05);
          }
        }, bassTime);
      }
      bassTime += this.getMusicNoteLength(note.beats);
    });

    // Play countermelody
    let counterTime = 0;
    counter.forEach((note) => {
      if (note.freq > 0) {
        setTimeout(() => {
          if (this.isMusicPlaying) {
            const duration = this.getMusicNoteLength(note.beats);
            this.playMusicNote(note.freq, duration / 1000, 0.04);
          }
        }, counterTime);
      }
      counterTime += this.getMusicNoteLength(note.beats);
    });

    // Loop the music
    if (this.isMusicPlaying) {
      this.currentMusicTimeout = window.setTimeout(() => {
        this.playMusicSequence();
      }, currentTime);
    }
  }

  public startMusic(gameSpeed: number = 1000): void {
    if (this.isMusicPlaying) return;
    
    // Map game speed to music tempo
    // Faster game = faster tempo
    // gameSpeed ranges from ~1000ms (slow/level 1) to ~100ms (fast/high level)
    // Map to tempo: 120 BPM at level 1, scaling up to 240 BPM at fastest
    // Formula: 120 + (1000 - gameSpeed) * 0.133
    this.musicTempo = Math.max(120, Math.min(240, 120 + (1000 - gameSpeed) * 0.133));
    
    this.isMusicPlaying = true;
    this.playMusicSequence();
  }

  public stopMusic(): void {
    this.isMusicPlaying = false;
    if (this.currentMusicTimeout !== null) {
      clearTimeout(this.currentMusicTimeout);
      this.currentMusicTimeout = null;
    }
  }

  public updateMusicTempo(gameSpeed: number): void {
    // Update tempo based on game speed
    // 120 BPM at level 1 (1000ms), scaling up to 240 BPM at fastest
    this.musicTempo = Math.max(120, Math.min(240, 120 + (1000 - gameSpeed) * 0.133));
  }

  public setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    if (!enabled) {
      this.stopMusic();
    }
  }

  public isMusicEnabled(): boolean {
    return this.musicEnabled;
  }
}

export const soundManager = new SoundManager();
