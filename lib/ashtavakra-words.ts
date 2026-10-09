/**
 * Server-side index for the Ashtavakra word explorer.
 *
 * Aggregates the per-verse `wordMeanings` (पदच्छेद के प्रमुख शब्दार्थ) across
 * all published chapters, but ONLY from verses whose verificationStatus is
 * "verified" — flagged verses ("समीक्षा आवश्यक") contribute nothing here.
 *
 * The glosses are the same editorial padārtha the verse pages show; nothing is
 * re-split, translated again, or looked up in a dictionary. Pada-groups (e.g.
 * "वैरिणम् कामम्") stay grouped exactly as printed.
 */
import { getChapterData, publishedChapterNumbers } from './ashtavakra';

export interface WordGloss {
  hindi: string;
  refs: string[];
}

export interface WordEntry {
  word: string;
  glosses: WordGloss[];
  /** Total verses (verified only) where the word's gloss appears. */
  verseCount: number;
}

export interface WordLetterGroup {
  letter: string;
  words: WordEntry[];
}

export interface WordIndex {
  groups: WordLetterGroup[];
  wordCount: number;
  verseCount: number;
  flaggedExcluded: number;
}

const norm = (s: string) => s.trim().replace(/\s+/g, ' ');

export function buildWordIndex(): WordIndex {
  const map = new Map<string, WordEntry>();
  let verseCount = 0;
  let flaggedExcluded = 0;

  for (const n of publishedChapterNumbers()) {
    for (const v of getChapterData(n)!.verses) {
      if (v.verificationStatus !== 'verified') {
        flaggedExcluded++;
        continue;
      }
      verseCount++;
      for (const w of v.wordMeanings) {
        const word = norm(w.sanskrit);
        const gloss = norm(w.hindi);
        if (!word || !gloss) continue;
        let entry = map.get(word);
        if (!entry) {
          entry = { word, glosses: [], verseCount: 0 };
          map.set(word, entry);
        }
        let g = entry.glosses.find((x) => x.hindi === gloss);
        if (!g) {
          g = { hindi: gloss, refs: [] };
          entry.glosses.push(g);
        }
        if (!g.refs.includes(v.verseNumber)) g.refs.push(v.verseNumber);
      }
    }
  }

  const collator = new Intl.Collator('hi');
  const words = Array.from(map.values()).sort((a, b) => collator.compare(a.word, b.word));
  for (const e of words) {
    e.glosses.sort((a, b) => a.hindi.localeCompare(b.hindi, 'hi'));
    for (const g of e.glosses) g.refs.sort((a, b) => collator.compare(a, b));
    e.verseCount = e.glosses.reduce((s, g) => s + g.refs.length, 0);
  }

  const groups: WordLetterGroup[] = [];
  for (const e of words) {
    const letter = e.word[0];
    let group = groups[groups.length - 1];
    if (!group || group.letter !== letter) {
      group = { letter, words: [] };
      groups.push(group);
    }
    group.words.push(e);
  }

  return { groups, wordCount: words.length, verseCount, flaggedExcluded };
}
