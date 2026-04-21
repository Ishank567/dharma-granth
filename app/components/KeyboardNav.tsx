'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function KeyboardNav({
  prevHref,
  nextHref,
}: {
  prevHref: string | null;
  nextHref: string | null;
}) {
  const router = useRouter();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if user is typing in an input/textarea
      const el = e.target as HTMLElement;
      if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.tagName === 'SELECT' || el.contentEditable === 'true') return;

      if (e.key === 'ArrowLeft' && prevHref) {
        router.push(prevHref);
      } else if (e.key === 'ArrowRight' && nextHref) {
        router.push(nextHref);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevHref, nextHref, router]);

  return null;
}
