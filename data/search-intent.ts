/**
 * Search phrases for life topics that already exist.
 * A Gita-only title is used when every cited verse on the topic is from the Gita.
 */

export interface SearchIntent {
  slug: string;
  titleHi: string;
  /** Used when every verse on the topic is bhagavadgita. */
  gitaTitle: string;
  /** Used when the topic also cites another text. */
  libraryTitle: string;
}

export const SEARCH_INTENTS: SearchIntent[] = [
  { slug: 'stress-and-worry', titleHi: 'चिंता और तनाव', gitaTitle: 'What the Bhagavad Gita says about anxiety and stress', libraryTitle: 'Anxiety and stress in the library' },
  { slug: 'fear-and-courage', titleHi: 'भय और साहस', gitaTitle: 'What the Bhagavad Gita says about fear', libraryTitle: 'Fear and courage in the library' },
  { slug: 'anger', titleHi: 'क्रोध', gitaTitle: 'What the Bhagavad Gita says about anger', libraryTitle: 'Anger in the library' },
  { slug: 'meaning-of-life', titleHi: 'उद्देश्य और जीवन का अर्थ', gitaTitle: 'What the Bhagavad Gita says about purpose', libraryTitle: 'Purpose and meaning in the library' },
  { slug: 'discipline', titleHi: 'अनुशासन', gitaTitle: 'What the Bhagavad Gita says about discipline', libraryTitle: 'Discipline in the library' },
  { slug: 'concentration', titleHi: 'एकाग्रता', gitaTitle: 'What the Bhagavad Gita says about focus', libraryTitle: 'Focus in the library' },
  { slug: 'leadership', titleHi: 'नेतृत्व', gitaTitle: 'What the Bhagavad Gita says about leadership', libraryTitle: 'Leadership in the library' },
  { slug: 'success', titleHi: 'सिद्धि', gitaTitle: 'What the Bhagavad Gita says about success', libraryTitle: 'Success in the library' },
];

export function searchHeading(
  slug: string,
  verses: ReadonlyArray<{ scriptureId: string }>,
): { hi: string; en: string } | null {
  const intent = SEARCH_INTENTS.find((item) => item.slug === slug);
  if (!intent) return null;
  const gitaOnly = verses.length > 0 && verses.every((verse) => verse.scriptureId === 'bhagavadgita');
  return { hi: intent.titleHi, en: gitaOnly ? intent.gitaTitle : intent.libraryTitle };
}
