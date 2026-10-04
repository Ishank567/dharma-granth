import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Chapter, Scripture, Verse } from '../types';
import { scriptureCatalog } from '../scripture-meta';

const cache = new Map<string, Scripture>();

const SCRIPTURE_ALIASES: Record<string, string> = {
  yogavasistha: 'yogavasishtha',
};

interface JsonVerse {
  number: number | string;
  sanskrit?: string;
  transliteration?: string;
  translation?: string;
  hindi?: string;
  wordMeaning?: string;
  commentary?: string;
  meaning?: string;
  explanation?: string;
  science?: string;
  lifeLesson?: string;
  keywords?: string[];
}

interface JsonChapter {
  number: number | string;
  title?: string;
  titleSanskrit?: string;
  summary?: string;
  verses?: JsonVerse[];
}

interface JsonScripture {
  totalVerses?: number;
  chapters?: JsonChapter[];
}

function toNumber(n: number | string | undefined): number {
  const v = typeof n === 'number' ? n : Number(n);
  return Number.isFinite(v) ? v : 0;
}

function toVerseId(n: number | string): number | string {
  if (typeof n === 'number') return n;
  const value = n.trim();
  return /^\d+$/.test(value) ? Number(value) : value;
}

function uniqueVerseId(
  rawId: number | string,
  index: number,
  counts: Map<string, number>,
): number | string {
  const key = String(rawId);
  return (counts.get(key) ?? 0) > 1 ? `${key}~${index + 1}` : rawId;
}

function buildVerse(v: JsonVerse, id: number | string, number: number | string): Verse {
  const explanation =
    v.explanation || v.commentary || v.wordMeaning || v.meaning || v.translation || v.hindi || '';
  return {
    id,
    number,
    sanskrit: v.sanskrit || '',
    transliteration: v.transliteration || '',
    translation: v.translation || v.hindi || explanation || '',
    hindi: v.hindi,
    meaning: v.meaning || v.wordMeaning || v.commentary,
    explanation,
    science: v.science,
    lifeLesson: v.lifeLesson,
    keywords: v.keywords || [],
  };
}

function buildChapter(ch: JsonChapter): Chapter {
  const id = toNumber(ch.number);
  const sourceVerses = ch.verses || [];
  const verseNumbers = sourceVerses.map((v) => toVerseId(v.number));
  const counts = new Map<string, number>();
  for (const verseNumber of verseNumbers) {
    const key = String(verseNumber);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return {
    id,
    title: ch.title || `अध्याय ${id}`,
    titleSanskrit: ch.titleSanskrit,
    summary: ch.summary,
    verses: sourceVerses.map((verse, index) =>
      buildVerse(
        verse,
        uniqueVerseId(verseNumbers[index], index, counts),
        verseNumbers[index],
      ),
    ),
  };
}

/**
 * Load a scripture's full verse data at runtime from
 * `public/data/scriptures-full/<id>.json`.
 *
 * This deliberately reads the JSON off disk rather than importing the
 * per-scripture `data/scriptures/<id>.ts` modules. A dynamic
 * `require(`@/data/scriptures/${id}`)` makes webpack bundle the *entire*
 * `data/scriptures/` directory (67 files, 100MB+ of verse data) into every
 * page that touches this module — producing an 800MB+ page.js that exceeds
 * Node's max string length and crashes `next dev`/build with
 * ERR_STRING_TOO_LONG. Reading the JSON at runtime keeps the bundle small.
 */
export function loadScripture(id: string): Scripture | undefined {
  const canonicalId = SCRIPTURE_ALIASES[id] ?? id;
  if (cache.has(canonicalId)) return cache.get(canonicalId);
  const filePath = resolve(process.cwd(), 'public/data/scriptures-full', `${canonicalId}.json`);
  if (!existsSync(filePath)) return undefined;
  try {
    const json = JSON.parse(readFileSync(filePath, 'utf8')) as JsonScripture;
    const meta = scriptureCatalog.find((s) => s.id === canonicalId);
    if (!meta) return undefined;

    const scripture: Scripture = {
      id: canonicalId,
      title: meta.title,
      titleSanskrit: meta.titleSanskrit,
      titleIast: meta.titleIast,
      category: meta.category,
      description: meta.description,
      author: meta.author,
      totalVerses: json.totalVerses ?? meta.totalVerses,
      tags: meta.tags,
      isCurated: meta.isCurated,
      canonicalTotalVerses: meta.canonicalTotalVerses,
      chapters: (json.chapters || []).map(buildChapter),
    };

    cache.set(canonicalId, scripture);
    return scripture;
  } catch (e) {
    console.error(`Failed to load scripture ${canonicalId}:`, e);
    return undefined;
  }
}

export function clearScriptureCache(): void {
  cache.clear();
}
