'use client';

import { motion, useReducedMotion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { useState, useRef } from 'react';
import { Search, ZoomIn, ZoomOut, Maximize2, Download, ChevronDown, ChevronUp } from 'lucide-react';

export interface MindMapNode {
  id: string;
  label: string;
  labelSanskrit?: string;
  description?: string;
  children?: MindMapNode[];
  color?: string;
}

interface MindMapProps {
  data: MindMapNode;
  className?: string;
}

export function MindMap({ data, className = '' }: MindMapProps) {
  const reduce = useReducedMotion();
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([data.id]));
  const [searchQuery, setSearchQuery] = useState('');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const expandAll = () => {
    const allNodes = new Set<string>();
    const collectNodes = (node: MindMapNode) => {
      allNodes.add(node.id);
      node.children?.forEach(collectNodes);
    };
    collectNodes(data);
    setExpandedNodes(allNodes);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set([data.id]));
  };

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const handlePanEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setPan((prev) => ({
      x: prev.x + info.offset.x,
      y: prev.y + info.offset.y,
    }));
  };

  // Filter nodes based on search
  const filterNodes = (node: MindMapNode, query: string): MindMapNode | null => {
    if (!query) return node;
    const matches = node.label.toLowerCase().includes(query.toLowerCase()) ||
                   (node.labelSanskrit?.toLowerCase().includes(query.toLowerCase())) ||
                   (node.description?.toLowerCase().includes(query.toLowerCase()));
    
    if (!matches && !node.children) return null;
    
    const filteredChildren = node.children
      ?.map(child => filterNodes(child, query))
      .filter((child): child is MindMapNode => child !== null);
    
    if (matches || (filteredChildren && filteredChildren.length > 0)) {
      return { ...node, children: filteredChildren };
    }
    return null;
  };

  const filteredData = searchQuery ? filterNodes(data, searchQuery) : data;

  const renderNode = (node: MindMapNode, depth: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const nodeColor = node.color || (depth === 0 ? 'saffron' : depth === 1 ? 'indigo' : 'emerald');
    const matchesSearch = searchQuery && (
      node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.labelSanskrit?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div key={node.id} className="relative">
        {/* Node */}
        <motion.div
          initial={reduce ? {} : { opacity: 0, x: -20 }}
          animate={reduce ? {} : { opacity: 1, x: 0 }}
          transition={reduce ? {} : { duration: 0.3, delay: depth * 0.1 }}
          className="relative"
        >
          <div
            className={`inline-flex flex-col items-center p-4 rounded-2xl border-2 shadow-lg cursor-pointer transition-all hover:scale-105 hover:shadow-xl ${
              depth === 0
                ? 'bg-gradient-to-br from-saffron-500 to-amber-600 border-saffron-400 text-white'
                : depth === 1
                ? 'bg-gradient-to-br from-indigo-500 to-blue-600 border-indigo-400 text-white'
                : 'bg-gradient-to-br from-emerald-500 to-green-600 border-emerald-400 text-white'
            } ${matchesSearch ? 'ring-4 ring-yellow-400' : ''}`}
            style={{ minWidth: depth === 0 ? '200px' : '160px' }}
            onClick={() => hasChildren && toggleNode(node.id)}
            role="button"
            tabIndex={0}
            aria-label={isExpanded ? `Collapse ${node.label}` : `Expand ${node.label}`}
            onKeyDown={(e) => {
              if (e.key === ' ' || e.key === 'Enter') {
                e.preventDefault();
                hasChildren && toggleNode(node.id);
              }
            }}
          >
            {node.labelSanskrit && (
              <p lang="sa" className="font-devanagari text-lg mb-1">
                {node.labelSanskrit}
              </p>
            )}
            <p className={`font-serif font-bold ${depth === 0 ? 'text-xl' : 'text-base'} text-center`}>
              {node.label}
            </p>
            {node.description && depth > 0 && (
              <p className="text-xs opacity-90 mt-1 text-center leading-tight">
                {node.description}
              </p>
            )}
            {hasChildren && (
              <motion.div
                animate={reduce ? {} : { rotate: isExpanded ? 180 : 0 }}
                className="mt-2"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <motion.div
            initial={reduce ? {} : { opacity: 0, height: 0 }}
            animate={reduce ? {} : { opacity: 1, height: 'auto' }}
            transition={reduce ? {} : { duration: 0.3 }}
            className="mt-6 pl-8 border-l-2 border-dharma-border ml-8"
          >
            <div className="grid gap-6">
              {node.children?.map((child) => renderNode(child, depth + 1))}
            </div>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className={`mindmap-container ${className}`}>
      {/* Controls */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={expandAll}
            className="flex items-center gap-1 px-3 py-2 bg-white border border-dharma-border rounded-lg text-sm font-semibold hover:bg-saffron-50 transition"
            title="Expand all"
          >
            <ChevronDown className="w-4 h-4" />
            Expand All
          </button>
          <button
            onClick={collapseAll}
            className="flex items-center gap-1 px-3 py-2 bg-white border border-dharma-border rounded-lg text-sm font-semibold hover:bg-saffron-50 transition"
            title="Collapse all"
          >
            <ChevronUp className="w-4 h-4" />
            Collapse All
          </button>
        </div>

        <div className="flex items-center gap-2">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dharma-muted" />
              <input
                type="text"
                placeholder="Search nodes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-dharma-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-saffron-500"
              />
            </div>
          )}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 bg-white border border-dharma-border rounded-lg hover:bg-saffron-50 transition"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-2 bg-white border border-dharma-border rounded-lg hover:bg-saffron-50 transition"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-sm font-semibold text-dharma-muted w-12 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-2 bg-white border border-dharma-border rounded-lg hover:bg-saffron-50 transition"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="p-2 bg-white border border-dharma-border rounded-lg hover:bg-saffron-50 transition"
            title="Reset zoom"
          >
            Reset
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-white border border-dharma-border rounded-lg hover:bg-saffron-50 transition"
            title="Toggle fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mindmap Container */}
      <motion.div
        ref={containerRef}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-saffron-50 to-amber-50 border-2 border-saffron-200 p-8 ${
          isFullscreen ? 'fixed inset-0 z-50 m-0 rounded-none' : 'min-h-[500px]'
        }`}
        drag
        dragMomentum={false}
        onDragEnd={handlePanEnd}
        style={{ cursor: 'grab' }}
        whileDrag={{ cursor: 'grabbing' }}
      >
        <motion.div
          style={{
            scale: zoom,
            x: pan.x,
            y: pan.y,
          }}
          transition={reduce ? {} : { type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="flex flex-col items-center">
            {filteredData ? renderNode(filteredData) : (
              <p className="text-dharma-muted">No matching nodes found</p>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
