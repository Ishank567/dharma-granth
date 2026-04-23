import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');
const db = new Database(DB_PATH);

// Simple offline interpretation generator
function createOfflineInterpretation(input: any) {
  const excerpt = input.originalText.split(/[।!?]/)[0]?.trim() || 'यह पाठ';
  const themes = ['आत्मचिन्तन', 'जीवन-विवेक'];

  return {
    shabdarth: `इस पाठ में मुख्य शब्द ध्यान देने योग्य हैं।\n\n📝 सरल अनुवाद: "${excerpt}" — यह पाठ ${themes.join(' और ')} की दिशा में मार्गदर्शन करता है।`,
    bhavarth: `यह पाठ ${input.bookTitle} ग्रंथ का एक महत्वपूर्ण अंग है। "${excerpt}" जैसे सूत्र यह बताता है कि धर्मग्रंथ का उद्देश्य केवल सूचना देना नहीं, बल्कि दृष्टि बदलना है। साधक जब इस पाठ को अपने जीवन के संदर्भ में पढ़ता है, तब इसका अर्थ गहरा होता है।`,
    simple_example: `कल्पना करें कि एक व्यक्ति जीवन की चुनौतियों का सामना कर रहा है। जब वह शांत होकर विचार करता है, तो उसे समझ आता है कि हर समस्या का समाधान उसके भीतर ही है — बस धीरज और स्पष्टता चाहिए। ठीक इसी तरह, यह पाठ हमें सिखाता है कि ${themes.join(' और ')} का मार्ग धीरे-धीरे मिलता है।`,
    guided_learning: `1. पहले श्लोक ${input.verseNumber} को धीमे मन से दो या तीन बार पढ़ें।\n2. हर संस्कृत शब्द का अर्थ समझने की कोशिश करें।\n3. फिर देखें कि इसमें कौन-सा जीवन-संदेश उभर रहा है।\n4. अंत में अपने जीवन से एक उदाहरण जोड़ें।`,
    scientific_temperament: `विज्ञान की दृष्टि से यह पाठ मानव मन की कार्यप्रणाली को दर्शाता है। जैसे न्यूरॉन्स नेटवर्क बनाते हैं, वैसे ही विचार पैटर्न बनाते हैं। यह पाठ सुझाव देता है कि विचारों को नियंत्रित करने से मानसिक शांति मिलती है।`,
    modern_relevance: `आज के व्यस्त जीवन में यह पाठ बहुत प्रासंगिक है। मोबाइल, सोशल मीडिया और काम के दबाव में मन अशांत रहता है। यह पाठ याद दिलाता है कि भीतर की शांति के बिना बाहरी सफलता अधूरी है।`,
    next_curiosity: `यह पढ़कर क्या सवाल मन में उठा? क्या आपने कभी ऐसे अनुभव किए हैं? अगले श्लोक में शायद इसका उत्तर मिले।`
  };
}

async function generateInterpretation(verseId: number) {
  const verse = db.prepare('SELECT v.*, b.title_hindi as book_title FROM verses v JOIN books b ON v.book_id = b.id WHERE v.id = ?').get(verseId) as any;

  if (!verse) {
    console.log(`Verse ${verseId} not found`);
    return;
  }

  // Check if interpretation already exists
  const existing = db.prepare('SELECT id FROM interpretations WHERE verse_id = ?').get(verseId);
  if (existing) {
    console.log(`Interpretation already exists for verse ${verseId}`);
    return;
  }

  try {
    // Create offline interpretation
    const interpretationInput = {
      bookTitle: verse.book_title,
      verseNumber: verse.verse_number.toString(),
      originalText: verse.original_text,
      translationHindi: verse.translation_hindi || undefined,
      translationEnglish: verse.translation_english || undefined,
    };

    const interpretation = createOfflineInterpretation(interpretationInput);

    // Save to database
    db.prepare(`INSERT INTO interpretations (
      verse_id, shabdarth, bhavarth, simple_example, guided_learning,
      scientific_temperament, modern_relevance, next_curiosity, source
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'offline')`).run(
      verseId,
      interpretation.shabdarth,
      interpretation.bhavarth,
      interpretation.simple_example,
      interpretation.guided_learning,
      interpretation.scientific_temperament,
      interpretation.modern_relevance,
      interpretation.next_curiosity
    );

    console.log(`Generated offline interpretation for verse ${verseId}`);
  } catch (error) {
    console.error(`Failed to generate interpretation for verse ${verseId}:`, error);
  }
}

async function main() {
  // Get all verses from Garuda Purana
  const verses = db.prepare('SELECT id FROM verses WHERE book_id = 18').all() as { id: number }[];

  console.log(`Generating offline interpretations for ${verses.length} Garuda Purana verses...`);

  for (const verse of verses) {
    await generateInterpretation(verse.id);
  }

  console.log('Done!');
}

main().catch(console.error).finally(() => db.close());