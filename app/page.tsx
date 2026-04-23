import CategoryCard from './components/CategoryCard';
import SearchBar from './components/SearchBar';
import ContinueReading from './components/ContinueReading';
import StreakDashboard from './components/StreakDashboard';
import { getAllCategories, getStats, getRandomVerse } from './lib/db';
import type { Category, Verse } from './lib/types';
import Link from 'next/link';

// Check if we're in static export mode (GitHub Pages)
const isStaticExport = process.env.NODE_ENV === 'production' && process.env.NEXT_OUTPUT === 'export';

export const dynamic = 'force-static';

export default function HomePage() {
  // For static export (GitHub Pages), show demo page
  if (isStaticExport) {
    return <DemoPage />;
  }

  let categories: Category[] = [];
  let stats = { categories: 0, books: 0, verses: 0 };
  let verseOfDay: Verse | null = null;

  try {
    categories = getAllCategories() as Category[];
    stats = getStats();
    verseOfDay = getRandomVerse() as Verse | null;
  } catch (error) {
    console.error('Failed to load homepage data:', error);
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[var(--gradient-hero)] py-20 px-4 text-center text-white">
        <div className="absolute inset-0 bg-black/20" />
        {/* Decorative floating elements */}
        <div className="absolute top-10 left-[10%] text-4xl opacity-20 animate-float" style={{ animationDelay: '0s' }} aria-hidden="true">🙏</div>
        <div className="absolute top-20 right-[15%] text-3xl opacity-15 animate-float" style={{ animationDelay: '1.5s' }} aria-hidden="true">📿</div>
        <div className="absolute bottom-10 left-[20%] text-3xl opacity-15 animate-float" style={{ animationDelay: '3s' }} aria-hidden="true">🪔</div>
        <div className="relative mx-auto max-w-4xl">
          <div className="text-6xl mb-6 animate-float" aria-hidden="true">🕉️</div>
          <h1 className="font-serif-deva text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg">
            धर्म ग्रंथ
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-2">
            सनातन धर्म के पवित्र ग्रंथों का डिजिटल संग्रह
          </p>
          <p className="font-scripture text-base opacity-80 mb-8">
            तमसो मा ज्योतिर्गमय — अंधकार से प्रकाश की ओर ले चलो
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Stats - Enhanced */}
      {stats.books > 0 && (
        <section className="border-b border-border bg-card py-8">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex justify-center gap-8 md:gap-16 text-center">
              <div className="animate-count" style={{ animationDelay: '0.1s' }}>
                <div className="text-3xl font-bold text-gradient">{stats.categories}</div>
                <div className="text-xs text-muted mt-1">श्रेणियाँ</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="animate-count" style={{ animationDelay: '0.2s' }}>
                <div className="text-3xl font-bold text-gradient">{stats.books}</div>
                <div className="text-xs text-muted mt-1">ग्रंथ</div>
              </div>
              <div className="h-12 w-px bg-border" />
              <div className="animate-count" style={{ animationDelay: '0.3s' }}>
                <div className="text-3xl font-bold text-gradient">{stats.verses.toLocaleString('hi-IN')}</div>
                <div className="text-xs text-muted mt-1">श्लोक/पाठ</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Study Method Section */}
      <section className="mx-auto max-w-7xl px-4 py-12 animate-fade-in">
        <div className="rounded-[2rem] border border-border bg-card p-8 md:p-10">
          <div className="max-w-3xl">
            <h2 className="font-serif-deva text-3xl font-bold text-foreground mb-3">
              मार्गदर्शित अध्ययन और तर्कशील मनन
            </h2>
            <p className="text-muted leading-relaxed">
              यहाँ हर श्लोक केवल पढ़ने के लिए नहीं, समझने, परखने और जीवन में उतारने के लिए है। प्रत्येक गहन व्याख्या में अर्थ, मनन, वैज्ञानिक दृष्टि और व्यवहारिक अभ्यास का क्रम रखा गया है।
            </p>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-4">
            {[
              { icon: '📖', title: 'शांत पाठ', desc: 'पहले श्लोक को धैर्य से पढ़ें और मुख्य शब्दों पर ध्यान दें।' },
              { icon: '🪷', title: 'गहन अर्थ', desc: 'भावार्थ के माध्यम से दर्शन, मन और साधना की परतें खुलेंगी।' },
              { icon: '🔬', title: 'वैज्ञानिक दृष्टि', desc: 'तर्क, अनुभव, मनोविज्ञान और व्यवहार की कसौटी पर विचारों को परखें।' },
              { icon: '🌱', title: 'जीवन-अभ्यास', desc: 'हर अध्ययन के बाद एक छोटा अभ्यास चुनें और दिन भर उसका निरीक्षण करें।' },
            ].map((item, i) => (
              <div
                key={item.title}
                className="rounded-2xl border border-border bg-background/70 p-5 transition-all duration-300 hover:border-accent/20 hover:shadow-md animate-fade-in"
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
              >
                <p className="text-2xl mb-3">{item.icon}</p>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent/90 transition-all hover:shadow-lg active:scale-[0.98]"
            >
              🧭 अध्यायवार अध्ययन पथ खोलें
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <ContinueReading />
        <StreakDashboard />
        <div className="text-center mb-12">
          <h2 className="font-serif-deva text-3xl font-bold text-foreground mb-2">
            ग्रंथ श्रेणियाँ
          </h2>
          <p className="text-muted">
            वेदों से लेकर भक्ति ग्रंथों तक — सभी पवित्र ग्रंथ एक स्थान पर
          </p>
        </div>

        {categories.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat, i) => (
              <div key={cat.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.05}s` }}>
                <CategoryCard category={cat} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 rounded-2xl border border-border bg-card">
            <p className="text-4xl mb-4">📚</p>
            <p className="text-muted text-lg mb-2">डेटाबेस अभी तैयार नहीं है</p>
            <p className="text-sm text-muted-light">
              कृपया पहले PDF निष्कर्षण आदेश चलाएँ:
            </p>
            <code className="mt-2 inline-block rounded-lg bg-accent-bg px-4 py-2 text-sm text-accent">
              npx tsx scripts/extract-pdfs.ts
            </code>
          </div>
        )}
      </section>

      {/* Verse of the Day */}
      {verseOfDay && (
        <section className="mx-auto max-w-3xl px-4 pb-16 animate-fade-in">
          <div className="text-center mb-8">
            <h2 className="font-serif-deva text-2xl font-bold text-foreground mb-1">
              🌅 आज का श्लोक
            </h2>
            <p className="text-sm text-muted">प्रतिदिन एक नया श्लोक — जीवन को प्रकाशित करें</p>
          </div>
          <div className="rounded-2xl border border-accent/20 bg-verse-bg p-8 text-center transition-all hover:shadow-lg hover:border-accent/30">
            <div className="font-scripture text-lg leading-loose text-foreground mb-4 whitespace-pre-wrap">
              {verseOfDay.original_text.slice(0, 300)}
              {verseOfDay.original_text.length > 300 && '...'}
            </div>
            <p className="text-sm text-muted mb-4">
              — {verseOfDay.book_title}
            </p>
            <Link
              href={`/categories/${verseOfDay.category_slug}/${verseOfDay.book_slug}/${verseOfDay.id}`}
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 transition-all hover:shadow-lg active:scale-[0.98]"
            >
              गहन व्याख्या सहित पढ़ें →
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}

// Static demo page for GitHub Pages
function DemoPage() {
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
