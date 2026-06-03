'use client';

import { motion } from 'framer-motion';
import { Languages, Atom, ShieldCheck, BookOpen, Brain, Heart } from 'lucide-react';

interface Pillar {
  id: string;
  title: string;
  titleHi: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  examples: string[];
  badge: string;
}

const pillars: Pillar[] = [
  {
    id: 'languages',
    title: 'संस्कृत + हिंदी + English',
    titleHi: 'त्रिभाषा',
    description: 'Every verse: original Sanskrit, transliteration, plain translation, and deep commentary in both Hindi and English.',
    icon: <Languages className="w-6 h-6" />,
    color: 'from-saffron-500 to-saffron-700',
    examples: ['कर्म = Action', 'ध्यान = Meditation', 'योग = Union'],
    badge: 'Language',
  },
  {
    id: 'science',
    title: 'वैज्ञानिक दृष्टिकोण',
    titleHi: 'विज्ञान',
    description: 'प्रत्येक श्लोक के साथ आधुनिक विज्ञान का संदर्भ — न्यूरोसाइंस, मनोविज्ञान और भौतिकी की रोशनी में प्राचीन ज्ञान।',
    icon: <Atom className="w-6 h-6" />,
    color: 'from-indigo-500 to-blue-600',
    examples: ['Neuroscience', 'Psychology', 'Physics', 'Flow State'],
    badge: 'Science',
  },
  {
    id: 'free',
    title: 'Free. Ad-free. Always.',
    titleHi: 'मुफ्त',
    description: 'No paywalls, no trackers, no ads. The text belongs to everyone. Built for learning, not for profit.',
    icon: <ShieldCheck className="w-6 h-6" />,
    color: 'from-emerald-500 to-green-600',
    examples: ['No Paywalls', 'No Trackers', 'Open Access', 'For Learning'],
    badge: 'Free',
  },
];

export function ThreePillarsInfographic() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-saffron-100/30 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-indigo-100/30 blur-3xl" />
      
      <motion.div
        className="text-center mb-12 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-4xl font-serif font-bold text-dharma-text mb-3">
          तीन स्तंभ
        </h2>
        <p className="text-dharma-muted text-lg">
          Three pillars of every verse on this site
        </p>
      </motion.div>

      {/* Main infographic visualization */}
      <div className="relative">
        {/* Central connecting circle */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-br from-saffron-100 to-amber-100 border-2 border-saffron-200 flex items-center justify-center shadow-xl z-10"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          <div className="text-center">
            <BookOpen className="w-8 h-8 mx-auto text-saffron-700 mb-1" />
            <p className="text-xs font-bold text-saffron-800 uppercase tracking-wider">Verse</p>
          </div>
        </motion.div>

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          <motion.path
            d="M 150 200 Q 300 150 450 200"
            stroke="url(#gradient1)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.path
            d="M 150 200 L 450 400"
            stroke="url(#gradient2)"
            strokeWidth="2"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.5" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>

        <div className="grid md:grid-cols-3 gap-8 relative" style={{ zIndex: 1 }}>
          {pillars.map((pillar, index) => (
            <motion.div
              key={pillar.id}
              className="relative"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
            >
              {/* Card with enhanced depth */}
              <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-dharma-border overflow-hidden group">
                {/* Animated background gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${pillar.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Badge */}
                <motion.div
                  className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${pillar.color} text-white shadow-md`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.2 + 0.4, type: "spring" }}
                >
                  {pillar.badge}
                </motion.div>

                {/* Icon */}
                <motion.div
                  className={`relative mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${pillar.color} text-white shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-current opacity-30 blur-lg" />
                  <div className="relative z-10">{pillar.icon}</div>
                </motion.div>

                {/* Title */}
                <h3 className="font-serif font-bold text-xl text-dharma-text mb-2">
                  {pillar.title}
                </h3>
                <p className="font-devanagari text-lg text-saffron-700 mb-4">
                  {pillar.titleHi}
                </p>

                {/* Description */}
                <p className="text-sm text-dharma-muted leading-relaxed mb-6">
                  {pillar.description}
                </p>

                {/* Examples */}
                <div className="flex flex-wrap gap-2">
                  {pillar.examples.map((example, idx) => (
                    <motion.span
                      key={example}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-br from-saffron-50 to-amber-50 text-saffron-800 border border-saffron-200 shadow-sm"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.2 + 0.6 + idx * 0.1 }}
                      whileHover={{ scale: 1.05, y: -2 }}
                    >
                      {example}
                    </motion.span>
                  ))}
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-saffron-200 rounded-tl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-saffron-200 rounded-br-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Floating icon decoration */}
              <motion.div
                className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
              >
                {index === 0 && <BookOpen className="w-5 h-5 text-saffron-600" />}
                {index === 1 && <Brain className="w-5 h-5 text-indigo-600" />}
                {index === 2 && <Heart className="w-5 h-5 text-emerald-600" />}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
