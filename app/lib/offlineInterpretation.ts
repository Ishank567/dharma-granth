import {
  normalizeInterpretationPayload,
  type InterpretationGenerationInput,
  type InterpretationPayload,
} from '@/app/lib/interpretationUtils';

const THEME_HINTS = [
  { pattern: /धर्म|कर्तव्य|मर्यादा/u, label: 'धर्म और कर्तव्य' },
  { pattern: /कर्म|क्रिया|यज्ञ/u, label: 'कर्म और उत्तरदायित्व' },
  { pattern: /योग|ध्यान|समाधि|चित्त/u, label: 'योग और चित्त-अनुशासन' },
  { pattern: /आत्मा|आत्मन्|स्व/u, label: 'आत्मबोध' },
  { pattern: /ब्रह्म|ईश्वर|पुरुषोत्तम|परम/u, label: 'परम सत्य' },
  { pattern: /भक्ति|प्रेम|समर्पण/u, label: 'भक्ति और समर्पण' },
  { pattern: /मृत्यु|अमृत|जीवन/u, label: 'जीवन और मृत्यु का विवेक' },
  { pattern: /माया|अविद्या|अज्ञान/u, label: 'माया और अज्ञान' },
  { pattern: /शान्ति|शांति|समत्व/u, label: 'समत्व और शांति' },
  { pattern: /विवेक|ज्ञान|प्रज्ञा/u, label: 'विवेक और प्रज्ञा' },
];

function normalizeWhitespace(text: string) {
  return text.replace(/\s+/g, ' ').trim();
}

function getPrimaryExcerpt(text: string) {
  return normalizeWhitespace(text)
    .split(/[।!?]|\n/u)
    .map((line) => line.trim())
    .filter(Boolean)[0] || 'यह पाठ';
}

function extractKeywords(text: string) {
  const cleaned = text
    .replace(/[0-9०-९]/g, ' ')
    .replace(/[\[\]{}(),;:"'""''!?…\-|/\\]/g, ' ')
    .replace(/[॥।]/g, ' ');

  const unique = new Set<string>();
  for (const token of cleaned.split(/\s+/)) {
    const word = token.trim();
    if (!word || word.length < 3) {
      continue;
    }
    unique.add(word);
    if (unique.size >= 5) {
      break;
    }
  }

  return [...unique];
}

function inferThemes(text: string, bookTitle?: string) {
  const source = `${bookTitle || ''} ${text}`;
  const themes = THEME_HINTS.filter((hint) => hint.pattern.test(source)).map((hint) => hint.label);
  if (themes.length > 0) {
    return themes.slice(0, 3);
  }
  return ['आत्मचिन्तन', 'जीवन-विवेक'];
}

function buildDefaultReflection(themes: string[]) {
  return `यह पाठ मेरे सोचने, चुनने और प्रतिक्रिया देने के ढंग में ${themes.join(' और ')} के स्तर पर क्या दिखा रहा है?`;
}

function buildDefaultPractice(themes: string[]) {
  return `आज के दिन में एक प्रसंग चुनें और देखें कि ${themes.join(' और ')} का यह संकेत आपके व्यवहार में कैसे उतर सकता है।`;
}

export function createOfflineInterpretation(input: InterpretationGenerationInput): InterpretationPayload {
  const excerpt = getPrimaryExcerpt(input.originalText);
  const keywords = extractKeywords(input.originalText);
  const keywordText = keywords.length > 0 ? keywords.join(', ') : excerpt;
  const translationHint = normalizeWhitespace(input.translationHindi || input.translationEnglish || '');
  const themes = inferThemes(
    `${input.originalText} ${input.translationHindi} ${input.translationEnglish}`,
    input.bookTitle
  );
  const reflectionPrompt = input.courseContext?.reflection || buildDefaultReflection(themes);
  const practicePrompt = input.courseContext?.practice || buildDefaultPractice(themes);
  const chapterHint = input.chapterTitle ? `${input.chapterTitle} के संदर्भ में ` : '';
  const headerSummary =
    input.courseContext?.headerSummary ||
    `${themes.join(' और ')} की दृष्टि से इस पाठ को पढ़ना उपयोगी होगा।`;
  const moduleSummary =
    input.courseContext?.moduleSummary ||
    `${chapterHint}यह पाठ साधक को भीतर की स्पष्टता और उत्तरदायित्व की ओर बुलाता है।`;

  const wordEntries = keywords.map((w) => `**${w}** → इस शब्द का अर्थ ${themes[0] || 'अध्ययन'} के संदर्भ में समझें।`);
  const shabdarthText = wordEntries.length > 0
    ? `${wordEntries.join('\n')}\n\n📝 सरल अनुवाद: "${excerpt}" — यह पाठ ${themes.join(' और ')} की दिशा में मार्गदर्शन करता है।`
    : `इस पाठ में ${keywordText} जैसे शब्द विशेष ध्यान देने योग्य हैं। इनके माध्यम से ${themes.join(' और ')} की दिशा खुलती है।\n\n📝 सरल अनुवाद: यह पाठ ${themes.join(' और ')} की शिक्षा देता है।`;

  return normalizeInterpretationPayload({
    shabdarth: shabdarthText,
    bhavarth: `${moduleSummary} ${headerSummary} "${excerpt}" जैसा सूत्र यह बताता है कि धर्मग्रंथ का उद्देश्य केवल सूचना देना नहीं, बल्कि दृष्टि बदलना है। साधक जब इस पाठ को अपने अहंकार, भय, मोह, आदत या आकांक्षा के संदर्भ में पढ़ता है, तब इसका अर्थ गहरा होता है। ${translationHint ? `उपलब्ध अर्थ-सूत्र "${translationHint.slice(0, 140)}${translationHint.length > 140 ? '...' : ''}" इस दिशा को और स्पष्ट करता है। ` : ''}उदाहरण के लिए, जैसे एक नदी बिना रुके बहती रहती है और किनारे उसे रोक नहीं पाते, वैसे ही सत्य का ज्ञान सभी बाधाओं को पार करता है। इसलिए इस श्लोक को जीवन की प्रत्यक्ष परिस्थितियों से जोड़कर पढ़ना अधिक सार्थक है।`,
    simple_example: `कल्पना करें कि एक विद्यार्थी परीक्षा के दबाव में है। उसे लगता है कि सब कुछ बहुत कठिन है। लेकिन जब वह शांत होकर एक-एक विषय पर ध्यान देता है, तो उसे समझ आता है कि हर प्रश्न का उत्तर उसके भीतर ही है — बस धीरज और स्पष्टता चाहिए। ठीक इसी तरह, यह पाठ हमें सिखाता है कि ${themes.join(' और ')} का मार्ग धीरे-धीरे, एक कदम के बाद दूसरा कदम रखने से मिलता है।`,
    guided_learning: [
      `1. पहले श्लोक ${input.verseNumber} को धीमे मन से दो या तीन बार पढ़ें और हर संस्कृत शब्द को रेखांकित करें।`,
      `2. ऊपर दिए गए शब्दार्थ की सहायता से हर शब्द का अर्थ समझें — एक भी शब्द न छोड़ें।`,
      `3. फिर देखें कि इसमें ${themes.join(' और ')} का कौन-सा सूत्र उभर रहा है।`,
      `4. सरल दृश्य (उदाहरण) पढ़ें और सोचें: क्या मेरे जीवन में ऐसी कोई स्थिति है?`,
      `5. अपने आप से पूछें: ${reflectionPrompt}`,
      `6. अंत में एक छोटा व्यवहारिक प्रयोग चुनें: ${practicePrompt}`,
      `7. शाम को दो मिनट रुककर सोचें — आज इस पाठ से क्या एक बात सीखी?`,
    ].join('\n'),
    scientific_temperament: `इस पाठ को तर्कशीलता के साथ पढ़ने का अर्थ है कि आप इसके संकेतों को मनोविज्ञान, व्यवहार, कारण-कार्य संबंध और प्रत्यक्ष निरीक्षण से परखें। आधुनिक मनोविज्ञान बताता है कि जब हम किसी विचार पर शांत चिंतन करते हैं, तो मस्तिष्क का प्रीफ्रंटल कॉर्टेक्स अधिक सक्रिय होता है — यही वह क्षेत्र है जो विवेक, निर्णय और आत्मनियंत्रण से जुड़ा है। जो भाषा प्रतीकात्मक है उसे प्रतीकात्मक ही समझें, और जो संकेत आचरण से जुड़े हैं उन्हें दिनचर्या में जाँचें। ध्यान दें कि आपकी प्रतिक्रिया, आदत, भावनात्मक आवेग और निर्णय शैली में क्या परिवर्तन आता है; यही इस शिक्षण का अनुभवजन्य पक्ष है।`,
    modern_relevance: `${practicePrompt} सुबह उठकर एक मिनट शांत बैठें और इस श्लोक का एक शब्द मन में रखें। दिन भर जब भी कोई कठिन क्षण आए, उस शब्द को याद करें। शाम को दो बातें लिखें: कहाँ आपने पुराने ढंग से प्रतिक्रिया दी और कहाँ इस पाठ के कारण थोड़ा अधिक सजग होकर देखा। इसी प्रकार यह अध्ययन धीरे-धीरे विचार को अनुभव और अनुभव को जीवन-साधना में बदलता है।`,
    next_curiosity: `अब तक हमने ${themes.join(' और ')} का एक पहलू समझा। लेकिन यह यात्रा यहीं नहीं रुकती — अगले पाठ में एक और गहरा उत्तर छिपा है जो इस समझ को नई दिशा देगा। चलिए, अगला श्लोक पढ़ें और देखें कि यह सिलसिला कहाँ ले जाता है!`,
  });
}
