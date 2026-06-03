/**
 * Shared parser for sanskritdocuments.org .itx files.
 *
 * The format is a LaTeX wrapper around ITRANS-romanized Sanskrit. We strip
 * the wrapper, then split the body into chapters and verses based on the
 * conventional end-markers used throughout the corpus.
 */
import Sanscript from "@indic-transliteration/sanscript";

/**
 * Drop the LaTeX preamble and any leftover directive lines so only the
 * ITRANS verse body remains.
 *
 * sanskritdocuments .itx files look like:
 *
 *     % header comments
 *     \documentstyle[11pt,multicol,itrans]{article}
 *     #include=ijag.inc
 *     \def\engtitle#1{...}
 *     \begin{document}
 *     ... ITRANS verses, \section{...}, \engtitle{...} interleaved ...
 *     \end{document}
 *
 * If the preamble survives, Sanscript transliterates `\documentstyle` to
 * `दओचुमेन्त्स्त्य्ले` and the result is gibberish at the head of every chapter.
 */
export function cleanItx(raw: string): string {
  let body = raw;
  const beginIdx = body.indexOf("\\begin{document}");
  if (beginIdx >= 0) {
    body = body.slice(beginIdx + "\\begin{document}".length);
  }
  const endIdx = body.indexOf("\\end{document}");
  if (endIdx >= 0) {
    body = body.slice(0, endIdx);
  }
  
  // Unpack LaTeX tags containing actual text/chapter boundaries
  body = body.replace(/\\(section|centerline|chapter|engtitle|itxtitle|title)\{(.*?)\}/g, "$2");

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

/**
 * Matches the boilerplate sanskritdocuments uses to mark a chapter's end:
 *     iti ... adhyAyaH || N ||
 *     iti ... khaNDaH || ... ||
 * Used for puranas. Upanishads typically use a different (or no) chapter
 * marker — see `splitUpanishadChapters` below.
 */
const CHAPTER_END_PURANA = /iti\s+[^|]*?(adhyAyaH|khaNDaH)\s*(?:\|\|\s*\d+\s*\|\|)?/g;

/**
 * Matches an Upanishad chapter (khaNDa / valli / brAhmaNa / adhyAya / mantra)
 * end marker. More permissive than the purana variant because Upanishads use
 * many naming conventions for their sub-divisions.
 */
const CHAPTER_END_UPANISHAD = /iti\s+[^|]*?(?:adhyAyaH|khaNDaH|brAhmaNam|vallI|prashnaH|prashnopaniShat|mantraH|kANDam|anuvAkaH|upaniShat)\s*(?:\|\|\s*[\d.]*\s*\|\|)?/gi;

/**
 * Verse-end marker: `|| 23 ||` or hierarchical `|| 1\,1\.35 ||`. Accepts
 * arbitrary combinations of digits, backslash-escaped commas/periods, and
 * whitespace between the pipes.
 */
const VERSE_END = /\|\|\s*([\d\\.,\s]+?)\s*\|\|/g;

export function cleanVerseId(raw: string): string {
  return raw.replace(/\\/g, "").replace(/,/g, ".").replace(/\s+/g, "").trim();
}

export interface ParsedChapter {
  bodyItx: string;
  trailer: string;
}

export function splitByRegex(body: string, re: RegExp): ParsedChapter[] {
  const out: ParsedChapter[] = [];
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  re.lastIndex = 0;
  while ((m = re.exec(body)) !== null) {
    out.push({
      bodyItx: body.slice(lastIdx, m.index).trim(),
      trailer: m[0],
    });
    lastIdx = m.index + m[0].length;
  }
  return out;
}

export function splitPuranaChapters(body: string): ParsedChapter[] {
  return splitByRegex(body, CHAPTER_END_PURANA);
}

export function splitUpanishadChapters(body: string): ParsedChapter[] {
  return splitByRegex(body, CHAPTER_END_UPANISHAD);
}

export interface RawVerse {
  number: number | string;
  itx: string;
}

export function extractVerses(chapterBody: string): RawVerse[] {
  const out: RawVerse[] = [];
  let lastIdx = 0;
  let m: RegExpExecArray | null;
  VERSE_END.lastIndex = 0;
  while ((m = VERSE_END.exec(chapterBody)) !== null) {
    const idStr = cleanVerseId(m[1]);
    const asNum = Number(idStr);
    const id: number | string =
      Number.isInteger(asNum) && !idStr.includes(".") ? asNum : idStr;
    const text = chapterBody.slice(lastIdx, m.index).trim();
    if (text.length > 0) {
      out.push({ number: id, itx: text });
    }
    lastIdx = m.index + m[0].length;
  }
  return out;
}

export function itxToDevanagari(itx: string): string {
  return (
    Sanscript.t(itx, "itrans", "devanagari")
      .replace(/\s*\n\s*/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim()
  );
}

export function normalizeItxLine(itx: string): string {
  return itx.replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " ").trim();
}
