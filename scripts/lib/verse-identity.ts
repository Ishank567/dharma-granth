/**
 * Helpers for telling whether two verse slots hold the same text, regardless
 * of formatting (danda style, line breaks, embedded ।।2.47।। markers, speaker
 * lines such as "अर्जुन उवाच").
 */

/**
 * Canonical Bhagavad Gita verse counts per chapter (701 verses: the gita/gita
 * numbering counts Arjuna's question "prakṛtiṃ puruṣaṃ caiva…" as 13.1).
 */
export const GITA_CANONICAL_VERSE_COUNTS = [
  47, 72, 43, 42, 29, 47, 30, 28, 34, 42, 55, 20, 35, 27, 20, 24, 28, 78,
] as const;

/** Letters and combining marks only; digits, dandas, punctuation and speaker lines removed. */
export function normalizeVerseText(text: string): string {
  return text
    .normalize("NFC")
    .replace(/\S*\s*उवाच/g, "") // "श्रीभगवानुवाच", "अर्जुन उवाच" …
    .replace(/[^\p{L}\p{M}]/gu, "")
    .replace(/[०-९]/g, ""); // Devanagari digits are \p{Nd}, but be explicit
}

export function sanskritShingles(text: string, size = 6): Set<string> {
  const n = normalizeVerseText(text);
  const out = new Set<string>();
  for (let i = 0; i + size <= n.length; i++) out.add(n.slice(i, i + size));
  return out;
}

/** Share of the smaller verse's shingles found in the other (0–1). */
export function shingleOverlap(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  const [small, large] = a.size <= b.size ? [a, b] : [b, a];
  let hit = 0;
  small.forEach((g) => {
    if (large.has(g)) hit++;
  });
  return hit / small.size;
}
