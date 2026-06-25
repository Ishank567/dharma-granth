/**
 * Merges curated translations, explanations, and missing verses from internal TS files
 * (data/scriptures/*.ts) into the published full JSON files (public/data/scriptures-full/*.json).
 *
 * Matching strategy (in order):
 *  1. Verse id — handles "1.10" → curated id 10 via last dotted segment
 *  2. Position within chapter — curated Upanishads often use global ids (10–14 in khanda 2)
 *  3. Sanskrit prefix overlap — fallback when numbering schemes diverge
 *
 * After merge, near-duplicate verses in the same chapter are collapsed (keeps the
 * entry with translation / cleaner Sanskrit).
 *
 * Run: npx tsx scripts/merge-all.ts
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pathToFileURL } from "url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUB = path.join(ROOT, "public/data/scriptures-full");
const SCRIPT_DIR = path.join(ROOT, "data/scriptures");

interface CuratedVerse {
  id: number | string;
  sanskrit: string;
  transliteration?: string;
  translation?: string;
  hindi?: string;
  explanation?: string;
  meaning?: string;
}

interface PubVerse {
  number: number | string;
  sanskrit?: string;
  transliteration?: string;
  translation?: string;
  hindi?: string;
  commentary?: string;
  wordMeaning?: string;
}

function verseLookupKey(num: number | string): string {
  const s = String(num);
  return s.includes(".") ? (s.split(".").pop() ?? s) : s;
}

function normalizeSanskrit(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0951-\u0954\u0900-\u0903]/g, "")
    .normalize("NFC")
    .replace(/[।॥|]/g, " ")
    .replace(/["""''`]/g, "")
    .replace(/ँ/g, "ं")
    .replace(/\s+/g, " ")
    .replace(/##.*?##/g, "")
    .trim();
}

function sanskritFingerprint(s: string): string {
  const n = normalizeSanskrit(s).replace(/[^\u0900-\u097Fa-zA-Z]/g, "").toLowerCase();
  return n.slice(0, 80);
}

/** Collapse ITRANS / HK variants so seeded transliteration can match curated IAST. */
function transliterationFingerprint(s: string): string {
  return s
    .toLowerCase()
    .replace(/[\\'`.{}³]/g, "")
    .replace(/\{m\+\}/g, "m")
    .replace(/aa/g, "a")
    .replace(/ii/g, "i")
    .replace(/uu/g, "u")
    .replace(/ch/g, "c")
    .replace(/sh/g, "s")
    .replace(/[^a-z]/g, "")
    .slice(0, 60);
}

function hasTranslation(v: PubVerse): boolean {
  return Boolean((v.translation ?? "").trim() || (v.hindi ?? "").trim());
}

function applyCurated(target: PubVerse, curated: CuratedVerse): void {
  if (curated.sanskrit?.trim()) target.sanskrit = curated.sanskrit;
  if (curated.transliteration?.trim()) {
    target.transliteration = curated.transliteration;
  }
  if (curated.translation?.trim()) target.translation = curated.translation;
  if (curated.hindi?.trim()) target.hindi = curated.hindi;
  if (curated.explanation?.trim()) {
    target.commentary = curated.explanation;
    target.wordMeaning = curated.meaning?.trim() || curated.explanation;
  }
}

function findCuratedVerse(
  curatedVerses: CuratedVerse[],
  pubVerse: PubVerse,
  index: number
): CuratedVerse | undefined {
  const key = verseLookupKey(pubVerse.number);
  const byId = curatedVerses.find((v) => String(v.id) === key);
  if (byId) return byId;

  if (index >= 0 && index < curatedVerses.length) return curatedVerses[index];

  const pubNorm = normalizeSanskrit(pubVerse.sanskrit ?? "");
  const pubFp = sanskritFingerprint(pubVerse.sanskrit ?? "");
  if (!pubFp) return undefined;

  // Prefix overlap between two similarly-sized verses
  const byOverlap = curatedVerses.find((v) => {
    const cv = sanskritFingerprint(v.sanskrit ?? "");
    if (!cv) return false;
    return pubFp.startsWith(cv.slice(0, 40)) || cv.startsWith(pubFp.slice(0, 40));
  });
  if (byOverlap) return byOverlap;

  // Seeded JSON often splits one curated śloka into many fragments — inherit
  // the parent block's translation when the published text is contained in it.
  if (pubNorm.length >= 12) {
    let best: CuratedVerse | undefined;
    let bestLen = 0;
    for (const cv of curatedVerses) {
      const cur = normalizeSanskrit(cv.sanskrit ?? "");
      if (!cur || cur.length <= pubNorm.length) continue;
      if (cur.includes(pubNorm) && cur.length > bestLen && cv.translation?.trim()) {
        best = cv;
        bestLen = cur.length;
      }
    }
    if (best) return best;
  }

  const pubTr = transliterationFingerprint(pubVerse.transliteration ?? "");
  if (pubTr.length >= 20) {
    const byTr = curatedVerses.find((cv) => {
      const cvTr = transliterationFingerprint(cv.transliteration ?? "");
      if (!cvTr) return false;
      return pubTr.startsWith(cvTr.slice(0, 30)) || cvTr.startsWith(pubTr.slice(0, 30));
    });
    if (byTr) return byTr;

    let best: CuratedVerse | undefined;
    let bestLen = 0;
    for (const cv of curatedVerses) {
      const cvTr = transliterationFingerprint(cv.transliteration ?? "");
      if (!cvTr || cvTr.length <= pubTr.length || !cv.translation?.trim()) continue;
      if (cvTr.includes(pubTr) && cvTr.length > bestLen) {
        best = cv;
        bestLen = cvTr.length;
      }
    }
    if (best) return best;
  }

  return undefined;
}

/** Search all curated chapters when per-chapter match fails (orphan seeded chapters). */
function findCuratedVerseGlobal(
  allChapters: { verses: CuratedVerse[] }[],
  pubVerse: PubVerse
): CuratedVerse | undefined {
  for (const ch of allChapters) {
    const hit = findCuratedVerse(ch.verses ?? [], pubVerse, -1);
    if (hit?.translation?.trim()) return hit;
  }
  return undefined;
}

function sanskritTokens(s: string): string[] {
  return normalizeSanskrit(s)
    .split(/\s+/)
    .map((t) => t.replace(/[^\u0900-\u097F]/g, ""))
    .filter((t) => t.length > 2);
}

function tokenOverlapRatio(child: string, parent: string): number {
  const cTok = sanskritTokens(child);
  const pTok = sanskritTokens(parent);
  if (cTok.length < 3 || !pTok.length) return 0;
  let pi = 0;
  let matched = 0;
  for (const t of cTok) {
    const head = t.slice(0, Math.min(4, t.length));
    while (pi < pTok.length && !pTok[pi].startsWith(head) && !pTok[pi].includes(head)) {
      pi++;
    }
    if (pi < pTok.length) {
      matched++;
      pi++;
    }
  }
  return matched / cTok.length;
}

function isFragmentOfParent(child: PubVerse, parent: PubVerse): boolean {
  const pubNorm = normalizeSanskrit(child.sanskrit ?? "");
  const parNorm = normalizeSanskrit(parent.sanskrit ?? "");
  const pubTr = transliterationFingerprint(child.transliteration ?? "");
  const parTr = transliterationFingerprint(parent.transliteration ?? "");
  const pubFp = sanskritFingerprint(child.sanskrit ?? "");
  const parFp = sanskritFingerprint(parent.sanskrit ?? "");

  if (pubNorm.length >= 12 && parNorm.includes(pubNorm)) return true;
  if (pubTr.length >= 15 && parTr.includes(pubTr)) return true;
  if (pubFp.length >= 20 && parFp.includes(pubFp)) return true;
  if (pubFp.length >= 20 && parFp.startsWith(pubFp.slice(0, 25))) return true;
  if (tokenOverlapRatio(child.sanskrit ?? "", parent.sanskrit ?? "") >= 0.75) return true;
  return false;
}

/** Copy translation from a fuller sibling when this entry is a seeded fragment. */
function inheritFragmentTranslations(verses: PubVerse[]): void {
  const translated = verses.filter((v) => hasTranslation(v));
  for (const v of verses) {
    if (hasTranslation(v)) continue;
    const parent = translated.find((p) => isFragmentOfParent(v, p));
    if (!parent) continue;
    v.translation = parent.translation;
    v.hindi = parent.hindi;
    if (parent.commentary) {
      v.commentary = parent.commentary;
      v.wordMeaning = parent.wordMeaning;
    }
  }
}

/** Drop untranslated fragments already covered by a fuller translated sibling. */
function removeFragmentDuplicates(verses: PubVerse[]): PubVerse[] {
  const translated = verses.filter((v) => hasTranslation(v));
  if (!translated.length) return verses;

  return verses.filter((v) => {
    if (hasTranslation(v)) return true;
    const pubNorm = normalizeSanskrit(v.sanskrit ?? "");
    const pubTr = transliterationFingerprint(v.transliteration ?? "");
    if (pubNorm.length < 10 && pubTr.length < 15) return false;
    return !translated.some((parent) => isFragmentOfParent(v, parent));
  });
}

/** Drop header-only artifacts and numbered-zero parser glitches. */
function isArtifactVerse(v: PubVerse): boolean {
  const n = String(v.number);
  if (n === "0" || n.startsWith("0.")) return true;
  const san = normalizeSanskrit(v.sanskrit ?? "");
  if (!san) return !hasTranslation(v);
  if (/^(इत्य|॥)/.test(san) && san.length < 120) return true;
  // Seeded line-splits: "… ॥ ११॥ var …" with no translation
  if (!hasTranslation(v) && /॥\s*[\d०-९]+\s*॥/.test(v.sanskrit ?? "")) return true;
  return false;
}

function curatedTranslatedCount(verses: CuratedVerse[]): number {
  return verses.filter((v) => (v.translation ?? "").trim()).length;
}

/** When every curated verse in a chapter is translated, drop untranslated seeded orphans. */
function pruneUntranslatedOrphans(verses: PubVerse[], curatedCount: number): PubVerse[] {
  if (curatedCount <= 0) return verses;
  const trCount = verses.filter(hasTranslation).length;
  if (trCount >= curatedCount) return verses.filter(hasTranslation);
  return verses;
}

/** Collapse repeated verse numbers from over-segmented seed parsers. */
function dedupeByVerseNumber(verses: PubVerse[]): PubVerse[] {
  const byNum = new Map<string, PubVerse>();
  for (const v of verses) {
    const key = verseLookupKey(v.number);
    const existing = byNum.get(key);
    if (!existing || verseScore(v) > verseScore(existing)) {
      byNum.set(key, v);
    }
  }
  return [...byNum.values()].sort((a, b) => {
    const aNum = parseFloat(verseLookupKey(a.number)) || 0;
    const bNum = parseFloat(verseLookupKey(b.number)) || 0;
    return aNum - bNum;
  });
}

function verseScore(v: PubVerse): number {
  let score = 0;
  if ((v.translation ?? "").trim()) score += 4;
  if ((v.hindi ?? "").trim()) score += 3;
  if ((v.commentary ?? "").trim()) score += 2;
  const san = normalizeSanskrit(v.sanskrit ?? "");
  if (san && !san.includes("var") && !san.startsWith("॥")) score += 1;
  return score;
}

function dedupeChapterVerses(verses: PubVerse[]): PubVerse[] {
  const byFp = new Map<string, PubVerse>();

  for (const v of verses) {
    const fp = sanskritFingerprint(v.sanskrit ?? "");
    if (!fp) {
      byFp.set(`__unique_${byFp.size}`, v);
      continue;
    }
    const existing = byFp.get(fp);
    if (!existing || verseScore(v) > verseScore(existing)) {
      byFp.set(fp, v);
    }
  }

  return [...byFp.values()].sort((a, b) => {
    const aNum = parseFloat(verseLookupKey(a.number)) || 0;
    const bNum = parseFloat(verseLookupKey(b.number)) || 0;
    return aNum - bNum;
  });
}

async function loadInternal(id: string) {
  const file = path.join(SCRIPT_DIR, `${id}.ts`);
  if (!fs.existsSync(file)) return null;
  try {
    const mod = await import(pathToFileURL(file).href);
    return (
      Object.values(mod).find(
        (v) => v && typeof v === "object" && Array.isArray((v as { chapters?: unknown }).chapters)
      ) ?? null
    );
  } catch {
    return null;
  }
}

function loadPublished(id: string) {
  const file = path.join(PUB, `${id}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

function writePublished(id: string, data: unknown) {
  const file = path.join(PUB, `${id}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), "utf8");
}

type Patch = { translation: string; hindi: string };

const FRAGMENT_PARENT: Record<string, Record<string, number>> = {
  taittiriya: {
    "1:13": 6,
    "1:14": 6,
    "1:16": 8,
    "1:19": 11,
    "1:20": 11,
    "1:22": 11,
  },
};

function copyVerseFields(target: PubVerse, source: PubVerse): void {
  target.translation = source.translation;
  target.hindi = source.hindi;
  if (source.commentary) {
    target.commentary = source.commentary;
    target.wordMeaning = source.wordMeaning;
  }
}

/** Hardcoded fills for seeded-only passages not yet in curated TS. */
function applyScripturePatches(
  id: string,
  published: { chapters: { number: number; verses: PubVerse[] }[] }
): void {
  const fragMap = FRAGMENT_PARENT[id];
  if (fragMap) {
    for (const ch of published.chapters) {
      const byNum = new Map(ch.verses.map((v) => [Number(v.number), v]));
      for (const [key, parentNum] of Object.entries(fragMap)) {
        const [chNum, fragNum] = key.split(":").map(Number);
        if (chNum !== ch.number) continue;
        const child = byNum.get(fragNum);
        const parent = byNum.get(parentNum);
        if (child && parent && hasTranslation(parent) && !hasTranslation(child)) {
          copyVerseFields(child, parent);
        }
      }
    }
  }

  if (id !== "aitareya") return;

  const patches: [RegExp, Patch][] = [
    [
      /तच्चक्षुषा/,
      {
        translation:
          "He desired to grasp it with the eye; he was not able to grasp it with the eye. If he had grasped it with the eye, he would surely have become blind.",
        hindi:
          "उसने उसे चक्षु से ग्रहण करना चाहा; चक्षु से ग्रहण नहीं कर सका। यदि चक्षु से ग्रहण कर लेता, तो निश्चय ही अन्धा हो जाता।",
      },
    ],
    [
      /तच्छ्रोत्रेणाजिघृक्षत्/,
      {
        translation:
          "He desired to grasp it with the ear; he was not able to grasp it with the ear. If he had grasped it with the ear, he would surely have become deaf.",
        hindi:
          "उसने उसे श्रोत्र से ग्रहण करना चाहा; श्रोत्र से ग्रहण नहीं कर सका। यदि श्रोत्र से ग्रहण कर लेता, तो निश्चय ही बहरा हो जाता।",
      },
    ],
    [
      /तत्त्वचाऽजिघृक्षत्/,
      {
        translation:
          "He desired to grasp it with the skin; he was not able to grasp it with the skin. If he had grasped it with the skin, he would surely have lost sensation.",
        hindi:
          "उसने उसे त्वचा से ग्रहण करना चाहा; त्वचा से ग्रहण नहीं कर सका। यदि त्वचा से ग्रहण कर लेता, तो निश्चय ही संवेदना खो देता।",
      },
    ],
    [
      /तन्मनसाऽजिघृक्षत्/,
      {
        translation:
          "He desired to grasp it with the mind; he was not able to grasp it with the mind. If he had grasped it with the mind, he would surely have perished.",
        hindi:
          "उसने उसे मन से ग्रहण करना चाहा; मन से ग्रहण नहीं कर सका। यदि मन से ग्रहण कर लेता, तो निश्चय ही नष्ट हो जाता।",
      },
    ],
    [
      /तच्छिश्नेनाजिघृक्षत्/,
      {
        translation:
          "He desired to grasp it with the generative organ; he was not able to grasp it with the organ. If he had grasped it with the organ, he would surely have perished.",
        hindi:
          "उसने उसे शिश्न से ग्रहण करना चाहा; शिश्न से ग्रहण नहीं कर सका। यदि शिश्न से ग्रहण कर लेता, तो निश्चय ही नष्ट हो जाता।",
      },
    ],
    [
      /तदपानेनाजिघृक्षत्/,
      {
        translation:
          "He desired to grasp it with apāna; it assented. That indeed is the grasp of food — what is vāyu (breath); for vāyu is indeed life.",
        hindi:
          "उसने उसे अपान से ग्रहण करना चाहा; उसने अनुमति दी। वही अन्न का ग्रह है — जो वायु है; क्योंकि वायु ही आयु (जीवन) है।",
      },
    ],
  ];

  for (const ch of published.chapters) {
    for (const v of ch.verses) {
      if (hasTranslation(v)) continue;
      const san = v.sanskrit ?? "";
      for (const [re, patch] of patches) {
        if (re.test(san)) {
          v.translation = patch.translation;
          v.hindi = patch.hindi;
          break;
        }
      }
    }
  }
}

function countTranslations(chapters: { verses: PubVerse[] }[]): { total: number; tr: number } {
  let total = 0;
  let tr = 0;
  for (const ch of chapters) {
    for (const v of ch.verses ?? []) {
      total++;
      if (hasTranslation(v)) tr++;
    }
  }
  return { total, tr };
}

async function main() {
  const tsFiles = fs.readdirSync(SCRIPT_DIR).filter((f) => f.endsWith(".ts") && f !== "index.ts");
  console.log(`Merging ${tsFiles.length} curated scripture files...\n`);

  let mergedCount = 0;

  for (const file of tsFiles) {
    const id = path.basename(file, ".ts");
    const internal = (await loadInternal(id)) as {
      chapters: {
        id: number;
        title?: string;
        titleSanskrit?: string;
        verses: CuratedVerse[];
      }[];
    } | null;
    const published = loadPublished(id) as {
      chapters: {
        number: number;
        title?: string;
        titleSanskrit?: string;
        verses: PubVerse[];
      }[];
      totalChapters?: number;
      totalVerses?: number;
    } | null;

    if (!internal?.chapters || !published?.chapters) continue;

    const before = countTranslations(published.chapters);

    for (const c of internal.chapters) {
      let pubCh = published.chapters.find((pc) => pc.number === c.id);
      if (!pubCh) {
        pubCh = {
          number: c.id,
          title: c.title,
          titleSanskrit: c.titleSanskrit,
          verses: [],
        };
        published.chapters.push(pubCh);
      }

      pubCh.title = pubCh.title || c.title;
      pubCh.titleSanskrit = pubCh.titleSanskrit || c.titleSanskrit;

      const curatedVerses = c.verses ?? [];
      pubCh.verses = pubCh.verses.map((pv, i) => {
        let curated = findCuratedVerse(curatedVerses, pv, i);
        if (!curated?.translation?.trim()) {
          curated = findCuratedVerseGlobal(internal.chapters, pv) ?? curated;
        }
        if (curated) applyCurated(pv, curated);
        return pv;
      });

      // Append curated verses not present in published (rare)
      const pubKeys = new Set(pubCh.verses.map((v) => verseLookupKey(v.number)));
      for (const cv of curatedVerses) {
        if (pubKeys.has(String(cv.id))) continue;
        pubCh.verses.push({
          number: cv.id,
          sanskrit: cv.sanskrit,
          transliteration: cv.transliteration ?? "",
          translation: cv.translation ?? "",
          hindi: cv.hindi ?? "",
          commentary: cv.explanation ?? "",
          wordMeaning: cv.meaning ?? cv.explanation ?? "",
        });
      }

      pubCh.verses = dedupeByVerseNumber(pubCh.verses);
      pubCh.verses = dedupeChapterVerses(pubCh.verses).filter((v) => !isArtifactVerse(v));
      pubCh.verses = removeFragmentDuplicates(pubCh.verses);
      inheritFragmentTranslations(pubCh.verses);
      pubCh.verses = pruneUntranslatedOrphans(
        pubCh.verses,
        curatedTranslatedCount(curatedVerses)
      );
    }

    applyScripturePatches(id, published);

    // Well-known fragments not yet in curated TS
    if (id === "taittiriya") {
      const ch3 = published.chapters.find((c) => c.number === 3);
      const shanti = ch3?.verses.find((v) => String(v.number) === "16");
      if (shanti && !hasTranslation(shanti)) {
        shanti.translation =
          "OM. May He protect us both together. May He nourish us both together. May we work together with great energy. May our study be enlightening and fruitful. May we not hate each other.";
        shanti.hindi =
          "ॐ। सह नौ आवतु, सह नौ भुनक्तु, सह वीर्यं करवावहै। तेजस्वि नौ अधीतमस्तु मा विद्विषावहै।";
      }
    }

    published.chapters.sort((a, b) => a.number - b.number);
    published.totalChapters = published.chapters.length;
    published.totalVerses = published.chapters.reduce((sum, ch) => sum + ch.verses.length, 0);

    writePublished(id, published);
    mergedCount++;

    const after = countTranslations(published.chapters);
    if (after.tr > before.tr) {
      const pct = after.total ? Math.round((100 * after.tr) / after.total) : 0;
      console.log(
        `  ${id}: ${before.tr}/${before.total} → ${after.tr}/${after.total} translated (${pct}%)`
      );
    }
  }

  console.log(`\nSuccessfully merged ${mergedCount} scriptures.`);
}

main().catch(console.error);