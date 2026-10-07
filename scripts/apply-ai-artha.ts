/**
 * Apply machine-generated Hindi अर्थ + queue व्याख्या/विज्ञान drafts.
 *
 * Reads every `*.json` in scripts/cache/ai-artha/ — an array per file:
 *   { "ref": "scripture:chapter:verse", "hindi": "…", "vyakhya": "…",
 *     "vijnana": "…", "lifeLesson": "…", "confidence": "high|medium|low",
 *     "reviewNote": "…" }
 *
 * For each entry:
 *   - sets `hindi` (and `hindiSource: "ai"`) in scriptures-full when the
 *     verse has no Hindi yet — never overwrites existing Hindi;
 *   - adds a "pending" draft to the review queue data/ai-commentary/<id>.json
 *     (same shape scripts/generate-verse-commentary.ts writes) — never
 *     overwrites an existing queue entry.
 *
 * Nothing is published from here: व्याख्या/विज्ञान go live only after a
 * reviewer sets status "approved" and `npm run publish:commentary` runs.
 *
 *   npx tsx scripts/apply-ai-artha.ts          (dry-run)
 *   npx tsx scripts/apply-ai-artha.ts --write
 *   npm run shard:scriptures   (afterwards, to refresh ch-*.json shards)
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from "node:fs";
import { join, resolve } from "node:path";
import type { FullScripture } from "./lib/scripture-schema";

const ROOT = resolve(__dirname, "..");
const FULL_DIR = join(ROOT, "public", "data", "scriptures-full");
const QUEUE_DIR = join(ROOT, "data", "ai-commentary");
const SRC_DIR = join(ROOT, "scripts", "cache", "ai-artha");
const WRITE = process.argv.includes("--write");
const MODEL = "kimi-subagent";
/** --overwrite-placeholder: replace machine word-swapped Hindi (hindiSource "ai" only). */
const OVERWRITE_PLACEHOLDER = process.argv.includes("--overwrite-placeholder");

function isPlaceholderHindi(v: { hindi?: string; hindiSource?: string }): boolean {
  if (v.hindiSource !== "ai") return false;
  const h = v.hindi ?? "";
  return /के उपदेशानुसार:/.test(h) || /[A-Za-z]{4,}\s+[A-Za-z]{3,}\s+[A-Za-z]{3,}/.test(h);
}

interface ArthaEntry {
  ref: string;
  hindi?: string;
  vyakhya?: string;
  vijnana?: string;
  lifeLesson?: string;
  confidence?: "high" | "medium" | "low";
  reviewNote?: string;
}

interface QueuedCommentary {
  explanation: string;
  science: string;
  lifeLesson: string;
  confidence: string;
  reviewNote: string;
  status: string;
  model: string;
  generatedAt: string;
  sanskrit: string;
}

function loadEntries(): ArthaEntry[] {
  if (!existsSync(SRC_DIR)) return [];
  const out: ArthaEntry[] = [];
  for (const file of readdirSync(SRC_DIR).filter((f) => f.endsWith(".json")).sort()) {
    const arr = JSON.parse(readFileSync(join(SRC_DIR, file), "utf8")) as ArthaEntry[];
    for (const e of arr) if (e?.ref) out.push(e);
  }
  return out;
}

function main(): void {
  const entries = loadEntries();
  const byScripture = new Map<string, ArthaEntry[]>();
  for (const e of entries) {
    const id = e.ref.split(":")[0];
    if (!byScripture.has(id)) byScripture.set(id, []);
    byScripture.get(id)!.push(e);
  }

  let hindiApplied = 0;
  let queued = 0;

  for (const [id, list] of byScripture) {
    const path = join(FULL_DIR, `${id}.json`);
    if (!existsSync(path)) {
      console.warn(`${id}: no scriptures-full JSON — skipped ${list.length} entries`);
      continue;
    }
    const doc = JSON.parse(readFileSync(path, "utf8")) as FullScripture;
    const queueFile = join(QUEUE_DIR, `${id}.json`);
    const queue: Record<string, QueuedCommentary> = existsSync(queueFile)
      ? JSON.parse(readFileSync(queueFile, "utf8"))
      : {};

    let hindiCount = 0;
    let queueCount = 0;
    let missing = 0;

    for (const e of list) {
      const [, chNo, vsNo] = e.ref.split(":");
      const ch = doc.chapters.find((c) => String(c.number) === chNo);
      const v = ch?.verses.find((x) => String(x.number) === vsNo);
      if (!v) {
        missing++;
        continue;
      }
      if (e.hindi?.trim() && (!v.hindi?.trim() || (OVERWRITE_PLACEHOLDER && isPlaceholderHindi(v)))) {
        v.hindi = e.hindi.trim();
        v.hindiSource = "ai";
        hindiCount++;
      }
      const key = `${Number(chNo)}:${Number(vsNo)}`;
      if (!queue[key] && (e.vyakhya?.trim() || e.vijnana?.trim() || e.lifeLesson?.trim())) {
        queue[key] = {
          explanation: e.vyakhya?.trim() ?? "",
          science: e.vijnana?.trim() ?? "",
          lifeLesson: e.lifeLesson?.trim() ?? "",
          confidence: e.confidence ?? "medium",
          reviewNote: e.reviewNote ?? "",
          status: "pending",
          model: MODEL,
          generatedAt: new Date().toISOString(),
          sanskrit: v.sanskrit ?? "",
        };
        queueCount++;
      }
    }

    hindiApplied += hindiCount;
    queued += queueCount;
    console.log(
      `${id}: hindi +${hindiCount}, commentary drafts +${queueCount}` +
        `${missing ? `, ${missing} refs not found` : ""}`,
    );

    if (WRITE) {
      if (hindiCount) writeFileSync(path, JSON.stringify(doc, null, 2) + "\n", "utf8");
      if (queueCount) {
        mkdirSync(QUEUE_DIR, { recursive: true });
        const sorted = Object.fromEntries(
          Object.entries(queue).sort(([a], [b]) => a.localeCompare(b, "en", { numeric: true })),
        );
        writeFileSync(queueFile, JSON.stringify(sorted, null, 2) + "\n", "utf8");
      }
    }
  }

  console.log(
    `\n${WRITE ? "Applied" : "Would apply"} ${hindiApplied} Hindi meanings, ` +
      `queued ${queued} commentary drafts (status pending).`,
  );
}

main();
