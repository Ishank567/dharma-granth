/**
 * Script to find verses missing Hindi content
 * Run: npx tsx scripts/find-missing-hindi.ts
 */
import { scriptureMap } from "../data/scriptures/index";
import type { Scripture } from "../data/types";

interface MissingHindi {
  scriptureId: string;
  scriptureTitle: string;
  chapterId: number;
  chapterTitle: string;
  verseId: number;
  sanskrit: string;
  hasHindi: boolean;
  hasMeaning: boolean;
  englishTranslation: string;
}

function findMissingHindi(): MissingHindi[] {
  const scriptures = Object.values(scriptureMap);
  const missing: MissingHindi[] = [];

  for (const scripture of scriptures) {
    for (const chapter of scripture.chapters) {
      for (const verse of chapter.verses) {
        if (!verse.hindi && !verse.meaning) {
          missing.push({
            scriptureId: scripture.id,
            scriptureTitle: scripture.title,
            chapterId: chapter.id,
            chapterTitle: chapter.title,
            verseId: verse.id,
            sanskrit: verse.sanskrit.substring(0, 50) + "...",
            hasHindi: !!verse.hindi,
            hasMeaning: !!verse.meaning,
            englishTranslation: verse.translation.substring(0, 80) + "...",
          });
        }
      }
    }
  }

  return missing;
}

function main() {
  const missing = findMissingHindi();

  if (missing.length === 0) {
    console.log("✓ All verses have Hindi content!");
    return;
  }

  // Group by scripture
  const byScripture = new Map<string, MissingHindi[]>();
  for (const item of missing) {
    const list = byScripture.get(item.scriptureId) ?? [];
    list.push(item);
    byScripture.set(item.scriptureId, list);
  }

  console.log(`\nFound ${missing.length} verses missing Hindi content:\n`);

  byScripture.forEach((verses, scriptureId) => {
    console.log(`\n[${verses[0].scriptureTitle}] (${verses.length} verses)`);
    console.log("-".repeat(60));
    
    // Group by chapter
    const byChapter = new Map<number, MissingHindi[]>();
    for (const v of verses) {
      const list = byChapter.get(v.chapterId) ?? [];
      list.push(v);
      byChapter.set(v.chapterId, list);
    }

    byChapter.forEach((chapterVerses, chapterId) => {
      console.log(`\n  Chapter ${chapterId}: ${chapterVerses[0].chapterTitle}`);
      for (const v of chapterVerses) {
        console.log(`    - Verse ${v.verseId}: ${v.englishTranslation}`);
      }
    });
  });

  // Export to JSON for easy editing
  const exportData = missing.map(m => ({
    id: `${m.scriptureId}-ch${m.chapterId}-v${m.verseId}`,
    scripture: m.scriptureId,
    chapter: m.chapterId,
    verse: m.verseId,
    sanskrit: m.sanskrit,
    english: m.englishTranslation,
    hindiToAdd: "", // Fill this in
  }));

  const fs = require("fs");
  const path = require("path");
  const exportPath = path.join(__dirname, "../missing-hindi.json");
  fs.writeFileSync(exportPath, JSON.stringify(exportData, null, 2), "utf8");
  
  console.log(`\n\n📁 Export saved to: ${exportPath}`);
  console.log("You can edit this JSON file to add Hindi translations.");
}

main();
