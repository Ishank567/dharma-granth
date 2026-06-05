/**
 * P2 data fix — remove GRETIL header-artifact verses.
 *
 * Some Upanishad/sutra files ingested their source's metadata lines as fake
 * "verses": title lines (".. Jabala Upanishad ..##", ".. jAbAlopaniShat
 * ..##\endtitles ##") and bare section markers (".. 8..", ".. 18.."). They are
 * not scripture and shouldn't appear in the reader. This removes them and
 * decrements each file's `totalVerses`.
 *
 * The artifact pattern is deliberately precise and is the SAME one used by
 * scripts/migrate-romanize-to-devanagari.ts (which skips these so they stay
 * recognisable for removal here). It must NOT match real verses — in
 * particular harivanshpuran verses that merely begin with "..", or the mangled
 * mixed-script chapter-title lines in some Puranas (those are a separate issue;
 * they don't match this pattern).
 *
 * Usage:
 *   tsx scripts/strip-header-artifacts.ts            # dry run (lists removals)
 *   tsx scripts/strip-header-artifacts.ts --write    # apply in place
 *
 * Git is the backup — review the diff before committing.
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "data",
  "scriptures-full"
);

const WRITE = process.argv.includes("--write");

// Pure-metadata artifacts: Upanishad title lines, bare ".. N.." section
// markers, and \endtitles. Kept identical to the P0 migration script.
const ARTIFACT = /[ou]panisha[dt]\s*\.\.|^\s*\.\.\s*\d+\s*\.\.|endtitles/i;

interface Verse {
  number?: number | string;
  sanskrit?: string;
  [k: string]: unknown;
}
interface Scripture {
  id: string;
  totalVerses?: number;
  chapters: { number?: number; verses: Verse[] }[];
  [k: string]: unknown;
}

let filesChanged = 0;
let versesRemoved = 0;

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".json")).sort()) {
  const path = join(DIR, file);
  const doc = JSON.parse(readFileSync(path, "utf-8")) as Scripture;

  const removed: string[] = [];
  for (const c of doc.chapters) {
    const kept = c.verses.filter((v) => {
      const hit = ARTIFACT.test(v.sanskrit ?? "");
      if (hit) {
        removed.push(
          `      ch${c.number} v${v.number}: ${JSON.stringify(
            (v.sanskrit ?? "").slice(0, 50)
          )}`
        );
      }
      return !hit;
    });
    c.verses = kept;
  }

  if (removed.length) {
    filesChanged++;
    versesRemoved += removed.length;
    if (typeof doc.totalVerses === "number") doc.totalVerses -= removed.length;
    console.log(`  ${doc.id} — removing ${removed.length}:`);
    console.log(removed.join("\n"));
    if (WRITE) writeFileSync(path, JSON.stringify(doc, null, 2) + "\n", "utf-8");
  }
}

console.log(
  `\n${WRITE ? "Removed" : "[dry run] Would remove"} ${versesRemoved} ` +
    `artifact verses across ${filesChanged} files.` +
    (WRITE ? "" : "\nRe-run with --write to apply.")
);
