/**
 * Hindi Content Coverage Report
 * Run: npx tsx scripts/hindi-coverage-report.ts
 */
import { scriptureMap } from "../data/scriptures/index";
import type { Scripture, Verse } from "../data/types";

interface CoverageStats {
  scriptureId: string;
  title: string;
  totalVerses: number;
  withHindi: number;
  withMeaning: number;
  withBoth: number;
  coverage: number;
}

function analyzeCoverage(): CoverageStats[] {
  const stats: CoverageStats[] = [];

  for (const scripture of Object.values(scriptureMap)) {
    let total = 0;
    let withHindi = 0;
    let withMeaning = 0;
    let withBoth = 0;

    for (const chapter of scripture.chapters) {
      for (const verse of chapter.verses) {
        total++;
        if (verse.hindi) withHindi++;
        if (verse.meaning) withMeaning++;
        if (verse.hindi && verse.meaning) withBoth++;
      }
    }

    if (total > 0) {
      stats.push({
        scriptureId: scripture.id,
        title: scripture.title,
        totalVerses: total,
        withHindi,
        withMeaning,
        withBoth,
        coverage: Math.round((withBoth / total) * 100),
      });
    }
  }

  return stats.sort((a, b) => b.totalVerses - a.totalVerses);
}

function main() {
  const stats = analyzeCoverage();
  
  if (stats.length === 0) {
    console.log("No verse data found.");
    return;
  }

  const totalVerses = stats.reduce((sum, s) => sum + s.totalVerses, 0);
  const totalWithBoth = stats.reduce((sum, s) => sum + s.withBoth, 0);
  const overallCoverage = Math.round((totalWithBoth / totalVerses) * 100);

  console.log("\n📊 HINDI CONTENT COVERAGE REPORT\n");
  console.log("=" .repeat(70));
  console.log(`Overall Coverage: ${totalWithBoth}/${totalVerses} verses (${overallCoverage}%)`);
  console.log("=" .repeat(70));

  console.log("\n📚 Coverage by Scripture:\n");
  console.log(
    `${"Scripture".padEnd(25)} ${"Verses".padStart(8)} ${"Hindi".padStart(8)} ${"Meaning".padStart(8)} ${"Both".padStart(8)} ${"%".padStart(6)}`
  );
  console.log("-".repeat(70));

  for (const s of stats) {
    const coverage = s.coverage === 100 ? "✓ 100" : `  ${s.coverage}`;
    console.log(
      `${s.title.substring(0, 24).padEnd(25)} ${s.totalVerses.toString().padStart(8)} ${s.withHindi.toString().padStart(8)} ${s.withMeaning.toString().padStart(8)} ${s.withBoth.toString().padStart(8)} ${coverage.padStart(6)}`
    );
  }

  // Find partial coverage
  const partial = stats.filter(s => s.coverage > 0 && s.coverage < 100);
  
  if (partial.length > 0) {
    console.log("\n\n⚠️  Scriptures with Partial Coverage:\n");
    for (const s of partial) {
      const missing = s.totalVerses - s.withBoth;
      console.log(`  • ${s.title}: ${missing} verses missing Hindi content`);
    }
  }

  const complete = stats.filter(s => s.coverage === 100);
  if (complete.length > 0) {
    console.log(`\n\n✓ ${complete.length} scriptures have complete Hindi coverage`);
  }

  console.log("\n" + "=".repeat(70));
  console.log("Note: 'Hindi' = short Hindi translation, 'Meaning' = detailed explanation\n");
}

main();
