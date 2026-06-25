/**
 * P2b remainder — targeted fixes for the 16 mixed-script verses that survive
 * the seed-parser fix and the clean-mixed-headers allowlist.
 *
 * Usage:
 *   npx tsx scripts/fix-mixed-script-verses.ts
 *   npx tsx scripts/fix-mixed-script-verses.ts --write
 */
import Sanscript from "@indic-transliteration/sanscript";
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "public",
  "data",
  "scriptures-full",
);
const WRITE = process.argv.includes("--write");

interface Verse {
  number?: number | string;
  sanskrit?: string;
  transliteration?: string;
  [k: string]: unknown;
}
interface Scripture {
  id: string;
  totalVerses?: number;
  chapters: { number?: number; verses: Verse[] }[];
}

function load(id: string): Scripture {
  return JSON.parse(readFileSync(join(DIR, `${id}.json`), "utf-8")) as Scripture;
}

function save(doc: Scripture): void {
  writeFileSync(join(DIR, `${doc.id}.json`), JSON.stringify(doc, null, 2) + "\n", "utf-8");
}

function findVerse(
  doc: Scripture,
  num: string,
  chapter?: number,
): Verse | undefined {
  for (const c of doc.chapters) {
    if (chapter !== undefined && c.number !== chapter) continue;
    for (const v of c.verses) {
      if (String(v.number) === num) return v;
    }
  }
  return undefined;
}

function removeVerse(doc: Scripture, num: string, chapter?: number): boolean {
  for (const c of doc.chapters) {
    if (chapter !== undefined && c.number !== chapter) continue;
    const before = c.verses.length;
    c.verses = c.verses.filter((v) => String(v.number) !== num);
    if (c.verses.length < before) {
      if (typeof doc.totalVerses === "number") doc.totalVerses -= 1;
      return true;
    }
  }
  return false;
}

/** Keep Devanagari through first long Latin run (GRETIL duplicate tail). */
function devanagariBeforeLatinTail(s: string): string {
  const m = s.match(
    /^(.*?)(?:\s*(?:मर्क्\s*\d+\s+)?[a-z]{4,}|[।॥]\s*[a-z]{3,})/i,
  );
  const head = (m?.[1] ?? s).trim();
  return head
    .replace(/\s*\[[^\]]+\]\s*/g, " ")
    .replace(/\s*मन्त्र\s*\d+\s*/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function itransToDevanagariLine(line: string): string {
  const cleaned = line
    .replace(/\|\|\s*\d+[^|]*$/g, "")
    .replace(/\d+।\d+/g, "")
    .trim();
  try {
    return Sanscript.t(cleaned, "itrans", "devanagari");
  } catch {
    return cleaned;
  }
}

/** Hand-verified full-Devanagari recovery for partially romanized seed lines. */
const YOGARASAYANAM_CLEAN: Record<string, string> = {
  "1:1":
    "शरीरं साधनं यस्य जरामरणवर्जितम् | रसायनं तदायाति योगसिद्धिः करस्थिता ||",
  "1:2":
    "षट्कर्मैः शुद्धिमाप्नोति मलाकुलितदेहयुक् | ततोऽसनप्राणायाममुद्राभ्यासशुद्धधीः ||",
  "2:2":
    "सम्यगाहारः सततं सम्यगासनसंस्थितिः | सम्यग्प्राणोऽनिलः शुद्धः सम्यग्ज्ञानं रसायनम् ||",
  "3:1":
    "कुण्डलिनी कुलकुण्डली मूलाधारे निवेशिता | उत्थिता सुषुम्नामार्गेण अमृतं स्रावयेत् शिरः ||",
  "3:2":
    "योऽनुभूय परमानन्दममृतरससम्प्लवात् | भस्मीभवन्ति रोगाः स जीवन्मुक्त उदाहृतः ||",
};

interface Patch {
  id: string;
  num: string;
  chapter?: number;
  remove?: boolean;
  fix?: (v: Verse) => void;
}

const PATCHES: Patch[] = [
  ...([7, 8, 9, 10, 11] as const).map((chapter) => ({
    id: "shivpurana",
    chapter,
    num: "1.0",
    remove: true,
  })),
  {
    id: "manusmriti",
    chapter: 7,
    num: "7.87",
    fix: (v) => {
      const m = (v.sanskrit ?? "").match(/\(([^)]+)\)/);
      v.sanskrit = m?.[1]?.trim() ?? devanagariBeforeLatinTail(v.sanskrit ?? "");
    },
  },
  {
    id: "manusmriti",
    chapter: 7,
    num: "7.206",
    fix: (v) => {
      const src = v.transliteration ?? v.sanskrit ?? "";
      const m = src.match(
        /daivena vidhinA yuktaM mAnuShyaM yatpravartate\s*\|\s*parikleshena mahatA tadarthasya samAdhakam/i,
      );
      if (m) {
        v.sanskrit = itransToDevanagariLine(m[0]);
      } else {
        v.sanskrit = devanagariBeforeLatinTail(v.sanskrit ?? "");
      }
    },
  },
  {
    id: "brihadaranyaka",
    chapter: 20,
    num: "25",
    fix: (v) => {
      v.sanskrit = devanagariBeforeLatinTail(v.sanskrit ?? "");
    },
  },
  {
    id: "brihadaranyaka",
    chapter: 24,
    num: "3",
    fix: (v) => {
      v.sanskrit =
        "मन्त्र ३ तद्यथा तृणजलायुका तृणस्यान्तं गत्वाऽन्यमाक्रममाक्रम्यात्मानमुपसंहरत्येवमेवायमात्मेदं शरीरं निहत्याविद्यां गमयित्वान्यमाक्रममाक्रम्यात्मानमुपसंहरति";
    },
  },
  {
    id: "brihadaranyaka",
    chapter: 24,
    num: "22",
    fix: (v) => {
      const head = (v.sanskrit ?? "").split(/\s*मर्क्\s*\d+\s+/)[0] ?? "";
      v.sanskrit = devanagariBeforeLatinTail(head);
    },
  },
  {
    id: "brihadaranyaka",
    chapter: 43,
    num: "6",
    fix: (v) => {
      v.sanskrit =
        "मन्त्र ६ अथैनमाचामति तत्सवितुर्वरेण्यम् । मधु वाता ऋतायते मधु क्षरन्ति सिन्धवः । माध्वीर्नः सन्त्वोषधीः । भूः स्वाहा । भर्गो देवस्य धीमहि मधु नक्तमुतोषसो मधुमत्पार्थिवं रजः । मधु द्यौरस्तु नः पिता । भुवः स्वाहा । धियो यो नः प्रचोदयात् । मधुमान्नो वनस्पतिर् मधुमाँ अस्तु सूर्यः । माध्वीर्गावो भवन्तु नः । स्वः स्वाहेति । सर्वां च सावित्रीमन्वाह सर्वाश्च मधुमतीर् ॐ";
    },
  },
  ...Object.entries(YOGARASAYANAM_CLEAN).map(([key, text]) => {
    const [chapter, num] = key.split(":").map(Number);
    return {
      id: "yogarasayanam",
      chapter,
      num: String(num),
      fix: (v: Verse) => {
        v.sanskrit = text;
      },
    };
  }),
];

const touched = new Map<string, Scripture>();
let changes = 0;

for (const patch of PATCHES) {
  if (!touched.has(patch.id)) touched.set(patch.id, load(patch.id));
  const doc = touched.get(patch.id)!;
  const label = `ch${patch.chapter ?? "?"} v${patch.num}`;

  if (patch.remove) {
    const removed = removeVerse(doc, patch.num, patch.chapter);
    if (removed) {
      changes++;
      console.log(`  [${patch.id} ${label}] REMOVED title blob`);
    }
    continue;
  }

  const v = findVerse(doc, patch.num, patch.chapter);
  if (!v) {
    console.log(`  [${patch.id} ${label}] NOT FOUND — skipped`);
    continue;
  }
  const before = v.sanskrit ?? "";
  patch.fix?.(v);
  const after = v.sanskrit ?? "";
  if (before !== after) {
    changes++;
    console.log(`  [${patch.id} ${label}]`);
    console.log(`    before: ${JSON.stringify(before.slice(0, 90))}`);
    console.log(`    after:  ${JSON.stringify(after.slice(0, 90))}`);
  }
}

if (WRITE) {
  for (const doc of touched.values()) save(doc);
  console.log(`\nApplied ${changes} fixes.`);
} else {
  console.log(`\n[dry run] Would apply ${changes} fixes. Re-run with --write.`);
}