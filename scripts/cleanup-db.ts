import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');
const db = new Database(DB_PATH);

const booksToDelete = [
  'rigved',
  'rigved-2',
  'atharvaveda-2', // wait, title was "Atharva Veda Vol. 2"
  'arthved',
  'arthved-part-1',
  'manusmiriti', // duplicate
];

const titlesToFormat: Record<string, string> = {
  'agni-puran': 'अग्नि पुराण',
  'bavishya-puran': 'भविष्य पुराण',
  'kalkipuranhindi1': 'कल्कि पुराण',
  'markende-puran': 'मार्कण्डेय पुराण',
  'matsya-puran-1': 'मत्स्य पुराण (भाग १)',
  'matsya-puran-2': 'मत्स्य पुराण (भाग २)',
  'nard-puran': 'नारद पुराण',
  'narsihma-puran': 'नरसिंह पुराण',
  'padam-puran': 'पद्म पुराण',
  'sakand-puran': 'स्कन्द पुराण',
  'shiv-puran': 'शिव पुराण',
  'brahamand': 'ब्रह्माण्ड पुराण (भाग १)',
  'brahamandp': 'ब्रह्माण्ड पुराण (भाग २)',
  'kurma': 'कूर्म पुराण',
  'ling': 'लिंग पुराण',
  'mahabhart-gorkhpur': 'महाभारत (गोरखपुर)',
  'ravan-samhita-2': 'रावण संहिता (भाग २)',
  'ravan-samhita-3': 'रावण संहिता (भाग ३)',
  'ravan-samhita-4': 'रावण संहिता (भाग ४)',
  'ravan-samhita-5': 'रावण संहिता (भाग ५)',
  'satyarthaprakasa': 'सत्यार्थ प्रकाश',
  'shiva-sahinta-withhinditika': 'शिव संहिता',
  'shiva-swarodaya-sanskrit-hindi': 'शिव स्वरोदय',
  'shri-yogavasishtha-1': 'योगवासिष्ठ (भाग १)',
  'shri-yogavasishtha-2': 'योगवासिष्ठ (भाग २)',
  'shri-yogavasishtha-3': 'योगवासिष्ठ (भाग ३)',
  'shri-yogavasishtha-4': 'योगवासिष्ठ (भाग ४)',
  'chatanya-mahaprabhu-ki-siksa-hindi-4th-ed': 'चैतन्य महाप्रभु की शिक्षा',
  'durga-saptashati-hindi': 'दुर्गा सप्तशती (हिन्दी)',
  'upanishads-with-upanishad-brahmam-commentary': 'उपनिषद (ब्रह्म भाष्य)',
  'ishavasya-upanishad-trans-by-ek-charan-raja-anuchar-gorakhpur-gita-press': 'ईशावास्य उपनिषद (गीता प्रेस)',
  'kalyan-upanishad-ank-vol-23-issue-no-1-jan-1949-gita-press': 'कल्याण उपनिषद अंक',
  'narad-puran-in-hindi-series-no-1183-gita-press': 'नारद पुराण (गीता प्रेस)',
  'gita-press-vedant-darshan-brahmasutra-sanskrit-hindi': 'वेदान्त दर्शन ब्रह्मसूत्र',
  'ramayana-all-kand-6191-pages': 'रामायण (अन्य संस्करण)'
};

async function main() {
  db.exec('BEGIN TRANSACTION');
  try {
    let deletedCount = 0;

    // 1. Delete explicitly bad/duplicate slugs
    for (const slug of booksToDelete) {
      const book = db.prepare('SELECT id FROM books WHERE slug = ?').get(slug) as { id: number };
      if (book) {
        console.log(`Deleting duplicate book: ${slug}`);
        const vIds = db.prepare('SELECT id FROM verses WHERE book_id = ?').all(book.id) as { id: number }[];
        if (vIds.length > 0) {
          for (let i = 0; i < vIds.length; i += 900) {
            const chunkIds = vIds.slice(i, i + 900).map(v => v.id);
            const placeholders = chunkIds.map(() => '?').join(',');
            db.prepare(`DELETE FROM interpretations WHERE verse_id IN (${placeholders})`).run(...chunkIds);
            db.prepare(`DELETE FROM verse_words WHERE verse_id IN (${placeholders})`).run(...chunkIds);
          }
        }
        db.prepare('DELETE FROM verses WHERE book_id = ?').run(book.id);
        db.prepare('DELETE FROM chapters WHERE book_id = ?').run(book.id);
        db.prepare('DELETE FROM books WHERE id = ?').run(book.id);
        deletedCount++;
      }
    }

    // Delete books with title 'arthved' or 'rigved'
    const oldVedas = db.prepare("SELECT id, title_hindi FROM books WHERE title_hindi LIKE 'arthved%' OR title_hindi LIKE 'rigved%'").all() as { id: number, title_hindi: string }[];
    for (const book of oldVedas) {
      console.log(`Deleting duplicate veda: ${book.title_hindi}`);
      const vIds = db.prepare('SELECT id FROM verses WHERE book_id = ?').all(book.id) as { id: number }[];
      if (vIds.length > 0) {
        for (let i = 0; i < vIds.length; i += 900) {
          const chunkIds = vIds.slice(i, i + 900).map(v => v.id);
          const placeholders = chunkIds.map(() => '?').join(',');
          db.prepare(`DELETE FROM interpretations WHERE verse_id IN (${placeholders})`).run(...chunkIds);
          db.prepare(`DELETE FROM verse_words WHERE verse_id IN (${placeholders})`).run(...chunkIds);
        }
      }
      db.prepare('DELETE FROM verses WHERE book_id = ?').run(book.id);
      db.prepare('DELETE FROM chapters WHERE book_id = ?').run(book.id);
      db.prepare('DELETE FROM books WHERE id = ?').run(book.id);
      deletedCount++;
    }

    // 2. Format English titles to Hindi
    let updatedCount = 0;
    for (const [slug, hindiTitle] of Object.entries(titlesToFormat)) {
      const result = db.prepare('UPDATE books SET title_hindi = ?, title = ? WHERE slug = ?').run(hindiTitle, hindiTitle, slug);
      if (result.changes > 0) {
        updatedCount++;
      }
    }

    db.exec('COMMIT');
    console.log(`✅ Cleanup complete: Deleted ${deletedCount} duplicates, Formatted ${updatedCount} book titles to clean Hindi.`);
  } catch (e) {
    db.exec('ROLLBACK');
    console.error('❌ Failed:', e);
  }
}

main();
