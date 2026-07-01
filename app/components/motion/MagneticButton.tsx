'use client';

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import Link from 'next/link';
import { useRef, type ReactNode, type PointerEvent } from 'react';

type MagneticButtonProps = {
  children: ReactNode;
  href: string;
  className?: string;
  /** How strongly the button follows the cursor (px of max displacement). */
  strength?: number;
  /** 3D tilt in degrees. */
  tilt?: number;
  /** Inner content Z-depth in px. */
  depth?: number;
};

/**
 * Magnetic button — the element drifts toward the cursor and tilts in
 * 3D as if it's a physical object caught in a magnetic field. The
 * inner content is pushed forward on the Z axis so it separates from
 * the tile as it tilts.
 *
 * Use for primary CTAs where you want a premium, tactile feel.
 * Respects prefers-reduced-motion (renders as a plain link).
 */
export function MagneticButton({
  children,
  href,
  className = '',
  strength = 24,
  tilt = 12,
  depth = 40,
}: MagneticButtonProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLAnchorElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 200, damping: 18, mass: 0.5 };

  const x = useSpring(mx, spring);
  const y = useSpring(my, spring);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [tilt, -tilt]), spring);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-tilt, tilt]), spring);

  function handleMove(e: PointerEvent<HTMLAnchorElement>) {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width - 0.5;
    const ny = (e.clientY - r.top) / r.height - 0.5;
    mx.set(nx * strength);
    my.set(ny * strength);
  }

  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  if (reduce) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <Link
      ref={ref}
      href={href}
      className={`relative inline-block ${className}`}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      style={{ perspective: 800 }}
    >
      <motion.div
        style={{ x, y, rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileTap={{ scale: 0.96 }}
      >
        <div style={{ transform: `translateZ(${depth}px)`, transformStyle: 'preserve-3d' }}>
          {children}
        </div>
      </motion.div>
    </Link>
  );
}
