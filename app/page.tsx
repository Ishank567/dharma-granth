import Link from "next/link";
import type { ReactNode } from "react";
import { categories } from "@/data/scripture-meta";
import {
  getAllScriptures,
  getAvailableScriptures,
  getRealChapterCount,
  getRealScriptureCount,
  getRealVerseCount,
} from "@/data/scriptures";
import { FadeUp, FadeUpOnView, Stagger, StaggerItem } from "@/app/components/motion/primitives";
import { ScriptureCard } from "@/app/components/motion/ScriptureCard";
import { InteractiveInfographic } from "@/app/components/InteractiveInfographic";
import { PanchangCalendar } from "@/app/components/PanchangCalendar";
import { NityaKarmaKriya } from "@/app/components/NityaKarmaKriya";
import { StatsInfographic } from "@/app/components/StatsInfographic";
import { ThreePillarsInfographic } from "@/app/components/ThreePillarsInfographic";
import { ScienceSpiritualityInfographic } from "@/app/components/ScienceSpiritualityInfographic";
import { HeroSection } from "@/app/components/HeroSection";
import {
  BookOpen,
  Flame,
  Scroll,
  TreePine,
  Scale,
  Heart,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

// ── Featured Verse: Bhagavad Gita 2.47 ──────────────────────────
const featuredVerse = {
  sanskrit:
    "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
  transliteration:
    "karmaṇyevādhikāraste mā phaleṣu kadācana |\nmā karmaphalaheturbhūrmā te saṅgo'stvakarmaṇi ||",
  translation:
    "You have a right only to perform your duty; the fruits thereof are not your concern. Let not the fruit of action be your motive, nor let attachment to inaction take hold of you.",
  hindi:
    "तुम्हारा अधिकार केवल कर्म करने में है, फल में कभी नहीं। न तो कर्म के फल का कारण बनो, और न ही कर्म न करने में आसक्त हो।",
  hindiExplanation:
    "यह गीता का सर्वश्रेष्ठ और सबसे प्रसिद्ध श्लोक है। श्रीकृष्ण सिखाते हैं — अपने कर्म पर पूरा ध्यान दो, परिणाम की चिंता छोड़ो। जब हम फल की आसक्ति त्यागते हैं, तभी हम अपना सर्वश्रेष्ठ कर्म करते हैं और जीवन में वास्तविक शांति पाते हैं।",
  science:
    'मनोवैज्ञानिक Carol Dweck (Stanford) के शोध से सिद्ध — जो लोग "प्रक्रिया" पर ध्यान देते हैं न कि "परिणाम" पर, वे 40% अधिक सफल होते हैं। Mihaly Csikszentmihalyi के "Flow State" सिद्धांत के अनुसार: सर्वोच्च प्रदर्शन तभी आता है जब परिणाम से आसक्ति छूट जाती है। यह वही है जो गीता ने 2500 वर्ष पहले कहा था।',
  lifeLesson:
    "आज का एक कदम: जो काम हाथ में है, उसे 100% मन लगाकर करो — बिना इस चिंता के कि परिणाम क्या होगा। चिंता (Anxiety) परिणाम के डर से जन्म लेती है; शांति समर्पित कर्म से।",
  keywords: ["कर्म", "अनासक्ति", "Flow State", "निष्काम कर्म"],
  source: "भगवद्गीता  २.४७",
  chapter: 2,
};

type ListedCategory = (typeof categories)[number]["id"];

const categoryIcons: Record<ListedCategory, ReactNode> = {
  veda: <Flame className="w-6 h-6" />,
  upanishad: <BookOpen className="w-6 h-6" />,
  itihasa: <Scroll className="w-6 h-6" />,
  purana: <TreePine className="w-6 h-6" />,
  smriti: <Scale className="w-6 h-6" />,
  other: <Heart className="w-6 h-6" />,
};

export default function HomePage() {
  const scriptures = getAllScriptures();
  const featured = getAvailableScriptures();
  const realVerses = getRealVerseCount();
  const realChapters = getRealChapterCount();
  const realScriptures = getRealScriptureCount();
  const cataloged = scriptures.length;

  return (
    <main className="min-h-screen">
      <HeroSection />

      {/* ── Featured Verse Infographic ────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 mb-12 relative z-10">
        <FadeUpOnView>
        <InteractiveInfographic
          sections={[
            {
              id: 'verse',
              type: 'verse',
              title: 'The Verse',
              titleSanskrit: 'श्लोक',
              content: {
                sanskrit: featuredVerse.sanskrit,
                transliteration: featuredVerse.transliteration,
                english: featuredVerse.translation,
              },
              visual: { icon: '🕉️', color: 'saffron' },
              connections: ['Hindi Meaning', 'Science', 'Life Lesson'],
            },
            {
              id: 'hindi',
              type: 'concept',
              title: 'Hindi Meaning',
              titleSanskrit: 'हिंदी अर्थ',
              content: {
                hindi: featuredVerse.hindi,
                english: featuredVerse.hindiExplanation,
              },
              visual: { icon: '🪷', color: 'rose' },
              connections: ['The Verse', 'Life Lesson'],
            },
            {
              id: 'science',
              type: 'comparison',
              title: 'Scientific Connection',
              titleSanskrit: 'वैज्ञानिक दृष्टि',
              content: {
                english: featuredVerse.science,
              },
              visual: { icon: '⚛️', color: 'indigo' },
              connections: ['The Verse', 'Modern Psychology'],
            },
            {
              id: 'lesson',
              type: 'flow',
              title: 'Life Lesson',
              titleSanskrit: 'जीवन पाठ',
              content: {
                english: featuredVerse.lifeLesson,
                explanation: 'Apply this wisdom to your daily life for inner peace and clarity.',
              },
              visual: { icon: '💡', color: 'amber' },
              connections: ['Hindi Meaning', 'The Verse'],
            },
          ]}
          className="mb-8"
        />

        <div className="text-center">
          <Link
            href={`/scripture/bhagavadgita/chapter/${featuredVerse.chapter}`}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-saffron-600 to-amber-600 text-white px-8 py-4 rounded-full text-sm font-bold hover:from-saffron-700 hover:to-amber-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 transform"
          >
            सभी श्लोक पढ़ें
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        </FadeUpOnView>
      </section>

            {/* ── Stats ─────────────────────────────────────────────────── */}
      <StatsInfographic stats={[
        {
          value: realVerses,
          label: "Verses Explained",
          icon: <BookOpen className="w-5 h-5" />,
          color: "text-saffron-700 bg-gradient-to-br from-saffron-50 to-amber-50",
          border: "border-saffron-200",
          trend: "+12%"
        },
        {
          value: realChapters,
          label: "Chapters Live",
          icon: <Scroll className="w-5 h-5" />,
          color: "text-emerald-700 bg-gradient-to-br from-emerald-50 to-green-50",
          border: "border-emerald-200",
          trend: "+8%"
        },
        {
          value: realScriptures,
          label: "Scriptures Indexed",
          icon: <Flame className="w-5 h-5" />,
          color: "text-indigo-700 bg-gradient-to-br from-indigo-50 to-blue-50",
          border: "border-indigo-200",
          trend: "+5%"
        },
        {
          value: cataloged,
          label: "In the Library",
          icon: <TreePine className="w-5 h-5" />,
          color: "text-amber-700 bg-gradient-to-br from-amber-50 to-yellow-50",
          border: "border-amber-200",
          trend: "+15%"
        },
      ]} />

      {/* ── Panchang Calendar ────────────────────────────────────── */}
      <PanchangCalendar />

      {/* ── Nitya Karma Kriya ────────────────────────────────────── */}
      <NityaKarmaKriya />

            {/* ── Three Pillars ─────────────────────────────────────────── */}
      <ThreePillarsInfographic />

            {/* ── Science Meets Spirituality ─────────────────────── */}
      <ScienceSpiritualityInfographic />

      {/* ── Featured Texts ────────────────────────────────────────── */}
      {featured.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <FadeUpOnView className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-4xl font-serif font-bold text-dharma-text mb-2">
                Featured Texts
              </h2>
              <p className="text-dharma-muted text-lg">
                Currently available with verse-by-verse explanations
              </p>
            </div>
          </FadeUpOnView>
          <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featured.map((s) => (
              <StaggerItem key={s.id}>
                <ScriptureCard
                  href={`/scripture/${s.id}`}
                  className="scripture-card group bg-white/80 backdrop-blur-sm"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span className="inline-block px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-saffron-100 to-amber-100 text-saffron-800 uppercase tracking-wide border border-saffron-200">
                      {s.category}
                    </span>
                    <ChevronRight className="w-5 h-5 text-dharma-muted group-hover:text-saffron-600 transition group-hover:translate-x-1 transform" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-dharma-text mb-2 group-hover:text-saffron-700 transition">
                    {s.title}
                  </h3>
                  <p
                    lang="sa"
                    className="text-sm text-dharma-muted font-devanagari mb-4"
                  >
                    {s.titleSanskrit}
                  </p>
                  <p className="text-sm text-dharma-text line-clamp-3 leading-relaxed">
                    {s.description}
                  </p>
                  <div className="mt-5 flex items-center gap-4 text-xs text-dharma-muted font-semibold">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {s.totalChapters} Chapters
                    </span>
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3" />
                      {s.totalVerses.toLocaleString()} Verses
                    </span>
                  </div>
                </ScriptureCard>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {/* ── Categories ────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <FadeUpOnView className="mb-10">
          <h2 className="text-4xl font-serif font-bold text-dharma-text mb-2">
            Browse by Category
          </h2>
          <p className="text-dharma-muted text-lg">
            Explore the major streams of sacred literature
          </p>
        </FadeUpOnView>
        <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const count = scriptures.filter(
              (s) => s.category === cat.id,
            ).length;
            return (
              <StaggerItem key={cat.id}>
                <ScriptureCard
                  href={`/scriptures#${cat.id}`}
                  className="scripture-card group bg-white/80 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-saffron-100 to-amber-100 text-saffron-700 flex items-center justify-center group-hover:from-saffron-600 group-hover:to-amber-600 group-hover:text-white transition-all shadow-sm group-hover:shadow-md">
                      {categoryIcons[cat.id]}
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-bold text-dharma-text group-hover:text-saffron-700 transition">
                        {cat.label}
                      </h3>
                      <p className="text-xs text-dharma-muted font-semibold">{count} texts</p>
                    </div>
                  </div>
                  <p className="text-sm text-dharma-muted leading-relaxed">{cat.description}</p>
                </ScriptureCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* ── Footer CTA ────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-dharma-dark via-stone-900 to-dharma-dark text-white py-20">
        <FadeUpOnView className="max-w-4xl mx-auto px-6 text-center">
          {/* Upanishad quote */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-8 shadow-lg">
            <span className="font-devanagari text-3xl text-saffron-300">ॐ</span>
          </div>
          <p className="font-devanagari text-5xl text-saffron-300 font-bold mb-3 drop-shadow-lg">
            अहं ब्रह्मास्मि
          </p>
          <p className="text-white/60 text-sm italic mb-10 max-w-lg mx-auto">
            — बृहदारण्यक उपनिषद् १.४.१० • &ldquo;I am Brahman — the infinite
            consciousness.&rdquo;
          </p>

          <h2 className="text-4xl font-serif font-bold mb-5">
            A Journey Through Eternal Wisdom
          </h2>
          <p className="text-xl opacity-80 mb-10 max-w-2xl mx-auto leading-relaxed">
            From the Vedas to the Puranas, every verse holds timeless truth.
            This project makes every scripture accessible — with deep Hindi
            meanings and modern scientific connections.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm opacity-70 font-medium">
            <span className="px-3 py-1 bg-white/10 rounded-full">Vedas</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">Upanishads</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">Ramayana</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">Mahabharata</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">Puranas</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">Smritis</span>
            <span className="px-3 py-1 bg-white/10 rounded-full">More</span>
          </div>
        </FadeUpOnView>
      </section>
    </main>
  );
}

