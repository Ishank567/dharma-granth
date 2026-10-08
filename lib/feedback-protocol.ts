/**
 * What an explanation-clarity submission may contain, shared by the reader
 * (which sends it) and the collector (which checks it). Nothing here can hold
 * free text, a name, an address or an identifier of the reader.
 */

export type Rating = 'yes' | 'partly' | 'no';

export const RATINGS: readonly Rating[] = ['yes', 'partly', 'no'];

/** Reason label (shown to the reader) -> fixed id (the only thing sent). */
export const REASON_IDS: Record<string, string> = {
  'Language was difficult': 'language',
  'Example was unclear': 'example',
  'Explanation was too long': 'long',
  'Context was missing': 'context',
  'Source was unclear': 'source',
  'Possible textual error': 'textual',
  Other: 'other',
};

export const REASON_LABELS: Record<string, string> = Object.fromEntries(Object.entries(REASON_IDS).map(([label, id]) => [id, label]));

export interface Submission {
  refKey: string;
  rating: Rating;
  reasons: string[];
}

/** "scripture:chapter:verse", for example bhagavadgita:2:47. */
export const REF_PATTERN = /^[a-z0-9-]{1,40}:\d{1,4}:[0-9A-Za-z.-]{1,12}$/;

/** Returns a clean submission, or null if the body is not exactly this shape. Unknown reasons are dropped; unknown fields are ignored. */
export function parseSubmission(body: unknown): Submission | null {
  if (!body || typeof body !== 'object') return null;
  const b = body as { refKey?: unknown; rating?: unknown; reasons?: unknown };
  if (typeof b.refKey !== 'string' || !REF_PATTERN.test(b.refKey)) return null;
  if (typeof b.rating !== 'string' || !(RATINGS as readonly string[]).includes(b.rating)) return null;
  const known = new Set(Object.values(REASON_IDS));
  const reasons = Array.isArray(b.reasons) ? Array.from(new Set(b.reasons.filter((r): r is string => typeof r === 'string' && known.has(r)))) : [];
  return { refKey: b.refKey, rating: b.rating as Rating, reasons: b.rating === 'yes' ? [] : reasons };
}

export interface VerseFeedback {
  refKey: string;
  yes: number;
  partly: number;
  no: number;
  reasons: Record<string, number>;
}

/** A verse is flagged for editors when it has enough answers and at least half were Partly or No. */
export const LOW_CLARITY_MIN_ANSWERS = 5;
export function isLowClarity(v: VerseFeedback): boolean {
  const total = v.yes + v.partly + v.no;
  return total >= LOW_CLARITY_MIN_ANSWERS && (v.partly + v.no) / total >= 0.5;
}
