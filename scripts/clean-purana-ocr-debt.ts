/**
 * Clean OCR debris and garbled Sanskrit artifacts from Vamana and Narasimha Puranas.
 *
 * Scans English translations in:
 *   - public/data/scriptures-full/vamanpuran.json
 *   - public/data/scriptures-full/narasimhapuran.json
 *
 * For verses where English text is mixed with OCR-scanned Sanskrit shlokas,
 * strips the OCR garbage prefix, suffix, and internal debris.
 * For verses where the "translation" is 100% pure OCR ASCII noise (0 valid English sentences),
 * deletes the field so the reader cleanly displays Sanskrit + Hindi.
 *
 * Run:
 *   npx tsx scripts/clean-purana-ocr-debt.ts          # Dry run
 *   npx tsx scripts/clean-purana-ocr-debt.ts --write  # Apply changes
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { FullScripture, FullVerse } from "./lib/scripture-schema";

const ROOT = resolve(__dirname, "..");
const WRITE = process.argv.includes("--write");

const TARGET_FILES = ["vamanpuran.json", "narasimhapuran.json"];

// Build comprehensive English dictionary from clean scriptures
function buildCorpusDictionary(): Set<string> {
  const dict = new Set<string>();
  const sourceFiles = [
    "bhagavadgita.json",
    "ramayana.json",
    "mahabharata.json",
    "durgasaptashati.json",
    "brahmapuran.json",
    "shivpurana.json",
  ];

  for (const f of sourceFiles) {
    const p = resolve(ROOT, "public/data/scriptures-full", f);
    try {
      const doc = JSON.parse(readFileSync(p, "utf8")) as FullScripture;
      for (const ch of doc.chapters || []) {
        for (const v of ch.verses || []) {
          for (const w of (v.translation || "").toLowerCase().match(/[a-z]{2,}/g) || []) {
            dict.add(w);
          }
        }
      }
    } catch {
      // ignore
    }
  }

  // Common epic/Purana names and vocabulary
  const extraWords = [
    "a", "i", "o", "oh", "pulastya", "janamejaya", "vaisampayana", "suta",
    "sanatkumara", "narada", "markandeya", "narasimha", "yama", "yami",
    "bahuputra", "angira", "krsasva", "kasyapa", "uninvited", "kapali",
    "kapall", "satl", "sati", "virabhadra", "jaya", "daksa", "prajapati",
    "sankara", "shiva", "rudra", "dhundhu", "hiranyakasipu", "vyasana",
    "trivikrama", "prahlada", "andhaka", "sukra", "bali", "vamana",
    "sukadeva", "parashara", "maitreya", "vyasa", "brahma", "vishnu",
    "indra", "varuna", "vayu", "surya", "chandra", "agni", "asura",
    "daitya", "danava", "rakshasa", "gandharva", "kinnara", "yaksha",
    "naga", "apsaras", "rishi", "muni", "sadhu", "brahmin", "brahmana",
    "kshatriya", "vaishya", "shudra", "ashrama", "varna", "dharma",
    "karma", "moksha", "samsara", "yajna", "homa", "mantra", "stotra",
    "tirtha", "khanda", "adhyaya", "purana", "upanishad", "smriti",
  ];
  for (const w of extraWords) dict.add(w);

  return dict;
}

const DICT = buildCorpusDictionary();

function isRecognizedWord(rawWord: string): boolean {
  const w = rawWord.toLowerCase().replace(/^[^a-z]+|[^a-z]+$/g, "");
  if (!w) return false;
  if (w === "a" || w === "i" || w === "o") return true;
  if (DICT.has(w)) return true;
  // check hyphenated components e.g. "cut-off" -> "cut" & "off"
  if (w.includes("-")) {
    const parts = w.split("-");
    if (parts.every((p) => DICT.has(p) || p.length > 2)) return true;
  }
  return false;
}

function isTitleCase(word: string): boolean {
  if (word === "I" || word === "A" || word === "O") return true;
  if (!/^[A-Z][a-z]{1,25}$/.test(word)) return false;
  return /[aeiouy]/.test(word);
}

function isSentenceStarter(rawToken: string): boolean {
  if (!rawToken) return false;
  if (/[\^\~\|\»\«\■\£\¤\\\/]/.test(rawToken)) return false;
  const w = rawToken.replace(/^[^a-zA-Z]+|[^a-zA-Z]+$/g, "");
  if (!w) return false;
  if (isRecognizedWord(w)) return /^[A-Z]/.test(w);
  return isTitleCase(w);
}

export function cleanOcrTranslation(text?: string): string | undefined {
  if (!text) return undefined;
  const raw = text.trim();
  if (raw.length < 5) return undefined;

  // 1. If text has fewer than 4 recognized English words, it's pure OCR garbage
  const words = (raw.toLowerCase().match(/[a-z]{2,}/g) || []).filter(isRecognizedWord);
  if (words.length < 4) return undefined;

  let s = raw.replace(/<\/?[a-z][^>]*>/gi, "");
  const tokens = s.split(/\s+/);

  // 2. Find start of actual English text
  let startIdx = -1;
  for (let i = 0; i < tokens.length; i++) {
    if (isSentenceStarter(tokens[i])) {
      let valid = 0;
      for (let j = i; j < Math.min(tokens.length, i + 5); j++) {
        if (isRecognizedWord(tokens[j]) && !/[\^\~\|\»\«\■\£\¤]/.test(tokens[j])) {
          valid++;
        }
      }
      if (valid >= 2) {
        startIdx = i;
        break;
      }
    }
  }

  // Fallback: if no TitleCase starter was found, look for first recognized word in valid cluster
  if (startIdx === -1) {
    for (let i = 0; i < tokens.length; i++) {
      if (isRecognizedWord(tokens[i]) && !/[\^\~\|\»\«\■\£\¤]/.test(tokens[i])) {
        let valid = 0;
        for (let j = i; j < Math.min(tokens.length, i + 4); j++) {
          if (isRecognizedWord(tokens[j])) valid++;
        }
        if (valid >= 3) {
          startIdx = i;
          break;
        }
      }
    }
  }

  if (startIdx === -1) return undefined;

  // 3. Find end of actual English text
  let endIdx = tokens.length - 1;
  for (let i = tokens.length - 1; i >= startIdx; i--) {
    const rawTok = tokens[i];
    if (isRecognizedWord(rawTok) && !/[\^\~\|\»\«\■\£\¤]/.test(rawTok)) {
      let valid = 0;
      for (let j = Math.max(startIdx, i - 3); j <= i; j++) {
        if (isRecognizedWord(tokens[j]) && !/[\^\~\|\»\«\■\£\¤]/.test(tokens[j])) valid++;
      }
      if (valid >= 2 || (i - startIdx < 2 && valid > 0)) {
        endIdx = i;
        break;
      }
    }
  }

  if (endIdx < startIdx) return undefined;

  const slice = tokens.slice(startIdx, endIdx + 1);

  // 4. Filter internal Sanskrit OCR tokens
  const filtered = slice.filter((t) => {
    if (/[\u0900-\u097F■«»¿¤£\\~\|]/.test(t)) return false;
    if (/\|\||:\s*\|\||:\s*ll/.test(t)) return false;
    if (/\^[A-Za-z0-9]/.test(t) && !/hira\^y/i.test(t)) return false;
    const letters = t.replace(/[^a-zA-Z]/g, "");
    if (letters.length >= 4 && !/[aeiouyAEIOUY]/.test(letters)) return false;
    if (/[a-z][A-Z]/.test(letters)) return false;
    return true;
  });

  let res = filtered.join(" ").trim();
  res = res.replace(/^[#*■~^£¤\s\d\|\»\«\-\:\.\,]+/, "");
  res = res.replace(/[#*■~^£¤\|\»\«\-\:\,]+$/, "");
  res = res.replace(/\s+/g, " ").trim();

  // Final check: must have at least 4 recognized words and not be pure noise
  const finalWords = (res.toLowerCase().match(/[a-z]{2,}/g) || []).filter(isRecognizedWord);
  if (finalWords.length < 4) return undefined;

  return res;
}

function processScripture(file: string): void {
  const filePath = resolve(ROOT, "public/data/scriptures-full", file);
  const scripture = JSON.parse(readFileSync(filePath, "utf8")) as FullScripture;

  let totalVerses = 0;
  let cleanedVerses = 0;
  let droppedVerses = 0;
  let unchangedVerses = 0;

  for (const chapter of scripture.chapters || []) {
    for (const verse of chapter.verses || []) {
      totalVerses++;
      const orig = verse.translation;
      if (!orig) {
        unchangedVerses++;
        continue;
      }

      const cleaned = cleanOcrTranslation(orig);
      if (!cleaned) {
        // Pure garbage dropped
        delete verse.translation;
        droppedVerses++;
      } else if (cleaned !== orig) {
        verse.translation = cleaned;
        cleanedVerses++;
      } else {
        unchangedVerses++;
      }
    }
  }

  console.log(`\n=== ${file} ===`);
  console.log(`Total verses:     ${totalVerses}`);
  console.log(`Cleaned (debris): ${cleanedVerses}`);
  console.log(`Dropped (garbage):${droppedVerses}`);
  console.log(`Unchanged:        ${unchangedVerses}`);

  if (WRITE) {
    writeFileSync(filePath, JSON.stringify(scripture, null, 2) + "\n", "utf8");
    console.log(`✓ Wrote cleaned ${file}`);
  }
}

function main(): void {
  console.log(`Corpus dictionary: ${DICT.size} words loaded.`);
  console.log(`Mode: ${WRITE ? "WRITE (changes applied)" : "DRY RUN (--write to apply)"}`);

  for (const file of TARGET_FILES) {
    processScripture(file);
  }
}

main();
