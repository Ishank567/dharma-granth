import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BookExplanationPanel } from '@/app/components/BookExplanationPanel';
import { AmbientOrbs } from '@/app/components/motion/AmbientOrbs';
import { ChapterHero } from '@/app/components/motion/ChapterHero';
import { ChapterLearningClient } from '@/app/components/ChapterLearningClient';
import { ChapterPreparationClient } from '@/app/components/ChapterPreparationClient';
import { FullChapterVerses } from '@/app/components/FullChapterVerses';
import { VerseDisplay } from '@/app/components/VerseDisplay';
import { FadeUpOnView, Stagger, StaggerItem } from '@/app/components/motion/primitives';
import { getBookExplanation } from '@/data/book-explanations';
import { getScripture, getScriptureMeta, getAllScriptures } from '@/data/scriptures';
import { getVerseExplanationHi, getVerseScienceHi, getVerseLifeLessonHi } from '@/data/verse-explanations-hi';
import { ArrowLeft, ArrowRight, BookOpen, Sparkles } from 'lucide-react';

/**
 * Read the chapter numbers present in a scripture's seeded full-text JSON
 * (`public/data/scriptures-full/<id>.json`), if any. Used to extend
 * generateStaticParams + the chapter-page render past the curated TS
 * chapters so the seeded mūla text is reachable.
 */
function readSeededChapterNumbers(scriptureId: string): number[] {
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
    return (data.chapters ?? [])
      .map((c) => (typeof c.number === 'number' ? c.number : Number(c.number)))
      .filter((n): n is number => Number.isFinite(n));
  } catch {
    return [];
  }
}

interface PageProps {
  params: { id: string; chapterId: string };
}

export function generateStaticParams() {
  const params: { id: string; chapterId: string }[] = [];
  for (const meta of getAllScriptures()) {
    const seen = new Set<string>();
    const scripture = getScripture(meta.id);
    if (scripture && scripture.chapters && scripture.chapters.length > 0) {
      for (const ch of scripture.chapters) {
        const cid = String(ch.id);
        if (!seen.has(cid)) {
          params.push({ id: meta.id, chapterId: cid });
          seen.add(cid);
        }
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
  const scripture = getScripture(params.id);
  const meta = getScriptureMeta(params.id);
  if (!scripture || !meta) return {};

  const chapterId = parseInt(params.chapterId, 10);
  const chapter = scripture.chapters.find(c => c.id === chapterId);
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
  const scripture = getScripture(params.id);
  const meta = getScriptureMeta(params.id);
  if (!scripture || !meta) return notFound();

  const chapterId = parseInt(params.chapterId, 10);
  if (!Number.isFinite(chapterId) || chapterId < 1) return notFound();
  const chapterIndex = scripture.chapters.findIndex(c => c.id === chapterId);
  const curatedChapter = scripture.chapters[chapterIndex];

  // If the curated TS module doesn't have this chapter, fall back to a
  // synthetic stub. The seeded full-text JSON (loaded by FullChapterVerses)
  // covers everything; the stub is just a placeholder so the page can
  // render headers and pagination. `generateStaticParams` already emits
  // params for these chapters when seeded JSON exists.
  const chapter = curatedChapter ?? {
    id: chapterId,
    title: `अध्याय ${chapterId}`,
    titleSanskrit: undefined,
    summary: undefined,
    verses: [],
  };

  // Determine the navigable chapter range. Curated TS may stop short
  // of the seeded JSON (e.g. yajurveda curated 1–4 / seeded 1–40); we
  // want pagination to span the full seeded range so users can keep
  // moving forward into seeded-only chapters.
  const seededChapters = readSeededChapterNumbers(meta.id);
  const maxSeeded = seededChapters.reduce((m, n) => (n > m ? n : m), 0);
  const totalChapterCount = Math.max(scripture.chapters.length, maxSeeded);
  if (chapterId > totalChapterCount) return notFound();

  const previousChapter = chapterIndex > 0 ? scripture.chapters[chapterIndex - 1] : undefined;
  const nextChapter = chapterIndex < scripture.chapters.length - 1 ? scripture.chapters[chapterIndex + 1] : undefined;
  const explanation = getBookExplanation(params.id);
  const learningVerses = chapter.verses.map(verse => ({
    ...verse,
    explanationHi: getVerseExplanationHi(params.id, chapter.id, verse.id),
    scienceHi: getVerseScienceHi(params.id, chapter.id, verse.id),
    lifeLessonHi: getVerseLifeLessonHi(params.id, chapter.id, verse.id),
  }));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.example';
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
              <div className="text-xs uppercase tracking-[0.3em] text-saffron-200/90 mb-1">अध्याय {chapter.id} / {totalChapterCount}</div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-1">{chapter.title}</h1>
              <p className="text-xl font-devanagari opacity-90">{chapter.titleSanskrit}</p>
            </div>
          </div>
          <p className="text-base opacity-80 max-w-3xl leading-relaxed">{chapter.summary}</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {chapter.verses.length > 0 ? (
              <>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium">
                  <BookOpen className="w-3.5 h-3.5" />
                  {chapter.verses.length} चयनित श्लोक
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium">
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

      <div className="relative max-w-4xl mx-auto px-6 py-12">
        <AmbientOrbs />
        <div className="relative">
        {chapter.verses.length > 0 ? (
          <Stagger className="space-y-10">
            {learningVerses.map((v) => (
              <StaggerItem key={v.id}>
                <VerseDisplay verse={v} />
              </StaggerItem>
            ))}
          </Stagger>
        ) : null}

        <FullChapterVerses
          scriptureId={params.id}
          chapterId={chapter.id}
          curatedVerseIds={new Set(chapter.verses.map((v) => v.id))}
          basePath={process.env.NEXT_PUBLIC_BASE_PATH || ''}
          autoLoad={chapter.verses.length === 0}
        />

        <FadeUpOnView className="mt-14 flex items-center justify-between gap-4">
          {chapterId > 1 ? (
            <Link
              href={`/scripture/${params.id}/chapter/${chapterId - 1}`}
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-dharma-border bg-white text-dharma-text hover:bg-saffron-50 hover:border-saffron-300 hover:shadow-md transition"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>
                <div className="text-[10px] uppercase tracking-widest text-dharma-muted">पिछला</div>
                <div className="text-sm font-semibold">अध्याय {chapterId - 1}</div>
              </span>
            </Link>
          ) : (
            <div />
          )}
          {chapterId < totalChapterCount && (
            <Link
              href={`/scripture/${params.id}/chapter/${chapterId + 1}`}
              className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-br from-saffron-600 to-saffron-700 text-white hover:shadow-lg transition ml-auto"
            >
              <span className="text-right">
                <div className="text-[10px] uppercase tracking-widest opacity-80">अगला</div>
                <div className="text-sm font-semibold">अध्याय {chapterId + 1}</div>
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </FadeUpOnView>
        </div>
      </div>
    </main>
  );
}
