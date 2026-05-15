'use client';

import { motion, useReducedMotion, type HTMLMotionProps, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Shared motion primitives for the Dharma Granth reader.
 *
 * Design goals:
 * - Calm, deliberate, ceremony-appropriate motion. No bouncy springs.
 *   Most easings here are `easeOut` over 400–700ms, biased toward
 *   "settling into place" rather than "popping in."
 * - Respects `prefers-reduced-motion`. Every primitive returns a no-op
 *   variant under that preference so the page is still readable.
 * - Composable: parent `Stagger` + child `StaggerItem` so a list of
 *   verse cards can rise one after the other without each card having
 *   its own timing.
 */

const FADE_UP_DISTANCE = 24;
const FADE_DURATION = 0.55;

const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: FADE_UP_DISTANCE },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: FADE_DURATION, ease: [0.22, 1, 0.36, 1] },
  },
};

const reducedVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Fade-up on mount. Use for hero headlines, single elements that should
 * settle in once on load.
 */
export function FadeUp({
  children,
  delay = 0,
  className,
  ...rest
}: { children: ReactNode; delay?: number } & HTMLMotionProps<'div'>) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={reduce ? reducedVariants : fadeUpVariants}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/**
 * Fade-up that fires when the element enters the viewport. Use for
 * sections far down the page that should "wake up" on scroll.
 */
export function FadeUpOnView({
  children,
  delay = 0,
  className,
  amount = 0.25,
  ...rest
}: { children: ReactNode; delay?: number; amount?: number } & HTMLMotionProps<'div'>) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={reduce ? reducedVariants : fadeUpVariants}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

const staggerParent: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.15 },
  },
};

/**
 * Wrap a list with `Stagger` and each list item with `StaggerItem` to
 * get a cascade of fade-ups as the list enters view. The stagger delay
 * is fixed at 80ms per child — slow enough to read as deliberate, fast
 * enough that a 10-verse chapter doesn't make the user wait.
 */
export function Stagger({
  children,
  className,
  amount = 0.1,
  ...rest
}: { children: ReactNode; amount?: number } & HTMLMotionProps<'div'>) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={reduce ? reducedVariants : staggerParent}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  ...rest
}: { children: ReactNode } & HTMLMotionProps<'div'>) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      variants={reduce ? reducedVariants : fadeUpVariants}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
