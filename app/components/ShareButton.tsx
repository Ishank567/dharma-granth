'use client';

import { useState } from 'react';

export default function ShareButton({
  text,
  title,
}: {
  text: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareText = `${text}\n\n— ${title}\n\nधर्म ग्रंथ: ${window.location.href}`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text: shareText });
        return;
      } catch {
        // User cancelled or share failed, fall through to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: prompt user to copy manually
      window.prompt('श्लोक कॉपी करें:', shareText);
    }
  }

  return (
    <button
      onClick={handleShare}
      aria-label="श्लोक साझा करें"
      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm text-muted hover:bg-card-hover hover:text-accent transition-colors"
    >
      {copied ? '✓ कॉपी हुआ' : '🔗 साझा करें'}
    </button>
  );
}
