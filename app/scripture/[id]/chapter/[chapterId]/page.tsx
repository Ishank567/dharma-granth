import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BookExplanationPanel } from '@/app/components/BookExplanationPanel';
import { ChapterHero } from '@/app/components/motion/ChapterHero';
import { ChapterLearningClient } from '@/app/components/ChapterLearningClient';
import { ChapterPreparationClient } from '@/app/components/ChapterPreparationClient';
import { FullChapterVerses } from '@/app/components/FullChapterVerses';
import { FadeUpOnView, Stagger, StaggerItem } from '@/app/components/motion/primitives';
import { getBookExplanation } from '@/data/book-explanations';
import { getScripture, getScriptureMeta, getAllScriptures } from '@/data/scriptures';
import { getVerseExplanationHi } from '@/data/verse-explanations-hi';
import { ArrowLeft, ArrowRight, BookOpen, Feather, Languages, ScrollText, Lightbulb, Atom, Sparkles, Sun } from 'lucide-react';

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
    // full-text JSON (public/data/scriptures-full/<id>.json). For
    // scriptures whose curated TS module covers fewer chapters than
    // were seeded (e.g. yajurveda's curated 1-4 vs seeded 1-40), this
    // is what makes the seeded chapters reachable as static pages.
    try {
      // Lazy require: only at build/dev time, not in the client bundle.
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const fs = require('node:fs') as typeof import('node:fs');
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const path = require('node:path') as typeof import('node:path');
      const filePath = path.resolve(
        process.cwd(),
        'public/data/scriptures-full',
        `${meta.id}.json`,
      );
      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(raw) as { chapters?: { number?: number | string }[] };
        for (const ch of data.chapters ?? []) {
          if (ch.number === undefined) continue;
          const cid = String(ch.number);
          if (!seen.has(cid)) {
            params.push({ id: meta.id, chapterId: cid });
            seen.add(cid);
          }
        }
      }
    } catch {
      // Silently ignore — generateStaticParams falling back to curated-only is fine.
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

  const title = `${chapter.title} — ${meta.title} (Chapter ${chapter.id})`;
  const description = chapter.summary
    ? `${meta.title}, Chapter ${chapter.id}: ${chapter.title} (${chapter.titleSanskrit ?? ''}). ${chapter.summary}`.trim()
    : `${meta.title} — Chapter ${chapter.id}: ${chapter.title}`;

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
    title: `Chapter ${chapterId}`,
    titleSanskrit: undefined,
    summary: undefined,
    verses: [],
  };

  // Determine the navigable chapter range. Curated TS may stop short
  // of the seeded JSON (e.g. yajurveda curated 1–4 / seeded 1–40); we
  // want pagination to span the full seeded range so users can keep
  // moving forward into seeded-only chapters.
  let totalChapterCount = scripture.chapters.length;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const fs = require('node:fs') as typeof import('node:fs');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const path = require('node:path') as typeof import('node:path');
    const filePath = path.resolve(
      process.cwd(),
      'public/data/scriptures-full',
      `${meta.id}.json`,
    );
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8')) as {
        chapters?: { number?: number }[];
      };
      const maxSeeded = (data.chapters ?? []).reduce(
        (m, c) => (typeof c.number === 'number' && c.number > m ? c.number : m),
        0,
      );
      if (maxSeeded > totalChapterCount) totalChapterCount = maxSeeded;
    }
  } catch {
    // Fall back to curated count.
  }
  if (chapterId > totalChapterCount) return notFound();

  const previousChapter = chapterIndex > 0 ? scripture.chapters[chapterIndex - 1] : undefined;
  const nextChapter = chapterIndex < scripture.chapters.length - 1 ? scripture.chapters[chapterIndex + 1] : undefined;
  const explanation = getBookExplanation(params.id);
  const learningVerses = chapter.verses.map(verse => ({
    ...verse,
    explanationHi: getVerseExplanationHi(params.id, chapter.id, verse.id),
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
              <div className="text-xs uppercase tracking-[0.3em] text-saffron-200/90 mb-1">Chapter {chapter.id} of {totalChapterCount}</div>
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
                  {chapter.verses.length} curated verse{chapter.verses.length === 1 ? '' : 's'}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium">
                  <Sparkles className="w-3.5 h-3.5" />
                  With Hindi &amp; Science
                </span>
              </>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 backdrop-blur text-xs font-medium">
                <BookOpen className="w-3.5 h-3.5" />
                Full text from open-source corpus
              </span>
            )}
          </div>
        </div>
      </ChapterHero>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {chapter.verses.length > 0 ? (
          <Stagger className="space-y-10">
            {chapter.verses.map((v) => (
              <StaggerItem
                key={v.id}
                className="verse-card lotus-card"
              >
                <div className="bg-gradient-to-r from-saffron-50 via-amber-50 to-rose-50 px-6 py-4 border-b border-dharma-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="verse-number">{v.id}</span>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-saffron-800/70 font-semibold">Shloka</div>
                      <div className="text-sm font-bold text-saffron-900">Verse {v.id}</div>
                    </div>
                  </div>
                  <span className="om-symbol text-3xl animate-float" aria-hidden>ॐ</span>
                </div>
                <div className="p-6 md:p-7 space-y-5">
                  <div className="section-sanskrit">
                    <div className="section-label text-saffron-800">
                      <Feather className="w-3.5 h-3.5" />
                      Sanskrit — संस्कृत
                    </div>
                    <p className="sanskrit-text text-dharma-text whitespace-pre-line">{v.sanskrit}</p>
                  </div>

                  <div className="section-translit">
                    <div className="section-label text-stone-700">
                      <Languages className="w-3.5 h-3.5" />
                      Transliteration (IAST)
                    </div>
                    <p className="text-sm md:text-base text-stone-700 italic whitespace-pre-line leading-relaxed">{v.transliteration}</p>
                  </div>

                  <div className="section-translation">
                    <div className="section-label text-blue-800">
                      <ScrollText className="w-3.5 h-3.5" />
                      English Translation
                    </div>
                    <p className="text-base text-dharma-text leading-relaxed">{v.translation}</p>
                  </div>

                  {v.hindi && (
                    <div className="section-hindi">
                      <div className="section-label text-rose-800" style={{ fontFamily: 'inherit' }}>
                        <Sun className="w-3.5 h-3.5" />
                        हिन्दी अर्थ — Hindi Meaning
                      </div>
                      <p className="text-base md:text-lg text-rose-950 leading-loose">{v.hindi}</p>
                    </div>
                  )}

                  <div className="section-explanation">
                    <div className="section-label text-emerald-800">
                      <Sparkles className="w-3.5 h-3.5" />
                      Spiritual Commentary
                    </div>
                    <p className="text-sm md:text-base text-emerald-950 leading-relaxed">{v.explanation}</p>
                  </div>

                  {v.science && (
                    <div className="section-science">
                      <div className="section-label text-indigo-800">
                        <Atom className="w-3.5 h-3.5" />
                        Scientific Perspective
                      </div>
                      <p className="text-sm md:text-base text-indigo-950 leading-relaxed">{v.science}</p>
                    </div>
                  )}

                  {v.lifeLesson && (
                    <div className="section-lesson">
                      <div className="section-label text-amber-800">
                        <Lightbulb className="w-3.5 h-3.5" />
                        Life Lesson — Apply Today
                      </div>
                      <p className="text-sm md:text-base text-amber-950 leading-relaxed font-medium">{v.lifeLesson}</p>
                    </div>
                  )}

                  {v.keywords && v.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {v.keywords.map(k => (
                        <span key={k} className="chip chip-saffron">
                          #{k}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        ) : null}

        <FullChapterVerses
          scriptureId={params.id}
          chapterId={chapter.id}
          curatedVerseIds={new Set(chapter.verses.map((v) => v.id))}
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
                <div className="text-[10px] uppercase tracking-widest text-dharma-muted">Previous</div>
                <div className="text-sm font-semibold">Chapter {chapterId - 1}</div>
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
                <div className="text-[10px] uppercase tracking-widest opacity-80">Next</div>
                <div className="text-sm font-semibold">Chapter {chapterId + 1}</div>
              </span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </FadeUpOnView>
      </div>
    </main>
  );
}
