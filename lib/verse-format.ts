/**
 * Verse text formatting shared by the interactive VerseCard (client) and the
 * static VerseText (also rendered by Server Components, e.g. verse pages).
 * Kept out of VerseCard.tsx: functions exported from a 'use client' module
 * cannot be called on the server.
 */

const DEVANAGARI_DIGITS = '०१२३४५६७८९';

export function toDevanagari(value: number | string): string {
  return String(value).replace(/[0-9]/g, (d) => DEVANAGARI_DIGITS[Number(d)]);
}

/**
 * Split a verse into its pādas for line-by-line setting. Source text is
 * either newline-separated or uses | / । as half-verse markers. Any trailing
 * "॥ 28 ॥"-style terminator is dropped; the card draws its own.
 */
export function verseLines(sanskrit: string): string[] {
  const cleaned = sanskrit.replace(/[\s|।॥0-9०-९.]+$/, '').trim();
  const byNewline = cleaned.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  if (byNewline.length > 1) return byNewline;

  const lines: string[] = [];
  let current = '';
  for (const ch of cleaned) {
    current += ch;
    if (ch === '|' || ch === '।') {
      lines.push(current.trim());
      current = '';
    }
  }
  if (current.trim()) lines.push(current.trim());
  return lines.length ? lines : [cleaned];
}
