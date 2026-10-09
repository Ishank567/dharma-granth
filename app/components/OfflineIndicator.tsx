'use client';

import { useEffect, useState } from 'react';
import { Wifi, WifiOff } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function OfflineIndicator() {
  const [isOffline, setIsOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOffline = () => {
      setIsOffline(true);
      setShowReconnected(false);
    };

    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      const timer = setTimeout(() => setShowReconnected(false), 3500);
      return () => clearTimeout(timer);
    };

    setIsOffline(!navigator.onLine);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {isOffline && (
        <motion.div
          key="offline-indicator"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-full border border-amber-500/40 bg-stone-900/95 px-4 py-2 text-xs font-semibold text-amber-200 shadow-xl backdrop-blur-md dark:bg-stone-950/95 sm:bottom-6"
        >
          <div className="flex items-center gap-2">
            <WifiOff className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
            <span lang="hi">आप ऑफ़लाइन हैं · सहेजे पृष्ठ उपलब्ध हैं</span>
            <span className="hidden text-[10px] text-amber-300/80 sm:inline" lang="en">
              (Offline Mode)
            </span>
          </div>
        </motion.div>
      )}

      {showReconnected && (
        <motion.div
          key="online-indicator"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-full border border-emerald-500/40 bg-stone-900/95 px-4 py-2 text-xs font-semibold text-emerald-300 shadow-xl backdrop-blur-md dark:bg-stone-950/95 sm:bottom-6"
        >
          <div className="flex items-center gap-2">
            <Wifi className="h-3.5 w-3.5 text-emerald-400" aria-hidden="true" />
            <span lang="hi">इंटरनेट पुनः जुड़ गया</span>
            <span className="hidden text-[10px] text-emerald-300/80 sm:inline" lang="en">
              (Connected)
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
