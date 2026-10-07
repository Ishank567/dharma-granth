'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Bookmark,
  BookmarkCheck,
  Compass,
  Gauge,
  Languages,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Repeat,
  Share2,
  SkipBack,
  SkipForward,
  Sparkles,
  X,
} from 'lucide-react';
import {
  cycleRecitationLoopTarget,
  getRecitationLoop,
  getRecitationLoopTarget,
  getRecitationOnlySanskrit,
  getRecitationSpeed,
  getRecitationState,
  pauseRecitation,
  resumeRecitation,
  setRecitationSpeed,
  skipRecitation,
  stopRecitation,
  subscribeRecitation,
  subscribeRecitationConfig,
  toggleRecitationLoop,
  toggleRecitationOnlySanskrit,
  type RecitationState,
} from '@/lib/verse-recite';
import {
  isTanpuraPlaying,
  stopTanpura,
  subscribeTanpura,
  toggleTanpura,
} from '@/lib/tanpura-audio';
import { triggerTactileFeedback } from '@/lib/haptics';

export function GlobalAudioPlayer() {
  const router = useRouter();
  const [state, setState] = useState<RecitationState | null>(null);
  const [speed, setSpeed] = useState(1.0);
  const [loop, setLoop] = useState(false);
  const [loopTarget, setLoopTarget] = useState(0);
  const [onlySanskrit, setOnlySanskrit] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [minimized, setMinimized] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [tanpuraActive, setTanpuraActive] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setState(getRecitationState());
    setSpeed(getRecitationSpeed());
    setLoop(getRecitationLoop());
    setLoopTarget(getRecitationLoopTarget());
    setOnlySanskrit(getRecitationOnlySanskrit());
    setTanpuraActive(isTanpuraPlaying());

    try {
      const savedAutoScroll = localStorage.getItem('dharma_recite_autoscroll');
      if (savedAutoScroll !== null) setAutoScroll(savedAutoScroll === 'true');
    } catch {}

    const unsubRecite = subscribeRecitation((newState) => {
      setState(newState);
    });

    const unsubConfig = subscribeRecitationConfig(() => {
      setSpeed(getRecitationSpeed());
      setLoop(getRecitationLoop());
      setLoopTarget(getRecitationLoopTarget());
      setOnlySanskrit(getRecitationOnlySanskrit());
    });

    const unsubTanpura = subscribeTanpura((active) => {
      setTanpuraActive(active);
    });

    return () => {
      unsubRecite();
      unsubConfig();
      unsubTanpura();
    };
  }, []);

  const isVisible = Boolean(state?.activeKey && (state.isSpeaking || state.isPaused));
  const metadata = state?.metadata;
  const scriptureTitle = metadata?.scriptureTitle || 'पवित्र ग्रंथ';
  const verseLabel = metadata?.verseLabel ? `श्लोक ${metadata.verseLabel}` : '';
  const chapterTitle = metadata?.chapterTitle ? metadata.chapterTitle : '';

  const displayTitle = [scriptureTitle, chapterTitle, verseLabel].filter(Boolean).join(' · ');
  const currentText = state?.currentLineText || metadata?.sanskrit || metadata?.hindi || '';

  // Synchronize bookmark state with localStorage
  useEffect(() => {
    const checkBookmark = () => {
      if (!metadata?.scriptureId || !metadata?.verseNumber) {
        setIsBookmarked(false);
        return;
      }
      try {
        const saved = localStorage.getItem('dharma.bookmarkedVerses');
        if (saved) {
          const list = JSON.parse(saved);
          const exists = list.some(
            (b: { scriptureId: string; verseId: string | number }) =>
              b.scriptureId === metadata.scriptureId &&
              String(b.verseId) === String(metadata.verseNumber),
          );
          setIsBookmarked(Boolean(exists));
        } else {
          setIsBookmarked(false);
        }
      } catch {
        setIsBookmarked(false);
      }
    };

    checkBookmark();
    window.addEventListener('dharma-bookmark-updated', checkBookmark);
    window.addEventListener('storage', checkBookmark);
    return () => {
      window.removeEventListener('dharma-bookmark-updated', checkBookmark);
      window.removeEventListener('storage', checkBookmark);
    };
  }, [metadata?.scriptureId, metadata?.verseNumber]);

  const handlePlayPause = useCallback(() => {
    triggerTactileFeedback('medium', 'softTap');
    if (state?.isSpeaking) {
      pauseRecitation();
    } else {
      resumeRecitation();
    }
  }, [state?.isSpeaking]);

  const handleSkip = useCallback((direction: 'next' | 'prev') => {
    triggerTactileFeedback('light', 'softTap');
    const handled = skipRecitation(direction);
    if (!handled && metadata?.verseNumber && metadata.scriptureId && metadata.chapterId) {
      const cur = Number(metadata.verseNumber);
      if (!Number.isNaN(cur)) {
        const targetNum = direction === 'next' ? cur + 1 : Math.max(1, cur - 1);
        router.push(`/${metadata.scriptureId}/${metadata.chapterId}#verse-${targetNum}`);
      }
    }
  }, [metadata?.verseNumber, metadata?.scriptureId, metadata?.chapterId, router]);

  const handleLoopToggle = useCallback(() => {
    triggerTactileFeedback('medium', 'click');
    const next = toggleRecitationLoop();
    setLoop(next);
  }, []);

  function handleCycleLoopTarget() {
    triggerTactileFeedback('medium', 'click');
    const nextTarget = cycleRecitationLoopTarget();
    setLoopTarget(nextTarget);
  }

  function handleToggleOnlySanskrit() {
    triggerTactileFeedback('medium', 'softTap');
    const next = toggleRecitationOnlySanskrit();
    setOnlySanskrit(next);
  }

  function handleCycleSpeed() {
    triggerTactileFeedback('light', 'softTap');
    // Includes 0.5x slow study mode for pronunciation training
    const speeds = [0.5, 0.75, 1.0, 1.25];
    const currentIndex = speeds.indexOf(speed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length] ?? 1.0;
    setSpeed(nextSpeed);
    setRecitationSpeed(nextSpeed);
    if (nextSpeed === 0.5) {
      setToastMessage('धीमा अभ्यास गति (0.5x)');
      setTimeout(() => setToastMessage(null), 1800);
    }
  }

  const handleStop = useCallback(() => {
    triggerTactileFeedback('medium', 'click');
    stopRecitation();
    stopTanpura();
  }, []);

  function toggleAutoScroll() {
    triggerTactileFeedback('light', 'softTap');
    setAutoScroll((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('dharma_recite_autoscroll', String(next));
      } catch {}
      return next;
    });
  }

  function toggleMinimized() {
    triggerTactileFeedback('light', 'click');
    setMinimized((prev) => !prev);
  }

  const handleToggleTanpura = useCallback(() => {
    triggerTactileFeedback('celestial', 'omBowl');
    const next = toggleTanpura();
    setTanpuraActive(next);
    setToastMessage(next ? 'तन्पूरा ध्यान नाद सक्रिय ॐ' : 'तन्पूरा नाद विराम');
    setTimeout(() => setToastMessage(null), 2000);
  }, []);

  const handleToggleBookmark = useCallback(() => {
    if (!metadata?.scriptureId || !metadata?.verseNumber) return;
    try {
      const saved = localStorage.getItem('dharma.bookmarkedVerses');
      const list: Array<{
        scriptureId: string;
        scriptureTitle: string;
        chapterId?: number | string;
        chapterTitle: string;
        verseId: number | string;
        sanskrit: string;
        translation: string;
        hindi?: string;
        timestamp: string;
      }> = saved ? JSON.parse(saved) : [];

      const vId = String(metadata.verseNumber);
      const isCurrentlySaved = list.some(
        (b) => b.scriptureId === metadata.scriptureId && String(b.verseId) === vId,
      );

      let nextList: typeof list;
      if (isCurrentlySaved) {
        nextList = list.filter(
          (b) => !(b.scriptureId === metadata.scriptureId && String(b.verseId) === vId),
        );
        triggerTactileFeedback('medium', 'softTap');
        setToastMessage('बुकमार्क हटाया गया');
      } else {
        const item = {
          scriptureId: metadata.scriptureId,
          scriptureTitle: metadata.scriptureTitle ?? metadata.scriptureId,
          chapterId: metadata.chapterId,
          chapterTitle: metadata.chapterTitle ?? (metadata.chapterId ? `अध्याय ${metadata.chapterId}` : ''),
          verseId: metadata.verseNumber,
          sanskrit: metadata.sanskrit ?? '',
          translation: metadata.translation ?? metadata.hindi ?? '',
          hindi: metadata.hindi,
          timestamp: new Date().toISOString(),
        };
        nextList = [item, ...list];
        triggerTactileFeedback('celestial', 'templeChime');
        setToastMessage('श्लोक सहेजा गया ★');
      }

      localStorage.setItem('dharma.bookmarkedVerses', JSON.stringify(nextList));
      setIsBookmarked(!isCurrentlySaved);
      window.dispatchEvent(new Event('dharma-bookmark-updated'));
      setTimeout(() => setToastMessage(null), 2200);
    } catch {}
  }, [metadata]);

  const handleShareVerse = useCallback(async () => {
    if (!metadata) return;
    try {
      const parts: string[] = [];
      if (metadata.sanskrit) parts.push(metadata.sanskrit);
      if (metadata.hindi) parts.push(`हिन्दी: ${metadata.hindi}`);
      if (metadata.translation) parts.push(`English: ${metadata.translation}`);
      parts.push(
        `— ${metadata.scriptureTitle || metadata.scriptureId}, ${
          metadata.chapterTitle || (metadata.chapterId ? `अध्याय ${metadata.chapterId}` : '')
        }, श्लोक ${metadata.verseNumber || metadata.verseLabel || ''}`,
      );

      const url =
        typeof window !== 'undefined' && metadata.scriptureId && metadata.chapterId
          ? `${window.location.origin}/${metadata.scriptureId}/${metadata.chapterId}#verse-${
              metadata.verseNumber || metadata.verseLabel
            }`
          : typeof window !== 'undefined'
          ? window.location.href
          : '';

      triggerTactileFeedback('medium', 'click');

      if (typeof navigator !== 'undefined' && navigator.share) {
        try {
          await navigator.share({
            title: displayTitle,
            text: parts.join('\n\n'),
            url: url || undefined,
          });
          return;
        } catch {
          // Fall back to clipboard if user cancels or share is unhandled
        }
      }

      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const fullShare = url ? `${parts.join('\n\n')}\n\n${url}` : parts.join('\n\n');
        await navigator.clipboard.writeText(fullShare);
        setToastMessage('श्लोक लिंक कॉपी हुआ ✓');
        setTimeout(() => setToastMessage(null), 2200);
      }
    } catch {}
  }, [metadata, displayTitle]);

  // Auto-scroll follow effect: smoothly keeps active reciting verse centered in view
  useEffect(() => {
    if (!autoScroll || !isVisible || typeof window === 'undefined' || !metadata?.verseLabel) return;
    const target = document.getElementById(`verse-${metadata.verseLabel}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('ring-2', 'ring-amber-500/80');
      const timer = setTimeout(() => {
        target.classList.remove('ring-2', 'ring-amber-500/80');
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [autoScroll, isVisible, metadata?.verseLabel]);

  // Web Media Session API for lock screen and Bluetooth controls
  useEffect(() => {
    if (typeof window === 'undefined' || !('mediaSession' in navigator)) return;

    if (isVisible && state) {
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: displayTitle || 'सस्वर पाठ',
          artist: 'धर्म ग्रंथ · Dharma Granth',
          album: chapterTitle || scriptureTitle,
        });

        navigator.mediaSession.playbackState = state.isSpeaking ? 'playing' : 'paused';

        navigator.mediaSession.setActionHandler('play', () => {
          resumeRecitation();
        });
        navigator.mediaSession.setActionHandler('pause', () => {
          pauseRecitation();
        });
        navigator.mediaSession.setActionHandler('stop', () => {
          handleStop();
        });
        navigator.mediaSession.setActionHandler('nexttrack', () => {
          handleSkip('next');
        });
        navigator.mediaSession.setActionHandler('previoustrack', () => {
          handleSkip('prev');
        });
      } catch {}
    } else {
      try {
        navigator.mediaSession.playbackState = 'none';
        navigator.mediaSession.setActionHandler('play', null);
        navigator.mediaSession.setActionHandler('pause', null);
        navigator.mediaSession.setActionHandler('stop', null);
        navigator.mediaSession.setActionHandler('nexttrack', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
      } catch {}
    }

    return () => {
      if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
        try {
          navigator.mediaSession.playbackState = 'none';
          navigator.mediaSession.setActionHandler('play', null);
          navigator.mediaSession.setActionHandler('pause', null);
          navigator.mediaSession.setActionHandler('stop', null);
          navigator.mediaSession.setActionHandler('nexttrack', null);
          navigator.mediaSession.setActionHandler('previoustrack', null);
        } catch {}
      }
    };
  }, [isVisible, state, displayTitle, chapterTitle, scriptureTitle, handleSkip, handleStop]);

  // Global Keyboard shortcuts
  useEffect(() => {
    if (!isVisible) return;
    function handleKeyDown(e: KeyboardEvent) {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea' || (document.activeElement as HTMLElement)?.isContentEditable) {
        return;
      }
      if (e.key === ' ' || e.key.toLowerCase() === 'k') {
        e.preventDefault();
        handlePlayPause();
      } else if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        handleSkip('next');
      } else if (e.key.toLowerCase() === 'p') {
        e.preventDefault();
        handleSkip('prev');
      } else if (e.key.toLowerCase() === 'l') {
        e.preventDefault();
        handleLoopToggle();
      } else if (e.key.toLowerCase() === 'b') {
        e.preventDefault();
        handleToggleBookmark();
      } else if (e.key.toLowerCase() === 't') {
        e.preventDefault();
        handleToggleTanpura();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, handlePlayPause, handleSkip, handleLoopToggle, handleToggleBookmark, handleToggleTanpura]);

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
    <AnimatePresence mode="wait">
      {isVisible && state && (
        minimized ? (
          /* Minimized Capsule Pill Mode */
          <motion.aside
            key="global-audio-player-mini"
            initial={{ y: 90, opacity: 0, scale: 0.94 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 90, opacity: 0, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            aria-label="सस्वर पाठ मिनी प्लेयर"
            className="fixed bottom-3 sm:bottom-5 bottom-[max(0.75rem,env(safe-area-inset-bottom))] left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 sm:gap-2 p-1.5 pl-2 rounded-full border border-amber-500/30 bg-dharma-card/95 backdrop-blur-xl shadow-2xl ring-1 ring-amber-500/15 text-dharma-text select-none"
          >
            {/* Transient Floating Toast */}
            <AnimatePresence>
              {toastMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.95 }}
                  className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-stone-900/95 dark:bg-stone-950/95 text-amber-300 border border-amber-500/40 shadow-xl backdrop-blur-md text-[11px] font-medium tracking-wide flex items-center gap-1.5 pointer-events-none z-50 whitespace-nowrap"
                >
                  <span>{toastMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={scrollToVerseElement}
              title="श्लोक पर जाएं"
              aria-label="श्लोक पर जाएं"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-saffron-600 text-white shadow font-serif text-sm font-bold active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition"
            >
              ॐ
            </button>

            <button
              type="button"
              onClick={scrollToVerseElement}
              className="text-left px-1 min-w-0 max-w-[120px] sm:max-w-[200px] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-400 rounded"
            >
              <p className="truncate text-xs font-bold text-amber-800 dark:text-amber-300">
                {displayTitle}
              </p>
              <p className="truncate text-[10px] text-dharma-muted">
                {typeof state.lineIndex === 'number' ? `चरण ${state.lineIndex + 1}` : state.lineIndex === 'meaning' ? 'अर्थ' : 'सस्वर पाठ'}
              </p>
            </button>

            <button
              type="button"
              onClick={handlePlayPause}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-600 text-white shadow hover:bg-amber-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition"
              title={state.isSpeaking ? 'विराम (Pause)' : 'पुनः पाठ (Play)'}
              aria-label={state.isSpeaking ? 'Pause' : 'Play'}
            >
              {state.isSpeaking ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current ml-0.5" />}
            </button>

            {/* Quick Bookmark in Pill */}
            <button
              type="button"
              onClick={handleToggleBookmark}
              className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                isBookmarked
                  ? 'text-amber-500 bg-amber-500/20'
                  : 'text-dharma-muted hover:text-amber-600 hover:bg-amber-500/10'
              }`}
              title={isBookmarked ? 'बुकमार्क हटाया (Remove bookmark)' : 'श्लोक सहेजें (Save bookmark)'}
              aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark verse'}
            >
              {isBookmarked ? <BookmarkCheck className="h-3.5 w-3.5 fill-current" /> : <Bookmark className="h-3.5 w-3.5" />}
            </button>

            <button
              type="button"
              onClick={toggleMinimized}
              className="flex h-8 w-8 items-center justify-center rounded-full text-dharma-muted hover:text-dharma-text hover:bg-stone-500/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition"
              title="विस्तृत रूप (Expand player)"
              aria-label="Expand player"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>

            <button
              type="button"
              onClick={handleStop}
              className="flex h-8 w-8 items-center justify-center rounded-full text-dharma-muted hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
              title="पाठ समाप्त करें (Stop)"
              aria-label="Stop recitation"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.aside>
        ) : (
          /* Full Expanded Toolbar Mode */
          <motion.aside
            key="global-audio-player-full"
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

              {/* Transient Floating Toast */}
              <AnimatePresence>
                {toastMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.95 }}
                    className="absolute -top-9 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-stone-900/95 dark:bg-stone-950/95 text-amber-300 border border-amber-500/40 shadow-xl backdrop-blur-md text-[11px] font-medium tracking-wide flex items-center gap-1.5 pointer-events-none z-50 whitespace-nowrap"
                  >
                    <span>{toastMessage}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center gap-2.5 sm:gap-3">
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
                        {loopTarget > 0 ? `आवृति ${state.iteration}/${loopTarget}` : `आवृति ${state.iteration}`}
                      </span>
                    ) : null}
                    {onlySanskrit && (
                      <span className="rounded bg-amber-500/10 px-1 py-0.2 text-[9px] font-semibold text-amber-600 dark:text-amber-400">
                        केवल संस्कृत
                      </span>
                    )}
                    {tanpuraActive && (
                      <span className="rounded bg-amber-500/20 px-1 py-0.2 text-[9px] font-semibold text-amber-600 dark:text-amber-300 flex items-center gap-0.5">
                        <Sparkles className="h-2.5 w-2.5 animate-pulse" />
                        तन्पूरा
                      </span>
                    )}
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
                <div className="flex items-center gap-1 shrink-0">
                  {/* Skip Previous Verse */}
                  <button
                    type="button"
                    onClick={() => handleSkip('prev')}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-dharma-muted hover:text-dharma-text hover:bg-stone-500/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition"
                    title="पिछला श्लोक (Previous verse - P)"
                    aria-label="Previous verse"
                  >
                    <SkipBack className="h-4 w-4" />
                  </button>

                  {/* Play / Pause */}
                  <button
                    type="button"
                    onClick={handlePlayPause}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600 text-white shadow hover:bg-amber-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition"
                    title={state.isSpeaking ? 'विराम (Pause - Space)' : 'पुनः पाठ (Play - Space)'}
                    aria-label={state.isSpeaking ? 'Pause' : 'Play'}
                    aria-pressed={state.isSpeaking}
                  >
                    {state.isSpeaking ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4 fill-current ml-0.5" />
                    )}
                  </button>

                  {/* Skip Next Verse */}
                  <button
                    type="button"
                    onClick={() => handleSkip('next')}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-dharma-muted hover:text-dharma-text hover:bg-stone-500/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition"
                    title="अगला श्लोक (Next verse - N)"
                    aria-label="Next verse"
                  >
                    <SkipForward className="h-4 w-4" />
                  </button>

                  {/* Loop (आवृति) & Mala Target Controls */}
                  <div className="inline-flex items-center rounded-xl overflow-hidden border border-dharma-border/60">
                    <button
                      type="button"
                      onClick={handleLoopToggle}
                      className={`flex h-9 items-center gap-1 px-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition ${
                        loop
                          ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
                          : 'text-dharma-muted hover:text-dharma-text'
                      }`}
                      title={loop ? 'आवृति चालू है (Loop active - L)' : 'आवृति चालू करें (Repeat shloka - L)'}
                      aria-label="Loop toggle"
                      aria-pressed={loop}
                    >
                      <Repeat className={`h-3.5 w-3.5 ${loop ? 'text-amber-600 dark:text-amber-400' : ''}`} />
                      <span className="hidden sm:inline text-[11px]">
                        {loop ? (loopTarget > 0 ? `${loopTarget}x` : '∞') : 'आवृति'}
                      </span>
                    </button>
                    {loop && (
                      <button
                        type="button"
                        onClick={handleCycleLoopTarget}
                        className="h-9 px-1.5 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/30 hover:bg-amber-500/40 border-l border-amber-500/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition"
                        title={`माला जप लक्ष्य बदलें (वर्तमान: ${loopTarget > 0 ? `${loopTarget} आवृतियां` : 'अनंत'})`}
                        aria-label="Change mala repetition target"
                      >
                        {loopTarget > 0 ? `${loopTarget}` : '∞'}
                      </button>
                    )}
                  </div>

                  {/* Auto-Scroll Follow Toggle */}
                  <button
                    type="button"
                    onClick={toggleAutoScroll}
                    className={`hidden sm:flex h-9 items-center gap-1 rounded-xl px-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition ${
                      autoScroll
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'text-dharma-muted hover:text-dharma-text border border-dharma-border/60 hover:border-amber-300'
                    }`}
                    title={autoScroll ? 'स्वाध्याय अनुवर्तन चालू है (श्लोक स्वतः केंद्र में रहेगा)' : 'स्वाध्याय अनुवर्तन चालू करें (Auto-scroll)'}
                    aria-label="Auto-scroll follow toggle"
                    aria-pressed={autoScroll}
                  >
                    <Compass className={`h-3.5 w-3.5 ${autoScroll ? 'text-amber-600 dark:text-amber-400' : ''}`} />
                    <span className="text-[11px]">अनुवर्तन</span>
                  </button>

                  {/* Sanskrit-Only Toggle */}
                  <button
                    type="button"
                    onClick={handleToggleOnlySanskrit}
                    className={`hidden md:flex h-9 items-center gap-1 rounded-xl px-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition ${
                      onlySanskrit
                        ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 shadow-sm'
                        : 'text-dharma-muted hover:text-dharma-text border border-dharma-border/60 hover:border-amber-300'
                    }`}
                    title={onlySanskrit ? 'केवल संस्कृत पाठ सक्रिय है (Sanskrit only active)' : 'सम्पूर्ण पाठ (संस्कृत + अर्थ)'}
                    aria-label="Sanskrit only toggle"
                    aria-pressed={onlySanskrit}
                  >
                    <Languages className="h-3.5 w-3.5" />
                    <span className="text-[11px]">{onlySanskrit ? 'संस्कृत' : 'अर्थ सहित'}</span>
                  </button>

                  {/* Speed Button (Cycles 0.5x -> 0.75x -> 1.0x -> 1.25x) */}
                  <button
                    type="button"
                    onClick={handleCycleSpeed}
                    className="flex h-9 items-center gap-1 rounded-xl px-2 text-xs font-semibold text-dharma-muted hover:text-dharma-text border border-dharma-border/60 hover:border-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition"
                    title={`गति बदलें (वर्तमान: ${speed}x${speed === 0.5 ? ' - धीमा अभ्यास' : ''})`}
                    aria-label="Change speed"
                  >
                    <Gauge className="h-3.5 w-3.5 text-amber-600" />
                    <span className="text-[11px] font-mono">{speed}x</span>
                  </button>

                  {/* Tanpura Sacred Drone Ambience Toggle */}
                  <button
                    type="button"
                    onClick={handleToggleTanpura}
                    className={`hidden lg:flex h-9 items-center gap-1 rounded-xl px-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition ${
                      tanpuraActive
                        ? 'bg-amber-500/25 text-amber-700 dark:text-amber-300 border border-amber-500/50 shadow-sm'
                        : 'text-dharma-muted hover:text-dharma-text border border-dharma-border/60 hover:border-amber-300'
                    }`}
                    title={
                      tanpuraActive
                        ? 'तन्पूरा नाद बज रहा है (Tanpura Drone Active - T)'
                        : 'तन्पूरा ध्यान नाद चालू करें (Tanpura Ambience - T)'
                    }
                    aria-label="Tanpura Drone toggle"
                    aria-pressed={tanpuraActive}
                  >
                    <Sparkles className={`h-3.5 w-3.5 ${tanpuraActive ? 'text-amber-600 dark:text-amber-400 animate-pulse' : ''}`} />
                    <span className="text-[11px]">तन्पूरा</span>
                  </button>

                  {/* Quick Bookmark Toggle */}
                  <button
                    type="button"
                    onClick={handleToggleBookmark}
                    className={`flex h-9 w-9 items-center justify-center rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition ${
                      isBookmarked
                        ? 'text-amber-600 dark:text-amber-400 bg-amber-500/20 border border-amber-500/40'
                        : 'text-dharma-muted hover:text-amber-600 hover:bg-stone-500/10'
                    }`}
                    title={isBookmarked ? 'श्लोक सहेजा हुआ है (Bookmarked - B)' : 'श्लोक सहेजें (Bookmark verse - B)'}
                    aria-label="Bookmark verse"
                    aria-pressed={isBookmarked}
                  >
                    {isBookmarked ? (
                      <BookmarkCheck className="h-4 w-4 fill-current" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </button>

                  {/* Quick Share Button */}
                  <button
                    type="button"
                    onClick={handleShareVerse}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-dharma-muted hover:text-dharma-text hover:bg-stone-500/10 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition"
                    title="श्लोक साझा करें या कॉपी करें (Share verse)"
                    aria-label="Share verse"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>

                  {/* Minimize to Pill Button */}
                  <button
                    type="button"
                    onClick={toggleMinimized}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-dharma-muted hover:text-dharma-text hover:bg-stone-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 transition"
                    title="लघु रूप में बदलें (Minimize player)"
                    aria-label="Minimize player"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </button>

                  {/* Stop & Dismiss Button */}
                  <button
                    type="button"
                    onClick={handleStop}
                    className="flex h-9 w-9 items-center justify-center rounded-xl text-dharma-muted hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 transition"
                    title="पाठ समाप्त करें (Stop - Esc)"
                    aria-label="Stop recitation"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Pada & Meaning segmented progress indicator bar */}
              <div className="absolute inset-x-0 bottom-0 h-1 bg-amber-500/10 flex">
                {Array.from({ length: Math.max(1, state.totalLines || 4) }).map((_, idx) => {
                  const isPast = typeof state.lineIndex === 'number'
                    ? idx < state.lineIndex
                    : state.lineIndex === 'meaning'
                    ? true
                    : false;
                  const isCurrent = typeof state.lineIndex === 'number'
                    ? idx === state.lineIndex
                    : state.lineIndex === 'meaning' && idx === (state.totalLines || 4) - 1;

                  return (
                    <div
                      key={idx}
                      className="flex-1 h-full border-r border-amber-500/20 last:border-r-0 transition-all duration-300 relative overflow-hidden"
                    >
                      {isPast && <div className="h-full w-full bg-amber-500" />}
                      {isCurrent && (
                        <motion.div
                          className="h-full bg-gradient-to-r from-amber-500 to-amber-300"
                          animate={{ opacity: [0.6, 1, 0.6] }}
                          transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.aside>
        )
      )}
    </AnimatePresence>
  );
}
