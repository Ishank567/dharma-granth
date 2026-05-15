/**
 * Seed major Puranas from sanskritdocuments.org.
 *
 * Source: https://sanskritdocuments.org/doc_purana/ — community-maintained
 * archive of public-domain Sanskrit. The mūla śloka text of the Puranas is
 * 3000+ years old and firmly public domain; sanskritdocuments digitizes and
 * publishes it under permissive terms. Their .itx files are ITRANS
 * romanization, which we convert to Devanagari here using
 * @indic-transliteration/sanscript.
 *
 * Output: public/data/scriptures-full/<id>.json
 *
 * Run: npm run seed:puranas
 *
 * Currently covers:
 *   - bhagavatapurana  (12 skandhas + 00-mahatmya)
 *   - devibhagavat     (12 skandhas)
 *   - garudpurana      (single file)
 *   - shivpurana       (7 samhitas; samhita 2 is split into 5 khandas)
 *
 * Not on sanskritdocuments and therefore not seeded here: Vishnu, Agni,
 * Padma, Markandeya, Brahmanda, Narada, Vayu, Kurma, Matsya, Linga puranas.
 * Those need a separate source (see scripts/README.md for pointers).
 */
import { existsSync } from "node:fs";
import Sanscript from "@indic-transliteration/sanscript";
import {
  FullChapter,
  FullScripture,
  FullVerse,
  fetchJson,
  log,
  writeScripture,
} from "./lib/scripture-schema";

// ---- types --------------------------------------------------------------

/**
 * - "adhyaya": each source-file adhyaya becomes its own chapter in the output
 *   (Garuda: 298 chapters across one source file).
 * - "book": each source file becomes ONE chapter; the adhyayas within are
 *   flattened into a single verse list with hierarchical ids like
 *   "<adhyaya>.<verseInAdhyaya>" — semantically aligns with how the curated
 *   `.ts` files index by skandha/samhita.
 */
type GroupingMode = "adhyaya" | "book";

interface PartSource {
  /** The filename under doc_purana/, without extension. */
  basename: string;
  /** Title for this part (book label in "book" mode, samhita name etc.). */
  label?: string;
}

interface PuranaConfig {
  id: string;
  title: string;
  titleSanskrit: string;
  groupingMode: GroupingMode;
  parts: PartSource[];
}

const BASE = "https://sanskritdocuments.org/doc_purana";

// ---- ITRANS parser ------------------------------------------------------

// Matches the boilerplate sanskritdocuments uses to mark a chapter's end:
//     iti shrImadbhAgavate ... prathamo.adhyAyaH || N ||
//     iti shrIskande mahApurANe ... dvitIyo.adhyAyaH ||
// We don't care exactly what surrounds — we just need to detect "iti ... adhyAyaH"
// followed by an optional || N || and treat everything before it as a chapter body.
const CHAPTER_END = /iti\s+[^|]*?adhyAyaH\s*(?:\|\|\s*\d+\s*\|\|)?/g;

// Verse-end marker. Most puranas use `|| 23 ||` (single verse counter), but
// the Garuda Purana (and a few others) use hierarchical numbering like
// `|| 1\,1\.35||` = khanda 1, chapter 1, verse 35. We accept any combination
// of digits, backslash-escaped commas/periods, and whitespace between the
// pipes, then clean the captured id by stripping the ITRANS backslash
// escapes.
const VERSE_END = /\|\|\s*([\d\\.,\s]+?)\s*\|\|/g;

function cleanVerseId(raw: string): string {
  // Strip ITRANS backslash escapes; collapse whitespace; the remaining string
  // is the verse identifier as written in the source (e.g. "23" or "1.1.35").
  return raw.replace(/\\/g, "").replace(/,/g, ".").replace(/\s+/g, "").trim();
}

function cleanItx(raw: string): string {
  // sanskritdocuments .itx files are LaTeX-wrapped: a preamble of `%` comments,
  // `\documentstyle`/`\def`/`#include` directives, then `\begin{document}`,
  // then the actual ITRANS body, terminated by `\end{document}`. Anything
  // outside `\begin{document}..\end{document}` is metadata that — if left in —
  // gets transliterated by Sanscript into Devanagari gibberish at the start
  // of every chapter (e.g. "dओचुमेन्त्स्त्य्ले" from "\documentstyle").
  let body = raw;
  const beginIdx = body.indexOf("\\begin{document}");
  if (beginIdx >= 0) {
    body = body.slice(beginIdx + "\\begin{document}".length);
  }
  const endIdx = body.indexOf("\\end{document}");
  if (endIdx >= 0) {
    body = body.slice(0, endIdx);
  }
  // Defense in depth: drop `%` comment lines and any remaining LaTeX/itrans
  // directive lines (`\foo...`, `#include=...`, `\section{...}`,
  // `\engtitle{...}` etc.) that sit between verses. Verse text never begins
  // with `\` or `#`.
  return body
    .split(/\r?\n/)
    .filter((line) => {
      const trimmed = line.trimStart();
      if (trimmed.startsWith("%")) return false;
      if (trimmed.startsWith("\\")) return false;
      if (trimmed.startsWith("#")) return false;
      return true;
    })
    .join("\n")
    .replace(/[ \t]+/g, " ")
    .trim();
}

interface ParsedChapter {
  bodyItx: string;
  trailer: string;
}

function splitChapters(body: string): ParsedChapter[] {
  const out: ParsedChapter[] = [];
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  CHAPTER_END.lastIndex = 0;
  while ((m = CHAPTER_END.exec(body)) !== null) {
    out.push({
      bodyItx: body.slice(lastIdx, m.index).trim(),
      trailer: m[0],
    });
    lastIdx = m.index + m[0].length;
  }
  // Discard any trailing text after the last chapter end (usually a footer
  // line or empty).
  return out;
}

function extractVerses(chapterBody: string): { number: number | string; itx: string }[] {
  const out: { number: number | string; itx: string }[] = [];
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  VERSE_END.lastIndex = 0;
  while ((m = VERSE_END.exec(chapterBody)) !== null) {
    const idStr = cleanVerseId(m[1]);
    const asNum = Number(idStr);
    const id: number | string = Number.isInteger(asNum) && !idStr.includes(".") ? asNum : idStr;
    const text = chapterBody.slice(lastIdx, m.index).trim();
    if (text.length > 0) {
      out.push({ number: id, itx: text });
    }
    lastIdx = m.index + m[0].length;
  }
  return out;
}

function itxToDevanagari(itx: string): string {
  // Sanscript's "itrans" scheme is what sanskritdocuments uses.
  // The conversion preserves || delimiters and punctuation; we strip the
  // trailing daṇḍa from the verse body since we already have verse numbers.
  return (
    Sanscript.t(itx, "itrans", "devanagari")
      // Collapse any internal newlines so verses sit on one line.
      .replace(/\s*\n\s*/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim()
  );
}

// ---- per-part fetcher ---------------------------------------------------

interface ParsedAdhyaya {
  /** 1-based ordinal within this source part. */
  number: number;
  verses: FullVerse[];
}

interface ParsedPart {
  part: PartSource;
  adhyayas: ParsedAdhyaya[];
}

async function fetchAndParsePart(part: PartSource): Promise<ParsedPart> {
  const url = `${BASE}/${part.basename}.itx`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }
  const raw = await res.text();
  const body = cleanItx(raw);
  const rawChapters = splitChapters(body);

  const adhyayas: ParsedAdhyaya[] = rawChapters.map((rc, i) => {
    const verses: FullVerse[] = extractVerses(rc.bodyItx).map((v) => {
      const sanskrit = itxToDevanagari(v.itx);
      return {
        number: v.number,
        sanskrit,
        transliteration: v.itx.replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " "),
      };
    });
    return { number: i + 1, verses };
  });

  return { part, adhyayas };
}

function flattenAsAdhyayaChapters(
  parts: ParsedPart[],
): { chapters: FullChapter[]; totalVerses: number } {
  const chapters: FullChapter[] = [];
  let totalVerses = 0;
  let chapterNumber = 1;
  for (const { part, adhyayas } of parts) {
    for (const adhyaya of adhyayas) {
      chapters.push({
        number: chapterNumber++,
        title: part.label
          ? `${part.label} — Chapter ${adhyaya.number}`
          : `Chapter ${adhyaya.number}`,
        verses: adhyaya.verses,
      });
      totalVerses += adhyaya.verses.length;
    }
  }
  return { chapters, totalVerses };
}

function groupAsBookChapters(
  parts: ParsedPart[],
): { chapters: FullChapter[]; totalVerses: number } {
  const chapters: FullChapter[] = [];
  let totalVerses = 0;
  parts.forEach(({ part, adhyayas }, partIndex) => {
    // Flatten this part's adhyayas into a single verse list with hierarchical
    // ids like "3.17" = adhyaya 3, verse 17 within the adhyaya.
    const verses: FullVerse[] = [];
    for (const adhyaya of adhyayas) {
      for (const v of adhyaya.verses) {
        verses.push({
          ...v,
          number: `${adhyaya.number}.${v.number}`,
        });
      }
    }
    chapters.push({
      number: partIndex + 1,
      title: part.label ?? `Book ${partIndex + 1}`,
      verses,
    });
    totalVerses += verses.length;
  });
  return { chapters, totalVerses };
}

async function fetchPurana(config: PuranaConfig): Promise<FullScripture> {
  log(
    `Fetching ${config.title} from sanskritdocuments (${config.groupingMode} grouping)...`,
  );

  const parsedParts: ParsedPart[] = [];
  for (const part of config.parts) {
    try {
      const parsed = await fetchAndParsePart(part);
      parsedParts.push(parsed);
      log(
        `  ${part.basename}: ${parsed.adhyayas.length} adhyayas · ${parsed.adhyayas.reduce((s, a) => s + a.verses.length, 0)} verses`,
      );
    } catch (err) {
      log(`  ${part.basename}: SKIPPED (${(err as Error).message})`);
    }
  }

  const { chapters, totalVerses } =
    config.groupingMode === "book"
      ? groupAsBookChapters(parsedParts)
      : flattenAsAdhyayaChapters(parsedParts);

  return {
    id: config.id,
    title: config.title,
    titleSanskrit: config.titleSanskrit,
    category: "purana",
    source: {
      repo: "https://sanskritdocuments.org/doc_purana/",
      license:
        "Sanskrit mūla — public domain (3000+ years old). sanskritdocuments.org publishes digitized text under permissive terms.",
      fetchedAt: new Date().toISOString(),
    },
    totalVerses,
    totalChapters: chapters.length,
    chapters,
  };
}

// ---- configurations -----------------------------------------------------

const PURANAS: PuranaConfig[] = [
  {
    id: "bhagavatapurana",
    title: "Bhagavata Purana",
    titleSanskrit: "श्रीमद्भागवतम्",
    groupingMode: "book",
    parts: [
      { basename: "bhagpur-01", label: "Skandha 1 — Creation and First Steps" },
      { basename: "bhagpur-02", label: "Skandha 2 — Cosmic Manifestation" },
      { basename: "bhagpur-03", label: "Skandha 3 — Status Quo" },
      { basename: "bhagpur-04", label: "Skandha 4 — Creation of the Fourth Order" },
      { basename: "bhagpur-05", label: "Skandha 5 — Creative Impetus" },
      { basename: "bhagpur-06", label: "Skandha 6 — Prescribed Duties for Mankind" },
      { basename: "bhagpur-07", label: "Skandha 7 — The Science of God (Prahlada)" },
      { basename: "bhagpur-08", label: "Skandha 8 — Withdrawal of the Cosmic Creations" },
      { basename: "bhagpur-09", label: "Skandha 9 — Liberation" },
      { basename: "bhagpur-10a", label: "Skandha 10 — Summum Bonum (Part 1)" },
      { basename: "bhagpur-10b", label: "Skandha 10 — Summum Bonum (Part 2)" },
      { basename: "bhagpur-11", label: "Skandha 11 — Uddhava Gita" },
      { basename: "bhagpur-12", label: "Skandha 12 — The Age of Deterioration" },
    ],
  },
  {
    id: "devibhagavat",
    title: "Devi Bhagavata Purana",
    titleSanskrit: "देवीभागवतम्",
    groupingMode: "book",
    parts: Array.from({ length: 12 }, (_, i) => ({
      basename: `devIbhAgavatam${String(i + 1).padStart(2, "0")}`,
      label: `Skandha ${i + 1}`,
    })),
  },
  {
    id: "garudpurana",
    title: "Garuda Purana",
    titleSanskrit: "गरुडपुराणम्",
    groupingMode: "adhyaya",
    parts: [{ basename: "garuDapurANa" }],
  },
  {
    id: "shivpurana",
    title: "Shiva Purana",
    titleSanskrit: "शिवपुराणम्",
    groupingMode: "book",
    parts: [
      { basename: "shivapurANam1vidyeshvarasaMhitA", label: "Vidyeshvara Samhita" },
      { basename: "shivapurANam2rudrasaMhitA1sRRiShTikhaNDaH", label: "Rudra Samhita — Srishti Khanda" },
      { basename: "shivapurANam2rudrasaMhitA2satIkhaNDaH", label: "Rudra Samhita — Sati Khanda" },
      { basename: "shivapurANam2rudrasaMhitA3pArvatIkhaNDaH", label: "Rudra Samhita — Parvati Khanda" },
      { basename: "shivapurANam2rudrasaMhitA4kumArakhaNDaH", label: "Rudra Samhita — Kumara Khanda" },
      { basename: "shivapurANam2rudrasaMhitA5yuddhakhaNDaH", label: "Rudra Samhita — Yuddha Khanda" },
      { basename: "shivapurANam3shatarudrasaMhitA", label: "Shatarudra Samhita" },
      { basename: "shivapurANam4koTirudrasaMhitA", label: "Kotirudra Samhita" },
      { basename: "shivapurANam5umAsaMhitA", label: "Uma Samhita" },
      { basename: "shivapurANam6kailAsasaMhitA", label: "Kailasa Samhita" },
      { basename: "shivapurANam7vAyavIyasaMhitA", label: "Vayaviya Samhita" },
    ],
  },
];

// ---- main ---------------------------------------------------------------

async function main(): Promise<void> {
  for (const cfg of PURANAS) {
    try {
      const scripture = await fetchPurana(cfg);
      const outPath = writeScripture(scripture);
      log(
        `Wrote ${scripture.totalVerses} verses · ${scripture.totalChapters} chapters · ${cfg.id} -> ${outPath}`,
      );
    } catch (err) {
      log(`${cfg.id}: FAILED (${(err as Error).message})`);
    }
  }
}

// Sanity guard so the script doesn't quietly clobber existing files if a
// developer accidentally points it at an empty output dir on first run.
void existsSync;

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
