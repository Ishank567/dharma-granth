'use client';

import Link from 'next/link';
import { STATUS_LABEL, type AshtavakraChapterMeta } from '@/data/ashtavakra/chapters-meta';
import { useAshRead } from '@/lib/ashtavakra-progress';

export interface PathChapter extends AshtavakraChapterMeta {
  /** Verse ids of a published chapter. Empty otherwise. */
  ids: string[];
}

/**
 * "Path of Awareness": all 20 chapters as connected stops. Readers may open any
 * published chapter; nothing is locked. Progress is a quiet glow on the marker
 * and a plain count, never a score.
 */
export function ChapterPath({ chapters }: { chapters: PathChapter[] }) {
  const { ids: read, ready } = useAshRead();
  const firstOpen = chapters.find((c) => c.status === 'published' && c.ids.some((id) => !read.includes(id)))?.number;

  return (
    <ol className="ash-path" aria-label="अष्टावक्र गीता के प्रकरण। प्रकाशित प्रकरण खुलते हैं। शेष स्थल पर नहीं हैं।">
      {chapters.map((c) => {
        const published = c.status === 'published';
        const done = ready ? c.ids.filter((id) => read.includes(id)).length : 0;
        const allRead = published && ready && c.ids.length > 0 && done === c.ids.length;
        const body = (
          <>
            <span className={`ash-node ${c.number === firstOpen ? 'ash-node-current' : ''}`} aria-hidden="true">{c.number}</span>
            <span className="flex flex-wrap items-center gap-2">
              <span className="ash-eyebrow">{c.bookTitle}</span>
              <span className="ash-chip">{STATUS_LABEL[c.status]}</span>
            </span>
            <span className="mt-1 block font-bold" style={{ fontSize: '1.15rem' }}>{c.title}</span>
            <span className="ash-hindi block">{c.essence}</span>
            <span className="ash-meta mt-1 block">
              प्रतीक: {c.symbol}
              {c.verifiedVerseCount ? ` · ${c.verifiedVerseCount} श्लोक` : ' · श्लोक-संख्या अभी सत्यापित नहीं'}
              {published && ready && ` · पढ़ा गया ${done} / ${c.ids.length}`}
            </span>
            {published && <span className="mt-2 inline-flex font-bold" style={{ color: 'var(--ash-accent)' }}>{done > 0 && !allRead ? 'पढ़ना जारी रखें →' : 'अध्याय खोलें →'}</span>}
          </>
        );
        return (
          <li key={c.number} className="mb-2">
            {published ? (
              <Link href={`/ashtavakra/${c.number}/`} className="ash-portal" data-ready="true" data-read={allRead || done > 0 ? 'true' : 'false'} aria-label={`${c.bookTitle}: ${c.title}`}>
                {body}
              </Link>
            ) : (
              <div className="ash-portal" data-ready="false" style={{ opacity: 0.85 }}>
                {body}
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
