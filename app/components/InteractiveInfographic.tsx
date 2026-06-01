'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Printer, Bookmark, Share2, Check } from 'lucide-react';

export interface InfographicSection {
  id: string;
  type: 'verse' | 'concept' | 'comparison' | 'flow';
  title: string;
  titleSanskrit?: string;
  content: {
    sanskrit?: string;
    transliteration?: string;
    hindi?: string;
    english: string;
    explanation?: string;
  };
  visual?: {
    icon?: string;
    color?: string;
    diagram?: string;
  };
  connections?: string[];
}

interface InteractiveInfographicProps {
  sections: InfographicSection[];
  className?: string;
}

export function InteractiveInfographic({ sections, className = '' }: InteractiveInfographicProps) {
  const reduce = useReducedMotion();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [bookmarkedSections, setBookmarkedSections] = useState<Set<string>>(new Set());
  const [printMode, setPrintMode] = useState(false);

  // Load bookmarks from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('bookmarkedSections');
    if (saved) {
      setBookmarkedSections(new Set(JSON.parse(saved)));
    }
  }, []);

  // Save bookmarks to localStorage
  useEffect(() => {
    if (bookmarkedSections.size > 0) {
      localStorage.setItem('bookmarkedSections', JSON.stringify(Array.from(bookmarkedSections)));
    }
  }, [bookmarkedSections]);

  const toggleBookmark = (sectionId: string) => {
    setBookmarkedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const handlePrint = () => {
    setPrintMode(true);
    window.print();
    setTimeout(() => setPrintMode(false), 100);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Interactive Learning Path - Dharma Granth',
          text: 'Explore the connections between ancient wisdom and modern knowledge',
          url: window.location.href,
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const getSectionColor = (type: string, index: number) => {
    const colors = [
      { bg: 'from-saffron-500 to-amber-600', border: 'border-saffron-400' },
      { bg: 'from-indigo-500 to-blue-600', border: 'border-indigo-400' },
      { bg: 'from-emerald-500 to-green-600', border: 'border-emerald-400' },
      { bg: 'from-rose-500 to-pink-600', border: 'border-rose-400' },
      { bg: 'from-purple-500 to-violet-600', border: 'border-purple-400' },
    ];
    return colors[index % colors.length];
  };

  return (
    <div className={`interactive-infographic ${className} ${printMode ? 'print-mode' : ''}`}>
      {/* Header */}
      <div className="text-center mb-12">
        <motion.h2
          initial={reduce ? {} : { opacity: 0, y: -20 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          className="text-4xl font-serif font-bold text-dharma-text mb-4"
        >
          Interactive Learning Path
        </motion.h2>
        <motion.p
          initial={reduce ? {} : { opacity: 0 }}
          animate={reduce ? {} : { opacity: 1 }}
          transition={reduce ? {} : { delay: 0.2 }}
          className="text-dharma-muted text-lg"
        >
          Click on any section to explore deeper connections
        </motion.p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-2 mb-8 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-dharma-border rounded-lg text-sm font-semibold hover:bg-saffron-50 transition"
          title="Print this infographic"
        >
          <Printer className="w-4 h-4" />
          Print
        </button>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-dharma-border rounded-lg text-sm font-semibold hover:bg-saffron-50 transition"
          title="Share this infographic"
        >
          <Share2 className="w-4 h-4" />
          Share
        </button>
        <div className="text-sm text-dharma-muted">
          {bookmarkedSections.size} bookmarked
        </div>
      </div>

      {/* Infographic Grid */}
      <div className="grid gap-6">
        {sections.map((section, index) => {
          const colors = getSectionColor(section.type, index);
          const isActive = activeSection === section.id;
          const isHovered = hoveredSection === section.id;
          const isBookmarked = bookmarkedSections.has(section.id);

          return (
            <motion.div
              key={section.id}
              initial={reduce ? {} : { opacity: 0, y: 30 }}
              animate={reduce ? {} : { opacity: 1, y: 0 }}
              transition={reduce ? {} : { delay: index * 0.1 }}
              className="relative"
            >
              {/* Connection line */}
              {index > 0 && (
                <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-gradient-to-b from-dharma-border to-saffron-300 transform -translate-x-1/2" />
              )}

              {/* Section card */}
              <motion.div
                className={`relative bg-white rounded-3xl border-2 shadow-lg cursor-pointer transition-all ${
                  isActive ? 'shadow-2xl scale-105' : 'hover:shadow-xl hover:scale-[1.02]'
                } ${isActive ? colors.border : 'border-dharma-border'}`}
                onClick={() => setActiveSection(isActive ? null : section.id)}
                onMouseEnter={() => setHoveredSection(section.id)}
                onMouseLeave={() => setHoveredSection(null)}
                whileHover={reduce ? {} : { scale: 1.02 }}
                whileTap={reduce ? {} : { scale: 0.98 }}
              >
                {/* Bookmark button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(section.id);
                  }}
                  className={`absolute top-4 right-4 p-2 rounded-full transition-all ${
                    isBookmarked
                      ? 'bg-saffron-100 text-saffron-700'
                      : 'bg-white text-dharma-muted hover:bg-saffron-50'
                  } shadow-md`}
                  title={isBookmarked ? 'Remove bookmark' : 'Bookmark this section'}
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>

                {/* Number indicator */}
                <div
                  className={`absolute -top-4 -left-4 w-12 h-12 rounded-full bg-gradient-to-br ${colors.bg} text-white flex items-center justify-center font-bold text-xl shadow-lg`}
                >
                  {index + 1}
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4 pr-12">
                    <div className="flex-1">
                      {section.titleSanskrit && (
                        <p lang="sa" className="font-devanagari text-2xl text-saffron-700 mb-2">
                          {section.titleSanskrit}
                        </p>
                      )}
                      <h3 className="text-2xl font-serif font-bold text-dharma-text">
                        {section.title}
                      </h3>
                    </div>
                    {section.visual?.icon && (
                      <div className="text-4xl ml-4">{section.visual.icon}</div>
                    )}
                  </div>

                  {/* Verse/Content */}
                  <div className="space-y-4">
                    {section.content.sanskrit && (
                      <div className="bg-gradient-to-r from-saffron-50 to-amber-50 rounded-xl p-4 border border-saffron-200">
                        <p lang="sa" className="font-devanagari text-xl text-saffron-800 leading-relaxed">
                          {section.content.sanskrit}
                        </p>
                        {section.content.transliteration && (
                          <p className="text-sm text-saffron-600 italic mt-2">
                            {section.content.transliteration}
                          </p>
                        )}
                      </div>
                    )}

                    {section.content.hindi && (
                      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-4 border border-rose-200">
                        <p lang="hi" className="font-devanagari text-lg text-rose-800 leading-relaxed">
                          {section.content.hindi}
                        </p>
                      </div>
                    )}

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
                      <p className="text-dharma-text leading-relaxed">
                        {section.content.english}
                      </p>
                    </div>

                    {isActive && section.content.explanation && (
                      <motion.div
                        initial={reduce ? {} : { opacity: 0, height: 0 }}
                        animate={reduce ? {} : { opacity: 1, height: 'auto' }}
                        className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-200"
                      >
                        <p className="text-dharma-muted leading-relaxed">
                          {section.content.explanation}
                        </p>
                      </motion.div>
                    )}
                  </div>

                  {/* Connections */}
                  {section.connections && section.connections.length > 0 && isActive && (
                    <motion.div
                      initial={reduce ? {} : { opacity: 0, y: 10 }}
                      animate={reduce ? {} : { opacity: 1, y: 0 }}
                      className="mt-4 pt-4 border-t border-dharma-border"
                    >
                      <p className="text-xs font-bold text-dharma-muted uppercase tracking-wider mb-2">
                        Connected Concepts
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {section.connections.map((conn, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-saffron-100 text-saffron-800 rounded-full text-xs font-semibold"
                          >
                            {conn}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Animated border effect */}
                {isHovered && !reduce && (
                  <motion.div
                    className="absolute inset-0 rounded-3xl border-2 border-saffron-400 opacity-50"
                    initial={reduce ? {} : { scale: 0.95, opacity: 0 }}
                    animate={reduce ? {} : { scale: 1.05, opacity: 0 }}
                    transition={reduce ? {} : { duration: 0.5 }}
                  />
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>

      {/* Summary section */}
      <motion.div
        initial={reduce ? {} : { opacity: 0, y: 30 }}
        animate={reduce ? {} : { opacity: 1, y: 0 }}
        transition={reduce ? {} : { delay: sections.length * 0.1 }}
        className="mt-12 bg-gradient-to-r from-saffron-600 to-amber-600 rounded-3xl p-8 text-white text-center shadow-2xl"
      >
        <h3 className="text-2xl font-serif font-bold mb-3">
          Complete the Journey
        </h3>
        <p className="opacity-90 max-w-2xl mx-auto">
          Explore each section to understand the deeper connections between ancient wisdom and modern knowledge.
        </p>
      </motion.div>

      {/* Print styles */}
      <style jsx global>{`
        @media print {
          .print-mode {
            background: white !important;
          }
          .print-mode button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
