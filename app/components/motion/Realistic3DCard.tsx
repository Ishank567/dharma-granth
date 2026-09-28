'use client';

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
  type HTMLMotionProps,
} from 'framer-motion';
import { useRef, useState, useEffect, type PointerEvent, type ReactNode } from 'react';
import { triggerTactileFeedback } from '@/lib/haptics';

export interface Realistic3DCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
  wrapperClassName?: string;
  contentClassName?: string;
  maxTilt?: number;
  depth?: number;
  glareIntensity?: number;
  enableGyroscope?: boolean;
  hapticOnHover?: boolean;
  hapticOnTap?: boolean;
  borderGlow?: boolean;
}

/**
 * Realistic 3D Tilt Card with dynamic light tracking, specular glare,
 * responsive cast shadows, gyroscope tilt on mobile, and tactile haptic feedback.
 */
export function Realistic3DCard({
  children,
  className = '',
  wrapperClassName = '',
  contentClassName = '',
  maxTilt = 14,
  depth = 36,
  glareIntensity = 0.35,
  enableGyroscope = true,
  hapticOnHover = false,
  hapticOnTap = true,
  borderGlow = true,
  style,
  onPointerMove,
  onPointerLeave,
  onClick,
  ...rest
}: Realistic3DCardProps) {
  const reduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);
  const [, setIsHovered] = useState(false);

  // Normalized coordinates (-0.5 to 0.5)
  const normX = useMotionValue(0);
  const normY = useMotionValue(0);

  // Physics spring for organic weight and smooth recovery
  const springConfig = { stiffness: 280, damping: 22, mass: 0.6 };
  const smoothX = useSpring(normX, springConfig);
  const smoothY = useSpring(normY, springConfig);

  // 3D rotations based on light / cursor
  const rotateX = useSpring(
    useTransform(smoothY, [-0.5, 0.5], [maxTilt, -maxTilt]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(smoothX, [-0.5, 0.5], [-maxTilt, maxTilt]),
    springConfig
  );

  // Dynamic light reflection / glare coordinates (0% to 100%)
  const glareX = useTransform(smoothX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ['0%', '100%']);

  // Pre-calculate transformed background gradients at top-level
  const glareBackground = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(circle 380px at ${x} ${y}, rgba(255, 255, 255, ${glareIntensity}) 0%, rgba(255, 255, 255, 0.08) 35%, transparent 70%)`
  );

  const borderGlowBackground = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(circle 280px at ${x} ${y}, rgba(249, 115, 22, 0.45), transparent 70%)`
  );

  // Gyroscope tilt on mobile
  useEffect(() => {
    if (reduce || !enableGyroscope || typeof window === 'undefined') return;

    let initialBeta: number | null = null;
    let initialGamma: number | null = null;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.beta === null || e.gamma === null) return;

      if (initialBeta === null) initialBeta = e.beta;
      if (initialGamma === null) initialGamma = e.gamma;

      // Normalise tilt delta within [-30, 30] deg
      const deltaX = Math.max(-1, Math.min(1, (e.gamma - initialGamma) / 25));
      const deltaY = Math.max(-1, Math.min(1, (e.beta - initialBeta) / 25));

      normX.set(deltaX * 0.4);
      normY.set(deltaY * 0.4);
    };

    window.addEventListener('deviceorientation', handleOrientation);
    return () => window.removeEventListener('deviceorientation', handleOrientation);
  }, [reduce, enableGyroscope, normX, normY]);

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    onPointerMove?.(e);
    if (reduce) return;

    const el = cardRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    normX.set(x);
    normY.set(y);
  };

  const handleEnter = () => {
    setIsHovered(true);
    if (hapticOnHover) {
      triggerTactileFeedback('light', 'softTap');
    }
  };

  const handleLeave = (e: PointerEvent<HTMLDivElement>) => {
    onPointerLeave?.(e);
    setIsHovered(false);
    normX.set(0);
    normY.set(0);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hapticOnTap) {
      triggerTactileFeedback('medium', 'click');
    }
    onClick?.(e);
  };

  return (
    <div className={`perspective-[1200px] ${wrapperClassName}`}>
      <motion.div
        ref={cardRef}
        className={`group relative overflow-hidden rounded-2xl transition-[border-color] duration-300 ${className}`}
        onPointerMove={handleMove}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        onClick={handleClick}
        style={
          reduce
            ? style
            : {
                ...style,
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }
        }
        whileHover={
          reduce
            ? undefined
            : {
                y: -8,
                scale: 1.02,
                transition: { type: 'spring', stiffness: 340, damping: 24 },
              }
        }
        whileTap={
          reduce
            ? undefined
            : {
                scale: 0.98,
                y: -2,
              }
        }
        {...rest}
      >
        {/* Dynamic Light Specular Glare */}
        {!reduce && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: glareBackground,
            }}
          />
        )}

        {/* Ambient Golden Border Glow on 3D hover */}
        {!reduce && borderGlow && (
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-px z-10 rounded-2xl opacity-0 transition-opacity duration-400 group-hover:opacity-100"
            style={{
              background: borderGlowBackground,
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '1.5px',
            }}
          />
        )}

        {/* Floating 3D Content Plate with elevated Z-axis */}
        <div
          className={`relative z-10 ${contentClassName}`}
          style={
            reduce
              ? undefined
              : {
                  transform: `translateZ(${depth}px)`,
                  transformStyle: 'preserve-3d',
                }
          }
        >
          {children}
        </div>
      </motion.div>
    </div>
  );
}
