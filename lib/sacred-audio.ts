/**
 * Sacred Audio & Ambient Sound Engine
 *
 * Provides:
 * 1. Web Speech Synthesis for clear Sanskrit shloka recitation.
 * 2. Pure Web Audio API synthesized Tanpura meditation drone (Sa-Pa harmonics).
 *    Zero external network audio downloads, 0ms latency, 100% offline support.
 */

// ── 1. TANPURA DRONE ENGINE (WEB AUDIO API) ──────────────────────────────────
let audioCtx: AudioContext | null = null;
let tanpuraGain: GainNode | null = null;
let activeOscillators: OscillatorNode[] = [];
let isDroneRunning = false;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

/**
 * Starts the meditative Tanpura acoustic drone.
 * Uses classical Indian classical tuning: Sa (root C#3 138.6Hz), Pa (fifth G#3 207.6Hz), and upper Sa (C#4 277.2Hz).
 */
export function startTanpuraDrone(targetVolume: number = 0.12): boolean {
  try {
    const ctx = getAudioContext();
    if (!ctx) return false;

    if (isDroneRunning) {
      return true;
    }

    // Master gain node with smooth fade-in
    tanpuraGain = ctx.createGain();
    tanpuraGain.gain.setValueAtTime(0.001, ctx.currentTime);
    tanpuraGain.gain.exponentialRampToValueAtTime(Math.max(0.01, Math.min(targetVolume, 0.4)), ctx.currentTime + 1.2);

    // Warm acoustic low-pass filter
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(520, ctx.currentTime);
    filter.Q.setValueAtTime(1.5, ctx.currentTime);

    tanpuraGain.connect(filter);
    filter.connect(ctx.destination);

    // Classical Sa - Pa - Sa harmonic frequencies (C# base)
    const strings = [
      { freq: 207.65, detune: 2 },    // Pa (5th)
      { freq: 277.18, detune: -1.5 },  // Sa (Upper Octave)
      { freq: 277.18, detune: 1.5 },   // Sa (Upper Octave shimmer)
      { freq: 138.59, detune: 0 },     // Kharaj Sa (Deep Base)
    ];

    activeOscillators = strings.map((s) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(s.freq, ctx.currentTime);
      osc.detune.setValueAtTime(s.detune, ctx.currentTime);
      osc.connect(tanpuraGain!);
      osc.start();
      return osc;
    });

    isDroneRunning = true;
    return true;
  } catch (err) {
    console.error('Tanpura drone start error:', err);
    return false;
  }
}

/**
 * Stops the Tanpura drone with a smooth fade-out.
 */
export function stopTanpuraDrone(): void {
  if (!isDroneRunning || !audioCtx || !tanpuraGain) {
    isDroneRunning = false;
    return;
  }

  try {
    const now = audioCtx.currentTime;
    tanpuraGain.gain.setValueAtTime(tanpuraGain.gain.value, now);
    tanpuraGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);

    setTimeout(() => {
      activeOscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {}
      });
      activeOscillators = [];
      isDroneRunning = false;
    }, 850);
  } catch {
    isDroneRunning = false;
  }
}

export function isTanpuraActive(): boolean {
  return isDroneRunning;
}

// ── 2. SPEECH SYNTHESIS SANSKRIT SHLOKA RECITATOR ────────────────────────────
let currentUtterance: SpeechSynthesisUtterance | null = null;

export function speakSanskritShloka(
  text: string,
  rate: number = 0.85,
  onEnd?: () => void,
  onError?: () => void,
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }

  try {
    window.speechSynthesis.cancel();

    // Clean punctuation and dandas for smooth speech synthesis
    const cleanText = text
      .replace(/[।॥|]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return false;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = Math.max(0.6, Math.min(rate, 1.4));
    utterance.pitch = 0.95;

    // Pick best available voice for Indian languages or Sanskrit
    const voices = window.speechSynthesis.getVoices();
    const hindiOrSanskritVoice =
      voices.find((v) => v.lang.startsWith('sa') || v.lang.startsWith('hi')) ||
      voices.find((v) => v.lang.includes('IN')) ||
      voices[0];

    if (hindiOrSanskritVoice) {
      utterance.voice = hindiOrSanskritVoice;
    }

    utterance.onend = () => {
      currentUtterance = null;
      onEnd?.();
    };

    utterance.onerror = () => {
      currentUtterance = null;
      onError?.();
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Speech synthesis error:', err);
    onError?.();
    return false;
  }
}

export function stopSanskritSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    currentUtterance = null;
  }
}

export function isSpeakingSanskrit(): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return false;
  }
  return window.speechSynthesis.speaking;
}
