'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ChevronDown } from 'lucide-react';

interface ReadingProgressIndicatorProps {
  totalVerses: number;
  currentVerse?: number;
  scriptureId?: string;
  chapterId?: string;
}

export function ReadingProgressIndicator({ 
  totalVerses, 
  currentVerse = 1,
  scriptureId,
  chapterId 
}: ReadingProgressIndicatorProps) {
  const [progress, setProgress] = useState(0);
  const [savedProgress, setSavedProgress] = useState<number | null>(null);

  useEffect(() => {
    // Calculate progress
    const newProgress = (currentVerse / totalVerses) * 100;
    setProgress(newProgress);

    // Load saved progress from localStorage
    if (scriptureId && chapterId) {
      const key = `reading-progress-${scriptureId}-${chapterId}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        setSavedProgress(parseInt(saved, 10));
      }
    }
  }, [currentVerse, totalVerses, scriptureId, chapterId]);

  useEffect(() => {
    // Save progress to localStorage
    if (scriptureId && chapterId) {
      const key = `reading-progress-${scriptureId}-${chapterId}`;
      localStorage.setItem(key, currentVerse.toString());
    }
  }, [currentVerse, scriptureId, chapterId]);

  const getProgressColor = () => {
    if (progress < 30) return 'from-rose-500 to-pink-600';
    if (progress < 60) return 'from-amber-500 to-orange-600';
    if (progress < 90) return 'from-emerald-500 to-green-600';
    return 'from-indigo-500 to-purple-600';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-dharma-border dark:border-gray-700 shadow-sm"
    >
      <div className="max-w-6xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Info */}
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <BookOpen className="w-5 h-5 text-saffron-600 dark:text-saffron-400" />
            </motion.div>
            <div>
              <p className="text-sm font-semibold text-dharma-text dark:text-gray-100">
                Verse {currentVerse} of {totalVerses}
              </p>
              <p className="text-xs text-dharma-muted dark:text-gray-400">
                {Math.round(progress)}% complete
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex-1 max-w-md">
            <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                className={`absolute top-0 left-0 h-full bg-gradient-to-r ${getProgressColor()} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* Animated shimmer effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: ['-100%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
          </div>

          {/* Saved progress indicator */}
          {savedProgress && savedProgress > currentVerse && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 text-xs text-dharma-muted dark:text-gray-400 bg-saffron-50 dark:bg-saffron-900/20 px-3 py-1.5 rounded-full border border-saffron-200 dark:border-saffron-800"
            >
              <ChevronDown className="w-3 h-3" />
              Continue from verse {savedProgress}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
