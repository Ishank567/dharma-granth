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

export interface RecitationState {
  activeKey: string | null;
  lineIndex: number | 'meaning' | null;
  isSpeaking: boolean;
}

/**
 * Split a verse into its pādas for line-by-line setting and recitation.
 */
export function splitVerseLines(sanskrit: string): string[] {
  const cleaned = sanskrit.replace(/[\s|।॥0-9०-९.]+$/, '').trim();
  const byNewline = cleaned.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  if (byNewline.length > 1) return byNewline;

  const lines: string[] = [];
  let current = '';
  for (const ch of cleaned) {
    current += ch;
    if (ch === '|' || ch === '।') {
      lines.push(current.trim());
      current = '';
    }
  }
  if (current.trim()) lines.push(current.trim());
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

function utterancesFor(verse: RecitableVerse): Utterance[] {
  const queue: Utterance[] = [];
  if (verse.sanskrit?.trim()) {
    const lines = splitVerseLines(verse.sanskrit);
    lines.forEach((line, index) => {
      const cleaned = cleanSanskritForSpeech(line);
      if (cleaned) {
        // Measured, serene cadence for Sanskrit recitation (0.86 rate)
        queue.push({
          text: cleaned,
          lang: DEVANAGARI_LANG,
          rate: 0.86,
          lineIndex: index,
        });
      }
    });
  }
  if (verse.hindi?.trim()) {
    const cleaned = cleanMeaningForSpeech(verse.hindi);
    if (cleaned) {
      queue.push({
        text: cleaned,
        lang: DEVANAGARI_LANG,
        rate: 0.95,
        lineIndex: 'meaning',
      });
    }
  } else if (verse.translation?.trim()) {
    const cleaned = cleanMeaningForSpeech(verse.translation);
    if (cleaned) {
      queue.push({
        text: cleaned,
        lang: ENGLISH_LANG,
        rate: 0.95,
        lineIndex: 'meaning',
      });
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

let currentState: RecitationState = {
  activeKey: null,
  lineIndex: null,
  isSpeaking: false,
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
) {
  currentState = { activeKey, lineIndex, isSpeaking };
  listeners.forEach((fn) => {
    try {
      fn(currentState);
    } catch {}
  });
}

let userStoppedManually = false;

/**
 * Recite a verse: Sanskrit lines sequentially, then its meaning — using Indian voices
 * where the browser has them. `onFinish(naturalEnd)` fires when recitation ends
 * (true if completed full verse, false if stopped manually or failed).
 */
export function reciteVerse(
  verse: RecitableVerse,
  onFinish?: (naturalEnd: boolean) => void,
) {
  if (!speechSupported()) {
    onFinish?.(false);
    return;
  }
  const verseKey = verse.sanskrit || verse.hindi || verse.translation || '';
  userStoppedManually = false;

  const synth = window.speechSynthesis;
  synth.cancel();

  const queue = utterancesFor(verse);
  if (queue.length === 0) {
    notifyRecitation(null, null, false);
    onFinish?.(false);
    return;
  }

  let finished = false;
  const finish = (natural: boolean) => {
    if (finished) return;
    finished = true;
    notifyRecitation(null, null, false);
    onFinish?.(natural);
  };

  loadVoices().then((voices) => {
    if (finished || userStoppedManually) return;
    const next = (i: number) => {
      if (finished || userStoppedManually) return;
      if (i >= queue.length) {
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
          notifyRecitation(verseKey, item.lineIndex, true);
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
  if (speechSupported()) {
    window.speechSynthesis.cancel();
    notifyRecitation(null, null, false);
  }
}
