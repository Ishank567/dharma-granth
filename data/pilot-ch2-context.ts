/**
 * Chapter 2 pilot: passage context and common-misunderstanding cards for
 * Bhagavad Gita 2.14, 2.20, 2.47 and 2.48.
 *
 * Context is a short, editorial summary of what the neighbouring verses say,
 * kept to what the verses themselves state. Every entry is a DRAFT until a named
 * reviewer and date are recorded; the page shows that status and never a
 * "reviewed" badge without one. This is editorial content, not scripture and
 * not traditional commentary.
 */

export type PilotReview = 'draft' | 'editorial-review' | 'approved';

export interface PilotVerseGuide {
  scriptureId: string;
  chapter: number;
  verse: number;
  speaker: string;
  listener: string;
  /** The question the passage is working on. */
  centralQuestion: string;
  before: string;
  thisVerse: string;
  after: string;
  /** The passage to read in full, as chapter verse numbers. */
  passage: { from: number; to: number };
  misunderstanding: { common: string; careful: string };
  review: PilotReview;
  reviewer?: string;
  reviewDate?: string;
}

const G = 'bhagavadgita';

export const PILOT_CH2: PilotVerseGuide[] = [
  {
    scriptureId: G,
    chapter: 2,
    verse: 14,
    speaker: 'Krishna',
    listener: 'Arjuna',
    centralQuestion: 'How should Arjuna stand toward pleasure and pain when they come and go?',
    before: 'Krishna has begun his teaching (2.11) by saying that the wise grieve neither for the living nor for the dead, and has said that the embodied self passes through childhood, youth and old age and then to another body (2.13).',
    thisVerse: 'The verse says that contacts of the senses with their objects bring cold and heat, pleasure and pain, that these come and go and do not last, and asks Arjuna to endure them.',
    after: 'The next verse (2.15) says that the person whom these do not disturb, who is steady in pleasure and pain, is fit for immortality.',
    passage: { from: 11, to: 15 },
    misunderstanding: {
      common: 'The verse says pleasure and pain are unreal or unimportant, so suffering does not need attention.',
      careful: 'The verse calls these experiences impermanent and asks for endurance (titikṣā). It does not say they are unreal or that help should not be sought, and it belongs to a passage about steadiness, not about indifference to others.',
    },
    review: 'draft',
  },
  {
    scriptureId: G,
    chapter: 2,
    verse: 20,
    speaker: 'Krishna',
    listener: 'Arjuna',
    centralQuestion: 'What is it that does not die when the body does?',
    before: 'Krishna has said that the real never ceases to be (2.16), that what pervades all this is indestructible (2.17), and that those who think the self kills or is killed do not understand (2.19).',
    thisVerse: 'The verse describes the self as never born and never dying, unborn, constant, everlasting and ancient, and not destroyed when the body is destroyed.',
    after: 'The next verses ask how one who knows it as indestructible could kill or cause to kill (2.21), and compare changing bodies to discarding worn clothes (2.22).',
    passage: { from: 16, to: 22 },
    misunderstanding: {
      common: 'Because the self cannot be killed, harming others is not a serious matter.',
      careful: 'The verse is a statement about the self within a longer answer to Arjuna’s grief. It is not given as a general permission to harm, and it should be read with the verses around it (2.19 to 2.22) and with the traditions that comment on them.',
    },
    review: 'draft',
  },
  {
    scriptureId: G,
    chapter: 2,
    verse: 47,
    speaker: 'Krishna',
    listener: 'Arjuna',
    centralQuestion: 'How can one act fully without being ruled by anxiety about results?',
    before: 'After introducing the teaching on the steady mind (buddhi) from 2.39, Krishna has criticised acting only for the fruits promised by ritual (2.42 to 2.44).',
    thisVerse: 'The verse says one’s claim is to action alone, never to its fruits; one should not make the fruit the motive of action, and should not be attached to inaction.',
    after: 'The next verse (2.48) says to act, established in yoga, giving up attachment and remaining the same in success and failure.',
    passage: { from: 39, to: 50 },
    misunderstanding: {
      common: 'Results do not matter, so planning is unnecessary.',
      careful: 'The verse does not reject goals, planning or evaluation. It cautions against allowing attachment to one outcome to dominate responsible action, and it also warns against inaction.',
    },
    review: 'draft',
  },
  {
    scriptureId: G,
    chapter: 2,
    verse: 48,
    speaker: 'Krishna',
    listener: 'Arjuna',
    centralQuestion: 'What is the inner stance from which action is done?',
    before: 'The preceding verse (2.47) says one’s claim is to action and not to its fruits, and warns against attachment to inaction.',
    thisVerse: 'The verse tells Arjuna to act established in yoga, giving up attachment and remaining the same in success and failure, and calls this evenness of mind (samatva) yoga.',
    after: 'Verse 2.49 says that action is far inferior to the yoga of the steady mind, and 2.50 says that yoga is skill in action.',
    passage: { from: 47, to: 50 },
    misunderstanding: {
      common: 'Equanimity means feeling nothing, or not caring, about whether things succeed.',
      careful: 'The verse joins evenness of mind to doing the work (“act”). It describes steadiness in success and failure while acting, not withdrawal from action or from concern for it.',
    },
    review: 'draft',
  },
];

export const getPilotGuide = (scriptureId: string, chapter: number, verse: number | string) =>
  PILOT_CH2.find((g) => g.scriptureId === scriptureId && g.chapter === chapter && String(g.verse) === String(verse));
