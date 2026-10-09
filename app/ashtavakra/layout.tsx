import type { ReactNode } from 'react';
import Link from 'next/link';
import { AshShell, ModeControls, ASH_INIT_SCRIPT } from './AshShell';
import './ashtavakra.css';

export default function AshtavakraLayout({ children }: { children: ReactNode }) {
  return (
    <AshShell>
      {/* Applies a saved visual mode before first paint. */}
      <script dangerouslySetInnerHTML={{ __html: ASH_INIT_SCRIPT }} />
      <div className="mx-auto max-w-5xl px-4 pt-4 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/ashtavakra/" className="font-bold" style={{ minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>
            अष्टावक्र गीता
          </Link>
          <nav aria-label="अष्टावक्र गीता" className="flex flex-wrap gap-4">
            <Link href="/ashtavakra/#chapters" style={{ minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>20 प्रकरण</Link>
            <Link href="/ashtavakra/#concepts" style={{ minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>अवधारणाएँ</Link>
            <Link href="/ashtavakra/#source" style={{ minHeight: 44, display: 'inline-flex', alignItems: 'center' }}>स्रोत</Link>
          </nav>
        </div>
        <div className="mt-2">
          <ModeControls />
        </div>
      </div>
      {children}
    </AshShell>
  );
}
