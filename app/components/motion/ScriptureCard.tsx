'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

/**
 * Scripture catalog card with a subtle 3D lift on hover.
 *
 * Why not a pure CSS `:hover` lift? The card needs to share entrance
 * animation with its siblings via the parent <Stagger> (each child
 * picks up the staggered fadeUp variant), so it has to be a motion
 * component. Once we're in framer territory, `whileHover` gives a
 * smoother spring than CSS transitions and the rotateX/rotateY makes
 * it feel like an object catching light rather than a flat tile.
 */
export function ScriptureCard({
  href,
  children,
  className = '',
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <Link href={href} className="block focus:outline-none" style={{ perspective: '1000px' }}>
      <motion.div
        className={className}
        whileHover={
          reduce
            ? undefined
            : {
                y: -4,
                rotateX: -2,
                rotateY: 1,
                transition: { type: 'spring', stiffness: 300, damping: 22 },
              }
        }
        whileTap={reduce ? undefined : { scale: 0.985 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </Link>
  );
}
