/**
 * Pre-build data-integrity check.
 *
 * Catches the kinds of bugs that don't show up in `tsc --noEmit`:
 *   - duplicate or non-sequential chapter IDs (breaks prev/next navigation)
 *   - duplicate verse IDs within a chapter (React key warnings + dedup misses)
 *   - scriptureCatalog ↔ scriptureMap drift (a meta entry without verse data,
 *     or verse data not registered in the catalog)
 *   - missing OG image PNGs for any catalog entry
 *   - seeded JSON chapter numbers that don't align with curated chapter IDs
 *     (the FullChapterVerses dedup silently fails when these drift)
 *   - curated verses missing core fields
 *
 * Run: npm run check
 * Exit non-zero if any failure — wire into CI before `npm run build`.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { scriptureCatalog } from "../data/scripture-meta";
import {
  getAllScriptures,
  getScripture,
  getScriptureMeta,
} from "../data/scriptures";
import type { Scripture, ScriptureMeta } from "../data/types";

const ROOT = resolve(__dirname, "..");
const OG_DIR = resolve(ROOT, "public/og");
const FULL_DIR = resolve(ROOT, "public/data/scriptures-full");

interface Issue {
  severity: "error" | "warn";
  scope: string;
  message: string;
}

const issues: Issue[] = [];

function error(scope: string, message: string): void {
  issues.push({ severity: "error", scope, message });
}
function warn(scope: string, message: string): void {
  issues.push({ severity: "warn", scope, message });
}

function uniqueValues<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}

function checkChapterIds(scripture: Scripture): void {
  const ids = scripture.chapters.map((c) => c.id);
  if (uniqueValues(ids).length !== ids.length) {
    const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
    error(scripture.id, `duplicate chapter ids: ${uniqueValues(dupes).join(", ")}`);
  }
  // The reader's prev/next nav uses chapterId arithmetic (chapterId + 1),
  // so IDs must be a 1..N contiguous sequence — otherwise next-button 404s.
  const sorted = ids.slice().sort((a, b) => a - b);
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i] !== i + 1) {
      error(
        scripture.id,
        `chapter ids must be sequential 1..N; got [${sorted.join(", ")}]`,
      );
      break;
    }
  }
}

function checkVerseIds(scripture: Scripture): void {
  for (const chapter of scripture.chapters) {
    const ids = chapter.verses.map((v) => v.id);
    if (uniqueValues(ids).length !== ids.length) {
      const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
      error(
        scripture.id,
        `chapter ${chapter.id}: duplicate verse ids: ${uniqueValues(dupes).join(", ")}`,
      );
    }
  }
}

function checkRequiredFields(scripture: Scripture): void {
  for (const chapter of scripture.chapters) {
    for (const verse of chapter.verses) {
      if (!verse.sanskrit || !verse.sanskrit.trim()) {
        error(scripture.id, `ch ${chapter.id} verse ${verse.id}: missing sanskrit`);
      }
      if (!verse.translation && !verse.hindi) {
        warn(
          scripture.id,
          `ch ${chapter.id} verse ${verse.id}: neither translation nor hindi present`,
        );
      }
      if (!verse.explanation || !verse.explanation.trim()) {
        warn(scripture.id, `ch ${chapter.id} verse ${verse.id}: empty explanation`);
      }
    }
  }
}

function checkCatalogAlignment(): void {
  const catalogIds = scriptureCatalog.map((m) => m.id);
  const mappedIds = getAllScriptures().map((m) => m.id);
  const mappedSet = new Set(mappedIds);
  const catalogSet = new Set(catalogIds);
  for (const id of catalogIds) {
    if (!mappedSet.has(id)) {
      error(id, "in scriptureCatalog but not produced by getAllScriptures()");
    }
  }
  // getAllScriptures derives from scriptureCatalog so the reverse drift can't
  // happen — but check anyway as a sanity belt.
  for (const id of mappedIds) {
    if (!catalogSet.has(id)) {
      error(id, "produced by getAllScriptures() but missing from scriptureCatalog");
    }
  }
  // Every meta entry must be backed by a Scripture object.
  for (const meta of scriptureCatalog) {
    if (!getScripture(meta.id)) {
      error(meta.id, "in scriptureCatalog but no Scripture object registered in index.ts");
    }
  }
}

function checkOgImages(): void {
  for (const meta of scriptureCatalog) {
    const png = resolve(OG_DIR, `${meta.id}.png`);
    if (!existsSync(png)) {
      error(meta.id, `missing OG image at public/og/${meta.id}.png — run \`npm run og:build\``);
    }
  }
}

interface FullScriptureJson {
  id: string;
  chapters: Array<{ number: number; verses: Array<{ number: number | string }> }>;
}

function checkSeededJsonAlignment(): void {
  for (const meta of scriptureCatalog) {
    const path = resolve(FULL_DIR, `${meta.id}.json`);
    if (!existsSync(path)) continue; // seeded JSON is optional per-scripture

    let data: FullScriptureJson;
    try {
      data = JSON.parse(readFileSync(path, "utf8"));
    } catch (err) {
      error(meta.id, `${path} is not valid JSON: ${(err as Error).message}`);
      continue;
    }

    const curated = getScripture(meta.id);
    if (!curated) continue;

    const curatedChapterIds = curated.chapters.map((c) => c.id);
    const jsonChapterNumbers = data.chapters.map((c) => c.number);
    const jsonChapterSet = new Set(jsonChapterNumbers);

    // Curated chapter without a matching JSON chapter = the "Load full
    // chapter text" button on that page will show "no extras." That's the
    // real bug we want to catch.
    for (const id of curatedChapterIds) {
      if (!jsonChapterSet.has(id)) {
        warn(
          meta.id,
          `curated chapter id ${id} has no matching chapter in seeded JSON (chapters present: ${jsonChapterNumbers.slice().sort((a, b) => Number(a) - Number(b)).join(", ")})`,
        );
      }
    }
    // The reverse — JSON chapter not in curated — is NOT a bug. The curated
    // .ts files are intentionally a subset of canonical chapters; visiting
    // those chapter routes is impossible because they aren't generated as
    // static pages. So we don't warn on that direction.
  }
}

function checkScriptureMeta(meta: ScriptureMeta): void {
  if (!meta.title.trim()) error(meta.id, "empty title");
  if (!meta.titleSanskrit.trim()) error(meta.id, "empty titleSanskrit");
  if (meta.totalChapters < 1) warn(meta.id, "totalChapters < 1");
}

function main(): void {
  for (const meta of scriptureCatalog) {
    checkScriptureMeta(meta);
    const scripture = getScripture(meta.id);
    if (!scripture) continue;
    checkChapterIds(scripture);
    checkVerseIds(scripture);
    checkRequiredFields(scripture);
  }
  checkCatalogAlignment();
  checkOgImages();
  checkSeededJsonAlignment();

  const errors = issues.filter((i) => i.severity === "error");
  const warns = issues.filter((i) => i.severity === "warn");

  // Group output by scripture for readability.
  const byScope = new Map<string, Issue[]>();
  for (const issue of issues) {
    const list = byScope.get(issue.scope) ?? [];
    list.push(issue);
    byScope.set(issue.scope, list);
  }

  if (issues.length === 0) {
    console.log("✓ All checks passed.");
    console.log(
      `  ${scriptureCatalog.length} scriptures · ${countCurated()} curated verses · ${countSeeded()} seeded full-text verses`,
    );
    return;
  }

  byScope.forEach((list, scope) => {
    console.log(`\n[${scope}]`);
    for (const issue of list) {
      const tag = issue.severity === "error" ? "✗ ERR " : "! WARN";
      console.log(`  ${tag} ${issue.message}`);
    }
  });
  console.log(`\n${errors.length} error(s), ${warns.length} warning(s)`);
  if (errors.length > 0) process.exit(1);
}

function countCurated(): number {
  let n = 0;
  for (const meta of scriptureCatalog) {
    const s = getScripture(meta.id);
    if (!s) continue;
    for (const c of s.chapters) n += c.verses.length;
  }
  return n;
}

function countSeeded(): number {
  let n = 0;
  for (const meta of scriptureCatalog) {
    const path = resolve(FULL_DIR, `${meta.id}.json`);
    if (!existsSync(path)) continue;
    try {
      const data = JSON.parse(readFileSync(path, "utf8")) as FullScriptureJson;
      for (const c of data.chapters) n += c.verses.length;
    } catch {
      // already reported as error above
    }
  }
  return n;
}

// silence unused-import lint
void getScriptureMeta;

main();
