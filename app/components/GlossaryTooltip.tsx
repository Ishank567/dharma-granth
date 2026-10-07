'use client';

import { useState, useRef, useEffect, type ReactNode } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { BookOpen, ExternalLink, Sparkles, X } from 'lucide-react';
import { dictionary, termCategories, type DictionaryTerm } from '@/data/dictionary';
import { triggerTactileFeedback } from '@/lib/haptics';

// Map of Devanagari forms and synonyms to dictionary terms
const TERM_LOOKUP = new Map<string, DictionaryTerm>();

// Initialize lookup map once
for (const item of dictionary) {
  // Direct Devanagari term (e.g. 'धर्म', 'सत्य')
  TERM_LOOKUP.set(item.sanskrit.trim(), item);

  // Common inflections & variants
  const sanskrit = item.sanskrit.trim();
  TERM_LOOKUP.set(sanskrit + 'ः', item);
  TERM_LOOKUP.set(sanskrit + 'म्', item);
  TERM_LOOKUP.set(sanskrit + 'स्य', item);
  TERM_LOOKUP.set(sanskrit + 'े', item);

  // Common root stems
  if (sanskrit === 'आत्मन्') {
    TERM_LOOKUP.set('आत्मा', item);
    TERM_LOOKUP.set('आत्म', item);
  }
  if (sanskrit === 'ब्रह्मन्') {
    TERM_LOOKUP.set('ब्रह्म', item);
    TERM_LOOKUP.set('ब्रह्मा', item);
  }
  if (sanskrit === 'तपस्') {
    TERM_LOOKUP.set('तप', item);
    TERM_LOOKUP.set('तपः', item);
  }
}

// Regex matching whole word boundary in Devanagari
const SANSKRIT_KEYWORDS = Array.from(TERM_LOOKUP.keys())
  .sort((a, b) => b.length - a.length)
  .join('|');

const GLOSSARY_REGEX = new RegExp(`(?<=^|[\\s।,॥\\[\\]\\(\\)\\-])(${SANSKRIT_KEYWORDS})(?=[\\s।,॥\\[\\]\\(\\)\\-]|$)`, 'g');

export interface GlossaryTooltipProps {
  term: DictionaryTerm;
  children: ReactNode;
}

export function GlossaryTooltip({ term, children }: GlossaryTooltipProps) {
  const [open, setOpen] = useState(false);
  const [placement, setPlacement] = useState<'top' | 'bottom'>('top');
  const [align, setAlign] = useState<'center' | 'left' | 'right'>('center');
  const containerRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const categoryMeta = termCategories.find((c) => c.key === term.category);

  function handleMouseEnter() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setOpen(true);
      triggerTactileFeedback('light', 'softTap');
    }, 180);
  }

  function handleMouseLeave() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setOpen(false);
    }, 250);
  }

  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    setOpen((prev) => !prev);
    triggerTactileFeedback('medium', 'softTap');
  }

  // Calculate viewport boundaries and flip/align to prevent clipping off-screen
  useEffect(() => {
    if (!open || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();

    // If less than 240px from the top of the viewport, flip below the trigger
    if (rect.top < 240) {
      setPlacement('bottom');
    } else {
      setPlacement('top');
    }

    const screenWidth = window.innerWidth;
    const halfCardWidth = 150;
    const centerX = rect.left + rect.width / 2;

    if (centerX < halfCardWidth + 16) {
      setAlign('left');
    } else if (screenWidth - centerX < halfCardWidth + 16) {
      setAlign('right');
    } else {
      setAlign('center');
    }
  }, [open]);

  // Dismiss on clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent | PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('pointerdown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [open]);

  // Dismiss on Escape key and restore focus to trigger
  useEffect(() => {
    if (!open) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open]);

  const dialogId = `glossary-dialog-${term.id}`;
  const triggerId = `glossary-trigger-${term.id}`;

  const positionClasses = [
    placement === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
    align === 'left' ? 'left-0' : align === 'right' ? 'right-0' : 'left-1/2 -translate-x-1/2',
  ].join(' ');

  return (
    <span
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative inline-block"
    >
      <span
        ref={triggerRef}
        id={triggerId}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick(e as unknown as React.MouseEvent);
          }
        }}
        role="button"
        tabIndex={0}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        className="cursor-pointer border-b border-dashed border-amber-600/50 hover:border-amber-600 text-amber-900 dark:text-amber-200 transition-colors font-medium decoration-amber-500/40 underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/80 rounded px-0.5"
        title={`${term.term} (${term.sanskrit}) — शब्दार्थ देखें`}
      >
        {children}
      </span>

      <AnimatePresence>
        {open && (
          <motion.div
            id={dialogId}
            initial={{ opacity: 0, y: placement === 'top' ? 6 : -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: placement === 'top' ? 4 : -4, scale: 0.96 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            role="dialog"
            aria-label={`${term.term} शब्दार्थ`}
            className={`absolute z-50 w-72 sm:w-80 max-w-[calc(100vw-2rem)] rounded-2xl border border-amber-500/30 bg-dharma-card/95 backdrop-blur-xl p-4 shadow-2xl ring-1 ring-amber-500/10 text-left text-dharma-text pointer-events-auto ${positionClasses}`}
          >
            {/* Header: Term & Category */}
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-lg font-bold text-amber-700 dark:text-amber-300" lang="sa">
                    {term.sanskrit}
                  </span>
                  <span className="text-xs font-semibold text-dharma-muted">
                    ({term.transliteration})
                  </span>
                </div>
                <h4 className="text-sm font-bold text-dharma-text">{term.term}</h4>
              </div>

              {categoryMeta && (
                <span className="shrink-0 rounded-full bg-amber-500/15 border border-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:text-amber-300">
                  {categoryMeta.label}
                </span>
              )}
            </div>

            {/* Root Etymology */}
            {term.etymology && (
              <div className="mb-2.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 px-2.5 py-1.5 border border-amber-200/50 dark:border-amber-900/30">
                <p className="text-[11px] text-amber-900/90 dark:text-amber-200/90 leading-relaxed font-sans">
                  <span className="font-semibold text-amber-800 dark:text-amber-300">व्युत्पत्ति: </span>
                  {term.etymology.length > 120 ? term.etymology.slice(0, 118) + '...' : term.etymology}
                </p>
              </div>
            )}

            {/* Short Definition */}
            <p className="text-xs leading-relaxed text-dharma-text/90 mb-3 font-sans line-clamp-3">
              {term.shortDef}
            </p>

            {/* Footer with Link to Dictionary */}
            <div className="pt-2 border-t border-dharma-border/60 flex items-center justify-between">
              <Link
                href={`/dictionary/${term.id}`}
                className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded transition"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>विस्तृत अर्थ देखें</span>
                <span aria-hidden="true">→</span>
              </Link>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-1 rounded-md text-dharma-muted hover:text-dharma-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 transition"
                aria-label="बंद करें"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

/**
 * Automatically parses text, detects key philosophical terms,
 * and wraps them with the interactive GlossaryTooltip.
 */
export function GlossaryText({ text }: { text: string }) {
  if (!text) return null;

  const parts: ReactNode[] = [];
  let lastIndex = 0;

  // Create isolated regex instance per execution to prevent shared state issues in concurrent rendering
  const regex = new RegExp(GLOSSARY_REGEX.source, 'g');
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const matchedWord = match[1];
    const matchStart = match.index;
    const matchEnd = matchStart + matchedWord.length;

    // Append preceding plain text
    if (matchStart > lastIndex) {
      parts.push(text.slice(lastIndex, matchStart));
    }

    const term = TERM_LOOKUP.get(matchedWord);
    if (term) {
      parts.push(
        <GlossaryTooltip key={`glossary-${matchStart}`} term={term}>
          {matchedWord}
        </GlossaryTooltip>
      );
    } else {
      parts.push(matchedWord);
    }

    lastIndex = matchEnd;
  }

  // Append any remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <>{parts.length > 0 ? parts : text}</>;
}
