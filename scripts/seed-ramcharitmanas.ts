/**
 * Seed Goswami Tulsidas's Ramcharitmanas from the public DharmicData dataset.
 *
 * Source: https://github.com/bhavykhatri/DharmicData
 * Output: public/data/scriptures-full/ramcharitmanas.json
 *
 * Run: npm run seed:ramcharitmanas
 */
import {
  FullChapter,
  FullScripture,
  FullVerse,
  fetchJson,
  log,
  writeScripture,
} from "./lib/scripture-schema";

const BASE = "https://raw.githubusercontent.com/bhavykhatri/DharmicData/master/Ramcharitmanas";

// Filenames are URL-encoded Hindi names in the source repo. encodeURIComponent
// is applied at fetch-time so we keep the raw Hindi here for readability.
const KANDAS: { file: string; number: number; title: string; titleSanskrit: string }[] = [
  { file: "1_बाल_काण्ड_data.json", number: 1, title: "Bala Kanda", titleSanskrit: "बाल काण्ड" },
  { file: "2_अयोध्या_काण्ड_data.json", number: 2, title: "Ayodhya Kanda", titleSanskrit: "अयोध्या काण्ड" },
  { file: "3_अरण्य_काण्ड_data.json", number: 3, title: "Aranya Kanda", titleSanskrit: "अरण्य काण्ड" },
  { file: "4_किष्किन्धा_काण्ड_data.json", number: 4, title: "Kishkindha Kanda", titleSanskrit: "किष्किन्धा काण्ड" },
  { file: "5_सुंदर_काण्ड_data.json", number: 5, title: "Sundara Kanda", titleSanskrit: "सुंदर काण्ड" },
  { file: "6_लंका_काण्ड_data.json", number: 6, title: "Lanka Kanda", titleSanskrit: "लंका काण्ड" },
  { file: "7_उत्तर_काण्ड_data.json", number: 7, title: "Uttara Kanda", titleSanskrit: "उत्तर काण्ड" },
];

// Source schema (verified against DharmicData/Ramcharitmanas on 2026-05-15):
//   { type: "doha" | "chaupai" | ..., content: string, kaand: string }
// `content` holds the Awadhi verse text. No separate Hindi or English column
// is present — those need a different source or AI generation.
interface RawVerse {
  type?: string;
  content?: string;
  kaand?: string;
}

async function main(): Promise<void> {
  log("Fetching Ramcharitmanas from DharmicData...");

  const chapters: FullChapter[] = [];
  let totalVerses = 0;

  for (const k of KANDAS) {
    const url = `${BASE}/${encodeURIComponent(k.file)}`;
    let raw: RawVerse[];
    try {
      raw = await fetchJson<RawVerse[]>(url);
    } catch (err) {
      log(`Warning: failed to fetch ${k.file} (${(err as Error).message}) — skipping`);
      continue;
    }

    const verses: FullVerse[] = raw.map((v, i) => {
      const content = typeof v.content === "string" ? v.content.trim() : undefined;
      // The `type` field labels the verse form (doha / chaupai / sortha /
      // chhand). Carry it as wordMeaning so the reader can show it.
      const formLabel = typeof v.type === "string" ? v.type.trim() : undefined;
      return {
        number: i + 1,
        sanskrit: content,
        wordMeaning: formLabel,
      };
    });

    chapters.push({
      number: k.number,
      title: k.title,
      titleSanskrit: k.titleSanskrit,
      verses,
    });
    totalVerses += verses.length;
    log(`  ${k.title}: ${verses.length} verses`);
  }

  const scripture: FullScripture = {
    id: "ramcharitmanas",
    title: "Shri Ramcharitmanas",
    titleSanskrit: "श्रीरामचरितमानस",
    category: "itihasa",
    source: {
      repo: "https://github.com/bhavykhatri/DharmicData",
      license: "Community dataset — verify license terms at source repo before redistribution.",
      fetchedAt: new Date().toISOString(),
    },
    totalVerses,
    totalChapters: chapters.length,
    chapters,
  };

  const outPath = writeScripture(scripture);
  log(`Wrote ${totalVerses} verses across ${chapters.length} kandas -> ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
