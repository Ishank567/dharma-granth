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
  /** Concepts worth knowing before reading, by name. */
  prerequisiteConcepts: string[];
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
    prerequisiteConcepts: ['Dharma'],
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
    prerequisiteConcepts: ['Atman', 'Dharma'],
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
  {
    scriptureId: 'bhagavadgita',
    chapter: 3,
    nameEn: "The Yoga of Action (Karma Yoga)",
    nameHi: "कर्मयोग",
    speakers: "Arjuna asks; Krishna answers. Sanjaya narrates to Dhritarashtra.",
    listeners: "Arjuna listens as Krishna’s student. Dhritarashtra hears the account through Sanjaya.",
    centralQuestion: "If knowledge is higher than action, why should Arjuna act at all, and how can action be done without binding the one who acts?",
    concepts: ["Karma Yoga","Yajna (action as offering)","Dharma"],
    importantVerses: [{"verse":9,"note":"Action done as an offering, beyond one’s own gain."},{"verse":19,"note":"Do what must be done without attachment."},{"verse":30,"note":"Offering one’s actions with the mind turned inward."},{"verse":35,"note":"One’s own duty, even imperfect, over another’s well done."}],
    background: "Reading chapter 2 first is recommended, especially 2.47.",
    prerequisiteConcepts: ["Karma","Dharma"],
    structure: ["Arjuna’s question","Why everyone acts","Action as offering","Desire and anger as obstacles"],
    sequence: seq(["Chapter 2 spoke about the self and about acting with balance.","Arjuna says the teaching seems to put knowledge above action, and asks why he should fight.","Krishna says no one can stop acting, and that action done as an offering and without attachment does not bind.","Arjuna asks what drives a person to wrongdoing as if by force, and Krishna names desire and anger.","Chapter 4 continues with knowledge and its lineage."]),
    review: 'draft',
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 4,
    nameEn: "The Yoga of Knowledge and Action",
    nameHi: "ज्ञानकर्मसंन्यासयोग",
    speakers: "Krishna speaks; Arjuna asks a question. Sanjaya narrates.",
    listeners: "Arjuna listens as Krishna’s student. Dhritarashtra hears the account through Sanjaya.",
    centralQuestion: "What is the source of this teaching, and how do knowledge and action belong together?",
    concepts: ["Jnana (knowledge)","Karma","Avatara (manifestation)"],
    importantVerses: [{"verse":7,"note":"Whenever dharma declines, he manifests."},{"verse":18,"note":"Seeing action in inaction and inaction in action."},{"verse":34,"note":"Learning through humility, questions and service."},{"verse":38,"note":"Nothing here purifies like knowledge."}],
    background: "Chapters 2 and 3 help, especially the idea of acting without attachment.",
    prerequisiteConcepts: ["Karma","Jnana"],
    structure: ["The lineage of the teaching","Manifestation","Action and inaction","Knowledge as a means"],
    sequence: seq(["Chapter 3 described action as an offering.","Arjuna asks how Krishna could have taught this yoga long ago, which leads Krishna to speak of his own manifestations.","Krishna describes action seen with knowledge, and many forms of offering.","The chapter praises knowledge and how it is gained, by humble learning.","Chapter 5 returns to renunciation and the yoga of action."]),
    review: 'draft',
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 6,
    nameEn: "The Yoga of Meditation",
    nameHi: "ध्यानयोग",
    speakers: "Krishna speaks; Arjuna asks. Sanjaya narrates.",
    listeners: "Arjuna listens as Krishna’s student. Dhritarashtra hears the account through Sanjaya.",
    centralQuestion: "How can a restless mind be steadied, and what becomes of someone who tries and falls short?",
    concepts: ["Dhyana (meditation)","Abhyasa (practice)","Vairagya (non-attachment)"],
    importantVerses: [{"verse":5,"note":"One’s own mind as friend or enemy."},{"verse":17,"note":"Moderation in daily habits."},{"verse":26,"note":"Bringing a wandering mind back."},{"verse":35,"note":"Practice and non-attachment."}],
    background: "Chapter 2 on steady wisdom helps.",
    prerequisiteConcepts: ["Yoga","Vairagya"],
    structure: ["The one who acts without clinging","How to practise","The restless mind","The one who falls short"],
    sequence: seq(["Chapter 5 spoke about renunciation and acting without attachment.","Krishna describes how to sit and practise, and Arjuna says the mind seems as hard to hold as the wind.","Krishna agrees it is difficult and names practice and non-attachment as supports.","Arjuna asks about the person who begins but does not complete the path.","Chapter 7 begins to speak of knowledge together with its realisation."]),
    review: 'draft',
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 12,
    nameEn: "The Yoga of Devotion",
    nameHi: "भक्तियोग",
    speakers: "Arjuna asks; Krishna answers. Sanjaya narrates.",
    listeners: "Arjuna listens as Krishna’s student. Dhritarashtra hears the account through Sanjaya.",
    centralQuestion: "Which is better: devotion to the Lord with form, or meditation on the unmanifest?",
    concepts: ["Bhakti","Sakara and nirakara (with form and without)","Qualities of a devotee"],
    importantVerses: [{"verse":8,"note":"Fix the mind and understanding on him."},{"verse":13,"note":"The qualities of a person without hatred, friendly and compassionate."}],
    background: "Chapter 11, the vision of the whole, gives the setting.",
    prerequisiteConcepts: ["Bhakti"],
    structure: ["Arjuna’s question","Paths and their difficulty","Steps toward devotion","The devotee’s qualities"],
    sequence: seq(["Chapter 11 showed the vision of the whole, and Arjuna was afraid.","Arjuna asks whether devotion or meditation on the unmanifest is better.","Krishna says the path of devotion is the more accessible, and offers a series of steps.","He then describes the qualities of those who are dear to him.","Chapter 13 turns to the field and the knower of the field."]),
    review: 'draft',
  },
  {
    scriptureId: 'bhagavadgita',
    chapter: 18,
    nameEn: "The Yoga of Liberation through Renunciation",
    nameHi: "मोक्षसंन्यासयोग",
    speakers: "Arjuna asks; Krishna answers; Sanjaya closes the account.",
    listeners: "Arjuna listens. Dhritarashtra hears the whole Gita through Sanjaya.",
    centralQuestion: "What is renunciation, and what is the heart of the whole teaching?",
    concepts: ["Sannyasa and tyaga (renunciation)","Svadharma","Surrender"],
    importantVerses: [{"verse":48,"note":"One’s natural work and its imperfection."},{"verse":55,"note":"Knowing through devotion."},{"verse":66,"note":"Taking refuge, and not grieving."},{"verse":73,"note":"Arjuna says his confusion has gone."}],
    background: "Best read after the earlier chapters; it gathers their themes.",
    prerequisiteConcepts: ["Moksha","Karma","Bhakti"],
    structure: ["Renunciation and relinquishment","Action, knowledge and the qualities","Svadharma","The closing instruction","Arjuna’s reply and Sanjaya’s close"],
    sequence: seq(["Chapter 17 described faith and the forms of austerity.","Arjuna asks about renunciation and relinquishment, and Krishna gathers the teaching of the earlier chapters.","He speaks about action by nature, about knowledge, and about devotion.","Krishna gives his closing instruction, which readers and commentators interpret in several ways.","Arjuna says his confusion is gone and that he will act, and Sanjaya ends the account."]),
    review: 'draft',
  },
];

export function getChapterOrientation(scriptureId: string, chapter: number): ChapterOrientation | undefined {
  return chapterOrientations.find((o) => o.scriptureId === scriptureId && o.chapter === chapter);
}
