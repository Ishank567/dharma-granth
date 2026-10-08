'use client';

import { useEffect, useRef, useState } from 'react';
import { Repeat, Square, Volume2 } from 'lucide-react';
import {
  canRecite,
  getRecitationLoop,
  getRecitationSpeed,
  getRecitationState,
  reciteVerse,
  setRecitationLoop,
  setRecitationSpeed,
  speechSupported,
  stopRecitation,
  subscribeRecitation,
  subscribeRecitationConfig,
  type RecitableVerse,
} from '@/lib/verse-recite';
import { triggerTactileFeedback } from '@/lib/haptics';

export interface ListenButtonProps extends RecitableVerse {
  compact?: boolean;
  scriptureTitle?: string;
  chapterTitle?: string;
  verseLabel?: string;
  scriptureId?: string;
  chapterId?: number | string;
  verseNumber?: number | string;
  onReciteFinish?: (naturalEnd: boolean) => void;
  onSpeakingChange?: (speaking: boolean) => void;
}

/**
 * Recites a verse aloud via the browser's speech synthesis — Sanskrit first,
 * then the meaning. Synchronizes state globally so only one button shows "Stop" at a time.
 * Supports on-the-fly chanting speed adjustments (0.75x, 1x, 1.25x) and shloka loop (आवृति).
 */
export function ListenButton({
  sanskrit,
  hindi,
  translation,
  compact = false,
  scriptureTitle,
  chapterTitle,
  verseLabel,
  scriptureId,
  chapterId,
  verseNumber,
  onReciteFinish,
  onSpeakingChange,
}: ListenButtonProps) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [loop, setLoop] = useState(false);
  const speakingRef = useRef(false);
  speakingRef.current = speaking;

  const myKey = sanskrit || hindi || translation || '';

  useEffect(() => {
    setSupported(speechSupported());
    setSpeed(getRecitationSpeed());
    setLoop(getRecitationLoop());

    const initialRecState = getRecitationState();
    if (initialRecState?.activeKey === myKey && initialRecState.isSpeaking) {
      setSpeaking(true);
      onSpeakingChange?.(true);
    }

    const unsubRecite = subscribeRecitation((state) => {
      const activeKey = state?.activeKey ?? null;
      const isMyVerseSpeaking = Boolean(activeKey === myKey && state.isSpeaking);
      if (isMyVerseSpeaking !== speakingRef.current) {
        setSpeaking(isMyVerseSpeaking);
        onSpeakingChange?.(isMyVerseSpeaking);
      }
    });

    const unsubConfig = subscribeRecitationConfig(() => {
      setSpeed(getRecitationSpeed());
      setLoop(getRecitationLoop());
    });

    return () => {
      unsubRecite();
      unsubConfig();
    };
  }, [myKey, onSpeakingChange]);

  const verse: RecitableVerse = { sanskrit, hindi, translation };
  if (!supported || !canRecite(verse)) return null;

  function toggle() {
    triggerTactileFeedback('medium', speaking ? 'softTap' : 'click');
    if (speaking) {
      stopRecitation();
      setSpeaking(false);
      onSpeakingChange?.(false);
      onReciteFinish?.(false);
      return;
    }
    setSpeaking(true);
    onSpeakingChange?.(true);
    reciteVerse(
      verse,
      (naturalEnd) => {
        setSpeaking(false);
        onSpeakingChange?.(false);
        onReciteFinish?.(naturalEnd);
      },
      {
        speed,
        loop,
        metadata: {
          scriptureTitle,
          chapterTitle,
          verseLabel,
          scriptureId,
          chapterId,
          verseNumber,
          sanskrit,
          hindi,
          translation,
        },
      },
    );
  }

  function handleSpeedChange(newSpeed: number, e: React.MouseEvent) {
    e.stopPropagation();
    setSpeed(newSpeed);
    setRecitationSpeed(newSpeed);
    triggerTactileFeedback('light', 'softTap');
  }

  function handleLoopToggle(e: React.MouseEvent) {
    e.stopPropagation();
    const nextLoop = !loop;
    setLoop(nextLoop);
    setRecitationLoop(nextLoop);
    triggerTactileFeedback('medium', nextLoop ? 'softTap' : 'click');
  }

  if (compact) {
    return (
      <div className="relative inline-flex items-center">
        <button
          type="button"
          onClick={toggle}
          className={`inline-flex min-h-[36px] sm:min-h-[44px] items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
            speaking
              ? 'border-saffron-400 bg-saffron-100 text-saffron-800 ring-2 ring-saffron-400/30 animate-pulse'
              : 'border-dharma-border/60 bg-dharma-bg text-dharma-muted hover:border-saffron-300 hover:text-saffron-700'
          }`}
          aria-label={speaking ? `Stop recitation: ${verseLabel || 'verse'}` : `Listen to ${verseLabel || 'this verse'}`}
          aria-pressed={speaking}
          title={speaking ? 'Stop (रोकें)' : 'Listen (सुनें)'}
        >
          {speaking ? (
            <Square className="h-3.5 w-3.5 fill-current text-saffron-700" aria-hidden="true" />
          ) : (
            <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          <span>{speaking ? 'Stop' : 'Listen'}</span>
        </button>

        {speaking && (
          <span className="sr-only" role="status" aria-live="polite">
            {`Reciting ${verseLabel || 'verse'}`}
          </span>
        )}

        {speaking && (
          <div
            className="absolute bottom-full right-0 z-30 mb-1.5 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-saffron-300/80 bg-white/95 px-2.5 py-1 shadow-md backdrop-blur dark:border-saffron-800/80 dark:bg-stone-900/95"
            role="toolbar"
            aria-label="पाठ गति व आवृति"
          >
            <button
              type="button"
              onClick={handleLoopToggle}
              className={`inline-flex min-h-[32px] items-center gap-1 rounded-full px-2 py-1 text-[11px] font-semibold transition ${
                loop
                  ? 'bg-amber-600 text-white'
                  : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
              }`}
              title={loop ? 'आवृति चालू है (Loop ON)' : 'आवृति चालू करें (Loop OFF)'}
              aria-label={loop ? 'Loop ON' : 'Loop OFF'}
              aria-pressed={loop}
            >
              <Repeat className="h-3 w-3" aria-hidden="true" />
              <span>आवृति</span>
            </button>
            <span className="text-stone-300 dark:text-stone-700" aria-hidden="true">|</span>
            {[0.75, 1.0, 1.25].map((s) => (
              <button
                key={s}
                type="button"
                onClick={(e) => handleSpeedChange(s, e)}
                className={`min-h-[32px] min-w-[32px] rounded-full px-2 py-1 text-[11px] font-bold transition ${
                  speed === s
                    ? 'bg-saffron-600 text-white'
                    : 'text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100'
                }`}
                aria-label={`${s}x speed`}
              >
                {s}x
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center">
      <button
        type="button"
        onClick={toggle}
        className={`inline-flex min-h-[44px] min-w-[44px] h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-saffron-500 ${
          speaking
            ? 'border-saffron-300 bg-saffron-100 text-saffron-800 shadow-sm ring-2 ring-saffron-400/30 animate-pulse'
            : 'border-dharma-border bg-dharma-card/80 text-dharma-muted hover:border-saffron-300 hover:text-saffron-700'
        }`}
        aria-label={speaking ? `Stop recitation: ${verseLabel || 'verse'}` : `Listen to ${verseLabel || 'this verse'}`}
        aria-pressed={speaking}
        title={speaking ? 'Stop (रोकें)' : 'Listen (सुनें)'}
      >
        {speaking ? (
          <Square className="h-4 w-4 fill-current text-saffron-700" aria-hidden="true" />
        ) : (
          <Volume2 className="h-4 w-4" aria-hidden="true" />
        )}
      </button>

      {speaking && (
        <span className="sr-only" role="status" aria-live="polite">
          {`Reciting ${verseLabel || 'verse'}`}
        </span>
      )}

      {speaking && (
        <div
          className="absolute bottom-full right-0 z-30 mb-2 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-saffron-300/80 bg-white/95 px-3 py-1.5 shadow-lg backdrop-blur dark:border-saffron-800/80 dark:bg-stone-900/95"
          role="toolbar"
          aria-label="पाठ गति व आवृति विकल्प"
        >
          <button
            type="button"
            onClick={handleLoopToggle}
            className={`inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
              loop
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100'
            }`}
            title={loop ? 'आवृति चालू है (Loop ON — बार-बार सुनें)' : 'आवृति चालू करें (Loop OFF)'}
            aria-label={loop ? 'Loop active' : 'Loop toggle'}
            aria-pressed={loop}
          >
            <Repeat className="h-3.5 w-3.5" aria-hidden="true" />
            <span>आवृति</span>
          </button>
          <span className="text-stone-300 dark:text-stone-700" aria-hidden="true">|</span>
          <div className="flex items-center gap-1">
            {[0.75, 1.0, 1.25].map((s) => (
              <button
                key={s}
                type="button"
                onClick={(e) => handleSpeedChange(s, e)}
                className={`min-h-[36px] min-w-[36px] rounded-full px-2 py-1 text-[11px] font-bold transition ${
                  speed === s
                    ? 'bg-saffron-600 text-white shadow-xs'
                    : 'text-stone-500 hover:bg-stone-100 hover:text-stone-900 dark:text-stone-400 dark:hover:bg-stone-800 dark:hover:text-stone-100'
                }`}
                title={`${s}x गति`}
                aria-label={`${s}x speed`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
