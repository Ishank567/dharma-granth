import type { Metadata } from 'next';
import { getAllScriptures, getScriptureChapters } from '@/data/scriptures';
import { readSeededChapterNumbers } from '@/lib/read-seeded-chapters';
import { ChapterView, chapterMetadata, type ChapterParams } from './chapter-view';

interface PageProps {
  params: ChapterParams;
}

export function generateStaticParams() {
  const params: ChapterParams[] = [];
  for (const meta of getAllScriptures()) {
    const seen = new Set<string>();
    for (const ch of getScriptureChapters(meta.id)) {
      const cid = String(ch.id);
      if (!seen.has(cid)) {
        params.push({ id: meta.id, chapterId: cid });
        seen.add(cid);
      }
    }
    // Also emit params for chapters that exist only in the seeded
    // full-text JSON. For scriptures whose curated TS module covers
    // fewer chapters than were seeded (e.g. yajurveda's curated 1–4 vs
    // seeded 1–40), this is what makes the seeded chapters reachable
    // as static pages.
    for (const n of readSeededChapterNumbers(meta.id)) {
      const cid = String(n);
      if (!seen.has(cid)) {
        params.push({ id: meta.id, chapterId: cid });
        seen.add(cid);
      }
    }
    if (meta.id === 'yogavasishtha') {
      for (const cid of Array.from(seen)) {
        params.push({ id: 'yogavasistha', chapterId: cid });
      }
    }
  }
  return params;
}

export function generateMetadata({ params }: PageProps): Metadata {
  return chapterMetadata(params, 1);
}

/** The chapter (or, for chapters split into parts, its first part). */
export default function ChapterPage({ params }: PageProps) {
  return <ChapterView params={params} part={1} />;
}
