import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getBookExplanation } from '@/data/book-explanations';
import { categories } from '@/data/scripture-meta';
import { getAllScriptures } from '@/data/scriptures';
import { BookOpen, Flame, Scroll, TreePine, Scale, Heart } from 'lucide-react';
import { FadeUp, FadeUpOnView, Stagger, StaggerItem } from '@/app/components/motion/primitives';
import { ScriptureCard } from '@/app/components/motion/ScriptureCard';

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

type ListedCategory = (typeof categories)[number]['id'];

const categoryIcons: Record<ListedCategory, ReactNode> = {
  veda: <Flame className="w-5 h-5" />,
  upanishad: <BookOpen className="w-5 h-5" />,
  itihasa: <Scroll className="w-5 h-5" />,
  purana: <TreePine className="w-5 h-5" />,
  smriti: <Scale className="w-5 h-5" />,
  other: <Heart className="w-5 h-5" />,
};

export default function ScripturesPage() {
  const scriptures = getAllScriptures();

  return (
    <main className="min-h-screen bg-dharma-bg">
      <div className="bg-gradient-to-b from-saffron-800 to-saffron-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <h1 className="text-4xl font-serif font-bold mb-3">All Scriptures</h1>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="text-lg opacity-80 max-w-2xl">
              Browse the complete catalog of Hindu sacred texts. Texts marked with a star have verse-by-verse explanations available.
            </p>
          </FadeUp>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {categories.map(cat => {
          const catScriptures = scriptures.filter(s => s.category === cat.id);
          if (catScriptures.length === 0) return null;
          return (
            <section key={cat.id} id={cat.id} className="mb-14 scroll-mt-6">
              <FadeUpOnView className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-saffron-100 text-saffron-700 flex items-center justify-center">
                  {categoryIcons[cat.id]}
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-dharma-text">{cat.label}</h2>
                  <p className="text-sm text-dharma-muted">{cat.description}</p>
                </div>
              </FadeUpOnView>
              <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-5" amount={0.05}>
                {catScriptures.map(s => {
                  const explanation = getBookExplanation(s.id);
                  return (
                    <StaggerItem key={s.id}>
                      <ScriptureCard href={`/scripture/${s.id}`} className="scripture-card group">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-serif font-bold text-dharma-text group-hover:text-saffron-700 transition">
                            {s.title}
                          </h3>
                          {s.hasData && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              Explained
                            </span>
                          )}
                        </div>
                        <p lang="sa" className="text-sm text-dharma-muted font-devanagari mb-2">{s.titleSanskrit}</p>
                        <p className="text-sm text-dharma-text line-clamp-2 mb-3">{s.description}</p>
                        {explanation && (
                          <p className="text-sm text-dharma-muted font-devanagari line-clamp-2 mb-3" lang="hi">
                            {explanation.overview.hi}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-dharma-muted">
                          <span>{s.totalChapters} Chapters</span>
                          <span>{s.totalVerses.toLocaleString()} Verses</span>
                          {s.author && <span>by {s.author}</span>}
                        </div>
                      </ScriptureCard>
                    </StaggerItem>
                  );
                })}
              </Stagger>
            </section>
          );
        })}
      </div>
    </main>
  );
}
