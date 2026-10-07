import fs from "node:fs";
const p = "scripts/cache/ai-translations/mahabharata-054.tsv";
const fix = fs.readFileSync("scratch/fix.tsv", "utf8").split(/\r?\n/).filter(Boolean);
const inRegion = (r) => {
  const m = r.match(/^mahabharata:12:(\d+)\.(\d+)/);
  if (!m) return false;
  const ch = +m[1], v = +m[2];
  return (ch === 44 && v >= 6) || ch === 45 || (ch === 46 && v <= 35);
};
let lines = fs.readFileSync(p, "utf8").split(/\r?\n/).filter(Boolean);
const before = lines.length;
lines = lines.filter((l) => !inRegion(l.split("\t")[0]));
const kept = lines.length;
const strip = (l) => l.replace(/^(mahabharata:12:(?:45\.2|46\.2|46\.13)\t)\[[A-Za-z]+ said:\] /, "$1");
const out = [...lines, ...fix.map(strip)];
fs.writeFileSync(p, out.join("\n") + "\n");
console.log({ before, kept, fix: fix.length, after: out.length });
