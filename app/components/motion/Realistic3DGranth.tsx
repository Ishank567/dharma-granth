'use client';

import { useRef, useState, type PointerEvent } from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { BookOpen, Sparkles, Flame, ArrowRight } from 'lucide-react';
import { triggerTactileFeedback } from '@/lib/haptics';

export function Realistic3DGranth({
  className = '',
  title = 'श्रीमद्भगवद्गीता',
  subTitle = 'The Divine Song of Wisdom',
  verseCount = '700 श्लोक · १८ अध्याय',
  href = '/scripture/bhagavadgita',
}: {
  className?: string;
  title?: string;
  subTitle?: string;
  verseCount?: string;
  href?: string;
}) {
  const reduce = useReducedMotion();
  const bookRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Normalised pointer position (-0.5 to 0.5)
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  const spring = { stiffness: 220, damping: 20, mass: 0.6 };
  const smoothX = useSpring(px, spring);
  const smoothY = useSpring(py, spring);

  // 3D rotations for the book
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [16, -16]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-24, 24]);

  // Dynamic foil reflection angle
  const foilX = useTransform(smoothX, [-0.5, 0.5], ['-30%', '130%']);
  const foilY = useTransform(smoothY, [-0.5, 0.5], ['-30%', '130%']);
  const foilBackground = useTransform(
    [foilX, foilY],
    ([x, y]) =>
      `radial-gradient(circle 260px at ${x} ${y}, rgba(251, 191, 36, 0.45) 0%, rgba(245, 158, 11, 0.15) 40%, transparent 75%)`
  );

  // Cast shadow shifting opposite to light source
  const shadowX = useTransform(smoothX, [-0.5, 0.5], [25, -25]);
  const shadowY = useTransform(smoothY, [-0.5, 0.5], [35, 15]);

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce) return;
    const el = bookRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width - 0.5);
    py.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  const toggleBook = (e: React.MouseEvent) => {
    e.preventDefault();
    const next = !isOpen;
    setIsOpen(next);
    triggerTactileFeedback('medium', next ? 'templeChime' : 'softTap');
  };

  return (
    <div
      className={`relative inline-block perspective-[1400px] select-none ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <motion.div
        ref={bookRef}
        style={
          reduce
            ? undefined
            : {
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }
        }
        className="group relative cursor-pointer"
        whileHover={{ scale: 1.03, y: -8 }}
        whileTap={{ scale: 0.98 }}
        onClick={toggleBook}
      >
        {/* Dynamic Cast Shadow below book */}
        <motion.div
          aria-hidden="true"
          className="absolute -bottom-8 left-6 right-6 h-12 rounded-full bg-black/45 blur-2xl transition-opacity duration-300 group-hover:bg-black/60"
          style={{ x: shadowX, y: shadowY }}
        />

        {/* 3D Book Object Container */}
        <div
          className="relative w-64 sm:w-72 h-84 sm:h-96 rounded-r-2xl rounded-l-md shadow-2xl transition-all duration-500"
          style={{
            transformStyle: 'preserve-3d',
            background: 'linear-gradient(135deg, #7c2d12 0%, #451a03 50%, #1c0a00 100%)',
            boxShadow: `
              inset 4px 0 10px rgba(0,0,0,0.8),
              inset 0 2px 4px rgba(251,191,36,0.3),
              12px 16px 40px rgba(0,0,0,0.6)
            `,
          }}
        >
          {/* Realistic Spine Ridges (Left edge) */}
          <div
            className="absolute left-0 top-0 bottom-0 w-6 rounded-l-md"
            style={{
              background: 'linear-gradient(90deg, #1c0a00 0%, #7c2d12 50%, #451a03 90%, rgba(0,0,0,0.4) 100%)',
              borderRight: '1px solid rgba(251, 191, 36, 0.2)',
            }}
          >
            {/* Spine Gold Embossed Bands */}
            <div className="absolute top-10 left-0 right-0 h-1 bg-amber-400/60 shadow-sm" />
            <div className="absolute top-12 left-0 right-0 h-0.5 bg-amber-200/50" />
            <div className="absolute bottom-10 left-0 right-0 h-1 bg-amber-400/60 shadow-sm" />
            <div className="absolute bottom-12 left-0 right-0 h-0.5 bg-amber-200/50" />
          </div>

          {/* Book Gilded Page Edges (Right, Top, Bottom Thickness) */}
          <div
            className="absolute right-0 top-2 bottom-2 w-3 rounded-r-sm"
            style={{
              background: 'repeating-linear-gradient(0deg, #fef3c7 0px, #d97706 1px, #fef3c7 2px)',
              boxShadow: 'inset 2px 0 4px rgba(0,0,0,0.4)',
              transform: 'translateX(6px) translateZ(-6px) rotateY(45deg)',
            }}
          />

          {/* Saffron Silk Bookmark Ribbon */}
          <motion.div
            className="absolute -top-3 left-16 w-5 h-28 bg-gradient-to-b from-saffron-600 via-amber-500 to-saffron-700 shadow-lg"
            style={{
              clipPath: 'polygon(0% 0%, 100% 0%, 100% 90%, 50% 100%, 0% 90%)',
              transform: 'translateZ(18px)',
            }}
            animate={reduce ? undefined : { rotate: [0, 3, -2, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Book Front Cover Plate */}
          <div
            className="relative h-full w-full pl-8 pr-5 py-6 flex flex-col justify-between overflow-hidden rounded-r-2xl"
            style={{
              transform: 'translateZ(12px)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Golden Specular Foil Reflection that sweeps across on mouse move */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{
                background: foilBackground,
              }}
            />

            {/* Embossed Gold Border Pattern */}
            <div className="absolute inset-4 rounded-xl border border-amber-400/40 p-1 pointer-events-none">
              <div className="h-full w-full rounded-lg border border-amber-300/20" />
            </div>

            {/* Top Badge: OM & Sacred Aura */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 border border-amber-400/30 text-[11px] font-bold text-amber-200 backdrop-blur-sm">
                <Sparkles className="w-3 h-3 text-amber-300" />
                <span>पवित्र ग्रंथ</span>
              </div>
              <span className="font-devanagari text-2xl font-bold text-amber-300/80 drop-shadow">ॐ</span>
            </div>

            {/* Center: Embossed Sacred Title */}
            <div className="relative z-10 text-center my-auto py-4">
              <motion.div
                className="inline-block"
                style={{ transform: 'translateZ(24px)' }}
              >
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-stone-950 font-bold shadow-lg">
                  <Flame className="w-6 h-6 text-stone-950" />
                </div>
                <h3 className="font-devanagari text-2xl sm:text-3xl font-extrabold tracking-wide bg-gradient-to-r from-amber-100 via-amber-300 to-amber-100 bg-clip-text text-transparent drop-shadow-[0_2px_10px_rgba(251,191,36,0.5)]">
                  {title}
                </h3>
                <p className="mt-1.5 text-xs sm:text-sm font-serif italic text-amber-200/90 tracking-wide">
                  {subTitle}
                </p>
                <div className="mt-3 mx-auto w-16 h-px bg-gradient-to-r from-transparent via-amber-400/80 to-transparent" />
              </motion.div>
            </div>

            {/* Bottom Meta & Action */}
            <div className="relative z-10 flex items-center justify-between text-xs text-amber-200/80">
              <span className="font-devanagari">{verseCount}</span>
              <span className="inline-flex items-center gap-1 font-semibold text-amber-300 group-hover:text-white transition">
                <span>खोलें</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Floating Action Modal / Quick Peek when clicked */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="absolute top-full mt-4 left-1/2 -translate-x-1/2 z-50 w-72 sm:w-80 rounded-2xl border border-amber-300/40 bg-stone-950/95 p-5 text-white shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-devanagari font-bold text-amber-300 text-lg">{title}</h4>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white text-xs px-2 py-0.5 rounded-full bg-white/10"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed mb-4">
            प्रत्येक श्लोक का मूल संस्कृत, देवनागरी, अन्वय, विशुद्ध सरल हिंदी भावार्थ और वैज्ञानिक संदर्भ।
          </p>
          <div className="flex gap-2">
            <Link
              href={href}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-saffron-600 to-amber-600 px-3.5 py-2 text-xs font-bold text-white shadow-lg hover:from-saffron-500 hover:to-amber-500"
            >
              <BookOpen className="w-3.5 h-3.5" />
              पढ़ना शुरू करें
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
