/**
 * Shrink auto-seeded reading notes so large scripture JSON stays under GitHub's
 * 100MB file limit. Targets verses whose commentary begins with "Plain sense".
 *
 * - Keeps one short English sense for both wordMeaning + commentary
 * - Removes duplicate explanation when it only mirrored commentary
 * - Caps body length (default 280 chars)
 *
 * Usage:
 *   npx tsx scripts/compact-reading-notes.ts                 # dry-run
 *   npx tsx scripts/compact-reading-notes.ts --write
 *   npx tsx scripts/compact-reading-notes.ts mahabharata --write
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIR = resolve(ROOT, "public/data/scriptures-full");
const WRITE = process.argv.includes("--write");
const MAX = Number(
  process.argv.find((a) => a.startsWith("--max="))?.split("=")[1] || 280,
);
const targets = process.argv
  .slice(2)
  .filter((a) => !a.startsWith("--"))
  .map((a) => a.replace(/\.json$/, ""));

function trunc(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  const cut = t.slice(0, max - 1);
  const last = Math.max(cut.lastIndexOf(". "), cut.lastIndexOf("; "), cut.lastIndexOf(", "));
  const body = (last > 80 ? cut.slice(0, last + 1) : cut).trim();
  return body.endsWith("…") ? body : `${body}…`;
}

function stripLead(text: string): string {
  return text
    .replace(
      /^Plain sense of this [^:]+:\s*/i,
      "",
    )
    .replace(/^Sense:\s*/i, "")
    .trim();
}

function processFile(file: string): { touched: number; bytesBefore: number; bytesAfter: number } {
  const path = resolve(DIR, file);
  const raw = readFileSync(path, "utf8");
  const bytesBefore = Buffer.byteLength(raw, "utf8");
  const doc = JSON.parse(raw) as {
    chapters: {
      verses: {
        commentary?: string;
        explanation?: string;
        wordMeaning?: string;
        translation?: string;
      }[];
    }[];
  };

  let touched = 0;
  for (const ch of doc.chapters || []) {
    for (const v of ch.verses || []) {
      const c = (v.commentary || "").trim();
      const e = (v.explanation || "").trim();
      const isAuto =
        /^Plain sense of this /i.test(c) ||
        /^Sense:/i.test(c) ||
        (/^Plain sense of this /i.test(e) && !c);

      if (!isAuto && !(e && e === c && c.length > 200)) continue;

      const source = stripLead(c || e || v.wordMeaning || v.translation || "");
      if (source.length < 8) continue;

      const short = trunc(source, MAX);
      const note = `Sense: ${short}`;
      v.wordMeaning = short;
      v.commentary = note;
      // Drop duplicate explanation to save space (UI falls back to commentary)
      if (v.explanation && (v.explanation === e || /^Plain sense|^Sense:/i.test(v.explanation))) {
        delete v.explanation;
      }
      touched++;
    }
  }

  const out = JSON.stringify(doc, null, 2) + "\n";
  const bytesAfter = Buffer.byteLength(out, "utf8");
  if (WRITE) writeFileSync(path, out, "utf8");
  return { touched, bytesBefore, bytesAfter };
}

const files = (
  targets.length
    ? targets.map((id) => `${id}.json`)
    : readdirSync(DIR).filter((f) => f.endsWith(".json"))
).sort();

let saved = 0;
for (const file of files) {
  const r = processFile(file);
  if (!r.touched) continue;
  const delta = r.bytesBefore - r.bytesAfter;
  saved += delta;
  console.log(
    `${file}: ${r.touched} notes → ${(r.bytesAfter / 1e6).toFixed(2)}MB ` +
      `(${delta >= 0 ? "-" : "+"}${Math.abs(delta / 1e6).toFixed(2)}MB)` +
      (WRITE ? "" : " dry-run"),
  );
}
console.log(
  `\nTotal saved ~${(saved / 1e6).toFixed(2)}MB${WRITE ? "" : " (dry-run — re-run with --write)"}`,
);
