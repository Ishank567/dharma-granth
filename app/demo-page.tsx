export default function Home() {
  // Static demo data for GitHub Pages
  const demoVerses = [
    {
      id: 67894,
      book_title: 'गरुड़ पुराण',
      verse_number: 1,
      original_text: 'ॐ नमो भगवते वासुदेवाय। अथातो धर्मजिज्ञासा। धर्मस्य मूलं वेदाः। वेदानां मूलं ब्रह्म। ब्रह्मणो मूलं सत्यम्॥',
      translation_hindi: 'ॐ भगवान वासुदेव को नमस्कार। अब धर्म की जिज्ञासा। धर्म की जड़ वेद हैं। वेदों की जड़ ब्रह्म है। ब्रह्म की जड़ सत्य है॥'
    },
    {
      id: 67895,
      book_title: 'गरुड़ पुराण',
      verse_number: 2,
      original_text: 'सत्यमेव परं ब्रह्म। ब्रह्मैव परं सत्यम्। सत्यं ज्ञानमनन्तं यत्। ज्ञानं सत्यं परात्परम्॥',
      translation_hindi: 'सत्य ही परम ब्रह्म है। ब्रह्म ही परम सत्य है। जो ज्ञान अनंत है वह सत्य है। ज्ञान सत्य से परात्पर है॥'
    },
    {
      id: 67896,
      book_title: 'गरुड़ पुराण',
      verse_number: 3,
      original_text: 'आत्मा ज्ञानमयो नित्यम्। ज्ञानं चैवात्ममयम्। आत्मज्ञानं परं ज्ञानम्। ज्ञानादात्मा प्रकाशते॥',
      translation_hindi: 'आत्मा नित्य ज्ञानमय है। ज्ञान भी आत्ममय है। आत्मज्ञान परम ज्ञान है। ज्ञान से आत्मा प्रकाशित होता है॥'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-900 mb-4 font-serif-deva">
            धर्म ग्रंथ
          </h1>
          <p className="text-lg text-orange-700 mb-6">
            प्राचीन भारतीय धर्मग्रंथों का संकलन - OCR द्वारा डिजिटाइज़
          </p>
          <div className="bg-orange-100 rounded-lg p-4 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold text-orange-800 mb-2">OCR परिणाम पूर्वावलोकन</h2>
            <p className="text-orange-700">
              67 ग्रंथों में से 26,495 पृष्ठों का OCR सम्पन्न | गरुड़ पुराण के 530 श्लोक निकाले गए
            </p>
          </div>
        </header>

        <main className="max-w-4xl mx-auto">
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-orange-900 mb-6 text-center">
              गरुड़ पुराण - OCR नमूना
            </h2>

            <div className="grid gap-6">
              {demoVerses.map((verse) => (
                <div key={verse.id} className="bg-white rounded-xl shadow-lg p-6 border border-orange-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-orange-800">
                      {verse.book_title} - श्लोक {verse.verse_number}
                    </h3>
                    <span className="text-sm text-orange-600 bg-orange-100 px-2 py-1 rounded">
                      Verse ID: {verse.id}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-orange-700 mb-2">मूल पाठ (OCR द्वारा निकाला गया):</h4>
                      <p className="text-gray-800 font-serif-deva text-lg leading-relaxed bg-orange-50 p-3 rounded">
                        {verse.original_text}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-orange-700 mb-2">हिन्दी अनुवाद:</h4>
                      <p className="text-gray-700 bg-green-50 p-3 rounded">
                        {verse.translation_hindi}
                      </p>
                    </div>

                    <div className="border-t border-orange-200 pt-4">
                      <div className="flex items-center gap-2 text-sm text-orange-600">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                        व्याख्या उपलब्ध (ऑफलाइन मोड)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white rounded-xl shadow-lg p-8 border border-orange-200">
            <h2 className="text-2xl font-bold text-orange-900 mb-6 text-center">
              परियोजना विवरण
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-orange-800 mb-3">OCR प्रोसेसिंग</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Google Cloud Vision API का उपयोग</li>
                  <li>• 67 प्राचीन ग्रंथों का डिजिटाइज़ेशन</li>
                  <li>• 26,495 पृष्ठों का प्रसंस्करण</li>
                  <li>• संस्कृत और हिन्दी टेक्स्ट पहचान</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-orange-800 mb-3">AI व्याख्याएं</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Gemini AI द्वारा गहन विश्लेषण</li>
                  <li>• 530 गरुड़ पुराण श्लोक व्याख्याएं</li>
                  <li>• बहु-स्तरीय अर्थ-विवेचन</li>
                  <li>• आधुनिक प्रासंगिकता</li>
                </ul>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-600 mb-4">
                यह एक स्टेटिक डेमो संस्करण है। पूर्ण कार्यक्षमता के लिए सर्वर-साइड डेटाबेस की आवश्यकता है।
              </p>
              <div className="flex justify-center gap-4">
                <a
                  href="https://github.com/Ishank567/dharma-granth"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Repository
                </a>
                <span className="text-gray-400">|</span>
                <span className="text-gray-500">Next.js + TypeScript + SQLite</span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}