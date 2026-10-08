/**
 * Recorded human reviews and open corrections. Both lists are empty on
 * purpose: no review has been recorded yet, so no page may claim one. To
 * record a review, add an entry with the reviewer's name and the date; the
 * matching badge then appears on every verse the scope covers.
 *
 *   { scope: { scriptureId: 'bhagavadgita', chapter: 2, verse: 47 },
 *     kind: 'editorial', reviewer: 'Name', date: '2026-10-08' }
 */
import type { PendingCorrection, ReviewRecord } from '@/lib/review-badges';

export const REVIEW_RECORDS: ReviewRecord[] = [];

export const PENDING_CORRECTIONS: PendingCorrection[] = [];
