/** One day's reflection. Older saves stored a single string under the same key. */

export interface ReflectionFields {
  note: string;
  learned: string;
  challenged: string;
  apply: string;
  action: string;
  tag: string;
}

export type ReflectionStored = string | Partial<ReflectionFields>;

export const REFLECTION_TAGS = [
  { id: 'dharma', hi: 'धर्म' },
  { id: 'karma', hi: 'कर्म' },
  { id: 'atman', hi: 'आत्मा' },
  { id: 'bhakti', hi: 'भक्ति' },
  { id: 'yoga', hi: 'योग' },
  { id: 'moksha', hi: 'मोक्ष' },
] as const;

const TAG_IDS = new Set<string>(REFLECTION_TAGS.map((tag) => tag.id));

export function readEntry(raw: ReflectionStored | undefined): ReflectionFields {
  if (typeof raw === 'string') {
    return { note: raw, learned: '', challenged: '', apply: '', action: '', tag: '' };
  }
  const tag = raw?.tag && TAG_IDS.has(raw.tag) ? raw.tag : '';
  return {
    note: raw?.note ?? '',
    learned: raw?.learned ?? '',
    challenged: raw?.challenged ?? '',
    apply: raw?.apply ?? '',
    action: raw?.action ?? '',
    tag,
  };
}

export function entryText(entry: ReflectionFields): string {
  return [entry.note, entry.learned, entry.challenged, entry.apply, entry.action, entry.tag]
    .map((part) => part.trim())
    .filter((part) => part.length > 0)
    .join('\n');
}
