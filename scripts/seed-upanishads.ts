/**
 * Seed principal Upanishads from sanskritdocuments.org.
 *
 * Source: https://sanskritdocuments.org/doc_upanishhat/
 * Output: public/data/scriptures-full/<id>.json
 *
 * Sanskrit mūla text of the Upanishads is public domain (2500+ years old).
 * sanskritdocuments digitizes and publishes it as ITRANS .itx files which we
 * convert to Devanagari via @indic-transliteration/sanscript. Transliterations
 * are also preserved on each verse.
 *
 * Covered here (8 of the 10 principal Upanishads we can confidently source):
 *   - ishavasya  (1 mantra-chapter, 18 verses)
 *   - kena       (4 khaṇḍas)
 *   - katha      (6 vallīs across 2 adhyāyas)
 *   - prashna    (6 praśnas)
 *   - mundaka    (3 muṇḍakas × 2 khaṇḍas each = 6 chapters)
 *   - mandukya   (12 mantras as one chapter)
 *   - aitareya   (3 adhyāyas)
 *   - shvetashvatara (6 adhyāyas)
 *
 * NOT covered (no clean open ITRANS source readily available):
 *   - brihadaranyaka, chandogya, taittiriya
 * These three are typically distributed with bhāṣya attached and need a
 * dedicated parser; left for a follow-up.
 *
 * Run: npm run seed:upanishads
 */
import {
  FullChapter,
  FullScripture,
  FullVerse,
  log,
  writeScripture,
} from "./lib/scripture-schema";
import {
  cleanItx,
  extractVerses,
  itxToDevanagari,
  normalizeItxLine,
  splitUpanishadChapters,
} from "./lib/itrans-parser";

const BASE = "https://sanskritdocuments.org/doc_upanishhat";

interface UpanishadConfig {
  id: string;
  title: string;
  titleSanskrit: string;
  basename: string;
  /**
   * Some Upanishads (Isha, Mandukya) have no internal chapter divisions —
   * all verses sit in a single flat chapter. Set this to true for those.
   */
  singleChapter?: boolean;
  /** Optional label prefix for chapter titles, e.g. "Khaṇḍa" or "Vallī". */
  chapterUnit?: string;
}

const UPANISHADS: UpanishadConfig[] = [
  {
    id: "ishavasya",
    title: "Isha Upanishad",
    titleSanskrit: "ईशावास्योपनिषद्",
    basename: "iisha",
    singleChapter: true,
  },
  {
    id: "kena",
    title: "Kena Upanishad",
    titleSanskrit: "केनोपनिषद्",
    basename: "kena",
    chapterUnit: "Khaṇḍa",
  },
  {
    id: "katha",
    title: "Katha Upanishad",
    titleSanskrit: "कठोपनिषद्",
    basename: "katha",
    chapterUnit: "Vallī",
  },
  {
    id: "prashna",
    title: "Prashna Upanishad",
    titleSanskrit: "प्रश्नोपनिषद्",
    basename: "prashna",
    chapterUnit: "Praśna",
  },
  {
    id: "mundaka",
    title: "Mundaka Upanishad",
    titleSanskrit: "मुण्डकोपनिषद्",
    basename: "mundaka",
    chapterUnit: "Khaṇḍa",
  },
  {
    id: "mandukya",
    title: "Mandukya Upanishad",
    titleSanskrit: "माण्डूक्योपनिषद्",
    basename: "maandu",
    singleChapter: true,
  },
  {
    id: "aitareya",
    title: "Aitareya Upanishad",
    titleSanskrit: "ऐतरेयोपनिषद्",
    basename: "aitareya",
    chapterUnit: "Adhyāya",
  },
  {
    id: "shvetashvatara",
    title: "Shvetashvatara Upanishad",
    titleSanskrit: "श्वेताश्वतरोपनिषद्",
    basename: "shveta",
    chapterUnit: "Adhyāya",
  },
];

async function fetchAndParse(config: UpanishadConfig): Promise<FullScripture> {
  const url = `${BASE}/${config.basename}.itx`;
  log(`Fetching ${config.title} from ${url}`);

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }
  const raw = await res.text();
  const body = cleanItx(raw);

  const chapters: FullChapter[] = [];
  let totalVerses = 0;

  if (config.singleChapter) {
    const verses: FullVerse[] = extractVerses(body).map((v) => ({
      number: v.number,
      sanskrit: itxToDevanagari(v.itx),
      transliteration: normalizeItxLine(v.itx),
    }));
    chapters.push({ number: 1, title: config.title, verses });
    totalVerses = verses.length;
  } else {
    const rawChapters = splitUpanishadChapters(body);
    rawChapters.forEach((rc, i) => {
      const verses: FullVerse[] = extractVerses(rc.bodyItx).map((v) => ({
        number: v.number,
        sanskrit: itxToDevanagari(v.itx),
        transliteration: normalizeItxLine(v.itx),
      }));
      if (verses.length === 0) return;
      chapters.push({
        number: chapters.length + 1,
        title: config.chapterUnit
          ? `${config.chapterUnit} ${chapters.length + 1}`
          : `Chapter ${chapters.length + 1}`,
        verses,
      });
      totalVerses += verses.length;
    });

    // Some Upanishads have a leading invocation or trailing peace mantra
    // that isn't followed by an `iti ... ||` marker. If splitUpanishadChapters
    // returned zero chapters, fall back to treating the whole text as one
    // chapter (Isha-style).
    if (chapters.length === 0) {
      log(`  no chapter markers found, treating as single chapter`);
      const verses: FullVerse[] = extractVerses(body).map((v) => ({
        number: v.number,
        sanskrit: itxToDevanagari(v.itx),
        transliteration: normalizeItxLine(v.itx),
      }));
      chapters.push({ number: 1, title: config.title, verses });
      totalVerses = verses.length;
    }
  }

  log(`  parsed ${chapters.length} chapters · ${totalVerses} verses`);

  return {
    id: config.id,
    title: config.title,
    titleSanskrit: config.titleSanskrit,
    category: "upanishad",
    source: {
      repo: "https://sanskritdocuments.org/doc_upanishhat/",
      license:
        "Sanskrit mūla — public domain (2500+ years old). sanskritdocuments.org publishes digitized text under permissive terms.",
      fetchedAt: new Date().toISOString(),
    },
    totalVerses,
    totalChapters: chapters.length,
    chapters,
  };
}

async function main(): Promise<void> {
  for (const cfg of UPANISHADS) {
    try {
      const scripture = await fetchAndParse(cfg);
      const outPath = writeScripture(scripture);
      log(
        `Wrote ${scripture.totalVerses} verses · ${scripture.totalChapters} chapters · ${cfg.id} -> ${outPath}`,
      );
    } catch (err) {
      log(`${cfg.id}: FAILED (${(err as Error).message})`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
