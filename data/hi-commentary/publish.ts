import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import type { HiCommentaryEntry, HiCommentaryFragment } from "./_types";
import {
  isCuratedAnalysisField,
  stripBoilerplateEntry,
} from "./quality";

const MANIFEST_PATH = resolve(__dirname, "curated-manifest.json");
const LEGACY_SOURCE = resolve(__dirname, "../verse-explanations-hi.ts");

let legacyKeysCache: Set<string> | null = null;
let manifestKeysCache: Set<string> | null = null;

/** Hand-authored seed keys from verse-explanations-hi.ts (parsed without importing fragments). */
export function loadLegacyCuratedKeys(): Set<string> {
  if (legacyKeysCache) return legacyKeysCache;
  const src = readFileSync(LEGACY_SOURCE, "utf8");
  const block = src.match(/legacyVerseExplanationsHi[\s\S]*?=\s*\{([\s\S]*?)\n\};/);
  const keys = new Set<string>();
  if (block) {
    for (const m of block[1].matchAll(/'([^']+)':/g)) keys.add(m[1]);
  }
  legacyKeysCache = keys;
  return keys;
}

export function loadManifestKeys(): Set<string> {
  if (manifestKeysCache) return manifestKeysCache;
  const keys = new Set<string>();
  if (existsSync(MANIFEST_PATH)) {
    const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as {
      entries?: Record<string, unknown>;
    };
    for (const k of Object.keys(manifest.entries ?? {})) keys.add(k);
  }
  manifestKeysCache = keys;
  return keys;
}

export function shouldPublishCommentaryEntry(
  scriptureId: string,
  chapterVerseKey: string,
  entry: HiCommentaryEntry,
  legacyKeys = loadLegacyCuratedKeys(),
  manifestKeys = loadManifestKeys(),
): boolean {
  const fullKey = `${scriptureId}:${chapterVerseKey}`;
  if (legacyKeys.has(fullKey) || manifestKeys.has(fullKey)) return true;
  return (
    isCuratedAnalysisField(entry.science) || isCuratedAnalysisField(entry.lifeLesson)
  );
}

/** Keep only curated commentary safe to publish (matches mobile bundle policy). */
export function filterCuratedFragment(
  scriptureId: string,
  fragment: HiCommentaryFragment,
): HiCommentaryFragment {
  const legacyKeys = loadLegacyCuratedKeys();
  const manifestKeys = loadManifestKeys();
  const out: HiCommentaryFragment = {};

  for (const [key, entry] of Object.entries(fragment)) {
    if (!shouldPublishCommentaryEntry(scriptureId, key, entry, legacyKeys, manifestKeys)) {
      continue;
    }
    const cleaned = stripBoilerplateEntry(entry);
    if (!cleaned.explanation && !cleaned.science && !cleaned.lifeLesson) continue;
    out[key] = cleaned;
  }
  return out;
}