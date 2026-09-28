/**
 * Apply machine translations to verses that have neither English nor Hindi.
 *
 * Reads every `*.tsv` in scripts/cache/ai-translations/ (one
 * `scripture:chapter:verse<TAB>translation` per line), sets `translation`,
 * and marks the verse `translationSource: "ai"` so the reader labels it.
 * Verses that already have a translation are never overwritten.
 *
 *   npx tsx scripts/apply-ai-translations.ts          (dry-run)
 *   npx tsx scripts/apply-ai-translations.ts --write
 *   npm run shard:scriptures   (afterwards, to refresh ch-*.json shards)
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import type { FullScripture } from "./lib/scripture-schema";

const ROOT = resolve(__dirname, "..");
const FULL_DIR = join(ROOT, "public", "data", "scriptures-full");
const CACHE_DIR = join(ROOT, "scripts", "cache", "ai-translations");
const WRITE = process.argv.includes("--write");

function loadTranslations(): Map<string, Map<string, string>> {
  const byScripture = new Map<string, Map<string, string>>();
  for (const file of readdirSync(CACHE_DIR).filter((f) => f.endsWith(".tsv")).sort()) {
    for (const line of readFileSync(join(CACHE_DIR, file), "utf8").split(/\r?\n/)) {
      const tab = line.indexOf("\t");
      if (tab < 0) continue;
      const ref = line.slice(0, tab).trim();
      const text = line.slice(tab + 1).trim();
      if (!ref || !text) continue;
      const id = ref.split(":", 1)[0];
      if (!byScripture.has(id)) byScripture.set(id, new Map());
      byScripture.get(id)!.set(ref, text);
    }
  }
  return byScripture;
}

function main(): void {
  const translations = loadTranslations();
  let total = 0;
  let unmatched = 0;

  for (const [id, refs] of translations) {
    const path = join(FULL_DIR, `${id}.json`);
    const doc = JSON.parse(readFileSync(path, "utf8")) as FullScripture;
    const seen = new Set<string>();
    let applied = 0;

    for (const ch of doc.chapters) {
      for (const v of ch.verses) {
        const ref = `${id}:${ch.number}:${v.number}`;
        const text = refs.get(ref);
        if (!text) continue;
        seen.add(ref);
        if (v.translation?.trim()) continue;
        v.translation = text;
        v.translationSource = "ai";
        applied++;
      }
    }

    const missing = refs.size - seen.size;
    unmatched += missing;
    total += applied;
    console.log(`${id}: applied ${applied}${missing ? `, ${missing} refs not found` : ""}`);
    if (WRITE && applied) {
      writeFileSync(path, JSON.stringify(doc, null, 2) + "\n", "utf8");
    }
  }

  console.log(
    `\n${WRITE ? "Applied" : "Would apply"} ${total} AI translations` +
      `${unmatched ? ` (${unmatched} refs not found)` : ""}.`,
  );
}

main();
