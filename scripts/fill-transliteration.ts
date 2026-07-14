/**
 * Fill empty `transliteration` fields from Devanagari `sanskrit` via Sanscript (IAST).
 *
 * Only writes when:
 *   - transliteration is blank, and
 *   - sanskrit has Devanagari characters
 *
 * Vedic accent marks are stripped for cleaner IAST (optional keep with --keep-accents).
 *
 * Usage:
 *   npx tsx scripts/fill-transliteration.ts                 # dry run all
 *   npx tsx scripts/fill-transliteration.ts --write
 *   npx tsx scripts/fill-transliteration.ts yajurveda atharvaveda --write
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import Sanscript from "@indic-transliteration/sanscript";

const DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "data",
  "scriptures-full",
);

const WRITE = process.argv.includes("--write");
const KEEP_ACCENTS = process.argv.includes("--keep-accents");
const targets = process.argv
  .slice(2)
  .filter((a) => !a.startsWith("--"))
  .map((a) => a.replace(/\.json$/, ""));

const HAS_DEV = /[\u0900-\u097F]/;
const VEDIC_ACCENTS = /[\u0951\u0952\u0953\u0954\u1CD0-\u1CFF\uA8E0-\uA8FF]/g;

interface Verse {
  number?: number | string;
  sanskrit?: string;
  transliteration?: string;
  [k: string]: unknown;
}

function isBlank(v?: string): boolean {
  return !v || !String(v).trim();
}

function toIast(sanskrit: string): string {
  let src = sanskrit;
  if (!KEEP_ACCENTS) {
    src = src.replace(VEDIC_ACCENTS, "");
  }
  // Normalize common punctuation that confuses the converter
  src = src.replace(/["'“”]/g, "").trim();
  try {
    return Sanscript.t(src, "devanagari", "iast").replace(/\s+/g, " ").trim();
  } catch {
    return "";
  }
}

function processFile(file: string): { filled: number; skipped: number } {
  const path = join(DIR, file);
  const doc = JSON.parse(readFileSync(path, "utf8")) as {
    id?: string;
    chapters: { verses: Verse[] }[];
  };
  let filled = 0;
  let skipped = 0;

  for (const ch of doc.chapters || []) {
    for (const v of ch.verses || []) {
      if (!isBlank(v.transliteration)) {
        skipped++;
        continue;
      }
      const sa = v.sanskrit || "";
      if (!HAS_DEV.test(sa)) {
        skipped++;
        continue;
      }
      const iast = toIast(sa);
      if (!iast || iast.length < 2) {
        skipped++;
        continue;
      }
      v.transliteration = iast;
      filled++;
    }
  }

  if (WRITE && filled > 0) {
    writeFileSync(path, JSON.stringify(doc, null, 2) + "\n", "utf8");
  }
  return { filled, skipped };
}

const files = (
  targets.length
    ? targets.map((id) => `${id}.json`)
    : readdirSync(DIR).filter((f) => f.endsWith(".json"))
).sort();

let totalFilled = 0;
for (const file of files) {
  const { filled, skipped } = processFile(file);
  if (filled > 0 || targets.length) {
    console.log(
      `${file}: filled ${filled}${WRITE ? "" : " (dry-run)"}, kept ${skipped}`,
    );
  }
  totalFilled += filled;
}
console.log(
  `\nTotal filled: ${totalFilled}${WRITE ? "" : " (dry-run — re-run with --write)"}`,
);
