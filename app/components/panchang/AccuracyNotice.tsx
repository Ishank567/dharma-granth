'use client';

import React, { useState } from 'react';
import { AlertTriangle, ChevronDown, ChevronUp, Compass, Globe, Info, Sparkles, Sun } from 'lucide-react';

interface AccuracyNoticeProps {
  onOpenDataSourceModal?: () => void;
  className?: string;
}

export function AccuracyNotice({
  onOpenDataSourceModal,
  className = '',
}: AccuracyNoticeProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section
      aria-labelledby="panchang-accuracy-heading"
      className={`rounded-2xl border border-amber-500/25 bg-amber-500/5 p-4 sm:p-5 dark:border-amber-500/20 dark:bg-amber-950/20 ${className}`}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700 dark:text-amber-300">
            <Info className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 dark:text-amber-300">
                शैक्षणिक पंचांग · Educational Calendar Notice
              </span>
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-900 dark:text-amber-200">
                Non-Ritual Study Standard
              </span>
            </div>
            <h2
              id="panchang-accuracy-heading"
              className="mt-0.5 font-serif text-base font-bold text-dharma-text sm:text-lg"
            >
              Why Panchang timings vary across locations and traditions
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-dharma-muted max-w-3xl leading-relaxed">
              Dharma Granth Panchang is designed for contemplative study and scriptural cadence,
              not as an authoritative ritual calculator. Exact Panchang values depend directly
              on 5 geographical and mathematical factors.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-expanded={isExpanded}
            aria-controls="accuracy-factors-content"
            className="inline-flex items-center gap-1.5 rounded-lg border border-dharma-border bg-dharma-card px-3 py-1.5 text-xs font-semibold text-dharma-text shadow-sm hover:border-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition"
          >
            <span>{isExpanded ? 'Hide Details' : 'View 5 Factors'}</span>
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div
          id="accuracy-factors-content"
          className="mt-4 pt-4 border-t border-amber-500/20 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 animate-fadeIn"
        >
          <div className="rounded-xl border border-dharma-border bg-dharma-card/80 p-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-dharma-text">
              <Globe className="h-4 w-4 text-saffron-600" />
              <span>1. Geographic Location</span>
            </div>
            <p className="mt-1.5 text-xs text-dharma-muted leading-relaxed">
              Every city sits at a unique latitude and longitude. The Moon&apos;s apparent position
              and the exact time it touches a nakshatra border shifts with the observer&apos;s horizon.
            </p>
          </div>

          <div className="rounded-xl border border-dharma-border bg-dharma-card/80 p-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-dharma-text">
              <Sun className="h-4 w-4 text-amber-500" />
              <span>2. Local Astronomical Sunrise</span>
            </div>
            <p className="mt-1.5 text-xs text-dharma-muted leading-relaxed">
              In classical Smarta tradition, a day&apos;s tithi is determined by whichever tithi
              prevails at local astronomical sunrise (Udaya Tithi). An Ekadashi at sunrise in Varanasi
              may fall on a different civil day in London or New York.
            </p>
          </div>

          <div className="rounded-xl border border-dharma-border bg-dharma-card/80 p-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-dharma-text">
              <Compass className="h-4 w-4 text-indigo-500" />
              <span>3. Timezone & Civil Day</span>
            </div>
            <p className="mt-1.5 text-xs text-dharma-muted leading-relaxed">
              Civil time zones (such as UTC offsets and daylight savings) partition continuous
              planetary movement into human clock hours. Transitions crossing midnight alter the
              apparent date.
            </p>
          </div>

          <div className="rounded-xl border border-dharma-border bg-dharma-card/80 p-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-dharma-text">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>4. Calculation Method</span>
            </div>
            <p className="mt-1.5 text-xs text-dharma-muted leading-relaxed">
              Modern observatories rely on <em>Drik Siddhanta</em> (observational ephemeris),
              while traditional almanacs may use mathematical formulas from the <em>Surya Siddhanta</em>.
              Both traditions differ by several hours on specific transitions.
            </p>
          </div>

          <div className="rounded-xl border border-dharma-border bg-dharma-card/80 p-3.5">
            <div className="flex items-center gap-2 text-xs font-bold text-dharma-text">
              <Compass className="h-4 w-4 text-rose-500" />
              <span>5. Ayanamsha (Precession)</span>
            </div>
            <p className="mt-1.5 text-xs text-dharma-muted leading-relaxed">
              The astronomical offset between the moving Tropical equinox and the fixed Sidereal
              zodiac. We employ the government-endorsed <strong>Chitra Paksha (Lahiri)</strong> standard (~24.2°),
              yet schools such as KP or Raman use slightly different values.
            </p>
          </div>

          <div className="rounded-xl border border-dashed border-amber-500/40 bg-amber-500/10 p-3.5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>Graceful Unavailable Policy</span>
              </div>
              <p className="mt-1.5 text-xs text-dharma-muted leading-relaxed">
                If precise local horizon parameters are unverified, we display an honest
                unavailable state instead of placeholder estimates. Truthfulness (satya) comes first.
              </p>
            </div>
            {onOpenDataSourceModal && (
              <button
                type="button"
                onClick={onOpenDataSourceModal}
                className="mt-3 text-left text-xs font-semibold text-saffron-700 dark:text-saffron-400 hover:underline"
              >
                Read full data-source methodology &rarr;
              </button>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
