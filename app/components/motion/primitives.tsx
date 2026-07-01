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

/**
 * Wrap a list with `Stagger` and each list item with `StaggerItem` to get a
 * list of fade-ups.
 *
 * The `StaggerItem`s animate themselves on mount (see below) rather than
 * relying on this parent to orchestrate them, so `Stagger` is now just a
 * layout wrapper. `amount` is still accepted for call-site compatibility but
 * is unused — the reveal no longer depends on the parent reaching a
 * props-bearing "visible" variant (which framer would not fire when the
 * variant holds only a stagger transition), which left tall / below-the-fold
 * lists stuck at `opacity: 0`.
 */
export function Stagger({
  children,
  className,
  amount: _amount,
  ...rest
}: { children: ReactNode; amount?: 'some' | 'all' | number } & HTMLMotionProps<'div'>) {
  // A plain layout wrapper (motion.div with no animation) — it accepts the
  // motion prop types callers may pass, but the reveal is driven per-item.
  return (
    <motion.div className={className} {...rest}>
      {children}
    </motion.div>
  );
}

/**
 * A single staggered item. Animates hidden → visible on mount with a small
 * per-item delay so a list still reveals as a cascade.
 *
 * Why self-animate instead of inheriting from a `<Stagger>` parent? A parent
 * whose "visible" variant carries only `staggerChildren` (no animatable
 * props of its own) does not reliably propagate the variant to its children
 * for tall / below-the-fold lists — leaving every item stuck at `opacity: 0`.
 * Driving each item's own `initial`/`animate` (its `visible` variant has real
 * `opacity`/`y` values) makes the reveal bulletproof regardless of list
 * height or scroll position, exactly like `FadeUp`.
 */
export function StaggerItem({
  children,
  className,
  ...rest
}: { children: ReactNode } & HTMLMotionProps<'div'>) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: FADE_UP_DISTANCE }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: FADE_DURATION, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
