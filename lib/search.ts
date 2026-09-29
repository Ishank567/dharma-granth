import { scriptureCatalog } from '@/data/scripture-meta';
import { concepts } from '@/data/concepts';
import { topics } from '@/data/topics';
import { characters } from '@/data/characters';
import { sacredLocations } from '@/data/locations';
import { dictionary } from '@/data/dictionary';
import { festivals } from '@/data/festivals';
import { rituals } from '@/data/rituals';
import { pathways } from '@/data/pathways';
import { normalizeForSearch } from '@/lib/normalize-search';
import { versePageHref } from '@/lib/verse-paths';

export type SearchCategory =
  | 'scripture'
  | 'concept'
  | 'topic'
  | 'character'
  | 'location'
  | 'dictionary'
  | 'festival'
  | 'ritual'
  | 'pathway'
  | 'chapter';

/** [scriptureId, chapterNumber, title, titleSanskrit?] — kept as tuples to stay small. */
export type ChapterIndexEntry = [string, number, string] | [string, number, string, string];

/** Shape of the build-time `/chapter-index.json` (see lib/chapter-index.ts). */
export interface ChapterIndex {
  v: 1;
  /** Navigable chapter count per scripture id. */
  counts: Record<string, number>;
  /** Only chapters whose title says more than "Chapter N". */
  chapters: ChapterIndexEntry[];
}

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle?: string;
  category: SearchCategory;
  categoryLabel: string;
  href: string;
  description?: string;
  extra?: string;
}

export const SEARCH_CATEGORIES: ReadonlyArray<{ id: SearchCategory; label: string }> = [
  { id: 'scripture', label: 'ग्रंथ' },
  { id: 'chapter', label: 'अध्याय' },
  { id: 'concept', label: 'अवधारणा' },
  { id: 'topic', label: 'विषय' },
  { id: 'character', label: 'पात्र' },
  { id: 'dictionary', label: 'शब्दकोश' },
  { id: 'location', label: 'स्थान' },
  { id: 'festival', label: 'उत्सव' },
  { id: 'ritual', label: 'अनुष्ठान' },
  { id: 'pathway', label: 'अध्ययन पथ' },
];

export function isSearchCategory(value: string): value is SearchCategory {
  return SEARCH_CATEGORIES.some((c) => c.id === value);
}

export { normalizeForSearch };

export function buildSearchIndex(): SearchResultItem[] {
  const items: SearchResultItem[] = [];

  for (const s of scriptureCatalog) {
    items.push({
      id: `scripture-${s.id}`,
      title: s.title,
      subtitle: s.titleSanskrit,
      category: 'scripture',
      categoryLabel: 'ग्रंथ · Scripture',
      href: `/scripture/${s.id}`,
      description: s.description,
      extra: `${s.totalChapters} ch · ${s.totalVerses} verses`,
    });
  }

  for (const c of concepts) {
    items.push({
      id: `concept-${c.id}`,
      title: c.label,
      subtitle: `${c.sanskrit} (${c.transliteration})`,
      category: 'concept',
      categoryLabel: 'अवधारणा · Concept',
      href: `/concepts`,
      description: c.shortDesc,
    });
  }

  for (const t of topics) {
    items.push({
      id: `topic-${t.id}`,
      title: t.title,
      subtitle: t.sanskrit,
      category: 'topic',
      categoryLabel: 'विषय · Topic',
      href: `/topics/${t.id}`,
      description: t.shortDesc,
    });
  }

  for (const ch of characters) {
    items.push({
      id: `character-${ch.id}`,
      title: ch.name,
      subtitle: ch.sanskrit,
      category: 'character',
      categoryLabel: 'पात्र · Character',
      href: `/characters/${ch.id}`,
      description: ch.shortDesc,
    });
  }

  for (const loc of sacredLocations) {
    items.push({
      id: `location-${loc.id}`,
      title: loc.name,
      subtitle: loc.sanskrit,
      category: 'location',
      categoryLabel: 'स्थान · Location',
      href: `/locations`,
      description: loc.shortDesc,
    });
  }

  for (const d of dictionary) {
    items.push({
      id: `dict-${d.id}`,
      title: d.term,
      subtitle: `${d.sanskrit} (${d.transliteration})`,
      category: 'dictionary',
      categoryLabel: 'शब्दकोश · Dictionary',
      href: `/dictionary/${d.id}`,
      description: d.shortDef,
      extra: `${d.crossTradition?.length ?? 0} traditions`,
    });
  }

  for (const f of festivals) {
    items.push({
      id: `fest-${f.id}`,
      title: f.name,
      subtitle: f.sanskrit,
      category: 'festival',
      categoryLabel: 'उत्सव · Festival',
      href: `/festivals`,
      description: f.shortDesc,
      extra: f.timing,
    });
  }

  for (const r of rituals) {
    items.push({
      id: `ritual-${r.id}`,
      title: r.name,
      subtitle: r.sanskrit,
      category: 'ritual',
      categoryLabel: 'अनुष्ठान · Ritual',
      href: `/rituals`,
      description: r.shortDesc,
      extra: r.symbolism?.slice(0, 60),
    });
  }

  for (const p of pathways) {
    items.push({
      id: `pathway-${p.id}`,
      title: p.title,
      subtitle: p.titleSanskrit,
      category: 'pathway',
      categoryLabel: 'अध्ययन पथ · Pathway',
      href: `/learn/pathways`,
      description: p.description,
      extra: `${p.steps?.length ?? 0} steps`,
    });
  }

  return items;
}

interface IndexedItem {
  item: SearchResultItem;
  title: string;
  subtitle: string;
  extra: string;
  description: string;
}

let cachedIndex: IndexedItem[] | null = null;

function getIndexed(): IndexedItem[] {
  if (!cachedIndex) {
    cachedIndex = buildSearchIndex().map((item) => ({
      item,
      title: normalizeForSearch(item.title),
      subtitle: normalizeForSearch(item.subtitle ?? ''),
      extra: normalizeForSearch(item.extra ?? ''),
      description: normalizeForSearch(item.description ?? ''),
    }));
  }
  return cachedIndex;
}

export function getSearchIndex(): SearchResultItem[] {
  return getIndexed().map((entry) => entry.item);
}

/* ── Chapters (loaded lazily from /chapter-index.json) ─────────────── */

let chapterEntries: IndexedItem[] = [];
let chapterCounts: Record<string, number> | null = null;
const chapterTitleByHref = new Map<string, string>();

function chapterHref(scriptureId: string, n: number): string {
  return `/scripture/${scriptureId}/chapter/${n}`;
}

/** Register the chapter index so chapter titles become searchable. */
export function loadChapterIndex(data: ChapterIndex): void {
  const scriptures = new Map(scriptureCatalog.map((s) => [s.id, s]));
  chapterCounts = data.counts;
  chapterTitleByHref.clear();
  chapterEntries = [];

  for (const [scriptureId, n, title, titleSanskrit] of data.chapters) {
    const scripture = scriptures.get(scriptureId);
    if (!scripture) continue;
    const href = chapterHref(scriptureId, n);
    const item: SearchResultItem = {
      id: `chapter-${scriptureId}-${n}`,
      title: title || titleSanskrit || `अध्याय ${n}`,
      subtitle: title ? titleSanskrit : undefined,
      category: 'chapter',
      categoryLabel: 'अध्याय · Chapter',
      href,
      description: `${scripture.title} · अध्याय ${n}`,
      extra: `${scripture.title} ${scripture.titleSanskrit}`,
    };
    chapterTitleByHref.set(href, item.title);
    chapterEntries.push({
      item,
      title: normalizeForSearch(item.title),
      subtitle: normalizeForSearch(item.subtitle ?? ''),
      extra: normalizeForSearch(item.extra ?? ''),
      description: normalizeForSearch(item.description ?? ''),
    });
  }
}

export function isChapterIndexLoaded(): boolean {
  return chapterCounts !== null;
}

const DEVANAGARI_DIGITS = '०१२३४५६७८९';

function parseChapterNumber(token: string): number | null {
  const ascii = token.replace(/[०-९]/g, (d) => String(DEVANAGARI_DIGITS.indexOf(d)));
  return /^\d{1,4}$/.test(ascii) ? Number(ascii) : null;
}

/**
 * "gita 2" / "गीता २" → direct links to that chapter of the best-matching
 * scriptures. Only title/Sanskrit-title matches count, so a number next to
 * a word from some description doesn't produce a jump.
 */
function chapterJumps(tokens: string[]): SearchResultItem[] {
  const numbers = tokens.map(parseChapterNumber);
  const numTokens = numbers.filter((n): n is number => n !== null);
  if (numTokens.length === 0 || numTokens.length > 2) return [];
  const n = numTokens[0];
  // "gita 2.47" / "गीता २:४७" → chapter 2, verse 47.
  const verse = numTokens.length === 2 ? numTokens[1] : null;
  const words = tokens.filter((_, i) => numbers[i] === null);
  if (n < 1 || (verse !== null && verse < 1) || words.length === 0) return [];

  const candidates: Array<{ entry: IndexedItem; score: number }> = [];
  for (const entry of getIndexed()) {
    if (entry.item.category !== 'scripture') continue;
    let score = 0;
    for (const w of words) {
      const s = scoreToken(entry, w);
      if (s < 3) {
        score = 0;
        break;
      }
      score += s;
    }
    if (score > 0) candidates.push({ entry, score });
  }
  candidates.sort((a, b) => b.score - a.score);

  const jumps: SearchResultItem[] = [];
  for (const { entry } of candidates.slice(0, 3)) {
    const scriptureId = entry.item.id.replace(/^scripture-/, '');
    const meta = scriptureCatalog.find((s) => s.id === scriptureId);
    const max = chapterCounts?.[scriptureId] ?? meta?.totalChapters ?? 0;
    if (n > max) continue;
    const chapter = chapterHref(scriptureId, n);
    const href =
      verse === null
        ? chapter
        : (versePageHref(scriptureId, n, verse) ?? `${chapter}#verse-${n}.${verse}`);
    jumps.push({
      id: `jump-${scriptureId}-${n}${verse === null ? '' : `-${verse}`}`,
      title: `${entry.item.title} · ${verse === null ? `अध्याय ${n}` : `श्लोक ${n}.${verse}`}`,
      subtitle: entry.item.subtitle,
      category: 'chapter',
      categoryLabel: verse === null ? 'अध्याय · Chapter' : 'श्लोक · Verse',
      href,
      description:
        verse === null
          ? (chapterTitleByHref.get(href) ?? 'सीधे अध्याय पर जाएँ · Jump to chapter')
          : `अध्याय ${n} · सीधे श्लोक पर जाएँ · Jump to verse`,
    });
  }
  return jumps;
}

function startsWord(haystack: string, token: string): boolean {
  return haystack.startsWith(token) || haystack.includes(` ${token}`);
}

/** Best weight for a single query token across an item's fields; 0 = no match. */
function scoreToken(entry: IndexedItem, token: string): number {
  if (startsWord(entry.title, token)) return 10;
  if (entry.title.includes(token)) return 6;
  if (startsWord(entry.subtitle, token)) return 5;
  if (entry.subtitle.includes(token)) return 3;
  if (entry.extra.includes(token)) return 2;
  if (entry.description.includes(token)) return 1;
  return 0;
}

export interface SearchOptions {
  category?: SearchCategory | null;
  limit?: number;
}

export interface SearchResponse {
  results: SearchResultItem[];
  totalMatches: number;
  /** Match counts per category, ignoring the category filter. */
  categoryCounts: Partial<Record<SearchCategory, number>>;
}

/**
 * Ranked multi-token search. Every token must match some field; items are
 * ordered by field weight, with bonuses for exact / prefix title matches.
 */
export function searchIndex(query: string, options: SearchOptions = {}): SearchResponse {
  const { category = null, limit = 20 } = options;
  const q = normalizeForSearch(query).slice(0, 200);
  const tokens = q ? q.split(' ') : [];

  const scored: Array<{ item: SearchResultItem; score: number; order: number }> = [];
  const categoryCounts: Partial<Record<SearchCategory, number>> = {};

  // Direct chapter jumps always rank first.
  const jumps = chapterJumps(tokens);
  const jumpHrefs = new Set(jumps.map((j) => j.href));
  jumps.forEach((item, i) => {
    categoryCounts.chapter = (categoryCounts.chapter ?? 0) + 1;
    if (category && category !== 'chapter') return;
    scored.push({ item, score: 1000 - i, order: -1 });
  });

  const entries = chapterEntries.length ? getIndexed().concat(chapterEntries) : getIndexed();
  entries.forEach((entry, order) => {
    if (jumpHrefs.has(entry.item.href)) return;
    let score = 0;
    for (const token of tokens) {
      const s = scoreToken(entry, token);
      if (s === 0) return;
      score += s;
    }
    const cat = entry.item.category;
    categoryCounts[cat] = (categoryCounts[cat] ?? 0) + 1;
    if (category && cat !== category) return;

    if (q) {
      if (entry.title === q || entry.subtitle === q) score += 50;
      else if (entry.title.startsWith(q)) score += 20;
    }
    scored.push({ item: entry.item, score, order });
  });

  scored.sort((a, b) => b.score - a.score || a.order - b.order);

  return {
    results: scored.slice(0, limit).map((s) => s.item),
    totalMatches: scored.length,
    categoryCounts,
  };
}
