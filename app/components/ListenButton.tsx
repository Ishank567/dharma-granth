'use client';

import { useEffect, useRef, useState } from 'react';
import { Square, Volume2 } from 'lucide-react';
import {
  canRecite,
  reciteVerse,
  speechSupported,
  stopRecitation,
  type RecitableVerse,
} from '@/lib/verse-recite';

/**
 * Recites a verse aloud via the browser's speech synthesis — Sanskrit first,
 * then the meaning. Renders nothing when the browser lacks TTS (checked after
 * mount so server and client markup agree).
 */
export function ListenButton({
  sanskrit,
  hindi,
  translation,
  compact = false,
}: RecitableVerse & { compact?: boolean }) {
  const [supported, setSupported] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const speakingRef = useRef(false);
  speakingRef.current = speaking;

  useEffect(() => {
    setSupported(speechSupported());
    return () => {
      if (speakingRef.current) stopRecitation();
    };
  }, []);

  const verse: RecitableVerse = { sanskrit, hindi, translation };
  if (!supported || !canRecite(verse)) return null;

  function toggle() {
    if (speaking) {
      stopRecitation();
      return;
    }
    setSpeaking(true);
    reciteVerse(verse, () => setSpeaking(false));
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={toggle}
        className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium transition ${
          speaking
            ? 'border-saffron-400 bg-saffron-100 text-saffron-800'
            : 'border-dharma-border/60 bg-dharma-bg text-dharma-muted hover:border-saffron-300 hover:text-saffron-700'
        }`}
        aria-label={speaking ? 'Stop recitation' : 'Listen to this verse'}
        aria-pressed={speaking}
        title={speaking ? 'Stop' : 'Listen (सुनें)'}
      >
        {speaking ? <Square className="h-3 w-3 fill-current" /> : <Volume2 className="h-3 w-3" />}
        {speaking ? 'Stop' : 'Listen'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${
        speaking
          ? 'border-saffron-300 bg-saffron-100 text-saffron-800 shadow-sm'
          : 'border-dharma-border bg-dharma-card/80 text-dharma-muted hover:border-saffron-300 hover:text-saffron-700'
      }`}
      aria-label={speaking ? 'Stop recitation' : 'Listen to this verse'}
      aria-pressed={speaking}
      title={speaking ? 'Stop' : 'Listen (सुनें)'}
    >
      {speaking ? <Square className="h-4 w-4 fill-current" /> : <Volume2 className="h-4 w-4" />}
    </button>
  );
}
