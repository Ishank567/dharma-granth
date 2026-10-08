/**
 * Review badges driven by recorded reviews only. A badge such as "Source
 * text verified" exists in the vocabulary but is shown only when a review
 * record names a reviewer and a date for that scope. With no records (the
 * current state) a page honestly shows "Editorial explanation" and "Draft".
 */

export type BadgeId =
  | 'source-verified'
  | 'translation-reviewed'
  | 'commentary-reviewed'
  | 'editorial-explanation'
  | 'draft'
  | 'correction-pending';

export const BADGE_LABEL: Record<BadgeId, string> = {
  'source-verified': 'Source text verified',
  'translation-reviewed': 'Translation reviewed',
  'commentary-reviewed': 'Commentary reviewed',
  'editorial-explanation': 'Editorial explanation',
  draft: 'Draft',
  'correction-pending': 'Correction pending',
};

export type ReviewKind = 'source' | 'translation' | 'commentary' | 'editorial';

export interface ReviewScope {
  scriptureId: string;
  chapter?: number;
  verse?: number | string;
}

export interface ReviewRecord {
  scope: ReviewScope;
  kind: ReviewKind;
  reviewer: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
}

export interface PendingCorrection {
  scope: ReviewScope;
  /** Link to the open correction report. */
  href?: string;
}

const ISO = /^\d{4}-\d{2}-\d{2}$/;

/** A record counts only with a named reviewer and a valid date. */
export const isValidRecord = (r: ReviewRecord): boolean =>
  Boolean(r?.scope?.scriptureId) && Boolean(r.reviewer?.trim()) && ISO.test(r.date ?? '') && ['source', 'translation', 'commentary', 'editorial'].includes(r.kind);

/** A scope without a chapter covers the whole scripture; without a verse, the whole chapter. */
export function covers(scope: ReviewScope, scriptureId: string, chapter: number, verse: number | string): boolean {
  if (scope.scriptureId !== scriptureId) return false;
  if (scope.chapter === undefined) return true;
  if (scope.chapter !== chapter) return false;
  return scope.verse === undefined || String(scope.verse) === String(verse);
}

export interface BadgeInput {
  scriptureId: string;
  chapter: number;
  verse: number | string;
  /** The page shows an editorial explanation. */
  hasEditorial: boolean;
  records: ReviewRecord[];
  corrections?: PendingCorrection[];
}

export interface Badge {
  id: BadgeId;
  label: string;
  /** Who reviewed and when, for reviewed badges. */
  detail?: string;
}

/** The latest valid review of a kind that covers the verse, if any. */
export function latestReview(records: ReviewRecord[], kind: ReviewKind, scriptureId: string, chapter: number, verse: number | string): ReviewRecord | undefined {
  return records
    .filter((r) => isValidRecord(r) && r.kind === kind && covers(r.scope, scriptureId, chapter, verse))
    .sort((a, b) => (a.date < b.date ? 1 : -1))[0];
}

export function badgesFor(input: BadgeInput): Badge[] {
  const { scriptureId, chapter, verse, records } = input;
  const out: Badge[] = [];
  const reviewed = (kind: ReviewKind, id: BadgeId) => {
    const r = latestReview(records, kind, scriptureId, chapter, verse);
    if (r) out.push({ id, label: BADGE_LABEL[id], detail: `${r.reviewer}, ${r.date}` });
    return Boolean(r);
  };
  reviewed('source', 'source-verified');
  reviewed('translation', 'translation-reviewed');
  reviewed('commentary', 'commentary-reviewed');
  if (input.hasEditorial) {
    out.push({ id: 'editorial-explanation', label: BADGE_LABEL['editorial-explanation'] });
    if (!latestReview(records, 'editorial', scriptureId, chapter, verse)) out.push({ id: 'draft', label: BADGE_LABEL.draft, detail: 'The simplified explanation has not been reviewed by an editor.' });
  }
  if ((input.corrections ?? []).some((c) => covers(c.scope, scriptureId, chapter, verse))) {
    out.push({ id: 'correction-pending', label: BADGE_LABEL['correction-pending'] });
  }
  return out;
}
