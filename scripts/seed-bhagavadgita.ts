/**
 * Seed Bhagavad Gita from the public gita/gita dataset.
 *
 * Source: https://github.com/gita/gita (community-maintained Sanskrit + translations)
 * Output: public/data/scriptures-full/bhagavadgita.json
 *
 * Run: npm run seed:gita
 */
import {
  FullChapter,
  FullScripture,
  FullVerse,
  fetchJson,
  log,
  writeScripture,
} from "./lib/scripture-schema";

const BASE = "https://raw.githubusercontent.com/gita/gita/main/data";

interface GitaChapter {
  chapter_number: number;
  name: string;
  name_translation: string;
  name_meaning?: string;
  chapter_summary?: string;
  chapter_summary_hindi?: string;
  verses_count: number;
}

interface GitaVerse {
  id: number;
  chapter_number: number;
  verse_number: number;
  text: string;
  transliteration?: string;
  word_meanings?: string;
}

interface GitaTranslation {
  id: number;
  verse_id: number;
  lang: string;
  author_id: number;
  description: string;
}

async function main(): Promise<void> {
  log("Fetching Bhagavad Gita data from gita/gita...");

  const [chapters, verses, translations] = await Promise.all([
    fetchJson<GitaChapter[]>(`${BASE}/chapters.json`),
    fetchJson<GitaVerse[]>(`${BASE}/verse.json`),
    fetchJson<GitaTranslation[]>(`${BASE}/translation.json`),
  ]);

  log(`Fetched ${chapters.length} chapters, ${verses.length} verses, ${translations.length} translations`);

  // Prefer Swami Ramsukhdas (Hindi, author_id 11) and Swami Tejomayananda (English, fallback).
  const hindiByVerse = new Map<number, GitaTranslation>();
  const englishByVerse = new Map<number, GitaTranslation>();
  for (const t of translations) {
    if (t.lang === "hindi") {
      const existing = hindiByVerse.get(t.verse_id);
      if (!existing || t.author_id === 11) {
        hindiByVerse.set(t.verse_id, t);
      }
    } else if (t.lang === "english") {
      if (!englishByVerse.has(t.verse_id)) {
        englishByVerse.set(t.verse_id, t);
      }
    }
  }

  const versesByChapter = new Map<number, GitaVerse[]>();
  for (const v of verses) {
    const list = versesByChapter.get(v.chapter_number) ?? [];
    list.push(v);
    versesByChapter.set(v.chapter_number, list);
  }
  versesByChapter.forEach((list) => {
    list.sort((a: GitaVerse, b: GitaVerse) => a.verse_number - b.verse_number);
  });

  const fullChapters: FullChapter[] = chapters
    .sort((a, b) => a.chapter_number - b.chapter_number)
    .map((ch) => {
      const verseList = versesByChapter.get(ch.chapter_number) ?? [];
      const fullVerses: FullVerse[] = verseList.map((v) => ({
        number: v.verse_number,
        sanskrit: v.text,
        transliteration: v.transliteration,
        translation: englishByVerse.get(v.id)?.description,
        hindi: hindiByVerse.get(v.id)?.description,
        wordMeaning: v.word_meanings,
      }));
      return {
        number: ch.chapter_number,
        title: ch.name_translation,
        titleSanskrit: ch.name,
        verses: fullVerses,
      };
    });

  const scripture: FullScripture = {
    id: "bhagavadgita",
    title: "Bhagavad Gita",
    titleSanskrit: "श्रीमद्भगवद्गीता",
    category: "itihasa",
    source: {
      repo: "https://github.com/gita/gita",
      license: "Community dataset — verify license terms at source repo before redistribution.",
      fetchedAt: new Date().toISOString(),
    },
    totalVerses: verses.length,
    totalChapters: chapters.length,
    chapters: fullChapters,
  };

  const outPath = writeScripture(scripture);
  log(`Wrote ${scripture.totalVerses} verses across ${scripture.totalChapters} chapters -> ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
