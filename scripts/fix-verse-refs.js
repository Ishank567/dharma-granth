const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "..", "public", "data", "scriptures-full");
const dryRun = process.argv.includes("--dry-run") || process.argv.includes("-d");

const files = fs
  .readdirSync(baseDir)
  .filter((f) => f.endsWith(".json"))
  .sort();

let totalFilesChanged = 0;
let totalVersesRenumbered = 0;
let totalShivpuranaFixed = 0;

for (const file of files) {
  const filePath = path.join(baseDir, file);
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const id = data.id || file.replace(".json", "");
  let changed = false;
  let renumbered = 0;

  for (const ch of data.chapters || []) {
    const seen = new Map();
    for (const v of ch.verses || []) {
      const ref = `${ch.number}:${v.number}`;
      const count = (seen.get(ref) || 0) + 1;
      seen.set(ref, count);
      if (count > 1) {
        const original = v.number;
        v.number = `${original}-${count}`;
        renumbered++;
        changed = true;
      }
    }
  }

  // Fix totalVerses when it is greater than the actual loaded verse count.
  const loadedCount = (data.chapters || []).reduce(
    (sum, ch) => sum + (ch.verses || []).length,
    0
  );
  if (typeof data.totalVerses === "number" && data.totalVerses > loadedCount) {
    const oldTotal = data.totalVerses;
    const diff = oldTotal - loadedCount;
    if (!dryRun) {
      data.totalVerses = loadedCount;
    }
    changed = true;
    totalShivpuranaFixed += diff;
    console.log(`${id}: adjusted totalVerses ${oldTotal} -> ${loadedCount} (${diff} fewer)`);
  }

  if (changed) {
    totalFilesChanged++;
    totalVersesRenumbered += renumbered;
    if (!dryRun) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n", "utf8");
    }
    if (renumbered > 0) {
      console.log(`${id}: renumbered ${renumbered} duplicate verse${renumbered === 1 ? "" : "s"}`);
    }
  }
}

console.log("");
console.log(dryRun ? "DRY RUN — no files modified" : "DONE");
console.log(`Files affected: ${totalFilesChanged}`);
console.log(`Duplicate verses renumbered: ${totalVersesRenumbered}`);
console.log(`totalVerses corrected: ${totalShivpuranaFixed}`);
