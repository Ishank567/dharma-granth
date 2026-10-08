'use client';

import { useEffect, useMemo, useState } from 'react';
import { cleanVerseField, verseLines } from '@/lib/verse-format';
import type { ReaderProvenance, ReaderVerseText } from '@/lib/reader-actions';
import { parseWordMeanings } from '@/lib/word-gloss';

type ViewId = 'sanskrit' | 'translit' | 'words' | 'hindi' | 'english' | 'simpleHi' | 'simpleEn';

interface View {
  id: ViewId;
  label: string;
  lang: string;
  devanagari: boolean;
  /** Short note on who produced this view. */
  source: string;
  lines: string[];
}

const KEY = 'dharma.compare.v1';
const splitLines = (s?: string) => cleanVerseField(s).split(/\n+/).map((l) => l.trim()).filter(Boolean);
const hasDev = (s: string) => /[ऀ-ॿ]/.test(s);

/**
 * Compare any two views of the verse. Two columns from md up, stacked on
 * phones. When both views have the same number of lines, hovering or focusing
 * a line marks its counterpart. Only views the verse actually has are offered.
 */
export function CompareViews({ verse, provenance: p }: { verse: ReaderVerseText; provenance: ReaderProvenance }) {
  const views = useMemo<View[]>(() => {
    const out: View[] = [];
    const sk = cleanVerseField(verse.sanskrit);
    if (sk) out.push({ id: 'sanskrit', label: 'Sanskrit', lang: 'sa', devanagari: true, source: `Original text${p.sourceHost ? `, ${p.sourceHost}` : ''}`, lines: verseLines(sk) });
    if (verse.transliteration) out.push({ id: 'translit', label: 'Transliteration', lang: 'sa-Latn', devanagari: false, source: 'Roman (IAST) reading aid', lines: splitLines(verse.transliteration) });
    const glosses = parseWordMeanings(verse.wordMeaning);
    if (glosses.length > 1) out.push({ id: 'words', label: 'Word by word', lang: 'en', devanagari: false, source: 'Word meanings, reading aid', lines: glosses.map((g) => `${g.pada} — ${g.meaning}`) });
    if (verse.hindi) out.push({ id: 'hindi', label: 'Literal Hindi', lang: 'hi', devanagari: true, source: p.hindiIsAi ? 'AI translation, not a scholarly edition' : 'Translation as recorded in the source edition', lines: splitLines(verse.hindi) });
    if (verse.translation) out.push({ id: 'english', label: 'Literal English', lang: 'en', devanagari: false, source: p.englishIsAi ? 'AI translation, not a scholarly edition' : 'Translation as recorded in the source edition', lines: splitLines(verse.translation) });
    if (verse.explanation) {
      const dev = hasDev(verse.explanation);
      out.push({ id: dev ? 'simpleHi' : 'simpleEn', label: dev ? 'Simple Hindi' : 'Simple English', lang: dev ? 'hi' : 'en', devanagari: dev, source: 'Editorial explanation, not scripture', lines: splitLines(verse.explanation) });
    }
    return out;
  }, [verse, p]);

  const [left, setLeft] = useState<ViewId | ''>('');
  const [right, setRight] = useState<ViewId | ''>('');
  const [hot, setHot] = useState<number | null>(null);

  useEffect(() => {
    let saved: { l?: string; r?: string } = {};
    try { saved = JSON.parse(localStorage.getItem(KEY) ?? '{}'); } catch { /* defaults */ }
    const ids = views.map((v) => v.id);
    const l = ids.includes(saved.l as ViewId) ? (saved.l as ViewId) : ids[0] ?? '';
    const r = ids.includes(saved.r as ViewId) && saved.r !== l ? (saved.r as ViewId) : ids.find((i) => i !== l) ?? '';
    setLeft(l);
    setRight(r);
  }, [views]);

  const choose = (side: 'l' | 'r', id: ViewId) => {
    const nl = side === 'l' ? id : left;
    const nr = side === 'r' ? id : right;
    setLeft(nl); setRight(nr);
    try { localStorage.setItem(KEY, JSON.stringify({ l: nl, r: nr })); } catch { /* choice holds for this visit */ }
  };

  if (views.length < 2) return null;
  const A = views.find((v) => v.id === left);
  const B = views.find((v) => v.id === right);
  const aligned = Boolean(A && B && A.lines.length === B.lines.length);

  const column = (v: View | undefined) =>
    v && (
      <div className="min-w-0 rounded-xl border border-dharma-border bg-dharma-card p-3">
        <h4 className="text-sm font-bold text-dharma-text">{v.label}</h4>
        <p className="mb-2 text-xs text-dharma-muted">{v.source}</p>
        <ol lang={v.lang} className={`space-y-1 ${v.devanagari ? 'font-devanagari text-lg leading-[2]' : 'font-serif text-base leading-relaxed'}`}>
          {v.lines.map((line, i) => (
            <li
              key={i}
              tabIndex={aligned ? 0 : undefined}
              onMouseEnter={() => aligned && setHot(i)}
              onMouseLeave={() => setHot(null)}
              onFocus={() => aligned && setHot(i)}
              onBlur={() => setHot(null)}
              className={`list-none rounded px-1.5 py-0.5 ${hot === i ? 'bg-amber-100 outline outline-1 outline-amber-700/40 dark:bg-amber-900/40' : ''}`}
            >
              {line}
            </li>
          ))}
        </ol>
      </div>
    );

  const select = (side: 'l' | 'r', value: ViewId | '', label: string) => (
    <label className="text-xs font-semibold text-dharma-muted">
      {label}
      <select
        value={value}
        onChange={(e) => choose(side, e.target.value as ViewId)}
        className="mt-1 block min-h-[44px] w-full rounded-xl border border-dharma-border bg-dharma-bg px-3 text-sm text-dharma-text"
      >
        {views.map((v) => (
          <option key={v.id} value={v.id} disabled={v.id === (side === 'l' ? right : left)}>{v.label}</option>
        ))}
      </select>
    </label>
  );

  return (
    <section id="compare-views" aria-labelledby="compare-h" className="rounded-2xl border border-dharma-border bg-dharma-card/60 p-4 sm:p-5">
      <h3 id="compare-h" className="font-serif text-lg font-bold text-dharma-text">
        Compare views <span lang="hi" className="font-devanagari text-sm font-normal text-dharma-muted">· दो रूपों की तुलना</span>
      </h3>
      <p className="mt-1 text-xs text-dharma-muted">Choose any two. {aligned ? 'Matching lines are marked when you point at or focus on one.' : 'These two have different line counts, so lines are not paired.'}</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {select('l', left, 'First view')}
        {select('r', right, 'Second view')}
      </div>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {column(A)}
        {column(B)}
      </div>
    </section>
  );
}
