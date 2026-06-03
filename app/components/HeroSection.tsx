'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Flame, BookOpen } from 'lucide-react';
import { FadeUp } from '@/app/components/motion/primitives';

function CelestialParticles() {
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    delay: Math.random() * 5,
    duration: Math.random() * 4 + 6,
    opacity: Math.random() * 0.5 + 0.2,
  }));

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
            x: [0, (Math.random() - 0.5) * 20, 0],
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
  return (
    <motion.div
      className={`absolute rounded-full border border-white/10 ${className}`}
      style={{ width: size, height: size }}
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    />
  );
}

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-saffron-900 via-saffron-800 to-amber-900 text-white overflow-hidden min-h-[600px]">
      {/* Enhanced celestial background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
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
        
        {/* Dot pattern */}
        <div className="absolute inset-0 opacity-10 mandala-bg" />
        
        {/* Multiple gradient overlays for realistic depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
        
        {/* Radial gradient for spotlight effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.15),transparent_60%)]" />
        
        {/* Animated particles */}
        <CelestialParticles />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-32 text-center">
        {/* OM symbol with enhanced glow and animation */}
        <FadeUp>
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/15 border border-white/30 mb-8 shadow-2xl backdrop-blur-sm"
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 20px rgba(251, 191, 36, 0.3)',
                '0 0 40px rgba(251, 191, 36, 0.5)',
                '0 0 20px rgba(251, 191, 36, 0.3)',
              ],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <motion.span
              className="font-devanagari text-5xl text-saffron-100 leading-none drop-shadow-lg"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              ॐ
            </motion.span>
          </motion.div>
        </FadeUp>

        <FadeUp delay={0.08}>
          <motion.h1
            className="text-6xl md:text-8xl font-serif font-bold mb-4 tracking-tight drop-shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            Dharma Granth
          </motion.h1>
        </FadeUp>
        
        <FadeUp delay={0.14}>
          <motion.p
            className="font-devanagari text-3xl md:text-4xl text-saffron-100 mb-4 drop-shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.8 }}
          >
            धर्म ग्रंथ
          </motion.p>
        </FadeUp>
        
        <FadeUp delay={0.2}>
          <motion.p
            className="text-2xl md:text-3xl font-light opacity-95 max-w-3xl mx-auto mb-3 drop-shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Famous verses, deeply explained.
          </motion.p>
          <motion.p
            className="font-devanagari text-xl md:text-2xl opacity-85 max-w-2xl mx-auto mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.8 }}
          >
            प्रसिद्ध श्लोक — गहरा हिंदी अर्थ — वैज्ञानिक दृष्टिकोण
          </motion.p>
          <motion.p
            className="text-base opacity-70 max-w-xl mx-auto mb-12 font-medium"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.8 }}
          >
            Sanskrit · Hindi · English · Science — verse by verse, free,
            ad-free.
          </motion.p>
        </FadeUp>

        <FadeUp delay={0.3} className="flex flex-wrap justify-center gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Link
              href="/scripture/bhagavadgita"
              className="inline-flex items-center gap-2 bg-white text-saffron-800 px-8 py-4 rounded-full font-bold hover:bg-saffron-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform"
            >
              <Flame className="w-5 h-5" />
              भगवद्गीता पढ़ें
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35, duration: 0.5 }}
          >
            <Link
              href="/scriptures"
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/40 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/25 transition-all hover:scale-105 transform shadow-lg"
            >
              <BookOpen className="w-5 h-5" />
              Browse the Library
            </Link>
          </motion.div>
        </FadeUp>
      </div>

      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-saffron-700" />
    </section>
  );
}
