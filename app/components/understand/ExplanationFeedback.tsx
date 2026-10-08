'use client';

import { useEffect, useState } from 'react';

type Rating = 'yes' | 'partly' | 'no';

const REASONS = [
  'Language was difficult',
  'Example was unclear',
  'Explanation was too long',
  'Context was missing',
  'Source was unclear',
  'Possible textual error',
  'Other',
] as const;

export interface FeedbackRecord {
  refKey: string;
  rating: Rating;
  reasons: string[];
  at: string;
}

export const FEEDBACK_KEY = 'dharma.feedback.v1';

function readAll(): Record<string, FeedbackRecord> {
  try {
    const raw = localStorage.getItem(FEEDBACK_KEY);
    return raw ? (JSON.parse(raw) as Record<string, FeedbackRecord>) : {};
  } catch {
    return {};
  }
}

/**
 * "Was this explanation clear?" A small, optional prompt under a simplified
 * explanation. It stores a rating and fixed reasons only (no free text, no
 * identity) in this browser. It is separate from "Report correction", which
 * is for suspected textual errors in the scripture itself.
 */
export function ExplanationFeedback({ refKey, reference }: { refKey: string; reference: string }) {
  const [rating, setRating] = useState<Rating | null>(null);
  const [reasons, setReasons] = useState<string[]>([]);
  const [sent, setSent] = useState(false);
  const [storageOk, setStorageOk] = useState(true);

  useEffect(() => {
    const prior = readAll()[refKey];
    setRating(prior?.rating ?? null);
    setReasons(prior?.reasons ?? []);
    setSent(Boolean(prior));
  }, [refKey]);

  function save(nextRating: Rating, nextReasons: string[]) {
    const record: FeedbackRecord = { refKey, rating: nextRating, reasons: nextReasons, at: new Date().toISOString() };
    try {
      localStorage.setItem(FEEDBACK_KEY, JSON.stringify({ ...readAll(), [refKey]: record }));
      setStorageOk(true);
    } catch {
      setStorageOk(false);
    }
    setSent(true);
  }

  function choose(r: Rating) {
    setRating(r);
    if (r === 'yes') {
      setReasons([]);
      save(r, []);
    } else {
      setSent(false);
    }
  }

  function toggleReason(reason: string) {
    setReasons((prev) => (prev.includes(reason) ? prev.filter((x) => x !== reason) : [...prev, reason]));
  }

  const options: Array<{ id: Rating; label: string }> = [
    { id: 'yes', label: 'Yes' },
    { id: 'partly', label: 'Partly' },
    { id: 'no', label: 'No' },
  ];

  return (
    <section aria-labelledby={`fb-${refKey}`} className="rounded-2xl border border-dharma-border/70 bg-dharma-card/50 p-4 text-sm">
      <h3 id={`fb-${refKey}`} className="font-semibold text-dharma-text">
        Was this explanation clear? <span lang="hi" className="font-devanagari font-normal text-dharma-muted">· क्या यह स्पष्ट था?</span>
      </h3>
      <div role="radiogroup" aria-labelledby={`fb-${refKey}`} className="mt-2 flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.id}
            type="button"
            role="radio"
            aria-checked={rating === o.id}
            onClick={() => choose(o.id)}
            className={`focus-ring min-h-[44px] min-w-[72px] rounded-xl border px-4 font-semibold transition ${
              rating === o.id ? 'border-saffron-700 bg-saffron-700 text-white' : 'border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-400'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      {(rating === 'partly' || rating === 'no') && !sent && (
        <fieldset className="mt-3">
          <legend className="text-xs font-semibold text-dharma-muted">What could be better? (optional)</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {REASONS.map((r) => (
              <label key={r} className="focus-within:ring-2 flex min-h-[44px] cursor-pointer items-center gap-2 rounded-xl border border-dharma-border bg-dharma-card px-3 text-xs">
                <input type="checkbox" checked={reasons.includes(r)} onChange={() => toggleReason(r)} className="h-4 w-4 accent-saffron-700" />
                {r}
              </label>
            ))}
          </div>
          <button type="button" onClick={() => save(rating, reasons)} className="focus-ring mt-3 min-h-[44px] rounded-xl bg-saffron-700 px-5 text-sm font-semibold text-white hover:bg-saffron-800">
            Send feedback
          </button>
          {reasons.includes('Possible textual error') && (
            <p className="mt-2 text-xs text-dharma-muted">
              To report a mistake in the verse or translation itself, use <strong>Report correction</strong> at the top of this page. Clarity feedback does not start a correction.
            </p>
          )}
        </fieldset>
      )}

      <p role="status" aria-live="polite" className="mt-2 min-h-[1.25rem] text-xs text-dharma-muted">
        {sent && storageOk && `Thank you. Your answer for ${reference} is saved on this device only; no account or personal details are used.`}
        {sent && !storageOk && 'Thank you. Your browser blocked storage, so this answer was not saved.'}
      </p>
    </section>
  );
}
