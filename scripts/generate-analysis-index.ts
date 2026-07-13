/**
 * Build a tiny analysis index for mobile Home/Browse badges (~50KB vs 2.7MB).
 * Run after generate-hi-analysis.ts:
 *   npm run generate:hi-analysis && npm run generate:analysis-index
 */
import fs from "node:fs";
import path from "node:path";

const INPUT = path.resolve("hi-analysis.json");
const OUTPUT = path.resolve("../dharma-granth-mobile/data/analysis-index.json");

function main(): void {
  if (!fs.existsSync(INPUT)) {
    console.error(`Missing ${INPUT} — run npm run generate:hi-analysis first.`);
    process.exit(1);
  }

  const table = JSON.parse(fs.readFileSync(INPUT, "utf8")) as Record<string, unknown>;
  const verseKeys = Object.keys(table);
  const byScripture: Record<string, number> = {};

  for (const key of verseKeys) {
    const id = key.split(":")[0];
    byScripture[id] = (byScripture[id] ?? 0) + 1;
  }

  const index = {
    generatedAt: new Date().toISOString(),
    total: verseKeys.length,
    byScripture,
    verseKeys,
  };

  fs.writeFileSync(OUTPUT, JSON.stringify(index));
  const kb = fs.statSync(OUTPUT).size / 1024;
  console.log(`analysis-index: ${verseKeys.length} keys → ${OUTPUT} (${kb.toFixed(0)}KB)`);
}

main();