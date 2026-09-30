/**
 * Guard against invented "filler" verses.
 *
 * In 2026-09 a template family of generated verses ("[deity] dwells in the heart of all beings. He who
 * knows, sees…", "Peaceful, auspicious, non-dual X — eternal, pure…", …) was found padded into ~40
 * scriptures, in the published JSON, the curated data/scriptures/*.ts and the Hindi commentary. They
 * came in through the seeders' curated-merge fallback. This check fails the build if any of them
 * (or a reworded variant sharing the same tail) reappears, or if a principal Upanishad grows past its
 * canonical verse count.
 *
 * Run: tsx scripts/check-filler.ts
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const ROOT = resolve(__dirname, "..");
const JSON_DIR = join(ROOT, "public/data/scriptures-full");
const CURATED_DIRS = [join(ROOT, "data/scriptures"), join(ROOT, "data/hi-commentary")];

/** Devanagari letters only, so punctuation, digits and spacing cannot hide a match. */
const norm = (s: string) => s.replace(/[^ऀ-ॿ]/g, "").replace(/[।-९]/g, "");

/** Normalised fragments that only occur in the invented verses. */
const FILLER: Array<[string, string]> = [
  ["योगश्चित्तवृत्तिरोधो", "योगश्चित्तवृत्तिरोधो… (yoga template)"],
  ["अहंब्रह्मास्मिनत्वंभूतिर्न", "अहं ब्रह्मास्मि न त्वं भूतिः… (template)"],
  ["यथानदीसमुद्रेषुयथादीपो", "यथा नदी समुद्रेषु यथा दीपो… (template)"],
  ["नित्यंशुद्धमच्युतम्", "शान्तं शिवमद्वैतं X नित्यं शुद्धमच्युतम् (template)"],
  ["योजानातिसपश्यतियोनजानातिनपश्यति", "…यो जानाति स पश्यति यो न जानाति न पश्यति (template tail)"],
  ["एकोदेवोद्वितीयोनास्तियो", "एको देवो द्वितीयो नास्ति यो… (template)"],
  ["यदातेभ्रातर्भवति", "यदा ते भ्रातर्भवति… (template)"],
  ["पूषान्नेक्ष्वरे", "पूषान्नेक्ष्वरे… (template)"],
  ["ओंकारोध्वनिर्द्वितीयो", "ओंकारो ध्वनिर्द्वितीयो… (template)"],
  ["एकंतुरीयंसर्वगतं", "एकं तुरीयं सर्वगतं… (template)"],
  ["अष्टोत्तरशतंतेषां", "अष्टोत्तरशतं तेषां… (template)"],
];

/** Canonical verse/mantra counts; a principal Upanishad above its count has been padded. */
const MAX_VERSES: Record<string, number> = {
  ishavasya: 18,
  kena: 35,
  katha: 119,
  prashna: 67,
  mundaka: 64,
  mandukya: 12,
  kaivalya: 24,
  shvetashvatara: 113,
};

const problems: string[] = [];

for (const file of readdirSync(JSON_DIR).filter((f) => f.endsWith(".json"))) {
  const book = JSON.parse(readFileSync(join(JSON_DIR, file), "utf8")) as {
    id: string;
    totalVerses: number;
    chapters: Array<{ number: number; verses: Array<{ number: number | string; sanskrit?: string }> }>;
  };
  let count = 0;
  for (const chapter of book.chapters) {
    for (const verse of chapter.verses) {
      count++;
      const n = norm(verse.sanskrit ?? "");
      const hit = FILLER.find(([k]) => n.includes(k));
      if (hit) problems.push(`${book.id} ${chapter.number}:${verse.number} is filler — ${hit[1]}`);
    }
  }
  const max = MAX_VERSES[book.id];
  if (max !== undefined && count > max) {
    problems.push(`${book.id} has ${count} verses; the text has only ${max} — extra verses were invented`);
  }
}

// The curated files are where the filler originated; they must not carry it either.
for (const dir of CURATED_DIRS) {
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir).filter((f) => f.endsWith(".ts"))) {
    const n = norm(readFileSync(join(dir, file), "utf8"));
    const hit = FILLER.find(([k]) => n.includes(k));
    if (hit) problems.push(`${dir.slice(ROOT.length + 1)}/${file} contains filler — ${hit[1]}`);
  }
}

if (problems.length > 0) {
  console.error(`✗ Filler-verse check failed (${problems.length}):`);
  for (const p of problems.slice(0, 40)) console.error(`  - ${p}`);
  if (problems.length > 40) console.error(`  … and ${problems.length - 40} more`);
  process.exit(1);
}
console.log("✓ Filler-verse check passed (no invented template verses; Upanishad counts within canon).");
