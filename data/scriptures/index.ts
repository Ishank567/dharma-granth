import type { Scripture, ScriptureCategory, ScriptureMeta } from "../types";
import { scriptureCatalog } from "../scripture-meta";
import { loadScriptureFromJSON } from "./lazy";


function hasVerseData(id: string): boolean {
  const scripture = loadScriptureFromJSON(id);
  return Boolean(
    scripture?.chapters.some((chapter) => chapter.verses.length > 0),
  );
}

function withDataAvailability(meta: ScriptureMeta): ScriptureMeta {
  return {
    ...meta,
    hasData: hasVerseData(meta.id),
  };
}

export function getScripture(id: string): Scripture | undefined {
  return loadScriptureFromJSON(id);
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
  return getAllScriptures().reduce((total, meta) => {
    const scripture = loadScriptureFromJSON(meta.id);
    return (
      total +
      (scripture?.chapters.reduce(
        (subtotal, chapter) => subtotal + chapter.verses.length,
        0,
      ) ?? 0)
    );
  }, 0);
}

/** Honest count of chapters that contain at least one authored verse. */
export function getRealChapterCount(): number {
  return getAllScriptures().reduce((total, meta) => {
    const scripture = loadScriptureFromJSON(meta.id);
    return (
      total +
      (scripture?.chapters.filter((chapter) => chapter.verses.length > 0)
        .length ?? 0)
    );
  }, 0);
}

/** How many scriptures actually ship verse data right now. */
export function getRealScriptureCount(): number {
  return getAllScriptures().filter((meta) => {
    const scripture = loadScriptureFromJSON(meta.id);
    return scripture?.chapters.some((c) => c.verses.length > 0);
  }).length;
}
