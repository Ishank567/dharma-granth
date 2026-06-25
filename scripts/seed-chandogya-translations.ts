/**
 * Seed English translations for Chandogya Upanishad from Max Müller's SBE Vol. 1
 * (sacred-texts.com/hin/sbe01, public domain, 1879).
 *
 * Maps 154 SBE pages (I,1 … VIII,15) to published micro-chapters and fills
 * missing `translation` fields without overwriting curated text.
 *
 * Run: npx tsx scripts/seed-chandogya-translations.ts
 */
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { FullScripture, log, writeScripture } from "./lib/scripture-schema";
import {
  fetchSbeHtml,
  hasTranslation,
  parseSbePage,
  type SbeVerse,
} from "./lib/sbe-parser";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PUB_PATH = resolve(ROOT, "public/data/scriptures-full/chandogya.json");
const CACHE_DIR = resolve(ROOT, "scripts/cache/chandogya-sbe");
const SBE_BASE = "https://sacred-texts.com/hin/sbe01";
const FILE_PREFIX = "sbe01";
const FIRST_PAGE = 22;
const PAGE_COUNT = 154;

const FORCE = process.argv.includes("--force");

/** Verses where SBE HTML omits or splits text differently from our JSON. */
const CHANDOGYA_PATCHES: Record<string, string> = {
  "26:2.13.1":
    "He whom one invites to sing, is the Hiṅkâra; he whom one informs, is the Prastâva; he who lies down with his wife, is the Udgîtha; he who lies down again with his wife, is the Pratihâra; he who approaches his time, that is the Nidhana; he who goes beyond, that is the Nidhana. This is the Vâmadevya Sâman, as interwoven in generation.",
  "26:2.13.2":
    "He who thus knows this Vâmadevya, as interwoven in generation, becomes one of a couple; he is born from couples, from couples; he reaches the full life, he lives long, becomes great with children and cattle, great by fame. His rule is, 'He shall not turn away any woman.'",
  "48:3.11.6":
    "One should not teach this to anyone else, even if one would give him this earth surrounded by water, full of wealth; for greater than that is this, yea, greater than that is this.",
  "64:4.8.4":
    "He who knows this and meditates on the foot of Brahman, consisting of four quarters, by the name of Âyatanavat, becomes possessed of a home in this world. He conquers the worlds which offer a home, whoever knows this and meditates on the foot of Brahman, consisting of four quarters, by the name of Âyatanavat.",
  "66:4.10.3": "The student from sorrow was not able to eat.",
  "73:4.17.10":
    "knows this, saves the sacrifice, the sacrificer, and all the other priests). Therefore let a man make him who knows this his Brahman priest, not one who does not know it, who does not know it.",
  "90:0":
    "Then he said to Uddâlaka &Acirc;runi: 'O Gautama, whom do you meditate on as the Self?' He replied: 'The earth only, venerable king.' He said: 'The Self which you meditate on is the Vaisv&acirc;nara Self, called Pratishth&acirc; (firm rest). Therefore you stand firm with offspring and cattle. 'You eat food and see your desire, and whoever thus meditates on that Vaisv&acirc;nara Self, eats food and sees his desire, and has Vedic glory in his house. 'That, however, are but the feet of the Self, and your feet would have given way, if you had not come to me.'",
  "97:5.24.5":
    "'As hungry children here on earth sit (expectantly) round their mother, so do all beings sit round the Agnihotra, yea, round the Agnihotra.'",
  "103:6.6.6": "'Please, Sir, inform me still more,' said the son. 'Be it so, my child,' the father replied.",
  "112:6.15.3":
    "'That which is the subtile essence, in it all that exists has its self. It is the True. It is the Self, and thou, O &Sacute;vetaketu, art it.'",
  "113:6.16.3":
    "'As that (truthful) man is not burnt, thus has all that exists its self in That. It is the True. It is the Self, and thou, O &Sacute;vetaketu, art it.' He understood what he said, yea, he understood it.",
  "141:8.2.10":
    "Whatever object he is attached to, whatever object he desires, by his mere will it comes to him, and having obtained it, he is happy.",
  "144:8.5.4":
    "Now that world of Brahman belongs to those who find the lakes Ara and Nya in the world of Brahman by means of abstinence; for them there is freedom in all the worlds.",
  "145:8.6.6":
    "And while his mind is failing, he is going to the sun. For the sun is the door of the world (of Brahman). Those who know, walk in; those who do not know, are shut out. There is this verse: 'There are a hundred and one arteries of the heart; one of them penetrates the crown of the head; moving upwards by it a man reaches the immortal; the others serve for departing in different directions, yea, in different directions.'",
  "146:8.7.4":
    "Thus saying Indra went from the Devas, Virokana from the Asuras, and both, without having communicated with each other, approached Prag&acirc;pati, holding fuel in their hands, as is the custom for pupils approaching their master.",
  "151:8.12.6":
    "'The Devas who are in the world of Brahman meditate on that Self (as taught by Prag&acirc;pati to Indra, and by Indra to the Devas). Therefore all worlds belong to them, and all desires. He who knows that Self and understands it, obtains all worlds and all desires.' Thus said Prag&acirc;pati, yea, thus said Prag&acirc;pati.",
};

interface ChapterTranslations {
  byMantra: Map<number, string>;
  segments: string[];
}

function verseMantraIndex(verseNumber: number | string, position: number): number {
  const n = String(verseNumber);
  if (n.includes(".")) {
    const parts = n.split(".");
    if (parts.length >= 3) return Number(parts[2]);
  }
  if (/^\d+$/.test(n)) return Number(n);
  return position + 1;
}

function flattenSbeVerses(parsed: SbeVerse[]): ChapterTranslations {
  const byMantra = new Map<number, string>();
  const segments: string[] = [];

  for (const verse of parsed) {
    if (verse.continuation && verse.subOf) {
      segments.push(verse.text);
      continue;
    }

    if (verse.subOf) {
      segments.push(verse.text);
      continue;
    }

    byMantra.set(verse.number, verse.text);
    segments.push(verse.text);
  }

  return { byMantra, segments };
}

function patchKey(chapter: number, verseNumber: number | string): string {
  return `${chapter}:${verseNumber}`;
}

function lookupTranslation(
  chapterNum: number,
  verseNumber: number | string,
  position: number,
  chapterData: ChapterTranslations,
): string | undefined {
  const patch = CHANDOGYA_PATCHES[patchKey(chapterNum, verseNumber)];
  if (patch) return patch;

  const mantra = verseMantraIndex(verseNumber, position);
  const byMantra = chapterData.byMantra.get(mantra);
  if (byMantra) return byMantra;

  return chapterData.segments[position];
}

async function main(): Promise<void> {
  log(`Seeding Chandogya translations from SBE (Max Müller)${FORCE ? " [force]" : ""}…`);

  const scripture = JSON.parse(readFileSync(PUB_PATH, "utf8")) as FullScripture;
  const sbeByChapter = new Map<number, ChapterTranslations>();

  for (let i = 0; i < PAGE_COUNT; i++) {
    const pageNum = FIRST_PAGE + i;
    const chapterNum = i + 1;
    const html = fetchSbeHtml(SBE_BASE, FILE_PREFIX, pageNum, CACHE_DIR);
    const parsed = parseSbePage(html);
    sbeByChapter.set(chapterNum, flattenSbeVerses(parsed));

    if (chapterNum % 20 === 0 || chapterNum === PAGE_COUNT) {
      log(`  fetched ${chapterNum}/${PAGE_COUNT} SBE pages`);
    }
  }

  let filled = 0;
  let skipped = 0;
  let missing = 0;

  for (const chapter of scripture.chapters) {
    const chapterData = sbeByChapter.get(chapter.number);
    if (!chapterData) continue;

    chapter.verses.forEach((verse, idx) => {
      const text = lookupTranslation(chapter.number, verse.number, idx, chapterData);
      if (!text) {
        if (!hasTranslation(verse.translation)) missing++;
        return;
      }

      if (hasTranslation(verse.translation) && !FORCE) {
        skipped++;
        return;
      }

      verse.translation = text;
      filled++;
    });
  }

  const total = scripture.chapters.reduce((n, c) => n + c.verses.length, 0);
  const translated = scripture.chapters.reduce(
    (n, c) => n + c.verses.filter((v) => hasTranslation(v.translation)).length,
    0,
  );

  scripture.source = {
    ...scripture.source,
    translationRepo: `${SBE_BASE}/index.htm`,
    translationLicense:
      "Max Müller translation (1879), Sacred Books of the East Vol. 1 — public domain.",
    translationFetchedAt: new Date().toISOString(),
  };

  const out = writeScripture(scripture);
  log(`✓ ${out}`);
  log(`  filled ${filled} · kept ${skipped} curated · still missing ${missing}`);
  log(`  coverage: ${translated}/${total} (${Math.round((translated / total) * 100)}%)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});