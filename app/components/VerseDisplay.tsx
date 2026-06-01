'use client';

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { List, Network, Feather, Languages, Sun, ScrollText, Sparkles, Atom, Lightbulb } from 'lucide-react';
import { VerseMindMap, type MindMapVerse } from './VerseMindMap';

export interface VerseDisplayData extends MindMapVerse {
  transliteration?: string;
}

type ViewMode = 'list' | 'mindmap';

export function VerseDisplay({ verse }: { verse: VerseDisplayData }) {
  const reduce = useReducedMotion();
  const [mode, setMode] = useState<ViewMode>('list');

  const explanation = verse.explanationHi ?? verse.explanation;
  const explanationIsHi = Boolean(verse.explanationHi);
  const science = verse.scienceHi ?? verse.science;
  const scienceIsHi = Boolean(verse.scienceHi);
  const lesson = verse.lifeLessonHi ?? verse.lifeLesson;
  const lessonIsHi = Boolean(verse.lifeLessonHi);

  return (
    <div className="verse-card lotus-card">
      {/* Header bar — verse number + view toggle. */}
      <div className="bg-gradient-to-r from-saffron-50 via-amber-50 to-rose-50 px-6 py-4 border-b border-dharma-border flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="verse-number">{verse.id}</span>
          <div>
            <div className="text-[10px] uppercase tracking-widest text-saffron-800/70 font-semibold">श्लोक</div>
            <div className="text-sm font-bold text-saffron-900">श्लोक {verse.id}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div
            className="inline-flex items-center rounded-full bg-white border border-dharma-border shadow-sm p-0.5"
            role="tablist"
            aria-label="Verse view mode"
          >
            <ToggleButton
              active={mode === 'list'}
              onClick={() => setMode('list')}
              icon={<List className="w-3.5 h-3.5" />}
              label="List"
            />
            <ToggleButton
              active={mode === 'mindmap'}
              onClick={() => setMode('mindmap')}
              icon={<Network className="w-3.5 h-3.5" />}
              label="Mind Map"
            />
          </div>
          <span className="om-symbol text-3xl animate-float hidden md:inline" aria-hidden>ॐ</span>
        </div>
      </div>

      {/* Body — animated swap between list and mindmap. */}
      <div className="p-6 md:p-7">
        <AnimatePresence mode="wait">
          {mode === 'list' ? (
            <motion.div
              key="list"
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-5"
            >
              <div className="section-sanskrit">
                <div className="section-label text-saffron-800">
                  <Feather className="w-3.5 h-3.5" />
                  संस्कृत
                </div>
                <p className="sanskrit-text text-dharma-text whitespace-pre-line">{verse.sanskrit}</p>
              </div>

              {verse.transliteration && (
                <div className="section-translit">
                  <div className="section-label text-stone-700">
                    <Languages className="w-3.5 h-3.5" />
                    लिप्यंतरण (IAST)
                  </div>
                  <p className="text-sm md:text-base text-stone-700 italic whitespace-pre-line leading-relaxed">{verse.transliteration}</p>
                </div>
              )}

              {verse.hindi && (
                <div className="section-hindi">
                  <div className="section-label text-rose-800">
                    <Sun className="w-3.5 h-3.5" />
                    हिन्दी अर्थ
                  </div>
                  <p className="text-base md:text-lg text-rose-950 leading-loose">{verse.hindi}</p>
                </div>
              )}

              {verse.translation && (
                <div className="section-translation">
                  <div className="section-label text-blue-800">
                    <ScrollText className="w-3.5 h-3.5" />
                    अनुवाद
                  </div>
                  <p className="text-base text-dharma-text leading-relaxed">{verse.translation}</p>
                </div>
              )}

              {explanation && (
                <div className="section-explanation">
                  <div className="section-label text-emerald-800">
                    <Sparkles className="w-3.5 h-3.5" />
                    {explanationIsHi ? 'आध्यात्मिक व्याख्या' : 'अंग्रेज़ी व्याख्या'}
                  </div>
                  <p className={`text-sm md:text-base text-emerald-950 leading-relaxed ${explanationIsHi ? 'font-devanagari' : ''}`}>{explanation}</p>
                </div>
              )}

              {science && (
                <div className="section-science">
                  <div className="section-label text-indigo-800">
                    <Atom className="w-3.5 h-3.5" />
                    {scienceIsHi ? 'वैज्ञानिक दृष्टिकोण' : 'अंग्रेज़ी वैज्ञानिक दृष्टिकोण'}
                  </div>
                  <p className={`text-sm md:text-base text-indigo-950 leading-relaxed ${scienceIsHi ? 'font-devanagari' : ''}`}>{science}</p>
                </div>
              )}

              {lesson && (
                <div className="section-lesson">
                  <div className="section-label text-amber-800">
                    <Lightbulb className="w-3.5 h-3.5" />
                    {lessonIsHi ? 'जीवन की सीख — आज अपनाएँ' : 'अंग्रेज़ी जीवन की सीख'}
                  </div>
                  <p className={`text-sm md:text-base text-amber-950 leading-relaxed font-medium ${lessonIsHi ? 'font-devanagari' : ''}`}>{lesson}</p>
                </div>
              )}

              {verse.keywords && verse.keywords.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {verse.keywords.map((k) => (
                    <span key={k} className="chip chip-saffron">
                      #{k}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="mindmap"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <VerseMindMap verse={verse} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ToggleButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
        active ? 'text-white' : 'text-dharma-muted hover:text-dharma-text'
      }`}
      role="tab"
      aria-selected={active}
    >
      {active && (
        <motion.span
          layoutId="verse-view-toggle-pill"
          className="absolute inset-0 rounded-full bg-gradient-to-br from-saffron-500 to-saffron-700 shadow-md"
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      )}
      <span className="relative inline-flex items-center gap-1.5">
        {icon}
        {label}
      </span>
    </button>
  );
}
