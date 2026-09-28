import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AmbientOrbs } from '@/app/components/motion/AmbientOrbs';
import { ChapterHero } from '@/app/components/motion/ChapterHero';
import { FullChapterVerses } from '@/app/components/FullChapterVerses';
import { ChapterKeyboardNav } from '@/app/components/ChapterKeyboardNav';
import { ChapterCompletion } from '@/app/components/ChapterCompletion';
import { ChapterVisitRecorder } from '@/app/components/ChapterVisitRecorder';
import { FadeUpOnView } from '@/app/components/motion/primitives';
import { getScriptureMeta, getAllScriptures, getScriptureChapters } from '@/data/scriptures';
import {
  readChapterCommentary,
  readSeededChapter,
  readSeededChapterNumbers,
  readSeededChapterPreviews,
  type ChapterPreview,
} from '@/lib/read-seeded-chapters';
import type { InitialChapter } from '@/app/components/FullChapterVerses';
import type { HiCommentaryEntry } from '@/data/hi-commentary/_types';
import { ArrowLeft, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

/** Chapters whose verse data is larger than this are fetched client-side. */
const INLINE_CHAPTER_MAX_BYTES = 1024 * 1024;

interface PageProps {
  params: { id: string; chapterId: string };
}

function getChapterPreview(scriptureId: string, chapterId: number): ChapterPreview | undefined {
  const indexedChapter = getScriptureChapters(scriptureId).find(
    (chapter) => chapter.id === chapterId,
  );
  const seededChapter = readSeededChapterPreviews(scriptureId).find(
    (chapter) => chapter.id === chapterId,
  );

  if (!indexedChapter && !seededChapter) return undefined;

  return {
    id: chapterId,
    title: indexedChapter?.title ?? seededChapter?.title ?? `अध्याय ${chapterId}`,
    titleSanskrit: indexedChapter?.titleSanskrit ?? seededChapter?.titleSanskrit,
    summary: seededChapter?.summary,
    verseCount: Math.max(indexedChapter?.verseCount ?? 0, seededChapter?.verseCount ?? 0),
  };
}

const GENERIC_TITLE = /^(adhyaya|chapter|अध्याय)\s*[\d०-९]+$/i;

/** A neighbouring chapter's name for the prev/next buttons, if it says more than its number. */
function neighbourLabel(scriptureId: string, chapterId: number): string | undefined {
  const preview = getChapterPreview(scriptureId, chapterId);
  if (!preview) return undefined;
  return [preview.title, preview.titleSanskrit].find(
    (t): t is string => Boolean(t?.trim()) && !GENERIC_TITLE.test(t!.trim()),
  );
}

export function generateStaticParams() {
  const params: { id: string; chapterId: string }[] = [];
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
  }
  return params;
}

export function generateMetadata({ params }: PageProps): Metadata {
  const meta = getScriptureMeta(params.id);
  if (!meta) return {};

  const chapterId = parseInt(params.chapterId, 10);
  const chapter = getChapterPreview(params.id, chapterId);
  if (!chapter) return {};

  const title = `${chapter.title} — ${meta.title} (अध्याय ${chapter.id})`;
  const description = chapter.summary
    ? `${meta.title}, अध्याय ${chapter.id}: ${chapter.title} (${chapter.titleSanskrit ?? ''}). ${chapter.summary}`.trim()
    : `${meta.title} — अध्याय ${chapter.id}: ${chapter.title}`;

  const ogImage = {
    url: `/og/${meta.id}.png`,
    width: 1200,
    height: 630,
    alt: `${meta.title} — Dharma Granth`,
  };

  return {
    title,
    description,
    alternates: { canonical: `/scripture/${meta.id}/chapter/${chapter.id}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/scripture/${meta.id}/chapter/${chapter.id}`,
      tags: meta.tags,
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage.url],
    },
  };
}

export default function ChapterPage({ params }: PageProps) {
  const meta = getScriptureMeta(params.id);
  if (!meta) return notFound();

  const chapterId = parseInt(params.chapterId, 10);
  if (!Number.isFinite(chapterId) || chapterId < 1) return notFound();

  const chapter = getChapterPreview(params.id, chapterId) ?? {
    id: chapterId,
    title: `अध्याय ${chapterId}`,
    titleSanskrit: undefined,
    summary: 'मुक्त-स्रोत संग्रह से पूर्ण मूल पाठ उपलब्ध है।',
    verseCount: 0,
  };

  // Determine the navigable chapter range. Curated TS may stop short
  // of the seeded JSON (e.g. yajurveda curated 1–4 / seeded 1–40); we
  // want pagination to span the full seeded range so users can keep
  // moving forward into seeded-only chapters.
  const seededChapters = readSeededChapterNumbers(meta.id);
  const maxSeeded = seededChapters.reduce((m, n) => (n > m ? n : m), 0);
  const indexedChapters = getScriptureChapters(meta.id);
  const maxIndexed = indexedChapters.reduce((m, ch) => (ch.id > m ? ch.id : m), 0);
  const totalChapterCount = Math.max(meta.totalChapters, maxIndexed, maxSeeded);
  if (chapterId > totalChapterCount) return notFound();

  // The chapter's text, read at build time so every verse is in the exported
  // HTML — scripture never changes between builds, and crawlers, link
  // previews and AI search engines don't run the page's JavaScript.
  // Chapters over 1 MB (11 Mahabharata/Purana ones, up to 12,000+ verses)
  // stay client-loaded from their shard: inlined they would be tens of MB of
  // HTML, past Cloudflare Pages' 25 MB per-file limit.
  const seeded = readSeededChapter(meta.id, chapterId);
  const initialChapter: InitialChapter | undefined =
    seeded &&
    seeded.chapter.verses.length > 0 &&
    Buffer.byteLength(JSON.stringify(seeded.chapter.verses)) <= INLINE_CHAPTER_MAX_BYTES
      ? {
          verses: seeded.chapter.verses as InitialChapter['verses'],
          commentary: readChapterCommentary<HiCommentaryEntry>(meta.id, chapterId),
          source: seeded.source as InitialChapter['source'],
        }
      : undefined;

  const prevHref = chapterId > 1 ? `/scripture/${params.id}/chapter/${chapterId - 1}` : undefined;
  const nextHref =
    chapterId < totalChapterCount ? `/scripture/${params.id}/chapter/${chapterId + 1}` : undefined;
  const prevLabel = prevHref ? neighbourLabel(meta.id, chapterId - 1) : undefined;
  const nextLabel = nextHref ? neighbourLabel(meta.id, chapterId + 1) : undefined;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.in';
  const chapterJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Chapter',
    '@id': `${siteUrl}/scripture/${meta.id}/chapter/${chapter.id}`,
    name: chapter.title,
    alternateName: chapter.titleSanskrit,
    position: chapter.id,
    inLanguage: ['sa', 'hi', 'en'],
    description: chapter.summary,
    isPartOf: {
      '@type': 'Book',
      name: meta.title,
      alternateName: meta.titleSanskrit,
      url: `${siteUrl}/scripture/${meta.id}`,
    },
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Scriptures', item: `${siteUrl}/scriptures` },
      { '@type': 'ListItem', position: 3, name: meta.title, item: `${siteUrl}/scripture/${meta.id}` },
      {
        '@type': 'ListItem',
        position: 4,
        name: chapter.title,
        item: `${siteUrl}/scripture/${meta.id}/chapter/${chapter.id}`,
      },
    ],
  };

  return (
    <main className="min-h-screen bg-dharma-bg">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(chapterJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ChapterHero className="bg-gradient-to-br from-saffron-900 via-saffron-700 to-orange-600 text-white py-16">
        <div className="relative max-w-4xl mx-auto px-6">
          <Link href={`/scripture/${params.id}`} className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm transition mb-6">
            <ArrowLeft className="w-4 h-4" />
            {meta.title}
          </Link>
          <div className="flex items-start gap-5 mb-4">
            <span className="flex-shrink-0 w-16 h-16 rounded-2xl bg-white/15 backdrop-blur text-white flex items-center justify-center text-2xl font-bold ring-1 ring-white/20 shadow-xl">
              {chapter.id}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-xs uppercase text-saffron-200/90 mb-1">अध्याय {chapter.id} / {totalChapterCount}</div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-1">{chapter.title}</h1>
              <p lang="sa" className="text-xl font-devanagari opacity-90">{chapter.titleSanskrit}</p>
            </div>
          </div>
          <p className="text-base opacity-80 max-w-3xl leading-relaxed">{chapter.summary}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {chapter.verseCount > 0 ? (
              <>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium">
                  <BookOpen className="w-3.5 h-3.5" />
                  {chapter.verseCount} श्लोक
                </span>
                <span lang="hi" className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  हिन्दी एवं विज्ञान सहित
                </span>
              </>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium">
                <BookOpen className="w-3.5 h-3.5" />
                मुक्त-स्रोत संग्रह से पूर्ण पाठ
              </span>
            )}
          </div>
        </div>
      </ChapterHero>

      <div className="relative max-w-4xl mx-auto px-4 py-8 sm:px-6 md:py-12">
        <AmbientOrbs />
        <div className="relative">
        {/* With initialChapter, the reader's server render is the plain
            VerseText list (every verse in the HTML); it swaps in the
            interactive cards once hydrated. */}
        <FullChapterVerses
          scriptureId={params.id}
          category={meta.category}
          chapterId={chapter.id}
          curatedVerseIds={[]}
          scriptureTitle={meta.title}
          chapterTitle={chapter.title || `अध्याय ${chapter.id}`}
          basePath={process.env.NEXT_PUBLIC_BASE_PATH || ''}
          autoLoad
          initialChapter={initialChapter}
        />

        <FadeUpOnView className="mt-14 flex items-stretch justify-between gap-4">
          {prevHref ? (
            <Link
              href={prevHref}
              aria-keyshortcuts="ArrowLeft"
              className="group inline-flex min-w-0 max-w-[48%] items-center gap-2 px-5 py-3 rounded-xl border border-dharma-border bg-white text-dharma-text hover:bg-saffron-50 hover:border-saffron-300 hover:shadow-md transition"
            >
              <ArrowLeft className="w-4 h-4 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
              <span className="min-w-0">
                <span className="block text-[10px] uppercase text-dharma-muted">पिछला</span>
                <span className="block text-sm font-semibold">अध्याय {chapterId - 1}</span>
                {prevLabel && (
                  <span className="block truncate text-xs text-dharma-muted">{prevLabel}</span>
                )}
              </span>
            </Link>
          ) : (
            <div />
          )}
          {nextHref && (
            <Link
              href={nextHref}
              aria-keyshortcuts="ArrowRight"
              className="group inline-flex min-w-0 max-w-[48%] items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-br from-saffron-600 to-saffron-700 text-white hover:shadow-lg transition ml-auto"
            >
              <span className="min-w-0 text-right">
                <span className="block text-[10px] uppercase opacity-80">अगला</span>
                <span className="block text-sm font-semibold">अध्याय {chapterId + 1}</span>
                {nextLabel && (
                  <span className="block truncate text-xs opacity-80">{nextLabel}</span>
                )}
              </span>
              <ArrowRight className="w-4 h-4 shrink-0 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </FadeUpOnView>
        {(prevHref || nextHref) && (
          <p className="mt-3 hidden text-center text-xs text-dharma-muted md:block">
            कीबोर्ड: <kbd className="rounded border border-dharma-border px-1 font-mono">←</kbd>{' '}
            <kbd className="rounded border border-dharma-border px-1 font-mono">→</kbd> से अध्याय बदलें
          </p>
        )}
        <ChapterCompletion
          key={`${meta.id}-${chapter.id}`}
          scriptureId={meta.id}
          chapterId={chapter.id}
          chapterTitle={chapter.title || `अध्याय ${chapter.id}`}
          totalChapters={totalChapterCount}
          nextHref={nextHref}
          nextLabel={nextLabel}
        />
        <ChapterKeyboardNav prevHref={prevHref} nextHref={nextHref} />
        <ChapterVisitRecorder
          scriptureId={meta.id}
          scriptureTitle={meta.title}
          scriptureTitleSanskrit={meta.titleSanskrit}
          chapterId={chapter.id}
          chapterTitle={chapter.title || `अध्याय ${chapter.id}`}
          totalChapters={totalChapterCount}
        />
        </div>
      </div>
    </main>
  );
}
