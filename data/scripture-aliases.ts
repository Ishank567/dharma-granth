/**
 * The one alias map. An alias redirects and matches searches; it never
 * becomes a second canonical page. An alias must not equal any canonical id
 * (checked by scripts/check-registry.ts).
 */
export const SCRIPTURE_ALIASES: Record<string, string> = {
  yogavasistha: 'yogavasishtha',
  'yoga-vasistha': 'yogavasishtha',
  ishaupanishad: 'ishavasya',
  'isha-upanishad': 'ishavasya',
  isha: 'ishavasya',
  gita: 'bhagavadgita',
  'bhagavad-gita': 'bhagavadgita',
  geeta: 'bhagavadgita',
};
