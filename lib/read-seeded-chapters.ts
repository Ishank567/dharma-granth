import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';

const seededChapterNumbersCache = new Map<string, number[]>();

/**
 * Read the chapter numbers present in a scripture's seeded full-text JSON
 * (`public/data/scriptures-full/<id>.json`), if any.
 */
export function readSeededChapterNumbers(scriptureId: string): number[] {
  const cached = seededChapterNumbersCache.get(scriptureId);
  if (cached) return cached;

  try {
    const filePath = resolve(
      process.cwd(),
      'public/data/scriptures-full',
      `${scriptureId}.json`,
    );
    if (!existsSync(filePath)) return [];
    const data = JSON.parse(readFileSync(filePath, 'utf8')) as {
      chapters?: { number?: number | string }[];
    };
    const chapterNumbers = (data.chapters ?? [])
      .map((c) => (typeof c.number === 'number' ? c.number : Number(c.number)))
      .filter((n): n is number => Number.isFinite(n));
    seededChapterNumbersCache.set(scriptureId, chapterNumbers);
    return chapterNumbers;
  } catch {
    return [];
  }
}
