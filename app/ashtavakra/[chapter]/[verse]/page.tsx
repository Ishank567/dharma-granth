import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getChapterData, getChapterMeta, getVerse, publishedChapterNumbers, verseHref, verseNeighbours } from '@/lib/ashtavakra';
import { VerseFull, VerificationBadge } from '../../VerseView';
import { ReadMark } from '../../VerseBits';


export function generateStaticParams() {
  return publishedChapterNumbers().flatMap((c) =>
    getChapterData(c)!.verses.map((v) => ({ chapter: String(c), verse: v.verseNumber.split('.')[1] })),
  );
}

export function generateMetadata({ params }: { params: { chapter: string; verse: string } }): Metadata {
  const v = getVerse(Number(params.chapter), Number(params.verse));
  if (!v) return {};
  return {
    title: `अष्टावक्र गीता ${v.verseNumber}: ${v.oneLineSummaryHindi}`.slice(0, 110),
    description: `अष्टावक्र गीता श्लोक ${v.verseNumber}: मूल संस्कृत, शब्दार्थ, पुस्तकानुसार हिन्दी भावार्थ, सरल व्याख्या और English। ${v.oneLineSummaryHindi}`.slice(0, 200),
    alternates: { canonical: `/ashtavakra/${params.chapter}/${params.verse}/` },
  };
}

export default function VersePage({ params }: { params: { chapter: string; verse: string } }) {
  const c = Number(params.chapter);
  const n = Number(params.verse);
  const v = getVerse(c, n);
  const m = getChapterMeta(c);
  if (!v || !m) notFound();
  const { prev, next } = verseNeighbours(c, n);

  return (
    <main id="main" className="mx-auto max-w-3xl px-4 pb-24 pt-8 sm:px-6">
      <nav aria-label="ब्रेडक्रम्ब" className="ash-meta">
        <Link href="/ashtavakra/" className="ash-link underline">अष्टावक्र गीता</Link> /{' '}
        <Link href={`/ashtavakra/${c}/`} className="ash-link underline">{m.bookTitle}</Link> / <span>श्लोक {v.verseNumber}</span>
      </nav>
      <p className="ash-eyebrow mt-4">अध्याय {c} · {m.title}</p>
      <h1 lang="hi" className="font-bold" style={{ fontSize: 'clamp(1.6rem, 1.2rem + 1.5vw, 2.2rem)', lineHeight: 1.4 }}>
        अष्टावक्र गीता, श्लोक {v.verseNumber}
      </h1>
      <p className="mt-2 flex flex-wrap items-center gap-2"><VerificationBadge status={v.verificationStatus} /></p>

      <div className="mt-6">
        <VerseFull v={v} />
      </div>

      <div className="mt-8 grid gap-4">
        <ReadMark id={v.verseNumber} />
        <nav aria-label="श्लोक नेविगेशन" className="flex flex-wrap items-center justify-between gap-3">
          {prev ? <Link href={verseHref(prev.verseNumber)} className="ash-btn" rel="prev">← श्लोक {prev.verseNumber}</Link> : <span />}
          <Link href={`/ashtavakra/${c}/`} className="ash-btn">अध्याय सूची</Link>
          {next ? <Link href={verseHref(next.verseNumber)} className="ash-btn" rel="next">श्लोक {next.verseNumber} →</Link> : <span className="ash-meta">इस प्रकरण का अंतिम श्लोक</span>}
        </nav>
      </div>
    </main>
  );
}
