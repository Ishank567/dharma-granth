import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ChapterVisitRecorder } from '@/app/components/ChapterVisitRecorder';
import { RelatedTeachings } from '@/app/components/study/RelatedTeachings';
import { VerseRelatedSection } from '@/app/components/VerseRelatedSection';
import { VerseReader } from '@/app/components/reader/VerseReader';
import { SourcesAndInterpretation } from '@/app/components/SourcesAndInterpretation';
import { getScriptureMeta } from '@/data/scriptures';
import type { HiCommentaryEntry } from '@/data/hi-commentary/_types';
import { readChapterCommentary, readSeededChapter, readSeededChapterPreviews } from '@/lib/read-seeded-chapters';
import { verseStaticParams } from '@/lib/verse-pages';
import { verseOgPath, versePageHref, verseSlug } from '@/lib/verse-paths';
import { scriptureLastChanged } from '@/lib/content-dates';
import { cleanVerseField, verseLines } from '@/lib/verse-format';
import { getVerseIntegrations } from '@/lib/verse-integrations';
import { UnderstandPanel } from '@/app/components/understand/UnderstandPanel';
import { VerseCompletion } from '@/app/components/understand/VerseCompletion';
import { getUnderstandingExtras } from '@/data/understanding';
import { getPedagogicalVerse } from '@/data/pedagogical-registry';

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
  wordMeaning?: string;
  /** Set when the Hindi / English text was machine-translated. */
  hindiSource?: 'ai';
  translationSource?: 'ai';
}

/** "https://sanskritdocuments.org/doc_x/" -> "sanskritdocuments.org/doc_x" */
function repoLabel(url: string | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const u = new URL(url);
    const host = u.hostname.startsWith('www.') ? u.hostname.slice(4) : u.hostname;
    let path = u.pathname;
    while (path.endsWith('/')) path = path.slice(0, -1);
    return `${host}${path}`;
  } catch {
    return undefined;
  }
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

  const source = (seeded.source ?? {}) as { repo?: string; license?: string; fetchedAt?: string };
  const chapterLinks = readSeededChapterPreviews(meta.id).map((c) => ({
    id: c.id,
    title: c.title,
    titleSanskrit: c.titleSanskrit,
    verseCount: c.verseCount,
    href: `/scripture/${meta.id}/chapter/${c.id}`,
  }));
  const verseLinks = verses.flatMap((v) => {
    const href = versePageHref(meta.id, chapterId, v.number);
    return href ? [{ number: v.number, href }] : [];
  });

  const pedagogical = getPedagogicalVerse(meta.id, chapterId, params.verseId);

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ChapterVisitRecorder
        scriptureId={meta.id}
        scriptureTitle={meta.title}
        scriptureTitleSanskrit={meta.titleSanskrit}
        chapterId={chapterId}
        chapterTitle={chapterName}
        totalChapters={meta.totalChapters}
        verseId={params.verseId}
      />
      <VerseReader
        scriptureId={meta.id}
        scriptureTitle={meta.title}
        scriptureTitleSanskrit={meta.titleSanskrit}
        chapterId={chapterId}
        chapterTitle={chapterName}
        scriptureHref={`/scripture/${meta.id}`}
        chapterHref={chapterHref}
        pageUrl={pageUrl}
        chapters={chapterLinks}
        verses={verseLinks}
        index={Math.max(0, verseLinks.findIndex((v) => verseSlug(v.number) === params.verseId))}
        verse={{
          number: verse.number,
          sanskrit: verse.sanskrit,
          transliteration: verse.transliteration,
          wordMeaning: verse.wordMeaning,
          hindi: verse.hindi,
          translation: verse.translation,
          explanation,
          reflection: lesson,
          research: science,
        }}
        provenance={{
          sourceHost: repoLabel(source.repo),
          sourceUrl: source.repo,
          sourceLicense: source.license,
          sourceFetched: source.fetchedAt,
          hindiIsAi: verse.hindiSource === 'ai',
          englishIsAi: verse.translationSource === 'ai',
          commentaryIsAi: Boolean(comment?.ai),
          lastUpdated: modified,
        }}
        prev={prev && prevHref ? { number: prev.number, href: prevHref } : undefined}
        next={next && nextHref ? { number: next.number, href: nextHref } : undefined}
      >
        {pedagogical && (
          <UnderstandPanel
            data={pedagogical}
            extras={getUnderstandingExtras(meta.id, chapterId, params.verseId)}
            refKey={`${meta.id}:${chapterId}:${params.verseId}`}
            reference={ref}
            previousHref={prevHref}
            nextHref={nextHref}
            pageUrl={pageUrl}
          />
        )}
        <SourcesAndInterpretation
          scriptureId={meta.id}
          scriptureTitle={meta.title}
          scriptureTitleSanskrit={meta.titleSanskrit}
          chapterId={chapterId}
          verseId={params.verseId}
          editionOverride={source.repo}
          sourceUrlOverride={source.repo}
          className="mt-8"
        />
        <VerseRelatedSection
          concepts={integrations.concepts}
          topics={integrations.topics}
          crossReferences={integrations.crossReferences}
          currentScriptureTitle={meta.title}
        />
        <VerseCompletion
          reference={ref}
          readerRef={{ scriptureId: meta.id, scriptureTitle: meta.title, scriptureTitleSanskrit: meta.titleSanskrit, chapterId, chapterTitle: chapterName, url: pageUrl }}
          verse={{ number: verse.number, sanskrit: verse.sanskrit, transliteration: verse.transliteration, hindi: verse.hindi, translation: verse.translation }}
        <RelatedTeachings scriptureId={meta.id} chapterId={chapterId} verseNumber={params.verseId} />
          nextHref={nextHref}
          chapterHref={chapterHref}
        />
      </VerseReader>
    </>
  );
}
