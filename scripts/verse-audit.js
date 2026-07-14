const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "..", "public", "data", "scriptures-full");
const outFile = path.join(__dirname, "..", "VERSE_AUDIT.md");

function isBlank(value) {
  if (value == null) return true;
  const s = String(value).trim();
  return s.length === 0;
}

function looksLikePlaceholder(value) {
  if (isBlank(value)) return true;
  const v = String(value).trim().toLowerCase();
  if (v.length < 4) return true;
  if (/^translation\s*(not available|pending|coming soon|todo|tbd)/i.test(v)) return true;
  if (/^commentary\s*(not available|pending|coming soon|todo|tbd)/i.test(v)) return true;
  if (/^explanation\s*(not available|pending|coming soon|todo|tbd)/i.test(v)) return true;
  return false;
}

function commentaryOf(v) {
  return v.commentary || v.explanation || "";
}

const files = fs
  .readdirSync(baseDir)
  .filter((f) => f.endsWith(".json"))
  .sort();

const rows = [];
const criticalGaps = [];
const duplicateVerseRefs = [];
const samples = {};

let grandTotal = 0;
let grandLoaded = 0;
let grandMissing = 0;
let grandEmptyCommentary = 0;
let grandEmptyWordMeaning = 0;

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(baseDir, file), "utf8"));
  const id = data.id || file.replace(".json", "");
  const total = typeof data.totalVerses === "number" ? data.totalVerses : 0;
  let loaded = 0;
  let emptySanskrit = 0;
  let emptyTransliteration = 0;
  let emptyTranslation = 0;
  let emptyHindi = 0;
  let emptyCommentary = 0;
  let emptyWordMeaning = 0;
  const commentarySamples = [];
  const verseRefCounts = {};

  for (const ch of data.chapters || []) {
    const chNum = ch.number ?? "?";
    for (const v of ch.verses || []) {
      loaded++;
      const ref = `${chNum}:${v.number}`;
      verseRefCounts[ref] = (verseRefCounts[ref] || 0) + 1;

      if (isBlank(v.sanskrit)) emptySanskrit++;
      if (isBlank(v.transliteration)) emptyTransliteration++;
      if (looksLikePlaceholder(v.translation)) emptyTranslation++;
      if (isBlank(v.hindi)) emptyHindi++;
      const c = commentaryOf(v);
      if (isBlank(c)) {
        emptyCommentary++;
        if (commentarySamples.length < 3) {
          commentarySamples.push(`${id}:${chNum}:${v.number}`);
        }
      }
      if (isBlank(v.wordMeaning)) emptyWordMeaning++;

      if (isBlank(v.sanskrit) || looksLikePlaceholder(v.translation)) {
        criticalGaps.push({
          id,
          chapter: chNum,
          verse: v.number,
          ref,
          occurrence: verseRefCounts[ref],
          sanskrit: isBlank(v.sanskrit),
          translation: looksLikePlaceholder(v.translation),
          snippet: String(v.sanskrit || v.translation || "").slice(0, 60).replace(/\n/g, " "),
        });
      }
    }
  }

  // Track duplicate verse numbers within a scripture (same chapter:verse appears more than once)
  for (const [ref, count] of Object.entries(verseRefCounts)) {
    if (count > 1) {
      duplicateVerseRefs.push({ id, title: data.title || id, ref, count });
    }
  }

  grandTotal += total;
  grandLoaded += loaded;
  grandMissing += Math.max(0, total - loaded);
  grandEmptyCommentary += emptyCommentary;
  grandEmptyWordMeaning += emptyWordMeaning;

  rows.push({
    id,
    title: data.title || id,
    total,
    loaded,
    missing: Math.max(0, total - loaded),
    emptySanskrit,
    emptyTransliteration,
    emptyTranslation,
    emptyHindi,
    emptyCommentary,
    emptyWordMeaning,
    commentarySamples,
  });

  if (emptyCommentary > 0 || emptyWordMeaning > 0) {
    samples[id] = {
      title: data.title || id,
      emptyCommentary,
      emptyWordMeaning,
      commentarySamples,
    };
  }
}

function mdTable(rows, columns) {
  const header = "| " + columns.map((c) => c.label).join(" | ") + " |";
  const separator = "|" + columns.map(() => " --- |").join("");
  const lines = rows.map((r) => {
    return "| " + columns.map((c) => c.get(r)).join(" | ") + " |";
  });
  return [header, separator, ...lines].join("\n");
}

const summaryColumns = [
  { label: "Scripture", get: (r) => r.id },
  { label: "Title", get: (r) => r.title },
  { label: "Declared", get: (r) => String(r.total) },
  { label: "Loaded", get: (r) => String(r.loaded) },
  { label: "Missing", get: (r) => String(r.missing) },
  { label: "∅ Sanskrit", get: (r) => String(r.emptySanskrit) },
  { label: "∅ Transliteration", get: (r) => String(r.emptyTransliteration) },
  { label: "∅ Translation", get: (r) => String(r.emptyTranslation) },
  { label: "∅ Hindi", get: (r) => String(r.emptyHindi) },
  { label: "∅ Commentary", get: (r) => String(r.emptyCommentary) },
  { label: "∅ Word Meaning", get: (r) => String(r.emptyWordMeaning) },
];

const rowsWithCommentaryGaps = rows
  .filter((r) => r.emptyCommentary > 0 || r.emptyWordMeaning > 0)
  .sort((a, b) => b.emptyCommentary - a.emptyCommentary);

const criticalRows = rows.filter(
  (r) => r.emptySanskrit > 0 || r.emptyTranslation > 0 || r.emptyTransliteration > 0 || r.emptyHindi > 0
);

const lines = [
  "# Verse Audit — `public/data/scriptures-full/*.json`",
  "",
  "_Per-verse field completeness across the published scripture JSON corpus._",
  "",
  "## Executive summary",
  "",
  `| Metric | Value |`,
  `|---|---|---|`,
  `| Scriptures | ${files.length} |`,
  `| Declared verses | ${grandTotal.toLocaleString()} |`,
  `| Loaded verses | ${grandLoaded.toLocaleString()} |`,
  `| Not-yet-loaded verses | ${grandMissing.toLocaleString()} |`,
  `| Empty commentary / explanation | ${grandEmptyCommentary.toLocaleString()} |`,
  `| Empty word meaning | ${grandEmptyWordMeaning.toLocaleString()} |`,
  `| Critical gaps (core text) | ${criticalGaps.length} |`,
  `| Duplicate verse refs | ${duplicateVerseRefs.reduce((sum, d) => sum + d.count, 0).toLocaleString()} (${duplicateVerseRefs.length} scriptures) |`,
  "",
  "## Notes",
  "",
  "- **Missing** = `totalVerses` minus actually loaded verses. These scriptures are represented by curated highlights rather than full texts.",
  "- **Critical gaps** are verses missing `sanskrit` or English `translation` (the fields required for rendering a verse at all).",
  "- **Commentary gaps** count both `commentary` and `explanation` fields as empty.",
  "- **Word meaning gaps** count empty `wordMeaning` fields.",
  "",
  "## All scriptures",
  "",
  mdTable(rows, summaryColumns),
  "",
  "## Scriptures with commentary / word-meaning gaps",
  "",
];

if (rowsWithCommentaryGaps.length === 0) {
  lines.push("No commentary or word-meaning gaps found.");
} else {
  lines.push(
    "These are the scriptures that have verse records but are missing explanatory content. " +
      "The biggest blockers are the large Puranas and Vedic texts."
  );
  lines.push("");
  lines.push(
    mdTable(
      rowsWithCommentaryGaps,
      summaryColumns.filter((c) =>
        ["Scripture", "Title", "Loaded", "∅ Commentary", "∅ Word Meaning"].includes(c.label)
      )
    )
  );
  lines.push("");
  lines.push("### Sample verse references with missing commentary");
  lines.push("");
  for (const r of rowsWithCommentaryGaps.slice(0, 20)) {
    if (r.commentarySamples.length === 0) continue;
    lines.push(`- **${r.id}** (${r.title}): ${r.commentarySamples.join(", ")}`);
  }
}

lines.push("");
lines.push("## Scriptures with critical text gaps");
lines.push("");
if (criticalRows.length === 0) {
  lines.push("No critical gaps found — every loaded verse has `sanskrit` and `translation`.");
} else {
  lines.push(mdTable(criticalRows, summaryColumns));
  lines.push("");
  lines.push("### Critical gap references");
  lines.push("");
  // Deduplicate by unique occurrence and list each once
  const seenCritical = new Set();
  let listed = 0;
  for (const g of criticalGaps) {
    const key = `${g.id}:${g.ref}#${g.occurrence}`;
    if (seenCritical.has(key)) continue;
    seenCritical.add(key);
    if (listed >= 50) continue;
    listed++;
    const missing = [];
    if (g.sanskrit) missing.push("sanskrit");
    if (g.translation) missing.push("translation");
    const tag = g.occurrence > 1 ? ` (occurrence ${g.occurrence})` : "";
    lines.push(`- \`${g.id}:${g.chapter}:${g.verse}\`${tag} — missing ${missing.join(", ")}${g.snippet ? ` — “${g.snippet}…”` : ""}`);
  }
  if (criticalGaps.length > listed) {
    lines.push(`- ... and ${criticalGaps.length - listed} more.`);
  }
}

lines.push("");
lines.push("## Duplicate verse references");
lines.push("");
if (duplicateVerseRefs.length === 0) {
  lines.push("No duplicate `chapter:verse` references found within any scripture.");
} else {
  lines.push(
    "These scriptures contain the same `chapter:verse` number more than once. " +
      "Duplicate numbering makes verse links and analysis lookups unreliable."
  );
  lines.push("");
  const dupRows = duplicateVerseRefs
    .sort((a, b) => b.count - a.count)
    .map((d) => ({ scripture: d.id, title: d.title, ref: d.ref, count: d.count }));
  lines.push(
    mdTable(dupRows, [
      { label: "Scripture", get: (r) => r.scripture },
      { label: "Title", get: (r) => r.title },
      { label: "Duplicate ref", get: (r) => r.ref },
      { label: "Occurrences", get: (r) => String(r.count) },
    ])
  );
}

lines.push("");
lines.push("---");
lines.push("");
lines.push(`_Generated by \`scripts/verse-audit.js\` on ${new Date().toISOString().split("T")[0]}._`);

fs.writeFileSync(outFile, lines.join("\n"), "utf8");
console.log(`Wrote ${outFile}`);
console.log(`Scriptures: ${files.length}`);
console.log(`Loaded verses: ${grandLoaded.toLocaleString()}`);
console.log(`Missing verses: ${grandMissing.toLocaleString()}`);
console.log(`Empty commentary/explanation: ${grandEmptyCommentary.toLocaleString()}`);
console.log(`Empty word meaning: ${grandEmptyWordMeaning.toLocaleString()}`);
console.log(`Critical gaps: ${criticalGaps.length}`);
