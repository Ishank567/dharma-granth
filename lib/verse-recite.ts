import { triggerTactileFeedback } from '@/lib/haptics';

export interface RecitableVerse {
  sanskrit?: string;
  hindi?: string;
  translation?: string;
}

// Devanagari (Sanskrit/Hindi) reads best through a Hindi-India voice; English
// meanings should use an Indian-English voice so the accent and Sanskrit
// loanwords sound right.
const DEVANAGARI_LANG = 'hi-IN';
const ENGLISH_LANG = 'en-IN';

interface Utterance {
  text: string;
  lang: string;
  rate: number;
  lineIndex: number | 'meaning';
}

export interface RecitationMetadata {
  verseTitle?: string;
  scriptureTitle?: string;
  chapterTitle?: string;
  verseLabel?: string;
  scriptureId?: string;
  chapterId?: number | string;
  verseNumber?: number | string;
  sanskrit?: string;
  hindi?: string;
  translation?: string;
}

export interface ReciteOptions {
  speed?: number;
  loop?: boolean;
  loopTarget?: number;
  onlySanskrit?: boolean;
  metadata?: RecitationMetadata;
}

export interface RecitationState {
  activeKey: string | null;
  lineIndex: number | 'meaning' | null;
  isSpeaking: boolean;
  isPaused?: boolean;
  speed?: number;
  loop?: boolean;
  loopTarget?: number;
  iteration?: number;
  onlySanskrit?: boolean;
  totalLines?: number;
  metadata?: RecitationMetadata | null;
  currentLineText?: string;
}

/**
 * Split a verse into its pādas for line-by-line setting and recitation.
 */
export function splitVerseLines(sanskrit: string): string[] {
  const cleaned = sanskrit.replace(/[\s|।॥0-9०-९.]+$/, '').trim();
  const byNewline = cleaned.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  if (byNewline.length > 1) return byNewline;

  // Normalize consecutive dandas (॥, ||) to a single delimiter
  const normalized = cleaned.replace(/॥+|\|\|+/g, '।');
  const lines: string[] = [];
  let current = '';
  for (const ch of normalized) {
    current += ch;
    if (ch === '|' || ch === '।') {
      const line = current.trim();
      if (line && !/^[\s|।॥0-9०-९.]+$/.test(line)) {
        lines.push(line);
      }
      current = '';
    }
  }
  const rem = current.trim();
  if (rem && !/^[\s|।॥0-9०-९.]+$/.test(rem)) {
    lines.push(rem);
  }
  return lines.length ? lines : [cleaned];
}

/**
 * Clean Sanskrit text for natural speech synthesis:
 * - Strips shloka numbers e.g. ॥ १ ॥, || 15 ||, ॥१-१॥
 * - Converts dandas into natural breathing pauses (, or .)
 * - Normalizes whitespace and removes trailing verse numbers
 */
function cleanSanskritForSpeech(sanskrit: string): string {
  return sanskrit
    .replace(/[॥।]\s*[\d०-९\-\:\.]+\s*[॥।]/g, '।')
    .replace(/\|\s*[\d\-\:\.]+\s*\|/g, ',')
    .replace(/[\d०-९]+$/gm, '')
    .replace(/॥+/g, '। ')
    .replace(/।+/g, ', ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Clean meaning text for speech:
 * - Strips footnotes, citations, and brackets like [1], (1)
 * - Normalizes quotes and spacing
 */
function cleanMeaningForSpeech(text: string): string {
  return text
    .replace(/\[\d+\]|\(\d+\)/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function utterancesFor(
  verse: RecitableVerse,
  speedMultiplier = 1.0,
  onlySanskrit = false,
): Utterance[] {
  const queue: Utterance[] = [];
  if (verse.sanskrit?.trim()) {
    const lines = splitVerseLines(verse.sanskrit);
    lines.forEach((line, index) => {
      const cleaned = cleanSanskritForSpeech(line);
      // Ensure the line contains actual letters (not just bare punctuation)
      if (cleaned && /[a-zA-Z\u0900-\u097F]/.test(cleaned)) {
        // Measured, serene cadence for Sanskrit recitation (0.86 base rate)
        queue.push({
          text: cleaned,
          lang: DEVANAGARI_LANG,
          rate: Math.min(2.0, Math.max(0.35, 0.86 * speedMultiplier)),
          lineIndex: index,
        });
      }
    });
  }
  if (!onlySanskrit) {
    if (verse.hindi?.trim()) {
      const cleaned = cleanMeaningForSpeech(verse.hindi);
      if (cleaned) {
        queue.push({
          text: cleaned,
          lang: DEVANAGARI_LANG,
          rate: Math.min(2.0, Math.max(0.35, 0.95 * speedMultiplier)),
          lineIndex: 'meaning',
        });
      }
    } else if (verse.translation?.trim()) {
      const cleaned = cleanMeaningForSpeech(verse.translation);
      if (cleaned) {
        queue.push({
          text: cleaned,
          lang: ENGLISH_LANG,
          rate: Math.min(2.0, Math.max(0.35, 0.95 * speedMultiplier)),
          lineIndex: 'meaning',
        });
      }
    }
  }
  return queue;
}

export function speechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export function canRecite(verse: RecitableVerse): boolean {
  return utterancesFor(verse).length > 0;
}

/**
 * Chrome populates the voice list asynchronously; wait for it (briefly) so the
 * first recitation doesn't fall back to the default US voice.
 */
function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  const synth = window.speechSynthesis;
  const now = synth.getVoices();
  if (now.length > 0) return Promise.resolve(now);
  return new Promise((resolve) => {
    const done = () => {
      synth.removeEventListener('voiceschanged', done);
      resolve(synth.getVoices());
    };
    synth.addEventListener('voiceschanged', done);
    setTimeout(done, 1000);
  });
}

/**
 * Pick the most Indian-sounding voice for a language. Preference order:
 * exact regional match (hi-IN / en-IN), any voice of the base language,
 * then any voice labelled as Indian.
 */
function pickIndianVoice(
  voices: SpeechSynthesisVoice[],
  lang: string,
): SpeechSynthesisVoice | undefined {
  const base = lang.split('-')[0].toLowerCase();
  const normalized = (v: SpeechSynthesisVoice) => v.lang.replace('_', '-').toLowerCase();
  return (
    voices.find((v) => normalized(v) === lang.toLowerCase()) ??
    voices.find((v) => normalized(v).startsWith(`${base}-`) || normalized(v) === base) ??
    voices.find((v) => /india|hindi|हिन्दी/i.test(v.name))
  );
}

type RecitationListener = (state: RecitationState) => void;
const listeners = new Set<RecitationListener>();

const configListeners = new Set<() => void>();

let configuredSpeed = 1.0;
let configuredLoop = false;
let configuredLoopTarget = 0; // 0 = infinite (unlimited)
let configuredOnlySanskrit = false;

export const MALA_LOOP_TARGETS = [0, 11, 21, 108] as const;

export function getRecitationSpeed(): number {
  if (typeof window !== 'undefined') {
    try {
      const val = parseFloat(localStorage.getItem('dharma_recite_speed') || '');
      if (!Number.isNaN(val) && val >= 0.5 && val <= 2.0) return val;
    } catch {}
  }
  return configuredSpeed;
}

export function setRecitationSpeed(speed: number) {
  configuredSpeed = speed;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('dharma_recite_speed', String(speed));
    } catch {}
  }
  configListeners.forEach((fn) => {
    try {
      fn();
    } catch {}
  });
}

export function getRecitationLoop(): boolean {
  if (typeof window !== 'undefined') {
    try {
      const val = localStorage.getItem('dharma_recite_loop');
      if (val !== null) return val === 'true';
    } catch {}
  }
  return configuredLoop;
}

export function setRecitationLoop(loop: boolean) {
  configuredLoop = loop;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('dharma_recite_loop', String(loop));
    } catch {}
  }
  configListeners.forEach((fn) => {
    try {
      fn();
    } catch {}
  });
}

export function getRecitationLoopTarget(): number {
  if (typeof window !== 'undefined') {
    try {
      const val = parseInt(localStorage.getItem('dharma_recite_loop_target') || '0', 10);
      if (!Number.isNaN(val) && (MALA_LOOP_TARGETS as readonly number[]).includes(val)) {
        return val;
      }
    } catch {}
  }
  return configuredLoopTarget;
}

export function setRecitationLoopTarget(target: number) {
  configuredLoopTarget = target;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('dharma_recite_loop_target', String(target));
    } catch {}
  }
  configListeners.forEach((fn) => {
    try {
      fn();
    } catch {}
  });
}

export function cycleRecitationLoopTarget(): number {
  const current = getRecitationLoopTarget();
  const idx = MALA_LOOP_TARGETS.indexOf(current as 0 | 11 | 21 | 108);
  const nextTarget = MALA_LOOP_TARGETS[(idx + 1) % MALA_LOOP_TARGETS.length] ?? 0;
  setRecitationLoopTarget(nextTarget);
  if (!getRecitationLoop()) {
    setRecitationLoop(true);
  }
  return nextTarget;
}

export function getRecitationOnlySanskrit(): boolean {
  if (typeof window !== 'undefined') {
    try {
      const val = localStorage.getItem('dharma_recite_only_sanskrit');
      if (val !== null) return val === 'true';
    } catch {}
  }
  return configuredOnlySanskrit;
}

export function setRecitationOnlySanskrit(only: boolean) {
  configuredOnlySanskrit = only;
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('dharma_recite_only_sanskrit', String(only));
    } catch {}
  }
  configListeners.forEach((fn) => {
    try {
      fn();
    } catch {}
  });
}

export function toggleRecitationOnlySanskrit(): boolean {
  const next = !getRecitationOnlySanskrit();
  setRecitationOnlySanskrit(next);
  if ((currentState.isSpeaking || currentState.isPaused) && currentVerse) {
    reciteVerse(currentVerse, currentOnFinish, {
      ...currentOptions,
      onlySanskrit: next,
    });
  }
  return next;
}

// ── Skip Handlers (Next / Previous verse across chapter) ────────────────
export type SkipDirection = 'next' | 'prev';
type SkipHandler = (direction: SkipDirection) => boolean | void;
const skipHandlers = new Set<SkipHandler>();

export function registerRecitationSkipHandler(handler: SkipHandler): () => void {
  skipHandlers.add(handler);
  return () => {
    skipHandlers.delete(handler);
  };
}

export function skipRecitation(direction: SkipDirection): boolean {
  let handled = false;
  skipHandlers.forEach((fn) => {
    try {
      if (!handled && fn(direction)) {
        handled = true;
      }
    } catch {}
  });
  return handled;
}

export function hasRecitationSkipHandler(): boolean {
  return skipHandlers.size > 0;
}

export function subscribeRecitationConfig(listener: () => void): () => void {
  configListeners.add(listener);
  return () => {
    configListeners.delete(listener);
  };
}

let activeMetadata: RecitationMetadata | null = null;
let currentLineText = '';
let currentVerse: RecitableVerse | null = null;
let currentOptions: ReciteOptions | undefined = undefined;
let currentOnFinish: ((naturalEnd: boolean) => void) | undefined = undefined;

let currentState: RecitationState = {
  activeKey: null,
  lineIndex: null,
  isSpeaking: false,
  isPaused: false,
};

export function getRecitationState(): RecitationState {
  return currentState;
}

export function subscribeRecitation(listener: RecitationListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyRecitation(
  activeKey: string | null,
  lineIndex: number | 'meaning' | null = null,
  isSpeaking = false,
  speed?: number,
  loop?: boolean,
  iteration?: number,
  isPaused = false,
  lineText?: string,
  loopTarget?: number,
  onlySanskrit?: boolean,
  totalLines?: number,
) {
  if (lineText !== undefined) currentLineText = lineText;
  currentState = {
    activeKey,
    lineIndex,
    isSpeaking,
    isPaused,
    speed: speed ?? getRecitationSpeed(),
    loop: loop ?? getRecitationLoop(),
    loopTarget: loopTarget ?? getRecitationLoopTarget(),
    iteration,
    onlySanskrit: onlySanskrit ?? getRecitationOnlySanskrit(),
    totalLines: totalLines ?? currentState.totalLines,
    metadata: activeKey ? activeMetadata : null,
    currentLineText: activeKey ? currentLineText : '',
  };
  listeners.forEach((fn) => {
    try {
      fn(currentState);
    } catch {}
  });
}

let userStoppedManually = false;
let loopTimeoutId: ReturnType<typeof setTimeout> | null = null;

export function toggleRecitationLoop(): boolean {
  const nextLoop = !getRecitationLoop();
  setRecitationLoop(nextLoop);
  if (currentState.isSpeaking || currentState.isPaused) {
    notifyRecitation(
      currentState.activeKey,
      currentState.lineIndex,
      currentState.isSpeaking,
      currentState.speed,
      nextLoop,
      currentState.iteration,
      currentState.isPaused,
    );
  }
  return nextLoop;
}

export function pauseRecitation() {
  if (!speechSupported()) return;
  const synth = window.speechSynthesis;
  if (synth.speaking && !synth.paused) {
    synth.pause();
    notifyRecitation(
      currentState.activeKey,
      currentState.lineIndex,
      false,
      currentState.speed,
      currentState.loop,
      currentState.iteration,
      true, // isPaused
    );
  }
}

export function resumeRecitation() {
  if (!speechSupported()) return;
  const synth = window.speechSynthesis;
  if (synth.paused) {
    synth.resume();
    notifyRecitation(
      currentState.activeKey,
      currentState.lineIndex,
      true,
      currentState.speed,
      currentState.loop,
      currentState.iteration,
      false, // isPaused
    );
  } else if (currentVerse && currentState.activeKey) {
    // If not paused in synth (e.g. timeout on Chrome), re-recite
    reciteVerse(currentVerse, currentOnFinish, currentOptions);
  }
}

/**
 * Recite a verse: Sanskrit lines sequentially, then its meaning — using Indian voices
 * where the browser has them. Supports speed multiplier, loop (*आवृति*) repetitions,
 * and Sanskrit-only options.
 *
 * `onFinish(naturalEnd)` fires when recitation ends
 * (true if completed full verse, false if stopped manually or failed).
 */
export function reciteVerse(
  verse: RecitableVerse,
  onFinish?: (naturalEnd: boolean) => void,
  options?: ReciteOptions,
) {
  if (!speechSupported()) {
    onFinish?.(false);
    return;
  }
  if (loopTimeoutId) {
    clearTimeout(loopTimeoutId);
    loopTimeoutId = null;
  }
  const verseKey = verse.sanskrit || verse.hindi || verse.translation || '';
  userStoppedManually = false;

  currentVerse = verse;
  currentOptions = options;
  currentOnFinish = onFinish;

  if (options?.metadata) {
    activeMetadata = options.metadata;
  } else {
    activeMetadata = {
      sanskrit: verse.sanskrit,
      hindi: verse.hindi,
      translation: verse.translation,
    };
  }

  const synth = window.speechSynthesis;
  synth.cancel();

  const speed = options?.speed ?? getRecitationSpeed();
  const loop = options?.loop ?? getRecitationLoop();
  const loopTarget = options?.loopTarget ?? getRecitationLoopTarget();
  const onlySanskrit = options?.onlySanskrit ?? getRecitationOnlySanskrit();

  const queue = utterancesFor(verse, speed, onlySanskrit);
  const totalLines = queue.length;
  if (queue.length === 0) {
    notifyRecitation(null, null, false, speed, loop, 0, false, '', loopTarget, onlySanskrit, 0);
    onFinish?.(false);
    return;
  }

  let finished = false;
  let iteration = 1;

  const finish = (natural: boolean) => {
    if (finished) return;
    finished = true;
    if (loopTimeoutId) {
      clearTimeout(loopTimeoutId);
      loopTimeoutId = null;
    }
    notifyRecitation(null, null, false, speed, loop, iteration, false, '', loopTarget, onlySanskrit, totalLines);
    onFinish?.(natural);
  };

  loadVoices().then((voices) => {
    if (finished || userStoppedManually) return;
    const next = (i: number) => {
      if (finished || userStoppedManually) return;
      if (i >= queue.length) {
        if (loop && !userStoppedManually) {
          const currentTarget = options?.loopTarget ?? getRecitationLoopTarget();
          if (currentTarget > 0 && iteration >= currentTarget) {
            triggerTactileFeedback('celestial', 'templeChime');
            notifyRecitation(
              verseKey,
              null,
              false,
              speed,
              loop,
              iteration,
              false,
              `॥ ${currentTarget} आवृतियां पूर्ण ॥`,
              currentTarget,
              onlySanskrit,
              totalLines,
            );
            finish(true);
            return;
          }
          iteration++;
          notifyRecitation(
            verseKey,
            null,
            true,
            speed,
            loop,
            iteration,
            false,
            '॥ पुनः पाठ ॥',
            currentTarget,
            onlySanskrit,
            totalLines,
          );
          loopTimeoutId = setTimeout(() => {
            if (!userStoppedManually && !finished) {
              next(0);
            }
          }, 650);
          return;
        }
        finish(true);
        return;
      }
      const item = queue[i];
      const u = new SpeechSynthesisUtterance(item.text);
      u.lang = item.lang;
      u.rate = item.rate;
      const voice = pickIndianVoice(voices, item.lang);
      if (voice) u.voice = voice;
      u.onstart = () => {
        if (!userStoppedManually && !finished) {
          notifyRecitation(
            verseKey,
            item.lineIndex,
            true,
            speed,
            loop,
            iteration,
            false,
            item.text,
            loopTarget,
            onlySanskrit,
            totalLines,
          );
        }
      };
      u.onend = () => next(i + 1);
      u.onerror = () => {
        finish(false);
      };
      synth.speak(u);
    };
    next(0);
  });
}

export function stopRecitation() {
  userStoppedManually = true;
  if (loopTimeoutId) {
    clearTimeout(loopTimeoutId);
    loopTimeoutId = null;
  }
  activeMetadata = null;
  currentLineText = '';
  currentVerse = null;
  currentOptions = undefined;
  currentOnFinish = undefined;
  if (speechSupported()) {
    window.speechSynthesis.cancel();
    notifyRecitation(null, null, false);
  }
}
