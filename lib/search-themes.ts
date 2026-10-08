/**
 * Themes for search ("verses about anger", "fear", "भय"), derived from the
 * Wisdom for Life topics. Their verse citations are checked against the
 * library by scripts/check-wisdom.ts, so a theme never points at a verse that
 * is not there. Nothing here is maintained by hand apart from EXTRA_SYNONYMS.
 */
import { wisdomTopics, type WisdomTopic } from '@/data/wisdom-for-life';
import { libraryLocation } from '@/lib/wisdom-links';
import { normalizeDevanagari, normalizeForSearch } from '@/lib/normalize-search';
import { STOP_WORDS, stem } from '@/lib/search-verse-index';

export interface SearchTheme {
  slug: string;
  name: string;
  nameHi: string;
  /** Latin keywords as [processed form, readable form, plain normalised form], matched as whole words. */
  latin: Array<[string, string, string]>;
  devanagari: string[];
  /** [scriptureId, chapter, verse] in the library's numbering. */
  verses: Array<[string, number, string]>;
  href: string;
  topic: WisdomTopic;
}

/** Well-known phrases people search for that name a theme without being one of its keywords. */
const EXTRA_SYNONYMS: Record<string, string[]> = {
  'self-knowledge': ['tat tvam asi', 'tattvamasi', 'that thou art', 'aham brahmasmi', 'तत्त्वमसि', 'अहं ब्रह्मास्मि'],
  'grief-and-loss': ['immortality', 'soul', 'rebirth', 'nachiketa', 'आत्मा', 'अमरता'],
  'stress-and-worry': ['mind', 'restless mind', 'equanimity', 'समत्व'],
  'duty-and-decision-making': ['failure', 'failing', 'setback', 'disappointment', 'success', 'work', 'action', 'work', 'karma', 'detachment', 'nishkama karma', 'results', 'कर्म', 'निष्काम'],
  'concentration': ['mind control', 'yoga', 'stillness'],
};

const isDev = (s: string) => /[ऀ-ॿ]/.test(s);

/** A keyword in the same form as a processed query: no stop words, stemmed. */
const core = (s: string) =>
  normalizeForSearch(s)
    .split(' ')
    .filter((t) => t && !STOP_WORDS.has(t))
    .map(stem)
    .join(' ');

let cached: SearchTheme[] | null = null;

export function getSearchThemes(): SearchTheme[] {
  if (cached) return cached;
  cached = wisdomTopics.map((topic) => {
    const words = [...topic.searchKeywords, ...(EXTRA_SYNONYMS[topic.slug] ?? []), topic.titleEn, topic.titleHi];
    return {
      slug: topic.slug,
      name: topic.titleEn,
      nameHi: topic.titleHi,
      latin: words.filter((w) => !isDev(w)).map((w): [string, string, string] => [core(w), w, normalizeForSearch(w)]),
      devanagari: words.filter(isDev).map((w) => normalizeDevanagari(w)).filter(Boolean),
      verses: topic.verses.map((v): [string, number, string] => {
        const loc = libraryLocation(v);
        return [v.scriptureId, loc.chapter, loc.verse];
      }),
      href: `/wisdom-for-life/${topic.slug}`,
      topic,
    };
  });
  return cached;
}

const phraseIn = (needle: string, hay: string) => needle !== '' && ` ${hay} `.includes(` ${needle} `);

export interface ThemeMatch {
  theme: SearchTheme;
  /** The keyword the query hit, for the "match reason". */
  keyword: string;
}

/** Themes a query asks about: the query contains a keyword as whole words, or is one of a keyword's words. */
export function matchThemes(coreQuery: string, normQuery: string, devQuery: string): ThemeMatch[] {
  const out: ThemeMatch[] = [];
  for (const theme of getSearchThemes()) {
    const latin = theme.latin.find(
      ([stemmed, , plain]) =>
        (coreQuery !== '' && stemmed !== '' && (phraseIn(stemmed, coreQuery) || (coreQuery.length >= 3 && phraseIn(coreQuery, stemmed)))) ||
        // Phrases made of filler words ("who am i") still match as written.
        (normQuery !== '' && plain !== '' && (plain === normQuery || (plain.includes(' ') && phraseIn(plain, normQuery)))),
    );
    const dev = devQuery ? theme.devanagari.find((k) => phraseIn(k, devQuery) || phraseIn(devQuery, k)) : undefined;
    const keyword = latin ? latin[1] : dev;
    if (keyword) out.push({ theme, keyword });
  }
  return out;
}
