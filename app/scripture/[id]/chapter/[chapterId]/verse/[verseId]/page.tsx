import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, Atom, Lightbulb, Sparkles } from 'lucide-react';
import { ChapterVisitRecorder } from '@/app/components/ChapterVisitRecorder';
import { ReaderFontSize } from '@/app/components/ReaderFontSize';
import { VersePageActions } from '@/app/components/VersePageActions';
import { VerseStudyNotes } from '@/app/components/VerseStudyNotes';
import { VerseRelatedSection } from '@/app/components/VerseRelatedSection';
import { VerseText } from '@/app/components/VerseText';
import { getScriptureMeta } from '@/data/scriptures';
import type { HiCommentaryEntry } from '@/data/hi-commentary/_types';
import { readChapterCommentary, readSeededChapter } from '@/lib/read-seeded-chapters';
import { verseStaticParams } from '@/lib/verse-pages';
import { verseOgPath, versePageHref, verseSlug } from '@/lib/verse-paths';
import { scriptureLastChanged } from '@/lib/content-dates';
import { cleanVerseField, isMostlyDevanagari, verseLines } from '@/lib/verse-format';
import { getVerseIntegrations } from '@/lib/verse-integrations';

/**
 * One static page per verse for the scriptures in VERSE_PAGE_SCRIPTURE_IDS
 * (lib/verse-paths.ts) — the Gita and principal Upanishads, which people
 * search verse by verse ("gita 2.47 meaning in hindi", "karmanye
 * vadhikaraste"). The verse body is server HTML; listen, copy, share and
 * bookmark are a small client toolbar.
 */

interface PageProps {
  params: { id: string; chapterId: string; verseId: string };
}

interface SeedVerse {
  number: number | string;
  sanskrit?: string;
  transliteration?: string;
  hindi?: string;
  translation?: string;
  explanation?: string;
  commentary?: string;
  science?: string;
  lifeLesson?: string;
}

const chapterCache = new Map<string, ReturnType<typeof readSeededChapter>>();

function loadChapter(scriptureId: string, chapterId: number) {
  const key = `${scriptureId}:${chapterId}`;
  if (!chapterCache.has(key)) chapterCache.set(key, readSeededChapter(scriptureId, chapterId));
  return chapterCache.get(key) ?? null;
}

function findVerse(scriptureId: string, chapterId: number, verseId: string) {
  const seeded = loadChapter(scriptureId, chapterId);
  if (!seeded) return null;
  const verses = seeded.chapter.verses as SeedVerse[];
  const index = verses.findIndex((verse) => verseSlug(verse.number) === verseId);
  if (index < 0) return null;
  return { seeded, verses, index, verse: verses[index] };
}

function plain(text: string | undefined, max: number): string {
  if (!text) return '';
  const flat = text.replace(/\s+/g, ' ').trim();
  return flat.length > max ? `${flat.slice(0, max - 1).trimEnd()}…` : flat;
}

/** The verse's opening words, as people type them into search. */
function opening(sanskrit: string | undefined): string {
  const first = verseLines(cleanVerseField(sanskrit))[0] ?? '';
  return plain(first, 40);
}

export function generateStaticParams() {
  return verseStaticParams();
}

export function generateMetadata({ params }: PageProps): Metadata {
  const meta = getScriptureMeta(params.id);
  const chapterId = parseInt(params.chapterId, 10);
  const found = meta && Number.isFinite(chapterId) ? findVerse(params.id, chapterId, params.verseId) : null;
  if (!meta || !found) return {};

  const ref = `${meta.title} ${chapterId}.${params.verseId}`;
  const words = opening(found.verse.sanskrit);
  const title = `${ref}${words ? ` — ${words}` : ''} | हिंदी अर्थ`;
  const description =
    [plain(found.verse.hindi, 110), plain(found.verse.translation, 110)].filter(Boolean).join(' · ') ||
    `${ref}: Sanskrit text with Hindi and English meaning.`;
  const canonical = versePageHref(meta.id, chapterId, params.verseId);
  const image = verseOgPath(meta.id, chapterId, params.verseId) ?? `/og/${meta.id}.png`;

  return {
    title: { absolute: `${title} — Dharma Granth` },
    description,
    keywords: [ref, `${ref} meaning in hindi`, `${ref} in hindi`, words, meta.titleSanskrit, 'श्लोक अर्थ'].filter(
      (k): k is string => Boolean(k),
    ),
    alternates: { canonical },
    openGraph: {
      type: 'article',
      locale: 'hi_IN',
      alternateLocale: ['en_US'],
      title,
      description,
      url: canonical,
      tags: meta.tags,
      images: [{ url: image, width: 1200, height: 630, alt: ref }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export default function VersePage({ params }: PageProps) {
  const meta = getScriptureMeta(params.id);
  if (!meta) return notFound();

  const chapterId = parseInt(params.chapterId, 10);
  if (!Number.isFinite(chapterId) || chapterId < 1) return notFound();

  const found = findVerse(params.id, chapterId, params.verseId);
  if (!found) return notFound();

  const { seeded, verses, index, verse } = found;
  const prev = index > 0 ? verses[index - 1] : undefined;
  const next = index < verses.length - 1 ? verses[index + 1] : undefined;
  const prevHref = prev ? versePageHref(meta.id, chapterId, prev.number) : undefined;
  const nextHref = next ? versePageHref(meta.id, chapterId, next.number) : undefined;
  const chapterHref = `/scripture/${meta.id}/chapter/${chapterId}`;

  const commentary = readChapterCommentary<HiCommentaryEntry>(meta.id, chapterId);
  const comment =
    commentary?.[`${chapterId}:${params.verseId}`] ?? commentary?.[`${chapterId}:${Number(params.verseId)}`];
  const explanation = comment?.explanation ?? verse.explanation ?? verse.commentary;
  const science = comment?.science ?? verse.science;
  const lesson = comment?.lifeLesson ?? verse.lifeLesson;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.in';
  const pageUrl = `${siteUrl}${versePageHref(meta.id, chapterId, params.verseId)}/`;
  const ref = `${meta.title} ${chapterId}.${params.verseId}`;
  const hindi = plain(verse.hindi, 600);
  const english = plain(verse.translation, 600);
  const modified = scriptureLastChanged(meta.id)?.toISOString();

  const questions = [
    hindi && { '@type': 'Question', name: `${ref} का हिन्दी अर्थ क्या है?`, acceptedAnswer: { '@type': 'Answer', text: hindi } },
    english && { '@type': 'Question', name: `What is the meaning of ${ref}?`, acceptedAnswer: { '@type': 'Answer', text: english } },
  ].filter(Boolean);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${pageUrl}#article`,
        headline: `${ref} — हिंदी अर्थ`,
        inLanguage: ['sa', 'hi', 'en'],
        isAccessibleForFree: true,
        ...(modified ? { dateModified: modified } : {}),
        url: pageUrl,
        mainEntityOfPage: pageUrl,
        isPartOf: {
          '@type': 'Book',
          name: meta.title,
          alternateName: meta.titleSanskrit,
          url: `${siteUrl}/scripture/${meta.id}/`,
        },
      },
      ...(questions.length > 0 ? [{ '@type': 'FAQPage', '@id': `${pageUrl}#faq`, mainEntity: questions }] : []),
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: `${siteUrl}/` },
          { '@type': 'ListItem', position: 2, name: meta.title, item: `${siteUrl}/scripture/${meta.id}/` },
          { '@type': 'ListItem', position: 3, name: `अध्याय ${chapterId}`, item: `${siteUrl}${chapterHref}/` },
          { '@type': 'ListItem', position: 4, name: `श्लोक ${params.verseId}`, item: pageUrl },
        ],
      },
    ],
  };

  const chapterName = seeded.chapter.title ?? `अध्याय ${chapterId}`;

  const integrations = getVerseIntegrations(meta.id, chapterId, params.verseId, {
    sanskrit: verse.sanskrit,
    transliteration: verse.transliteration,
    hindi: verse.hindi,
    translation: verse.translation,
    explanation,
  });

  return (
    <main className="min-h-screen bg-dharma-bg">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="border-b border-dharma-border">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link
            href={chapterHref}
            className="inline-flex min-w-0 items-center gap-2 text-sm text-dharma-muted transition hover:text-saffron-700"
          >
            <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
            <span className="truncate">
              {meta.title} · {chapterName}
            </span>
          </Link>
          <ReaderFontSize />
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 md:py-10">
        <ChapterVisitRecorder
          scriptureId={meta.id}
          scriptureTitle={meta.title}
          scriptureTitleSanskrit={meta.titleSanskrit}
          chapterId={chapterId}
          chapterTitle={chapterName}
          totalChapters={meta.totalChapters}
          verseId={params.verseId}
        />
        <header className="mb-5">
          <p lang="sa" className="font-devanagari text-sm text-saffron-700">
            {meta.titleSanskrit}
          </p>
          <h1 className="mt-1 font-serif text-2xl font-bold text-dharma-text md:text-3xl">{ref}</h1>
        </header>
        <div data-verse-read data-reader-size="normal">
          <VerseText
            verse={verse}
            chapterId={chapterId}
            actions={
              <VersePageActions
                scriptureId={meta.id}
                scriptureTitle={meta.title}
                chapterId={chapterId}
                chapterTitle={chapterName}
                verse={verse}
              />
            }
          />
        </div>

        <VerseStudyNotes
          scriptureId={meta.id}
          chapterId={chapterId}
          verseId={params.verseId}
        />

        {(explanation || science || lesson) && (
          <section className="mt-8 space-y-4" aria-label="व्याख्या">
            {[
              { title: 'व्याख्या', text: explanation, icon: Sparkles, iconClass: 'text-amber-500' },
              { title: 'विज्ञान', text: science, icon: Atom, iconClass: 'text-indigo-500' },
              { title: 'जीवन में', text: lesson, icon: Lightbulb, iconClass: 'text-emerald-500' },
            ]
              .filter((block) => block.text)
              .map((block) => {
                const hindiBlock = isMostlyDevanagari(block.text);
                const Icon = block.icon;
                return (
                  <div key={block.title} className="rounded-2xl border border-dharma-border bg-dharma-card p-5">
                    <h2 lang="hi" className="mb-2 flex items-center gap-2 font-serif text-lg font-bold text-dharma-text">
                      <Icon className={`h-5 w-5 ${block.iconClass}`} aria-hidden="true" />
                      <span>{block.title}</span>
                    </h2>
                    <p
                      lang={hindiBlock ? 'hi' : 'en'}
                      className={
                        hindiBlock
                          ? 'whitespace-pre-line font-devanagari text-base leading-loose text-dharma-text'
                          : 'whitespace-pre-line text-sm leading-relaxed text-dharma-text md:text-base'
                      }
                    >
                      {block.text}
                    </p>
                  </div>
                );
              })}
          </section>
        )}

        <VerseRelatedSection
          concepts={integrations.concepts}
          topics={integrations.topics}
          crossReferences={integrations.crossReferences}
          currentScriptureTitle={meta.title}
        />

        <nav className="mt-10 flex items-stretch justify-between gap-4" aria-label="आसपास के श्लोक">
          {prevHref && prev ? (
            <Link
              href={prevHref}
              className="inline-flex min-w-0 max-w-[48%] items-center gap-2 rounded-xl border border-dharma-border bg-dharma-card px-5 py-3 text-dharma-text transition hover:border-saffron-300"
            >
              <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-[10px] uppercase text-dharma-muted">पिछला</span>
                <span className="block text-sm font-semibold">श्लोक {String(prev.number)}</span>
                {opening(prev.sanskrit) && (
                  <span lang="sa" className="mt-0.5 block truncate font-devanagari text-xs text-dharma-muted">
                    {opening(prev.sanskrit)}
                  </span>
                )}
              </span>
            </Link>
          ) : (
            <span />
          )}
          {nextHref && next ? (
            <Link
              href={nextHref}
              className="ml-auto inline-flex min-w-0 max-w-[48%] items-center gap-2 rounded-xl bg-gradient-to-br from-saffron-600 to-saffron-700 px-5 py-3 text-white transition hover:shadow-lg"
            >
              <span className="min-w-0 text-right">
                <span className="block text-[10px] uppercase opacity-80">अगला</span>
                <span className="block text-sm font-semibold">श्लोक {String(next.number)}</span>
                {opening(next.sanskrit) && (
                  <span lang="sa" className="mt-0.5 block truncate font-devanagari text-xs text-white/80">
                    {opening(next.sanskrit)}
                  </span>
                )}
              </span>
              <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
            </Link>
          ) : (
            <Link
              href={chapterHref}
              className="ml-auto inline-flex items-center gap-2 rounded-xl border border-dharma-border bg-dharma-card px-5 py-3 text-sm font-semibold text-dharma-text transition hover:border-saffron-300"
            >
              पूरा अध्याय पढ़ें
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}
