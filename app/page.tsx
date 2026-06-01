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
import {
  BookOpen,
  Flame,
  Scroll,
  TreePine,
  Scale,
  Heart,
  ChevronRight,
  Languages,
  Sparkles,
  ShieldCheck,
  Atom,
  Lightbulb,
  ArrowRight,
  Star,
  Brain,
  Zap,
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
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-saffron-900 via-saffron-800 to-amber-900 text-white overflow-hidden">
        {/* Enhanced Mandala ring decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full border border-white/10 animate-spin-slow" />
          <div
            className="absolute -top-20 -left-20 w-72 h-72 rounded-full border border-white/10 animate-spin-slow"
            style={{ animationDirection: "reverse", animationDuration: "20s" }}
          />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full border border-white/10 animate-spin-slow" />
          <div
            className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full border border-white/10 animate-spin-slow"
            style={{ animationDirection: "reverse", animationDuration: "25s" }}
          />
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-10 mandala-bg" />
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-28 md:py-32 text-center">
          {/* OM symbol with enhanced glow */}
          <FadeUp className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white/15 border border-white/30 mb-8 animate-breathe shadow-2xl backdrop-blur-sm">
            <span className="font-devanagari text-5xl text-saffron-100 leading-none drop-shadow-lg">
              ॐ
            </span>
          </FadeUp>

          <FadeUp delay={0.08}>
            <h1 className="text-6xl md:text-8xl font-serif font-bold mb-4 tracking-tight drop-shadow-2xl">
              Dharma Granth
            </h1>
          </FadeUp>
          <FadeUp delay={0.14}>
            <p className="font-devanagari text-3xl md:text-4xl text-saffron-100 mb-4 drop-shadow-md">
              धर्म ग्रंथ
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-2xl md:text-3xl font-light opacity-95 max-w-3xl mx-auto mb-3 drop-shadow-sm">
              Famous verses, deeply explained.
            </p>
            <p className="font-devanagari text-xl md:text-2xl opacity-85 max-w-2xl mx-auto mb-4">
              प्रसिद्ध श्लोक — गहरा हिंदी अर्थ — वैज्ञानिक दृष्टिकोण
            </p>
            <p className="text-base opacity-70 max-w-xl mx-auto mb-12 font-medium">
              Sanskrit · Hindi · English · Science — verse by verse, free,
              ad-free.
            </p>
          </FadeUp>

          <FadeUp delay={0.3} className="flex flex-wrap justify-center gap-4">
            <Link
              href="/scripture/bhagavadgita"
              className="inline-flex items-center gap-2 bg-white text-saffron-800 px-8 py-4 rounded-full font-bold hover:bg-saffron-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 transform"
            >
              <Flame className="w-5 h-5" />
              भगवद्गीता पढ़ें
            </Link>
            <Link
              href="/scriptures"
              className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/40 text-white px-8 py-4 rounded-full font-semibold hover:bg-white/25 transition-all hover:scale-105 transform shadow-lg"
            >
              <BookOpen className="w-5 h-5" />
              Browse the Library
            </Link>
          </FadeUp>
        </div>

        <div className="h-24 bg-gradient-to-b from-saffron-700 to-dharma-bg" />
      </section>

      {/* ── Featured Verse Infographic ────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 -mt-8 mb-12 relative z-10">
        <FadeUpOnView>
        <div className="text-center mb-8">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-saffron-700 bg-gradient-to-r from-saffron-100 to-amber-100 border border-saffron-200 px-5 py-2 rounded-full shadow-sm">
            <Star className="w-3.5 h-3.5" />
            आज का श्लोक — Featured Verse
          </p>
        </div>

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
      <section className="max-w-6xl mx-auto px-6 py-10">
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-4" amount={0.2}>
          {[
            {
              value: realVerses,
              label: "Verses Explained",
              icon: <BookOpen className="w-5 h-5" />,
              color: "text-saffron-700 bg-gradient-to-br from-saffron-50 to-amber-50",
              border: "border-saffron-200",
            },
            {
              value: realChapters,
              label: "Chapters Live",
              icon: <Scroll className="w-5 h-5" />,
              color: "text-emerald-700 bg-gradient-to-br from-emerald-50 to-green-50",
              border: "border-emerald-200",
            },
            {
              value: realScriptures,
              label: "Scriptures Indexed",
              icon: <Flame className="w-5 h-5" />,
              color: "text-indigo-700 bg-gradient-to-br from-indigo-50 to-blue-50",
              border: "border-indigo-200",
            },
            {
              value: cataloged,
              label: "In the Library",
              icon: <TreePine className="w-5 h-5" />,
              color: "text-amber-700 bg-gradient-to-br from-amber-50 to-yellow-50",
              border: "border-amber-200",
            },
          ].map((stat) => (
            <StaggerItem
              key={stat.label}
              className="bg-white rounded-2xl border border-dharma-border p-6 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div
                className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-3 ${stat.color} border ${stat.border} shadow-sm`}
              >
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-dharma-text">
                {stat.value}
              </div>
              <div className="text-xs text-dharma-muted mt-1 uppercase tracking-wider font-semibold">
                {stat.label}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="text-center text-sm text-dharma-muted mt-4 max-w-2xl mx-auto">
          Numbers reflect verses with full hand-authored commentary. The library
          catalogs {cataloged} traditional texts and grows over time.
        </p>
      </section>

      {/* ── Three Pillars ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <FadeUpOnView className="text-center mb-12">
          <h2 className="text-4xl font-serif font-bold text-dharma-text mb-3">
            तीन स्तंभ
          </h2>
          <p className="text-dharma-muted text-lg">
            Three pillars of every verse on this site
          </p>
        </FadeUpOnView>
        <Stagger className="grid md:grid-cols-3 gap-6" amount={0.15}>
          {/* Pillar 1: Languages */}
          <StaggerItem className="pillar-card bg-white/80 backdrop-blur-sm">
            <div className="pillar-icon-wrap bg-gradient-to-br from-saffron-500 to-saffron-700 shadow-lg">
              <Languages className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-dharma-text mb-2">
              संस्कृत + हिंदी + English
            </h3>
            <p className="text-sm text-dharma-muted leading-relaxed mb-4">
              Every verse: original Sanskrit, transliteration, plain
              translation, and deep commentary in both Hindi and English.
            </p>
            <div className="rounded-xl bg-gradient-to-br from-saffron-50 to-amber-50 border border-saffron-200 p-4 text-center shadow-sm">
              <p className="font-devanagari text-xl text-saffron-800 font-semibold">
                कर्म = Action
              </p>
              <p className="text-xs text-saffron-600 mt-1">
                karma = karman (doing) → effort without ego
              </p>
            </div>
          </StaggerItem>

          {/* Pillar 2: Scientific Temperament */}
          <StaggerItem className="pillar-card bg-white/80 backdrop-blur-sm border-indigo-100 hover:border-indigo-300">
            <div className="pillar-icon-wrap bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg">
              <Atom className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-dharma-text mb-2">
              वैज्ञानिक दृष्टिकोण
            </h3>
            <p className="text-sm text-dharma-muted leading-relaxed mb-4">
              प्रत्येक श्लोक के साथ आधुनिक विज्ञान का संदर्भ — न्यूरोसाइंस,
              मनोविज्ञान और भौतिकी की रोशनी में प्राचीन ज्ञान।
            </p>
            <div className="flex flex-wrap gap-2">
              {["Neuroscience", "Psychology", "Physics", "Flow State"].map(
                (tag) => (
                  <span key={tag} className="keyword-chip-science shadow-sm hover:shadow-md transition-shadow">
                    {tag}
                  </span>
                ),
              )}
            </div>
          </StaggerItem>

          {/* Pillar 3: Free */}
          <StaggerItem className="pillar-card bg-white/80 backdrop-blur-sm border-emerald-100 hover:border-emerald-300">
            <div className="pillar-icon-wrap bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-dharma-text mb-2">
              Free. Ad-free. Always.
            </h3>
            <p className="text-sm text-dharma-muted leading-relaxed mb-4">
              No paywalls, no trackers, no ads. The text belongs to everyone.
              Built for learning, not for profit.
            </p>
            <div className="flex items-center gap-2 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 px-4 py-3 shadow-sm">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <p className="text-xs text-emerald-800 font-semibold">
                Designed for study, not skimming
              </p>
            </div>
          </StaggerItem>
        </Stagger>
      </section>

      {/* ── Science Meets Spirituality Banner ─────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <FadeUpOnView className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-8 md:p-10 shadow-2xl">
          <div className="absolute inset-0 mandala-bg opacity-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-300 mb-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                <Atom className="w-3.5 h-3.5" />
                विज्ञान और अध्यात्म
              </p>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4 leading-tight">
                Where Ancient Wisdom
                <br />
                Meets Modern Science
              </h2>
              <p className="text-indigo-100 text-base leading-relaxed">
                The Gita taught &ldquo;process over outcome&rdquo; 2500 years
                before Carol Dweck. The Upanishads described consciousness
                before neuroscience. Every verse here connects the timeless to
                the testable.
              </p>
            </div>
            <div className="space-y-4">
              {[
                {
                  verse: "गीता २.२०",
                  claim: "आत्मा अजन्मा है",
                  science: "Energy Conservation Law — Einstein",
                  icon: <Zap className="w-4 h-4" />,
                },
                {
                  verse: "गीता ६.५",
                  claim: "मन मित्र भी, शत्रु भी",
                  science: "Prefrontal Cortex & Amygdala Regulation",
                  icon: <Brain className="w-4 h-4" />,
                },
                {
                  verse: "गीता २.४७",
                  claim: "निष्काम कर्म करो",
                  science: "Flow State — Csikszentmihalyi",
                  icon: <Sparkles className="w-4 h-4" />,
                },
              ].map((row) => (
                <div
                  key={row.verse}
                  className="flex items-start gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all hover:scale-[1.02] transform"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-700 flex items-center justify-center text-indigo-200 shadow-lg">
                    {row.icon}
                  </div>
                  <div>
                    <p className="text-xs text-indigo-300 mb-1 font-semibold">
                      {row.verse}
                    </p>
                    <p className="font-devanagari text-sm text-white font-semibold mb-1">
                      {row.claim}
                    </p>
                    <p className="text-xs text-indigo-300">
                      ↔ {row.science}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FadeUpOnView>
      </section>

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
          <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" amount={0.1}>
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
            Explore the sixfold division of sacred literature
          </p>
        </FadeUpOnView>
        <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" amount={0.1}>
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
