'use client';

import { usePerformanceMode } from '@/lib/performance-mode';
import { Gauge, Zap, ZapOff } from 'lucide-react';

export function PerformanceToggle({ className = '' }: { className?: string }) {
  const { isDataSaver, isLowPower, isReadingLite, setReadingLite, toggleDataSaver, toggleLowPower } = usePerformanceMode();

  return (
    <div className={`flex flex-wrap items-center gap-2 text-xs ${className}`}>
      <button
        type="button"
        onClick={() => setReadingLite(!isReadingLite)}
        className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 ${
          isReadingLite
            ? 'border-saffron-600 bg-saffron-600/10 text-saffron-800 dark:text-saffron-300'
            : 'border-dharma-border bg-dharma-card text-dharma-muted hover:border-saffron-300 hover:text-dharma-text'
        }`}
        aria-pressed={isReadingLite}
        title="Turns off 3D, animation, decorative images and large effects. All text and study features stay."
      >
        <span>Reading Lite: {isReadingLite ? 'on' : 'off'}</span>
      </button>
      <button
        type="button"
        onClick={toggleDataSaver}
        className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 ${
          isDataSaver
            ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
            : 'border-dharma-border bg-dharma-card text-dharma-muted hover:border-saffron-300 hover:text-dharma-text'
        }`}
        aria-pressed={isDataSaver}
        aria-label={isDataSaver ? 'डेटा-बचत मोड सक्रिय (Data saver active)' : 'डेटा-बचत मोड चालू करें (Enable data saver)'}
        title="डेटा व नेटवर्क बचत मोड (Data Saver Mode)"
      >
        <Gauge className="h-3.5 w-3.5" aria-hidden="true" />
        <span>डेटा बचत: {isDataSaver ? 'चालू' : 'बंद'}</span>
      </button>

      <button
        type="button"
        onClick={toggleLowPower}
        className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 ${
          isLowPower
            ? 'border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300'
            : 'border-dharma-border bg-dharma-card text-dharma-muted hover:border-saffron-300 hover:text-dharma-text'
        }`}
        aria-pressed={isLowPower}
        aria-label={isLowPower ? 'कम ऊर्जा मोड सक्रिय (Low power active)' : 'कम ऊर्जा मोड चालू करें (Enable low power mode)'}
        title="कम बैटरी व सरल रेंडरिंग मोड (Low Power Mode)"
      >
        {isLowPower ? (
          <Zap className="h-3.5 w-3.5 fill-current text-amber-500" aria-hidden="true" />
        ) : (
          <ZapOff className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        <span>कम ऊर्जा: {isLowPower ? 'चालू' : 'बंद'}</span>
      </button>
    </div>
  );
}
