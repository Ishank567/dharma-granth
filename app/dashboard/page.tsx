'use client';

import Link from 'next/link';
import { Flame, BookOpen, Bookmark, Award, ArrowRight, TrendingUp, FolderOpen, Highlighter, StickyNote } from 'lucide-react';
import { useStudyProgress } from '@/lib/useStudyProgress';
import { DailyVerse } from '@/app/components/DailyVerse';
import { FadeUp, FadeUpOnView, Stagger, StaggerItem } from '@/app/components/motion/primitives';
import { pathways } from '@/data/pathways';
import { quizzes } from '@/data/quizzes';

export default function DashboardPage() {
  const progress = useStudyProgress();

  if (!progress.hydrated) {
    return (
      <main className="min-h-screen bg-dharma-bg flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-saffron-200 border-t-saffron-600" />
      </main>
    );
  }

  const { streak, collections, notes, highlights, pathwayProgress, quizResults } = progress;

  // Calculate pathway completion stats
  const pathwayStats = pathways.map((p) => {
    const pp = pathwayProgress.find((pp) => pp.pathwayId === p.id);
    const completed = pp?.completedSteps.length ?? 0;
    const total = p.steps.length;
    const pct = Math.round((completed / total) * 100);
    const isComplete = pct === 100;
    return { ...p, completed, total, pct, isComplete };
  });

  const completedPathways = pathwayStats.filter((p) => p.isComplete).length;
  const inProgressPathways = pathwayStats.filter((p) => p.completed > 0 && !p.isComplete).length;

  return (
    <main className="min-h-screen bg-dharma-bg">
      {/* Header */}
      <section className="bg-gradient-to-br from-saffron-900 via-saffron-800 to-amber-900 text-white py-14">
        <div className="max-w-6xl mx-auto px-6">
          <FadeUp>
            <p className="text-xs font-semibold uppercase tracking-widest text-saffron-200 mb-2">
              Your Study Dashboard
            </p>
            <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3">
              Welcome back, seeker 🙏
            </h1>
            <p className="text-lg opacity-90 max-w-2xl">
              Track your reading streaks, continue your learning pathways, and revisit your saved verses.
            </p>
          </FadeUp>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
        {/* Stats Row */}
        <FadeUpOnView>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Streak */}
            <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-saffron-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Flame className="w-5 h-5 text-saffron-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-saffron-700">Streak</span>
              </div>
              <p className="text-3xl font-bold text-dharma-text">{streak.currentStreak}</p>
              <p className="text-xs text-dharma-muted">days • best: {streak.longestStreak}</p>
            </div>

            {/* Total Days Read */}
            <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Total Days</span>
              </div>
              <p className="text-3xl font-bold text-dharma-text">{streak.totalDaysRead}</p>
              <p className="text-xs text-dharma-muted">days studied</p>
            </div>

            {/* Bookmarks */}
            <Link href="/bookmarks" className="rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-200 p-5 shadow-sm hover:shadow-md transition group">
              <div className="flex items-center gap-2 mb-2">
                <Bookmark className="w-5 h-5 text-rose-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-rose-700">Bookmarks</span>
              </div>
              <p className="text-3xl font-bold text-dharma-text">
                {collections.reduce((acc, c) => acc + c.verseRefs.length, 0) > 0
                  ? collections.reduce((acc, c) => acc + c.verseRefs.length, 0)
                  : '—'}
              </p>
              <p className="text-xs text-dharma-muted group-hover:text-rose-600 transition">saved verses</p>
            </Link>

            {/* Notes */}
            <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <StickyNote className="w-5 h-5 text-indigo-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Notes</span>
              </div>
              <p className="text-3xl font-bold text-dharma-text">{notes.length}</p>
              <p className="text-xs text-dharma-muted">personal reflections</p>
            </div>
          </div>
        </FadeUpOnView>

        {/* Daily Verse */}
        <DailyVerse />

        {/* Learning Pathways */}
        <FadeUpOnView>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-serif font-bold text-dharma-text mb-1">
                Your Learning Pathways
              </h2>
              <p className="text-sm text-dharma-muted">
                {completedPathways} completed • {inProgressPathways} in progress • {pathways.length - completedPathways - inProgressPathways} not started
              </p>
            </div>
            <Link
              href="/learn/pathways"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-saffron-700 hover:text-saffron-800 transition"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <Stagger className="grid md:grid-cols-2 gap-4">
            {pathwayStats.slice(0, 4).map((p) => (
              <StaggerItem key={p.id}>
                <Link
                  href="/learn/pathways"
                  className="block rounded-2xl border border-dharma-border bg-dharma-card p-5 hover:shadow-lg hover:border-saffron-300 transition group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{p.icon}</span>
                      <div>
                        <h3 className="text-base font-serif font-bold text-dharma-text group-hover:text-saffron-700 transition">
                          {p.title}
                        </h3>
                        {p.titleSanskrit && (
                          <p lang="sa" className="font-devanagari text-sm text-saffron-600">
                            {p.titleSanskrit}
                          </p>
                        )}
                      </div>
                    </div>
                    {p.isComplete && (
                      <Award className="w-5 h-5 text-saffron-500 flex-shrink-0" />
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-dharma-border rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full bg-gradient-to-r ${p.gradient} transition-all`}
                      style={{ width: `${p.pct}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs text-dharma-muted">
                    <span>{p.completed} / {p.total} steps</span>
                    <span className="font-semibold">{p.pct}%</span>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </FadeUpOnView>

        {/* Quick Access Row */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Collections */}
          <FadeUpOnView>
            <Link href="/collections" className="block rounded-2xl border border-dharma-border bg-dharma-card p-6 hover:shadow-lg hover:border-saffron-300 transition group h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-100 to-amber-100 text-saffron-700 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-dharma-text group-hover:text-saffron-700 transition">
                    Study Collections
                  </h3>
                  <p className="text-xs text-dharma-muted">{collections.length} collections</p>
                </div>
              </div>
              <p className="text-sm text-dharma-muted leading-relaxed">
                Organize your saved verses into thematic collections for easy reference and deeper study.
              </p>
            </Link>
          </FadeUpOnView>

          {/* Highlights */}
          <FadeUpOnView>
            <Link href="/collections" className="block rounded-2xl border border-dharma-border bg-dharma-card p-6 hover:shadow-lg hover:border-saffron-300 transition group h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-yellow-100 text-amber-700 flex items-center justify-center">
                  <Highlighter className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-dharma-text group-hover:text-saffron-700 transition">
                    Highlights
                  </h3>
                  <p className="text-xs text-dharma-muted">{highlights.length} highlighted verses</p>
                </div>
              </div>
              <p className="text-sm text-dharma-muted leading-relaxed">
                Color-code verses that resonate with you. Quickly find them across all scriptures.
              </p>
            </Link>
          </FadeUpOnView>

          {/* Quizzes */}
          <FadeUpOnView>
            <Link href="/learn" className="block rounded-2xl border border-dharma-border bg-dharma-card p-6 hover:shadow-lg hover:border-saffron-300 transition group h-full">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-serif font-bold text-dharma-text group-hover:text-saffron-700 transition">
                    Quizzes
                  </h3>
                  <p className="text-xs text-dharma-muted">{quizResults.length} taken • {quizzes.length} available</p>
                </div>
              </div>
              <p className="text-sm text-dharma-muted leading-relaxed">
                Test your knowledge with interactive quizzes on the Gita, Upanishads, Dharma, and Yoga.
              </p>
            </Link>
          </FadeUpOnView>
        </div>
      </div>
    </main>
  );
}
