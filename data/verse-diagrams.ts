/**
 * Visual verse demonstrations. Each is an editorial diagram that restates what
 * the cited verse says, in simpler terms. It is not scripture and it is not
 * a new philosophical claim: every step comes from the words of the cited
 * verses (checked by scripts/check-diagrams.ts against the library text) or,
 * for the control diagram, from the ordinary reading of 2.47 shown in the
 * explanation. Nothing is generated at run time. Every diagram carries a
 * review state and a full text alternative.
 *
 * Seven kinds are supported by the renderer. Only the kinds in use below have
 * data; add data for the others the same way.
 */
import type { ReviewStatus } from './study-content';

export type DiagramKind =
  | 'control-vs-uncertainty'
  | 'cause-and-consequence'
  | 'step-by-step'
  | 'comparison'
  | 'before-after'
  | 'concept-relationship'
  | 'narrative-sequence';

export interface DiagramGroup {
  heading: string;
  items: string[];
}

export interface VerseDiagramData {
  id: string;
  scriptureId: string;
  chapter: number;
  /** Verse pages on which the diagram is shown. */
  appearsOn: number[];
  kind: DiagramKind;
  title: string;
  summary: string;
  groups: DiagramGroup[];
  /** The whole diagram in plain sentences. */
  textAlternative: string;
  review: ReviewStatus;
  /** Verses the diagram restates, each with a fragment that must appear in the library text. */
  sourceVerses: Array<{ chapter: number; verse: number; expect: string }>;
}

export const VERSE_DIAGRAMS: VerseDiagramData[] = [
  {
    id: 'bg-2-47-control',
    scriptureId: 'bhagavadgita',
    chapter: 2,
    appearsOn: [47],
    kind: 'control-vs-uncertainty',
    title: 'What can I act on, and what can I not fully control?',
    summary: 'The verse places responsibility in the action. This diagram sorts an everyday situation into what a person can influence, what depends on other things, and a balanced way to respond.',
    groups: [
      { heading: 'Within my influence', items: ['My effort', 'My preparation', 'My choices', 'My response'] },
      { heading: 'Not fully in my control', items: ['Competition', 'Other people’s reactions', 'Unexpected circumstances', 'Final outcomes'] },
      { heading: 'A balanced approach', items: ['Plan carefully', 'Act sincerely', 'Learn from the result', 'Accept uncertainty'] },
    ],
    textAlternative:
      'First, what is within your influence: your effort, your preparation, your choices and your response. Second, what is not fully in your control: competition, other people’s reactions, unexpected circumstances and final outcomes. Third, a balanced approach: plan carefully, act sincerely, learn from the result and accept uncertainty. The verse does not reject goals, planning or evaluation.',
    review: 'draft',
    sourceVerses: [{ chapter: 2, verse: 47, expect: 'कर्मण्येवाधिकारस्ते' }],
  },
  {
    id: 'bg-2-62-63-chain',
    scriptureId: 'bhagavadgita',
    chapter: 2,
    appearsOn: [62, 63],
    kind: 'cause-and-consequence',
    title: 'How one state of mind leads to the next',
    summary: 'Verses 2.62 and 2.63 describe a sequence. Each step below is named in the verses, in the order they give.',
    groups: [
      {
        heading: 'The sequence in 2.62 and 2.63',
        items: [
          'Dwelling on sense objects',
          'Attachment',
          'Desire',
          'Anger',
          'Delusion',
          'Confusion of memory',
          'Loss of discernment',
          'Ruin',
        ],
      },
    ],
    textAlternative:
      'The verses describe a chain. Dwelling on sense objects gives rise to attachment. From attachment comes desire. From desire comes anger. From anger comes delusion. From delusion comes confusion of memory. From confusion of memory comes loss of discernment, and from loss of discernment a person is ruined.',
    review: 'draft',
    sourceVerses: [
      { chapter: 2, verse: 62, expect: 'ध्यायतो विषयान्' },
      { chapter: 2, verse: 63, expect: 'क्रोधाद्भवति संमोहः' },
    ],
  },
  {
    id: 'bg-6-16-17-moderation',
    scriptureId: 'bhagavadgita',
    chapter: 6,
    appearsOn: [16, 17],
    kind: 'comparison',
    title: 'Excess or neglect, and moderation',
    summary: 'Verses 6.16 and 6.17 contrast two ways of living. The first says yoga does not come to those who overdo or neglect; the second says yoga removes sorrow for those who are moderate.',
    groups: [
      { heading: 'Excess or neglect (6.16)', items: ['Eating too much, or not at all', 'Sleeping too much, or not at all'] },
      { heading: 'Moderation (6.17)', items: ['Moderate food and recreation', 'Moderate effort', 'Moderate sleep and waking'] },
    ],
    textAlternative:
      'Two ways of living are compared. In verse 6.16, eating too much or not at all, and sleeping too much or not at all, are named as ways in which yoga does not come. In verse 6.17, moderation in food and recreation, in effort, and in sleep and waking is said to make yoga a remover of sorrow.',
    review: 'draft',
    sourceVerses: [
      { chapter: 6, verse: 16, expect: 'नात्यश्नतस्तु' },
      { chapter: 6, verse: 17, expect: 'युक्ताहारविहारस्य' },
    ],
  },
];

export function getVerseDiagrams(scriptureId: string, chapter: number, verse: number | string): VerseDiagramData[] {
  const v = Number(verse);
  return VERSE_DIAGRAMS.filter((d) => d.scriptureId === scriptureId && d.chapter === chapter && d.appearsOn.includes(v));
}
