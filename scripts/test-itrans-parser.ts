/**
 * Offline test for the Purana front-matter fix in lib/itrans-parser.ts.
 *
 * Reconstructs a sanskritdocuments-style .itx whose structure mirrors the real
 * Bhagavata Purana files (the ones that produced the mixed-script "verse 1.1"
 * blobs — see DATA_QUALITY_BACKLOG.md P2b), and asserts the cleaned pipeline
 * now yields a clean Devanagari first verse with no leaked title or invocation.
 *
 * Run: tsx scripts/test-itrans-parser.ts
 */
import {
  cleanItx,
  stripFrontMatter,
  splitPuranaChapters,
  extractVerses,
  itxToDevanagari,
} from "./lib/itrans-parser";

// Mirrors the head of doc_purana/bhagpur-01.itx: LaTeX wrapper, an English
// `\engtitle` + romanized `\itxtitle`, an invocation block of unnumbered ślokas
// (bare `||`), section banners, then the numbered mūla verses.
const FIXTURE = String.raw`% Text title    : Shrimad Bhagavatam Canto 1
\documentstyle[11pt,multicol,itrans]{article}
#include=ijag.inc
\begin{document}
\engtitle{Shrimad Bhagavatam Canto 1 - prathamaskandhaH}
\itxtitle{shrImadbhAgavataM - prathamaskandhaH}
\endtitles
.. OM namo bhagavate vAsudevAya ..
.. prathamaskandhaH ..
saMsArasAgare magnaM dInaM mAM karuNAnidhe |
karmagrAhagR^ihItA~NgaM mAmuddhara bhavArNavAt ||
.. prathamo.adhyAyaH ..
janmAdyasya yato.anvayAditarataH chArtheShvabhij~naH svarAT |
tene brahma hR^idA ya Adikavaye satyaM paraM dhImahi || 1 ||
dharmaH projjhitakaitavo.atra paramo nirmatsarANAM satAM || 2 ||
iti shrImadbhAgavate mahApurANe prathamaskandhe prathamo.adhyAyaH || 1 ||
\end{document}`;

let failures = 0;
function check(name: string, cond: boolean, detail = "") {
  console.log(`  ${cond ? "✓" : "✗"} ${name}${detail ? ` — ${detail}` : ""}`);
  if (!cond) failures++;
}

// ---- run the fixed pipeline ----
const cleaned = cleanItx(FIXTURE);
const body = stripFrontMatter(cleaned);
const chapters = splitPuranaChapters(body);
const verses = extractVerses(chapters[0]?.bodyItx ?? body);
const firstDeva = itxToDevanagari(verses[0]?.itx ?? "");

console.log("cleanItx output:\n  " + cleaned.replace(/\n/g, "\n  ") + "\n");
console.log(`first verse (#${verses[0]?.number}): ${firstDeva}\n`);

// ---- assertions ----
// Fix A: title metadata is gone. Test on "Canto" — an English-only word unique
// to the \engtitle; it must NOT survive. (We can't test on "Bhagavatam" because
// the Sanskrit iti-colophon legitimately says "shrImadbhAgavate".)
check("cleanItx drops the \\engtitle text", !/Canto/i.test(cleaned));
check("cleanItx drops the endtitles marker", !/endtitles/i.test(cleaned));

// Fix B: the invocation block is not folded into verse 1.
check("front matter is stripped before verse 1", !/saMsArasAgare/.test(body));

// Result: verse 1 is the real mūla, clean Devanagari, no Latin gibberish.
check("first verse starts at the real mūla", firstDeva.startsWith("जन्माद्यस्य"));
check("first verse has no Latin gibberish", !/[A-Za-z]/.test(firstDeva));
check("first verse number is 1", String(verses[0]?.number) === "1");
check("second verse is the next śloka", String(verses[1]?.number) === "2");

console.log(`\n${failures === 0 ? "ALL PASSED" : `${failures} FAILED`}`);
process.exit(failures === 0 ? 0 : 1);
