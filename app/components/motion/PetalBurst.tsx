'use client';

import { useEffect, useRef } from 'react';

// Marigold, saffron, gold and rose — the colours of a temple garland.
const COLORS = ['#f59e0b', '#f97316', '#fbbf24', '#ea580c', '#fde68a', '#e11d48'];
const COUNT = 110;
const DURATION_MS = 3600;

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  w: number;
  h: number;
  color: string;
  sway: number;
  phase: number;
}

/**
 * One-shot burst of marigold petals from the bottom centre that arc up,
 * flutter and fall. Pure canvas, no dependencies; calls onDone when finished.
 * Callers skip it under prefers-reduced-motion.
 */
export function PetalBurst({ onDone }: { onDone?: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const petals: Petal[] = Array.from({ length: COUNT }, () => {
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5; // mostly upward fan
      const speed = 9 + Math.random() * 9;
      return {
        x: W / 2 + (Math.random() - 0.5) * 80,
        y: H + 10,
        vx: Math.cos(angle) * speed * (W / 900),
        vy: Math.sin(angle) * speed * Math.min(1.25, H / 700),
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        w: 7 + Math.random() * 7,
        h: 4 + Math.random() * 4,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        sway: 0.6 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2,
      };
    });

    const start = performance.now();
    let raf = 0;

    const frame = (now: number) => {
      const t = now - start;
      ctx.clearRect(0, 0, W, H);
      const fade = t > DURATION_MS - 700 ? Math.max(0, (DURATION_MS - t) / 700) : 1;

      for (const p of petals) {
        p.vy += 0.32; // gravity
        p.vx *= 0.985; // air drag
        p.vy = Math.min(p.vy, 3.2 + p.sway); // petals float, they don't plummet
        p.x += p.vx + Math.sin(t / 260 + p.phase) * p.sway; // flutter
        p.y += p.vy;
        p.rot += p.vr;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        // Squash with rotation so petals appear to tumble in 3D.
        ctx.scale(1, Math.abs(Math.cos(p.rot * 1.7)) * 0.8 + 0.2);
        ctx.globalAlpha = fade;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.w, p.h, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (t < DURATION_MS) raf = requestAnimationFrame(frame);
      else onDoneRef.current?.();
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[70]"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
}
