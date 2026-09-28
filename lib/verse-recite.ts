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
    const cleaned = cleanSanskritForSpeech(verse.sanskrit);
    if (cleaned) {
      // Measured, serene cadence for Sanskrit recitation (0.86 rate)
      queue.push({ text: cleaned, lang: DEVANAGARI_LANG, rate: 0.86 });
    }
  }
  if (verse.hindi?.trim()) {
    const cleaned = cleanMeaningForSpeech(verse.hindi);
    if (cleaned) {
      queue.push({ text: cleaned, lang: DEVANAGARI_LANG, rate: 0.95 });
    }
  } else if (verse.translation?.trim()) {
    const cleaned = cleanMeaningForSpeech(verse.translation);
    if (cleaned) {
      queue.push({ text: cleaned, lang: ENGLISH_LANG, rate: 0.95 });
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

/**
 * Recite a verse: Sanskrit first, then its meaning — using Indian voices
 * where the browser has them. `onFinish` fires exactly once — on natural
 * completion, manual stop, or error.
 */
export function reciteVerse(verse: RecitableVerse, onFinish: () => void) {
  if (!speechSupported()) {
    onFinish();
    return;
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  const queue = utterancesFor(verse);
  if (queue.length === 0) {
    onFinish();
    return;
  }
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    onFinish();
  };

  loadVoices().then((voices) => {
    if (finished) return;
    const next = (i: number) => {
      if (finished) return;
      if (i >= queue.length) {
        finish();
        return;
      }
      const u = new SpeechSynthesisUtterance(queue[i].text);
      u.lang = queue[i].lang;
      u.rate = queue[i].rate;
      const voice = pickIndianVoice(voices, queue[i].lang);
      if (voice) u.voice = voice;
      u.onend = () => next(i + 1);
      u.onerror = finish;
      synth.speak(u);
    };
    next(0);
  });
}

export function stopRecitation() {
  if (speechSupported()) window.speechSynthesis.cancel();
}
