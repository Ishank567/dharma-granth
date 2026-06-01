/**
 * Seed scriptures from Gita Supersite IIT Kanpur API
 * Run: npx tsx scripts/seed-from-supersite.ts
 * 
 * Available on Gita Supersite:
 * - Bhagavad Gita (complete with all commentaries)
 * - 10 Principal Upanishads
 * - Some Puranas
 */

import { resolve } from "node:path";
import { writeFileSync } from "node:fs";

const FULL_DIR = resolve(__dirname, "../public/data/scriptures-full");
const SUPERSITE_API = "https://www.gitasupersite.iitk.ac.in/sites/default/files/gita/";

interface SupersiteVerse {
  chapter: number;
  verse: number;
  shloka: string;
  transliteration: string;
  translation: string;
  purport?: string;
}

async function fetchFromSupersite(textId: string, chapter?: number): Promise<any> {
  const url = chapter 
    ? `${SUPERSITE_API}${textId}/${chapter}.json`
    : `${SUPERSITE_API}${textId}.json`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.json();
}

async function seedNaradaBhaktiSutraFromSupersite(): Promise<void> {
  console.log("Fetching Narada Bhakti Sutras from Gita Supersite...");
  
  try {
    // Try to fetch Narada Bhakti Sutras (84 sutras)
    const data = await fetchFromSupersite("narada-bhakti-sutra");
    console.log("Data received:", Object.keys(data));
    
    // Process and save
    // This would need proper mapping based on actual API response structure
    console.log("✓ Narada Bhakti Sutras fetched");
  } catch (err) {
    console.log("✗ Narada Bhakti Sutras not available:", (err as Error).message);
  }
}

async function seedUpanishadFromSupersite(name: string, id: string, chapters: number[]): Promise<void> {
  console.log(`Fetching ${name} from Gita Supersite...`);
  
  const allVerses: any[] = [];
  
  for (const chapter of chapters) {
    try {
      const data = await fetchFromSupersite(id, chapter);
      console.log(`  Chapter ${chapter}: ${Object.keys(data).length} verses`);
      allVerses.push(...Object.values(data));
    } catch (err) {
      console.log(`  Chapter ${chapter}: failed - ${(err as Error).message}`);
    }
  }
  
  console.log(`✓ ${name}: ${allVerses.length} total verses`);
}

async function main() {
  console.log("=== GITA SUPERSITE SEEDER ===\n");
  
  // Try Narada Bhakti Sutras
  await seedNaradaBhaktiSutraFromSupersite();
  
  // Available Upanishads on Gita Supersite
  const upanishads = [
    { name: "Isha Upanishad", id: "isha", chapters: [1] },
    { name: "Kena Upanishad", id: "kena", chapters: [1, 2, 3, 4] },
    { name: "Katha Upanishad", id: "katha", chapters: [1, 2, 3] },
    { name: "Prashna Upanishad", id: "prashna", chapters: [1, 2, 3, 4, 5, 6] },
    { name: "Mundaka Upanishad", id: "mundaka", chapters: [1, 2, 3] },
    { name: "Mandukya Upanishad", id: "mandukya", chapters: [1] },
    { name: "Taittiriya Upanishad", id: "taittiriya", chapters: [1, 2, 3] },
    { name: "Aitareya Upanishad", id: "aitareya", chapters: [1, 2, 3] },
    { name: "Chandogya Upanishad", id: "chandogya", chapters: Array.from({length: 8}, (_, i) => i + 1) },
    { name: "Brihadaranyaka Upanishad", id: "brihadaranyaka", chapters: [1, 2, 3, 4, 5, 6] },
    { name: "Shvetashvatara Upanishad", id: "shvetashvatara", chapters: [1, 2, 3, 4, 5, 6] },
  ];
  
  for (const upanishad of upanishads.slice(0, 2)) { // Test first 2
    await seedUpanishadFromSupersite(upanishad.name, upanishad.id, upanishad.chapters);
  }
  
  console.log("\n=== DONE ===");
}

main().catch(console.error);
