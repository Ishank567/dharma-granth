/**
 * Seed Valmiki Ramayana from the public DharmicData dataset.
 *
 * Source: https://github.com/bhavykhatri/DharmicData (community-maintained Sanskrit corpus)
 * Output: public/data/scriptures-full/ramayana.json
 *
 * Run: npm run seed:ramayana
 */
import {
  FullChapter,
  FullScripture,
  FullVerse,
  fetchJson,
  log,
  writeScripture,
} from "./lib/scripture-schema";

const BASE = "https://raw.githubusercontent.com/bhavykhatri/DharmicData/master/ValmikiRamayana";

const KANDAS: { file: string; number: number; title: string; titleSanskrit: string }[] = [
  { file: "1_balakanda.json", number: 1, title: "Bala Kanda", titleSanskrit: "बालकाण्ड" },
  { file: "2_ayodhyakanda.json", number: 2, title: "Ayodhya Kanda", titleSanskrit: "अयोध्याकाण्ड" },
  { file: "3_aranyakanda.json", number: 3, title: "Aranya Kanda", titleSanskrit: "अरण्यकाण्ड" },
  { file: "4_kishkindhakanda.json", number: 4, title: "Kishkindha Kanda", titleSanskrit: "किष्किन्धाकाण्ड" },
  { file: "5_sundarakanda.json", number: 5, title: "Sundara Kanda", titleSanskrit: "सुन्दरकाण्ड" },
  { file: "6_yudhhakanda.json", number: 6, title: "Yuddha Kanda", titleSanskrit: "युद्धकाण्ड" },
  { file: "7_uttarakanda.json", number: 7, title: "Uttara Kanda", titleSanskrit: "उत्तरकाण्ड" },
];

// Source schema (verified against DharmicData/ValmikiRamayana on 2026-05-15):
//   { kaanda: string, sarg: number, shloka: number, text: string }
// `text` holds the Sanskrit mūla verse. There is no Hindi/English translation
// field in this corpus — translations need a separate source or AI generation.
interface RawVerse {
  kaanda?: string;
  sarg?: number;
  shloka?: number;
  text?: string;
}

async function main(): Promise<void> {
  log("Fetching Valmiki Ramayana from DharmicData...");

  const chapters: FullChapter[] = [];
  let totalVerses = 0;

  for (const k of KANDAS) {
    const url = `${BASE}/${k.file}`;
    let raw: RawVerse[];
    try {
      raw = await fetchJson<RawVerse[]>(url);
    } catch (err) {
      log(`Warning: failed to fetch ${k.file} (${(err as Error).message}) — skipping`);
      continue;
    }

    const verses: FullVerse[] = raw.map((v, i) => {
      // Compose a verse identifier as "sarga.shloka" so all verses within a
      // kanda stay unique even though shloka counts reset each sarga.
      const ref =
        typeof v.sarg === "number" && typeof v.shloka === "number"
          ? `${v.sarg}.${v.shloka}`
          : i + 1;
      return {
        number: ref,
        sanskrit: typeof v.text === "string" ? v.text.trim() : undefined,
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
    id: "ramayana",
    title: "Valmiki Ramayana",
    titleSanskrit: "वाल्मीकि रामायण",
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
