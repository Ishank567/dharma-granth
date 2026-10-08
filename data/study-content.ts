/**
 * Reviewed study content for Phase 2 features. Three registries, all keyed by
 * verse. Nothing is generated at runtime: where a verse has no entry, the
 * interface says so instead of inventing a meaning, a commentary or a link.
 */

export type ReviewStatus = 'draft' | 'editorial-review' | 'source-review' | 'approved';

export const REVIEW_LABEL: Record<ReviewStatus, string> = {
  draft: 'Draft, awaiting review',
  'editorial-review': 'In editorial review',
  'source-review': 'In source review',
  approved: 'Approved',
};

export const verseKey = (scriptureId: string, chapter: number | string, verse: number | string) =>
  `${scriptureId}:${chapter}:${verse}`;

/* ── Explain this line ─────────────────────────────────────────────── */

export interface LineExplanation {
  /** The line as it appears in the Sanskrit layer (used to match a selection). */
  line: string;
  simpleEn: string;
  simpleHi: string;
  terms: Array<{ word: string; iast: string; meaning: string }>;
  context: string;
  review: ReviewStatus;
}

export const LINE_EXPLANATIONS: Record<string, LineExplanation[]> = {
  'bhagavadgita:2:47': [
    {
      line: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन',
      simpleEn: 'Your right is to the action itself, never to its results.',
      simpleHi: 'तुम्हारा अधिकार केवल कर्म पर है, उसके फलों पर कभी नहीं।',
      terms: [
        { word: 'कर्मणि', iast: 'karmaṇi', meaning: 'in action (locative)' },
        { word: 'अधिकारः', iast: 'adhikāraḥ', meaning: 'right, entitlement' },
        { word: 'फलेषु', iast: 'phaleṣu', meaning: 'in the fruits, the results' },
      ],
      context: 'Krishna is telling Arjuna where his responsibility lies as he faces a duty with an uncertain outcome.',
      review: 'draft',
    },
    {
      line: 'मा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि',
      simpleEn: 'Do not let the fruit of action be your motive, and do not hold on to inaction either.',
      simpleHi: 'कर्म के फल को अपना हेतु मत बनाओ, और अकर्म में भी तुम्हारी आसक्ति न हो।',
      terms: [
        { word: 'कर्मफलहेतुः', iast: 'karmaphalahetuḥ', meaning: 'one whose motive is the fruit of action' },
        { word: 'सङ्गः', iast: 'saṅgaḥ', meaning: 'attachment' },
        { word: 'अकर्मणि', iast: 'akarmaṇi', meaning: 'in inaction' },
      ],
      context: 'The second half guards against two errors: acting only for results, and withdrawing from action.',
      review: 'draft',
    },
  ],
};

/* ── Cross-scripture connections ───────────────────────────────────── */

export type ConnectionKind = 'similar' | 'complementary' | 'different-emphasis' | 'narrative' | 'commentary';

export const CONNECTION_LABEL: Record<ConnectionKind, string> = {
  similar: 'Similar teaching',
  complementary: 'Complementary teaching',
  'different-emphasis': 'Different emphasis',
  narrative: 'Narrative example',
  commentary: 'Commentary connection',
};

export interface Connection {
  kind: ConnectionKind;
  scriptureTitle: string;
  reference: string;
  /** Route in this library, when the verse exists here. */
  href?: string;
  summary: string;
  /** Why the editors link these two passages. */
  reason: string;
  review: ReviewStatus;
}

export const CONNECTIONS: Record<string, Connection[]> = {
  'bhagavadgita:2:47': [
    {
      kind: 'complementary',
      scriptureTitle: 'Bhagavad Gita',
      reference: '2.48',
      href: '/scripture/bhagavadgita/chapter/2/verse/48',
      summary: 'Continues the thought: act steadily, give up attachment, stay balanced in success and failure.',
      reason: 'The next verse names the balance that 2.47 asks for.',
      review: 'draft',
    },
    {
      kind: 'complementary',
      scriptureTitle: 'Bhagavad Gita',
      reference: '3.19',
      href: '/scripture/bhagavadgita/chapter/3/verse/19',
      summary: 'Advises doing one’s duty without attachment.',
      reason: 'It returns to the same idea of unattached action in the chapter on Karma Yoga.',
      review: 'draft',
    },
    {
      kind: 'different-emphasis',
      scriptureTitle: 'Isha Upanishad',
      reference: '2',
      href: '/scripture/ishavasya/chapter/1/verse/2',
      summary: 'Speaks of continuing to act through life, and of action not binding the person.',
      reason: 'Both connect action with freedom, but this verse addresses how to live, not the motive behind one task. Whether the two teach the same thing is a matter for scholars, not asserted here.',
      review: 'draft',
    },
  ],
};

/* ── Commentary comparison ─────────────────────────────────────────── */

export interface CommentaryEntry {
  commentator: string;
  tradition: string;
  language: 'Sanskrit' | 'Hindi' | 'English';
  detail: 'brief' | 'full';
  text: string;
  sourceEdition: string;
  translator?: string;
  publication: string;
  review: ReviewStatus;
}

/**
 * Empty on purpose: no traditional commentary has been entered and reviewed
 * yet. Add entries here (with a full source edition) and the comparison
 * interface lights up for that verse.
 */
export const COMMENTARIES: Record<string, CommentaryEntry[]> = {};
