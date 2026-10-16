import { cleanVerseField, verseLines } from '@/lib/verse-format';
import { getPedagogicalVerse } from '@/data/pedagogical-registry';
import type { PedagogicalVerseData, PedagogicalModernScenario } from '@/data/pedagogical-gita-2-47';
import { getUnderstandingExtras, type UnderstandingExtras } from '@/data/understanding';

export interface LayeredVerseExample {
  category: 'student' | 'entrepreneur' | 'employee' | 'parent' | 'creator';
  label: string;
  labelHi: string;
  icon: string;
  scenario: string;
  scenarioHi?: string;
}

export interface LayeredVersePerspectives {
  student: string;
  professional: string;
  family: string;
  leadership: string;
  spiritual: string;
}

export interface LayeredVerseData {
  // 1. Original Sanskrit
  sanskrit: string[];
  sanskritRaw: string;

  // 2. Transliteration (IAST)
  transliteration: string;

  // 3. Literal Word-by-Word
  wordMeaning?: string;

  // 4. Hindi Translation
  hindi: string;

  // 5. English Translation
  translation: string;

  // 6. Simplified Meaning (14yo accessible)
  simpleMeaning: {
    en: string;
    hi: string;
  };

  // 7. Gen-Z Interpretation (Modern everyday language)
  genZInterpretation: {
    en: string;
    hi: string;
    tagline: string;
  };

  // 8. Why This Matters Today
  whyItMattersToday: Array<{
    title: string;
    text: string;
  }>;

  // 9. Real Life Examples (Student, Entrepreneur, Employee, Parent, Creator)
  realWorldExamples: LayeredVerseExample[];

  // 10. Practical Application & 5 Perspectives
  perspectives: LayeredVersePerspectives;

  // 11. Actionable Daily Exercise
  dailyExercise: {
    actionStep: string;
    actionStepHi?: string;
    reflectionQuestion: string;
    reflectionQuestionHi?: string;
    duration: string;
  };

  // 12. Key Takeaway Summary
  keyTakeaway: {
    en: string;
    hi: string;
  };

  // Source Transparency & Pedagogy Flag
  isCuratedPedagogical: boolean;
}

interface RawVerseInput {
  number: number | string;
  sanskrit?: string;
  transliteration?: string;
  wordMeaning?: string;
  hindi?: string;
  translation?: string;
  explanation?: string;
  commentary?: string;
  reflection?: string;
  research?: string;
}

/**
 * Reads the layers that were actually written for a verse.
 * A missing simple meaning, example, or practice stays empty. Nothing here
 * invents a restatement from a keyword in the translation.
 */
export function buildLayeredVerseData(
  scriptureId: string,
  chapterId: number | string,
  verseId: number | string,
  rawVerse: RawVerseInput,
  pedagogicalInput?: PedagogicalVerseData | null,
  extrasInput?: UnderstandingExtras | null,
): LayeredVerseData {
  const pedagogical = pedagogicalInput ?? getPedagogicalVerse(scriptureId, chapterId, verseId);
  const extras = extrasInput ?? getUnderstandingExtras(scriptureId, Number(chapterId), String(verseId));

  const sanskritRaw = cleanVerseField(rawVerse.sanskrit);
  const sanskrit = sanskritRaw ? verseLines(sanskritRaw) : [];
  const transliteration = cleanVerseField(rawVerse.transliteration);
  const hindi = cleanVerseField(rawVerse.hindi);
  const translation = cleanVerseField(rawVerse.translation);
  // Written readings only. Keyword guesses and a shared five-scene template are not a verse.
  const simpleEn = pedagogical?.simpleMeaningEn || '';
  const simpleHi = pedagogical?.simpleMeaningHi || '';

  const whyItMattersToday: Array<{ title: string; text: string }> =
    pedagogical?.whyItMattersToday?.map((w: PedagogicalModernScenario) => ({
      title: w.title,
      text: w.text,
    })) ?? [];

  const realWorldExamples: LayeredVerseExample[] = [];

  const perspectives: LayeredVersePerspectives = {
    student: '',
    professional: '',
    family: '',
    leadership: '',
    spiritual: '',
  };

  const actionStep = pedagogical?.tryThisToday.instructionEn || extras?.quick.action || '';
  const actionStepHi = pedagogical?.tryThisToday.instructionHi || extras?.quick.actionHi || '';
  const reflectionQuestion = pedagogical?.reflectionQuestion.en || extras?.quick.question || '';
  const reflectionQuestionHi = pedagogical?.reflectionQuestion.hi || extras?.quick.questionHi || '';
  const duration = pedagogical?.tryThisToday.duration || '';

  const keyTakeaway = {
    en: pedagogical?.inOneLineEn || '',
    hi: pedagogical?.inOneLineHi || '',
  };

  return {
    sanskrit,
    sanskritRaw,
    transliteration,
    wordMeaning: cleanVerseField(rawVerse.wordMeaning),
    hindi,
    translation,
    simpleMeaning: {
      en: simpleEn,
      hi: simpleHi,
    },
    genZInterpretation: {
      en: '',
      hi: '',
      tagline: '',
    },
    whyItMattersToday,
    realWorldExamples,
    perspectives,
    dailyExercise: {
      actionStep,
      actionStepHi,
      reflectionQuestion,
      reflectionQuestionHi,
      duration,
    },
    keyTakeaway,
    isCuratedPedagogical: Boolean(pedagogical),
  };
}
