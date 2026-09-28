'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

const GLOW_SIZE = 520;

/**
 * Spatial Light Cursor - An interactive 3D light source that follows
 * the mouse pointer smoothly across the page, casting an organic golden glow
 * across cards, borders, and glass surfaces.
 *
 * Moves with `transform` (x/y) rather than left/top so each frame is a GPU
 * composite of an already-rasterised blurred layer, not a layout + repaint.
 */
export function SpatialLightCursor() {
  const reduce = useReducedMotion();
  const [isPointerFine, setIsPointerFine] = useState(false);
  const [seen, setSeen] = useState(false);

  const mouseX = useMotionValue(-GLOW_SIZE);
  const mouseY = useMotionValue(-GLOW_SIZE);

  // Gentle spring interpolation for liquid trailing light
  const springConfig = { stiffness: 180, damping: 24, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const media = window.matchMedia('(pointer: fine)');
    setIsPointerFine(media.matches);
    const onMediaChange = (e: MediaQueryListEvent) => setIsPointerFine(e.matches);
    media.addEventListener('change', onMediaChange);
    return () => media.removeEventListener('change', onMediaChange);
  }, []);

  useEffect(() => {
    if (reduce || !isPointerFine) return;

    const handlePointerMove = (e: PointerEvent) => {
      mouseX.set(e.clientX - GLOW_SIZE / 2);
      mouseY.set(e.clientY - GLOW_SIZE / 2);
      setSeen(true);
    };
    // Don't track (or keep springs animating) while the tab is hidden.
    const onVisibility = () => {
      if (document.hidden) window.removeEventListener('pointermove', handlePointerMove);
      else window.addEventListener('pointermove', handlePointerMove, { passive: true });
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduce, isPointerFine, mouseX, mouseY]);

  if (reduce || !isPointerFine) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-30 overflow-hidden">
      <motion.div
        className="absolute left-0 top-0 rounded-full transition-opacity duration-700 will-change-transform"
        style={{
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          x: smoothX,
          y: smoothY,
          opacity: seen ? 1 : 0,
          background:
            'radial-gradient(circle, rgba(249, 115, 22, 0.08) 0%, rgba(251, 191, 36, 0.04) 35%, transparent 70%)',
          filter: 'blur(30px)',
        }}
      />
    </div>
  );
}
