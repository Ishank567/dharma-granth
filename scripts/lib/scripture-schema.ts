import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

export interface FullVerse {
  number: number | string;
  sanskrit?: string;
  transliteration?: string;
  translation?: string;
  hindi?: string;
  wordMeaning?: string;
  commentary?: string;
}

export interface FullChapter {
  number: number;
  title?: string;
  titleSanskrit?: string;
  verses: FullVerse[];
}

export interface FullScripture {
  id: string;
  title: string;
  titleSanskrit: string;
  category: string;
  source: {
    repo: string;
    license?: string;
    fetchedAt: string;
  };
  totalVerses: number;
  totalChapters: number;
  chapters: FullChapter[];
}

const OUT_ROOT = resolve(process.cwd(), "public/data/scriptures-full");

export function writeScripture(scripture: FullScripture): string {
  const outPath = resolve(OUT_ROOT, `${scripture.id}.json`);
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, JSON.stringify(scripture, null, 2), "utf8");
  return outPath;
}

export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} fetching ${url}`);
  }
  return (await res.json()) as T;
}

export function log(msg: string): void {
  const t = new Date().toISOString().slice(11, 19);
  console.log(`[${t}] ${msg}`);
}
