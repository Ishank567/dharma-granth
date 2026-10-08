/**
 * Chapter orientation: an editorial introduction shown before a chapter's
 * verses. It is NOT scripture. Every entry carries a review state; only
 * chapters listed here get the narrative panel, all others get the
 * factual panel (name, verse count, reading time) and nothing invented.
 */

export type ReviewState = 'draft' | 'editorial-review' | 'approved';

export interface OrientationStep {
  label: string;
  labelHi: string;
  text: string;
}

export interface ChapterOrientation {
  scriptureId: string;
  chapter: number;
  nameEn: string;
  nameHi: string;
  speakers: string;
  listeners: string;
  centralQuestion: string;
  concepts: string[];
  importantVerses: Array<{ verse: number; note: string }>;
  background: string;
  structure: string[];
  /** Before this chapter, the problem, the teaching, the turning point, what follows. */
  sequence: [OrientationStep, OrientationStep, OrientationStep, OrientationStep, OrientationStep];
  review: ReviewState;
}

const stepLabels = [
  { label: 'Before this chapter', labelHi: 'इस अध्याय से पहले' },
  { label: 'The central problem', labelHi: 'केंद्रीय समस्या' },
  { label: 'The main teaching', labelHi: 'मुख्य शिक्षा' },
  { label: 'Important turning point', labelHi: 'महत्त्वपूर्ण मोड़' },
  { label: 'What follows next', labelHi: 'आगे क्या' },
];

function seq(texts: [string, string, string, string, string]): ChapterOrientation['sequence'] {
  return texts.map((text, i) => ({ ...stepLabels[i], text })) as ChapterOrientation['sequence'];
}

export const chapterOrientations: ChapterOrientation[] = [
  {
    scriptureId: 'bhagavadgita',
    chapter: 1,
    nameEn: "Arjuna's Despair",
    nameHi: 'अर्जुनविषादयोग',
    speakers: 'Sanjaya narrates; Dhritarashtra, Duryodhana and Arjuna also speak.',
    listeners: 'Dhritarashtra hears Sanjaya. Krishna, Arjuna’s charioteer, hears Arjuna.',
    centralQuestion: 'Can Arjuna fight a war against his own teachers and relatives, and what would it cost him?',
    concepts: ['Dharma', 'Kula-dharma (family duty)', 'Moha (confusion)'],
    importantVerses: [{ verse: 1, note: 'Dhritarashtra asks what the armies gathered at Kurukshetra are doing.' }],
    background: 'None needed. A short sense of the Mahabharata’s conflict over a kingdom helps.',
    structure: ['The armies are described', 'Arjuna asks Krishna to place the chariot between them', 'Arjuna sees his kin and loses heart', 'He lays down his bow'],
    sequence: seq([
      'The Mahabharata’s dispute between two branches of one family has led to war at Kurukshetra.',
      'Looking across both armies, Arjuna sees teachers, elders and relatives. He doubts that victory could be worth the loss.',
      'There is no teaching yet. The chapter sets out the human problem that the rest of the Gita answers.',
      'Arjuna puts down his bow and sits in the chariot, overcome by grief.',
      'In chapter 2, Krishna begins to speak.',
    ]),
    review: 'draft',
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 2,
    nameEn: 'The Yoga of Knowledge (Sankhya Yoga)',
    nameHi: 'सांख्ययोग',
    speakers: 'Sanjaya introduces the chapter; Arjuna asks; Krishna teaches.',
    listeners: 'Arjuna listens as Krishna’s student. Dhritarashtra hears the whole account through Sanjaya.',
    centralQuestion: 'How should one act when duty and grief pull in opposite directions?',
    concepts: ['Atman (the self)', 'Dharma', 'Karma Yoga', 'Sthitaprajna (steady wisdom)'],
    importantVerses: [
      { verse: 7, note: 'Arjuna asks Krishna to guide him as a student.' },
      { verse: 13, note: 'The self passes through stages of life; a steady person is not shaken.' },
      { verse: 47, note: 'You have a right to action, not to its fruits.' },
      { verse: 48, note: 'Act with balance, steady in success and failure.' },
      { verse: 62, note: 'How attachment grows from dwelling on sense objects.' },
    ],
    background: 'Reading chapter 1 first is recommended.',
    structure: ['Arjuna’s request for guidance', 'The nature of the self', 'Duty and balanced action', 'The person of steady wisdom'],
    sequence: seq([
      'Arjuna has put down his bow in grief (chapter 1).',
      'He asks Krishna for guidance, because he cannot see what is right.',
      'Krishna teaches about the lasting self, about acting without being bound to results, and about steady wisdom.',
      'Arjuna accepts Krishna as his teacher, and the instruction begins.',
      'Chapter 3 continues with Arjuna’s question about knowledge and action.',
    ]),
    review: 'draft',
  },
];

export function getChapterOrientation(scriptureId: string, chapter: number): ChapterOrientation | undefined {
  return chapterOrientations.find((o) => o.scriptureId === scriptureId && o.chapter === chapter);
}
