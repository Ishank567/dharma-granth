/** Concepts a reader has saved, kept as a list of ids in this browser only. */

export const SAVED_CONCEPTS_KEY = 'dharma.savedConcepts.v1';
const ID = /^[a-z0-9-]{1,40}$/;

type Store = Pick<Storage, 'getItem' | 'setItem'>;

export function readSavedConcepts(store: Store = window.localStorage): string[] {
  try {
    const v: unknown = JSON.parse(store.getItem(SAVED_CONCEPTS_KEY) ?? '[]');
    return Array.isArray(v) ? Array.from(new Set(v.filter((x): x is string => typeof x === 'string' && ID.test(x)))) : [];
  } catch {
    return [];
  }
}

/** Saves or removes a concept. Returns the new list, or null when storage is blocked. */
export function toggleSavedConcept(id: string, store: Store = window.localStorage): string[] | null {
  if (!ID.test(id)) return readSavedConcepts(store);
  const list = readSavedConcepts(store);
  const next = list.includes(id) ? list.filter((x) => x !== id) : [...list, id];
  try {
    store.setItem(SAVED_CONCEPTS_KEY, JSON.stringify(next));
    return next;
  } catch {
    return null;
  }
}
