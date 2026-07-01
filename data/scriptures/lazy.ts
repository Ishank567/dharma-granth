import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Chapter, Scripture, Verse } from '../types';
import { scriptureCatalog } from '../scripture-meta';

const cache = new Map<string, Scripture>();

export interface JsonVerse {
  number: number | string;
  sanskrit?: string;
  transliteration?: string;
  translation?: string;
  hindi?: string;
  wordMeaning?: string;
  commentary?: string;
  meaning?: string;
  explanation?: string;
  keywords?: string[];
}

export interface JsonChapter {
  number: number | string;
  title?: string;
  titleSanskrit?: string;
  summary?: string;
  verses?: JsonVerse[];
}

export interface JsonScripture {
  id?: string;
  title?: string;
  titleSanskrit?: string;
  category?: string;
  source?: string;
  totalVerses?: number;
  totalChapters?: number;
  chapters?: JsonChapter[];
}

function toNumber(n: number | string | undefined): number | undefined {
  if (n === undefined) return undefined;
  const v = typeof n === 'number' ? n : Number(n);
  return Number.isFinite(v) ? v : undefined;
}

function buildVerse(v: JsonVerse): Verse {
  const id = toNumber(v.number);
  if (id === undefined) {
    throw new Error(`Verse missing number: ${JSON.stringify(v).slice(0, 100)}`);
  }
  const explanation =
    v.explanation ||
    v.commentary ||
    v.wordMeaning ||
    v.meaning ||
    v.translation ||
    v.hindi ||
    '';
  return {
    id,
    sanskrit: v.sanskrit || '',
    transliteration: v.transliteration || '',
    translation: v.translation || v.hindi || explanation || '',
    hindi: v.hindi,
    meaning: v.meaning || v.wordMeaning || v.commentary,
    explanation,
    keywords: v.keywords || [],
  };
}

function buildChapter(ch: JsonChapter): Chapter {
  const id = toNumber(ch.number);
  if (id === undefined) {
    throw new Error(`Chapter missing number: ${JSON.stringify(ch).slice(0, 100)}`);
  }
  return {
    id,
    title: ch.title || `अध्याय ${id}`,
    titleSanskrit: ch.titleSanskrit,
    summary: ch.summary,
    verses: (ch.verses || []).map(buildVerse),
  };
}

export function loadScriptureFromJSON(id: string): Scripture | undefined {
  if (cache.has(id)) return cache.get(id);
  const filePath = resolve(process.cwd(), 'public/data/scriptures-full', `${id}.json`);
  if (!existsSync(filePath)) return undefined;
  try {
    const json = JSON.parse(readFileSync(filePath, 'utf8')) as JsonScripture;
    const meta = scriptureCatalog.find((s) => s.id === id);
    if (!meta) return undefined;

    const scripture: Scripture = {
      id,
      title: meta.title,
      titleSanskrit: meta.titleSanskrit,
      category: meta.category,
      description: meta.description,
      author: meta.author,
      totalVerses: json.totalVerses ?? meta.totalVerses,
      tags: meta.tags,
      chapters: (json.chapters || []).map(buildChapter),
    };

    cache.set(id, scripture);
    return scripture;
  } catch (e) {
    console.error(`Failed to load scripture ${id}:`, e);
    return undefined;
  }
}

export function clearScriptureCache(): void {
  cache.clear();
}
