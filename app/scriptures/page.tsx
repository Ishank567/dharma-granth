import type { Metadata } from 'next';
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
      <div className="bg-gradient-to-b from-saffron-800 to-saffron-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <h1 className="text-4xl font-serif font-bold mb-3">All Scriptures</h1>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-lg opacity-80 max-w-2xl">
              Browse the complete catalog of Hindu sacred texts. Search by title,
              author, Sanskrit name, category, or theme.
            </p>
          </FadeUp>
        </div>
      </div>

      <ScriptureLibraryClient scriptures={scriptures} categories={categories} />
    </main>
  );
}
