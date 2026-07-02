'use client';

import type { ReactNode } from 'react';

/**
 * Shared bits for the private practice dashboard tools.
 *
 * Every tool persists to localStorage under a `dharma.practice.*` key —
 * nothing ever leaves the device, there are no accounts and no rankings.
 */

/** Local-timezone ISO day (YYYY-MM-DD). `toISOString()` would use UTC and
 * roll the "day" over at the wrong moment for most users. */
export function localISODate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

/** Day-of-year (1..366), used to rotate daily prompts deterministically. */
export function dayOfYear(d: Date = new Date()): number {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.getTime() - start.getTime()) / 86_400_000);
}

/** Consistent card shell so all practice tools read as one family. */
export function ToolCard({
  icon,
  title,
  titleHindi,
  children,
  accent = 'saffron',
}: {
  icon: ReactNode;
  title: string;
  titleHindi: string;
  children: ReactNode;
  accent?: 'saffron' | 'indigo' | 'emerald' | 'rose' | 'amber';
}) {
  const accents: Record<string, string> = {
    saffron: 'from-saffron-100 to-amber-100 text-saffron-700',
    indigo: 'from-indigo-100 to-blue-100 text-indigo-700',
    emerald: 'from-emerald-100 to-green-100 text-emerald-700',
    rose: 'from-rose-100 to-pink-100 text-rose-700',
    amber: 'from-amber-100 to-yellow-100 text-amber-700',
  };
  return (
    <section className="verse-card p-6 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-10 h-10 rounded-xl bg-gradient-to-br ${accents[accent]} flex items-center justify-center shrink-0`}
        >
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-serif font-bold text-dharma-text leading-tight">{title}</h3>
          <p className="font-devanagari text-xs text-dharma-muted">{titleHindi}</p>
        </div>
      </div>
      <div className="flex-1">{children}</div>
    </section>
  );
}
