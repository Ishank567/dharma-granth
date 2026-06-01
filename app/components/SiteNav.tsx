'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Flame, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Library', href: '/scriptures' },
  { label: 'Bhagavad Gita', href: '/scripture/bhagavadgita' },
  { label: 'Isha Upanishad', href: '/scripture/ishavasya' },
];

export function SiteNav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string): boolean =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  const linkClass = (href: string): string =>
    `px-3 py-2 rounded-lg text-sm font-semibold transition ${
      isActive(href)
        ? 'text-saffron-700 bg-saffron-50'
        : 'text-dharma-text hover:text-saffron-700 hover:bg-saffron-50'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-dharma-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-devanagari text-2xl text-saffron-600 leading-none group-hover:text-saffron-700 transition group-hover:scale-110 transform">
              ॐ
            </span>
            <span className="font-serif font-bold text-lg text-dharma-text group-hover:text-saffron-700 transition">
              Dharma Granth
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass(item.href)}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/scripture/bhagavadgita"
              className="inline-flex items-center gap-1.5 bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white text-sm font-bold px-5 py-2 rounded-full transition-all shadow-md hover:shadow-lg hover:scale-105 transform"
            >
              <Flame className="w-4 h-4" />
              Start Reading
            </Link>
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle />
            <button
              className="p-2 rounded-lg text-dharma-text hover:bg-saffron-50 transition"
              onClick={() => setMobileOpen((prev) => !prev)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-dharma-border bg-white/95 backdrop-blur-lg pb-4">
          <div className="flex flex-col gap-1 pt-2 px-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition ${
                  (item.href === '/' ? pathname === '/' : pathname.startsWith(item.href))
                    ? 'text-saffron-700 bg-saffron-50'
                    : 'text-dharma-text hover:text-saffron-700 hover:bg-saffron-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-3 pt-3 border-t border-dharma-border px-1">
              <Link
                href="/scripture/bhagavadgita"
                onClick={() => setMobileOpen(false)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-saffron-600 to-amber-600 hover:from-saffron-700 hover:to-amber-700 text-white text-sm font-bold px-4 py-2.5 rounded-full transition-all shadow-md w-full"
              >
                Start Reading the Gita
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
