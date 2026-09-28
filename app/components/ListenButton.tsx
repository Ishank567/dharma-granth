'use client';

import { useEffect, useRef, useState } from 'react';
import { Square, Volume2 } from 'lucide-react';
import {
  canRecite,
  reciteVerse,
  speechSupported,
  stopRecitation,
  subscribeRecitation,
  type RecitableVerse,
} from '@/lib/verse-recite';
import { triggerTactileFeedback } from '@/lib/haptics';

export interface ListenButtonProps extends RecitableVerse {
  compact?: boolean;
  onReciteFinish?: (naturalEnd: boolean) => void;
  onSpeakingChange?: (speaking: boolean) => void;
}

/**
 * Recites a verse aloud via the browser's speech synthesis — Sanskrit first,
 * then the meaning. Synchronizes state globally so only one button shows "Stop" at a time.
 */
export function ListenButton({
  sanskrit,
  hindi,
  translation,
  compact = false,
  onReciteFinish,
  onSpeakingChange,
}: ListenButtonProps) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const speakingRef = useRef(false);
  speakingRef.current = speaking;

  const myKey = sanskrit || hindi || translation || '';

  useEffect(() => {
    setSupported(speechSupported());

    const unsubscribe = subscribeRecitation((state) => {
      const activeKey = state?.activeKey ?? null;
      if (activeKey !== myKey && speakingRef.current) {
        setSpeaking(false);
        onSpeakingChange?.(false);
      }
    });

    return () => {
      unsubscribe();
      if (speakingRef.current) stopRecitation();
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
    reciteVerse(verse, (naturalEnd) => {
      setSpeaking(false);
      onSpeakingChange?.(false);
      onReciteFinish?.(naturalEnd);
    });
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggle}
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition ${
          speaking
            ? 'border-saffron-400 bg-saffron-100 text-saffron-800 ring-2 ring-saffron-400/30 animate-pulse'
            : 'border-dharma-border/60 bg-dharma-bg text-dharma-muted hover:border-saffron-300 hover:text-saffron-700'
        }`}
        aria-label={speaking ? 'Stop recitation' : 'Listen to this verse'}
        aria-pressed={speaking}
        title={speaking ? 'Stop (रोकें)' : 'Listen (सुनें)'}
      >
        {speaking ? (
          <Square className="h-3 w-3 fill-current text-saffron-700" />
        ) : (
          <Volume2 className="h-3 w-3" />
        )}
        <span>{speaking ? 'Stop' : 'Listen'}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${
        speaking
          ? 'border-saffron-300 bg-saffron-100 text-saffron-800 shadow-sm ring-2 ring-saffron-400/30 animate-pulse'
          : 'border-dharma-border bg-dharma-card/80 text-dharma-muted hover:border-saffron-300 hover:text-saffron-700'
      }`}
      aria-label={speaking ? 'Stop recitation' : 'Listen to this verse'}
      aria-pressed={speaking}
      title={speaking ? 'Stop (रोकें)' : 'Listen (सुनें)'}
    >
      {speaking ? (
        <Square className="h-4 w-4 fill-current text-saffron-700" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
    </button>
  );
}
