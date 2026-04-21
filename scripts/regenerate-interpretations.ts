import path from 'path';
import {
  getBookBySlug,
  getDb,
  getInterpretation,
  getTotalVerseCount,
  getVerseByBookAndNumber,
  getVerseById,
  saveInterpretation,
} from '../app/lib/db';
import { generateInterpretation } from '../app/lib/gemini';
import { buildInterpretationInput } from '../app/lib/interpretationUtils';
import {
  getAllGuidedCourseDefinitions,
  getGuidedCourseDefinition,
  type GuidedCourseVerseContext,
  resolveGuidedCourse,
} from '../app/lib/guidedCourses';
import { createOfflineInterpretation } from '../app/lib/offlineInterpretation';
import type { Book, Interpretation, Verse } from '../app/lib/types';

const PROCESS_WITH_ENV = process as typeof process & {
  loadEnvFile?: (path?: string) => void;
};

PROCESS_WITH_ENV.loadEnvFile?.(path.join(process.cwd(), '.env.local'));

const DEFAULT_BOOK_SLUGS = getAllGuidedCourseDefinitions().map((course) => course.bookSlug);

interface Options {
  books: string[];
  seedCourseAnchors: boolean;
  overwriteExisting: boolean;
}

interface TargetVerse {
  verseId: number;
  verseNumber: number;
  reason: string;
  fallbackContext?: GuidedCourseVerseContext;
}

function parseOptions(): Options {
  const args = process.argv.slice(2);
  const booksArg = args.find((arg) => arg.startsWith('--books='));
  const books = booksArg
    ? booksArg
        .split('=')[1]
        ?.split(',')
        .map((value) => value.trim())
        .filter(Boolean) || DEFAULT_BOOK_SLUGS
    : DEFAULT_BOOK_SLUGS;

  return {
    books,
    seedCourseAnchors: !args.includes('--no-seed-course-anchors'),
    overwriteExisting: !args.includes('--skip-existing'),
  };
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isQuotaOrKeyError(error: unknown) {
  const message = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  return (
    message.includes('quota') ||
    message.includes('429') ||
    message.includes('rate limit') ||
    message.includes('api key')
  );
}

function getExistingInterpretationTargets(bookId: number) {
  const db = getDb();
  return db
    .prepare(`
      SELECT i.verse_id, v.verse_number
      FROM interpretations i
      JOIN verses v ON v.id = i.verse_id
      WHERE v.book_id = ?
      ORDER BY v.verse_number
    `)
    .all(bookId) as Array<{ verse_id: number; verse_number: number }>;
}

async function regenerateForBook(book: Book, options: Options) {
  const totalVerses = getTotalVerseCount(book.id);
  const courseDefinition = getGuidedCourseDefinition(book.slug);
  const targetVerseIds = new Map<number, TargetVerse>();
  let aiAvailable = Boolean(process.env.GOOGLE_GEMINI_API_KEY);

  const existingTargets = getExistingInterpretationTargets(book.id);
  for (const target of existingTargets) {
    targetVerseIds.set(target.verse_id, {
      verseId: target.verse_id,
      verseNumber: target.verse_number,
      reason: 'मौजूदा व्याख्या',
    });
  }

  if (options.seedCourseAnchors && courseDefinition) {
    const resolvedCourse = resolveGuidedCourse(courseDefinition, totalVerses);
    for (const courseModule of resolvedCourse.modules) {
      const anchorVerse = getVerseByBookAndNumber(
        book.id,
        courseModule.anchorVerseNumber
      ) as Verse | undefined;
      if (!anchorVerse) continue;
      targetVerseIds.set(anchorVerse.id, {
        verseId: anchorVerse.id,
        verseNumber: anchorVerse.verse_number,
        reason: `अध्ययन खंड: ${courseModule.title}`,
        fallbackContext: {
          courseTitle: resolvedCourse.title,
          tradition: resolvedCourse.tradition,
          moduleTitle: courseModule.title,
          moduleSummary: courseModule.summary,
          headerSummary: courseModule.headerSummary,
          reflection: courseModule.reflection,
          practice: courseModule.practice,
        },
      });
    }
  }

  const targets = [...targetVerseIds.values()]
    .sort((left, right) => left.verseNumber - right.verseNumber);

  if (targets.length === 0) {
    console.log(`⏭️  ${book.title_hindi}: कोई चयनित व्याख्या नहीं मिली`);
    return { processed: 0, skipped: 0, failed: 0 };
  }

  console.log(`\n📘 ${book.title_hindi} — ${targets.length} चयनित व्याख्याएँ`);

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  for (const target of targets) {
    const existing = getInterpretation(target.verseId) as Interpretation | undefined;
    if (existing && !options.overwriteExisting && target.reason === 'मौजूदा व्याख्या') {
      skipped += 1;
      console.log(`  ⏭️  श्लोक ${target.verseNumber}: पहले से उपलब्ध`);
      continue;
    }

    const verse = getVerseById(target.verseId) as Verse | undefined;
    if (!verse) {
      failed += 1;
      console.log(`  ❌ श्लोक ${target.verseNumber}: पाठ नहीं मिला`);
      continue;
    }

    try {
      const interpretationInput = buildInterpretationInput(verse, target.fallbackContext);
      const result = aiAvailable
        ? await generateInterpretation(interpretationInput)
        : createOfflineInterpretation(interpretationInput);

      saveInterpretation(
        verse.id,
        result.shabdarth,
        result.bhavarth,
        result.guided_learning,
        result.scientific_temperament,
        result.modern_relevance,
        aiAvailable ? 'ai' : 'offline'
      );

      processed += 1;
      console.log(
        `  ✅ श्लोक ${target.verseNumber}: ${target.reason}${aiAvailable ? '' : ' (ऑफलाइन व्याख्या)'}`
      );
      await sleep(aiAvailable ? 400 : 50);
    } catch (error) {
      if (isQuotaOrKeyError(error)) {
        aiAvailable = false;
      }

      const fallbackResult = createOfflineInterpretation(
        buildInterpretationInput(verse, target.fallbackContext)
      );
      saveInterpretation(
        verse.id,
        fallbackResult.shabdarth,
        fallbackResult.bhavarth,
        fallbackResult.guided_learning,
        fallbackResult.scientific_temperament,
        fallbackResult.modern_relevance,
        'offline'
      );
      processed += 1;
      console.log(`  ✅ श्लोक ${target.verseNumber}: ${target.reason} (ऑफलाइन व्याख्या)`);
      await sleep(aiAvailable ? 200 : 50);
    }
  }

  return { processed, skipped, failed };
}

async function main() {
  const options = parseOptions();

  console.log('🧠 गहन व्याख्याएँ अद्यतन कर रहे हैं...');
  console.log(`📚 चयनित ग्रंथ: ${options.books.join(', ')}`);

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  for (const slug of options.books) {
    const book = getBookBySlug(slug) as Book | undefined;
    if (!book) {
      console.log(`\n⚠️  ग्रंथ नहीं मिला: ${slug}`);
      failed += 1;
      continue;
    }

    const result = await regenerateForBook(book, options);
    processed += result.processed;
    skipped += result.skipped;
    failed += result.failed;
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 व्याख्या अद्यतन सारांश');
  console.log(`   सफल:   ${processed}`);
  console.log(`   छोड़ी:  ${skipped}`);
  console.log(`   असफल:  ${failed}`);
  console.log('='.repeat(50));
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});