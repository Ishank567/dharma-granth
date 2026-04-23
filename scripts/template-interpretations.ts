/**
 * Template-Based Interpretations
 * ================================
 * Generates basic interpretations using templates
 * No AI, no API, completely free and fast
 *
 * Usage: npx tsx scripts/template-interpretations.ts [book_id]
 *        npx tsx scripts/template-interpretations.ts --all
 */

import path from 'path';
import Database from 'better-sqlite3';

const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');

interface Verse {
  id: number;
  verse_number: number;
  original_text: string;
  book_title: string;
  category: string;
}

const TEMPLATES = {
  upanishad: {
    shabdarth: (text: string) => `यह श्लोक आत्मा और ब्रह्म के एकत्व का वर्णन करता है। मुख्य शब्द: ${extractKeywords(text, 3).join(', ')}`,
    bhavarth: () => 'इस श्लोक में वेदांत दर्शन का मुख्य सिद्धांत प्रतिपादित है कि आत्मा और परमात्मा एक हैं।',
    guided_learning: (n: number) => `1. इस श्लोक का मुख्य विषय क्या है?\n2. 'आत्मा' से आप क्या समझते हैं?\n3. यह शिक्षा आपके जीवन में कैसे लागू हो सकती है?`,
    modern_relevance: () => 'आज के तनावपूर्ण युग में यह शिक्षा आत्म-ज्ञान और अंतरशांति प्रदान करती है।'
  },
  gita: {
    shabdarth: (text: string) => `भगवान श्रीकृष्ण अर्जुन को ${extractKeywords(text, 2).join(' और ')} के बारे में उपदेश दे रहे हैं।`,
    bhavarth: () => 'यह श्लोक कर्मयोग और भक्ति का संदेश देता है - कामना रहित कर्म करने की शिक्षा।',
    guided_learning: () => `1. क्या हमें कर्म के फल की चिंता करनी चाहिए?\n2. भक्ति और ज्ञान में क्या संबंध है?\n3. इस श्लोक का व्यावहारिक अनुप्रयोग क्या है?`,
    modern_relevance: () => 'यह शिक्षा आधुनिक प्रबंधन और नेतृत्व के सिद्धांतों में बहुत प्रासंगिक है।'
  },
  ved: {
    shabdarth: (text: string) => `यह ऋग्वेद/यजुर्वेद का मंत्र है जो ${extractKeywords(text, 2).join(' और ')} की स्तुति करता है।`,
    bhavarth: () => 'वैदिक मंत्रों में प्रकृति और देवताओं की स्तुति है, सृष्टि के रहस्य का वर्णन है।',
    guided_learning: () => `1. इस मंत्र में किस देवता की स्तुति है?\n2. प्रकृति का महत्व क्या है?\n3. वैदिक संस्कृति के मुख्य मूल्य क्या हैं?`,
    modern_relevance: () => 'वैदिक संस्कृति पारिस्थितिक संतुलन और प्रकृति संरक्षण का संदेश देती है।'
  },
  puran: {
    shabdarth: (text: string) => `यह पौराणिक कथा ${extractKeywords(text, 2).join(' और ')} के बारे में है।`,
    bhavarth: () => 'पुराणों में धर्म, अर्थ, काम और मोक्ष का उपदेश है, साथ ही ऐतिहासिक घटनाओं का वर्णन।',
    guided_learning: () => `1. इस कथा का मुख्य पात्र कौन है?\n2. क्या हमें इन पौराणिक कथाओं से सीखना चाहिए?\n3. धर्म और अधर्म में क्या अंतर है?`,
    modern_relevance: () => 'पौराणिक कथाएं नैतिक मूल्यों और सांस्कृतिक विरासत को संजोए रखती हैं।'
  },
  default: {
    shabdarth: (text: string) => `यह श्लोक ${extractKeywords(text, 3).join(', ')} से संबंधित है।`,
    bhavarth: () => 'इस श्लोक में आध्यात्मिक और दार्शनिक सत्य का वर्णन है।',
    guided_learning: () => `1. इस श्लोक का मुख्य विषय क्या है?\n2. इसका अर्थ कैसे समझें?\n3. व्यावहारिक जीवन में इसका महत्व क्या है?`,
    modern_relevance: () => 'यह शिक्षा आज के युग में भी प्रासंगिक है और जीवन में दिशा प्रदान करती है।'
  }
};

function extractKeywords(text: string, count: number): string[] {
  // Extract meaningful words from Sanskrit text
  const commonWords = ['न', 'च', 'तथा', 'एव', 'हि', 'यः', 'स्य', 'म्', 'ः'];
  const words = text
    .split(/\s+/)
    .filter(w => w.length > 3 && !commonWords.includes(w))
    .slice(0, count);
  return words.length > 0 ? words : ['आत्मा', 'ब्रह्म', 'ध्यान'];
}

function getTemplate(category: string) {
  if (category.includes('upanishad') || category.includes('उपनिषद')) return TEMPLATES.upanishad;
  if (category.includes('gita') || category.includes('गीता')) return TEMPLATES.gita;
  if (category.includes('ved') || category.includes('वेद')) return TEMPLATES.ved;
  if (category.includes('puran') || category.includes('पुराण')) return TEMPLATES.puran;
  return TEMPLATES.default;
}

async function processBook(bookId: number, db: Database.Database): Promise<number> {
  const verses = db.prepare(`
    SELECT v.id, v.verse_number, v.original_text, b.title as book_title, c.name as category
    FROM verses v
    JOIN books b ON v.book_id = b.id
    JOIN categories c ON b.category_id = c.id
    WHERE v.book_id = ?
    AND v.id NOT IN (SELECT verse_id FROM interpretations)
    ORDER BY v.verse_number
  `).all(bookId) as Verse[];

  if (verses.length === 0) {
    console.log('  No verses need interpretations');
    return 0;
  }

  console.log(`  Generating template interpretations for ${verses.length} verses...`);

  const insertInterpretation = db.prepare(`
    INSERT INTO interpretations 
    (verse_id, shabdarth, bhavarth, guided_learning, modern_relevance, source)
    VALUES (?, ?, ?, ?, ?, 'template')
  `);

  let successCount = 0;
  for (const verse of verses) {
    const template = getTemplate(verse.category);

    try {
      insertInterpretation.run(
        verse.id,
        template.shabdarth(verse.original_text),
        template.bhavarth(),
        template.guided_learning(verse.verse_number),
        template.modern_relevance()
      );
      successCount++;
    } catch (e) {
      console.log(`   ❌ DB error for verse ${verse.verse_number}: ${(e as Error).message}`);
    }
  }

  return successCount;
}

async function main() {
  console.log('📝 Template-Based Interpretations\n');

  const args = process.argv.slice(2);
  const processAll = args.includes('--all');
  const bookId = processAll ? null : parseInt(args[0]);

  if (!processAll && isNaN(bookId as number)) {
    console.log('Usage:');
    console.log('  npx tsx scripts/template-interpretations.ts 1     # Process book ID 1');
    console.log('  npx tsx scripts/template-interpretations.ts --all  # Process all books');
    return;
  }

  const db = new Database(DB_PATH);

  // Stats
  const totalVerses = (db.prepare('SELECT COUNT(*) as c FROM verses').get() as { c: number }).c;
  const missingInterp = (db.prepare(`
    SELECT COUNT(*) as c FROM verses v 
    WHERE v.id NOT IN (SELECT verse_id FROM interpretations)
  `).get() as { c: number }).c;

  console.log(`Database: ${totalVerses.toLocaleString()} total verses`);
  console.log(`Missing interpretations: ${missingInterp.toLocaleString()} verses\n`);

  if (processAll) {
    const books = db.prepare('SELECT id, title FROM books ORDER BY id').all() as { id: number; title: string }[];
    let totalGenerated = 0;

    for (const book of books) {
      console.log(`\n📚 Book ${book.id}: ${book.title}`);
      const generated = await processBook(book.id, db);
      totalGenerated += generated;
      console.log(`  ✅ Generated ${generated} interpretations`);
    }

    console.log(`\n═══════════════════════════════════════════`);
    console.log(`✅ Done! Total interpretations: ${totalGenerated}`);
    console.log(`═══════════════════════════════════════════`);
  } else {
    const book = db.prepare('SELECT id, title FROM books WHERE id = ?').get(bookId) as { id: number; title: string } | undefined;
    if (!book) {
      console.log(`Book ${bookId} not found`);
      db.close();
      return;
    }

    console.log(`📚 Book ${book.id}: ${book.title}`);
    const generated = await processBook(book.id, db);
    console.log(`\n✅ Generated ${generated} interpretations`);
  }

  db.close();
}

main().catch(console.error);
