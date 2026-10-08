/**
 * One canonical record per scripture. Internal links should be built from
 * `canonicalSlug`. Aliases exist only to redirect and to match searches; they
 * never produce a second canonical page.
 */
import { getAllScriptures, getLibraryCounts } from '@/data/scriptures';
import { SCRIPTURE_ALIASES } from '@/data/scripture-aliases';

export { SCRIPTURE_ALIASES };

export interface ScriptureRecord {
  scriptureId: string;
  canonicalSlug: string;
  aliases: string[];
  sanskritName: string;
  englishName: string;
  iastName?: string;
  category: string;
  author?: string;
  descriptionShort: string;
  /** Traditional totals from the catalogue (what the text is said to contain). */
  canonicalChapterCount: number;
  canonicalVerseCount: number;
  /** What the library actually holds today. Show these on cards. */
  libraryChapterCount: number;
  libraryVerseCount: number;
  hasData: boolean;
}

/** First sentence, cut to a length that fits a two-line card. */
function shortDescription(text: string, max = 140): string {
  const first = text.split(/(?<=[.!?।])\s/)[0] ?? text;
  return first.length <= max ? first : `${first.slice(0, max - 1).trimEnd()}…`;
}

let cache: ScriptureRecord[] | null = null;

export function getScriptureRegistry(): ScriptureRecord[] {
  if (cache) return cache;
  const byCanonical = new Map<string, string[]>();
  for (const [alias, id] of Object.entries(SCRIPTURE_ALIASES)) byCanonical.set(id, [...(byCanonical.get(id) ?? []), alias]);
  cache = getAllScriptures().map((s) => ({
    scriptureId: s.id,
    canonicalSlug: s.id,
    aliases: byCanonical.get(s.id) ?? [],
    sanskritName: s.titleSanskrit,
    englishName: s.title,
    iastName: s.titleIast,
    category: s.category,
    author: s.author,
    descriptionShort: shortDescription(s.description),
    canonicalChapterCount: s.totalChapters,
    canonicalVerseCount: s.canonicalTotalVerses ?? s.totalVerses,
    libraryChapterCount: getLibraryCounts(s.id).chapters,
    libraryVerseCount: getLibraryCounts(s.id).verses,
    hasData: s.hasData,
  }));
  return cache;
}

/** Canonical id for an id or alias, or undefined if unknown. */
export function resolveScriptureId(idOrAlias: string): string | undefined {
  const key = idOrAlias.trim().toLowerCase();
  const direct = getScriptureRegistry().find((r) => r.scriptureId === key);
  if (direct) return direct.scriptureId;
  const aliased = SCRIPTURE_ALIASES[key];
  return aliased && getScriptureRegistry().some((r) => r.scriptureId === aliased) ? aliased : undefined;
}

/** The one URL to link to for a scripture. */
export function scripturePath(idOrAlias: string): string | undefined {
  const id = resolveScriptureId(idOrAlias);
  return id ? `/scripture/${id}` : undefined;
}
