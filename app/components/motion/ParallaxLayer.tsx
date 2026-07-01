'use client';

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { useRef, type ReactNode } from 'react';

type ParallaxLayerProps = {
  children: ReactNode;
  className?: string;
  /** Speed multiplier. 0 = fixed, 0.5 = half speed (background), 1 = normal, 1.5 = faster than scroll. */
  speed?: number;
  /** Optional 3D perspective on the wrapper (px). 0 disables. */
  perspective?: number;
  /** Subtle 3D rotateX linked to scroll progress (degrees). 0 disables. */
  tilt?: number;
  /** Direction of parallax movement. */
  direction?: 'up' | 'down' | 'left' | 'right';
  /** Amount of movement in px across the full scroll of the element. */
  distance?: number;
};

/**
 * Scroll-driven parallax layer.
 *
 * Wraps children in a motion.div whose position is linked to the
 * element's scroll progress. At `speed` 0.5 the layer drifts at half
 * the scroll speed (background parallax); at 1.5 it outruns the scroll
 * (foreground parallax). An optional `tilt` adds a subtle 3D rotateX
 * that responds to scroll, giving sections a "card flipping toward you"
 * quality.
 *
 * Respects prefers-reduced-motion (no transform applied).
 */
export function ParallaxLayer({
  children,
  className = '',
  speed = 0.5,
  perspective = 0,
  tilt = 0,
  direction = 'up',
  distance = 120,
}: ParallaxLayerProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // The parallax offset: at speed 0.5, move half the distance.
  const offset = distance * (1 - speed);
  const axis = direction === 'up' || direction === 'down' ? 'y' : 'x';
  const sign = direction === 'up' || direction === 'left' ? -1 : 1;

  const pos = useTransform(
    scrollYProgress,
    [0, 1],
    reduce ? [0, 0] : [sign * -offset, sign * offset],
  );

  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    reduce ? [0, 0, 0] : [tilt, 0, -tilt],
  );

  return (
    <div
      ref={ref}
      className={className}
      style={perspective > 0 ? { perspective } : undefined}
    >
      <motion.div
        style={
          reduce
            ? undefined
            : {
                [axis]: pos,
                rotateX: tilt !== 0 ? rotateX : undefined,
                transformStyle: 'preserve-3d',
              } as React.CSSProperties
        }
      >
        {children}
      </motion.div>
    </div>
  );
}
