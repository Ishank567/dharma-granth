'use client';

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

type ScrollRevealProps = {
  children: string;
  className?: string;
  /** Delay before the first word starts revealing (seconds). */
  delay?: number;
  /** Stagger between words (seconds). */
  stagger?: number;
  /** Animation style. */
  variant?: 'fade-up' | 'fade' | 'blur' | '3d';
  /** Trigger when this fraction of the element is visible. */
  amount?: number;
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'span';
};

/**
 * Word-by-word scroll reveal for headings and taglines.
 *
 * Splits the text into words and staggers their entrance as the
 * element scrolls into view. The `3d` variant rotates each word in
 * from the back (rotateX: 90 → 0) for a "card flipping" effect.
 *
 * Respects prefers-reduced-motion (renders plain text).
 */
export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  stagger = 0.05,
  variant = 'fade-up',
  amount = 0.3,
  as = 'p',
}: ScrollRevealProps) {
  const reduce = useReducedMotion();
  const words = children.split(' ');

  const MotionTag = motion[as];

  const wordVariants: Variants = {
    hidden: () => {
      if (reduce) return { opacity: 1, y: 0, filter: 'blur(0px)', rotateX: 0 };
      switch (variant) {
        case 'fade':
          return { opacity: 0, y: 0, filter: 'blur(0px)', rotateX: 0 };
        case 'blur':
          return { opacity: 0, y: 0, filter: 'blur(8px)', rotateX: 0 };
        case '3d':
          return { opacity: 0, y: 0, filter: 'blur(0px)', rotateX: -90 };
        case 'fade-up':
        default:
          return { opacity: 0, y: 20, filter: 'blur(0px)', rotateX: 0 };
      }
    },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      rotateX: 0,
      transition: {
        delay: delay + i * stagger,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      style={variant === '3d' && !reduce ? { perspective: 800 } : undefined}
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className="inline-block"
            custom={i}
            variants={wordVariants}
            style={
              variant === '3d' && !reduce
                ? { transformStyle: 'preserve-3d', transformOrigin: 'bottom' }
                : undefined
            }
          >
            {word}
            {i < words.length - 1 ? '\u00A0' : ''}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
