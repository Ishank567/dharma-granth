/**
 * Theme-based reading journeys. Each lesson points to one verse in the
 * library; the verse text itself is read from the library at build time, never
 * copied here. Everything written in this file (context, explanation,
 * reflection, activity) is editorial, not scripture, and every journey carries
 * a review state. `expect` is a fragment of the Sanskrit that must appear in
 * the library's verse (checked by scripts/check-journeys.ts) so a numbering
 * change cannot silently point a lesson at the wrong verse.
 */

import type { ReviewStatus } from './study-content';

export interface JourneyLesson {
  id: string;
  scriptureId: string;
  chapter: number;
  verse: number;
  expect: string;
  context: string;
  explanation: string;
  reflection: string;
  activity?: string;
}

export interface ReadingJourney {
  id: string;
  title: string;
  titleHi: string;
  objective: string;
  audience: string;
  minutesPerLesson: number;
  curator: string;
  /** ISO date of the last editorial review, or null if never reviewed. */
  reviewedOn: string | null;
  review: ReviewStatus;
  lessons: JourneyLesson[];
  related: Array<{ label: string; href: string }>;
  sources: string[];
}

const GITA = 'bhagavadgita';
const CURATOR = 'Dharma Granth editorial team (draft)';
const SOURCES = ['Sanskrit text: as given in the Dharma Granth library edition (see each verse page, “Sources and edition”).', 'Context, explanation, reflection and activity: editorial notes, not scripture.'];

export const READING_JOURNEYS: ReadingJourney[] = [
  {
    id: 'seven-days-of-focus',
    title: 'Seven Days of Focus',
    titleHi: 'एकाग्रता के सात दिन',
    objective: 'Read seven verses from the Gita on a steady, gathered mind, one a day.',
    audience: 'Anyone who finds their attention scattered and wants a calm place to start.',
    minutesPerLesson: 7,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    lessons: [
      {
        id: 'f1', scriptureId: GITA, chapter: 2, verse: 41, expect: 'व्यवसायात्मिका',
        context: 'Krishna has begun teaching Arjuna about acting with understanding. Here he contrasts a resolved mind with a scattered one.',
        explanation: 'A mind with one clear resolve is steady. A mind pulled in many directions has many branching aims and little rest.',
        reflection: 'What is one aim you could name today so that the rest of your attention has somewhere to settle?',
        activity: 'Write one sentence naming the single thing you most want to finish today.',
      },
      {
        id: 'f2', scriptureId: GITA, chapter: 2, verse: 47, expect: 'कर्मण्येवाधिकारस्ते',
        context: 'Krishna tells Arjuna where his responsibility lies when the outcome of a task is uncertain.',
        explanation: 'The verse points the mind at the action in front of you, and away from worry about results you cannot fully control.',
        reflection: 'Where does your attention go while you work: to the task, or to how it will turn out?',
        activity: 'Give 15 minutes to the next useful step of one task, without checking how it is going.',
      },
      {
        id: 'f3', scriptureId: GITA, chapter: 2, verse: 48, expect: 'योगस्थः',
        context: 'The next verse continues the same teaching and names the balance it asks for.',
        explanation: 'Acting from steadiness, and not from clinging, lets success and failure be received with equal calm.',
        reflection: 'How does your work feel when you are not gripping the outcome?',
      },
      {
        id: 'f4', scriptureId: GITA, chapter: 6, verse: 5, expect: 'उद्धरेदात्मनाऽऽत्मानं',
        context: 'In the chapter on meditation, Krishna speaks about the mind as both helper and obstacle.',
        explanation: 'One’s own mind can lift a person up or pull them down, so the work of steadiness begins with how one relates to it.',
        reflection: 'In what ways has your own mind been a friend to you this week?',
      },
      {
        id: 'f5', scriptureId: GITA, chapter: 6, verse: 26, expect: 'यतो यतो निश्चरति',
        context: 'Arjuna has said the mind is restless. Here Krishna offers a practical instruction.',
        explanation: 'Whenever the mind wanders, bring it back gently. The practice is returning, not never wandering.',
        reflection: 'What usually pulls your attention away, and what could help you return?',
        activity: 'Sit for three minutes. Each time you notice you have drifted, return to your breath.',
      },
      {
        id: 'f6', scriptureId: GITA, chapter: 6, verse: 35, expect: 'अभ्यासेन तु कौन्तेय',
        context: 'Krishna agrees the mind is hard to hold, then names two supports.',
        explanation: 'Steady practice and a loosening of grasping make it possible to steady the mind over time.',
        reflection: 'Which small practice could you repeat daily, even for a few minutes?',
      },
      {
        id: 'f7', scriptureId: GITA, chapter: 2, verse: 70, expect: 'आपूर्यमाणमचलप्रतिष्ठं',
        context: 'Near the end of the chapter, Krishna describes the person of steady wisdom with an image of the sea.',
        explanation: 'Waters flow into a full, unmoving ocean without disturbing it. A steady mind receives its experiences in the same way.',
        reflection: 'What would it feel like to let today’s demands arrive without being carried off by them?',
      },
    ],
    related: [
      { label: 'Wisdom for Life: Concentration', href: '/wisdom-for-life/concentration' },
      { label: 'Wisdom for Life: Discipline', href: '/wisdom-for-life/discipline' },
    ],
    sources: SOURCES,
  },
  {
    id: 'understanding-karma-yoga',
    title: 'Understanding Karma Yoga',
    titleHi: 'कर्मयोग को समझें',
    objective: 'Follow the Gita’s teaching on acting without being bound by results, across six verses.',
    audience: 'New readers of the Gita, and students of work, duty and effort.',
    minutesPerLesson: 8,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    lessons: [
      {
        id: 'k1', scriptureId: GITA, chapter: 2, verse: 47, expect: 'कर्मण्येवाधिकारस्ते',
        context: 'The teaching begins as Krishna answers Arjuna’s grief with a view of action.',
        explanation: 'Your responsibility is the action itself. The verse does not reject goals or planning; it warns against being ruled by one outcome.',
        reflection: 'Which of your efforts today could you do well whatever the result?',
      },
      {
        id: 'k2', scriptureId: GITA, chapter: 2, verse: 48, expect: 'योगस्थः',
        context: 'Krishna defines the balance in a single line.',
        explanation: 'Evenness toward success and failure is called yoga here.',
        reflection: 'When did you last act well and stay level about how it went?',
      },
      {
        id: 'k3', scriptureId: GITA, chapter: 3, verse: 9, expect: 'यज्ञार्थात्कर्मणो',
        context: 'In chapter 3 Arjuna asks about action and knowledge, and Krishna widens the meaning of action.',
        explanation: 'Action done as an offering, beyond one’s own gain, does not bind. Action done only for oneself does.',
        reflection: 'Who beyond you benefits from your work?',
      },
      {
        id: 'k4', scriptureId: GITA, chapter: 3, verse: 19, expect: 'तस्मादसक्तः सततं',
        context: 'Krishna draws the conclusion of this part of the teaching.',
        explanation: 'Do what has to be done without attachment, and the person reaches the highest through action itself.',
        reflection: 'What would change if you did one task today without needing credit for it?',
      },
      {
        id: 'k5', scriptureId: GITA, chapter: 4, verse: 18, expect: 'कर्मण्यकर्म',
        context: 'In chapter 4 Krishna speaks about seeing action more deeply.',
        explanation: 'The verse says the wise see inaction within action and action within inaction. Readers and commentators interpret this in several ways; read the commentary alongside it.',
        reflection: 'Where might stillness exist inside your busiest moments?',
      },
      {
        id: 'k6', scriptureId: GITA, chapter: 5, verse: 10, expect: 'ब्रह्मण्याधाय',
        context: 'In chapter 5 Krishna returns to action offered with release from attachment.',
        explanation: 'One who acts, offering the action and giving up attachment, is not stained by it, as a lotus leaf is untouched by water.',
        reflection: 'What would it mean to stay unmarked by what you do?',
      },
    ],
    related: [
      { label: 'Concept: Karma', href: '/concepts/karma' },
      { label: 'Wisdom for Life: Duty and decision-making', href: '/wisdom-for-life/duty-and-decision-making' },
    ],
    sources: SOURCES,
  },
  {
    id: 'understanding-the-self',
    title: 'Understanding the Self',
    titleHi: 'आत्मा को समझें',
    objective: 'Read four verses from the Gita’s second chapter on the Self (Atman).',
    audience: 'Readers curious about what the Gita says about the self and change.',
    minutesPerLesson: 8,
    curator: CURATOR,
    reviewedOn: null,
    review: 'draft',
    lessons: [
      {
        id: 's1', scriptureId: GITA, chapter: 2, verse: 13, expect: 'देहिनोऽस्मिन्',
        context: 'Krishna begins to answer Arjuna’s sorrow by speaking about who we are.',
        explanation: 'As a person passes through childhood, youth and age in this body, so the embodied self passes to another. The steady person is not shaken by it.',
        reflection: 'What in you has stayed the same while everything else changed?',
      },
      {
        id: 's2', scriptureId: GITA, chapter: 2, verse: 20, expect: 'न जायते म्रियते',
        context: 'The teaching on the Self deepens.',
        explanation: 'The Self is described as never born and never dying, not ended when the body is.',
        reflection: 'How does this view change what you hold on to?',
      },
      {
        id: 's3', scriptureId: GITA, chapter: 2, verse: 22, expect: 'वासांसि जीर्णानि',
        context: 'Krishna uses an image to make the teaching concrete.',
        explanation: 'As a person puts on new clothes and sets aside worn ones, so the embodied self takes up new bodies.',
        reflection: 'What image helps you think about change without fear?',
      },
      {
        id: 's4', scriptureId: GITA, chapter: 2, verse: 23, expect: 'नैनं छिन्दन्ति',
        context: 'The images continue.',
        explanation: 'Weapons do not cut the Self, fire does not burn it, water does not wet it. The verse speaks of what cannot be harmed.',
        reflection: 'What feels unharmed in you even on hard days?',
      },
    ],
    related: [
      { label: 'Concept: Atman', href: '/concepts/atman' },
      { label: 'Wisdom for Life: Self-knowledge', href: '/wisdom-for-life/self-knowledge' },
    ],
    sources: SOURCES,
  },
];

export const getJourney = (id: string) => READING_JOURNEYS.find((j) => j.id === id);
