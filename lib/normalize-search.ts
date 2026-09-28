// Kept separate from lib/search.ts (which bundles the whole search index) so
// light consumers like the chapter verse filter can import it cheaply.

// Built via the constructor because the tsconfig target (ES5) rejects the
// `u` flag in regex literals; every supported browser handles it at runtime.
const NON_WORD = new RegExp('[^\\p{L}\\p{M}\\p{N}]+', 'gu');

/**
 * Normalise text for matching: lowercase, strip Latin diacritics (so "gita"
 * matches IAST "gītā"), turn punctuation into spaces and collapse whitespace.
 * Devanagari matras are outside the stripped range, so Hindi/Sanskrit
 * queries still match exactly.
 */
export function normalizeForSearch(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(NON_WORD, ' ')
    .trim();
}

// Casual romanisations (Harvard-Kyoto-ish, "Krishna", "Gyaan") mapped onto
// the letters IAST reduces to once diacritics are gone. Order matters:
// longer digraphs first.
const PHONETIC_FOLDS: ReadonlyArray<[RegExp, string]> = [
  [/chh/g, 'c'],
  [/ch/g, 'c'],
  [/sh/g, 's'],
  [/ri/g, 'r'],
  [/aa/g, 'a'],
  [/(ee|ii)/g, 'i'],
  [/(oo|uu)/g, 'u'],
  [/w/g, 'v'],
];

/**
 * Looser match key for romanised Sanskrit: normalizeForSearch plus phonetic
 * folding, so "dharmakshetre" and IAST "dharmakṣetre" both become
 * "dharmaksetre", and "krishna" / "kṛṣṇa" both become "krsna". Apply it to
 * both the query and the text being searched.
 */
export function normalizeTransliteration(value: string): string {
  let out = normalizeForSearch(value);
  for (const [pattern, replacement] of PHONETIC_FOLDS) {
    out = out.replace(pattern, replacement);
  }
  return out;
}
