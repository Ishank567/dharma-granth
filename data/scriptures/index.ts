import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Scripture, ScriptureCategory, ScriptureMeta } from "../types";
import { scriptureCatalog } from "../scripture-meta";
import { loadScripture } from "./lazy";
import { readSeededChapterPreviews } from "@/lib/read-seeded-chapters";

import { SCRIPTURE_ALIASES } from "../scripture-aliases";

export { SCRIPTURE_ALIASES };

export function resolveScriptureId(id: string): string {
  return SCRIPTURE_ALIASES[id] ?? id;
}

interface ChapterInfo {
  id: number;
  title: string;
  titleSanskrit?: string;
  verseCount: number;
}

let chaptersCache: Record<string, ChapterInfo[]> | null = null;

function getChapters(): Record<string, ChapterInfo[]> {
  if (chaptersCache) return chaptersCache;
  const filePath = resolve(process.cwd(), 'public/data/chapters.json');
  if (!existsSync(filePath)) return {};
  try {
    chaptersCache = JSON.parse(readFileSync(filePath, 'utf8')) as Record<string, ChapterInfo[]>;
    return chaptersCache;
  } catch {
    return {};
  }
}

interface Holdings {
  chapters: number;
  verses: number;
}

let holdingsCache: Map<string, Holdings> | null = null;

/** Counted from each scripture's manifest (the chapter list the site renders). */
function holdingsMap(): Map<string, Holdings> {
  if (holdingsCache) return holdingsCache;
  const map = new Map<string, Holdings>();
  for (const meta of scriptureCatalog) {
    const chapters = readSeededChapterPreviews(meta.id).filter((c) => c.verseCount > 0);
    map.set(meta.id, {
      chapters: chapters.length,
      verses: chapters.reduce((n, c) => n + c.verseCount, 0),
    });
  }
  holdingsCache = map;
  return map;
}

/** Chapters and verses actually present in the library (not the catalogue totals). */
export function getLibraryCounts(id: string): Holdings {
  const canonical = resolveScriptureId(id);
  return holdingsMap().get(canonical) ?? holdingsMap().get(id) ?? { chapters: 0, verses: 0 };
}

function hasVerseData(id: string): boolean {
  return getLibraryCounts(id).verses > 0;
}

function withDataAvailability(meta: ScriptureMeta): ScriptureMeta {
  return {
    ...meta,
    hasData: hasVerseData(meta.id),
  };
}

export function getScripture(id: string): Scripture | undefined {
  return loadScripture(resolveScriptureId(id));
}

export function getAllScriptures(): ScriptureMeta[] {
  return scriptureCatalog.map(withDataAvailability);
}

export function getAvailableScriptures(): ScriptureMeta[] {
  return getAllScriptures().filter((scripture) => scripture.hasData);
}

export function getScripturesByCategory(
  category: ScriptureCategory,
): ScriptureMeta[] {
  return getAllScriptures().filter(
    (scripture) => scripture.category === category,
  );
}

export function getScriptureMeta(id: string): ScriptureMeta | undefined {
  const canonical = resolveScriptureId(id);
  const meta = scriptureCatalog.find((scripture) => scripture.id === canonical);
  return meta ? withDataAvailability(meta) : undefined;
}

/** Verses present in published manifests. Not a traditional canon total. */
export function getRealVerseCount(): number {
  let n = 0;
  holdingsMap().forEach((row) => {
    n += row.verses;
  });
  return n;
}

/** Chapters that contain at least one verse in the published manifests. */
export function getRealChapterCount(): number {
  let n = 0;
  holdingsMap().forEach((row) => {
    n += row.chapters;
  });
  return n;
}

/** How many catalogue scriptures ship at least one verse right now. */
export function getRealScriptureCount(): number {
  let n = 0;
  holdingsMap().forEach((row) => {
    if (row.verses > 0) n += 1;
  });
  return n;
}

export function getScriptureChapters(id: string): ChapterInfo[] {
  const canonical = resolveScriptureId(id);
  return getChapters()[canonical] ?? getChapters()[id] ?? [];
}
