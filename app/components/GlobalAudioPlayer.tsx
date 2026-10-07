'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Gauge, Pause, Play, Repeat, Volume2, X } from 'lucide-react';
import {
  getRecitationLoop,
  getRecitationSpeed,
  getRecitationState,
  pauseRecitation,
  resumeRecitation,
  setRecitationSpeed,
  stopRecitation,
  subscribeRecitation,
  subscribeRecitationConfig,
  toggleRecitationLoop,
  type RecitationState,
} from '@/lib/verse-recite';
import { triggerTactileFeedback } from '@/lib/haptics';

export function GlobalAudioPlayer() {
  const router = useRouter();
  const [state, setState] = useState<RecitationState | null>(null);
  const [speed, setSpeed] = useState(1.0);
  const [loop, setLoop] = useState(false);

  useEffect(() => {
    setState(getRecitationState());
    setSpeed(getRecitationSpeed());
    setLoop(getRecitationLoop());

    const unsubRecite = subscribeRecitation((newState) => {
      setState(newState);
    });

    const unsubConfig = subscribeRecitationConfig(() => {
      setSpeed(getRecitationSpeed());
      setLoop(getRecitationLoop());
    });

    return () => {
      unsubRecite();
      unsubConfig();
    };
  }, []);

  const isVisible = Boolean(state?.activeKey && (state.isSpeaking || state.isPaused));
  const metadata = state?.metadata;
  const scriptureTitle = metadata?.scriptureTitle || 'पवित्र ग्रंथ';
  const verseLabel = metadata?.verseLabel ? `श्लोक ${metadata.verseLabel}` : '';
  const chapterTitle = metadata?.chapterTitle ? metadata.chapterTitle : '';

  const displayTitle = [scriptureTitle, chapterTitle, verseLabel].filter(Boolean).join(' · ');
  const currentText = state?.currentLineText || metadata?.sanskrit || metadata?.hindi || '';

  // Integrate Web Media Session API for lock screen and Bluetooth/headset controls
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    if (isVisible && state) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: displayTitle || 'सस्वर पाठ',
          artist: 'धर्म ग्रंथ · Dharma Granth',
          album: chapterTitle || scriptureTitle,
        });

        navigator.mediaSession.setActionHandler('play', () => {
          resumeRecitation();
        });
        navigator.mediaSession.setActionHandler('pause', () => {
          pauseRecitation();
        });
        navigator.mediaSession.setActionHandler('stop', () => {
          stopRecitation();
        });
      } catch {}
    } else {
      try {
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('stop', null);
      } catch {}
    }

    return () => {
      if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
        try {
          navigator.mediaSession.setActionHandler('play', null);
          navigator.mediaSession.setActionHandler('pause', null);
          navigator.mediaSession.setActionHandler('stop', null);
        } catch {}
      }
    };
  }, [isVisible, state, displayTitle, chapterTitle, scriptureTitle]);

  function handlePlayPause() {
    triggerTactileFeedback('medium', 'softTap');
    if (state?.isSpeaking) {
      pauseRecitation();
    } else {
      resumeRecitation();
    }
  }

  function handleLoopToggle() {
    triggerTactileFeedback('medium', 'click');
    const next = toggleRecitationLoop();
    setLoop(next);
  }

  function handleCycleSpeed() {
    triggerTactileFeedback('light', 'softTap');
    const speeds = [0.75, 1.0, 1.25];
    const currentIndex = speeds.indexOf(speed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length] ?? 1.0;
    setSpeed(nextSpeed);
    setRecitationSpeed(nextSpeed);
  }

  function handleStop() {
    triggerTactileFeedback('medium', 'click');
    stopRecitation();
  }

  function scrollToVerseElement() {
    if (typeof window === 'undefined' || !metadata?.verseLabel) return;
    const target = document.getElementById(`verse-${metadata.verseLabel}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('ring-2', 'ring-amber-500');
      setTimeout(() => {
        target.classList.remove('ring-2', 'ring-amber-500');
      }, 1800);
      triggerTactileFeedback('light', 'softTap');
    } else if (metadata.scriptureId && metadata.chapterId) {
      router.push(`/${metadata.scriptureId}/${metadata.chapterId}#verse-${metadata.verseLabel}`);
      triggerTactileFeedback('light', 'softTap');
    }
  }

  return (
    <AnimatePresence>
      {isVisible && state && (
        <motion.aside
          key="global-audio-player"
          initial={{ y: 90, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 90, opacity: 0, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          aria-label="सस्वर पाठ प्लेयर (Recitation Player)"
          className="fixed bottom-3 sm:bottom-5 bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-2xl"
        >
          <div className="relative overflow-hidden rounded-2xl border border-amber-500/25 bg-dharma-card/95 backdrop-blur-xl shadow-2xl p-2.5 sm:p-3 text-dharma-text ring-1 ring-amber-500/10">
            {/* Subtle top saffron ambient glow line */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />

            <div className="flex items-center gap-3">
              {/* Om Icon + Pulsing Waveform */}
              <button
                type="button"
                onClick={scrollToVerseElement}
                title="श्लोक पर जाएं"
                aria-label="श्लोक पर जाएं"
                className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-saffron-600 text-white shadow-md hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition-all"
              >
                <span className="font-serif text-lg font-bold">ॐ</span>

                {/* Pulsing sound bars when reciting */}
                {state.isSpeaking && (
                  <span className="absolute -bottom-1 -right-1 flex h-4 items-end gap-0.5 rounded-md bg-stone-900/80 px-1 py-0.5 backdrop-blur-sm">
                    <motion.span
                      animate={{ height: ['3px', '10px', '4px'] }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
                      className="w-[2px] rounded-full bg-amber-300"
                    />
                    <motion.span
                      animate={{ height: ['8px', '3px', '11px'] }}
                      transition={{ repeat: Infinity, duration: 0.6, ease: 'easeInOut', delay: 0.2 }}
                      className="w-[2px] rounded-full bg-amber-400"
                    />
                    <motion.span
                      animate={{ height: ['4px', '12px', '6px'] }}
                      transition={{ repeat: Infinity, duration: 0.7, ease: 'easeInOut', delay: 0.1 }}
                      className="w-[2px] rounded-full bg-amber-300"
                    />
                  </span>
                )}
              </button>

              {/* Recitation Info & Live Text */}
              <div
                role="button"
                tabIndex={0}
                aria-label={`श्लोक पर जाएं: ${displayTitle}`}
                className="min-w-0 flex-1 cursor-pointer select-none text-left rounded-lg p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/80 transition-shadow"
                onClick={scrollToVerseElement}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    scrollToVerseElement();
                  }
                }}
              >
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <h4 className="truncate text-xs font-semibold tracking-wide text-amber-800 dark:text-amber-300">
                    {displayTitle}
                  </h4>
                  {typeof state.lineIndex === 'number' && (
                    <span className="rounded bg-amber-500/15 px-1 py-0.2 text-[10px] font-medium text-amber-700 dark:text-amber-300">
                      चरण {state.lineIndex + 1}
                    </span>
                  )}
                  {state.lineIndex === 'meaning' && (
                    <span className="rounded bg-amber-500/15 px-1 py-0.2 text-[10px] font-medium text-amber-700 dark:text-amber-300">
                      अर्थ
                    </span>
                  )}
                  {state.iteration && state.iteration > 1 ? (
                    <span className="rounded bg-amber-500/15 px-1 py-0.2 text-[10px] font-bold text-amber-700 dark:text-amber-300">
                      आवृति {state.iteration}
                    </span>
                  ) : null}
                </div>

                <p
                  className="truncate font-serif text-xs sm:text-sm text-dharma-text/90 mt-0.5"
                  lang="sa"
                  aria-live="polite"
                >
                  {currentText}
                </p>
              </div>

              {/* Controls Toolbar */}
              <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                {/* Play / Pause */}
                <button
                  type="button"
                  onClick={handlePlayPause}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600 text-white shadow hover:bg-amber-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition"
                  title={state.isSpeaking ? 'विराम (Pause)' : 'पुनः पाठ (Play)'}
                  aria-label={state.isSpeaking ? 'Pause' : 'Play'}
                  aria-pressed={state.isSpeaking}
                >
                  {state.isSpeaking ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 fill-current ml-0.5" />
                  )}
                </button>

                {/* Loop (आवृति) */}
                <button
                  type="button"
                  onClick={handleLoopToggle}
                  className={`flex h-9 items-center gap-1 rounded-xl px-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition ${
                    loop
                      ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-dharma-muted hover:text-dharma-text border border-transparent hover:border-dharma-border'
                  }`}
                  title={loop ? 'आवृति चालू है (Loop active)' : 'आवृति चालू करें (Repeat shloka)'}
                  aria-label="Loop toggle"
                  aria-pressed={loop}
                >
                  <Repeat className={`h-3.5 w-3.5 ${loop ? 'text-amber-600 dark:text-amber-400' : ''}`} />
                  <span className="hidden sm:inline text-[11px]">आवृति</span>
                </button>

                {/* Speed Button (Cycles 0.75x -> 1.0x -> 1.25x) */}
                <button
                  type="button"
                  onClick={handleCycleSpeed}
                  className="flex h-9 items-center gap-1 rounded-xl px-2 text-xs font-semibold text-dharma-muted hover:text-dharma-text border border-dharma-border/60 hover:border-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition"
                  title={`गति बदलें (वर्तमान: ${speed}x)`}
                  aria-label="Change speed"
                >
                  <Gauge className="h-3.5 w-3.5 text-amber-600" />
                  <span className="text-[11px] font-mono">{speed}x</span>
                </button>

                {/* Stop & Dismiss Button */}
                <button
                  type="button"
                  onClick={handleStop}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-dharma-muted hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 transition"
                  title="पाठ समाप्त करें (Stop)"
                  aria-label="Stop recitation"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
