'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, BookOpen, Search, Bookmark, Home, Compass } from 'lucide-react';
import ThemeToggle from '@/app/components/ThemeToggle';

const NAV_ITEMS = [
  { href: '/', label: 'मुख्य पृष्ठ', icon: Home },
  { href: '/categories', label: 'ग्रंथ सूची', icon: BookOpen },
  { href: '/courses', label: 'अध्ययन पथ', icon: Compass },
  { href: '/search', label: 'खोजें', icon: Search },
  { href: '/bookmarks', label: 'पुस्तक चिह्न', icon: Bookmark },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🙏</span>
            <span className="font-serif-deva text-xl font-bold text-primary">
              धर्म ग्रंथ
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="मुख्य नेविगेशन" className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === '/'
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-accent-bg text-accent'
                      : 'text-muted hover:bg-card-hover hover:text-foreground'
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </Link>
              );
            })}
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? 'मेनू बंद करें' : 'मेनू खोलें'}
              className="rounded-lg p-2 text-muted hover:bg-card-hover"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <nav aria-label="मोबाइल नेविगेशन" className="border-t border-border py-3 md:hidden">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = item.href === '/'
                ? pathname === item.href
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-accent-bg text-accent'
                      : 'text-muted hover:bg-card-hover hover:text-foreground'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
