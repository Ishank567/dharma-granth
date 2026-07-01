'use client';

import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { KineticCard } from '@/app/components/motion/KineticCard';

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
        className="relative overflow-hidden rounded-[2rem] border border-dharma-border/70 bg-dharma-card/55 p-4 shadow-[0_24px_70px_-48px_rgba(45,42,38,0.55)] backdrop-blur-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-saffron-300/80 to-transparent" />
        <div className="absolute inset-0 opacity-[0.18] mandala-bg pointer-events-none" />
        
        <div className="relative grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              {/* Card with depth */}
              <KineticCard
                wrapperClassName="h-full"
                className="relative h-full overflow-hidden rounded-2xl border border-dharma-border bg-white/90 shadow-lg"
                contentClassName="p-6 text-center"
                rotate={6}
                depth={30}
                lift={8}
                hoverScale={1.018}
                hoverShadow="0 28px 58px -22px rgba(45, 42, 38, 0.35)"
              >
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
              </KineticCard>
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
