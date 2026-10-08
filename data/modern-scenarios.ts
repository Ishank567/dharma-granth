/**
 * Modern scenario comparisons: an editorial illustration of how a teaching
 * might be thought about in everyday settings. They are NOT scripture and NOT
 * commentary; every one is shown labelled as editorial content and as a draft
 * until a named reviewer is recorded.
 */
export type ScenarioSetting = 'student' | 'professional' | 'creative' | 'family';

export const SETTING_LABEL: Record<ScenarioSetting, string> = {
  student: 'Student life',
  professional: 'Professional life',
  creative: 'Creative work',
  family: 'Family responsibility',
};

export interface ModernScenarioSet {
  scriptureId: string;
  chapter: number;
  verse: number;
  /** The teaching being illustrated, in one plain sentence. */
  teaching: string;
  scenarios: Array<{ setting: ScenarioSetting; situation: string; reading: string }>;
  review: 'draft' | 'editorial-review' | 'approved';
  reviewer?: string;
  reviewDate?: string;
}

export const MODERN_SCENARIOS: ModernScenarioSet[] = [
  {
    scriptureId: 'bhagavadgita',
    chapter: 2,
    verse: 47,
    teaching: 'Your claim is on the action, not on its fruits: do the work fully without making the result the only measure.',
    review: 'draft',
    scenarios: [
      { setting: 'student', situation: 'Preparing for an exam whose result you cannot control.', reading: 'The study hours, honest practice and rest are the part that is yours; the mark is not wholly in your hands.' },
      { setting: 'professional', situation: 'Delivering a project that a client may still reject.', reading: 'Do the work carefully and well; judge the effort by its quality, and treat the client’s decision as information, not a verdict.' },
      { setting: 'creative', situation: 'Writing or making something that may get little attention.', reading: 'Attention goes to the craft of the piece in front of you, not to how it will be received.' },
      { setting: 'family', situation: 'Caring for a relative whose recovery is uncertain.', reading: 'The care you give each day is the action that is yours to do; the outcome is not the only measure of whether it was worth doing.' },
    ],
  },
];

export const getScenarios = (scriptureId: string, chapter: number, verse: number | string) =>
  MODERN_SCENARIOS.find((s) => s.scriptureId === scriptureId && s.chapter === chapter && String(s.verse) === String(verse));
