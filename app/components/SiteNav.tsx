'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Flame, Menu, X } from 'lucide-react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Library', href: '/scriptures' },
  { label: 'Bhagavad Gita', href: '/scripture/bhagavadgita' },
  { label: 'Bookmarks', href: '/bookmarks' },
];

export function SiteNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.6,
  });

  const isActive = (href: string): boolean =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const linkClass = (href: string): string =>
    `relative overflow-hidden px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors duration-200 ${
      isActive(href)
        ? 'text-saffron-700'
        : 'text-dharma-text hover:text-saffron-700 hover:bg-saffron-50/50'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-dharma-card/95 backdrop-blur-xl border-b border-dharma-border/50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-18 flex items-center justify-between py-3">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <motion.span 
              className="font-devanagari text-3xl text-saffron-600 leading-none group-hover:text-saffron-700 transition"
              whileHover={reduce ? undefined : { scale: 1.1, rotate: 5 }}
            >
              ॐ
            </motion.span>
            <span className="font-serif font-bold text-xl text-dharma-text group-hover:text-saffron-700 transition">
              Dharma Granth
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                {isActive(item.href) && (
                  <motion.span
                    layoutId="site-nav-active"
                    className="absolute inset-0 rounded-xl border border-saffron-200 bg-gradient-to-r from-saffron-50 to-amber-50 shadow-sm"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            <motion.div
              whileHover={reduce ? undefined : { scale: 1.05 }}
              whileTap={reduce ? undefined : { scale: 0.98 }}
            >
              <Link
                href="/scripture/bhagavadgita"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white text-sm font-bold px-6 py-2.5 rounded-full transition-all shadow-lg hover:shadow-xl transform"
              >
                <Flame className="w-4 h-4" />
                Start Reading
              </Link>
            </motion.div>
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <motion.button
              className="p-2.5 rounded-xl text-dharma-text hover:bg-saffron-500/10 transition"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              whileTap={reduce ? undefined : { scale: 0.9 }}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.button>
          </div>

        </div>
      </div>

      {/* Mobile dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-dharma-border/50 bg-dharma-card/98 backdrop-blur-xl pb-4 overflow-hidden"
          >
            <div className="flex flex-col gap-1 pt-3 px-3">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href))
                        ? 'text-saffron-700 bg-gradient-to-r from-saffron-50 to-amber-50 border border-saffron-200 shadow-sm'
                        : 'text-dharma-text hover:text-saffron-700 hover:bg-saffron-50/50'
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              transition={{ delay: navItems.length * 0.05 }}
              className="mt-4 pt-4 border-t border-dharma-border/50 px-1"
              >
                <Link
                  href="/scripture/bhagavadgita"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white text-sm font-bold px-5 py-3 rounded-full transition-all shadow-lg w-full"
                >
                  <Flame className="w-4 h-4" />
                  Start Reading the Gita
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-gradient-to-r from-saffron-500 via-amber-400 to-emerald-400"
        style={{ scaleX: reduce ? scrollYProgress : progress }}
      />
    </nav>
  );
}
