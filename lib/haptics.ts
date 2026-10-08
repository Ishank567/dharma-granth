'use client';

/**
 * Universal Haptics & Acoustic Tactile Engine
 *
 * Provides realistic physical feedback across all devices:
 * - Mobile / Touch: High-precision vibration patterns via navigator.vibrate
 * - Desktop / All: Zero-latency procedural Web Audio sound synthesis (no external audio files!)
 *   simulating tactile bead clicks, soft switches, sacred singing bowl resonance, and temple chimes.
 */

export type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'malaBead' | 'celestial' | 'selection';
export type SoundEffect = 'click' | 'softTap' | 'success' | 'malaBead' | 'templeChime' | 'omBowl';

const HAPTIC_PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 8,
  selection: 6,
  medium: 16,
  heavy: 28,
  success: [10, 35, 18],
  malaBead: [12, 25, 12],
  celestial: [15, 45, 25, 45, 35],
};

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  try {
    if (!audioCtx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtx = new AudioCtx();
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

// Preference getters/setters with localStorage persistence
const HAPTICS_KEY = 'dharma.haptics.enabled';
const SOUND_KEY = 'dharma.sound.enabled';

/**
 * iOS Safari has no Vibration API. Since Safari 17.4/18, toggling a native
 * `<input type="checkbox" switch>` plays the system haptic, so iPhones get a
 * real tap by clicking a hidden one (only works inside a user gesture).
 */
function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (
    /iP(hone|ad|od)/.test(navigator.userAgent) ||
    // iPadOS reports itself as a Mac with touch.
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

let iosSwitchLabel: HTMLLabelElement | null = null;

function iosHapticTick(): void {
  try {
    if (!iosSwitchLabel || !iosSwitchLabel.isConnected) {
      const label = document.createElement('label');
      label.setAttribute('aria-hidden', 'true');
      label.dataset.hapticSwitch = '';
      label.style.cssText =
        'position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;pointer-events:none;overflow:hidden;';
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.setAttribute('switch', '');
      input.tabIndex = -1;
      label.appendChild(input);
      document.body.appendChild(label);
      iosSwitchLabel = label;
    }
    iosSwitchLabel.click();
  } catch {
    // Older Safari: silently no haptic.
  }
}

export function isHapticsSupported(): boolean {
  return typeof window !== 'undefined' && ('vibrate' in navigator || isIOS());
}

/** True for clicks synthesised on the hidden iOS haptic switch (ignore them). */
export function isHapticSwitchEvent(e: Event): boolean {
  return e.target instanceof Element && e.target.closest('[data-haptic-switch]') !== null;
}

// Several handlers often react to one tap (a card, the button inside it, the
// global tactile layer); only the first within this window vibrates.
const HAPTIC_DEDUPE_MS = 45;
let lastHapticAt = 0;

// Storage can throw (blocked cookies, some private modes); these are called
// from tap handlers, so they must never throw.
function readPref(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function writePref(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // preference just won't persist
  }
}

export function getHapticsEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const val = readPref(HAPTICS_KEY);
  return val === null ? true : val === 'true';
}

export function setHapticsEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  writePref(HAPTICS_KEY, String(enabled));
  window.dispatchEvent(new CustomEvent('dharma-haptics-change', { detail: { enabled } }));
}

export function getSoundEnabled(): boolean {
  if (typeof window === 'undefined') return false; // Default subtle sound disabled until user explicitly opts in or toggles
  return readPref(SOUND_KEY) === 'true';
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  writePref(SOUND_KEY, String(enabled));
  window.dispatchEvent(new CustomEvent('dharma-sound-change', { detail: { enabled } }));
}

/**
 * Trigger physical haptic vibration on mobile devices
 */
export function triggerHaptic(pattern: HapticPattern = 'light'): void {
  if (typeof window === 'undefined' || !getHapticsEnabled()) return;

  const now = performance.now();
  if (now - lastHapticAt < HAPTIC_DEDUPE_MS) return;
  lastHapticAt = now;

  if ('vibrate' in navigator) {
    try {
      navigator.vibrate(HAPTIC_PATTERNS[pattern]);
    } catch {
      // Graceful fallback if vibration permission blocked
    }
    return;
  }

  if (isIOS()) {
    // iOS gives one fixed tick per toggle; approximate multi-pulse patterns
    // with a few ticks at the pattern's own spacing.
    const spec = HAPTIC_PATTERNS[pattern];
    const pulses = Array.isArray(spec) ? spec : [spec];
    let delay = 0;
    pulses.forEach((ms, i) => {
      if (i % 2 === 1) {
        delay += ms; // odd entries are pauses
        return;
      }
      if (delay === 0) iosHapticTick();
      else window.setTimeout(iosHapticTick, delay);
      delay += ms;
    });
  }
}

/**
 * Procedural Audio Synthesizer for tactile feedback
 */
export function playSoundEffect(effect: SoundEffect): void {
  if (typeof window === 'undefined' || !getSoundEnabled()) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;

  try {
    switch (effect) {
      case 'click': {
        // High-precision wooden/tactile click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.025);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.026);
        break;
      }

      case 'softTap': {
        // Muffled gentle tactile tap
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.036);
        break;
      }

      case 'malaBead': {
        // Authentic Rudraksha / wooden bead roll sound
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(780, now);
        osc1.frequency.exponentialRampToValueAtTime(240, now + 0.04);

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(1440, now);
        osc2.frequency.exponentialRampToValueAtTime(480, now + 0.03);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.045);
        osc2.stop(now + 0.045);
        break;
      }

      case 'success': {
        // Harmonious chord (major third)
        [528, 660].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.06);

          gain.gain.setValueAtTime(0.07, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.35);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.36);
        });
        break;
      }

      case 'templeChime': {
        // Ethereal Tibetan bell / Temple Ghanta harmonic chime (432Hz fundamental)
        const fundamental = 432;
        const harmonics = [1, 2.76, 5.4, 8.9];
        const weights = [0.15, 0.08, 0.04, 0.02];

        harmonics.forEach((multiple, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(fundamental * multiple, now);

          const decay = 1.4 / (idx + 1);
          gain.gain.setValueAtTime(weights[idx], now);
          gain.gain.exponentialRampToValueAtTime(0.0005, now + decay);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + decay);
        });
        break;
      }

      case 'omBowl': {
        // Cosmic Om singing bowl resonance (136.1 Hz + slow harmonic beat)
        const baseFreq = 136.1;
        const freqs = [baseFreq, baseFreq * 2.01, baseFreq * 3.02];
        const gains = [0.14, 0.07, 0.03];

        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);

          const duration = 2.4;
          gain.gain.setValueAtTime(0.001, now);
          gain.gain.linearRampToValueAtTime(gains[idx], now + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.0005, now + duration);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(now);
          osc.stop(now + duration);
        });
        break;
      }
    }
  } catch {
    // Audio synthesis failure safe catch
  }
}

/**
 * Combined tactile interaction: triggers both physical haptic and audio feedback
 */
export function triggerTactileFeedback(
  haptic: HapticPattern = 'light',
  sound: SoundEffect = 'click'
): void {
  triggerHaptic(haptic);
  playSoundEffect(sound);
}
