'use client';

import { motion } from 'framer-motion';
import { Atom, Brain, Sparkles, Zap, ArrowRight } from 'lucide-react';

interface Connection {
  verse: string;
  claim: string;
  science: string;
  icon: React.ReactNode;
  color: string;
}

const connections: Connection[] = [
  {
    verse: 'गीता २.२०',
    claim: 'आत्मा अजन्मा है',
    science: 'Energy Conservation Law — Einstein',
    icon: <Zap className="w-4 h-4" />,
    color: 'from-amber-500 to-orange-600',
  },
  {
    verse: 'गीता ६.५',
    claim: 'मन मित्र भी, शत्रु भी',
    science: 'Prefrontal Cortex & Amygdala Regulation',
    icon: <Brain className="w-4 h-4" />,
    color: 'from-blue-500 to-indigo-600',
  },
  {
    verse: 'गीता २.४७',
    claim: 'निष्काम कर्म करो',
    science: 'Flow State — Csikszentmihalyi',
    icon: <Sparkles className="w-4 h-4" />,
    color: 'from-purple-500 to-pink-600',
  },
];

export function ScienceSpiritualityInfographic() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 -z-10" />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-indigo-100/30 blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-purple-100/30 blur-3xl" />

      <motion.div
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-8 md:p-10 shadow-2xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 mandala-bg opacity-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
        
        <div className="relative grid md:grid-cols-2 gap-10 items-center">
          {/* Left side: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <motion.div
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-300 mb-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              >
                <Atom className="w-3.5 h-3.5" />
              </motion.div>
              विज्ञान और अध्यात्म
            </motion.div>
            
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 leading-tight">
              Where Ancient Wisdom
              <br />
              Meets Modern Science
            </h2>
            <p className="text-indigo-100 text-base leading-relaxed">
              The Gita taught &ldquo;process over outcome&rdquo; 2500 years
              before Carol Dweck. The Upanishads described consciousness
              before neuroscience. Every verse here connects the timeless to
              the testable.
            </p>

            {/* Visual indicator */}
            <motion.div
              className="mt-6 flex items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full bg-indigo-300"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  />
                ))}
              </div>
              <span className="text-xs text-indigo-300 font-semibold">
                Scientifically Validated Concepts
              </span>
            </motion.div>
          </motion.div>

          {/* Right side: Connection cards with infographic style */}
          <div className="space-y-4">
            {connections.map((row, index) => (
              <motion.div
                key={row.verse}
                className="relative group"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.15, duration: 0.5 }}
              >
                {/* Connection line */}
                <div className="absolute left-5 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gradient-to-r from-indigo-300/50 to-purple-300/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all hover:scale-[1.02] hover:shadow-2xl">
                  {/* Icon with glow */}
                  <motion.div
                    className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-700 to-purple-700 flex items-center justify-center text-indigo-200 shadow-lg relative z-10"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="absolute inset-0 rounded-xl bg-current opacity-30 blur-md" />
                    <div className="relative">{row.icon}</div>
                  </motion.div>

                  {/* Content */}
                  <div className="flex-1 relative z-10">
                    <p className="text-xs text-indigo-300 mb-1 font-semibold tracking-wider">
                      {row.verse}
                    </p>
                    <p className="font-devanagari text-sm text-white font-semibold mb-1">
                      {row.claim}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <ArrowRight className="w-3 h-3 text-indigo-300" />
                      <p className="text-xs text-indigo-300">
                        {row.science}
                      </p>
                    </div>
                  </div>

                  {/* Decorative corner */}
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-indigo-300/30 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom decorative wave */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500" />
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{ x: ['-100%', '100%'] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </motion.div>
    </section>
  );
}
