'use client';

import React, { useMemo } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle2, ChevronRight, Award, Compass, ArrowUpRight } from 'lucide-react';
import type { ChapterVisit } from '@/lib/reading-history';

interface Props {
  totalVersesRead: number;
  recentChapters: ChapterVisit[];
}

interface ScriptureTrack {
  id: string;
  titleHi: string;
  titleEn: string;
  totalChapters: number;
  totalVerses: number;
  href: string;
  accentGradient: string;
}

const CANONICAL_TRACKS: ScriptureTrack[] = [
  {
    id: 'bhagavadgita',
    titleHi: 'श्रीमद्भगवद्गीता',
    titleEn: 'Bhagavad Gita',
    totalChapters: 18,
    totalVerses: 700,
    href: '/scripture/bhagavadgita',
    accentGradient: 'from-amber-500 to-orange-600',
  },
  {
    id: 'upanishads',
    titleHi: 'प्रमुख उपनिषद्',
    titleEn: 'Principal Upanishads',
    totalChapters: 10,
    totalVerses: 1188,
    href: '/scriptures',
    accentGradient: 'from-orange-500 to-saffron-600',
  },
  {
    id: 'ashtavakra-gita',
    titleHi: 'अष्टावक्र गीता',
    titleEn: 'Ashtavakra Gita',
    totalChapters: 20,
    totalVerses: 298,
    href: '/ashtavakra',
    accentGradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'ishavasya',
    titleHi: 'ईशावास्योपनिषद्',
    titleEn: 'Isha Upanishad',
    totalChapters: 1,
    totalVerses: 18,
    href: '/scripture/ishavasya',
    accentGradient: 'from-indigo-500 to-purple-600',
  },
];

export function ScriptureCompletionCard({ totalVersesRead, recentChapters }: Props) {
  // Count unique chapters visited per scripture track
  const progressMap = useMemo(() => {
    const map: Record<string, Set<number>> = {
      'bhagavad-gita': new Set(),
      'upanishads': new Set(),
      'ashtavakra-gita': new Set(),
      'ramayana': new Set(),
    };

    recentChapters.forEach((visit) => {
      const sId = visit.scriptureId.toLowerCase();
      if (sId.includes('gita') && !sId.includes('ashtavakra')) {
        map['bhagavad-gita']?.add(visit.chapterId);
      } else if (sId.includes('upanishad') || ['isha', 'kena', 'katha', 'prashna', 'mundaka', 'mandukya', 'taittiriya', 'aitareya', 'chandogya', 'brihadaranyaka'].some(u => sId.includes(u))) {
        map['upanishads']?.add(visit.chapterId);
      } else if (sId.includes('ashtavakra')) {
        map['ashtavakra-gita']?.add(visit.chapterId);
      } else if (sId.includes('ramayana')) {
        map['ramayana']?.add(visit.chapterId);
      }
    });

    return map;
  }, [recentChapters]);

  const totalScripturesExplored = useMemo(() => {
    const unique = new Set(recentChapters.map((v) => v.scriptureId));
    return unique.size;
  }, [recentChapters]);

  return (
    <section aria-labelledby="scripture-completion-heading" className="w-full">
      <div className="rounded-3xl border border-dharma-border bg-dharma-card p-6 sm:p-8 shadow-sm space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-dharma-border/60 pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1 rounded-md bg-saffron-500/10 text-saffron-600 dark:text-saffron-400">
                <BookOpen className="w-4 h-4" />
              </span>
              <span className="text-2xs font-bold uppercase tracking-wider text-saffron-700 dark:text-saffron-300">
                स्वाध्याय विस्तार · Scripture Mastery
              </span>
            </div>
            <h2 id="scripture-completion-heading" className="text-2xl font-serif font-bold text-dharma-text">
              शास्त्र स्वाध्याय एवं पूर्णता
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-2xs text-dharma-muted uppercase tracking-wider font-semibold">
                कुल पढ़े गए श्लोक
              </p>
              <p className="text-xl sm:text-2xl font-bold font-serif text-saffron-700 dark:text-saffron-300">
                {totalVersesRead} श्लोक
              </p>
            </div>
          </div>
        </div>

        {/* Canonical Scriptures Progress Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CANONICAL_TRACKS.map((track) => {
            const visitedCount = progressMap[track.id]?.size || 0;
            const pct = Math.min(
              100,
              Math.max(
                visitedCount > 0 ? 8 : 0,
                Math.round((visitedCount / track.totalChapters) * 100)
              )
            );

            return (
              <div
                key={track.id}
                className="group relative rounded-2xl border border-dharma-border/70 bg-dharma-panel/40 p-4 transition hover:border-saffron-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-base font-serif font-bold text-dharma-text group-hover:text-saffron-700 dark:group-hover:text-saffron-300 transition">
                      {track.titleHi}
                    </h3>
                    <p className="text-xs text-dharma-muted">
                      {track.titleEn} · {track.totalChapters} अध्याय ({track.totalVerses} श्लोक)
                    </p>
                  </div>

                  <Link
                    href={track.href}
                    aria-label={`पठन जारी रखें: ${track.titleHi}`}
                    className="p-1.5 rounded-lg border border-dharma-border/60 bg-dharma-card text-dharma-muted hover:text-saffron-600 hover:border-saffron-300 transition"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-2xs text-dharma-muted">
                    <span>
                      {visitedCount > 0
                        ? `${visitedCount} / ${track.totalChapters} अध्याय अध्ययन किए`
                        : 'अभी आरंभ नहीं हुआ'}
                    </span>
                    <span className="font-bold text-dharma-text">{pct}%</span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-dharma-border/60 overflow-hidden">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${track.accentGradient} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Explorer CTA */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-dharma-muted border-t border-dharma-border/50">
          <p>
            आपने अब तक <strong className="text-dharma-text font-bold">{totalScripturesExplored} ग्रंथों</strong> के अध्यायों का अध्ययन किया है।
          </p>

          <Link
            href="/scriptures"
            className="inline-flex items-center gap-1 font-semibold text-saffron-700 dark:text-saffron-300 hover:underline"
          >
            <span>सभी ६५ ग्रंथ देखें</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
