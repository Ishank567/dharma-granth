import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

const dir = resolve("public/data/scriptures-full");
const files = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();

interface Row {
  id: string;
  total: number;
  translated: number;
  missing: number;
  pct: number;
}

const rows: Row[] = [];
for (const f of files) {
  const s = JSON.parse(readFileSync(resolve(dir, f), "utf8")) as {
    id?: string;
    totalVerses?: number;
    chapters?: { verses: { translation?: string }[] }[];
  };
  const total =
    s.chapters?.reduce((n, c) => n + c.verses.length, 0) ?? s.totalVerses ?? 0;
  const translated =
    s.chapters?.reduce(
      (n, c) => n + c.verses.filter((v) => v.translation?.trim()).length,
      0,
    ) ?? 0;
  rows.push({
    id: s.id ?? f.replace(".json", ""),
    total,
    translated,
    missing: total - translated,
    pct: total ? Math.round((translated / total) * 100) : 0,
  });
}

rows.sort((a, b) => b.missing - a.missing);

console.log("WORST GAPS (by missing count):");
for (const r of rows.filter((x) => x.missing > 0).slice(0, 25)) {
  console.log(
    `${String(r.pct).padStart(3)}%  ${r.translated}/${r.total}  missing ${r.missing}  ${r.id}`,
  );
}

const upanishads = new Set([
  "aitareya",
  "brihadaranyaka",
  "chandogya",
  "ishavasya",
  "jabala",
  "kaivalya",
  "kaushitaki",
  "katha",
  "kena",
  "mahanarayana",
  "maitri",
  "mandukya",
  "mundaka",
  "niralamba",
  "prashna",
  "shvetashvatara",
  "taittiriya",
  "tejobindu",
]);

console.log("\nPRINCIPAL UPANISHADS:");
for (const r of rows
  .filter((x) => upanishads.has(x.id))
  .sort((a, b) => a.pct - b.pct)) {
  console.log(
    `${String(r.pct).padStart(3)}%  ${r.translated}/${r.total}  missing ${r.missing}  ${r.id}`,
  );
}

const mid = rows
  .filter((x) => x.total > 0 && x.total <= 2000 && x.missing > 0)
  .sort((a, b) => b.missing - a.missing);

console.log("\nMID-SIZE GAPS (≤2000 verses):");
for (const r of mid.slice(0, 15)) {
  console.log(
    `${String(r.pct).padStart(3)}%  ${r.translated}/${r.total}  missing ${r.missing}  ${r.id}`,
  );
}

const notable = [
  "bhagavadgita",
  "vivekchudamani",
  "durgasaptashati",
  "brahmasutra",
  "ramayana",
  "ramcharitmanas",
];
console.log("\nNOTABLE TEXTS:");
for (const id of notable) {
  const r = rows.find((x) => x.id === id);
  if (r) {
    console.log(
      `${String(r.pct).padStart(3)}%  ${r.translated}/${r.total}  missing ${r.missing}  ${r.id}`,
    );
  }
}

console.log(
  `\nCOMPLETE: ${rows.filter((x) => x.missing === 0).length}/${rows.length}`,
);