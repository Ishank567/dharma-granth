/**
 * Rebuild the Bhagavad Gita data files with correct chapter/verse placement.
 *
 * Background: commit 3a17ed9 rewrote public/data/scriptures-full/bhagavadgita.json
 * and data/scriptures/bhagavadgita.ts by *position*, so the ~47 hand-curated
 * verses (whose ids were partly wrong to begin with) were copied into every
 * chapter and overwrote real verses (e.g. 8.28 showed Gita 1.28). This script
 * restores the canonical text and re-homes curated content by *content*.
 *
 * Pipeline:
 *   1. npm run seed:gita          → canonical 701-verse JSON from gita/gita
 *                                   (every verse's ।।c.v।। marker is checked here)
 *   2. npx tsx scripts/repair-bhagavadgita.ts
 *        - data/scriptures/bhagavadgita.ts: canonical text for every verse;
 *          curated notes (explanation/science/lifeLesson/keywords, and the
 *          curated translation/hindi when the Sanskrit matches) are attached
 *          to the verse their Sanskrit actually matches.
 *        - public/data/scriptures-full/bhagavadgita.json: `commentary` = curated
 *          explanation where one exists, else the word meanings (as in 32ea45f).
 *        - data/hi-commentary/bhagavadgita.ts, curated-manifest.json,
 *          verse-explanations-hi.ts: curated keys remapped (HI_KEY_REMAP);
 *          auto-filled entries regenerated from the verse now at that key.
 *        - public/data/chapters.json + stats.json: Gita verse counts.
 *   3. npm run publish:data       → hi-commentary JSON + chapter shards
 *
 * Idempotent: re-running on already-repaired files is a no-op.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { bhagavadGita } from "../data/scriptures/bhagavadgita";
import { bhagavadgitaHi } from "../data/hi-commentary/bhagavadgita";
import type { Scripture, Verse } from "../data/types";
import type { HiCommentaryEntry } from "../data/hi-commentary/_types";
import type { FullScripture } from "./lib/scripture-schema";
import { GITA_CANONICAL_VERSE_COUNTS, sanskritShingles, shingleOverlap } from "./lib/verse-identity";

const ROOT = resolve(__dirname, "..");
const JSON_PATH = resolve(ROOT, "public/data/scriptures-full/bhagavadgita.json");
const TS_PATH = resolve(ROOT, "data/scriptures/bhagavadgita.ts");
const HI_PATH = resolve(ROOT, "data/hi-commentary/bhagavadgita.ts");
const MANIFEST_PATH = resolve(ROOT, "data/hi-commentary/curated-manifest.json");
const LEGACY_PATH = resolve(ROOT, "data/verse-explanations-hi.ts");
const CHAPTERS_INDEX_PATH = resolve(ROOT, "public/data/chapters.json");
const STATS_PATH = resolve(ROOT, "public/data/stats.json");

/**
 * Hindi commentary is prose, so it can't be content-matched against Sanskrit
 * directly. Each curated entry was written for the curated verse stored under
 * the same key before 3a17ed9 (b4f1765); these are the keys whose Sanskrit
 * belongs elsewhere (audited by matching that Sanskrit against gita/gita).
 * null = drop: 3:30 duplicated 4.7 (which has its own entry), and 10:34's
 * Sanskrit ("अदृश्यतां गतं पार्थ…") is not a Gita verse.
 */
const HI_KEY_REMAP: Record<string, { to: string } | { dropIfIncludes: string }> = {
  "3:30": { dropIfIncludes: "अवतारवाद" },
  "3:42": { to: "3:21" },
  "9:27": { to: "12:3" },
  "10:34": { dropIfIncludes: "योगमाया" },
  "11:32": { to: "11:12" },
  "12:13": { to: "12:18" },
  "13:2": { to: "13:3" }, // gita/gita numbers Arjuna's question as 13.1 (35 verses)
};

const FULL_MATCH = 0.8; // curated Sanskrit is the same verse
const PARTIAL_MATCH = 0.4; // overlaps (e.g. curated 1.28 spans 1.28b–1.29a)

function assertCanonical(full: FullScripture): void {
  const counts = full.chapters.map((c) => c.verses.length);
  if (counts.join(",") !== GITA_CANONICAL_VERSE_COUNTS.join(",")) {
    throw new Error(
      `bhagavadgita.json is not canonical (${counts.join(",")}); run \`npm run seed:gita\` first`,
    );
  }
}

interface Curated {
  key: string;
  verse: Verse;
}

function main(): void {
  const full = JSON.parse(readFileSync(JSON_PATH, "utf8")) as FullScripture;
  assertCanonical(full);

  const canon = full.chapters.flatMap((c) =>
    c.verses.map((v) => ({
      key: `${c.number}:${v.number}`,
      verse: v,
      shingles: sanskritShingles(v.sanskrit ?? ""),
    })),
  );
  const bestMatch = (sanskrit: string): { key: string; score: number } => {
    const s = sanskritShingles(sanskrit);
    let key = "";
    let score = 0;
    for (const c of canon) {
      const sc = shingleOverlap(s, c.shingles);
      if (sc > score) {
        score = sc;
        key = c.key;
      }
    }
    return { key, score };
  };

  // ── 1. Re-home curated TS verses by content ────────────────────────────
  const curatedByKey = new Map<
    string,
    { verse: Verse; full: boolean; exact: boolean; from: string }
  >();
  const dropped: string[] = [];
  const moved: string[] = [];
  const seen = new Set<string>();
  const candidates: Curated[] = [];
  for (const ch of bhagavadGita.chapters) {
    for (const v of ch.verses) {
      const hasNotes = !!(v.explanation?.trim() || v.science || v.lifeLesson);
      if (hasNotes) candidates.push({ key: `${ch.id}:${v.id}`, verse: v });
    }
  }
  // 3a17ed9 pasted each curated entry into many chapters, often without its
  // science/lifeLesson. Prefer the copy filed under the right key, then the
  // richest copy, and fill its gaps from other copies of the same entry.
  const richness = (v: Verse) =>
    [v.science, v.lifeLesson, v.hindi, v.keywords?.length].filter(Boolean).length;
  const copiesByTarget = new Map<string, Verse[]>();
  for (const { key, verse } of candidates) {
    const m = bestMatch(verse.sanskrit);
    const fullMatch = m.score >= FULL_MATCH;
    if (!fullMatch && !(m.score >= PARTIAL_MATCH && m.key === key)) {
      const fp = verse.sanskrit;
      if (!seen.has(fp)) dropped.push(`${key} (best ${m.key} @ ${m.score.toFixed(2)})`);
      seen.add(fp);
      continue;
    }
    const exact = m.key === key;
    copiesByTarget.set(m.key, [...(copiesByTarget.get(m.key) ?? []), verse]);
    const prev = curatedByKey.get(m.key);
    if (prev) {
      if (prev.exact && !exact) continue;
      if (prev.exact === exact && richness(prev.verse) >= richness(verse)) continue;
    }
    curatedByKey.set(m.key, { verse, full: fullMatch, exact, from: key });
  }
  curatedByKey.forEach((c, k) => {
    if (!c.exact) moved.push(`${c.from}→${k}`);
    const merged: Verse = { ...c.verse };
    for (const copy of copiesByTarget.get(k) ?? []) {
      if (copy.explanation !== merged.explanation) continue; // a different curated entry
      merged.science ??= copy.science;
      merged.lifeLesson ??= copy.lifeLesson;
      if (!merged.keywords?.length && copy.keywords?.length) merged.keywords = copy.keywords;
    }
    c.verse = merged;
  });

  // ── 2. Rebuild data/scriptures/bhagavadgita.ts ─────────────────────────
  const tsChapterMeta = new Map(bhagavadGita.chapters.map((c) => [c.id, c]));
  const rebuilt: Scripture = {
    ...bhagavadGita,
    totalVerses: canon.length,
    chapters: full.chapters.map((c) => {
      const meta = tsChapterMeta.get(c.number);
      return {
        id: c.number,
        title: meta?.title ?? c.title ?? "",
        titleSanskrit: meta?.titleSanskrit ?? c.titleSanskrit,
        summary: meta?.summary,
        verses: c.verses.map((v): Verse => {
          const cur = curatedByKey.get(`${c.number}:${v.number}`);
          const out: Verse = {
            id: v.number,
            sanskrit: v.sanskrit ?? "",
            transliteration: v.transliteration ?? "",
            translation: (cur?.full && cur.verse.translation) || v.translation || "",
            hindi: (cur?.full && cur.verse.hindi) || v.hindi,
            explanation: cur?.verse.explanation ?? "",
          };
          if (cur?.verse.science) out.science = cur.verse.science;
          if (cur?.verse.lifeLesson) out.lifeLesson = cur.verse.lifeLesson;
          out.keywords = cur?.verse.keywords ?? [];
          return out;
        }),
      };
    }),
  };
  writeFileSync(TS_PATH, renderScriptureTs(rebuilt), "utf8");

  // ── 3. JSON commentary ─────────────────────────────────────────────────
  for (const c of full.chapters) {
    for (const v of c.verses) {
      const cur = curatedByKey.get(`${c.number}:${v.number}`);
      const commentary = cur?.verse.explanation?.trim() || v.wordMeaning?.trim();
      if (commentary) v.commentary = commentary;
    }
  }
  writeFileSync(JSON_PATH, JSON.stringify(full, null, 2), "utf8");

  // ── 4. Hindi commentary ────────────────────────────────────────────────
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) as {
    generatedAt: string;
    entries: Record<string, unknown>;
  };
  const isCuratedHi = (k: string) => `bhagavadgita:${k}` in manifest.entries;
  // Only remap while the misfiled entry is still there, so a re-run never
  // moves commentary curated later for the real verse at these keys.
  const remapKey = (k: string): string | null => {
    const rule = HI_KEY_REMAP[k];
    if (!rule) return k;
    if ("to" in rule) return isCuratedHi(rule.to) ? k : rule.to;
    return (bhagavadgitaHi[k]?.explanation ?? "").includes(rule.dropIfIncludes) ? null : k;
  };
  const remapped = new Map(
    Object.keys(bhagavadgitaHi)
      .filter(isCuratedHi)
      .map((k) => [k, remapKey(k)] as const),
  );

  const hiCurated = new Map<string, HiCommentaryEntry>();
  remapped.forEach((target, k) => {
    if (target) hiCurated.set(target, bhagavadgitaHi[k]);
  });
  const hiOut: Record<string, HiCommentaryEntry> = {};
  for (const ch of rebuilt.chapters) {
    for (const v of ch.verses) {
      const k = `${ch.id}:${v.id}`;
      // Auto-filled entries (3a17ed9) are just the verse's Hindi translation;
      // regenerate them from the verse that now lives at this key.
      hiOut[k] = hiCurated.get(k) ?? { explanation: v.hindi ?? "" };
    }
  }
  writeFileSync(HI_PATH, renderHiFragment(hiOut), "utf8");

  const newEntries: Record<string, unknown> = {};
  for (const [k, val] of Object.entries(manifest.entries)) {
    if (!k.startsWith("bhagavadgita:")) {
      newEntries[k] = val;
      continue;
    }
    const key = k.slice("bhagavadgita:".length);
    const target = remapped.has(key) ? remapped.get(key) : key;
    if (target) newEntries[`bhagavadgita:${target}`] = val;
  }
  manifest.entries = newEntries;
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n", "utf8");

  let legacy = readFileSync(LEGACY_PATH, "utf8");
  remapped.forEach((to, from) => {
    if (to === from) return;
    const re = new RegExp(`^\\s*'bhagavadgita:${from}':.*\\r?\\n`, "m");
    legacy = legacy.replace(re, (line) =>
      to ? line.replace(`'bhagavadgita:${from}'`, `'bhagavadgita:${to}'`) : "",
    );
  });
  writeFileSync(LEGACY_PATH, legacy, "utf8");

  // ── 5. Chapter index used by the scripture/chapter pages and sitemap ───
  const chapterIndex = JSON.parse(readFileSync(CHAPTERS_INDEX_PATH, "utf8")) as Record<
    string,
    Array<{ id: number; title: string; titleSanskrit?: string; verseCount: number }>
  >;
  const stats = JSON.parse(readFileSync(STATS_PATH, "utf8")) as { realVerseCount: number };
  const before = (chapterIndex.bhagavadgita ?? []).reduce((n, c) => n + c.verseCount, 0);
  chapterIndex.bhagavadgita = rebuilt.chapters.map((c) => ({
    id: c.id,
    title: c.title,
    titleSanskrit: c.titleSanskrit,
    verseCount: c.verses.length,
  }));
  stats.realVerseCount += canon.length - before;
  writeFileSync(CHAPTERS_INDEX_PATH, JSON.stringify(chapterIndex), "utf8");
  writeFileSync(STATS_PATH, JSON.stringify(stats), "utf8");

  console.log(`Canonical verses: ${canon.length}`);
  console.log(`Curated verses kept: ${curatedByKey.size}`);
  if (moved.length) console.log(`  re-homed by content: ${moved.join(", ")}`);
  if (dropped.length) console.log(`  dropped (no confident match to a Gita verse): ${dropped.join(", ")}`);
  console.log(`Hindi commentary: ${hiCurated.size} curated entries, ${Object.keys(hiOut).length} total`);
}

// ── Rendering ──────────────────────────────────────────────────────────────

function renderScriptureTs(s: Scripture): string {
  const body = JSON.stringify(s, null, 2).replace(/^(\s*)"([A-Za-z_]\w*)":/gm, "$1$2:");
  return `import { Scripture } from "../types";\n\nexport const bhagavadGita: Scripture = ${body};\n`;
}

function tpl(s: string): string {
  return "`" + s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${") + "`";
}

function renderHiFragment(frag: Record<string, HiCommentaryEntry>): string {
  const lines = [
    "import type { HiCommentaryFragment } from './_types';",
    "",
    "export const bhagavadgitaHi: HiCommentaryFragment = {",
  ];
  for (const [k, e] of Object.entries(frag)) {
    lines.push(`  '${k}': {`);
    for (const field of ["explanation", "science", "lifeLesson"] as const) {
      if (e[field] !== undefined) lines.push(`    ${field}: ${tpl(e[field]!)},`);
    }
    lines.push("  },");
  }
  lines.push("};", "");
  return lines.join("\n");
}

main();
