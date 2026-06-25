'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { Network, Sparkles, ChevronRight } from 'lucide-react';

export interface MindMapNode {
  id: string;
  label: string;
  labelSanskrit?: string;
  description?: string;
  category: 'core' | 'primary' | 'secondary';
  icon?: string;
  connections: string[];
}

interface MindMapInfographicProps {
  nodes: MindMapNode[];
  className?: string;
}

const nodeStyles = {
  core: {
    size: 'w-32 h-32',
    bg: 'from-saffron-500 to-amber-600',
    border: 'border-saffron-400',
    text: 'text-white',
    textSize: 'text-lg font-bold'
  },
  primary: {
    size: 'w-24 h-24',
    bg: 'from-indigo-500 to-blue-600',
    border: 'border-indigo-400',
    text: 'text-white',
    textSize: 'text-sm font-bold'
  },
  secondary: {
    size: 'w-20 h-20',
    bg: 'from-emerald-500 to-green-600',
    border: 'border-emerald-400',
    text: 'text-white',
    textSize: 'text-xs font-semibold'
  }
};

export function MindMapInfographic({ nodes, className = '' }: MindMapInfographicProps) {
  const reduce = useReducedMotion();
  const [activeNode, setActiveNode] = useState<string | null>(null);

  const coreNode = nodes.find(n => n.category === 'core');
  const primaryNodes = nodes.filter(n => n.category === 'primary');
  const secondaryNodes = nodes.filter(n => n.category === 'secondary');

  return (
    <div className={`mind-map-infographic ${className} relative`}>
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
            <Network className="w-3.5 h-3.5" />
          </motion.div>
          Concept Map
        </motion.div>
        <motion.h2
          initial={reduce ? {} : { opacity: 0, y: -20 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          className="text-4xl font-serif font-bold text-dharma-text mb-4"
        >
          Interconnected Wisdom
        </motion.h2>
        <motion.p
          initial={reduce ? {} : { opacity: 0 }}
          animate={reduce ? {} : { opacity: 1 }}
          transition={reduce ? {} : { delay: 0.2 }}
          className="text-dharma-muted text-lg"
        >
          Explore the deep connections between spiritual concepts
        </motion.p>
      </div>

      {/* Mind Map Container */}
      <div className="relative min-h-[500px] flex items-center justify-center">
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          {nodes.map((node) => {
            if (!coreNode) return null;
            if (node.category === 'core') return null;
            
            // Calculate positions (simplified for demo)
            const primaryIndex = primaryNodes.findIndex(n => n.id === node.id);
            const isPrimary = primaryIndex !== -1;
            
            if (isPrimary) {
              // Lines from core to primary
              const angle = (primaryIndex / primaryNodes.length) * 2 * Math.PI - Math.PI / 2;
              const radius = 180;
              const x1 = 50; // center
              const y1 = 50; // center
              const x2 = 50 + Math.cos(angle) * (radius / 5);
              const y2 = 50 + Math.sin(angle) * (radius / 5);
              
              return (
                <motion.line
                  key={`line-${node.id}`}
                  x1={`${x1}%`}
                  y1={`${y1}%`}
                  x2={`${x2}%`}
                  y2={`${y2}%`}
                  stroke="url(#gradientLine)"
                  strokeWidth="2"
                  strokeOpacity="0.5"
                  initial={reduce ? {} : { pathLength: 0 }}
                  animate={reduce ? {} : { pathLength: 1 }}
                  transition={reduce ? {} : { delay: 0.5, duration: 1 }}
                />
              );
            }
            return null;
          })}
          
          <defs>
            <linearGradient id="gradientLine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.6" />
            </linearGradient>
          </defs>
        </svg>

        {/* Core Node */}
        {coreNode && (
          <motion.div
            initial={reduce ? {} : { scale: 0, opacity: 0 }}
            animate={reduce ? {} : { scale: 1, opacity: 1 }}
            transition={reduce ? {} : { delay: 0.3 }}
            className={`absolute ${nodeStyles.core.size} rounded-full bg-gradient-to-br ${nodeStyles.core.bg} border-4 ${nodeStyles.core.border} shadow-2xl flex items-center justify-center cursor-pointer z-20`}
            onClick={() => setActiveNode(activeNode === coreNode.id ? null : coreNode.id)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="text-center p-2">
              {coreNode.icon && <div className="text-3xl mb-1">{coreNode.icon}</div>}
              <p className={nodeStyles.core.textSize}>{coreNode.label}</p>
              {coreNode.labelSanskrit && (
                <p lang="sa" className="font-devanagari text-xs opacity-90">{coreNode.labelSanskrit}</p>
              )}
            </div>
          </motion.div>
        )}

        {/* Primary Nodes */}
        {primaryNodes.map((node, index) => {
          const angle = (index / primaryNodes.length) * 2 * Math.PI - Math.PI / 2;
          const radius = 180;
          const x = 50 + Math.cos(angle) * (radius / 5);
          const y = 50 + Math.sin(angle) * (radius / 5);
          
          return (
            <motion.div
              key={node.id}
              initial={reduce ? {} : { scale: 0, opacity: 0 }}
              animate={reduce ? {} : { scale: 1, opacity: 1 }}
              transition={reduce ? {} : { delay: 0.4 + index * 0.1 }}
              className={`absolute ${nodeStyles.primary.size} rounded-full bg-gradient-to-br ${nodeStyles.primary.bg} border-3 ${nodeStyles.primary.border} shadow-xl flex items-center justify-center cursor-pointer z-10`}
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-center p-2">
                {node.icon && <div className="text-2xl mb-1">{node.icon}</div>}
                <p className={nodeStyles.primary.textSize}>{node.label}</p>
              </div>
            </motion.div>
          );
        })}

        {/* Secondary Nodes */}
        {secondaryNodes.map((node, index) => {
          // Position around primary nodes
          const primaryIndex = index % primaryNodes.length;
          const primaryNode = primaryNodes[primaryIndex];
          if (!primaryNode) return null;
          
          const primaryAngle = (primaryIndex / primaryNodes.length) * 2 * Math.PI - Math.PI / 2;
          const secondaryAngle = primaryAngle + (Math.random() - 0.5) * 1.5;
          const radius = 280;
          const x = 50 + Math.cos(secondaryAngle) * (radius / 5);
          const y = 50 + Math.sin(secondaryAngle) * (radius / 5);
          
          return (
            <motion.div
              key={node.id}
              initial={reduce ? {} : { scale: 0, opacity: 0 }}
              animate={reduce ? {} : { scale: 1, opacity: 1 }}
              transition={reduce ? {} : { delay: 0.6 + index * 0.1 }}
              className={`absolute ${nodeStyles.secondary.size} rounded-full bg-gradient-to-br ${nodeStyles.secondary.bg} border-2 ${nodeStyles.secondary.border} shadow-lg flex items-center justify-center cursor-pointer z-5`}
              style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="text-center p-1">
                {node.icon && <div className="text-xl">{node.icon}</div>}
                <p className={nodeStyles.secondary.textSize}>{node.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Active Node Details */}
      {activeNode && (
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          className="mt-8 bg-white rounded-2xl border-2 border-saffron-200 p-6 shadow-xl"
        >
          {(() => {
            const node = nodes.find(n => n.id === activeNode);
            if (!node) return null;
            
            return (
              <div>
                <div className="flex items-center gap-3 mb-4">
                  {node.icon && <div className="text-3xl">{node.icon}</div>}
                  <div>
                    {node.labelSanskrit && (
                      <p lang="sa" className="font-devanagari text-xl text-saffron-700">
                        {node.labelSanskrit}
                      </p>
                    )}
                    <h3 className="text-2xl font-serif font-bold text-dharma-text">
                      {node.label}
                    </h3>
                  </div>
                </div>
                {node.description && (
                  <p className="text-dharma-muted leading-relaxed">
                    {node.description}
                  </p>
                )}
                {node.connections.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-dharma-border">
                    <p className="text-xs font-bold text-dharma-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Sparkles className="w-3 h-3" />
                      Connected Concepts
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {node.connections.map((connId, idx) => {
                        const connectedNode = nodes.find(n => n.id === connId);
                        if (!connectedNode) return null;
                        return (
                          <motion.button
                            key={idx}
                            onClick={() => setActiveNode(connId)}
                            className="px-3 py-1.5 bg-gradient-to-r from-saffron-500/10 to-amber-500/10 text-saffron-800 rounded-full text-xs font-semibold border border-saffron-500/20 shadow-sm flex items-center gap-1 hover:from-saffron-500/20 hover:to-amber-500/20 transition"
                            whileHover={{ scale: 1.05 }}
                          >
                            <ChevronRight className="w-3 h-3" />
                            {connectedNode.label}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </motion.div>
      )}

      {/* Legend */}
      <motion.div
        initial={reduce ? {} : { opacity: 0 }}
        animate={reduce ? {} : { opacity: 1 }}
        transition={reduce ? {} : { delay: 1 }}
        className="mt-8 flex items-center justify-center gap-6"
      >
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-saffron-500 to-amber-600" />
          <span className="text-sm text-dharma-muted">Core Concept</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600" />
          <span className="text-sm text-dharma-muted">Primary</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-500 to-green-600" />
          <span className="text-sm text-dharma-muted">Secondary</span>
        </div>
      </motion.div>
    </div>
  );
}
