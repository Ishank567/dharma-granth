'use client';

import React from 'react';

interface CalmProgressProps {
  completed: number;
  total: number;
  label?: string;
  sublabel?: string;
  variant?: 'linear' | 'ring' | 'lotus';
  size?: 'sm' | 'md' | 'lg';
  showPercentage?: boolean;
  className?: string;
}

export function CalmProgress({
  completed,
  total,
  label = 'अध्ययन यात्रा (Contemplative Progress)',
  sublabel,
  variant = 'linear',
  size = 'md',
  showPercentage = true,
  className = '',
}: CalmProgressProps) {
  const safeTotal = Math.max(total, 1);
  const percentage = Math.min(Math.round((completed / safeTotal) * 100), 100);
  const isFinished = completed >= total && total > 0;

  // Meditative Sanskrit aphorism based on progress
  const getMeditativeEncouragement = () => {
    if (completed === 0) return 'आरम्भो ज्ञानस्य दीपः — Every journey begins with a quiet breath of inquiry.';
    if (isFinished) return 'सिद्धो भवति तृप्तो भवति — Completed in fullness. Wisdom integrated.';
    if (percentage > 70) return 'शनैः शनैरुपरमेत् — Steadily, step by step, the mind settles in quiet understanding.';
    return 'अभ्यासेन वैराग्येण च — Nurtured through peaceful practice and steady contemplation.';
  };

  if (variant === 'ring') {
    const radius = size === 'sm' ? 22 : size === 'lg' ? 44 : 32;
    const strokeWidth = size === 'sm' ? 3.5 : size === 'lg' ? 5.5 : 4.5;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const dim = (radius + strokeWidth) * 2;

    return (
      <div className={`flex items-center gap-3.5 select-none ${className}`}>
        <div className="relative flex items-center justify-center" style={{ width: dim, height: dim }}>
          <svg className="transform -rotate-90" width={dim} height={dim}>
            {/* Background ring */}
            <circle
              cx={radius + strokeWidth}
              cy={radius + strokeWidth}
              r={radius}
              className="stroke-amber-100/70 dark:stroke-stone-800"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress ring in warm terracotta / saffron */}
            <circle
              cx={radius + strokeWidth}
              cy={radius + strokeWidth}
              r={radius}
              className="stroke-saffron-600 dark:stroke-saffron-400 transition-all duration-700 ease-out"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col text-center">
            <span
              className={`font-serif font-bold text-dharma-text leading-none ${
                size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'
              }`}
            >
              {percentage}%
            </span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-serif font-bold text-dharma-text tracking-wide truncate">
              {label}
            </span>
            <span className="text-[11px] font-sans px-2 py-0.5 rounded-full bg-saffron-50 dark:bg-stone-800/80 text-saffron-800 dark:text-saffron-300 border border-saffron-200/50 dark:border-stone-700">
              {completed} / {total} lessons
            </span>
          </div>
          <p className="text-[11px] text-dharma-muted italic mt-0.5 truncate font-serif">
            {sublabel || getMeditativeEncouragement()}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full select-none ${className}`}>
      {/* Header bar */}
      <div className="flex items-center justify-between mb-2 gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-serif font-bold text-dharma-text tracking-wide">
            {label}
          </span>
          <span className="text-dharma-muted">
            • {completed} of {total} lessons integrated
          </span>
        </div>
        {showPercentage && (
          <span className="font-serif font-bold text-saffron-700 dark:text-saffron-300">
            {percentage}%
          </span>
        )}
      </div>

      {/* Gentle parchment / sand bar */}
      <div className="relative w-full h-2.5 bg-amber-100/60 dark:bg-stone-800/80 rounded-full overflow-hidden border border-amber-200/40 dark:border-stone-700/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-600 via-saffron-600 to-terracotta-600 dark:from-amber-500 dark:to-saffron-400 transition-all duration-700 ease-out shadow-xs"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Mindful subtitle note */}
      <p className="text-[11px] text-dharma-muted font-serif italic mt-1.5 flex items-center justify-between">
        <span>{sublabel || getMeditativeEncouragement()}</span>
        {isFinished && (
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold not-italic">
            पूर्णम् (Complete)
          </span>
        )}
      </p>
    </div>
  );
}
