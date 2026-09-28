import { getAllScriptures, getScriptureChapters } from '@/data/scriptures';
import { readSeededChapterPreviews } from '@/lib/read-seeded-chapters';
import type { ChapterIndex, ChapterIndexEntry } from '@/lib/search';

// "Adhyaya 3", "Chapter 3", "अध्याय ३" carry no information beyond the number,
// which the "<scripture> <number>" jump in search already covers.
const GENERIC_TITLE = /^(adhyaya|chapter|अध्याय)\s*[\d०-९]+$/i;

function meaningful(title: string | undefined): string | undefined {
  const t = title?.trim();
  return t && !GENERIC_TITLE.test(t) ? t : undefined;
}

/**
 * Build-time index of chapter titles for global search. Uses the same
 * sources and precedence as the chapter page (curated TS, then seeded JSON).
 */
export function buildChapterIndex(): ChapterIndex {
  const counts: Record<string, number> = {};
  const chapters: ChapterIndexEntry[] = [];

  for (const meta of getAllScriptures()) {
    const curated = new Map(getScriptureChapters(meta.id).map((c) => [c.id, c]));
    const seeded = new Map(readSeededChapterPreviews(meta.id).map((c) => [c.id, c]));
    const numbers = Array.from(new Set([...Array.from(curated.keys()), ...Array.from(seeded.keys())])).sort(
      (a, b) => a - b,
    );

    counts[meta.id] = Math.max(meta.totalChapters, numbers[numbers.length - 1] ?? 0);

    for (const n of numbers) {
      const title = meaningful(curated.get(n)?.title ?? seeded.get(n)?.title);
      const titleSanskrit = meaningful(curated.get(n)?.titleSanskrit ?? seeded.get(n)?.titleSanskrit);
      if (!title && !titleSanskrit) continue;
      chapters.push(titleSanskrit ? [meta.id, n, title ?? '', titleSanskrit] : [meta.id, n, title ?? '']);
    }
  }

  return { v: 1, counts, chapters };
}
