/**
 * Seed the four Vedas from the public DharmicData dataset.
 *
 * Source: https://github.com/bhavykhatri/DharmicData
 * Output: public/data/scriptures-full/{rigveda,atharvaveda,yajurveda,samaveda}.json
 *
 * Only Sanskrit mūla text is loaded here — those verses are firmly public
 * domain. Translations should be loaded separately from explicitly-licensed
 * sources, or generated via the /api/interpret endpoint.
 *
 * Run: npm run seed:vedas
 */
import {
  FullChapter,
  FullScripture,
  FullVerse,
  fetchJson,
  log,
  writeScripture,
} from "./lib/scripture-schema";

const BASE = "https://raw.githubusercontent.com/bhavykhatri/DharmicData/master";

interface VedaSpec {
  id: string;
  title: string;
  titleSanskrit: string;
  repoFolder: string;
  filePattern: (n: number) => string;
  unit: "Mandala" | "Kanda";
  unitSanskrit: string;
  count: number;
}

const VEDAS: VedaSpec[] = [
  {
    id: "rigveda",
    title: "Rig Veda",
    titleSanskrit: "ऋग्वेद",
    repoFolder: "Rigveda",
    filePattern: (n) => `rigveda_mandala_${n}.json`,
    unit: "Mandala",
    unitSanskrit: "मण्डल",
    count: 10,
  },
  {
    id: "atharvaveda",
    title: "Atharva Veda",
    titleSanskrit: "अथर्ववेद",
    repoFolder: "AtharvaVeda",
    filePattern: (n) => `atharvaveda_kaanda_${n}.json`,
    unit: "Kanda",
    unitSanskrit: "काण्ड",
    count: 20,
  },
];

async function processVeda(spec: VedaSpec): Promise<void> {
  log(`Fetching ${spec.title} from DharmicData...`);
  const chapters: FullChapter[] = [];
  let totalVerses = 0;

  for (let n = 1; n <= spec.count; n++) {
    const url = `${BASE}/${spec.repoFolder}/${spec.filePattern(n)}`;
    let raw: unknown;
    try {
      raw = await fetchJson<unknown>(url);
    } catch (err) {
      log(`  ${spec.unit} ${n}: skipped (${(err as Error).message})`);
      continue;
    }

    // The DharmicData files are heterogenous — sometimes arrays of strings,
    // sometimes arrays of objects, sometimes nested under a sukta key.
    const verses: FullVerse[] = [];
    const pushVerse = (text: string, index: number) => {
      const trimmed = text.trim();
      if (trimmed.length < 3) return;
      verses.push({ number: index + 1, sanskrit: trimmed });
    };

    if (Array.isArray(raw)) {
      raw.forEach((item, i) => {
        if (typeof item === "string") {
          pushVerse(item, i);
        } else if (item && typeof item === "object") {
          const obj = item as Record<string, unknown>;
          const text =
            (typeof obj.text === "string" && obj.text) ||
            (typeof obj.sanskrit === "string" && obj.sanskrit) ||
            (typeof obj.mantra === "string" && obj.mantra) ||
            (typeof obj.verse === "string" && obj.verse) ||
            "";
          if (text) pushVerse(text, i);
        }
      });
    }

    chapters.push({
      number: n,
      title: `${spec.unit} ${n}`,
      titleSanskrit: `${spec.unitSanskrit} ${n}`,
      verses,
    });
    totalVerses += verses.length;
    log(`  ${spec.unit} ${n}: ${verses.length} verses`);
  }

  const scripture: FullScripture = {
    id: spec.id,
    title: spec.title,
    titleSanskrit: spec.titleSanskrit,
    category: "veda",
    source: {
      repo: "https://github.com/bhavykhatri/DharmicData",
      license: "Sanskrit mula text — public domain. Verify any translations separately.",
      fetchedAt: new Date().toISOString(),
    },
    totalVerses,
    totalChapters: chapters.length,
    chapters,
  };

  const outPath = writeScripture(scripture);
  log(`Wrote ${totalVerses} ${spec.title} verses -> ${outPath}`);
}

interface YajurAdhyaya {
  veda: string;
  samhita: string;
  adhyaya: number;
  text: string;
}

/**
 * Yajurveda has a different DharmicData layout: a single file with an array
 * of 40 adhyāyas, each holding a single Devanagari `text` block where verses
 * are delimited by `।। N ।।` Devanagari numerals.
 */
async function processYajurveda(): Promise<void> {
  log("Fetching Yajur Veda (Shukla, Vajasneyi-Madhyandina recension)...");
  const url = `${BASE}/Yajurveda/vajasneyi_madhyadina_samhita.json`;
  let adhyayas: YajurAdhyaya[];
  try {
    adhyayas = await fetchJson<YajurAdhyaya[]>(url);
  } catch (err) {
    log(`  yajurveda: skipped (${(err as Error).message})`);
    return;
  }

  // ।। N ।। with optional Devanagari numerals 1-9 + 0-9 + variant numerals.
  // The DharmicData rendering uses standard Devanagari digits (० १ २ ...) but
  // also includes occasional Latin digits. Accept both.
  const VERSE_END = /।।\s*([०-९0-9]+)\s*।।/g;

  const chapters: FullChapter[] = [];
  let totalVerses = 0;

  for (const adhyaya of adhyayas) {
    const verses: FullVerse[] = [];
    const text = adhyaya.text;
    let lastIdx = 0;
    let m: RegExpExecArray | null;
    VERSE_END.lastIndex = 0;
    while ((m = VERSE_END.exec(text)) !== null) {
      const verseText = text.slice(lastIdx, m.index).trim();
      if (verseText.length >= 3) {
        verses.push({ number: Number(m[1].replace(/[०-९]/g, (d) => String("०१२३४५६७८९".indexOf(d)))) || verses.length + 1, sanskrit: verseText });
      }
      lastIdx = m.index + m[0].length;
    }

    chapters.push({
      number: adhyaya.adhyaya,
      title: `Adhyāya ${adhyaya.adhyaya}`,
      titleSanskrit: `अध्याय ${adhyaya.adhyaya}`,
      verses,
    });
    totalVerses += verses.length;
    log(`  Adhyāya ${adhyaya.adhyaya}: ${verses.length} verses`);
  }

  const scripture: FullScripture = {
    id: "yajurveda",
    title: "Yajur Veda",
    titleSanskrit: "यजुर्वेद",
    category: "veda",
    source: {
      repo: "https://github.com/bhavykhatri/DharmicData",
      license: "Sanskrit mūla — public domain. Vajasneyi-Madhyandina samhitā (Shukla Yajurveda).",
      fetchedAt: new Date().toISOString(),
    },
    totalVerses,
    totalChapters: chapters.length,
    chapters,
  };

  const outPath = writeScripture(scripture);
  log(`Wrote ${totalVerses} Yajur Veda verses · ${chapters.length} adhyāyas -> ${outPath}`);
}

async function main(): Promise<void> {
  for (const spec of VEDAS) {
    await processVeda(spec);
  }
  await processYajurveda();
  log("Note: Sama Veda is not yet in this seeder.");
  log("Most of its mantras are Rig Veda verses set to chant patterns; needs a dedicated source like Aitareya Aranyaka or VedaWeb to seed properly.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
