'use client';

import { motion, useReducedMotion, AnimatePresence, type PanInfo } from 'framer-motion';
import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Feather, Sun, ScrollText, Sparkles, Atom, Lightbulb, X } from 'lucide-react';
import { useTheme, type Theme } from './ThemeProvider';

export interface MindMapVerse {
  id: number | string;
  number?: number | string;
  sanskrit: string;
  transliteration?: string;
  translation?: string;
  hindi?: string;
  explanation?: string;
  explanationHi?: string;
  science?: string;
  scienceHi?: string;
  lifeLesson?: string;
  lifeLessonHi?: string;
  keywords?: string[];
}

type SlotId = 'sanskrit' | 'hindi' | 'translation' | 'explanation' | 'science' | 'lesson';

interface BranchSpec {
  id: SlotId;
  label: string;
  labelHi: string;
  text: string;
  icon: React.ReactNode;
  isDevanagari?: boolean;
}

interface ColorSet {
  stroke: string;
  cardBg: string; // tailwind gradient classes — must be statically present for scan
  cardBorder: string;
  glow: string;
}

/**
 * Per-theme palette assignments for each branch slot. The slot ID is
 * semantic (Sanskrit, Hindi, …) so the user knows what each card is
 * regardless of theme, but the colors shift to match the page mood.
 *
 * IMPORTANT: every gradient class string must appear as a literal
 * somewhere in the source so Tailwind's content scanner picks it up.
 * They do appear here, so Tailwind will compile them.
 */
const THEME_PALETTES: Record<Theme, Record<SlotId, ColorSet>> = {
  day: {
    sanskrit: {
      stroke: '#ea580c',
      cardBg: 'bg-gradient-to-br from-saffron-500 to-amber-600',
      cardBorder: 'border-saffron-400',
      glow: 'rgba(234, 88, 12, 0.35)',
    },
    hindi: {
      stroke: '#e11d48',
      cardBg: 'bg-gradient-to-br from-rose-500 to-pink-600',
      cardBorder: 'border-rose-400',
      glow: 'rgba(225, 29, 72, 0.35)',
    },
    translation: {
      stroke: '#2563eb',
      cardBg: 'bg-gradient-to-br from-blue-500 to-sky-600',
      cardBorder: 'border-blue-400',
      glow: 'rgba(37, 99, 235, 0.35)',
    },
    explanation: {
      stroke: '#059669',
      cardBg: 'bg-gradient-to-br from-emerald-500 to-green-600',
      cardBorder: 'border-emerald-400',
      glow: 'rgba(5, 150, 105, 0.35)',
    },
    science: {
      stroke: '#4f46e5',
      cardBg: 'bg-gradient-to-br from-indigo-500 to-violet-600',
      cardBorder: 'border-indigo-400',
      glow: 'rgba(79, 70, 229, 0.35)',
    },
    lesson: {
      stroke: '#d97706',
      cardBg: 'bg-gradient-to-br from-amber-500 to-yellow-600',
      cardBorder: 'border-amber-400',
      glow: 'rgba(217, 119, 6, 0.35)',
    },
  },
  sunset: {
    sanskrit: {
      stroke: '#c2410c',
      cardBg: 'bg-gradient-to-br from-orange-500 to-red-600',
      cardBorder: 'border-orange-400',
      glow: 'rgba(194, 65, 12, 0.4)',
    },
    hindi: {
      stroke: '#be185d',
      cardBg: 'bg-gradient-to-br from-pink-500 to-fuchsia-700',
      cardBorder: 'border-pink-400',
      glow: 'rgba(190, 24, 93, 0.4)',
    },
    translation: {
      stroke: '#7c2d12',
      cardBg: 'bg-gradient-to-br from-amber-700 to-orange-800',
      cardBorder: 'border-amber-600',
      glow: 'rgba(124, 45, 18, 0.4)',
    },
    explanation: {
      stroke: '#a16207',
      cardBg: 'bg-gradient-to-br from-yellow-500 to-amber-700',
      cardBorder: 'border-yellow-400',
      glow: 'rgba(161, 98, 7, 0.4)',
    },
    science: {
      stroke: '#9d174d',
      cardBg: 'bg-gradient-to-br from-rose-500 to-pink-700',
      cardBorder: 'border-rose-400',
      glow: 'rgba(157, 23, 77, 0.4)',
    },
    lesson: {
      stroke: '#b45309',
      cardBg: 'bg-gradient-to-br from-amber-500 to-orange-600',
      cardBorder: 'border-amber-400',
      glow: 'rgba(180, 83, 9, 0.4)',
    },
  },
  night: {
    sanskrit: {
      stroke: '#4338ca',
      cardBg: 'bg-gradient-to-br from-indigo-600 to-blue-800',
      cardBorder: 'border-indigo-500',
      glow: 'rgba(67, 56, 202, 0.45)',
    },
    hindi: {
      stroke: '#7c3aed',
      cardBg: 'bg-gradient-to-br from-violet-600 to-purple-800',
      cardBorder: 'border-violet-500',
      glow: 'rgba(124, 58, 237, 0.45)',
    },
    translation: {
      stroke: '#0e7490',
      cardBg: 'bg-gradient-to-br from-cyan-600 to-blue-700',
      cardBorder: 'border-cyan-500',
      glow: 'rgba(14, 116, 144, 0.45)',
    },
    explanation: {
      stroke: '#0f766e',
      cardBg: 'bg-gradient-to-br from-teal-600 to-emerald-700',
      cardBorder: 'border-teal-500',
      glow: 'rgba(15, 118, 110, 0.45)',
    },
    science: {
      stroke: '#a21caf',
      cardBg: 'bg-gradient-to-br from-fuchsia-600 to-violet-700',
      cardBorder: 'border-fuchsia-500',
      glow: 'rgba(162, 28, 175, 0.45)',
    },
    lesson: {
      stroke: '#475569',
      cardBg: 'bg-gradient-to-br from-slate-600 to-indigo-700',
      cardBorder: 'border-slate-500',
      glow: 'rgba(71, 85, 105, 0.45)',
    },
  },
};

function truncate(text: string, max: number): string {
  if (!text) return '';
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, '') + '…';
}

/**
 * Layout for the radial mindmap, expressed in "viewbox units" where
 * VB=100 is half the canvas. All geometry — radius, card width, center
 * node — uses the same unit system, so the SVG paths and the
 * absolutely-positioned cards scale together with the container. The
 * only per-viewport varying values are:
 *   - text size & padding inside the card (visual density)
 *   - truncation length (legibility at small sizes)
 *   - whether to show the Hindi sublabel
 *
 * The corner-overlap constraint for 6 cards at 60° apart: cards are at
 * distance R from origin. Adjacent card centers are also R apart
 * (chord = 2·R·sin(30°) = R). For axis-aligned square cards of width
 * W, the worst case (diagonal corner-to-corner) is R ≥ W·√2 ≈ 1.41W.
 * We use W = R·0.62 which gives ~22% diagonal clearance — comfortable.
 */
const VB = 100;
const RADIUS_VB = 56;
const CARD_WIDTH_VB = 35;
const CENTER_SIZE_VB = 32;

function computeLayout(width: number): {
  cardPadding: number;
  truncLen: number;
  showHiLabel: boolean;
} {
  const w = Math.max(280, Math.min(720, width));
  const cardPadding = w < 420 ? 5 : w < 600 ? 8 : 11;
  const truncLen = w < 420 ? 34 : w < 600 ? 58 : 90;
  const showHiLabel = w >= 420;
  return { cardPadding, truncLen, showHiLabel };
}

export function VerseMindMap({ verse }: { verse: MindMapVerse }) {
  const reduce = useReducedMotion();
  const { theme } = useTheme();
  const palettes = THEME_PALETTES[theme];
  const [focused, setFocused] = useState<SlotId | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rootRef = containerRef; // single element doubles as ResizeObserver target + keyboard root
  const [containerWidth, setContainerWidth] = useState(640);
  const verseLabel = verse.number ?? verse.id;

  useEffect(() => {
    if (!containerRef.current) return;
    const el = containerRef.current;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(el);
    setContainerWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const layout = useMemo(() => computeLayout(containerWidth), [containerWidth]);

  const branches = useMemo<BranchSpec[]>(() => {
    const list: BranchSpec[] = [];
    if (verse.sanskrit) {
      list.push({
        id: 'sanskrit',
        label: 'Sanskrit',
        labelHi: 'संस्कृत',
        text: verse.sanskrit,
        icon: <Feather className="w-3.5 h-3.5" />,
        isDevanagari: true,
      });
    }
    if (verse.hindi) {
      list.push({
        id: 'hindi',
        label: 'Hindi',
        labelHi: 'हिन्दी',
        text: verse.hindi,
        icon: <Sun className="w-3.5 h-3.5" />,
        isDevanagari: true,
      });
    }
    if (verse.translation) {
      list.push({
        id: 'translation',
        label: 'Translation',
        labelHi: 'अनुवाद',
        text: verse.translation,
        icon: <ScrollText className="w-3.5 h-3.5" />,
      });
    }
    const expl = verse.explanationHi ?? verse.explanation;
    if (expl) {
      list.push({
        id: 'explanation',
        label: 'Commentary',
        labelHi: 'व्याख्या',
        text: expl,
        icon: <Sparkles className="w-3.5 h-3.5" />,
        isDevanagari: Boolean(verse.explanationHi),
      });
    }
    const sci = verse.scienceHi ?? verse.science;
    if (sci) {
      list.push({
        id: 'science',
        label: 'Science',
        labelHi: 'विज्ञान',
        text: sci,
        icon: <Atom className="w-3.5 h-3.5" />,
        isDevanagari: Boolean(verse.scienceHi),
      });
    }
    const lesson = verse.lifeLessonHi ?? verse.lifeLesson;
    if (lesson) {
      list.push({
        id: 'lesson',
        label: 'Life Lesson',
        labelHi: 'जीवन पाठ',
        text: lesson,
        icon: <Lightbulb className="w-3.5 h-3.5" />,
        isDevanagari: Boolean(verse.lifeLessonHi),
      });
    }
    return list;
  }, [verse]);

  // Cycle focus to the next/previous branch. Used by both keyboard
  // arrow keys and horizontal swipe gestures so they stay in sync.
  const cycleFocus = useCallback(
    (delta: 1 | -1) => {
      if (branches.length === 0) return;
      const currentIdx = focused ? branches.findIndex((b) => b.id === focused) : -1;
      const nextIdx =
        currentIdx === -1
          ? delta === 1
            ? 0
            : branches.length - 1
          : (currentIdx + delta + branches.length) % branches.length;
      setFocused(branches[nextIdx].id);
    },
    [branches, focused],
  );

  // Keyboard navigation. Arrow Left/Right cycles focus; Enter focuses
  // the first branch if none focused; Escape clears. Listener is
  // attached only while the user has interacted with the mindmap
  // (i.e. the rootRef container has focus or a descendant does).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const handleKey = (e: KeyboardEvent) => {
      const active = document.activeElement;
      if (!root.contains(active)) return;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        cycleFocus(1);
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        cycleFocus(-1);
      } else if (e.key === 'Escape' && focused) {
        e.preventDefault();
        setFocused(null);
      } else if ((e.key === 'Enter' || e.key === ' ') && !focused && active === root) {
        e.preventDefault();
        cycleFocus(1);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [cycleFocus, focused, rootRef]);

  // Swipe gesture handler. Mounted on a transparent overlay so it
  // doesn't steal clicks from the branch buttons or the center node.
  // Horizontal swipe cycles focus; vertical swipe down clears focus.
  const SWIPE_THRESHOLD = 50;
  const handleSwipe = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { x, y } = info.offset;
    if (Math.abs(x) > Math.abs(y)) {
      if (x > SWIPE_THRESHOLD) cycleFocus(-1);
      else if (x < -SWIPE_THRESHOLD) cycleFocus(1);
    } else if (y > SWIPE_THRESHOLD && focused) {
      setFocused(null);
    }
  };

  const focusedBranch = branches.find((b) => b.id === focused) ?? null;

  // Layout: center at (0,0) in SVG units. Branches at equal arcs
  // starting at -90° (12 o'clock).
  const positions = branches.map((_, i) => {
    const angle = (-Math.PI / 2) + (i * (2 * Math.PI / branches.length));
    return {
      x: Math.cos(angle) * RADIUS_VB,
      y: Math.sin(angle) * RADIUS_VB,
      angle,
    };
  });

  // Pixel size of the centre node (used for box-shadow + font sizes,
  // which can't be expressed as % of an ancestor in plain CSS).
  const centerSizePx = (containerWidth * CENTER_SIZE_VB) / (VB * 2);

  return (
    <div
      className="verse-mindmap relative w-full outline-none focus-visible:ring-2 focus-visible:ring-saffron-400 focus-visible:ring-offset-2 rounded-lg"
      ref={containerRef}
      tabIndex={0}
      role="group"
      aria-label={`Verse ${verseLabel} mindmap — arrow keys to navigate branches`}
    >
      <div className="relative mx-auto w-full" style={{ maxWidth: 640, aspectRatio: '1 / 1' }}>
        {/* Swipe-gesture overlay. Sits behind interactive elements so
            taps/clicks reach branch buttons & the centre node; only
            pan events without movement on a child element propagate
            here. */}
        <motion.div
          className="absolute inset-0 z-0"
          onPanEnd={handleSwipe}
          style={{ touchAction: 'pan-y' }}
          aria-hidden
        />
        <svg
          viewBox={`-${VB} -${VB} ${VB * 2} ${VB * 2}`}
          xmlns="http://www.w3.org/2000/svg"
          className="absolute inset-0 w-full h-full"
          aria-hidden
        >
          <defs>
            <radialGradient id="grad-center-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fff7ed" stopOpacity="1" />
              <stop offset="60%" stopColor="#fed7aa" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#fed7aa" stopOpacity="0" />
            </radialGradient>
            {/* Per-branch flowing gradients along each path. */}
            {branches.map((b) => {
              const c = palettes[b.id].stroke;
              return (
                <linearGradient key={`flow-${b.id}`} id={`flow-${b.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor={c} stopOpacity="0.1" />
                  <stop offset="50%" stopColor={c} stopOpacity="1" />
                  <stop offset="100%" stopColor={c} stopOpacity="0.1" />
                </linearGradient>
              );
            })}
          </defs>

          {/* Faint outer mandala rings. */}
          <motion.circle
            cx="0"
            cy="0"
            r={RADIUS_VB + CARD_WIDTH_VB * 0.6}
            fill="none"
            stroke="rgba(234, 88, 12, 0.1)"
            strokeWidth="0.5"
            initial={reduce ? {} : { rotate: 0 }}
            animate={reduce ? {} : { rotate: 360 }}
            transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '0px 0px' }}
            strokeDasharray="2 6"
          />
          <circle
            cx="0"
            cy="0"
            r={RADIUS_VB + CARD_WIDTH_VB * 0.35}
            fill="none"
            stroke="rgba(234, 88, 12, 0.08)"
            strokeWidth="0.5"
          />

          {/* Center glow halo. */}
          <circle cx="0" cy="0" r={CENTER_SIZE_VB * 0.9} fill="url(#grad-center-glow)" />

          {/* Curved branches from center to each leaf position. Two
              layered paths per branch: a soft base + an animated
              flowing gradient overlay that pulses energy toward the
              leaf. */}
          {positions.map((pos, i) => {
            const b = branches[i];
            const palette = palettes[b.id];
            const cx = pos.x * 0.55 + Math.cos(pos.angle + Math.PI / 2) * 10;
            const cy = pos.y * 0.55 + Math.sin(pos.angle + Math.PI / 2) * 10;
            const d = `M 0 0 Q ${cx} ${cy} ${pos.x} ${pos.y}`;
            const isDimmed = focused !== null && focused !== b.id;
            return (
              <g key={b.id} opacity={isDimmed ? 0.18 : 1}>
                {/* Base path — always visible, soft. */}
                <motion.path
                  d={d}
                  stroke={palette.stroke}
                  strokeWidth={focused === b.id ? 1.2 : 0.8}
                  fill="none"
                  strokeLinecap="round"
                  opacity={0.45}
                  initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={reduce ? { duration: 0 } : { duration: 0.9, delay: 0.15 + i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                />
                {/* Flowing-energy overlay — dashed stroke whose
                    dashoffset animates, creating a pulse traveling
                    along the path. Off when reduced-motion. */}
                {!reduce && (
                  <motion.path
                    d={d}
                    stroke={palette.stroke}
                    strokeWidth={focused === b.id ? 1.4 : 1}
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray="3 7"
                    initial={{ strokeDashoffset: 0, opacity: 0 }}
                    animate={{
                      strokeDashoffset: [-10, 0],
                      opacity: [0, 0.9, 0.9, 0],
                    }}
                    transition={{
                      duration: 2.4 + i * 0.15,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: 1 + i * 0.18,
                      times: [0, 0.15, 0.85, 1],
                    }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Center node — verse number in a glowing disk. Sized as %
            of container so it scales with the SVG paths. z-10 so the
            click target sits above the swipe-pan overlay. */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          initial={reduce ? {} : { scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 200, damping: 18, delay: 0.05 }}
          style={{
            width: `${(CENTER_SIZE_VB / (VB * 2)) * 100}%`,
            aspectRatio: '1 / 1',
          }}
        >
          <button
            type="button"
            onClick={() => setFocused(null)}
            className="relative w-full h-full rounded-full bg-gradient-to-br from-saffron-500 via-saffron-600 to-amber-700 text-white shadow-2xl ring-4 ring-white flex flex-col items-center justify-center hover:scale-105 transition-transform"
            aria-label={`Verse ${verseLabel} — click to reset focus`}
          >
            <span
              className="font-devanagari leading-none"
              style={{ fontSize: centerSizePx * 0.32 }}
              aria-hidden
            >
              ॐ
            </span>
            <span
              className="uppercase tracking-widest opacity-80 mt-0.5"
              style={{ fontSize: Math.max(8, centerSizePx * 0.1) }}
            >
              श्लोक
            </span>
            <span
              className="font-bold leading-none"
              style={{ fontSize: Math.max(11, centerSizePx * 0.22) }}
            >
              {verseLabel}
            </span>
            {!reduce && (
              <>
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full pointer-events-none"
                  style={{ boxShadow: `0 0 ${centerSizePx * 0.7}px ${centerSizePx * 0.15}px rgba(234, 88, 12, 0.35)` }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                />
                {/* Concentric ring pulses outward — "ripple" effect. */}
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full border-2 border-saffron-300 pointer-events-none"
                  initial={{ opacity: 0.6, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.6 }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut' }}
                />
                <motion.span
                  aria-hidden
                  className="absolute inset-0 rounded-full border-2 border-amber-300 pointer-events-none"
                  initial={{ opacity: 0.5, scale: 1 }}
                  animate={{ opacity: 0, scale: 1.4 }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeOut', delay: 1.5 }}
                />
              </>
            )}
          </button>
        </motion.div>

        {/* Branch leaf cards — absolutely positioned around the centre.
            Each has a subtle continuous "breathe" + the focused one
            gets a stronger ring. */}
        {branches.map((b, i) => {
          const pos = positions[i];
          const palette = palettes[b.id];
          const left = 50 + (pos.x / (VB * 2)) * 100;
          const top = 50 + (pos.y / (VB * 2)) * 100;
          const isFocused = focused === b.id;
          const isDimmed = focused !== null && !isFocused;

          // Each leaf bobs on a slightly different phase so the group
          // never looks synchronised.
          const bobPhase = i * 0.6;

          return (
            <motion.button
              key={b.id}
              type="button"
              onClick={() => setFocused(isFocused ? null : b.id)}
              className={`absolute -translate-x-1/2 -translate-y-1/2 group rounded-2xl border-2 shadow-lg backdrop-blur-sm text-white ${palette.cardBg} ${palette.cardBorder} text-left transition-shadow`}
              style={{
                left: `${left}%`,
                top: `${top}%`,
                width: `${(CARD_WIDTH_VB / (VB * 2)) * 100}%`,
                padding: layout.cardPadding,
                boxShadow: isFocused
                  ? `0 12px 40px ${palette.glow}, 0 0 0 4px rgba(255,255,255,0.65)`
                  : undefined,
                opacity: isDimmed ? 0.4 : 1,
                zIndex: isFocused ? 10 : 5,
              }}
              initial={reduce ? {} : { scale: 0, opacity: 0 }}
              animate={
                reduce
                  ? {}
                  : isFocused
                    ? { scale: 1.07, opacity: 1, y: 0 }
                    : isDimmed
                      ? { scale: 0.95, opacity: 0.4, y: 0 }
                      : { scale: 1, opacity: 1, y: [0, -3, 0, 3, 0] }
              }
              transition={
                reduce
                  ? { duration: 0 }
                  : isFocused || isDimmed
                    ? { type: 'spring', stiffness: 180, damping: 18 }
                    : {
                        opacity: { type: 'spring', stiffness: 180, damping: 18, delay: 0.4 + i * 0.08 },
                        scale: { type: 'spring', stiffness: 180, damping: 18, delay: 0.4 + i * 0.08 },
                        y: {
                          duration: 5,
                          repeat: Infinity,
                          ease: 'easeInOut',
                          delay: 1.5 + bobPhase,
                        },
                      }
              }
              whileHover={reduce ? {} : { scale: 1.08, y: -4 }}
              whileTap={{ scale: 0.96 }}
              aria-pressed={isFocused}
              aria-label={`${b.label} — ${truncate(b.text, 80)}`}
            >
              <div className="flex items-center gap-1.5 mb-1 text-white/95">
                <span
                  className="inline-flex items-center justify-center rounded-md bg-white/20 backdrop-blur-sm"
                  style={{ width: 20, height: 20 }}
                >
                  {b.icon}
                </span>
                <div
                  className="uppercase tracking-widest font-bold opacity-90"
                  style={{ fontSize: containerWidth < 480 ? 8 : 9 }}
                >
                  {b.label}
                </div>
              </div>
              {layout.showHiLabel && (
                <div
                  className="font-devanagari font-bold text-white/95"
                  style={{ fontSize: 11, marginBottom: 2 }}
                >
                  {b.labelHi}
                </div>
              )}
              <p
                className={`leading-snug ${b.isDevanagari ? 'font-devanagari' : ''} text-white/90 line-clamp-3`}
                style={{ fontSize: containerWidth < 480 ? 9 : 10.5 }}
              >
                {truncate(b.text, layout.truncLen)}
              </p>
            </motion.button>
          );
        })}

        {/* Drifting sparkle particles — small dots gently floating. */}
        {!reduce && (
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1.5 h-1.5 rounded-full bg-saffron-400/50"
                style={{
                  left: `${15 + i * 10}%`,
                  top: `${20 + (i % 4) * 18}%`,
                }}
                animate={{
                  y: [0, -28, 0],
                  opacity: [0.2, 0.85, 0.2],
                  scale: [1, 1.3, 1],
                }}
                transition={{
                  duration: 4 + i * 0.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.35,
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Focused-branch detail panel. */}
      <AnimatePresence mode="wait">
        {focusedBranch && (
          <motion.div
            key={focusedBranch.id}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.3 }}
            className="mt-4 relative rounded-2xl border-2 shadow-xl p-5 md:p-6"
            style={{
              borderColor: palettes[focusedBranch.id].stroke,
              background: `linear-gradient(135deg, ${palettes[focusedBranch.id].glow.replace(/0\.\d+\)$/, '0.08)')}, transparent)`,
            }}
          >
            <button
              type="button"
              onClick={() => setFocused(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-white/80 hover:bg-white border border-dharma-border shadow-sm"
              aria-label="Close detail panel"
            >
              <X className="w-4 h-4 text-dharma-muted" />
            </button>
            <div
              className="flex items-center gap-2 mb-3"
              style={{ color: palettes[focusedBranch.id].stroke }}
            >
              <span
                className="inline-flex items-center justify-center w-8 h-8 rounded-lg"
                style={{ background: palettes[focusedBranch.id].stroke, color: 'white' }}
              >
                {focusedBranch.icon}
              </span>
              <div>
                <div className="text-[10px] uppercase tracking-widest font-bold opacity-80">{focusedBranch.label}</div>
                <div className="font-devanagari text-base font-bold">{focusedBranch.labelHi}</div>
              </div>
            </div>
            <p
              className={`text-sm md:text-base text-dharma-text leading-relaxed ${focusedBranch.isDevanagari ? 'font-devanagari' : ''} whitespace-pre-line`}
            >
              {focusedBranch.text}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Keywords row — slim chips below everything. */}
      {verse.keywords && verse.keywords.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {verse.keywords.map((k) => (
            <span key={k} className="chip chip-saffron">
              #{k}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
