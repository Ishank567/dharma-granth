'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';
import logoSplash from '@/public/logo-splash.webp';

/**
 * Brand splash, shown once per browser session on the first page a reader
 * lands on (the head script in layout.tsx hides it on later pages).
 *
 * Everything is CSS (`.splash*` in globals.css): the markup is server-rendered
 * and the animation plays and dismisses itself before hydration, so the splash
 * never waits on JS the way the old opacity-0 page fade did. JS only adds
 * tap/key-to-skip. Decorative, so hidden from assistive tech; the page under
 * it is fully rendered and reachable the whole time.
 */
export function SplashScreen() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || getComputedStyle(el).display === 'none') return;
    // The fade-out ends at visibility: hidden, so the node can stay mounted.
    const skip = () => el.classList.add('is-skipped');
    window.addEventListener('pointerdown', skip, { once: true });
    window.addEventListener('keydown', skip, { once: true });
    return () => {
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('keydown', skip);
    };
  }, []);

  return (
    <div ref={ref} className="splash" aria-hidden="true">
      <div className="splash-stage">
        <div className="splash-emblem">
          <svg className="splash-ring" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="splash-ring-gold" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f3c26b" />
                <stop offset="55%" stopColor="#d9912f" />
                <stop offset="100%" stopColor="#b4530b" />
              </linearGradient>
            </defs>
            <circle cx="100" cy="100" r="97" pathLength={1} />
          </svg>
          <div className="splash-badge">
            <Image src={logoSplash} alt="" width={176} height={176} priority />
          </div>
        </div>
        <p className="splash-wordmark">Dharma Granth</p>
        <div className="splash-rule">
          <span className="splash-line splash-line-left" />
          <span className="splash-om">ॐ</span>
          <span className="splash-line splash-line-right" />
        </div>
      </div>
    </div>
  );
}
