'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import { useRef, type ReactNode } from 'react';

/**
 * Animated hero wrapper for the scripture chapter page.
 *
 * Layers, from back to front:
 *
 *   1. The saffron gradient background (provided by the caller via
 *      `className`).
 *   2. A slowly-rotating mandala SVG using CSS 3D `rotateX(60deg)` for
 *      perspective — looks like a temple ceiling viewed from below.
 *      Spins ~120 seconds per revolution; respects reduced-motion.
 *   3. A giant background ॐ that translates upward as the user scrolls
 *      (parallax, slower than page scroll).
 *   4. The hero text content, which sits in normal flow and scrolls at
 *      page speed so it can leave the viewport naturally.
 *
 * The whole hero gets a subtle scale-down + opacity fade as the user
 * scrolls past it, so chapter content above the fold doesn't compete
 * with the verses below.
 */
export function ChapterHero({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Track scroll progress through this hero — 0 when its top hits the
  // viewport top, 1 when its bottom leaves.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // OM parallax: rises by 120px as the user scrolls through the hero.
  const omY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const omOpacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.6, 0]);

  // Hero text: subtle downshift + fade as user scrolls past.
  const textY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  // Mandala counter-scroll: very slight rise so it feels anchored deep
  // behind the OM.
  const mandalaY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`} style={{ perspective: '1200px' }}>
      {/* Layer 2: rotating mandala, viewed at 60° */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{
          y: reduce ? 0 : mandalaY,
          transformStyle: 'preserve-3d',
        }}
      >
        <motion.div
          className="opacity-[0.18]"
          animate={
            reduce
              ? undefined
              : {
                  rotateZ: 360,
                }
          }
          transition={{
            duration: 120,
            repeat: Infinity,
            ease: 'linear',
          }}
          style={{
            transform: 'rotateX(60deg)',
            transformStyle: 'preserve-3d',
            width: 'min(110vmin, 900px)',
            height: 'min(110vmin, 900px)',
          }}
        >
          <Mandala />
        </motion.div>
      </motion.div>

      {/* Layer 3: parallax ॐ */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-4 right-6 text-white/10 text-[10rem] md:text-[14rem] font-devanagari leading-none select-none"
        style={{
          y: reduce ? 0 : omY,
          opacity: reduce ? 0.1 : omOpacity,
        }}
      >
        ॐ
      </motion.div>

      {/* Layer 4: hero text */}
      <motion.div
        className="relative"
        style={{
          y: reduce ? 0 : textY,
          opacity: reduce ? 1 : textOpacity,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/**
 * Concentric-petal mandala SVG. Pure shapes — no images. Renders fast
 * and scales infinitely. Used as a slowly-rotating decorative layer.
 */
function Mandala() {
  const rings = [
    { r: 280, petals: 16, color: 'rgba(255,255,255,0.5)', width: 1 },
    { r: 220, petals: 24, color: 'rgba(255,255,255,0.6)', width: 1 },
    { r: 160, petals: 32, color: 'rgba(255,255,255,0.75)', width: 1.5 },
    { r: 100, petals: 8, color: 'rgba(255,255,255,0.9)', width: 2 },
  ];

  return (
    <svg viewBox="-300 -300 600 600" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <defs>
        <radialGradient id="mandalaCenter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* Outer circle */}
      <circle cx="0" cy="0" r="290" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />

      {/* Concentric petal rings */}
      {rings.map(({ r, petals, color, width }) => {
        const items = [];
        for (let i = 0; i < petals; i++) {
          const angle = (i / petals) * 360;
          items.push(
            <ellipse
              key={`${r}-${i}`}
              cx="0"
              cy={-r * 0.75}
              rx={r * 0.08}
              ry={r * 0.25}
              fill="none"
              stroke={color}
              strokeWidth={width}
              transform={`rotate(${angle})`}
            />,
          );
        }
        return <g key={r}>{items}</g>;
      })}

      {/* Inner bindu */}
      <circle cx="0" cy="0" r="30" fill="url(#mandalaCenter)" />
      <circle cx="0" cy="0" r="6" fill="rgba(255,255,255,0.95)" />
    </svg>
  );
}
