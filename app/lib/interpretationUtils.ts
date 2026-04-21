import type { GuidedCourseVerseContext } from '@/app/lib/guidedCourses';
import type { Interpretation, Verse } from '@/app/lib/types';

export type InterpretationPayload = Pick<
  Interpretation,
  'shabdarth' | 'bhavarth' | 'simple_example' | 'guided_learning' | 'scientific_temperament' | 'modern_relevance' | 'next_curiosity'
>;

export type InterpretationRequestStatus = 'cached' | 'generated' | 'upgraded' | 'fallback';

export type InterpretationFallbackReason =
  | 'missing_api_key'
  | 'rate_limited'
  | 'ai_error'
  | 'invalid_ai_output';

export interface InterpretationApiResponse {
  interpretation: Interpretation;
  status: InterpretationRequestStatus;
  fallbackReason?: InterpretationFallbackReason;
}

export interface InterpretationGenerationInput {
  verseId?: number;
  verseNumber: number;
  originalText: string;
  transliteration: string;
  translationHindi: string;
  translationEnglish: string;
  bookTitle: string;
  bookSlug?: string;
  chapterTitle: string;
  courseContext?: GuidedCourseVerseContext;
}

type VerseForInterpretationInput = Pick<
  Verse,
  | 'id'
  | 'verse_number'
  | 'original_text'
  | 'transliteration'
  | 'translation_hindi'
  | 'translation_english'
> & {
  book_title?: string;
  book_slug?: string;
  chapter_title?: string;
};

type InterpretationField = keyof InterpretationPayload;

const MIN_SECTION_LENGTHS: Record<InterpretationField, number> = {
  shabdarth: 32,
  bhavarth: 120,
  simple_example: 20,
  guided_learning: 30,
  scientific_temperament: 80,
  modern_relevance: 60,
  next_curiosity: 15,
};

export class InterpretationValidationError extends Error {
  readonly reason = 'invalid_ai_output';

  constructor(message: string) {
    super(message);
    this.name = 'InterpretationValidationError';
  }
}

export function normalizeText(text: string) {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function extractGuidedLearningItems(text: string) {
  const normalized = normalizeText(text.replace(/\u2022/g, '-').replace(/\s+(?=\d+\.)/g, '\n'));
  return normalized
    .split(/\n+/)
    .map((line) => line.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean);
}

export function normalizeGuidedLearning(text: string) {
  const items = extractGuidedLearningItems(text);
  return items.map((item, index) => `${index + 1}. ${item}`).join('\n');
}

export function normalizeInterpretationPayload(
  payload: Partial<InterpretationPayload>
): InterpretationPayload {
  const asStr = (v: unknown) => (typeof v === 'string' ? v : v != null ? String(v) : '');
  const normalized: InterpretationPayload = {
    shabdarth: normalizeText(asStr(payload.shabdarth)),
    bhavarth: normalizeText(asStr(payload.bhavarth)),
    simple_example: normalizeText(asStr(payload.simple_example)),
    guided_learning: normalizeGuidedLearning(asStr(payload.guided_learning)),
    scientific_temperament: normalizeText(asStr(payload.scientific_temperament)),
    modern_relevance: normalizeText(asStr(payload.modern_relevance)),
    next_curiosity: normalizeText(asStr(payload.next_curiosity)),
  };

  const missingFields = (Object.entries(normalized) as Array<[InterpretationField, string]>)
    .filter(([, value]) => !value)
    .map(([field]) => field);

  if (missingFields.length > 0) {
    throw new InterpretationValidationError(
      `व्याख्या के भाग अनुपस्थित हैं: ${missingFields.join(', ')}`
    );
  }

  for (const [field, minLength] of Object.entries(MIN_SECTION_LENGTHS) as Array<[
    InterpretationField,
    number,
  ]>) {
    if (normalized[field].length < minLength) {
      throw new InterpretationValidationError(
        `व्याख्या का भाग बहुत छोटा है: ${field}`
      );
    }
  }

  if (extractGuidedLearningItems(normalized.guided_learning).length < 3) {
    throw new InterpretationValidationError('मार्गदर्शित अध्ययन में पर्याप्त क्रमबद्ध बिंदु नहीं हैं');
  }

  return normalized;
}

export function buildInterpretationInput(
  verse: VerseForInterpretationInput,
  courseContext?: GuidedCourseVerseContext
): InterpretationGenerationInput {
  return {
    verseId: verse.id,
    verseNumber: verse.verse_number,
    originalText: normalizeText(verse.original_text),
    transliteration: normalizeText(verse.transliteration || ''),
    translationHindi: normalizeText(verse.translation_hindi || ''),
    translationEnglish: normalizeText(verse.translation_english || ''),
    bookTitle: normalizeText(verse.book_title || 'ग्रंथ'),
    bookSlug: verse.book_slug,
    chapterTitle: normalizeText(verse.chapter_title || ''),
    courseContext,
  };
}

export function createInterpretationApiResponse(
  interpretation: Interpretation,
  status: InterpretationRequestStatus,
  fallbackReason?: InterpretationFallbackReason
): InterpretationApiResponse {
  return fallbackReason
    ? { interpretation, status, fallbackReason }
    : { interpretation, status };
}