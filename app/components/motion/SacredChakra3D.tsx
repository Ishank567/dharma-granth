'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useReducedMotion } from 'framer-motion';
import { triggerTactileFeedback } from '@/lib/haptics';

interface Particle {
  x: number;
  y: number;
  z: number;
  size: number;
  alpha: number;
  speed: number;
  theta: number;
  radius: number;
}

/** Outer ring has 24 spokes; drag haptics tick once per spoke. */
const SPOKE_ANGLE = (Math.PI * 2) / 24;

export function SacredChakra3D({
  className = '',
  size = 460,
  interactive = true,
}: {
  className?: string;
  size?: number;
  interactive?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  // 3D rotation angles & momentum physics
  const rotX = useRef(0.24); // gentle forward tilt
  const rotY = useRef(0);
  const velX = useRef(0);
  const velY = useRef(0.0035); // steady ambient spin
  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastDetent = useRef(0);
  const [isInteracting, setIsInteracting] = useState(false);

  // Initialize 3D celestial particles
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    const list: Particle[] = [];
    const count = 72;
    for (let i = 0; i < count; i++) {
      const radius = 60 + Math.random() * 160;
      const theta = Math.random() * Math.PI * 2;
      list.push({
        x: Math.cos(theta) * radius,
        y: (Math.random() - 0.5) * 80,
        z: Math.sin(theta) * radius,
        size: Math.random() * 2.4 + 1,
        alpha: Math.random() * 0.7 + 0.3,
        speed: (Math.random() * 0.008 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
        theta,
        radius,
      });
    }
    particles.current = list;
  }, []);

  // Animation Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw at device resolution so it stays crisp on retina / phone screens;
    // all geometry below is in CSS pixels (0..size).
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    let animId = 0;
    let onScreen = true;
    let running = false;

    const render = () => {
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;
      const fov = 420;

      // Apply physics momentum
      if (!isDragging.current) {
        // Return to natural tilt
        rotX.current += (0.22 - rotX.current) * 0.03;
        rotY.current += velY.current;
        velY.current += (0.0035 - velY.current) * 0.02; // damp back to baseline
      }

      const rx = rotX.current;
      const ry = rotY.current;

      // 3D Projection helper
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y
        const cosY = Math.cos(ry);
        const sinY = Math.sin(ry);
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;

        // Rotate around X
        const cosX = Math.cos(rx);
        const sinX = Math.sin(rx);
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        // Perspective division
        const distance = fov + z2;
        const scale = distance > 10 ? fov / distance : 0;
        return {
          px: cx + x1 * scale,
          py: cy + y2 * scale,
          z: z2,
          scale,
        };
      };

      // 1. Draw glowing background aura
      const radial = ctx.createRadialGradient(cx, cy, 10, cx, cy, size * 0.45);
      radial.addColorStop(0, 'rgba(251, 191, 36, 0.18)');
      radial.addColorStop(0.5, 'rgba(249, 115, 22, 0.07)');
      radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = radial;
      ctx.fillRect(0, 0, size, size);

      // 2. Draw 3D Celestial Orbiting Particles (back layer)
      particles.current.forEach((p) => {
        p.theta += p.speed;
        p.x = Math.cos(p.theta) * p.radius;
        p.z = Math.sin(p.theta) * p.radius;

        const proj = project(p.x, p.y, p.z);
        if (proj.scale <= 0) return;

        const alpha = Math.max(0.1, Math.min(1, p.alpha * (proj.scale * 0.8)));
        ctx.beginPath();
        ctx.arc(proj.px, proj.py, p.size * proj.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(254, 215, 170, ${alpha})`;
        ctx.shadowColor = 'rgba(251, 191, 36, 0.8)';
        ctx.shadowBlur = 6 * proj.scale;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 3. Draw Concentric 3D Sacred Geometry Rings
      const rings = [
        { radius: 140, segments: 24, spokeWidth: 1.5, color: 'rgba(251, 191, 36, 0.85)' },
        { radius: 105, segments: 16, spokeWidth: 1.8, color: 'rgba(249, 115, 22, 0.9)' },
        { radius: 68, segments: 8, spokeWidth: 2.2, color: 'rgba(255, 237, 213, 0.95)' },
        { radius: 36, segments: 4, spokeWidth: 2.5, color: 'rgba(255, 255, 255, 0.95)' },
      ];

      rings.forEach((ring, ringIdx) => {
        // Draw the ring circumference
        ctx.beginPath();
        const steps = 72;
        let started = false;
        for (let i = 0; i <= steps; i++) {
          const angle = (i / steps) * Math.PI * 2;
          const x = Math.cos(angle) * ring.radius;
          const z = Math.sin(angle) * ring.radius;
          const proj = project(x, 0, z);

          if (i === 0 || !started) {
            ctx.moveTo(proj.px, proj.py);
            started = true;
          } else {
            ctx.lineTo(proj.px, proj.py);
          }
        }
        ctx.closePath();
        ctx.strokeStyle = ring.color;
        ctx.lineWidth = ring.spokeWidth;
        ctx.shadowColor = 'rgba(251, 191, 36, 0.5)';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Draw spokes with gold gradient
        for (let s = 0; s < ring.segments; s++) {
          const spokeAngle = (s / ring.segments) * Math.PI * 2;
          const innerRadius = ringIdx === rings.length - 1 ? 8 : rings[ringIdx + 1].radius;
          const x1 = Math.cos(spokeAngle) * innerRadius;
          const z1 = Math.sin(spokeAngle) * innerRadius;
          const x2 = Math.cos(spokeAngle) * ring.radius;
          const z2 = Math.sin(spokeAngle) * ring.radius;

          const p1 = project(x1, 0, z1);
          const p2 = project(x2, 0, z2);

          ctx.beginPath();
          ctx.moveTo(p1.px, p1.py);
          ctx.lineTo(p2.px, p2.py);
          ctx.strokeStyle = ring.color;
          ctx.lineWidth = ring.spokeWidth;
          ctx.stroke();

          // Golden bead node at each perimeter spoke joint
          ctx.beginPath();
          ctx.arc(p2.px, p2.py, 2.5 * p2.scale, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.fill();
        }
      });

      // 4. Central Sacred Bindu / Om Node in 3D
      const bindu = project(0, 0, 0);
      const binduGradient = ctx.createRadialGradient(
        bindu.px,
        bindu.py,
        2 * bindu.scale,
        bindu.px,
        bindu.py,
        22 * bindu.scale
      );
      binduGradient.addColorStop(0, '#ffffff');
      binduGradient.addColorStop(0.3, '#f59e0b');
      binduGradient.addColorStop(0.7, '#ea580c');
      binduGradient.addColorStop(1, 'rgba(124, 45, 18, 0)');

      ctx.beginPath();
      ctx.arc(bindu.px, bindu.py, 22 * bindu.scale, 0, Math.PI * 2);
      ctx.fillStyle = binduGradient;
      ctx.shadowColor = 'rgba(251, 191, 36, 0.9)';
      ctx.shadowBlur = 18 * bindu.scale;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Sanskrit OM at center
      ctx.font = `bold ${Math.round(20 * bindu.scale)}px 'Noto Sans Devanagari', sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('ॐ', bindu.px, bindu.py);

      if (!reduce && onScreen && !document.hidden) {
        animId = requestAnimationFrame(render);
      } else {
        running = false;
      }
    };

    const start = () => {
      if (running || reduce) return;
      running = true;
      animId = requestAnimationFrame(render);
    };

    // Only spin while visible: no battery drain when scrolled away or when
    // the tab is in the background.
    const observer = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      if (onScreen) start();
    });
    observer.observe(canvas);
    const onVisibility = () => {
      if (!document.hidden) start();
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Reduced motion: one static frame. Otherwise a single loop via start()
    // (render() reschedules itself, so calling both would run two loops).
    if (reduce) render();
    else start();

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [reduce, size]);

  // Pointer / Touch drag controls for physical 3D spinning
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!interactive) return;
      isDragging.current = true;
      setIsInteracting(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      lastDetent.current = Math.floor(rotY.current / SPOKE_ANGLE);
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
      triggerTactileFeedback('medium', 'softTap');
    },
    [interactive]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDragging.current || !interactive) return;
      // Pointer deltas are in CSS px of the (possibly shrunk) canvas; keep
      // the spin speed the same on phones as on desktop.
      const rect = e.currentTarget.getBoundingClientRect();
      const k = rect.width > 0 ? size / rect.width : 1;
      const dx = (e.clientX - lastMousePos.current.x) * k;
      const dy = (e.clientY - lastMousePos.current.y) * k;

      rotY.current += dx * 0.008;
      rotX.current = Math.max(-0.6, Math.min(0.6, rotX.current - dy * 0.008));

      velY.current = dx * 0.003;
      lastMousePos.current = { x: e.clientX, y: e.clientY };

      // Ratchet: one crisp tick each time a spoke passes, like turning a
      // physical dial, instead of buzzing on every pointer event.
      const detent = Math.floor(rotY.current / SPOKE_ANGLE);
      if (detent !== lastDetent.current) {
        lastDetent.current = detent;
        triggerTactileFeedback('light', 'click');
      }
    },
    [interactive, size]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      isDragging.current = false;
      setIsInteracting(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      triggerTactileFeedback('light', 'softTap');
    },
    []
  );

  return (
    <div
      className={`relative flex w-full items-center justify-center select-none ${className}`}
      style={{ maxWidth: size }}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className={`touch-none cursor-grab active:cursor-grabbing drop-shadow-[0_20px_45px_rgba(249,115,22,0.35)] transition-transform duration-300 ${
          isInteracting ? 'scale-105' : 'hover:scale-[1.02]'
        }`}
        // Shrinks with its container on phones while staying a circle.
        style={{ width: '100%', maxWidth: size, aspectRatio: '1 / 1', height: 'auto' }}
        aria-label="Interactive 3D Sacred Chakra - Click and drag to spin in 3D"
        title="Click and drag to spin the Sacred Dharma Chakra in 3D"
      />
      <div className="pointer-events-none absolute bottom-2 flex items-center gap-1.5 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[11px] font-semibold text-amber-200/90 backdrop-blur-md">
        <span>☸ Drag to spin in 3D</span>
      </div>
    </div>
  );
}
