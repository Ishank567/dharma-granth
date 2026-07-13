/**
 * Generates the mobile app's bundled Hindi analysis table.
 *
 * The web app keys its curated Hindi analysis (व्याख्या / science / life-lesson)
 * by the INTERNAL chapter.id:verse.id. The mobile app, however, reads the
 * PUBLISHED public/data/scriptures-full/*.json, whose verse `number`s differ for
 * several corpora (e.g. Rigveda "1.1", Katha starting at 2). This script bridges
 * the two by matching Sanskrit text, so every emitted entry is aligned to the
 * exact verse the mobile app shows — entries that can't be safely matched are
 * dropped rather than risk attaching analysis to the wrong verse.
 *
 *   npx tsx scripts/generate-hi-analysis.ts
 *   # writes hi-analysis.json — copy it to dharma-granth-mobile/data/
 *
 * Output shape: { "<scriptureId>:<chapter>:<verse>": { e?, s?, l? } }
 *   e = explanation (व्याख्या), s = science (आधुनिक दृष्टि), l = lifeLesson (जीवन शिक्षा)
 */
import fs from "fs";
import path from "path";
import { pathToFileURL } from "url";
import {
  legacyCuratedKeys,
  verseExplanationsHi,
  verseScienceHi,
  verseLifeLessonHi,
} from "../data/verse-explanations-hi";
import type { Scripture } from "../data/types";
import { isBoilerplateField, isCuratedAnalysisField } from "../data/hi-commentary/quality";

const MAX_BUNDLE_MB = 10;

const PUB = path.join(process.cwd(), "public/data/scriptures-full");
const SCRIPT_DIR = path.join(process.cwd(), "data/scriptures");

// Keep only base letters + matras; drop whitespace, dandas, digits, and the
// combining marks (anusvara/visarga, nukta, avagraha, vedic accents) that vary
// between the internal and published sources.
function norm(s: string | undefined): string {
  if (!s) return "";
  let out = "";
  for (const ch of s.normalize("NFC")) {
    const c = ch.codePointAt(0)!;
    if (c <= 0x20) continue;
    if (c >= 0x30 && c <= 0x39) continue;
    if (ch === "." || ch === "|") continue;
    if (c === 0x0964 || c === 0x0965) continue;
    if (c >= 0x0966 && c <= 0x096f) continue;
    if (c >= 0x0900 && c <= 0x0903) continue;
    if (c === 0x093c || c === 0x093d) continue;
    if (c >= 0x0951 && c <= 0x0954) continue;
    out += ch;
  }
  return out;
}

const ids = new Set<string>();
for (const k of Object.keys(verseExplanationsHi)) ids.add(k.split(":")[0]);
for (const k of Object.keys(verseScienceHi)) ids.add(k.split(":")[0]);
for (const k of Object.keys(verseLifeLessonHi)) ids.add(k.split(":")[0]);

async function loadInternal(id: string): Promise<Scripture | null> {
  const file = path.join(SCRIPT_DIR, `${id}.ts`);
  if (!fs.existsSync(file)) return null;
  try {
    const mod = await import(pathToFileURL(file).href);
    const found = Object.values(mod).find(
      (v: any) => v && typeof v === "object" && Array.isArray((v as any).chapters)
    );
    return (found as Scripture) ?? null;
  } catch {
    return null;
  }
}

function loadPublished(id: string): any | null {
  const file = path.join(PUB, `${id}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function getNGrams(s: string, n: number = 3): Set<string> {
  const ngrams = new Set<string>();
  for (let i = 0; i <= s.length - n; i++) {
    ngrams.add(s.slice(i, i + n));
  }
  return ngrams;
}

interface PubVerse {
  ref: string;
  norm: string;
  ngrams: Set<string>;
}

function findBestMatch(intNorm: string, pubVerses: PubVerse[]): string | null {
  if (!intNorm || intNorm.length < 6) return null;

  // Tier 1: Substring matches with different prefix lengths (18, 15, 12)
  for (const prefixLen of [18, 15, 12]) {
    const intPrefix = intNorm.slice(0, prefixLen);
    if (intPrefix.length < 8) continue;
    
    let matches: string[] = [];
    for (const pv of pubVerses) {
      const pubPrefix = pv.norm.slice(0, prefixLen);
      if (pv.norm.includes(intPrefix) || intNorm.includes(pubPrefix)) {
        matches.push(pv.ref);
      }
    }
    if (matches.length === 1) {
      return matches[0];
    }
  }

  // Tier 2: Longest common prefix match (from start of string)
  let bestRef: string | null = null;
  let maxCommonLen = 0;
  for (const pv of pubVerses) {
    let commonLen = 0;
    while (commonLen < intNorm.length && commonLen < pv.norm.length && intNorm[commonLen] === pv.norm[commonLen]) {
      commonLen++;
    }
    if (commonLen > maxCommonLen) {
      maxCommonLen = commonLen;
      bestRef = pv.ref;
    }
  }
  if (maxCommonLen >= 8) {
    return bestRef;
  }

  // Tier 3: 3-gram overlap score (for spelling and sandhi variations later in text)
  const intNGrams = getNGrams(intNorm);
  const candidates: { ref: string; score: number }[] = [];
  for (const pv of pubVerses) {
    if (pv.ngrams.size === 0) continue;
    let intersectCount = 0;
    for (const g of Array.from(intNGrams)) {
      if (pv.ngrams.has(g)) intersectCount++;
    }
    const score = intersectCount / Math.min(intNGrams.size, pv.ngrams.size);
    candidates.push({ ref: pv.ref, score });
  }

  candidates.sort((a, b) => b.score - a.score);

  if (candidates.length > 0) {
    const best = candidates[0];
    const secondBest = candidates[1];
    
    const minScore = 0.35;
    const minMargin = 0.15;

    if (best.score >= minScore) {
      if (!secondBest || (best.score - secondBest.score) >= minMargin) {
        return best.ref;
      }
    }
  }

  return null;
}

const out: Record<string, { e?: string; s?: string; l?: string }> = {};
let matched = 0;
let lost = 0;

async function main() {
  for (const id of Array.from(ids)) {
    const internal = await loadInternal(id);
    const published = loadPublished(id);

    const internalSanskrit: Record<string, string> = {};
    for (const c of internal?.chapters || []) {
      for (const v of c.verses || []) internalSanskrit[`${c.id}:${v.id}`] = norm(v.sanskrit);
    }

    const pubVerses: PubVerse[] = [];
    for (const c of published?.chapters || []) {
      for (const v of c.verses || []) {
        const n = norm(v.sanskrit);
        pubVerses.push({
          ref: `${c.number}:${v.number}`,
          norm: n,
          ngrams: getNGrams(n)
        });
      }
    }

    const internalKeys = new Set<string>();
    for (const table of [verseExplanationsHi, verseScienceHi, verseLifeLessonHi]) {
      for (const key of Object.keys(table)) {
        if (key.startsWith(id + ":")) internalKeys.add(key);
      }
    }

    for (const key of internalKeys) {
      const curated =
        legacyCuratedKeys.has(key) ||
        isCuratedAnalysisField(verseScienceHi[key]) ||
        isCuratedAnalysisField(verseLifeLessonHi[key]);
      if (!curated) continue;

      const sk = internalSanskrit[key.slice(id.length + 1)];
      const target = sk ? findBestMatch(sk, pubVerses) ?? undefined : undefined;
      if (!target) {
        if (verseExplanationsHi[key]) lost++;
        continue;
      }

      const outKey = `${id}:${target}`;
      const entry = (out[outKey] ||= {});
      const explanation = verseExplanationsHi[key];
      const science = verseScienceHi[key];
      const lifeLesson = verseLifeLessonHi[key];
      if (explanation) {
        entry.e = explanation;
        matched++;
      }
      if (science && !isBoilerplateField(science)) entry.s = science;
      if (lifeLesson && !isBoilerplateField(lifeLesson)) entry.l = lifeLesson;
    }
  }

  fs.writeFileSync("hi-analysis.json", JSON.stringify(out));
  const sizeKB = fs.statSync("hi-analysis.json").size / 1024;
  const sizeMB = sizeKB / 1024;
  console.log(
    `verses: ${Object.keys(out).length} | explanation matched: ${matched} | lost: ${lost} | ` +
      `${sizeKB.toFixed(0)}KB`,
  );
  if (sizeMB > MAX_BUNDLE_MB) {
    console.error(
      `Bundle too large (${sizeMB.toFixed(1)}MB > ${MAX_BUNDLE_MB}MB). ` +
        `Refusing to ship — check curated-only filters.`,
    );
    process.exit(1);
  }
}
main();
