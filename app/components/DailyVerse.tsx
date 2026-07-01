'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { Sparkles, ArrowRight, BookOpen } from 'lucide-react';
import { FadeUp } from '@/app/components/motion/primitives';

interface DailyVerseData {
  sanskrit: string;
  transliteration: string;
  translation: string;
  hindi: string;
  explanation: string;
  scriptureId: string;
  scriptureTitle: string;
  chapterId: number;
  chapterTitle: string;
  verseId: number | string;
}

const DAILY_VERSES: DailyVerseData[] = [
  {
    sanskrit: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
    transliteration: 'karmaṇyevādhikāraste mā phaleṣu kadācana',
    translation: 'You have a right only to perform your duty; the fruits thereof are not your concern.',
    hindi: 'तुम्हारा अधिकार केवल कर्म करने में है, फल में कभी नहीं।',
    explanation: 'Focus on the action, not the outcome. This is the essence of Karma Yoga — performing your duty with full dedication while remaining detached from results.',
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    chapterId: 2,
    chapterTitle: 'Sankhya Yoga',
    verseId: 47,
  },
  {
    sanskrit: 'वसुधैव कुटुम्बकम्',
    transliteration: 'vasudhaiva kuṭumbakam',
    translation: 'The whole world is one family.',
    hindi: 'पूरा विश्व एक परिवार है।',
    explanation: 'From the Maha Upanishad — a vision of universal kinship that transcends borders, religions, and identities.',
    scriptureId: 'maha-upanishad',
    scriptureTitle: 'Maha Upanishad',
    chapterId: 6,
    chapterTitle: 'Chapter 6',
    verseId: 71,
  },
  {
    sanskrit: 'सत्यमेव जयते',
    transliteration: 'satyameva jayate',
    translation: 'Truth alone triumphs.',
    hindi: 'सत्य की ही विजय होती है।',
    explanation: 'From the Mundaka Upanishad — the enduring power of truth over falsehood, a principle that guides ethical living.',
    scriptureId: 'mundaka-upanishad',
    scriptureTitle: 'Mundaka Upanishad',
    chapterId: 3,
    chapterTitle: 'Chapter 3',
    verseId: 6,
  },
  {
    sanskrit: 'अहं ब्रह्मास्मि',
    transliteration: 'ahaṃ brahmāsmi',
    translation: 'I am Brahman — the infinite consciousness.',
    hindi: 'मैं ही ब्रह्म हूँ।',
    explanation: 'From the Brihadaranyaka Upanishad — the great declaration of non-dualism, identifying the individual self with the universal consciousness.',
    scriptureId: 'brihadaranyaka-upanishad',
    scriptureTitle: 'Brihadaranyaka Upanishad',
    chapterId: 1,
    chapterTitle: 'Chapter 1',
    verseId: 10,
  },
  {
    sanskrit: 'योगः कर्मसु कौशलम्',
    transliteration: 'yogaḥ karmasu kauśalam',
    translation: 'Yoga is skill in action.',
    hindi: 'योग कर्मों में कौशल है।',
    explanation: 'Excellence in performing duties with complete focus and detachment from results — this is the practical definition of Yoga.',
    scriptureId: 'bhagavadgita',
    scriptureTitle: 'Bhagavad Gita',
    chapterId: 2,
    chapterTitle: 'Sankhya Yoga',
    verseId: 50,
  },
  {
    sanskrit: 'तत्त्वमसि',
    transliteration: 'tat tvam asi',
    translation: 'That Thou Art — you are the infinite.',
    hindi: 'तत् त्वम् असि — तुम्ही वह हो।',
    explanation: 'From the Chandogya Upanishad — one of the four Mahavakyas (great declarations), pointing to the identity of the individual self with the universal Self.',
    scriptureId: 'chandogya-upanishad',
    scriptureTitle: 'Chandogya Upanishad',
    chapterId: 6,
    chapterTitle: 'Chapter 6',
    verseId: 8,
  },
  {
    sanskrit: 'ॐ पूर्णमदः पूर्णमिदम्',
    transliteration: 'oṃ pūrṇamadaḥ pūrṇamidam',
    translation: 'OM. That is full; this is full. From fullness, fullness comes.',
    hindi: 'ॐ। वह पूर्ण है, यह पूर्ण है। पूर्ण से ही पूर्ण निकलता है।',
    explanation: 'The Isha Upanishad invocation — a meditation on the infinite nature of reality, where taking fullness from fullness still leaves fullness.',
    scriptureId: 'isha-upanishad',
    scriptureTitle: 'Isha Upanishad',
    chapterId: 1,
    chapterTitle: 'Invocation',
    verseId: 1,
  },
];

function getDayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86_400_000);
}

export function DailyVerse() {
  const reduce = useReducedMotion();
  const verse = useMemo(() => {
    const dayIndex = getDayOfYear() % DAILY_VERSES.length;
    return DAILY_VERSES[dayIndex];
  }, []);

  const verseUrl = `/scripture/${verse.scriptureId}/chapter/${verse.chapterId}?verse=${verse.verseId}`;

  return (
    <FadeUp>
      <div className="relative overflow-hidden rounded-3xl border border-saffron-200 bg-gradient-to-br from-saffron-50 via-amber-50 to-orange-50 p-8 md:p-10 shadow-lg">
        {/* Decorative mandala */}
        <div className="absolute inset-0 mandala-bg opacity-[0.04] pointer-events-none" />

        <div className="relative">
          <div className="flex items-center gap-2 mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron-100 text-saffron-800 text-xs font-bold uppercase tracking-wider border border-saffron-200">
              <Sparkles className="w-3.5 h-3.5" />
              Verse of the Day
            </span>
            <span className="text-xs text-dharma-muted">
              {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
            </span>
          </div>

          <p lang="sa" className="font-devanagari text-3xl md:text-4xl text-saffron-800 mb-4 leading-relaxed">
            {verse.sanskrit}
          </p>

          <p className="text-base text-saffron-600 italic mb-4">
            {verse.transliteration}
          </p>

          <div className="w-12 h-px bg-saffron-300 mb-4" />

          <p className="text-lg text-dharma-text mb-2 leading-relaxed">
            {verse.translation}
          </p>
          <p lang="hi" className="text-sm text-rose-800 font-devanagari mb-4">
            {verse.hindi}
          </p>

          <p className="text-sm text-dharma-muted leading-relaxed mb-6 max-w-2xl">
            {verse.explanation}
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs font-semibold text-saffron-700 uppercase tracking-wider">
              {verse.scriptureTitle} • {verse.chapterTitle} • Verse {verse.verseId}
            </span>
            <Link
              href={verseUrl}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-saffron-600 to-amber-600 text-white text-sm font-bold hover:from-saffron-700 hover:to-amber-700 transition shadow-md hover:shadow-lg"
            >
              <BookOpen className="w-4 h-4" />
              Study this verse
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </FadeUp>
  );
}
