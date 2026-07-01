'use client';

import { motion, useReducedMotion } from 'framer-motion';

type AuroraBackgroundProps = {
  className?: string;
  /** Color palette for the aurora blobs. Each is a CSS color string. */
  colors?: string[];
  /** Opacity of the layer (0–1). */
  opacity?: number;
  /** Animation speed multiplier. */
  speed?: number;
};

/**
 * Animated aurora gradient mesh background.
 *
 * Renders 3–4 large, blurred, semi-transparent gradient blobs that
 * drift and morph slowly — like the northern lights. Sits behind
 * section content as a decorative layer. Pointer-events disabled.
 *
 * Respects prefers-reduced-motion (renders static blobs).
 */
export function AuroraBackground({
  className = '',
  colors = [
    'rgba(249, 115, 22, 0.35)',  // saffron
    'rgba(245, 158, 11, 0.25)',  // amber
    'rgba(20, 184, 166, 0.20)',  // teal
    'rgba(99, 102, 241, 0.18)',  // indigo
  ],
  opacity = 1,
  speed = 1,
}: AuroraBackgroundProps) {
  const reduce = useReducedMotion();

  const blobs = [
    {
      size: 500,
      left: '-5%',
      top: '10%',
      color: colors[0],
      drift: { x: [0, 80, -30, 0], y: [0, 40, 60, 0], scale: [1, 1.15, 0.95, 1] },
      duration: 28 * speed,
    },
    {
      size: 400,
      left: '60%',
      top: '-5%',
      color: colors[1],
      drift: { x: [0, -60, 40, 0], y: [0, 50, -20, 0], scale: [1, 0.9, 1.1, 1] },
      duration: 32 * speed,
    },
    {
      size: 450,
      left: '30%',
      top: '50%',
      color: colors[2],
      drift: { x: [0, 50, -70, 0], y: [0, -40, 30, 0], scale: [1, 1.2, 0.85, 1] },
      duration: 36 * speed,
    },
    {
      size: 350,
      left: '70%',
      top: '60%',
      color: colors[3],
      drift: { x: [0, -40, 20, 0], y: [0, 30, -50, 0], scale: [1, 0.95, 1.15, 1] },
      duration: 30 * speed,
    },
  ];

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
      style={{ opacity }}
    >
      {blobs.map((blob, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            left: blob.left,
            top: blob.top,
            width: blob.size,
            height: blob.size,
            background: `radial-gradient(circle, ${blob.color} 0%, transparent 65%)`,
            filter: 'blur(60px)',
          }}
          animate={reduce ? {} : { x: blob.drift.x, y: blob.drift.y, scale: blob.drift.scale }}
          transition={
            reduce
              ? {}
              : {
                  duration: blob.duration,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 2,
                }
          }
        />
      ))}
    </div>
  );
}
