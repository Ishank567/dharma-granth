/**
 * Fetch missing verses from reliable web sources
 * Run: npx tsx scripts/fetch-verses.ts
 * 
 * Reliable sources:
 * - gitasupersite.iitk.ac.in (Gita, Upanishads, etc.)
 * - sacred-texts.com (Vedas, Puranas)
 * - wisdomlib.org (Sanskrit texts)
 * - sa.wikisource.org (Hindi translations)
 */
import { scriptureMap } from "../data/scriptures/index";
import { scriptureCatalog } from "../data/scripture-meta";
import { resolve } from "node:path";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const FULL_DIR = resolve(__dirname, "../public/data/scriptures-full");

interface VerseData {
  number: number;
  sanskrit: string;
  transliteration?: string;
  translation: string;
  hindi?: string;
  wordMeaning?: string;
}

interface ChapterData {
  number: number;
  title: string;
  titleSanskrit?: string;
  verses: VerseData[];
}

interface ScriptureFullData {
  id: string;
  title: string;
  titleSanskrit?: string;
  chapters: ChapterData[];
}

// Available fetchers for different scriptures
const FETCHERS: Record<string, (id: string) => Promise<ScriptureFullData | null>> = {
  // Example fetcher - would need to be implemented for each source
  vishnupurana: fetchFromSacredTexts,
  naradapuran: fetchFromSacredTexts,
  // Add more as needed
};

async function fetchFromSacredTexts(id: string): Promise<ScriptureFullData | null> {
  // This would fetch from sacred-texts.com API or scrape
  // For now, return null - needs actual implementation
  console.log(`Fetching ${id} from sacred-texts.com... (not implemented)`);
  return null;
}

function checkMissingData(): { scriptureId: string; curatedChapters: number; jsonChapters: number; missing: number[] }[] {
  const results = [];

  for (const meta of scriptureCatalog) {
    const curated = scriptureMap[meta.id];
    if (!curated) continue;

    const curatedChapterIds = curated.chapters.map(c => c.id);
    
    const jsonPath = resolve(FULL_DIR, `${meta.id}.json`);
    let jsonChapterNumbers: number[] = [];
    
    if (existsSync(jsonPath)) {
      try {
        const data = JSON.parse(readFileSync(jsonPath, "utf8"));
        jsonChapterNumbers = data.chapters?.map((c: any) => c.number) || [];
      } catch {
        // Invalid JSON
      }
    }

    const missing = curatedChapterIds.filter(id => !jsonChapterNumbers.includes(id));
    
    if (missing.length > 0 || jsonChapterNumbers.length === 0) {
      results.push({
        scriptureId: meta.id,
        curatedChapters: curatedChapterIds.length,
        jsonChapters: jsonChapterNumbers.length,
        missing,
      });
    }
  }

  return results;
}

async function main() {
  const missing = checkMissingData();

  if (missing.length === 0) {
    console.log("✓ All scriptures have complete chapter data!");
    return;
  }

  console.log("\n📚 Scriptures with Missing Full Chapter Data:\n");
  console.log("-".repeat(80));

  for (const item of missing) {
    const meta = scriptureCatalog.find((m: { id: string }) => m.id === item.scriptureId);
    const hasFetcher = item.scriptureId in FETCHERS;
    const fetcherStatus = hasFetcher ? "[Fetcher Available]" : "[No Fetcher]";
    
    console.log(`\n${meta?.title || item.scriptureId} ${fetcherStatus}`);
    console.log(`  Curated chapters: ${item.curatedChapters}`);
    console.log(`  JSON chapters: ${item.jsonChapters}`);
    console.log(`  Missing: [${item.missing.join(", ")}]`);
  }

  console.log("\n" + "=".repeat(80));
  console.log("\nTo add verses, you have these options:\n");
  console.log("1. Manual Entry: Edit the .ts files in data/scriptures/");
  console.log("2. Seed from existing source: Use npm run seed:<scripture>");
  console.log("3. Add fetcher: Implement a fetcher in this script\n");
  console.log("\nRecommended reliable sources for Sanskrit texts:\n");
  console.log("- https://gitasupersite.iitk.ac.in (Gita, Upanishads, Vedas)");
  console.log("- https://www.sacred-texts.com/hin/ (Various Hindu texts)");
  console.log("- https://www.wisdomlib.org/hinduism/ (Puranas, Itihasa)");
  console.log("- https://sa.wikisource.org (Sanskrit texts with Hindi translations)");
  console.log("- https://sanskritdocuments.org (Sanskrit texts)");
  console.log("\n" + "=".repeat(80));
}

main().catch(console.error);
