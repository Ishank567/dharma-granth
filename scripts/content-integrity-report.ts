/**
 * Read-only content integrity report.
 *
 * This script never writes, renames, or rewrites scripture files. It prints
 * findings and exits. `--strict` (npm run content:validate) exits 1 only for
 * structural errors: duplicate catalogue ids, duplicate chapter or verse
 * numbers, empty Sanskrit, a manifest verseCount that disagrees with the
 * shard, or a manifest chapter with no shard. Catalogue drift, copied
 * commentary, and AI-source flags are warnings and do not fail the command.
 *
 * Run:
 *   npm run content:audit
 *   npm run content:counts
 *   npm run content:links
 *   npm run content:validate
 *   npm run content:all
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CHAPTERS } from '../data/ashtavakra/chapters-meta';
import { scriptureCatalog } from '../data/scripture-meta';
import { SCRIPTURE_ALIASES } from '../data/scripture-aliases';

const ROOT = resolve(__dirname, '..');
const FULL_DIR = resolve(ROOT, 'public/data/scriptures-full');
const OG_DIR = resolve(ROOT, 'public/og');
const ASH_DIR = resolve(ROOT, 'data/ashtavakra');
const MAX_LISTED = 40;

const args = new Set(process.argv.slice(2));
const strict = args.has('--strict');
const wantCounts = args.has('--counts') || (!args.has('--links') && !args.has('--counts')) || strict;
const wantLinks = args.has('--links') || (!args.has('--links') && !args.has('--counts')) || strict;
const wantQuality = (!args.has('--counts') && !args.has('--links')) || strict;

interface Structural {
  scripture: string;
  chapter: string;
  verse: string;
  field: string;
  error: string;
  file: string;
}

const structural: Structural[] = [];
let structuralCount = 0;

function fail(row: Structural): void {
  structuralCount += 1;
  if (structural.length < MAX_LISTED) structural.push(row);
}

interface CountRow {
  id: string;
  libraryChapters: number;
  libraryVerses: number;
  shardVerses: number;
  catalogueChapters: number;
  catalogueVerses: number;
  indexChapters: number | null;
  indexVerses: number | null;
}

const counts: CountRow[] = [];
const quality = {
  emptyHindi: 0,
  emptyCommentary: 0,
  emptyWordMeaning: 0,
  sensePrefix: 0,
  commentaryCopiesTranslation: 0,
  translationSourceAi: 0,
  hindiSourceAi: 0,
  placeholderFields: 0,
  replacementChars: 0,
  sanskritWithoutDevanagari: 0,
  nonSequentialChapters: 0,
};
const nonSequentialExamples: string[] = [];
const linkProblems: string[] = [];
const notes: string[] = [];

interface Verse {
  number?: number | string;
  sanskrit?: string;
  hindi?: string;
  translation?: string;
  commentary?: string;
  wordMeaning?: string;
  translationSource?: string;
  hindiSource?: string;
  audio?: string;
  audioUrl?: string;
}

function readJson(file: string): unknown {
  return JSON.parse(readFileSync(file, 'utf8'));
}

function versesOf(data: unknown): Verse[] {
  if (!data || typeof data !== 'object') return [];
  const record = data as { chapter?: { verses?: Verse[] }; verses?: Verse[] };
  return record.chapter?.verses ?? record.verses ?? [];
}

function isPlaceholder(value: string): boolean {
  const text = value.trim();
  if (/lorem ipsum/i.test(text)) return true;
  return /^(todo|fixme|xxx|placeholder|tbd|lorem)$/i.test(text);
}

function inspectVerses(verses: Verse[], scripture: string, chapter: string, file: string): number {
  const seen = new Set<string>();
  let sequential = verses.length > 0;
  verses.forEach((verse, index) => {
    const number = verse.number;
    const verseLabel = number == null || number === '' ? String(index + 1) : String(number);
    if (number == null || number === '') {
      sequential = false;
    } else {
      const key = String(number);
      if (seen.has(key)) {
        fail({
          scripture,
          chapter,
          verse: verseLabel,
          field: 'number',
          error: 'duplicate verse number',
          file,
        });
      }
      seen.add(key);
      if (Number(number) !== index + 1) sequential = false;
    }

    const sanskrit = typeof verse.sanskrit === 'string' ? verse.sanskrit : '';
    if (sanskrit.trim() === '') {
      fail({
        scripture,
        chapter,
        verse: verseLabel,
        field: 'sanskrit',
        error: 'empty original text',
        file,
      });
    } else if (!/[\u0900-\u097F]/.test(sanskrit)) {
      quality.sanskritWithoutDevanagari += 1;
    }

    const hindi = typeof verse.hindi === 'string' ? verse.hindi.trim() : '';
    if (!hindi) quality.emptyHindi += 1;
    const translation = typeof verse.translation === 'string' ? verse.translation.trim() : '';
    const commentary = typeof verse.commentary === 'string' ? verse.commentary.trim() : '';
    const wordMeaning = typeof verse.wordMeaning === 'string' ? verse.wordMeaning.trim() : '';
    if (!commentary) quality.emptyCommentary += 1;
    if (!wordMeaning) quality.emptyWordMeaning += 1;
    if (commentary.startsWith('Sense:')) quality.sensePrefix += 1;
    if (commentary && translation && (commentary === translation || commentary === `Sense: ${translation}`)) {
      quality.commentaryCopiesTranslation += 1;
    }
    if (verse.translationSource === 'ai') quality.translationSourceAi += 1;
    if (verse.hindiSource === 'ai') quality.hindiSourceAi += 1;

    for (const value of [sanskrit, hindi, translation, commentary, wordMeaning]) {
      if (value.includes('\uFFFD')) quality.replacementChars += 1;
      if (value && isPlaceholder(value)) quality.placeholderFields += 1;
    }

    for (const field of ['audio', 'audioUrl'] as const) {
      const ref = verse[field];
      if (typeof ref === 'string' && ref.startsWith('/')) {
        const target = resolve(ROOT, 'public', ref.replace(/^\//, ''));
        if (!existsSync(target)) linkProblems.push(`${file} ${field} missing: ${ref}`);
      }
    }
  });

  if (!sequential) {
    quality.nonSequentialChapters += 1;
    if (nonSequentialExamples.length < 8) nonSequentialExamples.push(`${scripture} chapter ${chapter} (${file})`);
  }
  return verses.length;
}

function chapterIndex(): Record<string, Array<{ id: number; verseCount?: number }>> {
  const file = resolve(ROOT, 'public/data/chapters.json');
  if (!existsSync(file)) return {};
  return readJson(file) as Record<string, Array<{ id: number; verseCount?: number }>>;
}

function inspectLibrary(): { verses: number; chapters: number; scriptures: number } {
  const index = chapterIndex();
  const seenIds = new Set<string>();
  let verses = 0;
  let chapters = 0;
  let scriptures = 0;

  for (const meta of scriptureCatalog) {
    if (seenIds.has(meta.id)) {
      fail({
        scripture: meta.id,
        chapter: '',
        verse: '',
        field: 'id',
        error: 'duplicate catalogue id',
        file: 'data/scripture-meta.ts',
      });
    }
    seenIds.add(meta.id);

    const catalogueVerses = meta.canonicalTotalVerses ?? meta.totalVerses;
    const dir = resolve(FULL_DIR, meta.id);
    const manifestPath = resolve(dir, 'manifest.json');
    let libraryChapters = 0;
    let libraryVerses = 0;
    let shardVerses = 0;

    if (existsSync(manifestPath)) {
      const manifest = readJson(manifestPath) as {
        chapters?: Array<{ number?: number | string; verseCount?: number }>;
      };
      const numbers = new Set<string>();
      for (const chapter of manifest.chapters ?? []) {
        const number = Number(chapter.number);
        const label = String(chapter.number ?? '');
        if (!Number.isInteger(number) || number < 1) {
          fail({
            scripture: meta.id,
            chapter: label,
            verse: '',
            field: 'number',
            error: 'manifest chapter number is not a positive integer',
            file: manifestPath,
          });
          continue;
        }
        if (numbers.has(String(number))) {
          fail({
            scripture: meta.id,
            chapter: label,
            verse: '',
            field: 'number',
            error: 'duplicate chapter number',
            file: manifestPath,
          });
        }
        numbers.add(String(number));
        const declared = chapter.verseCount ?? 0;
        libraryVerses += declared;
        if (declared > 0) libraryChapters += 1;
        const shard = resolve(dir, `ch-${number}.json`);
        if (!existsSync(shard)) {
          fail({
            scripture: meta.id,
            chapter: label,
            verse: '',
            field: 'file',
            error: 'manifest chapter has no shard',
            file: shard,
          });
          linkProblems.push(`${meta.id} chapter ${number}: missing ${shard}`);
          continue;
        }
        try {
          const actual = inspectVerses(versesOf(readJson(shard)), meta.id, label, shard);
          shardVerses += actual;
          if (actual !== declared) {
            fail({
              scripture: meta.id,
              chapter: label,
              verse: '',
              field: 'verseCount',
              error: `manifest verseCount ${declared} != shard length ${actual}`,
              file: shard,
            });
          }
        } catch (error) {
          fail({
            scripture: meta.id,
            chapter: label,
            verse: '',
            field: 'file',
            error: `shard could not be read: ${error instanceof Error ? error.message : String(error)}`,
            file: shard,
          });
        }
      }
    } else {
      const monolith = resolve(FULL_DIR, `${meta.id}.json`);
      if (existsSync(monolith)) {
        try {
          const book = readJson(monolith) as {
            chapters?: Array<{ number?: number | string; verses?: Verse[] }>;
          };
          const numbers = new Set<string>();
          for (const chapter of book.chapters ?? []) {
            const number = Number(chapter.number);
            const label = String(chapter.number ?? '');
            if (numbers.has(label)) {
              fail({
                scripture: meta.id,
                chapter: label,
                verse: '',
                field: 'number',
                error: 'duplicate chapter number',
                file: monolith,
              });
            }
            numbers.add(label);
            const actual = inspectVerses(chapter.verses ?? [], meta.id, label, monolith);
            shardVerses += actual;
            libraryVerses += actual;
            if (actual > 0) libraryChapters += 1;
          }
        } catch (error) {
          fail({
            scripture: meta.id,
            chapter: '',
            verse: '',
            field: 'file',
            error: `monolith could not be read: ${error instanceof Error ? error.message : String(error)}`,
            file: monolith,
          });
        }
      }
    }

    const indexed = index[meta.id];
    counts.push({
      id: meta.id,
      libraryChapters,
      libraryVerses,
      shardVerses,
      catalogueChapters: meta.totalChapters,
      catalogueVerses,
      indexChapters: indexed ? indexed.length : null,
      indexVerses: indexed ? indexed.reduce((sum, chapter) => sum + (chapter.verseCount ?? 0), 0) : null,
    });
    verses += libraryVerses;
    chapters += libraryChapters;
    if (libraryVerses > 0) scriptures += 1;

    const og = resolve(OG_DIR, `${meta.id}.png`);
    if (!existsSync(og)) linkProblems.push(`${meta.id}: missing OG image ${og}`);
  }

  return { verses, chapters, scriptures };
}

function inspectFolders(): void {
  if (!existsSync(FULL_DIR)) return;
  const canonical = new Set(scriptureCatalog.map((meta) => meta.id));
  const aliases = new Set(Object.keys(SCRIPTURE_ALIASES));
  for (const entry of readdirSync(FULL_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (canonical.has(entry.name)) continue;
    if (aliases.has(entry.name)) {
      notes.push(`Folder public/data/scriptures-full/${entry.name} duplicates alias target ${SCRIPTURE_ALIASES[entry.name]}. The site reads the canonical id.`);
      continue;
    }
    notes.push(`Folder public/data/scriptures-full/${entry.name} is not in the catalogue.`);
  }
}

function inspectStats(library: { verses: number; chapters: number; scriptures: number }): void {
  const file = resolve(ROOT, 'public/data/stats.json');
  if (!existsSync(file)) {
    notes.push('public/data/stats.json is missing. Displayed totals no longer read it.');
    return;
  }
  const stats = readJson(file) as {
    realVerseCount?: number;
    realChapterCount?: number;
    realScriptureCount?: number;
  };
  const drift = [
    ['verses', stats.realVerseCount, library.verses],
    ['chapters', stats.realChapterCount, library.chapters],
    ['scriptures', stats.realScriptureCount, library.scriptures],
  ].filter(([, declared, actual]) => declared !== actual);
  if (drift.length > 0) {
    notes.push(
      `public/data/stats.json disagrees with the manifests (${drift
        .map(([name, declared, actual]) => `${name} file ${declared} / library ${actual}`)
        .join('; ')}). Pages count the manifests instead.`,
    );
  }
}

const ALLOWED_ASH_STATUS = new Set(['verified', 'review-required']);

function inspectAshtavakra(): void {
  for (const chapter of CHAPTERS) {
    const file = resolve(ASH_DIR, `chapter-${chapter.number}.json`);
    if (chapter.status === 'published' && !existsSync(file)) {
      fail({
        scripture: 'ashtavakra-gita',
        chapter: String(chapter.number),
        verse: '',
        field: 'file',
        error: 'published chapter file is missing',
        file,
      });
      linkProblems.push(`ashtavakra chapter ${chapter.number}: missing ${file}`);
      continue;
    }
    if (!existsSync(file)) continue;
    try {
      const data = readJson(file) as {
        hero?: { totalVerses?: number };
        verses?: Array<{ verseNumber?: string; sanskrit?: string; verificationStatus?: string }>;
      };
      const verses = data.verses ?? [];
      const seen = new Set<string>();
      verses.forEach((verse, index) => {
        const verseNumber = verse.verseNumber ?? String(index + 1);
        if (seen.has(verseNumber)) {
          fail({
            scripture: 'ashtavakra-gita',
            chapter: String(chapter.number),
            verse: verseNumber,
            field: 'verseNumber',
            error: 'duplicate verse number',
            file,
          });
        }
        seen.add(verseNumber);
        if (!verse.sanskrit || verse.sanskrit.trim() === '') {
          fail({
            scripture: 'ashtavakra-gita',
            chapter: String(chapter.number),
            verse: verseNumber,
            field: 'sanskrit',
            error: 'empty original text',
            file,
          });
        }
        if (!verse.verificationStatus || !ALLOWED_ASH_STATUS.has(verse.verificationStatus)) {
          fail({
            scripture: 'ashtavakra-gita',
            chapter: String(chapter.number),
            verse: verseNumber,
            field: 'verificationStatus',
            error: `unsupported verification value ${verse.verificationStatus ?? '(empty)'}`,
            file,
          });
        }
      });
      if (chapter.verifiedVerseCount != null && chapter.verifiedVerseCount !== verses.length) {
        notes.push(
          `ashtavakra chapter ${chapter.number}: chapters-meta verifiedVerseCount ${chapter.verifiedVerseCount} != file length ${verses.length}`,
        );
      }
      if (data.hero?.totalVerses != null && data.hero.totalVerses !== verses.length) {
        notes.push(
          `ashtavakra chapter ${chapter.number}: hero.totalVerses ${data.hero.totalVerses} != file length ${verses.length}`,
        );
      }
    } catch (error) {
      fail({
        scripture: 'ashtavakra-gita',
        chapter: String(chapter.number),
        verse: '',
        field: 'file',
        error: `chapter could not be read: ${error instanceof Error ? error.message : String(error)}`,
        file,
      });
    }
  }
}

function printList(title: string, rows: string[]): void {
  console.log(`\n${title}`);
  if (rows.length === 0) {
    console.log('  none');
    return;
  }
  for (const row of rows.slice(0, MAX_LISTED)) console.log(`  ${row}`);
  if (rows.length > MAX_LISTED) console.log(`  … ${rows.length - MAX_LISTED} more`);
}

const library = inspectLibrary();
inspectFolders();
inspectStats(library);
inspectAshtavakra();

console.log('Dharma Granth content integrity');
console.log('Read only. No scripture file was written.');
console.log(`Scriptures with verses: ${library.scriptures}`);
console.log(`Chapters with verses: ${library.chapters}`);
console.log(`Verses in manifests (or monoliths when no manifest): ${library.verses}`);
console.log(`Structural errors: ${structuralCount}`);

if (structuralCount > 0) {
  console.log('\nSTRUCTURAL');
  for (const row of structural) {
    console.log(
      `  ${row.scripture} ch ${row.chapter || '—'} v ${row.verse || '—'} field ${row.field || '—'}: ${row.error}`,
    );
    console.log(`    ${row.file}`);
  }
  if (structuralCount > structural.length) console.log(`  … ${structuralCount - structural.length} more`);
}

if (wantCounts) {
  const mismatched = counts.filter(
    (row) =>
      row.catalogueVerses !== row.libraryVerses ||
      row.catalogueChapters !== row.libraryChapters ||
      (row.indexVerses != null && row.indexVerses !== row.libraryVerses) ||
      row.shardVerses !== row.libraryVerses,
  );
  const catalogueDrift = counts.filter(
    (row) => row.catalogueVerses !== row.libraryVerses || row.catalogueChapters !== row.libraryChapters,
  ).length;
  const indexDrift = counts.filter((row) => row.indexVerses != null && row.indexVerses !== row.libraryVerses).length;
  const shardDrift = counts.filter((row) => row.shardVerses !== row.libraryVerses).length;
  console.log(
    `\nCOUNTS catalogue differs ${catalogueDrift}; chapters.json differs ${indexDrift}; shard length differs ${shardDrift}`,
  );
  console.log('  id | library chapters/verses | shard verses | catalogue chapters/verses | chapters.json chapters/verses');
  for (const row of mismatched) {
    console.log(
      `  ${row.id} | ${row.libraryChapters}/${row.libraryVerses} | ${row.shardVerses} | ${row.catalogueChapters}/${row.catalogueVerses} | ${row.indexChapters ?? '—'}/${row.indexVerses ?? '—'}`,
    );
  }
}

if (wantQuality) {
  console.log('\nQUALITY (warnings, not failures)');
  console.log(`  empty Hindi: ${quality.emptyHindi}`);
  console.log(`  empty commentary: ${quality.emptyCommentary}`);
  console.log(`  empty wordMeaning: ${quality.emptyWordMeaning}`);
  console.log(`  commentary starts with "Sense:": ${quality.sensePrefix}`);
  console.log(`  commentary copies the English translation: ${quality.commentaryCopiesTranslation}`);
  console.log(`  translationSource ai: ${quality.translationSourceAi}`);
  console.log(`  hindiSource ai: ${quality.hindiSourceAi}`);
  console.log(`  placeholder fields (whole field only; OCR roman numerals are ignored): ${quality.placeholderFields}`);
  console.log(`  U+FFFD replacement characters: ${quality.replacementChars}`);
  console.log(`  Sanskrit with no Devanagari: ${quality.sanskritWithoutDevanagari}`);
  console.log(`  chapters whose verse numbers are not 1..N: ${quality.nonSequentialChapters}`);
  for (const example of nonSequentialExamples) console.log(`    ${example}`);
}

if (wantLinks) {
  printList('LINKS', linkProblems);
}

printList('NOTES', notes);

if (strict && structuralCount > 0) {
  console.error(`\ncontent:validate failed with ${structuralCount} structural error(s).`);
  process.exit(1);
}

console.log('\nDone. Catalogue differences are listed above and do not fail this command unless they are structural.');
