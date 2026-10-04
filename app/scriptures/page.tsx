import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { getBookExplanation } from '@/data/book-explanations';
import { categories } from '@/data/scripture-meta';
import { getAllScriptures } from '@/data/scriptures';
import { FadeUp } from '@/app/components/motion/primitives';
import { ScriptureLibraryClient } from '@/app/components/ScriptureLibraryClient';

export const metadata: Metadata = {
  title: 'All Scriptures',
  description:
    'The full library of Hindu sacred texts catalogued at Dharma Granth — Vedas, Upanishads, Itihasas, Puranas, Smritis, and more. Texts with verse-by-verse explanations are marked.',
  alternates: { canonical: '/scriptures' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    type: 'website',
    title: 'All Scriptures — Dharma Granth',
    description:
      'Browse the full library of Hindu sacred texts, organized by category. Verse-by-verse explanations available for selected scriptures.',
    url: '/scriptures',
  },
};

export default function ScripturesPage() {
  const scriptures = getAllScriptures().map((scripture) => ({
    ...scripture,
    explanation: getBookExplanation(scripture.id),
  }));

  return (
    <main className="min-h-screen bg-dharma-bg">
      {/* Inspora-inspired Archival Gallery Header */}
      <div className="border-b border-dharma-border/80 bg-dharma-card/60 backdrop-blur-sm py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <div className="flex items-center gap-2 mb-3">
              <span className="size-2 rounded-full bg-saffron-600 animate-status-pulse" />
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-saffron-700 dark:text-saffron-400">
                The Sacred Archive
              </span>
            </div>
            <h1 className="text-3xl font-serif font-bold text-dharma-text sm:text-5xl tracking-tight">
              All Scriptures
            </h1>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="mt-3 text-base text-dharma-muted sm:text-lg max-w-2xl leading-relaxed">
              A curated catalog of Hindu sacred texts — Vedas, Upanishads, Itihasas, and Puranas, indexed for verse-by-verse study, original Sanskrit recitation, and commentary.
            </p>
          </FadeUp>
        </div>
      </div>

      <ScriptureLibraryClient scriptures={scriptures} categories={categories} />
    </main>
  );
}
