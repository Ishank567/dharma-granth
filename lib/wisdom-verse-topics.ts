import { wisdomTopics } from '@/data/wisdom-for-life';
import { libraryLocation } from '@/lib/wisdom-links';

// Server-side only (verse pages): kept out of lib/wisdom-links.ts, which client code imports.

export interface WisdomTopicLink {
  slug: string;
  titleEn: string;
  titleHi: string;
  /** The topic page, scrolled to this verse. */
  href: string;
}

type Citation = (typeof wisdomTopics)[number]['verses'][number];

/** Library verse numbers a citation covers: "2.62–63" covers 62 and 63. */
export function coveredVerses(v: Citation): string[] {
  const { verse } = libraryLocation(v);
  const range = String(v.verseNumber).match(/^(\d+)\s*[–-]\s*(\d+)$/);
  const start = Number(verse);
  if (!range || !Number.isInteger(start)) return [verse];
  return Array.from({ length: Number(range[2]) - Number(range[1]) + 1 }, (_, i) => String(start + i));
}

/** Wisdom for Life topics that cite this library verse, in topic order. */
export function wisdomTopicsForVerse(scriptureId: string, chapterId: number, verseId: string): WisdomTopicLink[] {
  const out: WisdomTopicLink[] = [];
  for (const topic of wisdomTopics) {
    const hit = topic.verses.find(
      (v) => v.scriptureId === scriptureId && libraryLocation(v).chapter === chapterId && coveredVerses(v).includes(verseId),
    );
    if (hit) out.push({ slug: topic.slug, titleEn: topic.titleEn, titleHi: topic.titleHi, href: `/wisdom-for-life/${topic.slug}/#verse-${hit.id}` });
  }
  return out;
}
