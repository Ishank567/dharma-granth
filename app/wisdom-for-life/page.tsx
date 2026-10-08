import type { Metadata } from 'next';
import { DEFAULT_OG_IMAGE } from '@/lib/og';
import { FadeUp } from '@/app/components/motion/primitives';
import { WisdomClient } from './WisdomClient';
import Link from 'next/link';
import { Compass, BookOpen, Heart, Sparkles } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Wisdom for Life — जीवन के लिए शास्त्रीय मार्गदर्शन',
  description:
    'Discover relevant scriptural teachings from the Bhagavad Gita, Upanishads, and sacred texts for everyday life challenges — stress, fear, anger, decision-making, grief, discipline, and purpose.',
  alternates: { canonical: '/wisdom-for-life' },
  openGraph: {
    images: [DEFAULT_OG_IMAGE],
    title: 'Wisdom for Life — जीवन के लिए शास्त्रीय मार्गदर्शन — Dharma Granth',
    description:
      'Discover relevant scriptural teachings even without knowing scripture names or verse numbers. 12 life dimensions explored verse-by-verse.',
    url: 'https://dharmagranth.in/wisdom-for-life',
  },
};

export default function WisdomForLifeIndexPage() {
  return (
    <main className="min-h-screen bg-dharma-bg">
      {/* ── Hero Section ─────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-saffron-900 via-amber-900 to-stone-950 text-white py-16 sm:py-24 overflow-hidden">
        <div className="absolute inset-0 mandala-bg opacity-15" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <FadeUp>
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-200 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/15">
                <Compass className="w-3.5 h-3.5 text-amber-300" />
                शास्त्रीय जीवन-दृष्टि — Life Guidance
              </span>
              <span className="text-xs text-amber-200/80 hidden sm:inline">•</span>
              <span className="text-xs text-amber-100/90 hidden sm:inline">
                No prior scripture knowledge needed
              </span>
            </div>

            <div className="max-w-3xl">
              <p
                lang="hi"
                className="text-2xl sm:text-3xl font-devanagari font-bold text-amber-200 drop-shadow-md mb-2"
              >
                जीवन के लिए शास्त्रीय मार्गदर्शन
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white tracking-tight mb-5 leading-tight">
                Wisdom for Life
              </h1>
              <p className="text-base sm:text-lg text-amber-50/90 leading-relaxed font-normal mb-6">
                You do not need to memorize scripture names or chapter and verse coordinates to receive the profound healing clarity of ancient wisdom. Browse directly by what you are going through: stress, grief, moral dilemmas, restless focus, family duties, or the search for enduring purpose.
              </p>
            </div>

            {/* Quick feature pill highlights */}
            <div className="flex flex-wrap gap-3 sm:gap-4 pt-2 text-xs sm:text-sm text-white/85">
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/10">
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>Original Sanskrit & Literal Translations</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/10">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Traditional Context & Practical Contemplation</span>
              </div>
              <div className="flex items-center gap-2 bg-black/20 backdrop-blur-sm px-3.5 py-1.5 rounded-xl border border-white/10">
                <Heart className="w-4 h-4 text-amber-300" />
                <span>Zero Medical Diagnosis • Grounded Sources</span>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Client Search, Filters & Cards ───────────────────────── */}
      <WisdomClient />
    </main>
  );
}
