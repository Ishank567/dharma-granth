import fs from "node:fs";
import { cleanItx, itxToDevanagari } from "./lib/itrans-parser";

const SD = "https://sanskritdocuments.org/doc_upanishhat/";
const SRC: Record<string, string[]> = {
  ishavasya: ["iisha.itx"], kena: ["kena.itx"], katha: ["katha.itx"], prashna: ["prashna.itx"],
  mundaka: ["mundaka.itx"], mandukya: ["maandu.itx"], aitareya: ["aitareya.itx"], shvetashvatara: ["shveta.itx"],
  taittiriya: ["taitaccent.itx"], kaushitaki: ["kauShItakI.itx", "kaushitaki.itx"],
  maitri: ["maitrI.itx", "maitri.itx", "maitrAyaNIya.itx"], mahanarayana: ["mahAnArAyaNa.itx", "mahanarayana.itx"],
  kaivalya: ["kaivalya.itx", "kaivalyopanishat.itx"], amritabindu: ["amRitabindu.itx", "amritabindu.itx"],
  tejobindu: ["tejobindu.itx", "tejobinduupanishat.itx"], jabala: ["jAbAla.itx", "jabala.itx"],
  niralamba: ["nirAlamba.itx", "niralamba.itx"], muktika: ["muktikA.itx", "muktika.itx", "muktikopanishat.itx"],
};
// Devanagari letters only; drop danda, digits, anusvara, virama, avagraha so sandhi/spacing variants match.
const strip = (s: string) =>
  s.replace(/[^ऀ-ॿ]/g, "").replace(/[।-९ँंऽ्॑-॔]/g, "");

async function source(id: string) {
  for (const f of SRC[id]) {
    const r = await fetch(SD + f);
    if (!r.ok) continue;
    return { f, dev: strip(itxToDevanagari(cleanItx(await r.text()).replace(/\-\s*\n\s*/g, ""))) };
  }
  return null;
}

(async () => {
  const only = process.argv[2];
  const out: Record<string, string[]> = {};
  for (const id of Object.keys(SRC)) {
    if (only && only !== id) continue;
    const s = await source(id);
    if (!s) { console.log(id, "NO SOURCE"); continue; }
    const j = JSON.parse(fs.readFileSync(`public/data/scriptures-full/${id}.json`, "utf8"));
    const bad: string[] = [];
    let tot = 0;
    for (const c of j.chapters) for (const v of c.verses) {
      tot++;
      const n = strip(v.sanskrit);
      if (n.length < 8) continue;
      const sh: string[] = [];
      for (let i = 0; i + 10 <= n.length; i += 5) sh.push(n.slice(i, i + 10));
      const hit = sh.filter((x) => s.dev.includes(x)).length / Math.max(1, sh.length);
      if (hit < 0.6) bad.push(`${c.number}.${v.number}(${Math.round(hit * 100)}%)`);
    }
    out[id] = bad.map((b) => b.replace(/\(.*$/, ""));
    console.log(id.padEnd(15), s.f.padEnd(20), "src", s.dev.length, "total", tot, "unmatched", bad.length, bad.join(" "));
  }
  if (process.env.OUT) fs.writeFileSync(process.env.OUT, JSON.stringify(out, null, 1));
})();
