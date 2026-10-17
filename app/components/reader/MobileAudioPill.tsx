'use client';

import { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, Play, Pause, Disc, X, Sparkles, Mic } from 'lucide-react';
import {
  isTanpuraPlaying,
  toggleTanpura,
  getTanpuraVolume,
  setTanpuraVolume,
  getTanpuraPitch,
  setTanpuraPitch,
  subscribeTanpura,
  subscribeTanpuraSettings,
  type TanpuraPitch,
} from '@/lib/tanpura-audio';
import { speakSanskritShloka, stopSanskritSpeech, isSpeakingSanskrit } from '@/lib/sacred-audio';
import { triggerTactileFeedback } from '@/lib/haptics';

interface MobileAudioPillProps {
  sanskritText?: string;
  referenceLabel?: string;
}

export function MobileAudioPill({ sanskritText, referenceLabel }: MobileAudioPillProps) {
  const [playing, setPlaying] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolume] = useState(0.45);
  const [pitch, setPitch] = useState<TanpuraPitch>('C#');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    setPlaying(isTanpuraPlaying());
    setVolume(getTanpuraVolume());
    setPitch(getTanpuraPitch());

    const unsubPlay = subscribeTanpura((st) => setPlaying(st));
    const unsubSettings = subscribeTanpuraSettings((s) => {
      setVolume(s.volume);
      setPitch(s.pitch);
    });

    const checkSpeakingInterval = setInterval(() => {
      setIsSpeaking(isSpeakingSanskrit());
    }, 400);

    return () => {
      unsubPlay();
      unsubSettings();
      clearInterval(checkSpeakingInterval);
    };
  }, []);

  const handleToggleTanpura = useCallback(() => {
    triggerTactileFeedback('selection', 'softTap');
    const newState = toggleTanpura();
    setPlaying(newState);
  }, []);

  const handleVolumeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setTanpuraVolume(val);
  }, []);

  const handlePitchSelect = useCallback((p: TanpuraPitch) => {
    triggerTactileFeedback('light', 'softTap');
    setPitch(p);
    setTanpuraPitch(p);
  }, []);

  const handleToggleSpeech = useCallback(() => {
    triggerTactileFeedback('medium', 'click');
    if (isSpeaking) {
      stopSanskritSpeech();
      setIsSpeaking(false);
    } else if (sanskritText) {
      const ok = speakSanskritShloka(
        sanskritText,
        0.85,
        () => setIsSpeaking(false),
        () => setIsSpeaking(false),
      );
      if (ok) setIsSpeaking(true);
    }
  }, [isSpeaking, sanskritText]);

  return (
    <aside
      aria-label="पवित्र नाद एवं ध्यान"
      className="fixed bottom-20 right-3.5 z-40 sm:bottom-6 sm:right-6"
    >
      {/* Expanded Control Sheet */}
      {expanded ? (
        <div className="w-72 rounded-3xl border border-dharma-border/80 bg-dharma-card/95 p-4 shadow-2xl backdrop-blur-xl transition-all">
          <div className="flex items-center justify-between pb-2.5 border-b border-dharma-border/60">
            <div className="flex items-center gap-2">
              <Disc className={`h-4 w-4 text-saffron-600 ${playing ? 'animate-spin' : ''}`} />
              <h4 className="font-serif text-sm font-bold text-dharma-text">
                <span className="font-devanagari">तन्पूरा एवं नाद</span>
              </h4>
            </div>
            <button
              type="button"
              onClick={() => {
                triggerTactileFeedback('light', 'softTap');
                setExpanded(false);
              }}
              aria-label="ध्वनि पटल बंद करें"
              className="flex h-7 w-7 items-center justify-center rounded-full text-dharma-muted hover:text-dharma-text"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Tanpura Play/Pause */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs font-medium text-dharma-muted">
              <span className="font-devanagari">शास्त्रीय तन्पूरा</span>
            </span>
            <button
              type="button"
              onClick={handleToggleTanpura}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm transition-all ${
                playing
                  ? 'border border-saffron-500 bg-saffron-600 text-white shadow-saffron-500/20'
                  : 'border border-dharma-border bg-dharma-bg text-dharma-text hover:border-saffron-400'
              }`}
            >
              {playing ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
              <span>{playing ? 'सक्रिय' : 'प्रारंभ'}</span>
            </button>
          </div>

          {/* Sanskrit Recitation */}
          {sanskritText && (
            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-xs font-medium text-dharma-muted">
                <span className="font-devanagari">श्लोक उच्चारण</span>
              </span>
              <button
                type="button"
                onClick={handleToggleSpeech}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold shadow-sm transition-all ${
                  isSpeaking
                    ? 'border border-amber-500 bg-amber-600 text-white animate-pulse'
                    : 'border border-dharma-border bg-dharma-bg text-dharma-text hover:border-amber-400'
                }`}
              >
                <Mic className="h-3.5 w-3.5" />
                <span>{isSpeaking ? 'रुकें' : 'श्रवण करें'}</span>
              </button>
            </div>
          )}

          {/* Volume Slider */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] text-dharma-muted mb-1">
              <span>ध्वनि स्तर (Volume)</span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <VolumeX className="h-3.5 w-3.5 text-dharma-muted" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.02"
                value={volume}
                onChange={handleVolumeChange}
                aria-label="तन्पूरा ध्वनि स्तर"
                className="h-1.5 w-full accent-saffron-600 cursor-pointer rounded-lg bg-dharma-border"
              />
              <Volume2 className="h-3.5 w-3.5 text-saffron-600" />
            </div>
          </div>

          {/* Pitch Preset Selectors */}
          <div className="mt-3">
            <p className="text-[11px] text-dharma-muted mb-1.5">स्वर (Pitch Tuning)</p>
            <div className="grid grid-cols-3 gap-1">
              {(['C#', 'D', 'A#'] as TanpuraPitch[]).map((p) => {
                const isSelected = pitch === p;
                const label = p === 'C#' ? 'मध्यम C#' : p === 'D' ? 'उच्च D' : 'गंभीर A#';
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePitchSelect(p)}
                    className={`rounded-lg py-1 text-[11px] font-semibold border transition-all ${
                      isSelected
                        ? 'border-saffron-500 bg-saffron-500/15 text-saffron-800 dark:text-saffron-300 font-bold'
                        : 'border-dharma-border/70 text-dharma-muted hover:text-dharma-text'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        /* Floating Unobtrusive Pill */
        <button
          type="button"
          onClick={() => {
            triggerTactileFeedback('selection', 'click');
            setExpanded(true);
          }}
          aria-label="पवित्र नाद एवं तन्पूरा खोलें"
          className={`flex h-12 w-12 items-center justify-center rounded-full border shadow-xl backdrop-blur-md transition-all active:scale-95 ${
            playing || isSpeaking
              ? 'border-saffron-500 bg-gradient-to-br from-saffron-600 to-amber-600 text-white ring-4 ring-saffron-500/25 animate-pulse'
              : 'border-dharma-border/80 bg-dharma-card/90 text-dharma-muted hover:border-saffron-400 hover:text-saffron-800 dark:hover:text-saffron-300'
          }`}
        >
          <Disc className={`h-5 w-5 ${playing ? 'animate-spin' : ''}`} />
        </button>
      )}
    </aside>
  );
}
