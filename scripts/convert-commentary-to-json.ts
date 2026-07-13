/**
 * Publish curated-only hi-commentary JSON for the web/mobile fetch layer.
 * Bulk machine-generated explanations are excluded (same policy as hi-analysis.json).
 *
 *   npm run publish:commentary
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { filterCuratedFragment } from "../data/hi-commentary/publish";

const SRC = path.resolve("data/hi-commentary");
const OUT = path.resolve("public/data/hi-commentary");
const MAX_TOTAL_MB = 15;

async function main(): Promise<void> {
  fs.mkdirSync(OUT, { recursive: true });

  const files = fs
    .readdirSync(SRC)
    .filter(
      (f) =>
        f.endsWith(".ts") &&
        !f.startsWith("_") &&
        f !== "quality.ts" &&
        f !== "publish.ts",
    );

  let totalEntries = 0;
  let totalBytes = 0;
  let skipped = 0;

  for (const file of files.sort()) {
    const name = path.basename(file, ".ts");
    const exportName = `${name}Hi`;
    const mod = await import(pathToFileURL(path.join(SRC, file)).href);
    const fragment = mod[exportName];
    if (!fragment) {
      console.warn(`skip ${file}: no export ${exportName}`);
      continue;
    }

    const curated = filterCuratedFragment(name, fragment);
    const entryCount = Object.keys(curated).length;
    if (entryCount === 0) {
      skipped++;
      const stale = path.join(OUT, `${name}.json`);
      if (fs.existsSync(stale)) fs.unlinkSync(stale);
      continue;
    }

    const json = JSON.stringify(curated);
    fs.writeFileSync(path.join(OUT, `${name}.json`), json);
    totalEntries += entryCount;
    totalBytes += Buffer.byteLength(json);
    console.log(`${name}: ${entryCount} curated entries (${(json.length / 1024).toFixed(1)}KB)`);
  }

  const totalMB = totalBytes / (1024 * 1024);
  console.log(
    `\nPublished ${totalEntries} entries across ${files.length - skipped} files ` +
      `(${(totalBytes / 1024).toFixed(0)}KB total, ${skipped} empty scriptures skipped)`,
  );

  if (totalMB > MAX_TOTAL_MB) {
    console.error(`Published commentary exceeds ${MAX_TOTAL_MB}MB — check curated filter.`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});