/**
 * Top up full-text scripture JSON from GRETIL plain-text files.
 *
 * This seeder is intentionally conservative: it only writes an output file
 * when the GRETIL parse has more verses than the JSON already on disk. That
 * lets `seed:all` use rich sanskritdocuments/DharmicData sources first, then
 * fill gaps where GRETIL has better coverage.
 *
 * Run: npm run seed:gretil
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  FullChapter,
  FullScripture,
  FullVerse,
  log,
  writeScripture,
} from "./lib/scripture-schema";

const GRETIL_BASE =
  "https://gretil.sub.uni-goettingen.de/gretil/corpustei/transformations/plaintext";
const OUT_ROOT = resolve(process.cwd(), "public/data/scriptures-full");

interface GretilConfig {
  id: string;
  title: string;
  titleSanskrit: string;
  category: string;
  filename?: string;
  urls?: string[];
  abbrev: string;
}

interface ParsedMarker {
  chapterKey: string;
  chapterTitle: string;
  verseNumber: number | string;
}

async function fetchText(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.text();
}

function normalizeGretilText(text: string): string {
  if (!/<html[\s>]/i.test(text) && !/<!DOCTYPE html/i.test(text)) {
    return text;
  }

  return text
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(p|div|tr|h[1-6])>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function detectAbbrev(text: string): string | null {
  const textMarker = "# Text";
  const textStart = text.indexOf(textMarker);
  const body = textStart >= 0 ? text.slice(textStart + textMarker.length) : text;
  const lines = body.split(/\r?\n/).slice(0, 500);

  const counts = new Map<string, number>();
  for (const line of lines) {
    const matches = line.match(
      /(?:\/\/\s*)?([a-zA-ZāīūṛḷṃṅñṇḍṭḥśṣĀĪŪṚḶṂṄÑṆḌṬŚṢ]+)(?=_[0-9])/g,
    );
    if (!matches) continue;

    for (const match of matches) {
      const abbrev = match.replace(/[/\s]/g, "").trim();
      if (abbrev.length >= 2 && abbrev.length <= 12) {
        counts.set(abbrev, (counts.get(abbrev) || 0) + 1);
      }
    }
  }

  let bestAbbrev: string | null = null;
  let bestCount = 0;
  counts.forEach((count, abbrev) => {
    if (count > bestCount && count >= 3) {
      bestCount = count;
      bestAbbrev = abbrev;
    }
  });
  return bestAbbrev;
}

function parseMarkerRef(ref: string): ParsedMarker | null {
  const normalized = ref
    .replace(/\*.*$/, "")
    .replace(/([0-9])(?:ab|cd|ef|gh|[a-d])$/i, "$1")
    .trim();

  const withBook = normalized.match(/^(\d+),(\d+)\.(\d+(?:\.\d+)?)$/);
  if (withBook) {
    const [, book, chapter, verse] = withBook;
    if (Number(chapter) <= 0 || Number(verse) <= 0) return null;
    return {
      chapterKey: `${book}.${chapter}`,
      chapterTitle: `Book ${book} - Adhyaya ${chapter}`,
      verseNumber: Number.isInteger(Number(verse)) ? Number(verse) : verse,
    };
  }

  const chapterVerse = normalized.match(/^(\d+)\.(\d+(?:\.\d+)?)$/);
  if (chapterVerse) {
    const [, chapter, verse] = chapterVerse;
    if (Number(chapter) <= 0 || Number(verse) <= 0) return null;
    return {
      chapterKey: chapter,
      chapterTitle: `Adhyaya ${chapter}`,
      verseNumber: Number.isInteger(Number(verse)) ? Number(verse) : verse,
    };
  }

  return null;
}

function cleanVerseText(segment: string): string {
  const chapterMatch = segment.match(/\bchapter\s+\d+\b|%\s*chapter\s*\{?\d+\}?/gi);
  if (chapterMatch) {
    const last = chapterMatch[chapterMatch.length - 1];
    const idx = segment.toLowerCase().lastIndexOf(last.toLowerCase());
    segment = segment.slice(idx + last.length);
  }

  return segment
    .replace(/\s*\|\|\s*\(?\s*$/, "")
    .replace(/\s*\/\/\s*$/, "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => {
      if (!line) return false;
      if (line.startsWith("## ")) return false;
      if (line.startsWith("# ") && !line.startsWith("# Text")) return false;
      if (line.startsWith("%")) return false;
      if (/^:[a-zāīūṛḷṃṅñṇḍṭśṣ]+/i.test(line)) return false;
      if (
        /^(This file|Source:|Licence:|Publisher:|Date of this|Contribution:|Data entry:|Revisions:|Notes:|Structure of)/i.test(
          line,
        )
      ) {
        return false;
      }
      return true;
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

function parseGretilText(text: string, fallbackAbbrev: string): {
  chapters: FullChapter[];
  totalVerses: number;
} {
  const textMarker = "# Text";
  const textStart = text.indexOf(textMarker);
  if (textStart >= 0) {
    text = text.slice(textStart + textMarker.length);
  }

  const abbrev = detectAbbrev(text) || fallbackAbbrev;
  const markerRegex = new RegExp(
    `(?://\\s*)?(?:\\|\\|\\s*)?\\(?${escapeRegExp(abbrev)}_([^\\s/|)]+)(?:\\|?\\))?(?:\\s*//|/)?`,
    "gi",
  );

  const chapters: FullChapter[] = [];
  const chapterIndexByKey = new Map<string, number>();
  let lastMarkerEnd = 0;
  let lastVerseKey: string | null = null;

  let match: RegExpExecArray | null;
  while ((match = markerRegex.exec(text)) !== null) {
    const segment = cleanVerseText(text.slice(lastMarkerEnd, match.index));
    lastMarkerEnd = match.index + match[0].length;

    const marker = parseMarkerRef(match[1]);
    if (!marker || segment.length <= 5) continue;

    let chapterIndex = chapterIndexByKey.get(marker.chapterKey);
    if (chapterIndex === undefined) {
      chapterIndex = chapters.length;
      chapterIndexByKey.set(marker.chapterKey, chapterIndex);
      chapters.push({
        number: chapterIndex + 1,
        title: marker.chapterTitle,
        verses: [],
      });
    }

    const chapter = chapters[chapterIndex];
    const verseKey = `${marker.chapterKey}:${marker.verseNumber}`;
    const lastVerse = chapter.verses[chapter.verses.length - 1];

    if (lastVerse && lastVerseKey === verseKey) {
      lastVerse.sanskrit = [lastVerse.sanskrit, segment].filter(Boolean).join(" ");
    } else {
      chapter.verses.push({
        number: marker.verseNumber,
        sanskrit: segment,
        transliteration: "",
      });
      lastVerseKey = verseKey;
    }
  }

  return {
    chapters,
    totalVerses: chapters.reduce((sum, chapter) => sum + chapter.verses.length, 0),
  };
}

function existingVerseCount(id: string): number {
  const path = resolve(OUT_ROOT, `${id}.json`);
  if (!existsSync(path)) return 0;
  try {
    const data = JSON.parse(readFileSync(path, "utf8")) as { totalVerses?: number };
    return Number(data.totalVerses) || 0;
  } catch {
    return 0;
  }
}

async function seedFromGretil(config: GretilConfig): Promise<FullScripture> {
  const urls = config.urls ?? [`${GRETIL_BASE}/${config.filename}`];
  log(`Fetching ${config.title} from GRETIL...`);

  const chapters: FullChapter[] = [];
  let totalVerses = 0;

  for (const url of urls) {
    const text = normalizeGretilText(await fetchText(url));
    const detectedAbbrev = detectAbbrev(text);
    if (detectedAbbrev && detectedAbbrev !== config.abbrev) {
      log(`  Auto-detected abbreviation: ${detectedAbbrev} (configured: ${config.abbrev})`);
    }

    const parsed = parseGretilText(text, config.abbrev);
    const offset = chapters.length;
    for (const chapter of parsed.chapters) {
      chapters.push({
        ...chapter,
        number: offset + chapter.number,
      });
    }
    totalVerses += parsed.totalVerses;
    log(`  ${parsed.chapters.length} chapters · ${parsed.totalVerses} verses · ${url}`);
  }

  return {
    id: config.id,
    title: config.title,
    titleSanskrit: config.titleSanskrit,
    category: config.category,
    source: {
      repo: urls.join(" | "),
      license: "Sanskrit mula - GRETIL plaintext corpus. Digitized by academic contributors; verify reuse terms before redistribution.",
      fetchedAt: new Date().toISOString(),
    },
    totalVerses,
    totalChapters: chapters.length,
    chapters,
  };
}

const CONFIGS: GretilConfig[] = [
  { id: "vishnupurana", title: "Vishnu Purana", titleSanskrit: "विष्णुपुराणम्", category: "purana", filename: "sa_viSNupurANa-crit.txt", abbrev: "ViP" },
  { id: "agnipuran", title: "Agni Purana", titleSanskrit: "अग्निपुराणम्", category: "purana", filename: "sa_agnipurANa.txt", abbrev: "AgnP" },
  { id: "brahmandpuran", title: "Brahmanda Purana", titleSanskrit: "ब्रह्माण्डपुराणम्", category: "purana", filename: "sa_brahmANDapurANa.txt", abbrev: "BrāhP" },
  { id: "brahmapuran", title: "Brahma Purana", titleSanskrit: "ब्रह्मपुराणम्", category: "purana", filename: "sa_brahmapurANa-1-246.txt", abbrev: "BrahmP" },
  { id: "garudpurana", title: "Garuda Purana", titleSanskrit: "गरुडपुराणम्", category: "purana", filename: "sa_garuDapurANa.txt", abbrev: "GarP" },
  { id: "harivanshpuran", title: "Harivamsha Purana", titleSanskrit: "हरिवंशपुराणम्", category: "purana", filename: "sa_harivaMza.txt", abbrev: "HV" },
  { id: "kurmapuran", title: "Kurma Purana", titleSanskrit: "कूर्मपुराणम्", category: "purana", filename: "sa_kUrmapurANa.txt", abbrev: "KurP" },
  { id: "lingapuran", title: "Linga Purana", titleSanskrit: "लिङ्गपुराणम्", category: "purana", filename: "sa_liGgapurANa1-108.txt", abbrev: "LiṅP" },
  { id: "markandeypuran", title: "Markandeya Purana", titleSanskrit: "मार्कण्डेयपुराणम्", category: "purana", filename: "sa_mArkaNDeyapurANa1-93.txt", abbrev: "MārkP" },
  { id: "matsyapuran", title: "Matsya Purana", titleSanskrit: "मत्स्यपुराणम्", category: "purana", filename: "sa_matsyapurANa1-176.txt", abbrev: "MatsP" },
  { id: "naradapuran", title: "Narada Purana", titleSanskrit: "नारदपुराणम्", category: "purana", filename: "sa_nAradapurANa.txt", abbrev: "NāP" },
  { id: "narasimhapuran", title: "Narasimha Purana", titleSanskrit: "नृसिंहपुराणम्", category: "purana", filename: "sa_narasiMhapurANa.txt", abbrev: "NārasP" },
  { id: "skandapuran", title: "Skanda Purana", titleSanskrit: "स्कन्दपुराणम्", category: "purana", filename: "sa_skandapurANa-revAkhaNDa-rks.txt", abbrev: "rks" },
  {
    id: "vamanpuran",
    title: "Vamana Purana",
    titleSanskrit: "वामनपुराणम्",
    category: "purana",
    abbrev: "VāmP",
    urls: [
      "https://gretil.sub.uni-goettingen.de/gretil/1_sanskr/3_purana/vamp__u.htm",
      `${GRETIL_BASE}/sa_vAmanapurANasaromAhAtmya.txt`,
    ],
  },
  { id: "vayupuran", title: "Vayu Purana", titleSanskrit: "वायुपुराणम्", category: "purana", filename: "sa_revAkhANDa-of-the-vAyupurANa-rkv.txt", abbrev: "VāyP" },
];

async function main(): Promise<void> {
  let written = 0;
  let skipped = 0;
  let failed = 0;

  for (const config of CONFIGS) {
    try {
      const scripture = await seedFromGretil(config);
      const existing = existingVerseCount(config.id);
      if (scripture.totalVerses > existing) {
        const outPath = writeScripture(scripture);
        log(`  WROTE ${config.id}: ${existing} -> ${scripture.totalVerses} verses (${outPath})`);
        written++;
      } else {
        log(`  SKIP ${config.id}: existing ${existing} verses >= GRETIL ${scripture.totalVerses}`);
        skipped++;
      }
    } catch (err) {
      log(`  FAIL ${config.id}: ${(err as Error).message}`);
      failed++;
    }
  }

  log(`\nDone: ${written} written · ${skipped} skipped · ${failed} failed`);
  if (failed > 0) process.exit(1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
