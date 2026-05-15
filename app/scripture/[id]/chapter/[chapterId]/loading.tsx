'use client';

import { motion } from 'framer-motion';

/**
 * Loading skeleton for the scripture chapter route.
 *
 * Mirrors the layout of the real chapter page: a saffron hero block
 * with a pulsing OM, then three placeholder verse cards. The pulse
 * uses a slow opacity wave rather than a left-to-right shimmer — fits
 * the meditative tone of the page better.
 */
export default function ChapterLoading() {
  return (
    <main className="min-h-screen bg-dharma-bg">
      {/* Hero placeholder */}
      <div className="relative bg-gradient-to-br from-saffron-900 via-saffron-700 to-orange-600 text-white py-16 overflow-hidden">
        {/* Slowly-rotating, pulsing OM placeholder */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center text-white/10 text-[14rem] font-devanagari select-none"
          animate={{ opacity: [0.06, 0.16, 0.06], scale: [0.95, 1.02, 0.95] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          ॐ
        </motion.div>

        <div className="relative max-w-4xl mx-auto px-6 space-y-4">
          <SkeletonBar w="w-32" h="h-4" />
          <div className="flex items-start gap-5 pt-4">
            <SkeletonBar w="w-16" h="h-16" rounded="rounded-2xl" />
            <div className="flex-1 space-y-3">
              <SkeletonBar w="w-40" h="h-3" />
              <SkeletonBar w="w-3/4" h="h-8" />
              <SkeletonBar w="w-1/3" h="h-6" />
            </div>
          </div>
          <div className="pt-2 space-y-2">
            <SkeletonBar w="w-full" h="h-3" />
            <SkeletonBar w="w-5/6" h="h-3" />
          </div>
        </div>
      </div>

      {/* Verse card placeholders */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-10">
        {[0, 1, 2].map((i) => (
          <motion.article
            key={i}
            className="rounded-2xl border border-dharma-border bg-white overflow-hidden shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.12, duration: 0.4, ease: 'easeOut' }}
          >
            <div className="bg-gradient-to-r from-saffron-50 via-amber-50 to-rose-50 px-6 py-4 border-b border-dharma-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SkeletonBar w="w-9" h="h-9" rounded="rounded-full" />
                <div className="space-y-1.5">
                  <SkeletonBar w="w-14" h="h-2" />
                  <SkeletonBar w="w-20" h="h-3" />
                </div>
              </div>
              <SkeletonBar w="w-9" h="h-9" rounded="rounded-full" />
            </div>
            <div className="p-6 md:p-7 space-y-4">
              {[0, 1, 2, 3].map((j) => (
                <div key={j} className="space-y-2">
                  <SkeletonBar w="w-24" h="h-2.5" />
                  <SkeletonBar w="w-full" h="h-3" />
                  <SkeletonBar w="w-11/12" h="h-3" />
                  <SkeletonBar w="w-5/6" h="h-3" />
                </div>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </main>
  );
}

function SkeletonBar({
  w,
  h,
  rounded = 'rounded',
}: {
  w: string;
  h: string;
  rounded?: string;
}) {
  return (
    <motion.div
      className={`${w} ${h} ${rounded} bg-stone-200/70`}
      animate={{ opacity: [0.5, 0.85, 0.5] }}
      transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
    />
  );
}
