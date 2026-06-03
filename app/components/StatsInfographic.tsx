'use client';

import { motion } from 'framer-motion';
import { BookOpen, Scroll, Flame, TreePine, TrendingUp } from 'lucide-react';

interface StatItem {
  value: number;
  label: string;
  icon: React.ReactNode;
  color: string;
  border: string;
  trend?: string;
}

interface StatsInfographicProps {
  stats: StatItem[];
}

export function StatsInfographic({ stats }: StatsInfographicProps) {
  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 rounded-full bg-saffron-100/50 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 rounded-full bg-emerald-100/50 blur-3xl" />
        
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="relative group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {/* Card with depth */}
              <div className="relative bg-white rounded-2xl border border-dharma-border p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden">
                {/* Animated gradient background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Icon container with glow */}
                <motion.div
                  className={`relative mx-auto mb-4 inline-flex items-center justify-center w-16 h-16 rounded-2xl ${stat.color} border ${stat.border} shadow-lg`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="absolute inset-0 rounded-2xl bg-current opacity-20 blur-md" />
                  <div className="relative">{stat.icon}</div>
                </motion.div>
                
                {/* Value with counter animation effect */}
                <motion.div
                  className="text-4xl md:text-5xl font-bold text-dharma-text mb-1"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
                >
                  {stat.value.toLocaleString()}
                </motion.div>
                
                {/* Label */}
                <div className="text-xs text-dharma-muted mt-2 uppercase tracking-wider font-semibold">
                  {stat.label}
                </div>
                
                {/* Trend indicator */}
                {stat.trend && (
                  <motion.div
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.1 + 0.5 }}
                  >
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend}
                  </motion.div>
                )}
                
                {/* Decorative corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-saffron-200 rounded-tl-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-saffron-200 rounded-br-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* Description with visual element */}
        <motion.p
          className="text-center text-sm text-dharma-muted mt-6 max-w-2xl mx-auto relative"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Numbers reflect verses with full hand-authored commentary. The library
          catalogs traditional texts and grows over time.
        </motion.p>
      </motion.div>
    </section>
  );
}
