/** Search results cut descriptions at roughly this many characters. */
export const MAX_DESCRIPTION = 158;

/** Shorten text to `max` characters at a word boundary, ending with an ellipsis. */
export function clipDescription(text: string, max = MAX_DESCRIPTION): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (Array.from(clean).length <= max) return clean;
  const cut = Array.from(clean).slice(0, max - 1).join('');
  const atWord = cut.replace(/\s+\S*$/, '');
  return `${(atWord.length > max * 0.6 ? atWord : cut).replace(/[\s,;:—-]+$/, '')}…`;
}
