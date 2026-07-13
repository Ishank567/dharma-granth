/**
 * Remove machine-generated English science/lifeLesson placeholders from
 * data/hi-commentary/*.ts fragments. Curated Hindi entries are kept.
 *
 *   npx tsx scripts/strip-commentary-boilerplate.ts          # dry-run
 *   npx tsx scripts/strip-commentary-boilerplate.ts --write  # apply
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import type { HiCommentaryFragment } from "../data/hi-commentary/_types";
import {
  isBoilerplateField,
  isCuratedAnalysisField,
  stripBoilerplateEntry,
} from "../data/hi-commentary/quality";

const SRC = path.resolve("data/hi-commentary");
const MANIFEST = path.join(SRC, "curated-manifest.json");
const write = process.argv.includes("--write");

function serializeTemplate(s: string): string {
  return "`" + s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${") + "`";
}

function serializeFragment(exportName: string, fragment: HiCommentaryFragment): string {
  const lines = [
    `import type { HiCommentaryFragment } from './_types';`,
    ``,
    `export const ${exportName}: HiCommentaryFragment = {`,
  ];
  for (const [key, entry] of Object.entries(fragment)) {
    const fields: string[] = [];
    if (entry.explanation) fields.push(`    explanation: ${serializeTemplate(entry.explanation)},`);
    if (entry.science) fields.push(`    science: ${serializeTemplate(entry.science)},`);
    if (entry.lifeLesson) fields.push(`    lifeLesson: ${serializeTemplate(entry.lifeLesson)},`);
    if (fields.length === 0) continue;
    lines.push(`  '${key}': {`);
    lines.push(...fields);
    lines.push(`  },`);
  }
  lines.push(`};`, ``);
  return lines.join("\n");
}

async function main(): Promise<void> {
  const files = fs
    .readdirSync(SRC)
    .filter((f) => f.endsWith(".ts") && !f.startsWith("_") && f !== "quality.ts");

  let totalStripped = 0;
  let filesChanged = 0;
  const curatedManifest: Record<string, { science?: boolean; lifeLesson?: boolean }> = {};

  for (const file of files.sort()) {
    const name = path.basename(file, ".ts");
    const exportName = `${name}Hi`;
    const filePath = path.join(SRC, file);
    const mod = await import(pathToFileURL(filePath).href);
    const fragment = mod[exportName] as HiCommentaryFragment | undefined;
    if (!fragment) {
      console.warn(`skip ${file}: no export ${exportName}`);
      continue;
    }

    let strippedInFile = 0;
    const cleaned: HiCommentaryFragment = {};

    for (const [key, entry] of Object.entries(fragment)) {
      const before = entry.science || entry.lifeLesson;
      const next = stripBoilerplateEntry(entry);
      if (!next.explanation && !next.science && !next.lifeLesson) continue;
      cleaned[key] = next;

      if (isBoilerplateField(entry.science)) strippedInFile++;
      if (isBoilerplateField(entry.lifeLesson)) strippedInFile++;

      const manifestKey = `${name}:${key}`;
      if (isCuratedAnalysisField(entry.science) || isCuratedAnalysisField(entry.lifeLesson)) {
        curatedManifest[manifestKey] = {
          ...(isCuratedAnalysisField(entry.science) ? { science: true } : {}),
          ...(isCuratedAnalysisField(entry.lifeLesson) ? { lifeLesson: true } : {}),
        };
      }

      void before;
    }

    if (strippedInFile > 0) {
      filesChanged++;
      totalStripped += strippedInFile;
      console.log(`${name}: stripped ${strippedInFile} placeholder field(s)`);
      if (write) {
        fs.writeFileSync(filePath, serializeFragment(exportName, cleaned), "utf8");
      }
    }
  }

  console.log(
    `\n${write ? "Applied" : "Dry-run"}: ${totalStripped} placeholder fields across ${filesChanged} files`,
  );

  if (write) {
    fs.writeFileSync(
      MANIFEST,
      JSON.stringify({ generatedAt: new Date().toISOString(), entries: curatedManifest }, null, 2),
      "utf8",
    );
    console.log(`Wrote ${Object.keys(curatedManifest).length} curated keys → ${MANIFEST}`);
  } else if (totalStripped > 0) {
    console.log("Re-run with --write to apply.");
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});