/**
 * Within-chapter verse id from a seeded `number` (e.g. ch2 + "2.10" → "10").
 * Used to match curated `verse.id` ↔ seeded JSON `number`.
 */
export function canonicalVerseId(
  chapterNumber: number,
  verseNumber: number | string,
): string {
  const s = String(verseNumber);
  if (!s.includes(".")) return s;
  const parts = s.split(".");
  if (parts.length >= 2 && Number(parts[0]) === chapterNumber) {
    return parts.slice(1).join(".");
  }
  return parts[parts.length - 1] ?? s;
}