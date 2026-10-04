'use client';

import { useEffect, useState } from 'react';

export type ReaderFontSize = 'normal' | 'large' | 'xl';

const KEY = 'dharma_reader_fontsize';
const EVENT = 'dharma:reader-fontsize';

function readSize(): ReaderFontSize {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'large' || saved === 'xl' || saved === 'normal') return saved;
  } catch {
    // Private mode: keep the default size.
  }
  return 'normal';
}

/** A / A+ / A++, the same sizes the chapter reader stores. */
export function ReaderFontSize() {
  const [size, setSize] = useState<ReaderFontSize>('normal');

  useEffect(() => {
    const apply = (next: ReaderFontSize) => {
      setSize(next);
      document.querySelector('[data-verse-read]')?.setAttribute('data-reader-size', next);
    };
    apply(readSize());
    const onChange = (event: Event) => {
      const next = (event as CustomEvent<ReaderFontSize>).detail;
      if (next === 'normal' || next === 'large' || next === 'xl') setSize(next);
    };
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);

  function choose(next: ReaderFontSize) {
    setSize(next);
    try {
      localStorage.setItem(KEY, next);
    } catch {
      // The size still applies for this page.
    }
    document.querySelector('[data-verse-read]')?.setAttribute('data-reader-size', next);
    window.dispatchEvent(new CustomEvent(EVENT, { detail: next }));
  }

  const options: Array<{ id: ReaderFontSize; label: string; title: string }> = [
    { id: 'normal', label: 'A', title: 'सामान्य अक्षर' },
    { id: 'large', label: 'A+', title: 'बड़े अक्षर' },
    { id: 'xl', label: 'A++', title: 'विशाल अक्षर' },
  ];

  return (
    <div
      className="inline-flex shrink-0 items-center rounded-xl border border-dharma-border bg-dharma-bg p-0.5 text-xs font-semibold text-dharma-text"
      role="group"
      aria-label="अक्षर का आकार"
    >
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => choose(option.id)}
          aria-pressed={size === option.id}
          title={option.title}
          className={`rounded-lg px-2.5 py-1 transition ${
            size === option.id
              ? 'bg-dharma-card font-bold text-saffron-700 shadow-sm'
              : 'text-dharma-muted hover:text-dharma-text'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
