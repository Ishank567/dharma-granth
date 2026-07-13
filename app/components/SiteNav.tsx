'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ChevronDown, Flame, Menu, X } from 'lucide-react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
} from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

const primaryItems = [
  { label: 'मुख', href: '/' },
  { label: 'ग्रंथालय', href: '/scriptures' },
  { label: 'गीता', href: '/scripture/bhagavadgita' },
  { label: 'सीखें', href: '/learn' },
  { label: 'साधना', href: '/practice' },
];

const discoveryItems = [
  { label: 'अवधारणाएँ', description: 'मुख्य दार्शनिक विचार', href: '/concepts' },
  { label: 'विषय', description: 'जीवन और साधना के विषय', href: '/topics' },
  { label: 'पात्र', description: 'कथाओं के प्रमुख चरित्र', href: '/characters' },
  { label: 'स्थान', description: 'पवित्र और ऐतिहासिक स्थल', href: '/locations' },
  { label: 'कालखंड', description: 'समयरेखा और परंपरा', href: '/timelines' },
  { label: 'उत्सव', description: 'पर्व और उनका अर्थ', href: '/festivals' },
  { label: 'अनुष्ठान', description: 'विधियाँ और परंपराएँ', href: '/rituals' },
];

const personalItems = [
  { label: 'मेरा डैशबोर्ड', href: '/dashboard' },
  { label: 'बुकमार्क', href: '/bookmarks' },
  { label: 'अध्ययन पथ', href: '/learn/pathways' },
];

export function SiteNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const discoverRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.6,
  });

  const isActive = (href: string): boolean =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const discoveryIsActive = discoveryItems.some((item) => isActive(item.href));

  useEffect(() => {
    setMobileOpen(false);
    setDiscoverOpen(false);
  }, [pathname]);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!discoverRef.current?.contains(event.target as Node)) {
        setDiscoverOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMobileOpen(false);
        setDiscoverOpen(false);
      }
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const linkClass = (href: string): string =>
    `relative whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors duration-200 ${
      isActive(href)
        ? 'text-saffron-700'
        : 'text-dharma-text hover:bg-saffron-50/50 hover:text-saffron-700'
    }`;

  return (
    <nav
      className="sticky top-0 z-50 border-b border-dharma-border/70 bg-dharma-card/95 shadow-[0_8px_30px_rgba(45,42,38,0.06)] backdrop-blur-xl"
      aria-label="Primary navigation"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-[72px] items-center justify-between gap-4">
          <Link
            href="/"
            className="group flex shrink-0 items-center gap-2.5 rounded-lg"
            aria-label="Dharma Granth home"
          >
            <motion.span
              className="font-devanagari text-3xl leading-none text-saffron-600 transition group-hover:text-saffron-700"
              whileHover={reduce ? undefined : { scale: 1.08, rotate: 4 }}
              aria-hidden="true"
            >
              ॐ
            </motion.span>
            <span className="hidden font-serif text-xl font-bold text-dharma-text transition group-hover:text-saffron-700 sm:inline">
              Dharma Granth
            </span>
          </Link>

          <div className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 lg:flex">
            {primaryItems.map((item) => (
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

            <div className="relative" ref={discoverRef}>
              <button
                type="button"
                onClick={() => setDiscoverOpen((open) => !open)}
                className={`flex items-center gap-1 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors ${
                  discoveryIsActive || discoverOpen
                    ? 'bg-saffron-50 text-saffron-700'
                    : 'text-dharma-text hover:bg-saffron-50/50 hover:text-saffron-700'
                }`}
                aria-expanded={discoverOpen}
                aria-controls="desktop-discovery-menu"
              >
                खोजें
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${discoverOpen ? 'rotate-180' : ''}`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence>
                {discoverOpen && (
                  <motion.div
                    id="desktop-discovery-menu"
                    initial={{ opacity: 0, y: -8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.98 }}
                    transition={{ duration: reduce ? 0 : 0.16 }}
                    className="absolute right-0 top-[calc(100%+0.75rem)] w-[34rem] rounded-2xl border border-dharma-border bg-dharma-card p-3 shadow-2xl"
                  >
                    <p className="px-3 pb-2 pt-1 text-xs font-bold uppercase tracking-[0.16em] text-dharma-muted">
                      ज्ञान संसार
                    </p>
                    <div className="grid grid-cols-2 gap-1">
                      {discoveryItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`rounded-xl px-3 py-3 transition-colors ${
                            isActive(item.href)
                              ? 'bg-saffron-50 text-saffron-800'
                              : 'hover:bg-dharma-bg'
                          }`}
                        >
                          <span className="block text-sm font-bold text-dharma-text">
                            {item.label}
                          </span>
                          <span className="mt-0.5 block text-xs text-dharma-muted">
                            {item.description}
                          </span>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-2 flex gap-2 border-t border-dharma-border px-2 pt-3">
                      {personalItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="rounded-lg px-3 py-2 text-xs font-semibold text-dharma-muted transition hover:bg-dharma-bg hover:text-saffron-700"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <Link
              href="/scripture/bhagavadgita"
              className="hidden items-center gap-2 rounded-full bg-gradient-to-r from-saffron-600 to-amber-600 px-5 py-2.5 text-sm font-bold text-white shadow-md transition hover:from-saffron-700 hover:to-amber-700 hover:shadow-lg xl:inline-flex"
            >
              <Flame className="h-4 w-4" aria-hidden="true" />
              पढ़ना शुरू करें
            </Link>
            <motion.button
              type="button"
              className="rounded-xl p-2.5 text-dharma-text transition hover:bg-saffron-500/10 lg:hidden"
              onClick={() => setMobileOpen((open) => !open)}
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              whileTap={reduce ? undefined : { scale: 0.92 }}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-navigation"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reduce ? 0 : 0.18 }}
            className="absolute inset-x-0 top-full max-h-[calc(100vh-72px)] overflow-y-auto border-t border-dharma-border bg-dharma-card shadow-2xl lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
          >
            <div className="mx-auto max-w-2xl space-y-6 px-4 py-5 sm:px-6">
              <section aria-labelledby="mobile-main-heading">
                <h2
                  id="mobile-main-heading"
                  className="mb-2 px-2 text-xs font-bold uppercase tracking-[0.16em] text-dharma-muted"
                >
                  मुख्य
                </h2>
                <div className="grid grid-cols-2 gap-2">
                  {primaryItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                        isActive(item.href)
                          ? 'border border-saffron-200 bg-saffron-50 text-saffron-700'
                          : 'border border-dharma-border bg-dharma-bg text-dharma-text'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </section>

              <section aria-labelledby="mobile-discover-heading">
                <h2
                  id="mobile-discover-heading"
                  className="mb-2 px-2 text-xs font-bold uppercase tracking-[0.16em] text-dharma-muted"
                >
                  खोजें
                </h2>
                <div className="grid grid-cols-2 gap-1 sm:grid-cols-3">
                  {discoveryItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
                        isActive(item.href)
                          ? 'bg-saffron-50 text-saffron-700'
                          : 'text-dharma-text hover:bg-dharma-bg'
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </section>

              <section aria-labelledby="mobile-personal-heading">
                <h2
                  id="mobile-personal-heading"
                  className="mb-2 px-2 text-xs font-bold uppercase tracking-[0.16em] text-dharma-muted"
                >
                  मेरा अध्ययन
                </h2>
                <div className="flex flex-wrap gap-2">
                  {personalItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="rounded-full border border-dharma-border px-4 py-2 text-sm font-semibold text-dharma-text transition hover:border-saffron-300 hover:text-saffron-700"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </section>
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
