import type { Scripture, ScriptureCategory, ScriptureMeta } from "../types";
import { bhagavadGita } from "./bhagavadgita";
import { ishavasya } from "./ishavasya";
import { kena } from "./kena";
import { katha } from "./katha";
import { mundaka } from "./mundaka";
import { mandukya } from "./mandukya";
import { aitareya } from "./aitareya";
import { taittiriya } from "./taittiriya";
import { chandogya } from "./chandogya";
import { brihadaranyaka } from "./brihadaranyaka";
import { shvetashvatara } from "./shvetashvatara";
import { ramayana } from "./ramayana";
import { ramcharitmanas } from "./ramcharitmanas";
import { bhagavatapurana } from "./bhagavatapurana";
import { vivekchudamani } from "./vivekchudamani";
import { prashna } from "./prashna";
import { yogavasishtha } from "./yogavasishtha";
import { durgasaptashati } from "./durgasaptashati";
import { rigveda } from "./rigveda";
import { samaveda } from "./samaveda";
import { yajurveda } from "./yajurveda";
import { atharvaveda } from "./atharvaveda";
import { mahabharata } from "./mahabharata";
import { vishnupurana } from "./vishnupurana";
import { shivpurana } from "./shivpurana";
import { devibhagavat } from "./devibhagavat";
import { garudpurana } from "./garudpurana";
import { agnipuran } from "./agnipuran";
import { padmapuran } from "./padmapuran";
import { brahmandpuran } from "./brahmandpuran";
import { markandeypuran } from "./markandeypuran";
import { manusmriti } from "./manusmriti";
import { brahmasutra } from "./brahmasutra";
import { scriptureCatalog } from "../scripture-meta";

const scriptureMap: Record<string, Scripture> = {
  [bhagavadGita.id]: bhagavadGita,
  [ishavasya.id]: ishavasya,
  [kena.id]: kena,
  [katha.id]: katha,
  [mundaka.id]: mundaka,
  [mandukya.id]: mandukya,
  [aitareya.id]: aitareya,
  [taittiriya.id]: taittiriya,
  [chandogya.id]: chandogya,
  [brihadaranyaka.id]: brihadaranyaka,
  [shvetashvatara.id]: shvetashvatara,
  [ramayana.id]: ramayana,
  [ramcharitmanas.id]: ramcharitmanas,
  [bhagavatapurana.id]: bhagavatapurana,
  [vivekchudamani.id]: vivekchudamani,
  [prashna.id]: prashna,
  [yogavasishtha.id]: yogavasishtha,
  [durgasaptashati.id]: durgasaptashati,
  [rigveda.id]: rigveda,
  [samaveda.id]: samaveda,
  [yajurveda.id]: yajurveda,
  [atharvaveda.id]: atharvaveda,
  [mahabharata.id]: mahabharata,
  [vishnupurana.id]: vishnupurana,
  [shivpurana.id]: shivpurana,
  [devibhagavat.id]: devibhagavat,
  [garudpurana.id]: garudpurana,
  [agnipuran.id]: agnipuran,
  [padmapuran.id]: padmapuran,
  [brahmandpuran.id]: brahmandpuran,
  [markandeypuran.id]: markandeypuran,
  [manusmriti.id]: manusmriti,
  [brahmasutra.id]: brahmasutra,
};

function hasVerseData(scripture: Scripture | undefined): boolean {
  return Boolean(
    scripture?.chapters.some((chapter) => chapter.verses.length > 0),
  );
}

function withDataAvailability(meta: ScriptureMeta): ScriptureMeta {
  return {
    ...meta,
    hasData: hasVerseData(scriptureMap[meta.id]),
  };
}

export function getScripture(id: string): Scripture | undefined {
  return scriptureMap[id];
}

export function getAllScriptures(): ScriptureMeta[] {
  return scriptureCatalog.map(withDataAvailability);
}

export function getAvailableScriptures(): ScriptureMeta[] {
  return getAllScriptures().filter((scripture) => scripture.hasData);
}

export function getScripturesByCategory(
  category: ScriptureCategory,
): ScriptureMeta[] {
  return getAllScriptures().filter(
    (scripture) => scripture.category === category,
  );
}

export function getScriptureMeta(id: string): ScriptureMeta | undefined {
  const meta = scriptureCatalog.find((scripture) => scripture.id === id);
  return meta ? withDataAvailability(meta) : undefined;
}

/** Honest, real-time count of verses that actually have full hand-authored data on disk. */
export function getRealVerseCount(): number {
  return Object.values(scriptureMap).reduce(
    (total, scripture) =>
      total +
      scripture.chapters.reduce(
        (subtotal, chapter) => subtotal + chapter.verses.length,
        0,
      ),
    0,
  );
}

/** Honest count of chapters that contain at least one authored verse. */
export function getRealChapterCount(): number {
  return Object.values(scriptureMap).reduce(
    (total, scripture) =>
      total +
      scripture.chapters.filter((chapter) => chapter.verses.length > 0).length,
    0,
  );
}

/** How many scriptures actually ship verse data right now. */
export function getRealScriptureCount(): number {
  return Object.values(scriptureMap).filter((s) =>
    s.chapters.some((c) => c.verses.length > 0),
  ).length;
}
