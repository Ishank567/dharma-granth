'use client';

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from 'framer-motion';
import { useRef, type PointerEvent, type ReactNode } from 'react';

type KineticCardProps = {
  children: ReactNode;
  className?: string;
  wrapperClassName?: string;
  contentClassName?: string;
  depth?: number;
  lift?: number;
  perspective?: number;
  rotate?: number;
  glare?: boolean;
  hoverScale?: number;
  hoverShadow?: string;
  disabled?: boolean;
} & HTMLMotionProps<'div'>;

export function KineticCard({
  children,
  className = '',
  wrapperClassName = '',
  contentClassName = '',
  depth = 34,
  lift = 7,
  perspective = 1100,
  rotate = 8,
  glare = true,
  hoverScale = 1.015,
  hoverShadow = '0 30px 60px -20px rgba(124, 45, 18, 0.32)',
  disabled = false,
  onPointerMove,
  onPointerLeave,
  style,
  ...rest
}: KineticCardProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 260, damping: 24, mass: 0.7 };

  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [rotate, -rotate]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-rotate, rotate]), spring);
  const glareX = useTransform(px, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(py, [-0.5, 0.5], ['0%', '100%']);
  const glareBg = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(circle at ${x} ${y}, rgba(255,255,255,0.42), transparent 52%)`,
  );

  const motionDisabled = reduce || disabled;

  function handleMove(e: PointerEvent<HTMLDivElement>) {
    onPointerMove?.(e);
    if (motionDisabled) return;

    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();

    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  }

  function handleLeave(e: PointerEvent<HTMLDivElement>) {
    onPointerLeave?.(e);
    px.set(0);
    py.set(0);
  }

  return (
    <div className={wrapperClassName} style={{ perspective }}>
      <motion.div
        ref={ref}
        className={`group relative ${className}`}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        style={
          motionDisabled
            ? style
            : { ...style, rotateX, rotateY, transformStyle: 'preserve-3d' }
        }
        whileHover={
          motionDisabled
            ? undefined
            : {
                y: -lift,
                scale: hoverScale,
                boxShadow: hoverShadow,
                transition: { type: 'spring', stiffness: 300, damping: 26 },
              }
        }
        whileTap={motionDisabled ? undefined : { scale: 0.985 }}
        {...rest}
      >
        {glare && !motionDisabled && (
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 z-[1] pointer-events-none opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{ background: glareBg }}
          />
        )}
        <div
          className={`relative z-[2] ${contentClassName}`}
          style={
            motionDisabled
              ? undefined
              : { transform: `translateZ(${depth}px)`, transformStyle: 'preserve-3d' }
          }
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}
