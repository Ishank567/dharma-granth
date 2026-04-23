import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  InterpretationValidationError,
  normalizeInterpretationPayload,
  type InterpretationGenerationInput,
} from '@/app/lib/interpretationUtils';

function getGenAIClient(apiKey?: string) {
  const key = apiKey || process.env.GOOGLE_GEMINI_API_KEY_2 || process.env.GOOGLE_GEMINI_API_KEY;
  if (!key) {
    throw new Error('Gemini API key सेट नहीं है');
  }
  return new GoogleGenerativeAI(key);
}

function buildPrompt(input: InterpretationGenerationInput) {
  const translationBlock = [
    input.translationHindi ? `हिन्दी अर्थ-सूत्र: ${input.translationHindi}` : '',
    input.translationEnglish ? `अंग्रेज़ी अर्थ-सूत्र: ${input.translationEnglish}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const courseBlock = input.courseContext
    ? [
        `पाठ्यक्रम: ${input.courseContext.courseTitle}`,
        `अध्ययन खंड: ${input.courseContext.moduleTitle}`,
        `खंड सार: ${input.courseContext.moduleSummary}`,
        `मनन प्रश्न: ${input.courseContext.reflection}`,
        `अभ्यास संकेत: ${input.courseContext.practice}`,
      ].join('\n')
    : '';

  return `तुम सनातन धर्मग्रंथों के गहन अध्येता हो। नीचे दिए गए श्लोक या पाठ की **पूरी और विस्तृत** व्याख्या केवल हिन्दी में दो। भाषा सरल लेकिन गंभीर हो, शैली ध्यानपूर्ण और आत्मचिन्तन जगाने वाली हो, पर किसी विशेष गुरु, लेखक या वक्ता की नकल मत करो।

व्याख्या ऐसी हो कि **पूर्ण नौसिखिया** भी आसानी से समझ सके, रुचि बने रहे और अगला श्लोक पढ़ने की उत्सुकता जगे। गंभीर साधक को भी गहराई मिले। तर्क, निरीक्षण, अनुभव और जीवन-प्रयोग का संतुलन बनाए रखो।

**महत्वपूर्ण:** हर संस्कृत पद/वाक्यांश को अलग-अलग लेकर उसका अर्थ स्पष्ट करो। कोई भी शब्द छोड़ो नहीं। हर कठिन विचार को दैनिक जीवन के उदाहरण, कहानी या दृश्य (analogy) से समझाओ ताकि पाठक तुरंत जुड़ सके।

संदर्भ:
- ग्रंथ: ${input.bookTitle}
- श्लोक संख्या: ${input.verseNumber}
${input.chapterTitle ? `- अध्याय या खंड: ${input.chapterTitle}\n` : ''}${input.transliteration ? `- लिप्यन्तरण: ${input.transliteration}\n` : ''}${translationBlock ? `\nउपलब्ध अनुवाद संकेत:\n${translationBlock}\n` : ''}${courseBlock ? `\nअध्ययन सन्दर्भ:\n${courseBlock}\n` : ''}
मूल पाठ:
${input.originalText}

कृपया निम्नलिखित **सात भागों** में उत्तर दो:

1. **शब्दार्थ (पद-विभाग):** मूल पाठ के **हर संस्कृत शब्द या पद** को अलग-अलग लिखो और उसका स्पष्ट हिन्दी अर्थ दो। प्रारूप: "**संस्कृत शब्द** → हिन्दी अर्थ" (प्रति पंक्ति एक शब्द/पद)। कोई शब्द मत छोड़ो। अंत में एक वाक्य में पूरे श्लोक का सरल अनुवाद दो।

2. **भावार्थ (गहन अर्थ):** 8-12 वाक्यों में गहरा दार्शनिक, मनोवैज्ञानिक और आध्यात्मिक अर्थ। **कम से कम 2 ठोस उदाहरण** दो — जैसे जीवन की कोई परिचित स्थिति, प्रकृति का दृश्य, या कोई छोटी कहानी/दृष्टांत जिससे अर्थ तुरंत स्पष्ट हो जाए।

3. **सरल दृश्य (उदाहरण):** एक सरल, जीवंत **रोज़मर्रा की कहानी या परिदृश्य** (3-5 वाक्य) जो इस श्लोक के मूल संदेश को पूरी तरह समझा दे — जैसे किसी बच्चे, किसान, विद्यार्थी या गृहस्थ के जीवन का उदाहरण। पाठक को लगे "हाँ, मैं यह समझ गया!"

4. **मार्गदर्शित अध्ययन:** 5-7 क्रमबद्ध बिंदु, जिनसे पाठक समझ सके कि इस पाठ को कैसे पढ़े, किन प्रश्नों पर ठहरे, क्या देखे और किस पर मनन करे। हर बिंदु को **क्रियात्मक** रखो ("पूछें...", "देखें...", "लिखें...", "परखें...")।

5. **वैज्ञानिक दृष्टि:** 5-7 वाक्यों में तर्कशील, निरीक्षण-आधारित, मनोवैज्ञानिक या व्यवहारिक समझ। जहाँ संभव हो, **मनोविज्ञान या न्यूरो-साइंस का कोई ठोस तथ्य** जोड़ो (जैसे ध्यान से प्रीफ्रंटल कॉर्टेक्स की सक्रियता, कृतज्ञता से डोपामाइन का प्रभाव आदि)। छद्म-विज्ञान बिलकुल नहीं।

6. **जीवन-साधना:** 4-6 वाक्यों में आज के जीवन के लिए **दिन भर का एक ठोस अभ्यास** — कब करें, कैसे करें, क्या देखें। ऐसा लगे कि यह एक मित्रवत मार्गदर्शक बता रहा है।

7. **अगले श्लोक की ओर:** 2-3 वाक्यों में **जिज्ञासा जगाने वाला संकेत** — जैसे "अब तक हमने यह समझा... लेकिन आगे एक और गहरा प्रश्न है..." ताकि पाठक अगला श्लोक पढ़ने को उत्सुक हो।

अतिरिक्त निर्देश:
- केवल हिन्दी में लिखो।
- किसी भी भाग को खाली मत छोड़ो।
- हर कठिन अवधारणा के साथ **कम से कम एक उदाहरण** दो।
- प्रतीकात्मक कथनों को वैज्ञानिक तथ्य की तरह प्रस्तुत मत करो।
- मूल पाठ के **हर शब्द** का शब्दार्थ दो, कुछ भी मत छोड़ो।
- शैली ऐसी रखो कि पाठक को लगे कि कोई ज्ञानी मित्र सरलता से समझा रहा है।

JSON format में उत्तर दो:
{
  "shabdarth": "**शब्द1** → अर्थ1\\n**शब्द2** → अर्थ2\\n...\\n\\n📝 सरल अनुवाद: ...",
  "bhavarth": "भावार्थ यहाँ... उदाहरणों सहित...",
  "simple_example": "एक सरल जीवंत कहानी/परिदृश्य...",
  "guided_learning": "1. ...\\n2. ...\\n3. ...",
  "scientific_temperament": "वैज्ञानिक दृष्टि यहाँ... ठोस तथ्यों सहित...",
  "modern_relevance": "जीवन-साधना यहाँ... आज का अभ्यास...",
  "next_curiosity": "अगले श्लोक की ओर..."
}

केवल वैध JSON दो, कोई अतिरिक्त text नहीं।`;
}

function extractJsonPayload(text: string) {
  const fencedMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fencedMatch?.[1]?.trim() || text.trim();
  const jsonMatch = candidate.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new InterpretationValidationError('एआई ने सही JSON प्रारूप में उत्तर नहीं दिया');
  }

  return jsonMatch[0];
}

function collectGeminiApiKeys(): string[] {
  const keys: string[] = [];
  const seen = new Set<string>();
  const tryPush = (value: string | undefined) => {
    if (!value) return;
    const trimmed = value.trim();
    if (!trimmed || seen.has(trimmed)) return;
    seen.add(trimmed);
    keys.push(trimmed);
  };
  tryPush(process.env.GOOGLE_GEMINI_API_KEY_2);
  tryPush(process.env.GOOGLE_GEMINI_API_KEY);
  for (let i = 3; i <= 20; i++) {
    tryPush(process.env[`GOOGLE_GEMINI_API_KEY_${i}`]);
  }
  return keys;
}

export async function generateInterpretation(input: InterpretationGenerationInput) {
  const keys = collectGeminiApiKeys();
  if (keys.length === 0) {
    throw new Error('Gemini API key सेट नहीं है');
  }

  let lastError: unknown;
  for (const key of keys) {
    try {
      const model = getGenAIClient(key).getGenerativeModel({ model: 'gemini-2.0-flash' });
      const prompt = buildPrompt(input);
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      return normalizeInterpretationPayload(JSON.parse(extractJsonPayload(text)));
    } catch (error) {
      lastError = error;
      if (error instanceof InterpretationValidationError) throw error;
      continue;
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error('Gemini request failed');
}
