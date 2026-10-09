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
    id: 'bg-2-14-titiksha',
    scriptureId: 'bhagavadgita',
    chapter: 2,
    appearsOn: [14],
    kind: 'comparison',
    title: 'Sensory Opposites vs Inner Equanimity',
    summary: 'Verse 2.14 distinguishes between fluctuating sensory contacts and the enduring witness that observes them without reacting.',
    groups: [
      { heading: 'Passing sensory contact', items: ['Heat and cold', 'Pleasure and pain', 'Arrive and depart', 'Transient nature'] },
      { heading: 'The disciplined response', items: ['Patient endurance', 'Witness awareness', 'Inner stability', 'Freedom from reaction'] },
    ],
    textAlternative:
      'First, passing sensory contact brings heat and cold, pleasure and pain; they arrive and depart due to transient nature. Second, the disciplined response is patient endurance with witness awareness, maintaining inner stability and freedom from reaction without panic.',
    review: 'draft',
    sourceVerses: [{ chapter: 2, verse: 14, expect: 'मात्रास्पर्शास्तु' }],
  },
  {
    id: 'bg-2-20-atman',
    scriptureId: 'bhagavadgita',
    chapter: 2,
    appearsOn: [20],
    kind: 'before-after',
    title: 'The Changing Body vs The Unchanging Self',
    summary: 'Verse 2.20 contrasts the mortal, evolving body with the eternal, indestructible consciousness.',
    groups: [
      { heading: 'The physical body', items: ['Subject to birth', 'Undergoes change', 'Experiences decay', 'Perishes at death'] },
      { heading: 'The conscious Self', items: ['Unborn nature', 'Eternal continuity', 'Ancient presence', 'Not slain when body dies'] },
    ],
    textAlternative:
      'First, the physical body is subject to birth, undergoes change, experiences decay, and perishes at death. Second, the conscious Self has unborn nature with eternal continuity and ancient presence, and is not slain when body dies. Understanding this frees consciousness from existential fear.',
    review: 'draft',
    sourceVerses: [{ chapter: 2, verse: 20, expect: 'न जायते म्रियते' }],
  },
  {
    id: 'bg-2-22-garments',
    scriptureId: 'bhagavadgita',
    chapter: 2,
    appearsOn: [22],
    kind: 'comparison',
    title: 'The Metaphor of Changing Garments',
    summary: 'Verse 2.22 compares the embodiment of consciousness to shedding worn-out garments and putting on new ones.',
    groups: [
      { heading: 'Everyday changing of clothes', items: ['Discarding worn garments', 'Adopting new clothes', 'Person remains unchanged'] },
      { heading: 'Consciousness changing bodies', items: ['Shedding worn physical body', 'Entering new physical form', 'Conscious soul remains constant'] },
    ],
    textAlternative:
      'The metaphor compares everyday changing of clothes with the journey of consciousness. Just as a person is discarding worn garments and adopting new clothes while the person remains unchanged, so too the conscious soul remains constant while shedding worn physical body and entering new physical form without fear.',
    review: 'approved',
    sourceVerses: [{ chapter: 2, verse: 22, expect: 'वासांसि जीर्णानि' }],
  },
  {
    id: 'bg-2-55-56-sthitaprajna',
    scriptureId: 'bhagavadgita',
    chapter: 2,
    appearsOn: [55, 56],
    kind: 'comparison',
    title: 'Marks of Steady Wisdom (Sthitaprajña)',
    summary: 'Verses 2.55 and 2.56 outline the internal foundation and responsive equanimity of one anchored in steady wisdom.',
    groups: [
      { heading: 'Internal Foundation (2.55)', items: ['Abandoning mental desires', 'Content in Self alone', 'Anchor of steady wisdom'] },
      { heading: 'Responsive Equanimity (2.56)', items: ['Unshaken by sorrow', 'Free from craving pleasure', 'Released from passion fear and anger'] },
    ],
    textAlternative:
      'The verses describe the marks of steady wisdom through internal foundation and responsive equanimity. First, the internal foundation in verse 2.55 begins with abandoning mental desires and remaining content in Self alone, forming the true anchor of steady wisdom. Second, responsive equanimity in verse 2.56 shows a mind unshaken by sorrow, free from craving pleasure, and released from passion fear and anger in all conditions.',
    review: 'approved',
    sourceVerses: [
      { chapter: 2, verse: 55, expect: 'प्रजहाति यदा कामान्' },
      { chapter: 2, verse: 56, expect: 'दुःखेष्वनुद्विग्नमनाः' },
    ],
  },
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
    id: 'bg-2-48-samatvam',
    scriptureId: 'bhagavadgita',
    chapter: 2,
    appearsOn: [48],
    kind: 'step-by-step',
    title: 'The Path of Equanimity in Action',
    summary: 'Verse 2.48 outlines the four movements of Karma Yoga: acting with presence, abandoning attachment, greeting success and failure evenly, and attaining yoga.',
    groups: [
      { heading: 'Four movements of equanimity', items: ['Act with presence', 'Release selfish attachment', 'Equal in success and setback', 'Equanimity is yoga'] },
    ],
    textAlternative:
      'The four movements of equanimity: act with presence in all duties; release selfish attachment to outcomes; remain equal in success and setback; this steadfast equanimity is yoga.',
    review: 'draft',
    sourceVerses: [{ chapter: 2, verse: 48, expect: 'योगस्थः कुरु कर्माणि' }],
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
    id: 'bg-3-9-yajna',
    scriptureId: 'bhagavadgita',
    chapter: 3,
    appearsOn: [9],
    kind: 'comparison',
    title: 'Sacrifice vs Selfish Bondage in Action',
    summary: 'Verse 3.9 contrasts action done as an offering with work done for personal craving which binds human beings.',
    groups: [
      { heading: 'Action done as sacrifice', items: ['Offered to the divine', 'Freedom from attachment', 'Liberating action'] },
      { heading: 'Selfish action', items: ['Personal craving', 'Binding karma', 'Entanglement in outcome'] },
    ],
    textAlternative:
      'Verse 3.9 compares two modes of action. First, action done as sacrifice is offered to the divine with freedom from attachment, becoming liberating action. Second, selfish action driven by personal craving creates binding karma and entanglement in outcome.',
    review: 'approved',
    sourceVerses: [{ chapter: 3, verse: 9, expect: 'यज्ञार्थात्कर्मणो' }],
  },
  {
    id: 'bg-3-42-hierarchy',
    scriptureId: 'bhagavadgita',
    chapter: 3,
    appearsOn: [42],
    kind: 'step-by-step',
    title: 'The Ascending Hierarchy of Human Faculties',
    summary: 'Verse 3.42 outlines an ascending ladder of subtlety and mastery: physical senses, mind, intellect, and the transcendent Self.',
    groups: [
      { heading: 'Ascending order of subtlety', items: ['Physical senses', 'Directing mind', 'Discerning intellect', 'Supreme conscious Self'] },
    ],
    textAlternative:
      'Verse 3.42 presents an ascending order of subtlety from outer to inner faculties: first the physical senses, above them the directing mind, higher still the discerning intellect, and beyond all is the supreme conscious Self.',
    review: 'approved',
    sourceVerses: [{ chapter: 3, verse: 42, expect: 'इन्द्रियाणि पराण्याहुरिन्द्रियेभ्यः' }],
  },
  {
    id: 'isha-1-renunciation-enjoyment',
    scriptureId: 'ishavasya',
    chapter: 1,
    appearsOn: [1],
    kind: 'comparison',
    title: 'Enveloped in the Divine: Renunciation and Enjoyment',
    summary: 'Mantra 1 shows how seeing the sacred presence in all things transforms enjoyment from possessive grasping into detached celebration.',
    groups: [
      { heading: 'The sacred vision', items: ['Divine presence', 'Enjoy with renunciation', 'Shared abundance'] },
      { heading: 'The grasping ego', items: ['Possessive greed', 'Coveting wealth', 'Fear of shortage'] },
    ],
    textAlternative:
      'Mantra 1 contrasts two ways of relating to the universe. In the sacred vision, recognizing divine presence inspires one to enjoy with renunciation and live in shared abundance. In contrast, the grasping ego is trapped in possessive greed, coveting wealth and living in constant fear of shortage.',
    review: 'approved',
    sourceVerses: [{ chapter: 1, verse: 1, expect: 'ईशा वास्यमिदं' }],
  },
  {
    id: 'isha-6-7-oneness',
    scriptureId: 'ishavasya',
    chapter: 1,
    appearsOn: [6, 7],
    kind: 'cause-and-consequence',
    title: 'From the Vision of Oneness to Freedom from Grief',
    summary: 'Mantras 6 and 7 show that realizing the single Self in all living beings completely dissolves aversion, delusion, and sorrow.',
    groups: [
      { heading: 'The stages of realization', items: ['Seeing the Self in all', 'Dissolving hatred and aversion', 'Recognizing undivided oneness', 'Freedom from delusion and sorrow'] },
    ],
    textAlternative:
      'Mantras 6 and 7 trace the stages of realization. First, seeing the Self in all beings leads naturally to dissolving hatred and aversion. Next, recognizing undivided oneness culminates in total freedom from delusion and sorrow.',
    review: 'approved',
    sourceVerses: [
      { chapter: 1, verse: 6, expect: 'यस्तु सर्वाणि भूतान्यात्मन्येव' },
      { chapter: 1, verse: 7, expect: 'यस्मिन्सर्वाणि भूतान्यात्मैवाभूद्' },
    ],
  },
  {
    id: 'isha-2-action-freedom',
    scriptureId: 'ishavasya',
    chapter: 1,
    appearsOn: [2],
    kind: 'cause-and-consequence',
    title: 'Vigorous Duty and Freedom from Karmic Clinging',
    summary: 'Mantra 2 presents the harmony between continuous active participation in life and complete freedom from karmic stain.',
    groups: [
      { heading: 'The path of active dedication', items: ['Perform duty faithfully', 'Long life with purpose', 'No clinging residue', 'Freedom from entanglement'] },
    ],
    textAlternative:
      'Mantra 2 establishes that one should perform duty faithfully, desiring a long life with purpose for a hundred years. When actions are done with selfless dedication, there is no clinging residue of karma and one attains total freedom from entanglement.',
    review: 'approved',
    sourceVerses: [{ chapter: 1, verse: 2, expect: 'कुर्वन्नेवेह कर्माणि' }],
  },
];

export function getVerseDiagrams(scriptureId: string, chapter: number, verse: number | string): VerseDiagramData[] {
  const v = Number(verse);
  return VERSE_DIAGRAMS.filter((d) => d.scriptureId === scriptureId && d.chapter === chapter && d.appearsOn.includes(v));
}
