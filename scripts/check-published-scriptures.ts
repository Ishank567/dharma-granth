/** Fail CI when published scripture fields contain source-page artifacts. */
import { readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { FullScripture } from "./lib/scripture-schema";
import { translationQualityIssue } from "./lib/translation-quality";

const ROOT = resolve(__dirname, "..");
const FULL_DIR = resolve(ROOT, "public/data/scriptures-full");
const failures: string[] = [];
// Start strict validation with the scripture repaired by this workflow. The
// older OCR imports contain known debt that should be cleaned scripture by
// scripture instead of making the existing build permanently red.
const STRICT_SCRIPTURES = new Set(["durgasaptashati"]);

for (const file of readdirSync(FULL_DIR).filter((name) => name.endsWith(".json")).sort()) {
  const scripture = JSON.parse(
    readFileSync(resolve(FULL_DIR, file), "utf8"),
  ) as FullScripture;
  const refs = new Set<string>();
  const strict = STRICT_SCRIPTURES.has(scripture.id);

  for (const chapter of scripture.chapters ?? []) {
    for (const verse of chapter.verses ?? []) {
      const ref = `${scripture.id}:${chapter.number}:${verse.number}`;
      if (refs.has(ref)) failures.push(`${ref} — duplicate verse reference`);
      refs.add(ref);

      if (!verse.sanskrit?.trim()) failures.push(`${ref} — missing Sanskrit`);
      const issue = translationQualityIssue(verse.translation, verse.sanskrit);
      if (strict && issue) failures.push(`${ref} — ${issue}`);

      for (const [field, value] of strict ? [
        ["hindi", verse.hindi],
        ["commentary", verse.commentary],
        ["explanation", verse.explanation],
        ["wordMeaning", verse.wordMeaning],
      ] as const : []) {
        if (value && /\uFFFD|\?{3,}/.test(value)) {
          failures.push(`${ref} — ${field} has encoding corruption`);
        }
      }
    }
  }
}

if (failures.length) {
  console.error(`Published scripture quality check failed (${failures.length}):`);
  for (const failure of failures.slice(0, 100)) console.error(`  - ${failure}`);
  if (failures.length > 100) console.error(`  - ... and ${failures.length - 100} more`);
  process.exit(1);
}

console.log(
  `✓ Published scripture quality check passed (strict: ${[...STRICT_SCRIPTURES].join(", ")}).`,
);
