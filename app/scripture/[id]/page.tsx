import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { BookLearningClient } from '@/app/components/BookLearningClient';
import { ChapterHero } from '@/app/components/motion/ChapterHero';
import { FadeUp, FadeUpOnView } from '@/app/components/motion/primitives';
import { getBookExplanation } from '@/data/book-explanations';
import { getScripture, getScriptureMeta, getAllScriptures } from '@/data/scriptures';
import { ArrowLeft } from 'lucide-react';

interface PageProps {
  params: { id: string };
}

export function generateStaticParams() {
  return getAllScriptures().map(s => ({ id: s.id }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const meta = getScriptureMeta(params.id);
  if (!meta) return {};

  const title = `${meta.title} — Verse by Verse`;
  const description = meta.hasData
    ? `${meta.title} (${meta.titleSanskrit}) — Sanskrit, transliteration, translation, and verse-by-verse commentary in Hindi and English. ${meta.description}`
    : `${meta.title} (${meta.titleSanskrit}) in our growing library. ${meta.description}`;

  const ogImage = {
    url: `/og/${meta.id}.png`,
    width: 1200,
    height: 630,
    alt: `${meta.title} — Dharma Granth`,
  };

  return {
    title,
    description,
    alternates: { canonical: `/scripture/${meta.id}` },
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/scripture/${meta.id}`,
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

export default function ScripturePage({ params }: PageProps) {
  const meta = getScriptureMeta(params.id);
  if (!meta) return notFound();

  const scripture = getScripture(params.id);
  const chapters = scripture?.chapters ?? [];
  const explanation = getBookExplanation(params.id);
  const chapterPreviews = chapters.map(chapter => ({
    id: chapter.id,
    title: chapter.title,
    titleSanskrit: chapter.titleSanskrit,
    summary: chapter.summary,
    verseCount: chapter.verses.length,
  }));

  // JSON-LD structured data: emit a Book entity for any catalog entry, with workExample
  // pointing to a Chapter entity for chapters that actually have verse data.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dharmagranth.example';
  const workExample =
    meta.hasData && scripture
      ? scripture.chapters
          .filter(ch => ch.verses.length > 0)
          .map(ch => ({
            '@type': 'Chapter' as const,
            name: ch.title,
            alternateName: ch.titleSanskrit,
            position: ch.id,
            url: `${siteUrl}/scripture/${meta.id}/chapter/${ch.id}`,
          }))
      : undefined;
  const bookJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    '@id': `${siteUrl}/scripture/${meta.id}`,
    name: meta.title,
    alternateName: meta.titleSanskrit,
    inLanguage: ['sa', 'hi', 'en'],
    description: meta.description,
    genre: meta.category,
    keywords: meta.tags.join(', '),
    publisher: { '@type': 'Organization', name: 'Dharma Granth' },
    isAccessibleForFree: true,
  };
  if (meta.author) {
    bookJsonLd.author = { '@type': 'Person', name: meta.author };
  }
  if (workExample && workExample.length > 0) {
    bookJsonLd.workExample = workExample;
  }
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Scriptures', item: `${siteUrl}/scriptures` },
      { '@type': 'ListItem', position: 3, name: meta.title, item: `${siteUrl}/scripture/${meta.id}` },
    ],
  };

  return (
    <main className="min-h-screen bg-dharma-bg">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(bookJsonLd) }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ChapterHero className="bg-gradient-to-b from-saffron-800 to-saffron-600 text-white py-14">
        <div className="relative max-w-5xl mx-auto px-6">
          <FadeUp>
            <Link href="/scriptures" className="inline-flex items-center gap-2 text-white/70 hover:text-white text-sm mb-6 transition">
              <ArrowLeft className="w-4 h-4" />
              All Scriptures
            </Link>
          </FadeUp>
          <FadeUp delay={0.05} className="flex items-center gap-3 mb-3">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 uppercase tracking-wide">
              {meta.category}
            </span>
            {meta.hasData && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-400/30 text-green-100">
                Verse Explanations Available
              </span>
            )}
          </FadeUp>
          <FadeUp delay={0.1}>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2">{meta.title}</h1>
          </FadeUp>
          <FadeUp delay={0.15}>
            <p lang="sa" className="text-xl font-devanagari opacity-80 mb-4">{meta.titleSanskrit}</p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-lg opacity-80 max-w-3xl">{meta.description}</p>
            {meta.author && <p className="mt-3 text-sm opacity-60">Attributed to {meta.author}</p>}
          </FadeUp>
        </div>
      </ChapterHero>

      <FadeUpOnView className="max-w-5xl mx-auto px-6 py-12">
        <BookLearningClient meta={meta} explanation={explanation} chapters={chapterPreviews} />
      </FadeUpOnView>
    </main>
  );
}
