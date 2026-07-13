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

function utterancesFor(verse: RecitableVerse): Utterance[] {
  const queue: Utterance[] = [];
  if (verse.sanskrit?.trim()) {
    queue.push({ text: verse.sanskrit.trim(), lang: DEVANAGARI_LANG, rate: 1 });
  }
  const meaning = verse.hindi?.trim()
    ? { text: verse.hindi.trim(), lang: DEVANAGARI_LANG, rate: 1 }
    : verse.translation?.trim()
      ? { text: verse.translation.trim(), lang: ENGLISH_LANG, rate: 1 }
      : null;
  if (meaning) queue.push(meaning);
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
