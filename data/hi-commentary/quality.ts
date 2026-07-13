import type { HiCommentaryEntry } from "./_types";

/** Known machine-generated English templates (prefix match). */
export const BOILERPLATE_PREFIXES = [
  "Modern psychology and neuroscience increasingly validate ancient insights",
  "Ecopsychology: exposure to natural environments reduces cortisol",
  "Behavioral psychology (Bandura): every action creates neural pathways",
  "Meditation research (Davidson): sustained practice thickens the prefrontal cortex",
  "Evolutionary psychology: moral behavior evolved as a survival strategy",
  "Psychology of authenticity (Harter)",
  "Neuroscience of devotion (Newberg)",
  "Cognitive neuroscience: insight emerges from gamma-wave synchrony",
  "Reflect on this verse's teaching and find one practical way to apply it",
  "Ancient wisdom becomes living wisdom only when practiced",
] as const;

const DEVANAGARI = /[\u0900-\u097F]/;

export function hasDevanagari(text: string): boolean {
  return DEVANAGARI.test(text);
}

export function isBoilerplateField(text: string | undefined): boolean {
  if (!text || !text.trim()) return false;
  const trimmed = text.trim();
  if (!hasDevanagari(trimmed)) return true;
  return BOILERPLATE_PREFIXES.some((prefix) => trimmed.startsWith(prefix));
}

export function stripBoilerplateEntry(entry: HiCommentaryEntry): HiCommentaryEntry {
  const out: HiCommentaryEntry = {};
  if (entry.explanation) out.explanation = entry.explanation;
  if (entry.science && !isBoilerplateField(entry.science)) out.science = entry.science;
  if (entry.lifeLesson && !isBoilerplateField(entry.lifeLesson)) out.lifeLesson = entry.lifeLesson;
  return out;
}

export function isCuratedAnalysisField(text: string | undefined): boolean {
  return !!text && !isBoilerplateField(text);
}