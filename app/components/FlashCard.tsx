'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useReducedMotion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { ChevronRight, ChevronLeft, RotateCcw, Volume2, Shuffle, Keyboard, BarChart3 } from 'lucide-react';

export interface FlashCardData {
  front: {
    sanskrit?: string;
    transliteration?: string;
    question: string;
  };
  back: {
    hindi?: string;
    english: string;
    explanation?: string;
    keywords?: string[];
  };
  difficulty?: 'easy' | 'medium' | 'hard';
}

export function FlashCard({ data, onNext, onPrevious, onReset, currentIndex, total, onShuffle, spacedRepetitionMode = false }: {
  data: FlashCardData;
  onNext: () => void;
  onPrevious: () => void;
  onReset: () => void;
  currentIndex: number;
  total: number;
  onShuffle?: () => void;
  spacedRepetitionMode?: boolean;
}) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const rotateX = useTransform(x, [-200, 200], [15, -15]);

  const handleFlip = useCallback(() => {
    setIsFlipped(i => !i);
  }, []);

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setShowHint(false);
    onNext();
  }, [onNext]);

  const handlePrevious = useCallback(() => {
    setIsFlipped(false);
    setShowHint(false);
    onPrevious();
  }, [onPrevious]);

  const handleReset = useCallback(() => {
    setIsFlipped(false);
    setShowHint(false);
    onReset();
  }, [onReset]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFlip();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'r' || e.key === 'R') {
        handleReset();
      } else if (e.key === 's' || e.key === 'S') {
        onShuffle?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrevious, handleReset, onShuffle]);

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (info.offset.x > 100) {
      handlePrevious();
    } else if (info.offset.x < -100) {
      handleNext();
    }
  };

  const progress = ((currentIndex + 1) / total) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2 text-sm text-dharma-muted">
          <span className="font-semibold">
            Card {currentIndex + 1} of {total}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-70">
              {Math.round(progress)}% complete
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={handleReset}
                className="p-2 rounded-lg hover:bg-saffron-50 transition"
                title="Reset to first card (R)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              {onShuffle && (
                <button
                  onClick={onShuffle}
                  className="p-2 rounded-lg hover:bg-saffron-50 transition"
                  title="Shuffle cards (S)"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
        <div className="w-full h-2 bg-dharma-border rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-saffron-500 to-amber-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Keyboard hint */}
      <div className="flex items-center justify-center gap-4 mb-4 text-xs text-dharma-muted">
        <span className="flex items-center gap-1">
          <Keyboard className="w-3 h-3" />
          Space/Enter: Flip
        </span>
        <span className="flex items-center gap-1">
          <Keyboard className="w-3 h-3" />
          ← →: Navigate
        </span>
      </div>

      {/* Flash Card */}
      <motion.div
        ref={cardRef}
        className="relative w-full min-h-[400px] perspective-1000"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        style={{ x, rotateX }}
      >
        <motion.div
          className="relative w-full h-full cursor-pointer"
          onClick={handleFlip}
          animate={reduce ? {} : { rotateY: isFlipped ? 180 : 0 }}
          transition={reduce ? {} : { duration: 0.6, type: 'spring', stiffness: 300, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
          role="button"
          tabIndex={0}
          aria-label={isFlipped ? 'Card showing answer - click to show question' : 'Card showing question - click to reveal answer'}
          onKeyDown={(e) => {
            if (e.key === ' ' || e.key === 'Enter') {
              e.preventDefault();
              handleFlip();
            }
          }}
        >
          {/* Front of card */}
          <motion.div
            className="absolute inset-0 backface-hidden bg-gradient-to-br from-saffron-50 to-amber-50 rounded-3xl border-2 border-saffron-200 p-8 shadow-xl"
            style={{ backfaceVisibility: 'hidden' }}
            animate={reduce ? {} : { rotateY: isFlipped ? 180 : 0 }}
          >
            <div className="h-full flex flex-col justify-center items-center text-center">
              {data.front.sanskrit && (
                <p
                  lang="sa"
                  className="font-devanagari text-4xl text-saffron-800 mb-4 leading-relaxed"
                >
                  {data.front.sanskrit}
                </p>
              )}
              {data.front.transliteration && (
                <p className="text-lg text-saffron-600 italic mb-6">
                  {data.front.transliteration}
                </p>
              )}
              <p className="text-2xl font-serif font-bold text-dharma-text mb-4">
                {data.front.question}
              </p>
              <p className="text-sm text-dharma-muted mt-4 animate-pulse">
                Click or press Space to reveal answer
              </p>
            </div>
          </motion.div>

          {/* Back of card */}
          <motion.div
            className="absolute inset-0 backface-hidden bg-gradient-to-br from-dharma-card to-saffron-50/20 rounded-3xl border-2 border-saffron-200 p-8 shadow-xl"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            animate={reduce ? {} : { rotateY: isFlipped ? 0 : -180 }}
          >
            <div className="h-full flex flex-col justify-center">
              {data.back.hindi && (
                <p
                  lang="hi"
                  className="font-devanagari text-2xl text-rose-800 mb-4 font-semibold"
                >
                  {data.back.hindi}
                </p>
              )}
              <p className="text-xl text-dharma-text mb-4 leading-relaxed">
                {data.back.english}
              </p>
              {data.back.explanation && (
                <p className="text-sm text-dharma-muted leading-relaxed mb-4">
                  {data.back.explanation}
                </p>
              )}
              {data.back.keywords && data.back.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {data.back.keywords.map((keyword, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-saffron-100 text-saffron-800 rounded-full text-xs font-semibold"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              )}

              {/* Spaced repetition controls */}
              {spacedRepetitionMode && (
                <div className="mt-6 pt-4 border-t border-dharma-border">
                  <p className="text-xs text-dharma-muted mb-3 font-semibold uppercase tracking-wider">
                    How well did you know this?
                  </p>
                  <div className="flex gap-2">
                    {(['easy', 'medium', 'hard'] as const).map((level) => (
                      <button
                        key={level}
                        onClick={() => {
                          setDifficulty(level);
                          handleNext();
                        }}
                        className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                          level === 'easy'
                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                            : level === 'medium'
                            ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                            : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                        }`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-6 py-3 bg-dharma-card border border-dharma-border rounded-full font-semibold hover:bg-saffron-50/20 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          aria-label="Previous card"
        >
          <ChevronLeft className="w-4 h-4" />
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentIndex === total - 1}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-saffron-600 to-amber-600 text-white rounded-full font-semibold hover:from-saffron-700 hover:to-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          aria-label="Next card"
        >
          Next
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile swipe hint */}
      <div className="text-center mt-4 text-xs text-dharma-muted md:hidden">
        Swipe left/right to navigate cards
      </div>
    </div>
  );
}
