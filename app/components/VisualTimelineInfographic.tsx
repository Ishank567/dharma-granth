'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { Calendar, ChevronRight, Sparkles } from 'lucide-react';

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  titleSanskrit?: string;
  description: string;
  category: 'veda' | 'upanishad' | 'itihasa' | 'purana' | 'modern';
  icon?: string;
}

interface VisualTimelineInfographicProps {
  events: TimelineEvent[];
  className?: string;
}

const categoryColors = {
  veda: { bg: 'from-orange-500 to-amber-600', border: 'border-orange-400', text: 'text-orange-800' },
  upanishad: { bg: 'from-emerald-500 to-green-600', border: 'border-emerald-400', text: 'text-emerald-800' },
  itihasa: { bg: 'from-rose-500 to-pink-600', border: 'border-rose-400', text: 'text-rose-800' },
  purana: { bg: 'from-indigo-500 to-blue-600', border: 'border-indigo-400', text: 'text-indigo-800' },
  modern: { bg: 'from-purple-500 to-violet-600', border: 'border-purple-400', text: 'text-purple-800' },
};

export function VisualTimelineInfographic({ events, className = '' }: VisualTimelineInfographicProps) {
  const reduce = useReducedMotion();
  const [activeEvent, setActiveEvent] = useState<string | null>(null);

  return (
    <div className={`visual-timeline ${className} relative`}>
      {/* Header */}
      <div className="text-center mb-12">
        <motion.div
          initial={reduce ? {} : { scale: 0.8, opacity: 0 }}
          animate={reduce ? {} : { scale: 1, opacity: 1 }}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-saffron-700 bg-gradient-to-r from-saffron-100 to-amber-100 border border-saffron-200 px-5 py-2 rounded-full shadow-sm mb-6"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <Calendar className="w-3.5 h-3.5" />
          </motion.div>
          Timeline of Wisdom
        </motion.div>
        <motion.h2
          initial={reduce ? {} : { opacity: 0, y: -20 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          className="text-4xl font-serif font-bold text-dharma-text mb-4"
        >
          Evolution of Sanātana Dharma
        </motion.h2>
        <motion.p
          initial={reduce ? {} : { opacity: 0 }}
          animate={reduce ? {} : { opacity: 1 }}
          transition={reduce ? {} : { delay: 0.2 }}
          className="text-dharma-muted text-lg"
        >
          A journey through thousands of years of spiritual wisdom
        </motion.p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Central line */}
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-saffron-500 via-amber-500 to-orange-500 transform -translate-x-1/2 rounded-full" />
        
        {/* Animated glow on line */}
        <motion.div
          className="absolute left-1/2 top-0 w-16 h-16 bg-saffron-400/30 rounded-full blur-2xl transform -translate-x-1/2"
          animate={{ top: ['0%', '100%', '0%'] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Events */}
        <div className="space-y-12">
          {events.map((event, index) => {
            const colors = categoryColors[event.category];
            const isLeft = index % 2 === 0;
            const isActive = activeEvent === event.id;

            return (
              <motion.div
                key={event.id}
                initial={reduce ? {} : { opacity: 0, x: isLeft ? -50 : 50 }}
                animate={reduce ? {} : { opacity: 1, x: 0 }}
                transition={reduce ? {} : { delay: index * 0.15 }}
                className={`relative flex items-center ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
              >
                {/* Content card */}
                <motion.div
                  className={`w-5/12 ${isLeft ? 'pr-8 text-right' : 'pl-8 text-left'}`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setActiveEvent(isActive ? null : event.id)}
                >
                  <motion.div
                    className={`bg-white rounded-2xl border-2 shadow-lg p-6 cursor-pointer transition-all ${
                      isActive ? `shadow-2xl ${colors.border}` : 'border-dharma-border hover:shadow-xl'
                    }`}
                  >
                    {/* Year badge */}
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r ${colors.bg} text-white text-xs font-bold mb-3`}>
                      <Calendar className="w-3 h-3" />
                      {event.year}
                    </div>

                    {/* Title */}
                    {event.titleSanskrit && (
                      <p lang="sa" className="font-devanagari text-xl text-saffron-700 mb-2">
                        {event.titleSanskrit}
                      </p>
                    )}
                    <h3 className="text-xl font-serif font-bold text-dharma-text mb-2">
                      {event.title}
                    </h3>

                    {/* Description */}
                    <p className={`text-sm ${isActive ? 'text-dharma-text' : 'text-dharma-muted'} leading-relaxed`}>
                      {isActive ? event.description : `${event.description.substring(0, 100)}...`}
                    </p>

                    {/* Expand hint */}
                    {!isActive && (
                      <motion.div
                        className={`flex items-center gap-1 mt-3 ${isLeft ? 'justify-end' : 'justify-start'} text-xs font-semibold text-saffron-600`}
                      >
                        <span>Click to expand</span>
                        <ChevronRight className={`w-3 h-3 ${isLeft ? '' : 'rotate-180'}`} />
                      </motion.div>
                    )}

                    {/* Icon */}
                    {event.icon && (
                      <div className={`absolute -top-4 ${isLeft ? '-right-4' : '-left-4'} text-4xl`}>
                        {event.icon}
                      </div>
                    )}
                  </motion.div>
                </motion.div>

                {/* Center dot */}
                <motion.div
                  className={`absolute left-1/2 w-8 h-8 rounded-full bg-gradient-to-br ${colors.bg} border-4 border-white shadow-lg transform -translate-x-1/2 z-10 flex items-center justify-center`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {event.icon || (
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  )}
                </motion.div>

                {/* Empty space for alternating layout */}
                <div className="w-5/12" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={reduce ? {} : { opacity: 0, y: 30 }}
        animate={reduce ? {} : { opacity: 1, y: 0 }}
        transition={reduce ? {} : { delay: events.length * 0.15 }}
        className="mt-16 text-center"
      >
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-saffron-100 to-amber-100 rounded-full border border-saffron-200">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-4 h-4 text-saffron-600" />
          </motion.div>
          <span className="text-sm font-semibold text-saffron-800">
            {events.length} major events spanning millennia
          </span>
        </div>
      </motion.div>
    </div>
  );
}
