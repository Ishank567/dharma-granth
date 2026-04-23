/**
 * Reset Interpretations
 * =======================
 * Deletes template-based interpretations to prepare for AI regeneration
 */

import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');

function main() {
  console.log('🗑️  Resetting Template Interpretations\n');

  const db = new Database(DB_PATH);

  const before = (db.prepare('SELECT COUNT(*) as c FROM interpretations').get() as { c: number }).c;
  const templateCount = (db.prepare("SELECT COUNT(*) as c FROM interpretations WHERE source = 'template'").get() as { c: number }).c;

  console.log('Before cleanup:');
  console.log('  Total interpretations:', before.toLocaleString());
  console.log('  Template-based:', templateCount.toLocaleString());

  if (templateCount === 0) {
    console.log('\n✅ No template interpretations to delete');
    db.close();
    return;
  }

  // Delete template interpretations
  db.exec("DELETE FROM interpretations WHERE source = 'template'");

  const after = (db.prepare('SELECT COUNT(*) as c FROM interpretations').get() as { c: number }).c;
  console.log('\nAfter cleanup:');
  console.log('  Total interpretations:', after.toLocaleString());
  console.log('  Deleted:', (before - after).toLocaleString());

  console.log('\n✅ Ready for AI regeneration');
  console.log('Run: npx tsx scripts/generate-interpretations.ts --all');

  db.close();
}

main();
