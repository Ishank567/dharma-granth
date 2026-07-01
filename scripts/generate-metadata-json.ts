import fs from 'node:fs';
import path from 'node:path';

interface ChapterInfo {
  id: number;
  title: string;
  titleSanskrit?: string;
  verseCount: number;
}

interface ScriptureInfo {
  id: string;
  chapters: ChapterInfo[];
  verseCount: number;
  realChapterCount: number;
  hasData: boolean;
}

interface Stats {
  realVerseCount: number;
  realChapterCount: number;
  realScriptureCount: number;
}

async function main() {
  const srcDir = path.resolve('public/data/scriptures');
  const outDir = path.resolve('public/data');
  fs.mkdirSync(outDir, { recursive: true });

  const files = fs
    .readdirSync(srcDir)
    .filter((f) => f.endsWith('.json'));

  const chapters: Record<string, ChapterInfo[]> = {};
  const stats: Stats = { realVerseCount: 0, realChapterCount: 0, realScriptureCount: 0 };

  for (const file of files) {
    const id = path.basename(file, '.json');
    const filePath = path.join(srcDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8')) as {
      chapters?: Array<{ id: number; title: string; titleSanskrit?: string; verses?: unknown[] }>;
    };
    const chapterInfos: ChapterInfo[] = (data.chapters || []).map((ch) => ({
      id: ch.id,
      title: ch.title,
      titleSanskrit: ch.titleSanskrit,
      verseCount: ch.verses?.length ?? 0,
    }));
    chapters[id] = chapterInfos;

    const verseCount = chapterInfos.reduce((sum, ch) => sum + ch.verseCount, 0);
    const realChapterCount = chapterInfos.filter((ch) => ch.verseCount > 0).length;
    const hasData = realChapterCount > 0;

    stats.realVerseCount += verseCount;
    stats.realChapterCount += realChapterCount;
    if (hasData) stats.realScriptureCount += 1;
  }

  fs.writeFileSync(path.join(outDir, 'chapters.json'), JSON.stringify(chapters));
  fs.writeFileSync(path.join(outDir, 'stats.json'), JSON.stringify(stats));
  console.log(`Wrote chapters.json (${Object.keys(chapters).length} scriptures) and stats.json`);
  console.log(`Stats: ${JSON.stringify(stats)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
