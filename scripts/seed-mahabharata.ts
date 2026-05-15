/**
 * Seed the Mahabharata from the public DharmicData dataset.
 *
 * Source: https://github.com/bhavykhatri/DharmicData
 *   /Mahabharata/mahabharata_book_{1..18}.json
 * Output: public/data/scriptures-full/mahabharata.json
 *
 * Each book file is a flat array of `{ book, chapter, shloka, text }` objects.
 * We collapse to one chapter per Parva (book), with hierarchical verse ids
 * `<chapter>.<shloka>` so the reader can drill from book → chapter → shloka.
 *
 * Run: npm run seed:mahabharata
 */
import {
  FullChapter,
  FullScripture,
  FullVerse,
  fetchJson,
  log,
  writeScripture,
} from "./lib/scripture-schema";

const BASE = "https://raw.githubusercontent.com/bhavykhatri/DharmicData/master/Mahabharata";

interface MBRow {
  book: number;
  chapter: number;
  shloka: number;
  text: string;
}

const PARVAS: { num: number; label: string; sanskrit: string }[] = [
  { num: 1, label: "Adi Parva", sanskrit: "आदिपर्व" },
  { num: 2, label: "Sabha Parva", sanskrit: "सभापर्व" },
  { num: 3, label: "Vana Parva", sanskrit: "वनपर्व" },
  { num: 4, label: "Virata Parva", sanskrit: "विराटपर्व" },
  { num: 5, label: "Udyoga Parva", sanskrit: "उद्योगपर्व" },
  { num: 6, label: "Bhishma Parva", sanskrit: "भीष्मपर्व" },
  { num: 7, label: "Drona Parva", sanskrit: "द्रोणपर्व" },
  { num: 8, label: "Karna Parva", sanskrit: "कर्णपर्व" },
  { num: 9, label: "Shalya Parva", sanskrit: "शल्यपर्व" },
  { num: 10, label: "Sauptika Parva", sanskrit: "सौप्तिकपर्व" },
  { num: 11, label: "Stri Parva", sanskrit: "स्त्रीपर्व" },
  { num: 12, label: "Shanti Parva", sanskrit: "शान्तिपर्व" },
  { num: 13, label: "Anushasana Parva", sanskrit: "अनुशासनपर्व" },
  { num: 14, label: "Ashvamedha Parva", sanskrit: "अश्वमेधपर्व" },
  { num: 15, label: "Ashramavasika Parva", sanskrit: "आश्रमवासिकपर्व" },
  { num: 16, label: "Mausala Parva", sanskrit: "मौसलपर्व" },
  { num: 17, label: "Mahaprasthanika Parva", sanskrit: "महाप्रस्थानिकपर्व" },
  { num: 18, label: "Svargarohana Parva", sanskrit: "स्वर्गारोहणपर्व" },
];

async function main(): Promise<void> {
  log("Fetching Mahabharata from DharmicData (18 parvas)...");
  const chapters: FullChapter[] = [];
  let totalVerses = 0;

  for (const parva of PARVAS) {
    const url = `${BASE}/mahabharata_book_${parva.num}.json`;
    let rows: MBRow[];
    try {
      rows = await fetchJson<MBRow[]>(url);
    } catch (err) {
      log(`  ${parva.label}: SKIPPED (${(err as Error).message})`);
      continue;
    }

    const verses: FullVerse[] = rows
      .filter((r) => typeof r.text === "string" && r.text.trim().length >= 3)
      .map((r) => ({
        // Hierarchical: <chapter>.<shloka> matches the reader's verse id
        // convention from the other seeders.
        number: `${r.chapter}.${r.shloka}`,
        sanskrit: r.text.replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " ").trim(),
      }));

    chapters.push({
      number: parva.num,
      title: parva.label,
      titleSanskrit: parva.sanskrit,
      verses,
    });
    totalVerses += verses.length;
    log(`  ${parva.label}: ${verses.length} verses`);
  }

  const scripture: FullScripture = {
    id: "mahabharata",
    title: "Mahabharata",
    titleSanskrit: "महाभारत",
    category: "itihasa",
    source: {
      repo: "https://github.com/bhavykhatri/DharmicData",
      license:
        "Sanskrit mūla — public domain (2500+ years old). Critical-edition derivative; check upstream for translation licensing.",
      fetchedAt: new Date().toISOString(),
    },
    totalVerses,
    totalChapters: chapters.length,
    chapters,
  };

  const outPath = writeScripture(scripture);
  log(`Wrote ${totalVerses} Mahabharata verses · ${chapters.length} parvas -> ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
