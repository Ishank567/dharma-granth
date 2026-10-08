'use client';

import { useState } from 'react';
import { LOW_CLARITY_MIN_ANSWERS, REASON_LABELS, isLowClarity, type VerseFeedback } from '@/lib/feedback-protocol';

const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
const TOKEN_KEY = 'dharma.editorial.token';

/**
 * Clarity feedback that readers chose to share, aggregated per verse. The
 * page asks for the editor token and keeps it only for this browser session.
 * Counts are approximate and say nothing about any individual reader.
 */
export function FeedbackPatterns() {
  const [token, setToken] = useState('');
  const [rows, setRows] = useState<VerseFeedback[] | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'unauthorized' | 'unconfigured' | 'error'>('idle');

  const load = async () => {
    setState('loading');
    try {
      const res = await fetch(`${BASE}/api/feedback`, { headers: { 'x-editorial-token': token } });
      if (res.status === 401) return setState('unauthorized');
      if (res.status === 404 || res.status === 503 || res.status === 405) return setState('unconfigured');
      if (!res.ok) return setState('error');
      const data = (await res.json()) as { verses: VerseFeedback[] };
      setRows(data.verses.sort((a, b) => Number(isLowClarity(b)) - Number(isLowClarity(a)) || b.partly + b.no - (a.partly + a.no)));
      try { sessionStorage.setItem(TOKEN_KEY, '1'); } catch { /* not remembered */ }
      setState('idle');
    } catch {
      setState('error');
    }
  };

  return (
    <section aria-labelledby="ed-fb" className="mt-8">
      <h2 id="ed-fb" className="font-serif text-xl font-bold text-dharma-text">Clarity feedback shared by readers</h2>
      <p className="mt-1 text-sm text-dharma-muted">
        Only readers who chose to share contribute, so these counts are a sample, not a measure of everyone. A verse is flagged when it has at least {LOW_CLARITY_MIN_ANSWERS} answers and half or more were Partly or No.
      </p>
      <form className="mt-3 flex flex-wrap items-end gap-2" onSubmit={(e) => { e.preventDefault(); void load(); }}>
        <label className="text-sm font-semibold text-dharma-muted">Editor token
          <input type="password" autoComplete="off" value={token} onChange={(e) => setToken(e.target.value)} className="mt-1 block min-h-[44px] w-64 rounded-xl border border-dharma-border bg-dharma-bg px-3 text-dharma-text" />
        </label>
        <button type="submit" disabled={!token || state === 'loading'} className="focus-ring min-h-[44px] rounded-xl bg-saffron-700 px-5 text-sm font-semibold text-white disabled:opacity-50">Load feedback</button>
      </form>
      <p role="status" aria-live="polite" className="mt-2 text-sm text-dharma-muted">
        {state === 'loading' && 'Loading…'}
        {state === 'unauthorized' && 'That token was not accepted.'}
        {state === 'unconfigured' && 'No feedback collector is configured on this deployment, so nothing can be shown. See docs/feedback-collection.md.'}
        {state === 'error' && 'Could not reach the collector. Try again.'}
        {rows && rows.length === 0 && state === 'idle' && 'No readers have shared feedback yet.'}
      </p>
      {rows && rows.length > 0 && (
        <div className="mt-2 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <caption className="sr-only">Shared clarity feedback by verse</caption>
            <thead><tr className="border-b border-dharma-border text-sm text-dharma-muted"><th scope="col" className="py-2 pr-3">Verse</th><th scope="col" className="py-2 pr-3">Yes</th><th scope="col" className="py-2 pr-3">Partly</th><th scope="col" className="py-2 pr-3">No</th><th scope="col" className="py-2">Reasons given</th></tr></thead>
            <tbody>
              {rows.map((v) => (
                <tr key={v.refKey} className="border-b border-dharma-border/60 align-top">
                  <td className="py-2 pr-3 font-medium text-dharma-text">{v.refKey.replace(/:/g, ' ')} {isLowClarity(v) && <strong className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-amber-950 dark:bg-amber-900/40 dark:text-amber-100">Needs a look</strong>}</td>
                  <td className="py-2 pr-3">{v.yes}</td><td className="py-2 pr-3">{v.partly}</td><td className="py-2 pr-3">{v.no}</td>
                  <td className="py-2 text-dharma-muted">{Object.entries(v.reasons).sort((a, b) => b[1] - a[1]).map(([id, n]) => `${REASON_LABELS[id] ?? id} (${n})`).join(', ') || '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
