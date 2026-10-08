/**
 * Start My Journey: answers and the curated paths they map to.
 * Recommendations come only from this list of existing routes. Nothing is
 * inferred about beliefs or identity; answers describe what the reader
 * wants to do, nothing more.
 */

export type Interest = 'gita' | 'upanishads' | 'bhakti' | 'daily' | 'sanskrit' | 'life' | 'unsure';
export type Familiarity = 'new' | 'some' | 'regular' | 'serious';
export type LanguagePref = 'hindi' | 'english' | 'both' | 'sanskrit';
export type TimePref = '5' | '10' | '20' | 'deep';
export type FormatPref = 'reading' | 'audio' | 'visual' | 'mixed';

export interface JourneyAnswers {
  interest: Interest;
  familiarity: Familiarity;
  language: LanguagePref;
  time: TimePref;
  format: FormatPref;
}

export interface JourneyPath {
  id: string;
  title: string;
  titleHi: string;
  summary: string;
  minutes: string;
  href: string;
  steps: Array<{ label: string; href: string }>;
  /** Honest note about anything the path does not yet include. */
  note?: string;
}

export const JOURNEY_KEY = 'dharma.journey.v1';

export const PATHS: Record<string, JourneyPath> = {
  gitaBeginners: {
    id: 'gita-beginners',
    title: 'Bhagavad Gita for Beginners',
    titleHi: 'गीता: आरंभिक पाठ',
    summary: 'A guided course through the Gita’s main ideas, with one verse explained step by step.',
    minutes: '10 min a day',
    href: '/learn/bhagavad-gita',
    steps: [
      { label: 'Chapter 1 introduction', href: '/scripture/bhagavadgita/chapter/1' },
      { label: 'Chapter 2 introduction', href: '/scripture/bhagavadgita/chapter/2' },
      { label: 'Read Gita 2.47 in Simple mode', href: '/scripture/bhagavadgita/chapter/2/verse/47' },
    ],
  },
  dailyWisdom: {
    id: 'daily-wisdom',
    title: 'Five-Minute Daily Wisdom',
    titleHi: 'पाँच मिनट का दैनिक चिंतन',
    summary: 'One verse, one reflection, one quiet moment each day.',
    minutes: '5 min a day',
    href: '/practice',
    steps: [
      { label: 'Daily verse and reflection', href: '/practice' },
      { label: 'Wisdom for life situations', href: '/wisdom-for-life' },
    ],
  },
  upanishads: {
    id: 'upanishads',
    title: 'Understanding the Upanishads',
    titleHi: 'उपनिषद् परिचय',
    summary: 'The central ideas of the Upanishads, one lesson at a time.',
    minutes: '15–20 min a session',
    href: '/learn/upanishads',
    steps: [
      { label: 'Upanishads course', href: '/learn/upanishads' },
      { label: 'Concepts: Atman and Brahman', href: '/concepts' },
    ],
  },
  bhakti: {
    id: 'bhakti',
    title: 'Introduction to Bhakti',
    titleHi: 'भक्ति परिचय',
    summary: 'The devotional traditions and what they teach.',
    minutes: '10–15 min a session',
    href: '/learn/bhakti-traditions',
    steps: [
      { label: 'Bhakti traditions course', href: '/learn/bhakti-traditions' },
      { label: 'Wisdom: Devotion', href: '/wisdom-for-life/devotion' },
    ],
  },
  sanskrit: {
    id: 'sanskrit',
    title: 'Sanskrit Through Verses',
    titleHi: 'श्लोकों से संस्कृत',
    summary: 'Learn key Sanskrit words from verses, using word meanings and the dictionary.',
    minutes: '10 min a session',
    href: '/dictionary',
    steps: [
      { label: 'Dictionary of key terms', href: '/dictionary' },
      { label: 'Word meanings in Gita 2.47', href: '/scripture/bhagavadgita/chapter/2/verse/47' },
    ],
    note: 'A full Sanskrit course is not available yet. This path uses the dictionary and word studies.',
  },
  students: {
    id: 'students',
    title: 'Wisdom for Students',
    titleHi: 'विद्यार्थियों के लिए',
    summary: 'Verses and reflections on focus and steady effort.',
    minutes: '10 min a session',
    href: '/wisdom-for-life/concentration',
    steps: [
      { label: 'Concentration', href: '/wisdom-for-life/concentration' },
      { label: 'Discipline', href: '/wisdom-for-life/discipline' },
    ],
  },
  sadhana: {
    id: 'sadhana',
    title: 'Daily Sadhana',
    titleHi: 'दैनिक साधना',
    summary: 'A private place for reflection, japa, meditation and your own routine.',
    minutes: 'Your own pace',
    href: '/practice',
    steps: [{ label: 'Open Sadhana', href: '/practice' }],
  },
  lifeSituations: {
    id: 'life',
    title: 'Wisdom for Life',
    titleHi: 'जीवन के लिए शास्त्रीय मार्गदर्शन',
    summary: 'Choose a situation (worry, anger, duty, grief) and read curated verses.',
    minutes: '5–10 min a topic',
    href: '/wisdom-for-life',
    steps: [{ label: 'Browse situations', href: '/wisdom-for-life' }],
  },
  beginnerScriptures: {
    id: 'beginner',
    title: 'Hindu Scriptures for Beginners',
    titleHi: 'शास्त्रों का आरंभिक परिचय',
    summary: 'A gentle map of the scriptures and how they relate.',
    minutes: '10 min a session',
    href: '/learn/beginner',
    steps: [{ label: 'Beginner course', href: '/learn/beginner' }],
  },
};

/** Up to three paths: one for the main interest, then one that fits time or experience. */
export function recommend(a: JourneyAnswers): JourneyPath[] {
  const out: JourneyPath[] = [];
  const add = (p: JourneyPath) => { if (!out.includes(p)) out.push(p); };

  switch (a.interest) {
    case 'gita': add(PATHS.gitaBeginners); break;
    case 'upanishads': add(PATHS.upanishads); break;
    case 'bhakti': add(PATHS.bhakti); break;
    case 'daily': add(PATHS.dailyWisdom); break;
    case 'sanskrit': add(PATHS.sanskrit); break;
    case 'life': add(PATHS.lifeSituations); break;
    default: add(PATHS.beginnerScriptures);
  }
  if (a.time === '5') add(PATHS.dailyWisdom);
  if (a.familiarity === 'new' && a.interest !== 'unsure') add(PATHS.beginnerScriptures);
  if (a.familiarity === 'serious' && a.interest !== 'upanishads') add(PATHS.upanishads);
  if (a.interest === 'life') add(PATHS.students);
  add(PATHS.sadhana);
  return out.slice(0, 3);
}
