/**
 * Fill empty English `commentary` + `wordMeaning` from existing public-domain
 * translations already stored on each verse.
 *
 * This does NOT invent new philosophy or machine-translate Sanskrit. It turns
 * the PD English rendering into a plain reading note so the verse UI can show
 * an English explanation where only translation existed before.
 *
 * Usage:
 *   npx tsx scripts/seed-reading-notes-from-translation.ts chandogya --write
 *   npx tsx scripts/seed-reading-notes-from-translation.ts chandogya brihadaranyaka viduraniti durgasaptashati --write
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { hasTranslation } from "./lib/sbe-parser";
import type { FullScripture } from "./lib/scripture-schema";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = resolve(ROOT, "public/data/scriptures-full");
const WRITE = process.argv.includes("--write");
const targets = process.argv
  .slice(2)
  .filter((a) => !a.startsWith("--"))
  .map((a) => a.replace(/\.json$/, ""));

if (!targets.length) {
  console.error(
    "Usage: npx tsx scripts/seed-reading-notes-from-translation.ts <id...> [--write]",
  );
  process.exit(1);
}

const BOILERPLATE = [
  /The Upanishads,\s*Part\s*\d+\s*\(SBE\d+\)[^.]*(?:at sacred-texts\.com)?\.?/gi,
  /by Max M[üu]ller,?\s*\[[\d,\s]+\][^.]*\.?/gi,
  /at sacred-texts\.com\.?/gi,
  /Sacred Texts\s+Hinduism\s+Index[^.]*\.?/gi,
  /Buy this Book at Amazon\.com\.?/gi,
  /Previous\s+Next\.?/gi,
  /p\.\s*\d+\.?/gi,
  /\[paragraph continues\]\s*/gi,
  /https?:\/\/\S+/gi,
];

function cleanTranslation(raw: string): string {
  let t = String(raw || "").replace(/\s+/g, " ").trim();
  for (const re of BOILERPLATE) t = t.replace(re, " ");
  t = t.replace(/\s+/g, " ").trim();
  // Drop leading junk punctuation / page crumbs
  t = t.replace(/^[\d.\s,;:-]+/, "").trim();
  // Unescape common HTML entities left in seeds
  t = t
    .replace(/&Acirc;/gi, "Â")
    .replace(/&acirc;/gi, "â")
    .replace(/&icirc;/gi, "î")
    .replace(/&ucirc;/gi, "û")
    .replace(/&eacute;/gi, "é")
    .replace(/&ntilde;/gi, "ñ")
    .replace(/&Ntilde;/gi, "Ñ")
    .replace(/&Sacute;/gi, "Ś")
    .replace(/&sacute;/gi, "ś")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&[a-z]+;/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  // Pure sacred-texts header with no real verse body left
  if (/^the upanishads,?\s*part/i.test(t) && t.length < 140) return "";
  return t;
}

function isBlank(v?: string): boolean {
  return !v || !String(v).trim();
}

function trunc(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const last = Math.max(
    cut.lastIndexOf(". "),
    cut.lastIndexOf("; "),
    cut.lastIndexOf(", "),
  );
  const body = (last > 80 ? cut.slice(0, last + 1) : cut).trim();
  return body.endsWith("…") ? body : `${body}…`;
}

function makeWordMeaning(sense: string): string {
  // Keep concise for the meaning panel (and GitHub file-size limits)
  return trunc(sense, 280);
}

function makeCommentary(sense: string, scriptureId: string): string {
  // Light framing only — body is the PD English sense, not original doctrine.
  const lead: Record<string, string> = {
    chandogya:
      "Plain sense of this Chandogya passage (Max Müller, SBE, public domain): ",
    brihadaranyaka:
      "Plain sense of this Brihadaranyaka passage (Max Müller, SBE, public domain): ",
    viduraniti:
      "Plain sense of this Vidura Niti counsel (K.M. Ganguli, public domain): ",
    durgasaptashati:
      "Plain sense of this Devi Mahatmyam verse (F.E. Pargiter, public domain): ",
    manusmriti:
      "Plain sense of this Manusmriti verse (G. Bühler, SBE, public domain): ",
    yajurveda:
      "Plain sense of this Yajur Veda mantra (R.T.H. Griffith, public domain): ",
    atharvaveda:
      "Plain sense of this Atharva Veda mantra (R.T.H. Griffith, public domain): ",
    mahabharata:
      "Plain sense of this Mahabharata verse (K.M. Ganguli, public domain): ",
    markandeypuran:
      "Plain sense of this Markandeya Purana verse (F.E. Pargiter, public domain): ",
    vishnupurana:
      "Plain sense of this Vishnu Purana verse (public-domain English rendering): ",
    harivanshpuran:
      "Plain sense of this Harivamsha verse (M.N. Dutt, public domain): ",
    narasimhapuran:
      "Plain sense of this Narasimha Purana verse (public-domain English rendering): ",
    // Major Puranas seeded from Tagare / Motilal / archive OCR (public domain)
    agnipuran:
      "Plain sense of this Agni Purana verse (public-domain English rendering): ",
    garudpurana:
      "Plain sense of this Garuda Purana verse (public-domain English rendering): ",
    shivpurana:
      "Plain sense of this Shiva Purana verse (public-domain English rendering): ",
    brahmapuran:
      "Plain sense of this Brahma Purana verse (public-domain English rendering): ",
    brahmandpuran:
      "Plain sense of this Brahmanda Purana verse (public-domain English rendering): ",
    naradapuran:
      "Plain sense of this Narada Purana verse (public-domain English rendering): ",
    matsyapuran:
      "Plain sense of this Matsya Purana verse (public-domain English rendering): ",
    vayupuran:
      "Plain sense of this Vayu Purana verse (public-domain English rendering): ",
    lingapuran:
      "Plain sense of this Linga Purana verse (public-domain English rendering): ",
    skandapuran:
      "Plain sense of this Skanda Purana verse (public-domain English rendering): ",
    kurmapuran:
      "Plain sense of this Kurma Purana verse (public-domain English rendering): ",
    vamanpuran:
      "Plain sense of this Vamana Purana verse (public-domain English rendering): ",
  };
  // Short lead keeps large corpora under GitHub's 100MB/file limit.
  if (/^plain sense|^sense:/i.test(sense)) return trunc(sense, 320);
  return `Sense: ${trunc(sense, 280)}`;
}

function processScripture(id: string): {
  filled: number;
  skipped: number;
  cleanedTrans: number;
} {
  const path = resolve(DIR, `${id}.json`);
  const doc = JSON.parse(readFileSync(path, "utf8")) as FullScripture;
  let filled = 0;
  let skipped = 0;
  let cleanedTrans = 0;

  for (const ch of doc.chapters || []) {
    for (const v of ch.verses || []) {
      const cleaned = cleanTranslation(v.translation || "");
      if (hasTranslation(v.translation) && cleaned !== (v.translation || "").trim()) {
        // Clean obvious sacred-texts noise from the translation field itself
        if (cleaned.length >= 12 && WRITE) {
          v.translation = cleaned;
          cleanedTrans++;
        }
      }

      const hasC = !isBlank(v.commentary) || !isBlank(v.explanation);
      const hasW = !isBlank(v.wordMeaning);
      if (hasC && hasW) {
        skipped++;
        continue;
      }

      const sense = cleaned;
      // Allow short dialogic labels ("The king spoke:", "Listen to me, O king.")
      if (!hasTranslation(sense) || sense.length < 12) {
        skipped++;
        continue;
      }

      if (!hasW) {
        v.wordMeaning = makeWordMeaning(sense);
      }
      if (!hasC) {
        // Only commentary (UI falls back here). Skip explanation to avoid 2× storage.
        v.commentary = makeCommentary(sense, id);
      }
      filled++;
    }
  }

  if (WRITE) {
    writeFileSync(path, JSON.stringify(doc, null, 2) + "\n", "utf8");
  }
  return { filled, skipped, cleanedTrans };
}

let totalFilled = 0;
for (const id of targets) {
  const r = processScripture(id);
  totalFilled += r.filled;
  console.log(
    `${id}: filled ${r.filled} reading notes` +
      (r.cleanedTrans ? `, cleaned ${r.cleanedTrans} translations` : "") +
      `, kept ${r.skipped}` +
      (WRITE ? "" : " (dry-run)"),
  );
}
console.log(
  `\nTotal verses updated: ${totalFilled}${WRITE ? "" : " (dry-run — re-run with --write)"}`,
);
