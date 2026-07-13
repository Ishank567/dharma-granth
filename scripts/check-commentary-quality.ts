/**
 * Fail if hi-commentary fragments still contain English boilerplate.
 * Run: npm run check:commentary
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { HiCommentaryFragment } from "../data/hi-commentary/_types";
import { isBoilerplateField } from "../data/hi-commentary/quality";

const SRC = path.resolve("data/hi-commentary");

async function main(): Promise<void> {
  const files = fs
    .readdirSync(SRC)
    .filter((f) => f.endsWith(".ts") && !f.startsWith("_") && f !== "quality.ts");

  let violations = 0;

  for (const file of files.sort()) {
    const name = path.basename(file, ".ts");
    const exportName = `${name}Hi`;
    const mod = await import(pathToFileURL(path.join(SRC, file)).href);
    const fragment = mod[exportName] as HiCommentaryFragment | undefined;
    if (!fragment) continue;

    for (const [key, entry] of Object.entries(fragment)) {
      if (isBoilerplateField(entry.science)) {
        console.error(`✗ ${name}:${key} science is English boilerplate`);
        violations++;
      }
      if (isBoilerplateField(entry.lifeLesson)) {
        console.error(`✗ ${name}:${key} lifeLesson is English boilerplate`);
        violations++;
      }
    }
  }

  if (violations > 0) {
    console.error(`\n${violations} boilerplate field(s) remain — run npm run strip:commentary-boilerplate`);
    process.exit(1);
  }
  console.log(`✓ Commentary quality check passed (${files.length} fragments).`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});