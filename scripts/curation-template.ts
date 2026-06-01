/**
 * Curation Template for Adding New Verses
 * This file serves as a template for adding high-quality verses to any scripture
 */

export interface VerseTemplate {
  id: number;
  sanskrit: string;
  transliteration: string;
  translation: string;
  hindi: string;
  explanation: string;
  science?: string;
  lifeLesson?: string;
  keywords: string[];
}

export const VERSE_CURATION_CHECKLIST = [
  "Sanskrit text is accurate (verify against 2+ sources)",
  "Transliteration follows IAST standard",
  "Hindi translation is fluent and accurate",
  "Explanation is 100-300 words and insightful",
  "Scientific connection is accurate (for key verses)",
  "Life lesson is practical and applicable",
  "Keywords are relevant and searchable (3-5 tags)",
  "Formatting is consistent with existing verses",
];

export const QUALITY_STANDARDS = {
  minExplanationLength: 100,
  maxExplanationLength: 300,
  minKeywords: 3,
  maxKeywords: 5,
  requiredFields: ['sanskrit', 'transliteration', 'translation', 'hindi', 'explanation', 'keywords'],
  optionalFields: ['science', 'lifeLesson'],
};

// Template for new verse
export const NEW_VERSE_TEMPLATE: VerseTemplate = {
  id: 0, // Fill in
  sanskrit: '', // Sanskrit in Devanagari
  transliteration: '', // IAST transliteration
  translation: '', // English translation
  hindi: '', // Hindi translation
  explanation: '', // 100-300 word explanation
  science: '', // Scientific research connection (optional for minor verses)
  lifeLesson: '', // Practical application (optional for minor verses)
  keywords: [], // 3-5 relevant tags
};

// Helper function to validate a verse
export function validateVerse(verse: VerseTemplate): string[] {
  const errors: string[] = [];
  
  for (const field of QUALITY_STANDARDS.requiredFields) {
    if (!verse[field as keyof VerseTemplate]) {
      errors.push(`Missing required field: ${field}`);
    }
  }
  
  if (verse.explanation.length < QUALITY_STANDARDS.minExplanationLength) {
    errors.push(`Explanation too short (${verse.explanation.length} chars, min ${QUALITY_STANDARDS.minExplanationLength})`);
  }
  
  if (verse.explanation.length > QUALITY_STANDARDS.maxExplanationLength) {
    errors.push(`Explanation too long (${verse.explanation.length} chars, max ${QUALITY_STANDARDS.maxExplanationLength})`);
  }
  
  if (verse.keywords.length < QUALITY_STANDARDS.minKeywords) {
    errors.push(`Too few keywords (${verse.keywords.length}, min ${QUALITY_STANDARDS.minKeywords})`);
  }
  
  if (verse.keywords.length > QUALITY_STANDARDS.maxKeywords) {
    errors.push(`Too many keywords (${verse.keywords.length}, max ${QUALITY_STANDARDS.maxKeywords})`);
  }
  
  return errors;
}
