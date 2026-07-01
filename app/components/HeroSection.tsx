'use client';

import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { Flame, BookOpen } from 'lucide-react';
import { FadeUp } from '@/app/components/motion/primitives';
import { MagneticButton } from '@/app/components/motion/MagneticButton';

function CelestialParticles() {
  const reduce = useReducedMotion();
  // Positions use Math.random(), which differs between the server and client
  // render and would trip a hydration mismatch. Generate them only after
  // mount so the server emits an empty layer and the client fills it in.
  const [particles, setParticles] = useState<
    {
      id: number;
      x: number;
      y: number;
      size: number;
      delay: number;
      duration: number;
      opacity: number;
      drift: number;
    }[]
  >([]);

  useEffect(() => {
    if (reduce) return;
    setParticles(
      Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        delay: Math.random() * 5,
        duration: Math.random() * 4 + 6,
        opacity: Math.random() * 0.5 + 0.2,
        drift: (Math.random() - 0.5) * 20,
      })),
    );
  }, [reduce]);

  if (reduce) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, p.drift, 0],
            opacity: [p.opacity, p.opacity * 1.5, p.opacity],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

function MandalaRing({ size, duration, reverse = false, className = '' }: { size: string, duration: number, reverse?: boolean, className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`absolute rounded-full border border-white/10 ${className}`}
      style={{ width: size, height: size }}
      animate={reduce ? undefined : { rotate: reverse ? -360 : 360 }}
      transition={reduce ? undefined : { duration, repeat: Infinity, ease: "linear" }}
    />
  );
}

function ScripturePlane({
  children,
  className = '',
  baseRotate = 0,
  delay = 0,
}: {
  children: string;
  className?: string;
  baseRotate?: number;
  delay?: number;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className={`absolute hidden md:flex h-24 w-48 items-center justify-center rounded-2xl border border-white/15 bg-white/[0.08] px-6 text-center shadow-2xl backdrop-blur-md ${className}`}
      initial={{ rotate: baseRotate }}
      animate={
        reduce
          ? { rotate: baseRotate }
          : { y: [0, -10, 0], rotate: [baseRotate, baseRotate + 1.5, baseRotate] }
      }
      transition={
        reduce
          ? undefined
          : { duration: 7, delay, repeat: Infinity, ease: 'easeInOut' }
      }
    >
      <span className="font-devanagari text-2xl text-saffron-100/75 drop-shadow">
        {children}
      </span>
    </motion.div>
  );
}

export function HeroSection() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });

  // Normalised pointer position across the hero: -0.5 … 0.5.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 120, damping: 20, mass: 0.6 };

  // Background layers drift gently against the cursor for depth parallax.
  const bgX = useSpring(useTransform(mx, [-0.5, 0.5], [-22, 22]), spring);
  const bgY = useSpring(useTransform(my, [-0.5, 0.5], [-14, 14]), spring);
  const bgScrollY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const contentScrollY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.72], [1, 0.18]);
  const nearPlaneX = useSpring(useTransform(mx, [-0.5, 0.5], [-38, 38]), spring);
  const nearPlaneY = useSpring(useTransform(my, [-0.5, 0.5], [-30, 30]), spring);
  const farPlaneX = useSpring(useTransform(mx, [-0.5, 0.5], [24, -24]), spring);
  const farPlaneY = useSpring(useTransform(my, [-0.5, 0.5], [18, -18]), spring);
  // The OM medallion tilts toward the cursor in 3D.
  const tiltX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), spring);
  const tiltY = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), spring);

  function handleMove(e: PointerEvent<HTMLElement>) {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  }

  function handleLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <section
      ref={ref}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      className="relative bg-gradient-to-br from-saffron-900 via-saffron-800 to-amber-900 text-white overflow-hidden min-h-[640px] md:min-h-[700px]"
      style={{ perspective: '1200px' }}
    >
      {/* Enhanced celestial background — drifts against the cursor for depth */}
      <motion.div
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={reduce ? undefined : { y: bgScrollY }}
      >
        <motion.div
          className="absolute inset-[-5%]"
          style={reduce ? undefined : { x: bgX, y: bgY }}
        >
          {/* Multiple mandala rings with different speeds and sizes */}
          <MandalaRing size="24rem" duration={60} className="-top-32 -left-32" />
          <MandalaRing size="18rem" duration={45} reverse className="-top-20 -left-20" />
          <MandalaRing size="24rem" duration={55} className="-bottom-32 -right-32" />
          <MandalaRing size="18rem" duration={40} reverse className="-bottom-20 -right-20" />
          <MandalaRing size="16rem" duration={70} className="top-1/4 right-1/4" />
          <MandalaRing size="20rem" duration={65} reverse className="bottom-1/4 left-1/4" />

          {/* Additional decorative rings for depth */}
          <MandalaRing size="32rem" duration={80} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-30" />
          <MandalaRing size="40rem" duration={90} reverse className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />

          <motion.div
            className="absolute inset-0"
            style={reduce ? undefined : { x: farPlaneX, y: farPlaneY }}
          >
            <ScripturePlane className="left-[8%] top-[24%]" baseRotate={-10} delay={0.6}>
              तत्त्वमसि
            </ScripturePlane>
            <ScripturePlane className="right-[9%] top-[20%]" baseRotate={9} delay={1.2}>
              सत्यमेव जयते
            </ScripturePlane>
          </motion.div>

          <motion.div
            className="absolute inset-0"
            style={reduce ? undefined : { x: nearPlaneX, y: nearPlaneY }}
          >
            <ScripturePlane className="left-[16%] bottom-[18%]" baseRotate={7} delay={0.2}>
              योगः कर्मसु कौशलम्
            </ScripturePlane>
            <ScripturePlane className="right-[16%] bottom-[20%]" baseRotate={-8} delay={1.8}>
              अहं ब्रह्मास्मि
            </ScripturePlane>
          </motion.div>

          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-10 mandala-bg" />

          {/* Multiple gradient overlays for realistic depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/25" />

          {/* Radial gradient for spotlight effect */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.2),transparent_60%)]" />

          {/* Animated particles */}
          <CelestialParticles />
        </motion.div>
      </motion.div>

      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 pt-20 pb-4 sm:pb-10 md:py-40 text-center"
        style={
          reduce
            ? { transformStyle: 'preserve-3d' }
            : { y: contentScrollY, opacity: contentOpacity, transformStyle: 'preserve-3d' }
        }
      >
        {/* OM symbol with enhanced glow, animation, and cursor-driven 3D tilt */}
        <FadeUp>
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/10 border-2 border-white/20 mb-8 md:mb-10 shadow-2xl backdrop-blur-md"
            style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }}
            animate={
              reduce
                ? undefined
                : {
                    scale: [1, 1.08, 1],
                    boxShadow: [
                      '0 0 30px rgba(251, 191, 36, 0.4)',
                      '0 0 60px rgba(251, 191, 36, 0.6)',
                      '0 0 30px rgba(251, 191, 36, 0.4)',
                    ],
                  }
            }
            transition={reduce ? undefined : { duration: 3, repeat: Infinity }}
          >
            <motion.span
              className="font-devanagari text-5xl md:text-6xl text-saffron-100 leading-none drop-shadow-lg"
              animate={reduce ? undefined : { rotate: [0, 5, -5, 0] }}
              transition={reduce ? undefined : { duration: 4, repeat: Infinity }}
            >
              ॐ
            </motion.span>
          </motion.div>
        </FadeUp>

        <FadeUp delay={0.08}>
          <motion.h1
            className="text-6xl sm:text-7xl md:text-9xl font-serif font-bold mb-5 md:mb-6 tracking-normal drop-shadow-2xl bg-gradient-to-r from-white via-saffron-100 to-amber-100 bg-clip-text text-transparent text-3d animate-gradient-shift"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            Dharma Granth
          </motion.h1>
        </FadeUp>
        
        <FadeUp delay={0.14}>
          <motion.p
            className="font-devanagari text-3xl md:text-5xl text-saffron-100 mb-5 md:mb-6 drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8 }}
          >
            धर्म ग्रंथ
          </motion.p>
        </FadeUp>
        
        <FadeUp delay={0.2}>
          <motion.p
            className="text-xl md:text-4xl font-light opacity-95 max-w-3xl mx-auto mb-4 drop-shadow-sm leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Famous verses, deeply explained.
          </motion.p>
          <motion.p
            className="font-devanagari text-lg md:text-3xl opacity-85 max-w-2xl mx-auto mb-4 md:mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.8 }}
          >
            प्रसिद्ध श्लोक — गहरा हिंदी अर्थ — वैज्ञानिक दृष्टिकोण
          </motion.p>
          <motion.p
            className="text-sm md:text-lg opacity-75 max-w-xl mx-auto mb-10 md:mb-14 font-medium tracking-wide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.8 }}
          >
            Sanskrit · Hindi · English · Science — verse by verse, free,
            ad-free.
          </motion.p>
        </FadeUp>

        <FadeUp delay={0.3} className="flex flex-wrap justify-center gap-5">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <MagneticButton
              href="/scripture/bhagavadgita"
              className="inline-flex items-center gap-2.5 bg-white text-saffron-800 px-8 py-4 md:px-10 md:py-5 rounded-full font-bold hover:bg-saffron-50 transition-all shadow-2xl shine-sweep"
              strength={28}
              tilt={12}
            >
              <Flame className="w-5 h-5" />
              भगवद्गीता पढ़ें
            </MagneticButton>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <MagneticButton
              href="/scriptures"
              className="inline-flex items-center gap-2.5 bg-white/20 backdrop-blur-md border-2 border-white/30 text-white px-8 py-4 md:px-10 md:py-5 rounded-full font-semibold hover:bg-white/30 transition-all shadow-xl shine-sweep"
              strength={24}
              tilt={10}
            >
              <BookOpen className="w-5 h-5" />
              Browse the Library
            </MagneticButton>
          </motion.div>
        </FadeUp>
      </motion.div>

      {/* Bottom gradient transition */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1] h-24 bg-gradient-to-b from-transparent to-saffron-700" />
    </section>
  );
}
