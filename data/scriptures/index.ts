import type { Chapter, Scripture, ScriptureCategory, ScriptureMeta, Verse } from "../types";
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

function withMeaningFallback(verse: Verse): Verse {
  return {
    ...verse,
    meaning: verse.meaning || verse.explanation,
  };
}

function normalizeScripture(scripture: Scripture): Scripture {
  return {
    ...scripture,
    chapters: scripture.chapters.map((chapter): Chapter => ({
      ...chapter,
      verses: chapter.verses.map(withMeaningFallback),
    })),
  };
}

export const scriptureMap: Record<string, Scripture> = {
  [bhagavadGita.id]: normalizeScripture(bhagavadGita),
  [ishavasya.id]: normalizeScripture(ishavasya),
  [kena.id]: normalizeScripture(kena),
  [katha.id]: normalizeScripture(katha),
  [mundaka.id]: normalizeScripture(mundaka),
  [mandukya.id]: normalizeScripture(mandukya),
  [aitareya.id]: normalizeScripture(aitareya),
  [taittiriya.id]: normalizeScripture(taittiriya),
  [chandogya.id]: normalizeScripture(chandogya),
  [brihadaranyaka.id]: normalizeScripture(brihadaranyaka),
  [shvetashvatara.id]: normalizeScripture(shvetashvatara),
  [ramayana.id]: normalizeScripture(ramayana),
  [ramcharitmanas.id]: normalizeScripture(ramcharitmanas),
  [bhagavatapurana.id]: normalizeScripture(bhagavatapurana),
  [vivekchudamani.id]: normalizeScripture(vivekchudamani),
  [prashna.id]: normalizeScripture(prashna),
  [yogavasishtha.id]: normalizeScripture(yogavasishtha),
  [durgasaptashati.id]: normalizeScripture(durgasaptashati),
  [rigveda.id]: normalizeScripture(rigveda),
  [samaveda.id]: normalizeScripture(samaveda),
  [yajurveda.id]: normalizeScripture(yajurveda),
  [atharvaveda.id]: normalizeScripture(atharvaveda),
  [mahabharata.id]: normalizeScripture(mahabharata),
  [vishnupurana.id]: normalizeScripture(vishnupurana),
  [shivpurana.id]: normalizeScripture(shivpurana),
  [devibhagavat.id]: normalizeScripture(devibhagavat),
  [garudpurana.id]: normalizeScripture(garudpurana),
  [agnipuran.id]: normalizeScripture(agnipuran),
  [padmapuran.id]: normalizeScripture(padmapuran),
  [brahmandpuran.id]: normalizeScripture(brahmandpuran),
  [brahmapuran.id]: normalizeScripture(brahmapuran),
  [markandeypuran.id]: normalizeScripture(markandeypuran),
  [harivanshpuran.id]: normalizeScripture(harivanshpuran),
  [kalkipuran.id]: normalizeScripture(kalkipuran),
  [kaushitaki.id]: normalizeScripture(kaushitaki),
  [maitri.id]: normalizeScripture(maitri),
  [mahanarayana.id]: normalizeScripture(mahanarayana),
  [kaivalya.id]: normalizeScripture(kaivalya),
  [amritabindu.id]: normalizeScripture(amritabindu),
  [tejobindu.id]: normalizeScripture(tejobindu),
  [jabala.id]: normalizeScripture(jabala),
  [niralamba.id]: normalizeScripture(niralamba),
  [muktika.id]: normalizeScripture(muktika),
  [kurmapuran.id]: normalizeScripture(kurmapuran),
  [lingapuran.id]: normalizeScripture(lingapuran),
  [matsyapuran.id]: normalizeScripture(matsyapuran),
  [naradapuran.id]: normalizeScripture(naradapuran),
  [narasimhapuran.id]: normalizeScripture(narasimhapuran),
  [naradabhaktisutra.id]: normalizeScripture(naradabhaktisutra),
  [shandilyabhaktisutra.id]: normalizeScripture(shandilyabhaktisutra),
  [manusmriti.id]: normalizeScripture(manusmriti),
  [brahmasutra.id]: normalizeScripture(brahmasutra),
  [ravanasamhita.id]: normalizeScripture(ravanasamhita),
  [skandapuran.id]: normalizeScripture(skandapuran),
  [shivasamhita.id]: normalizeScripture(shivasamhita),
  [shivaswarodaya.id]: normalizeScripture(shivaswarodaya),
  [yogavasistha.id]: normalizeScripture(yogavasistha),
  [yogarasayanam.id]: normalizeScripture(yogarasayanam),
  [vinayapatrika.id]: normalizeScripture(vinayapatrika),
  [brahmavaivartapuran.id]: normalizeScripture(brahmavaivartapuran),
  [vamanpuran.id]: normalizeScripture(vamanpuran),
  [varahapuran.id]: normalizeScripture(varahapuran),
  [vayupuran.id]: normalizeScripture(vayupuran),
  [viduraniti.id]: normalizeScripture(viduraniti),
  [nityaKarmaKriya.id]: normalizeScripture(nityaKarmaKriya),
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
