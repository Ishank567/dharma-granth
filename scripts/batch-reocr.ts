/**
 * Batch re-OCR specific books that were degraded by resplit.
 * Usage: npx tsx scripts/batch-reocr.ts
 */
import { execSync } from 'child_process';
import path from 'path';

const BOOKS_TO_REOCR = [43, 61, 6, 75, 85, 87];

for (const bookId of BOOKS_TO_REOCR) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Re-OCR'ing book #${bookId}...`);
  console.log('='.repeat(60));
  try {
    execSync(
      `npx tsx scripts/ocr-extract.ts --book ${bookId} --force`,
      {
        cwd: path.join(__dirname, '..'),
        stdio: 'inherit',
        timeout: 1_200_000, // 20 min per book
      }
    );
  } catch (e) {
    console.error(`Failed for book #${bookId}:`, (e as Error).message);
  }
}

console.log('\nAll re-OCR tasks complete!');
