import CategoryCard from './components/CategoryCard';
import SearchBar from './components/SearchBar';
import ContinueReading from './components/ContinueReading';
import StreakDashboard from './components/StreakDashboard';
import { getAllCategories, getStats, getRandomVerse } from './lib/db';
import type { Category, Verse } from './lib/types';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function HomePage() {
  let categories: Category[] = [];
  let stats = { categories: 0, books: 0, verses: 0 };
  let verseOfDay: Verse | null = null;

  try {
    categories = getAllCategories() as Category[];
    stats = getStats();
    verseOfDay = getRandomVerse() as Verse | null;
  } catch {
    // DB not yet initialized
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[var(--gradient-hero)] py-20 px-4 text-center text-white">
        <div className="absolute inset-0 bg-black/20" />
        {/* Decorative floating elements */}
        <div className="absolute top-10 left-[10%] text-4xl opacity-20 animate-float" style={{ animationDelay: '0s' }}>🙏</div>
        <div className="absolute top-20 right-[15%] text-3xl opacity-15 animate-float" style={{ animationDelay: '1.5s' }}>📿</div>
        <div className="absolute bottom-10 left-[20%] text-3xl opacity-15 animate-float" style={{ animationDelay: '3s' }}>🪔</div>
        <div className="relative mx-auto max-w-4xl">
          <div className="text-6xl mb-6 animate-float">🕉️</div>
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
              <div className="h-12 w-px bg-border hidden md:block" />
              <div className="animate-count hidden md:block" style={{ animationDelay: '0.4s' }}>
                <div className="text-3xl font-bold text-gradient">100%</div>
                <div className="text-xs text-muted mt-1">व्याख्या सम्पूर्ण</div>
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
            <Link
              href="/categories/bhakti/ramcharitmanas"
              className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/70 px-5 py-3 text-sm font-semibold text-foreground hover:bg-card-hover transition-all"
            >
              📘 रामचरितमानस से अध्ययन शुरू करें
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
