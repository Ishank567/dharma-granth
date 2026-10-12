'use client';

import { useRef, useState } from 'react';
import { Check, Share2 } from 'lucide-react';

/**
 * Native share sheet, or copy-the-link where there is none. Kept tiny on
 * purpose: it sits on chapter pages, which have little first-load JS headroom
 * (scripts/check-export.mjs). The URL is passed in, built at build time.
 */
export function ShareButton({
  title,
  text,
  url,
  className = '',
  children,
}: {
  title: string;
  text?: string;
  /** Absolute URL to share. */
  url: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onClick = async () => {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard unavailable: nothing more to offer.
    }
  };

  return (
    <button type="button" onClick={onClick} className={className}>
      {copied ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : <Share2 className="w-3.5 h-3.5" aria-hidden="true" />}
      <span>{copied ? 'Link copied' : children}</span>
      <span role="status" className="sr-only">{copied ? 'Link copied' : ''}</span>
    </button>
  );
}
