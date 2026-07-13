/**
 * Split full-book scriptures-full JSON into per-chapter shards for faster
 * chapter-page loads. Output: public/data/scriptures-full/{id}/ch-{n}.json
 *
 *   npm run shard:scriptures
 *   npm run shard:scriptures -- --write   (default)
 *   npm run shard:scriptures -- --dry-run
 */
import fs from "node:fs";
import path from "node:path";

const SRC = path.resolve("public/data/scriptures-full");
const DRY = process.argv.includes("--dry-run");

interface ChapterShard {
  id: string;
  chapter: {
    number: number;
    title?: string;
    titleSanskrit?: string;
    summary?: string;
    verses: unknown[];
  };
  source?: unknown;
}

function main(): void {
  const files = fs.readdirSync(SRC).filter((f) => f.endsWith(".json"));
  let totalShards = 0;
  let totalBytes = 0;

  for (const file of files.sort()) {
    const id = path.basename(file, ".json");
    const bookPath = path.join(SRC, file);
    const book = JSON.parse(fs.readFileSync(bookPath, "utf8")) as {
      id?: string;
      source?: unknown;
      chapters?: Array<{
        number: number | string;
        title?: string;
        titleSanskrit?: string;
        summary?: string;
        verses?: unknown[];
      }>;
    };

    const outDir = path.join(SRC, id);
    if (!DRY) fs.mkdirSync(outDir, { recursive: true });

    let shardBytes = 0;
    for (const ch of book.chapters ?? []) {
      const num = typeof ch.number === "number" ? ch.number : Number(ch.number);
      if (!Number.isFinite(num)) continue;

      const shard: ChapterShard = {
        id,
        chapter: {
          number: num,
          title: ch.title,
          titleSanskrit: ch.titleSanskrit,
          summary: ch.summary,
          verses: ch.verses ?? [],
        },
        source: book.source,
      };
      const json = JSON.stringify(shard);
      shardBytes += Buffer.byteLength(json);
      totalShards++;
      if (!DRY) {
        fs.writeFileSync(path.join(outDir, `ch-${num}.json`), json);
      }
    }
    totalBytes += shardBytes;
    console.log(
      `${id}: ${book.chapters?.length ?? 0} chapters → ${(shardBytes / 1024).toFixed(0)}KB shards`,
    );
  }

  console.log(
    `\n${DRY ? "Dry-run" : "Wrote"} ${totalShards} chapter shards (${(totalBytes / 1024 / 1024).toFixed(1)}MB total)`,
  );
}

main();