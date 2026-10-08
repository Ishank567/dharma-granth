/**
 * Editorial learning aids that sit beside a verse: teaching flow, context
 * timeline, misunderstanding card, modern-example tabs, "verse in 30 seconds".
 *
 * Everything here is editorial. It is never scripture, and the components
 * label it that way. Every field is optional: a verse only shows the sections
 * it actually has, so nothing is forced into a template.
 */

export type ExampleContext = 'student' | 'career' | 'creator' | 'relationships' | 'family' | 'sport' | 'discipline';

export const EXAMPLE_CONTEXT_LABELS: Record<ExampleContext, { en: string; hi: string }> = {
  student: { en: 'Student', hi: 'विद्यार्थी' },
  career: { en: 'Career', hi: 'कार्यक्षेत्र' },
  creator: { en: 'Creator', hi: 'सृजन' },
  relationships: { en: 'Relationships', hi: 'संबंध' },
  family: { en: 'Family', hi: 'परिवार' },
  sport: { en: 'Sport', hi: 'खेल' },
  discipline: { en: 'Discipline', hi: 'अनुशासन' },
};

export interface ContextStep {
  text: string;
  textHi?: string;
  /** Marks the step that is this verse. */
  current?: boolean;
}

export interface UnderstandingExtras {
  /** Quick mode: the situation, the action, the question. (The one-liner comes from the pedagogical data.) */
  quick: {
    situation: string;
    situationHi?: string;
    action: string;
    actionHi?: string;
    question: string;
    questionHi?: string;
  };
  /** "Verse in 30 seconds". */
  thirtySeconds: { situation: string; teaching: string; clarification: string; tryThis: string };
  /** Ordered steps of the teaching, rendered as a flow with a plain-text twin. */
  teachingFlow?: Array<{ label: string; detail: string }>;
  beforeAfter?: { before: string; after: string };
  contextTimeline?: {
    steps: ContextStep[];
    passageHref?: string;
    /** For narrative or dialogue scriptures: who speaks, who listens, and what is being answered. */
    dialogue?: { speaker: string; listener: string; situation: string; question: string };
  };
  misunderstanding?: { claim: string; better: string };
  /** Only contexts that genuinely relate to the verse. */
  examples?: Array<{ context: ExampleContext; text: string }>;
}

const GITA_2_47: UnderstandingExtras = {
  quick: {
    situation: 'You are waiting on a result (an exam mark, a launch, a decision) and cannot stop thinking about it.',
    situationHi: 'आप किसी परिणाम (परीक्षा, लॉन्च, निर्णय) की प्रतीक्षा में हैं और उसके बारे में सोचना बंद नहीं कर पा रहे।',
    action: 'Pick the one piece of work that is yours today and do it fully, without checking the outcome while you work.',
    actionHi: 'आज का वह एक कार्य चुनें जो आपके हाथ में है, और परिणाम देखे बिना उसे पूरे मन से करें।',
    question: 'Which part of this is mine to do, and which part am I only worrying about?',
    questionHi: 'इसमें मेरे करने का भाग कौन-सा है, और किस भाग की मैं केवल चिंता कर रहा हूँ?',
  },
  thirtySeconds: {
    situation: 'You are worried about a result.',
    teaching: 'Your responsibility is the action, done with care.',
    clarification: 'The verse does not reject goals, planning or evaluation.',
    tryThis: 'Spend 15 focused minutes on the next useful action.',
  },
  teachingFlow: [
    { label: 'What can I influence?', detail: 'My effort, my choices, my preparation and how I respond.' },
    { label: 'What can I not fully control?', detail: 'Other people, competition, circumstances and the final outcome.' },
    { label: 'Where does attention go?', detail: 'To the action in front of me, done sincerely.' },
    { label: 'A balanced approach', detail: 'Plan seriously, act sincerely, and accept that some uncertainty remains.' },
  ],
  beforeAfter: {
    before: 'If I cannot control the final result, then my effort is worth nothing.',
    after: 'I can prepare seriously and act well, while recognising that not every part of the outcome is up to me.',
  },
  contextTimeline: {
    steps: [
      { text: 'Arjuna faces a serious moral conflict on the battlefield (Chapter 1).' },
      { text: 'He becomes uncertain about taking any action at all (2.1–2.10).' },
      { text: 'Krishna begins to explain the self, duty and wise action (from 2.11).' },
      { text: 'He introduces action done with a steady mind, buddhi-yoga (2.39).' },
      { text: 'This verse speaks about action and attachment to results.', current: true },
      { text: 'The teaching continues in the next verse on balance, samatvam (2.48).' },
    ],
    passageHref: '/scripture/bhagavadgita/chapter/2',
    dialogue: {
      speaker: 'Krishna',
      listener: 'Arjuna',
      situation: 'On the battlefield of Kurukshetra, before the war, Arjuna is troubled and unsure whether to act.',
      question: 'How can one act wholeheartedly without being bound by the fruits of the action?',
    },
  },
  misunderstanding: {
    claim: 'Results do not matter, so planning and goals are unnecessary.',
    better:
      'The verse does not reject planning, goals or honest evaluation. It warns against letting attachment to an outcome become the only reason for acting, and it does not recommend giving up action (the last line says so).',
  },
  examples: [
    {
      context: 'student',
      text: 'A student prepares well for an exam and then notices that revising has turned into refreshing the results page. Returning attention to the next chapter of revision is the verse in practice.',
    },
    {
      context: 'career',
      text: 'Someone preparing a presentation can control the research and the practice. They cannot control how the room reacts. Their preparation stays complete either way.',
    },
    {
      context: 'creator',
      text: 'A writer publishes an essay and can improve the next draft. They cannot decide how many people read it. Attention returns to the craft.',
    },
  ],
};

const GITA_2_48: UnderstandingExtras = {
  quick: {
    situation: 'A deadline went well, or badly, and your mood swung with it for the whole day.',
    situationHi: 'कोई कार्य अच्छा या बुरा हुआ, और उसके साथ आपका मन पूरे दिन ऊपर-नीचे होता रहा।',
    action: 'Do the next task with full attention, then notice how you feel about the result without acting on that feeling straight away.',
    actionHi: 'अगला कार्य पूरे ध्यान से करें, फिर परिणाम के प्रति अपनी भावना को देखें, उसी क्षण उस पर प्रतिक्रिया न करें।',
    question: 'When did a success or a setback last decide my mood more than it needed to?',
    questionHi: 'पिछली बार कब किसी सफलता या असफलता ने मेरे मन को आवश्यकता से अधिक प्रभावित किया?',
  },
  thirtySeconds: {
    situation: 'Your calm rises and falls with every result.',
    teaching: 'Act steadily, and let balance of mind (samatvam) be the practice.',
    clarification: 'Balance is not coldness. You can care about the work and still stay steady.',
    tryThis: 'Before reacting to news about your work today, take three slow breaths.',
  },
  teachingFlow: [
    { label: 'Act', detail: 'Do the work that is yours to do.' },
    { label: 'Loosen the grip', detail: 'Let go of clinging to how it will turn out.' },
    { label: 'Meet either result evenly', detail: 'Success or setback, keep the mind steady.' },
    { label: 'Equanimity', detail: 'The verse names this evenness of mind as yoga.' },
  ],
  beforeAfter: {
    before: 'To stay motivated I have to feel anxious about every outcome.',
    after: 'I can stay committed to the work while keeping my balance whether it goes well or not.',
  },
  contextTimeline: {
    steps: [
      { text: 'Krishna begins to explain the self, duty and wise action (from 2.11).' },
      { text: 'He introduces action done with a steady mind, buddhi-yoga (2.39).' },
      { text: 'The previous verse says the right is to the action, not its fruits (2.47).' },
      { text: 'This verse names evenness of mind in success and failure as yoga.', current: true },
      { text: 'The next verse ranks action done with a steady mind above action driven by results (2.49).' },
    ],
    passageHref: '/scripture/bhagavadgita/chapter/2',
    dialogue: {
      speaker: 'Krishna',
      listener: 'Arjuna',
      situation: 'Krishna is continuing his teaching on acting with a steady mind, on the battlefield of Kurukshetra.',
      question: 'What does it mean to act without being pulled between success and failure?',
    },
  },
  misunderstanding: {
    claim: 'Staying even-minded means not caring about the result.',
    better:
      'The verse asks for steadiness, not indifference. You can care deeply about the work and still keep your balance when the result arrives, in either direction.',
  },
  examples: [
    {
      context: 'student',
      text: 'After a poor test result, a student studies the mistakes and prepares for the next one, rather than deciding that one mark describes their ability.',
    },
    {
      context: 'sport',
      text: 'A player who loses a match reviews it calmly. A player who wins keeps training. Neither result changes the routine.',
    },
    {
      context: 'career',
      text: 'After praise or criticism of a project, a professional listens to the useful part and returns to the work with the same attention.',
    },
  ],
};

const REGISTRY: Record<string, UnderstandingExtras> = {
  'bhagavadgita:2:47': GITA_2_47,
  'bhagavadgita:2:48': GITA_2_48,
};

export function getUnderstandingExtras(
  scriptureId: string,
  chapterId: number,
  verseId: string | number,
): UnderstandingExtras | undefined {
  return REGISTRY[`${scriptureId}:${chapterId}:${verseId}`];
}
