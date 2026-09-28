export interface HiCommentaryEntry {
  explanation?: string;
  science?: string;
  lifeLesson?: string;
  /**
   * Drafted by AI (scripts/generate-verse-commentary.ts) and approved by a
   * reviewer; the site labels these. Absent for hand-written commentary.
   */
  ai?: true;
}

/**
 * Keys are `${chapterId}:${verseId}` within a single scripture.
 * Each fragment file (e.g. aitareya.ts) exports one of these,
 * and verse-explanations-hi.ts merges them into the global tables
 * by prefixing keys with the scripture id.
 */
export type HiCommentaryFragment = Record<string, HiCommentaryEntry>;
