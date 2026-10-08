/**
 * A small private log of what the reader did, used only to write the weekly
 * summary on this device. It records the day, the kind of action and a verse
 * reference, journey id or concept id. It never holds notes, reflections or
 * search text. Nothing is recorded while reading history is paused or the
 * summary is switched off.
 */

export const ACTIVITY_KEY = 'dharma.activity.v1';
export const SUMMARY_OFF_KEY = 'dharma.summary.off';
const MAX_ENTRIES = 400;
const KEEP_DAYS = 120;

export type ActivityKind = 'verse' | 'saved' | 'journey' | 'lesson';

export interface ActivityEntry {
  /** Local calendar day, YYYY-MM-DD. */
  day: string;
  kind: ActivityKind;
  /** "scripture:chapter:verse" for verses, a journey id for journeys. */
  ref: string;
  /** Concept ids touched by a verse. */
  concepts?: string[];
}

type Store = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
const SAFE = /^[A-Za-z0-9:._-]{1,64}$/;

export const localDay = (d: Date = new Date()): string => {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

const addDays = (day: string, n: number): string => {
  const [y, m, d] = day.split('-').map(Number);
  return localDay(new Date(y, m - 1, d + n));
};

const isEntry = (e: unknown): e is ActivityEntry => {
  const x = e as Partial<ActivityEntry> | null;
  return (
    Boolean(x) &&
    typeof x!.day === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(x!.day) &&
    (x!.kind === 'verse' || x!.kind === 'saved' || x!.kind === 'journey' || x!.kind === 'lesson') &&
    typeof x!.ref === 'string' && SAFE.test(x!.ref) &&
    (x!.concepts === undefined || (Array.isArray(x!.concepts) && x!.concepts.every((c) => typeof c === 'string' && SAFE.test(c))))
  );
};

export function readActivity(store: Store = window.localStorage): ActivityEntry[] {
  try {
    const v: unknown = JSON.parse(store.getItem(ACTIVITY_KEY) ?? '[]');
    return Array.isArray(v) ? v.filter(isEntry) : [];
  } catch {
    return [];
  }
}

export function summaryEnabled(store: Store = window.localStorage): boolean {
  try {
    return store.getItem(SUMMARY_OFF_KEY) !== '1';
  } catch {
    return false;
  }
}

export function setSummaryEnabled(on: boolean, store: Store = window.localStorage): void {
  try {
    if (on) store.removeItem(SUMMARY_OFF_KEY);
    else store.setItem(SUMMARY_OFF_KEY, '1');
  } catch {
    // Storage blocked: nothing is recorded anyway.
  }
}

/**
 * Adds an entry. `paused` is passed by the caller (reading history paused).
 * The same verse on the same day is kept once. Returns whether it was stored.
 */
export function logActivity(entry: Omit<ActivityEntry, 'day'>, opts: { paused?: boolean; now?: Date; store?: Store } = {}): boolean {
  const store = opts.store ?? window.localStorage;
  if (opts.paused || !summaryEnabled(store)) return false;
  const day = localDay(opts.now ?? new Date());
  const clean: ActivityEntry = { day, kind: entry.kind, ref: entry.ref, ...(entry.concepts?.length ? { concepts: entry.concepts.filter((c) => SAFE.test(c)).slice(0, 8) } : {}) };
  if (!isEntry(clean)) return false;
  try {
    const cutoff = addDays(day, -KEEP_DAYS);
    const all = readActivity(store).filter((e) => e.day >= cutoff);
    if (all.some((e) => e.day === day && e.kind === clean.kind && e.ref === clean.ref)) return false;
    store.setItem(ACTIVITY_KEY, JSON.stringify([...all, clean].slice(-MAX_ENTRIES)));
    return true;
  } catch {
    return false;
  }
}

export function clearActivity(store: Store = window.localStorage): number {
  try {
    const n = readActivity(store).length;
    store.removeItem(ACTIVITY_KEY);
    return n;
  } catch {
    return 0;
  }
}

export interface WeeklySummary {
  from: string;
  to: string;
  teachingsExplored: number;
  versesSaved: number;
  journeysContinued: number;
  conceptsExplored: string[];
  activeDays: number;
}

/** The last seven local days including today. No scoring and no comparison with anyone. */
export function weeklySummary(entries: ActivityEntry[], now: Date = new Date()): WeeklySummary {
  const to = localDay(now);
  const from = addDays(to, -6);
  const week = entries.filter((e) => e.day >= from && e.day <= to);
  const distinct = (kind: ActivityKind) => new Set(week.filter((e) => e.kind === kind).map((e) => e.ref)).size;
  const counts = new Map<string, number>();
  for (const e of week) if (e.kind === 'verse') for (const c of e.concepts ?? []) counts.set(c, (counts.get(c) ?? 0) + 1);
  const concepts = Array.from(counts.entries()).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 3).map(([c]) => c);
  const journeys = new Set(week.filter((e) => e.kind === 'journey' || e.kind === 'lesson').map((e) => e.ref.split(':')[0]));
  return {
    from,
    to,
    teachingsExplored: distinct('verse'),
    versesSaved: distinct('saved'),
    journeysContinued: journeys.size,
    conceptsExplored: concepts,
    activeDays: new Set(week.map((e) => e.day)).size,
  };
}
