export class SoundManager {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private enabled: boolean = true;
  private audioContext: AudioContext | null = null;
  private initialized: boolean = false;

  constructor() {
    // Don't initialize sounds immediately - wait for user interaction
    this.setupAudioContext();
  }

  private setupAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported');
    }
  }

  private initializeSounds() {
    if (this.initialized) return;
    
    // Create different sound effects using programmatically generated tones
    this.sounds.set('moveSnake', this.createToneAudio(200, 0.1, 'square'));
    this.sounds.set('eatApple', this.createToneAudio(440, 0.2, 'sine'));
    this.sounds.set('tetrisPlace', this.createToneAudio(330, 0.15, 'square'));
    this.sounds.set('lineClear', this.createToneAudio(660, 0.3, 'sine'));
    this.sounds.set('gameOver', this.createToneAudio(150, 0.8, 'sawtooth'));
    this.sounds.set('starPower', this.createToneAudio(880, 0.5, 'sine'));
    this.sounds.set('pieceDestroy', this.createToneAudio(800, 0.1, 'square'));
    this.sounds.set('menuSelect', this.createToneAudio(660, 0.1, 'square'));
    this.sounds.set('introTheme', this.createToneAudio(440, 1.5, 'sine'));
    
    this.initialized = true;
  }

  private createToneAudio(frequency: number, duration: number, type: OscillatorType): HTMLAudioElement {
    // Create a simple tone using data URL
    const sampleRate = 22050;
    const samples = Math.floor(sampleRate * duration);
    const buffer = new ArrayBuffer(44 + samples * 2);
    const view = new DataView(buffer);
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + samples * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, 1, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeString(36, 'data');
    view.setUint32(40, samples * 2, true);
    
    // Generate tone
    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      let value = 0;
      
      if (type === 'square') {
        value = Math.sin(2 * Math.PI * frequency * t) > 0 ? 0.3 : -0.3;
      } else if (type === 'sine') {
        value = Math.sin(2 * Math.PI * frequency * t) * 0.3;
      } else if (type === 'sawtooth') {
        value = (2 * (frequency * t - Math.floor(frequency * t + 0.5))) * 0.3;
      }
      
      // Apply envelope
      const envelope = Math.exp(-t * 2);
      const sample = Math.max(-1, Math.min(1, value * envelope));
      view.setInt16(44 + i * 2, sample * 32767, true);
    }
    
    const blob = new Blob([buffer], { type: 'audio/wav' });
    const audio = new Audio(URL.createObjectURL(blob));
    audio.volume = 0.3;
    
    return audio;
  }

  async play(soundName: string) {
    if (!this.enabled) return;
    
    // Initialize sounds on first play (after user interaction)
    if (!this.initialized) {
      this.initializeSounds();
    }
    
    // Resume audio context if suspended
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (e) {
        console.warn('Could not resume audio context');
      }
    }
    
    const sound = this.sounds.get(soundName);
    if (sound) {
      try {
        // Reset the audio to beginning and play
        sound.currentTime = 0;
        await sound.play();
      } catch (e) {
        // Try to create a new audio instance if the old one failed
        if (soundName === 'moveSnake') {
          this.playMoveSoundEffect();
        } else if (soundName === 'eatApple') {
          this.playEatSoundEffect();
        }
      }
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  // Play sound sequences for more complex effects
  playSequence(sounds: { name: string; delay: number }[]) {
    sounds.forEach(({ name, delay }) => {
      setTimeout(() => this.play(name), delay);
    });
  }

  // Special effect for line clearing
  playLineClear(lines: number) {
    const baseFreq = 440;
    for (let i = 0; i < lines; i++) {
      setTimeout(() => {
        const freq = baseFreq + (i * 110);
        const audio = this.createToneAudio(freq, 0.2, 'sine');
        if (this.enabled) {
          audio.play().catch(() => {});
        }
      }, i * 100);
    }
  }

  // Special effect for star power activation
  playStarPowerActivation() {
    const frequencies = [440, 554, 659, 880];
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        const audio = this.createToneAudio(freq, 0.15, 'sine');
        if (this.enabled) {
          audio.play().catch(() => {});
        }
      }, index * 50);
    });
  }

  // Alternative sound methods using Web Audio API
  private playMoveSoundEffect() {
    if (!this.audioContext || !this.enabled) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = 200;
    oscillator.type = 'square';
    
    gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.1);
  }

  private playEatSoundEffect() {
    if (!this.audioContext || !this.enabled) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.value = 440;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
    
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + 0.2);
  }

  // Method to test if audio is working
  testSound() {
    this.play('eatApple');
  }

  // Epic intro sequence
  playIntroSequence() {
    if (!this.enabled) return;
    
    const frequencies = [220, 293, 349, 440, 523, 659, 784];
    frequencies.forEach((freq, index) => {
      setTimeout(() => {
        const audio = this.createToneAudio(freq, 0.3, 'sine');
        if (this.enabled) {
          audio.play().catch(() => {});
        }
      }, index * 200);
    });
    
    // Add some bass notes
    setTimeout(() => {
      const bass = this.createToneAudio(110, 1.0, 'square');
      if (this.enabled) {
        bass.volume = 0.2;
        bass.play().catch(() => {});
      }
    }, 1400);
  }

  // Menu navigation sounds
  playMenuHover() {
    if (!this.enabled) return;
    const audio = this.createToneAudio(880, 0.05, 'sine');
    audio.volume = 0.1;
    audio.play().catch(() => {});
  }
}
