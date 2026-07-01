import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Scripture, ScriptureCategory, ScriptureMeta } from "../types";
import { scriptureCatalog } from "../scripture-meta";
import { loadScripture } from "./lazy";

interface ChapterInfo {
  id: number;
  title: string;
  titleSanskrit?: string;
  verseCount: number;
}

interface Stats {
  realVerseCount: number;
  realChapterCount: number;
  realScriptureCount: number;
}

let chaptersCache: Record<string, ChapterInfo[]> | null = null;
let statsCache: Stats | null = null;

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

function getStats(): Stats {
  if (statsCache) return statsCache;
  const filePath = resolve(process.cwd(), 'public/data/stats.json');
  if (!existsSync(filePath)) return { realVerseCount: 0, realChapterCount: 0, realScriptureCount: 0 };
  try {
    statsCache = JSON.parse(readFileSync(filePath, 'utf8')) as Stats;
    return statsCache;
  } catch {
    return { realVerseCount: 0, realChapterCount: 0, realScriptureCount: 0 };
  }
}

function hasVerseData(id: string): boolean {
  const chapters = getChapters()[id];
  return chapters?.some((chapter) => chapter.verseCount > 0) ?? false;
}

function withDataAvailability(meta: ScriptureMeta): ScriptureMeta {
  return {
    ...meta,
    hasData: hasVerseData(meta.id),
  };
}

export function getScripture(id: string): Scripture | undefined {
  return loadScripture(id);
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
  const meta = scriptureCatalog.find((scripture) => scripture.id === id);
  return meta ? withDataAvailability(meta) : undefined;
}

/** Honest, real-time count of verses that actually have full hand-authored data on disk. */
export function getRealVerseCount(): number {
  return getStats().realVerseCount;
}

/** Honest count of chapters that contain at least one authored verse. */
export function getRealChapterCount(): number {
  return getStats().realChapterCount;
}

/** How many scriptures actually ship verse data right now. */
export function getRealScriptureCount(): number {
  return getStats().realScriptureCount;
}

export function getScriptureChapters(id: string): ChapterInfo[] {
  return getChapters()[id] ?? [];
}
