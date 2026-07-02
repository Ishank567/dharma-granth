'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CalendarDays, ArrowRight } from 'lucide-react';
import { upcomingFestivals, type UpcomingFestival } from '@/data/festival-dates';
import { ToolCard } from './shared';

/**
 * Upcoming festivals and observances. Computed on the client after mount so
 * the static export never bakes in a build-time "today". Dates follow the
 * lunar calendar and are approximate — the card says so.
 */
export function FestivalReminder() {
  const [upcoming, setUpcoming] = useState<UpcomingFestival[] | null>(null);

  useEffect(() => {
    setUpcoming(upcomingFestivals(4));
  }, []);

  function daysLabel(days: number): string {
    if (days === 0) return 'आज · today';
    if (days === 1) return 'कल · tomorrow';
    return `${days} days`;
  }

  return (
    <ToolCard icon={<CalendarDays className="w-5 h-5" />} title="Festival Reminders" titleHindi="आगामी उत्सव" accent="amber">
      <div className="flex flex-col gap-2 h-full">
        {upcoming === null ? (
          <p className="text-sm text-dharma-muted">Loading…</p>
        ) : upcoming.length === 0 ? (
          <p className="text-sm text-dharma-muted">No upcoming dates in the calendar yet.</p>
        ) : (
          <ul className="space-y-2 flex-1">
            {upcoming.map((f) => (
              <li
                key={`${f.name}-${f.date}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-dharma-border p-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-dharma-text truncate">
                    {f.nameHindi ? <span className="font-devanagari">{f.nameHindi}</span> : f.name}
                  </p>
                  <p className="text-xs text-dharma-muted truncate">{f.name}{f.note ? ` — ${f.note}` : ''}</p>
                </div>
                <span
                  className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    f.daysAway <= 1
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-dharma-panel-muted text-dharma-muted'
                  }`}
                >
                  {daysLabel(f.daysAway)}
                </span>
              </li>
            ))}
          </ul>
        )}
        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-dharma-muted">Lunar dates are approximate — confirm with a local pañcāṅga.</p>
          <Link
            href="/festivals"
            className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800"
          >
            All festivals <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </ToolCard>
  );
}
