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
import { brahmapuran } from "./brahmapuran";
import { markandeypuran } from "./markandeypuran";
import { harivanshpuran } from "./harivanshpuran";
import { kalkipuran } from "./kalkipuran";
import { kaushitaki } from "./kaushitaki";
import { maitri } from "./maitri";
import { mahanarayana } from "./mahanarayana";
import { kaivalya } from "./kaivalya";
import { amritabindu } from "./amritabindu";
import { tejobindu } from "./tejobindu";
import { jabala } from "./jabala";
import { niralamba } from "./niralamba";
import { muktika } from "./muktika";
import { kurmapuran } from "./kurmapuran";
import { lingapuran } from "./lingapuran";
import { matsyapuran } from "./matsyapuran";
import { naradapuran } from "./naradapuran";
import { narasimhapuran } from "./narasimhapuran";
import { naradabhaktisutra } from "./naradabhaktisutra";
import { shandilyabhaktisutra } from "./shandilyabhaktisutra";
import { manusmriti } from "./manusmriti";
import { brahmasutra } from "./brahmasutra";
import { ravanasamhita } from "./ravanasamhita";
import { skandapuran } from "./skandapuran";
import { shivasamhita } from "./shivasamhita";
import { shivaswarodaya } from "./shivaswarodaya";
import { yogavasistha } from "./yogavasistha";
import { yogarasayanam } from "./yogarasayanam";
import { vinayapatrika } from "./vinayapatrika";
import { brahmavaivartapuran } from "./brahmavaivartapuran";
import { vamanpuran } from "./vamanpuran";
import { varahapuran } from "./varahapuran";
import { vayupuran } from "./vayupuran";
import { viduraniti } from "./viduraniti";
import { nityaKarmaKriya } from "./nityakarmakriya";
import { scriptureCatalog } from "../scripture-meta";

export const scriptureMap: Record<string, Scripture> = {
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
  [brahmapuran.id]: brahmapuran,
  [markandeypuran.id]: markandeypuran,
  [harivanshpuran.id]: harivanshpuran,
  [kalkipuran.id]: kalkipuran,
  [kaushitaki.id]: kaushitaki,
  [maitri.id]: maitri,
  [mahanarayana.id]: mahanarayana,
  [kaivalya.id]: kaivalya,
  [amritabindu.id]: amritabindu,
  [tejobindu.id]: tejobindu,
  [jabala.id]: jabala,
  [niralamba.id]: niralamba,
  [muktika.id]: muktika,
  [kurmapuran.id]: kurmapuran,
  [lingapuran.id]: lingapuran,
  [matsyapuran.id]: matsyapuran,
  [naradapuran.id]: naradapuran,
  [narasimhapuran.id]: narasimhapuran,
  [naradabhaktisutra.id]: naradabhaktisutra,
  [shandilyabhaktisutra.id]: shandilyabhaktisutra,
  [manusmriti.id]: manusmriti,
  [brahmasutra.id]: brahmasutra,
  [ravanasamhita.id]: ravanasamhita,
  [skandapuran.id]: skandapuran,
  [shivasamhita.id]: shivasamhita,
  [shivaswarodaya.id]: shivaswarodaya,
  [yogavasistha.id]: yogavasistha,
  [yogarasayanam.id]: yogarasayanam,
  [vinayapatrika.id]: vinayapatrika,
  [brahmavaivartapuran.id]: brahmavaivartapuran,
  [vamanpuran.id]: vamanpuran,
  [varahapuran.id]: varahapuran,
  [vayupuran.id]: vayupuran,
  [viduraniti.id]: viduraniti,
  [nityaKarmaKriya.id]: nityaKarmaKriya,
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
