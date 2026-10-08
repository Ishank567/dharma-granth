/**
 * Editorial workflow for study content written by the team (not the scripture
 * text itself). Statuses come from each item's own `review` field, so this
 * file cannot drift from the data; the history below records significant
 * changes. Add a history line whenever an item's meaning or status changes.
 */
import { chapterOrientations } from './chapter-orientation';
import { CONNECTIONS, COMMENTARIES, LINE_EXPLANATIONS, type ReviewStatus } from './study-content';
import { READING_JOURNEYS } from './reading-journeys';

export type ContentStatus = 'draft' | 'editorial-review' | 'source-review' | 'approved' | 'published' | 'correction-pending' | 'archived';

export const STATUS_LABEL: Record<ContentStatus, string> = {
  draft: 'Draft',
  'editorial-review': 'Editorial review',
  'source-review': 'Source review',
  approved: 'Approved',
  published: 'Published',
  'correction-pending': 'Correction pending',
  archived: 'Archived',
};

/** Allowed moves, so the workflow cannot skip a review. */
export const NEXT_STATUS: Record<ContentStatus, ContentStatus[]> = {
  draft: ['editorial-review', 'archived'],
  'editorial-review': ['source-review', 'draft', 'archived'],
  'source-review': ['approved', 'editorial-review', 'archived'],
  approved: ['published', 'editorial-review', 'archived'],
  published: ['correction-pending', 'archived'],
  'correction-pending': ['editorial-review', 'published', 'archived'],
  archived: ['draft'],
};

export interface ContentItem {
  id: string;
  kind: 'chapter orientation' | 'line explanation' | 'connection' | 'journey' | 'commentary';
  title: string;
  status: ContentStatus;
  reviewedOn: string | null;
  history: Array<{ date: string; note: string }>;
}

const fromReview = (r: ReviewStatus): ContentStatus => (r === 'draft' ? 'draft' : r);

/** Significant changes, newest last. Keyed by item id. */
export const CONTENT_HISTORY: Record<string, Array<{ date: string; note: string }>> = {};

const history = (id: string, created: string) => CONTENT_HISTORY[id] ?? [{ date: created, note: 'First written as a draft.' }];

export function getContentItems(): ContentItem[] {
  const items: ContentItem[] = [];
  for (const o of chapterOrientations) {
    const id = `orientation:${o.scriptureId}:${o.chapter}`;
    items.push({ id, kind: 'chapter orientation', title: `${o.scriptureId} chapter ${o.chapter}: ${o.nameEn}`, status: fromReview(o.review), reviewedOn: null, history: history(id, '2026-10-08') });
  }
  for (const [key, lines] of Object.entries(LINE_EXPLANATIONS)) {
    lines.forEach((l, i) => {
      const id = `line:${key}:${i + 1}`;
      items.push({ id, kind: 'line explanation', title: `${key} line ${i + 1}`, status: fromReview(l.review), reviewedOn: null, history: history(id, '2026-10-08') });
    });
  }
  for (const [key, list] of Object.entries(CONNECTIONS)) {
    list.forEach((c) => {
      const id = `connection:${key}:${c.scriptureTitle}:${c.reference}`;
      items.push({ id, kind: 'connection', title: `${key} → ${c.scriptureTitle} ${c.reference}`, status: fromReview(c.review), reviewedOn: null, history: history(id, '2026-10-08') });
    });
  }
  for (const j of READING_JOURNEYS) {
    const id = `journey:${j.id}`;
    items.push({ id, kind: 'journey', title: j.title, status: fromReview(j.review), reviewedOn: j.reviewedOn, history: history(id, '2026-10-08') });
  }
  for (const [key, list] of Object.entries(COMMENTARIES)) {
    list.forEach((c) => {
      const id = `commentary:${key}:${c.commentator}`;
      items.push({ id, kind: 'commentary', title: `${c.commentator} on ${key}`, status: fromReview(c.review), reviewedOn: null, history: history(id, '2026-10-08') });
    });
  }
  return items;
}
