/**
 * Which parts of a result to highlight for a query.
 *
 * Highlighting is done on whole words, never on arbitrary characters. A match
 * inside a Devanagari word would otherwise split a conjunct or detach a vowel
 * sign (क्ष, कर्म, ि), which breaks the shaping of the text it is meant to
 * point at. Matching uses the same folding as search itself, so a query typed
 * as "karmanye vadhikaraste" highlights "karmaṇy-evādhikāras te", and a
 * Devanagari query ignores danda marks and word breaks.
 */
import { compactTransliteration, isDevanagari, normalizeDevanagari } from '@/lib/normalize-search';
import { contentTokens } from '@/lib/search-verse-index';

/** [start, end) character offsets in the text, always on word boundaries. */
export type HighlightSpan = [number, number];

interface Word {
  start: number;
  end: number;
  key: string;
}

// Anything that is not a letter, mark or digit separates words (danda, bars, punctuation, hyphens).
// Built via the constructor because the tsconfig target (ES5) rejects the `u` flag in regex literals.
const WORD_SOURCE = '[\\p{L}\\p{M}\\p{N}]+';

function wordsOf(text: string, keyOf: (w: string) => string): Word[] {
  const out: Word[] = [];
  const re = new RegExp(WORD_SOURCE, 'gu');
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    out.push({ start: m.index, end: m.index + m[0].length, key: keyOf(m[0]) });
  }
  return out;
}

export function findHighlights(text: string, query: string): HighlightSpan[] {
  const q = query.trim();
  if (!text || !q) return [];
  const dev = isDevanagari(q);
  const keyOf = dev ? (w: string) => normalizeDevanagari(w).replace(/ /g, '') : (w: string) => compactTransliteration(w);
  const words = wordsOf(text, keyOf);
  if (words.length === 0) return [];

  const marked = new Set<number>();
  const qKey = keyOf(q);

  // 1. The whole query as one phrase, however the text breaks it into words.
  if (qKey.length >= 4) {
    for (let i = 0; i < words.length; i++) {
      let joined = '';
      for (let j = i; j < words.length && j < i + 12; j++) {
        joined += words[j].key;
        const at = joined.indexOf(qKey);
        // The match must begin inside the first word and end inside the last, or the window is too wide.
        if (at !== -1 && at < words[i].key.length && at + qKey.length > joined.length - words[j].key.length) {
          for (let k = i; k <= j; k++) marked.add(k);
          i = j;
          break;
        }
        if (at !== -1 && at >= words[i].key.length) break;
        if (joined.length > qKey.length * 3) break;
      }
    }
  }

  // 2. Otherwise each content word of the query.
  if (marked.size === 0) {
    const tokens = dev
      ? normalizeDevanagari(q).split(' ').filter((t) => t.length >= 2)
      : contentTokens(q).map(compactTransliteration).filter((t) => t.length >= 3);
    words.forEach((w, i) => {
      if (w.key && tokens.some((t) => w.key.includes(t))) marked.add(i);
    });
  }

  // Merge neighbouring words into one span so a phrase is one continuous highlight.
  const spans: HighlightSpan[] = [];
  Array.from(marked)
    .sort((a, b) => a - b)
    .forEach((i, n, all) => {
      const w = words[i];
      const prev = spans[spans.length - 1];
      if (n > 0 && all[n - 1] === i - 1 && prev) prev[1] = w.end;
      else spans.push([w.start, w.end]);
    });
  return spans;
}
