/**
 * Choices about suggestions, shared by every place that shows them: which
 * ones the reader hid, and whether suggestions are off altogether. Stored in
 * this browser only.
 */
export const RECS_KEY = 'dharma.recs.v1';

export interface RecPrefs {
  off: boolean;
  hidden: string[];
}

export function readRecPrefs(storage: Pick<Storage, 'getItem'> = window.localStorage): RecPrefs {
  try {
    const p = JSON.parse(storage.getItem(RECS_KEY) ?? '{}') as Partial<RecPrefs>;
    return { off: Boolean(p.off), hidden: Array.isArray(p.hidden) ? p.hidden.filter((x): x is string => typeof x === 'string') : [] };
  } catch {
    return { off: false, hidden: [] };
  }
}

/** Returns false when storage is blocked, so the caller can say the choice lasts only for this visit. */
export function writeRecPrefs(prefs: RecPrefs, storage: Pick<Storage, 'setItem'> = window.localStorage): boolean {
  try {
    storage.setItem(RECS_KEY, JSON.stringify(prefs));
    window.dispatchEvent(new Event('dharma:recs'));
    return true;
  } catch {
    return false;
  }
}
