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
      <section className="relative bg-gradient-to-b from-saffron-900 via-saffron-800 to-saffron-700 text-white overflow-hidden">
        {/* Mandala ring decorations */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full border border-white/5 animate-spin-slow" />
          <div
            className="absolute -top-20 -left-20 w-72 h-72 rounded-full border border-white/5 animate-spin-slow"
            style={{ animationDirection: "reverse", animationDuration: "20s" }}
          />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full border border-white/5 animate-spin-slow" />
          <div
            className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full border border-white/5 animate-spin-slow"
            style={{ animationDirection: "reverse", animationDuration: "25s" }}
          />
          {/* Dot pattern */}
          <div className="absolute inset-0 opacity-5 mandala-bg" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-24 text-center">
          {/* OM symbol */}
          <FadeUp className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/10 border border-white/20 mb-8 animate-breathe shadow-lg">
            <span className="font-devanagari text-4xl text-saffron-200 leading-none">
              ॐ
            </span>
          </FadeUp>

          <FadeUp delay={0.08}>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-3 tracking-tight">
              Dharma Granth
            </h1>
          </FadeUp>
          <FadeUp delay={0.14}>
            <p className="font-devanagari text-2xl md:text-3xl text-saffron-200 mb-3">
              धर्म ग्रंथ
            </p>
          </FadeUp>
          <FadeUp delay={0.2}>
            <p className="text-xl md:text-2xl font-light opacity-90 max-w-3xl mx-auto mb-2">
              Famous verses, deeply explained.
            </p>
            <p className="font-devanagari text-lg opacity-75 max-w-2xl mx-auto mb-3">
              प्रसिद्ध श्लोक — गहरा हिंदी अर्थ — वैज्ञानिक दृष्टिकोण
            </p>
            <p className="text-sm opacity-60 max-w-xl mx-auto mb-10">
              Sanskrit · Hindi · English · Science — verse by verse, free,
              ad-free.
            </p>
          </FadeUp>

          <FadeUp delay={0.3} className="flex flex-wrap justify-center gap-4">
            <Link
              href="/scripture/bhagavadgita"
              className="inline-flex items-center gap-2 bg-white text-saffron-800 px-7 py-3.5 rounded-full font-bold hover:bg-saffron-50 transition shadow-lg"
            >
              <Flame className="w-5 h-5" />
              भगवद्गीता पढ़ें
            </Link>
            <Link
              href="/scriptures"
              className="inline-flex items-center gap-2 bg-white/10 border border-white/30 text-white px-7 py-3.5 rounded-full font-semibold hover:bg-white/20 transition"
            >
              <BookOpen className="w-5 h-5" />
              Browse the Library
            </Link>
          </FadeUp>
        </div>

        <div className="h-16 bg-gradient-to-b from-saffron-700 to-dharma-bg" />
      </section>

      {/* ── Featured Verse Infographic ────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 -mt-4 mb-8 relative z-10">
        <FadeUpOnView>
        <div className="text-center mb-6">
          <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-saffron-700 bg-saffron-100 border border-saffron-200 px-4 py-1.5 rounded-full">
            <Star className="w-3.5 h-3.5" />
            आज का श्लोक — Featured Verse
          </p>
        </div>

        <div className="infographic-featured">
          <div className="grid lg:grid-cols-[2fr_3fr]">
            {/* Sanskrit Panel */}
            <div className="infographic-sanskrit-panel relative">
              {/* Decorative rings */}
              <div className="absolute top-4 right-4 w-32 h-32 rounded-full border border-white/10 pointer-events-none" />
              <div className="absolute top-8 right-8 w-20 h-20 rounded-full border border-white/10 pointer-events-none" />

              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-saffron-300 mb-4">
                  {featuredVerse.source}
                </p>
                <p
                  lang="sa"
                  className="font-devanagari text-3xl leading-relaxed text-white mb-6 whitespace-pre-line"
                >
                  {featuredVerse.sanskrit}
                </p>
                <p className="text-sm italic text-saffron-200 leading-relaxed opacity-80 whitespace-pre-line">
                  {featuredVerse.transliteration}
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-white/20">
                <p className="text-xs text-saffron-300 mb-2 font-semibold uppercase tracking-wider">
                  English
                </p>
                <p className="text-sm text-white/80 leading-relaxed italic">
                  {featuredVerse.translation}
                </p>
              </div>
            </div>

            {/* Content Panel */}
            <div className="infographic-content-panel">
              {/* Hindi Meaning */}
              <div className="infographic-mini-card-hindi">
                <div className="infographic-label-hindi">
                  <span className="text-base">🪷</span>
                  हिंदी अर्थ
                </div>
                <p
                  lang="hi"
                  className="font-devanagari text-lg leading-relaxed text-rose-900 font-semibold mb-2"
                >
                  {featuredVerse.hindi}
                </p>
                <p
                  lang="hi"
                  className="font-devanagari text-sm leading-relaxed text-rose-700"
                >
                  {featuredVerse.hindiExplanation}
                </p>
              </div>

              {/* Scientific Connection */}
              <div className="infographic-mini-card-science">
                <div className="infographic-label-science">
                  <Atom className="w-3.5 h-3.5" />
                  वैज्ञानिक दृष्टि — Modern Science
                </div>
                <p
                  lang="hi"
                  className="font-devanagari text-sm leading-relaxed text-indigo-800"
                >
                  {featuredVerse.science}
                </p>
              </div>

              {/* Life Lesson */}
              <div className="infographic-mini-card-lesson">
                <div className="infographic-label-lesson">
                  <Lightbulb className="w-3.5 h-3.5" />
                  जीवन पाठ — Life Lesson
                </div>
                <p
                  lang="hi"
                  className="font-devanagari text-sm leading-relaxed text-amber-800"
                >
                  {featuredVerse.lifeLesson}
                </p>
              </div>

              {/* Keywords + CTA */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div className="flex flex-wrap gap-2">
                  {featuredVerse.keywords.map((k) => (
                    <span key={k} className="keyword-chip font-devanagari">
                      {k}
                    </span>
                  ))}
                </div>
                <Link
                  href={`/scripture/bhagavadgita/chapter/${featuredVerse.chapter}`}
                  className="inline-flex items-center gap-2 bg-saffron-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-saffron-700 transition shadow-sm"
                >
                  सभी श्लोक पढ़ें
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        </FadeUpOnView>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <Stagger className="grid grid-cols-2 md:grid-cols-4 gap-4" amount={0.2}>
          {[
            {
              value: realVerses,
              label: "Verses Explained",
              icon: <BookOpen className="w-5 h-5" />,
              color: "text-saffron-700 bg-saffron-50",
            },
            {
              value: realChapters,
              label: "Chapters Live",
              icon: <Scroll className="w-5 h-5" />,
              color: "text-emerald-700 bg-emerald-50",
            },
            {
              value: realScriptures,
              label: "Scriptures Indexed",
              icon: <Flame className="w-5 h-5" />,
              color: "text-indigo-700 bg-indigo-50",
            },
            {
              value: cataloged,
              label: "In the Library",
              icon: <TreePine className="w-5 h-5" />,
              color: "text-amber-700 bg-amber-50",
            },
          ].map((stat) => (
            <StaggerItem
              key={stat.label}
              className="bg-white rounded-2xl border border-dharma-border p-5 text-center shadow-sm hover:shadow-md transition"
            >
              <div
                className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${stat.color}`}
              >
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-dharma-text">
                {stat.value}
              </div>
              <div className="text-xs text-dharma-muted mt-1 uppercase tracking-wider font-semibold">
                {stat.label}
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="text-center text-xs text-dharma-muted mt-3">
          Numbers reflect verses with full hand-authored commentary. The library
          catalogs {cataloged} traditional texts and grows over time.
        </p>
      </section>

      {/* ── Three Pillars ─────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <FadeUpOnView className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-dharma-text mb-2">
            तीन स्तंभ
          </h2>
          <p className="text-dharma-muted">
            Three pillars of every verse on this site
          </p>
        </FadeUpOnView>
        <Stagger className="grid md:grid-cols-3 gap-6" amount={0.15}>
          {/* Pillar 1: Languages */}
          <StaggerItem className="pillar-card">
            <div className="pillar-icon-wrap bg-gradient-to-br from-saffron-500 to-saffron-700">
              <Languages className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-dharma-text mb-2">
              संस्कृत + हिंदी + English
            </h3>
            <p className="text-sm text-dharma-muted leading-relaxed mb-4">
              Every verse: original Sanskrit, transliteration, plain
              translation, and deep commentary in both Hindi and English.
            </p>
            <div className="rounded-lg bg-saffron-50 border border-saffron-100 p-3 text-center">
              <p className="font-devanagari text-lg text-saffron-800 font-semibold">
                कर्म = Action
              </p>
              <p className="text-xs text-saffron-600 mt-0.5">
                karma = karman (doing) → effort without ego
              </p>
            </div>
          </StaggerItem>

          {/* Pillar 2: Scientific Temperament */}
          <StaggerItem className="pillar-card border-indigo-100 hover:border-indigo-200">
            <div className="pillar-icon-wrap bg-gradient-to-br from-indigo-500 to-blue-600">
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
                  <span key={tag} className="keyword-chip-science">
                    {tag}
                  </span>
                ),
              )}
            </div>
          </StaggerItem>

          {/* Pillar 3: Free */}
          <StaggerItem className="pillar-card border-emerald-100 hover:border-emerald-200">
            <div className="pillar-icon-wrap bg-gradient-to-br from-emerald-500 to-green-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-xl text-dharma-text mb-2">
              Free. Ad-free. Always.
            </h3>
            <p className="text-sm text-dharma-muted leading-relaxed mb-4">
              No paywalls, no trackers, no ads. The text belongs to everyone.
              Built for learning, not for profit.
            </p>
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-100 px-3 py-2">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <p className="text-xs text-emerald-800 font-semibold">
                Designed for study, not skimming
              </p>
            </div>
          </StaggerItem>
        </Stagger>
      </section>

      {/* ── Science Meets Spirituality Banner ─────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 py-6">
        <FadeUpOnView className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-blue-900 text-white p-8 shadow-xl">
          <div className="absolute inset-0 mandala-bg opacity-10 pointer-events-none" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-300 mb-3">
                <Atom className="w-3.5 h-3.5" />
                विज्ञान और अध्यात्म
              </p>
              <h2 className="text-3xl font-serif font-bold mb-3">
                Where Ancient Wisdom
                <br />
                Meets Modern Science
              </h2>
              <p className="text-indigo-200 text-sm leading-relaxed">
                The Gita taught &ldquo;process over outcome&rdquo; 2500 years
                before Carol Dweck. The Upanishads described consciousness
                before neuroscience. Every verse here connects the timeless to
                the testable.
              </p>
            </div>
            <div className="space-y-3">
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
                  className="flex items-start gap-3 bg-white/10 rounded-xl p-3 border border-white/10 hover:bg-white/15 transition"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-700 flex items-center justify-center text-indigo-200">
                    {row.icon}
                  </div>
                  <div>
                    <p className="text-xs text-indigo-300 mb-0.5">
                      {row.verse}
                    </p>
                    <p className="font-devanagari text-sm text-white font-semibold">
                      {row.claim}
                    </p>
                    <p className="text-xs text-indigo-300 mt-0.5">
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
        <section className="max-w-6xl mx-auto px-6 py-16">
          <FadeUpOnView className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-3xl font-serif font-bold text-dharma-text mb-1">
                Featured Texts
              </h2>
              <p className="text-dharma-muted">
                Currently available with verse-by-verse explanations
              </p>
            </div>
          </FadeUpOnView>
          <Stagger className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" amount={0.1}>
            {featured.map((s) => (
              <StaggerItem key={s.id}>
                <ScriptureCard
                  href={`/scripture/${s.id}`}
                  className="scripture-card group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-saffron-100 text-saffron-800 uppercase tracking-wide">
                      {s.category}
                    </span>
                    <ChevronRight className="w-5 h-5 text-dharma-muted group-hover:text-saffron-600 transition" />
                  </div>
                  <h3 className="text-xl font-serif font-bold text-dharma-text mb-1 group-hover:text-saffron-700 transition">
                    {s.title}
                  </h3>
                  <p
                    lang="sa"
                    className="text-sm text-dharma-muted font-devanagari mb-3"
                  >
                    {s.titleSanskrit}
                  </p>
                  <p className="text-sm text-dharma-text line-clamp-3">
                    {s.description}
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-dharma-muted">
                    <span>{s.totalChapters} Chapters</span>
                    <span>{s.totalVerses.toLocaleString()} Verses</span>
                  </div>
                </ScriptureCard>
              </StaggerItem>
            ))}
          </Stagger>
        </section>
      )}

      {/* ── Categories ────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <FadeUpOnView className="mb-8">
          <h2 className="text-3xl font-serif font-bold text-dharma-text mb-1">
            Browse by Category
          </h2>
          <p className="text-dharma-muted">
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
                  className="scripture-card group"
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-xl bg-saffron-100 text-saffron-700 flex items-center justify-center group-hover:bg-saffron-600 group-hover:text-white transition">
                      {categoryIcons[cat.id]}
                    </div>
                    <div>
                      <h3 className="text-lg font-serif font-bold text-dharma-text group-hover:text-saffron-700 transition">
                        {cat.label}
                      </h3>
                      <p className="text-xs text-dharma-muted">{count} texts</p>
                    </div>
                  </div>
                  <p className="text-sm text-dharma-muted">{cat.description}</p>
                </ScriptureCard>
              </StaggerItem>
            );
          })}
        </Stagger>
      </section>

      {/* ── Footer CTA ────────────────────────────────────────────── */}
      <section className="bg-dharma-dark text-white py-16">
        <FadeUpOnView className="max-w-4xl mx-auto px-6 text-center">
          {/* Upanishad quote */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white/10 border border-white/20 mb-6">
            <span className="font-devanagari text-2xl text-saffron-300">ॐ</span>
          </div>
          <p className="font-devanagari text-4xl text-saffron-300 font-bold mb-2">
            अहं ब्रह्मास्मि
          </p>
          <p className="text-white/50 text-sm italic mb-8">
            — बृहदारण्यक उपनिषद् १.४.१० • &ldquo;I am Brahman — the infinite
            consciousness.&rdquo;
          </p>

          <h2 className="text-3xl font-serif font-bold mb-4">
            A Journey Through Eternal Wisdom
          </h2>
          <p className="text-lg opacity-75 mb-8 max-w-2xl mx-auto">
            From the Vedas to the Puranas, every verse holds timeless truth.
            This project makes every scripture accessible — with deep Hindi
            meanings and modern scientific connections.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm opacity-50">
            <span>Vedas</span>·<span>Upanishads</span>·<span>Ramayana</span>·
            <span>Mahabharata</span>·<span>Puranas</span>·<span>Smritis</span>·
            <span>More</span>
          </div>
        </FadeUpOnView>
      </section>
    </main>
  );
}
