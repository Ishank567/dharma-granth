import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { FullChapter, FullScripture, FullVerse } from "./scripture-schema";

export function hasHindi(text?: string): boolean {
  return Boolean((text ?? "").trim());
}

export function loadScripture(id: string, pubRoot = "public/data/scriptures-full"): FullScripture {
  const path = resolve(pubRoot, `${id}.json`);
  return JSON.parse(readFileSync(path, "utf8")) as FullScripture;
}

export function flattenVerses(chapters: FullChapter[]): Array<{ chapter: number; verse: FullVerse }> {
  const rows: Array<{ chapter: number; verse: FullVerse }> = [];
  for (const chapter of chapters) {
    for (const verse of chapter.verses) {
      rows.push({ chapter: chapter.number, verse });
    }
  }
  return rows;
}

/** Distribute N source blocks across M target verses (Mahabharata-style global stream). */
export function mapSequential(blocks: string[], verseCount: number): string[] {
  if (verseCount <= 0) return [];
  if (!blocks.length) return Array.from({ length: verseCount }, () => "");
  if (blocks.length === verseCount) return [...blocks];

  const mapped: string[] = [];
  let cursor = 0;

  for (let index = 0; index < verseCount; index++) {
    const remaining = verseCount - index;
    const left = blocks.length - cursor;
    if (left <= 0) {
      mapped.push(mapped.at(-1) ?? "");
      continue;
    }
    if (remaining === 1) {
      mapped.push(blocks.slice(cursor).join(" "));
      break;
    }
    const take = Math.max(1, Math.round(left / remaining));
    mapped.push(blocks.slice(cursor, cursor + take).join(" "));
    cursor += take;
  }

  while (mapped.length < verseCount) {
    mapped.push(mapped.at(-1) ?? "");
  }
  return mapped.slice(0, verseCount);
}

export interface HindiSeedStats {
  filled: number;
  skipped: number;
  missing: number;
  total: number;
  withHindi: number;
}

export function countHindi(scripture: FullScripture): HindiSeedStats {
  const total = scripture.chapters.reduce((n, c) => n + c.verses.length, 0);
  const withHindi = scripture.chapters.reduce(
    (n, c) => n + c.verses.filter((v) => hasHindi(v.hindi)).length,
    0,
  );
  return {
    filled: 0,
    skipped: 0,
    missing: total - withHindi,
    total,
    withHindi,
  };
}