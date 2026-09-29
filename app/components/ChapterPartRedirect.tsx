'use client';

import { useEffect } from 'react';

interface Part {
  part: number;
  first: string;
  last: string;
}

/** "12.45" → [12, 45]; compares verse numbers the way the parts are cut. */
function key(n: string): number[] {
  return n.split(/[.-]/).map((x) => Number.parseInt(x, 10) || 0);
}
function compare(a: string, b: string): number {
  const x = key(a);
  const y = key(b);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] ?? -1) - (y[i] ?? -1);
    if (d !== 0) return d;
  }
  return 0;
}

/**
 * Split chapters (lib/chapter-parts) put each verse on one part's page. Links
 * made before the split, "continue reading" and bookmarks point at
 * `/chapter/{n}#verse-{v}`; when that verse is on another part, go there.
 */
export function ChapterPartRedirect({
  basePath,
  currentPart,
  parts,
}: {
  /** Chapter URL without a part, e.g. /scripture/mahabharata/chapter/12 */
  basePath: string;
  currentPart: number;
  parts: Part[];
}) {
  useEffect(() => {
    const go = () => {
      const match = /^#verse-(.+)$/.exec(decodeURIComponent(window.location.hash));
      if (!match || document.getElementById(`verse-${match[1]}`)) return;
      const target = parts.find((p) => compare(match[1], p.first) >= 0 && compare(match[1], p.last) <= 0);
      if (!target || target.part === currentPart) return;
      const href = target.part === 1 ? basePath : `${basePath}/part/${target.part}`;
      window.location.replace(`${href}/${window.location.hash}`);
    };
    go();
    window.addEventListener('hashchange', go);
    return () => window.removeEventListener('hashchange', go);
  }, [basePath, currentPart, parts]);
  return null;
}
