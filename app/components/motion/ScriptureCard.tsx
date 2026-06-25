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
    <Link href={href} className="block focus:outline-none" style={{ perspective: '1200px' }}>
      <motion.div
        className={`${className} relative overflow-hidden`}
        whileHover={
          reduce
            ? undefined
            : {
                y: -8,
                rotateX: -3,
                rotateY: 2,
                scale: 1.02,
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                transition: { type: 'spring', stiffness: 300, damping: 25 },
              }
        }
        whileTap={reduce ? undefined : { scale: 0.97 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Glassmorphism shine effect on hover */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          whileHover={{
            opacity: 1,
            background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%)',
          }}
          transition={{ duration: 0.3 }}
        />
        {children}
      </motion.div>
    </Link>
  );
}
