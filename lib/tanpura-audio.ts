'use client';

/**
 * Procedural Sacred Tanpura & Om Drone Synthesizer (तन्पूरा नाद)
 *
 * Implements a pure Web Audio API ambient acoustic tanpura drone:
 * - Sa-Pa-Sa-Sa classical Indian tuning:
 *     1. Pancham (Pa): ~207.65 Hz (or Madhyam Ma: ~184.79 Hz)
 *     2. Tar Sa (High Sa): ~277.18 Hz
 *     3. Tar Sa (High Sa): ~277.18 Hz (slight acoustic chorus detuning)
 *     4. Kharaj Sa (Low Sa): ~138.59 Hz (deep resonant root)
 * - Rich harmonic overtone series simulating the curved bone bridge (Jivari / Jawari)
 * - Gentle cyclic plucking cadence (Pa -> Sa -> Sa -> Kharaj Sa every ~1.8 seconds)
 * - Warm low-pass acoustic filtering so it sits gently beneath speech recitation
 * - Smooth exponential fade-in and fade-out to prevent audio clicks
 * - Zero network overhead, zero external files, 100% offline capable.
 */

const STORAGE_KEY = 'dharma_tanpura_enabled';

type Listener = (isPlaying: boolean) => void;
const listeners = new Set<Listener>();

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;
let isPlaying = false;
let sequenceTimer: ReturnType<typeof setInterval> | null = null;
let currentStep = 0;

// Classical Indian Tanpura String Frequencies based on C#3 (138.59 Hz)
// Pa (Pancham) = 3/2 * Sa, Tar Sa = 2 * Sa, Kharaj Sa = 1 * Sa
const SA_ROOT = 138.59;
const STRINGS = [
  { name: 'Pa', freq: SA_ROOT * 1.5, detune: 0, gain: 0.05, duration: 4.5 },
  { name: 'Tar Sa 1', freq: SA_ROOT * 2, detune: -2, gain: 0.045, duration: 4.2 },
  { name: 'Tar Sa 2', freq: SA_ROOT * 2, detune: +2, gain: 0.045, duration: 4.2 },
  { name: 'Kharaj Sa', freq: SA_ROOT, detune: 0, gain: 0.065, duration: 5.5 },
];

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtx = new AudioCtxClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch {
    return null;
  }
}

function notifyListeners() {
  listeners.forEach((listener) => {
    try {
      listener(isPlaying);
    } catch {}
  });
}

/**
 * Pluck a single tanpura string with authentic Jivari acoustic overtones
 */
function pluckString(stringIdx: number) {
  const ctx = getAudioContext();
  if (!ctx || !isPlaying || !masterGain) return;

  const str = STRINGS[stringIdx % STRINGS.length];
  const now = ctx.currentTime;

  // Each tanpura string generates a fundamental plus rich jawari harmonics (2x, 3x, 4x, 5x, 6x)
  const harmonics = [
    { mult: 1, amp: 1.0, type: 'sawtooth' as OscillatorType },
    { mult: 2, amp: 0.6, type: 'sine' as OscillatorType },
    { mult: 3, amp: 0.35, type: 'sine' as OscillatorType },
    { mult: 4, amp: 0.18, type: 'triangle' as OscillatorType },
  ];

  // String envelope gain
  const stringGain = ctx.createGain();
  stringGain.gain.setValueAtTime(0.0001, now);
  // Gentle pluck attack (80ms)
  stringGain.gain.linearRampToValueAtTime(str.gain, now + 0.08);
  // Natural resonant acoustic decay
  stringGain.gain.exponentialRampToValueAtTime(0.0001, now + str.duration);

  // Warm acoustic wood body filter (Tumba gourd resonance)
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(950, now);
  filter.Q.setValueAtTime(2.0, now);

  harmonics.forEach(({ mult, amp, type }) => {
    const osc = ctx.createOscillator();
    const hGain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(str.freq * mult, now);
    osc.detune.setValueAtTime(str.detune, now);

    hGain.gain.setValueAtTime(amp, now);

    osc.connect(hGain);
    hGain.connect(filter);

    osc.start(now);
    osc.stop(now + str.duration);
  });

  filter.connect(stringGain);
  stringGain.connect(masterGain);
}

export function isTanpuraPlaying(): boolean {
  return isPlaying;
}

export function getTanpuraEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setTanpuraEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, String(enabled));
  } catch {}
}

export function startTanpura(): void {
  if (isPlaying) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    // Smooth fade in over 1.2s to 1.0 (individual string gains control relative loudness)
    masterGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + 1.2);
    masterGain.connect(ctx.destination);

    isPlaying = true;
    currentStep = 0;

    // Pluck first string immediately
    pluckString(0);
    currentStep = 1;

    // Pluck subsequent strings in sequence every 1.8 seconds (Pa -> Sa -> Sa -> Low Sa)
    sequenceTimer = setInterval(() => {
      pluckString(currentStep);
      currentStep = (currentStep + 1) % STRINGS.length;
    }, 1800);

    notifyListeners();
  } catch (err) {
    console.error('Failed to start tanpura drone:', err);
    isPlaying = false;
  }
}

export function stopTanpura(): void {
  if (!isPlaying) return;

  if (sequenceTimer) {
    clearInterval(sequenceTimer);
    sequenceTimer = null;
  }

  if (masterGain && audioCtx) {
    try {
      const now = audioCtx.currentTime;
      masterGain.gain.cancelScheduledValues(now);
      // Smooth fade-out over 0.8s
      masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.8);
      const targetGain = masterGain;
      setTimeout(() => {
        try {
          targetGain.disconnect();
        } catch {}
      }, 900);
    } catch {}
    masterGain = null;
  }

  isPlaying = false;
  notifyListeners();
}

export function toggleTanpura(): boolean {
  if (isPlaying) {
    stopTanpura();
    setTanpuraEnabled(false);
    return false;
  } else {
    startTanpura();
    setTanpuraEnabled(true);
    return true;
  }
}

export function subscribeTanpura(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
