import type { ReactNode } from 'react';
import Link from 'next/link';
import { categories } from '@/data/scripture-meta';
import {
  getAllScriptures,
  getAvailableScriptures,
  getRealChapterCount,
  getRealScriptureCount,
  getRealVerseCount,
} from '@/data/scriptures';
import { HeroSection } from '@/app/components/HeroSection';
import { PanchangCalendar } from '@/app/components/PanchangCalendar';
import { NityaKarmaKriya } from '@/app/components/NityaKarmaKriya';
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  ExternalLink,
  Flame,
  Heart,
  Scale,
  Scroll,
  ShieldCheck,
  TreePine,
} from 'lucide-react';

const featuredVerse = {
  sanskrit:
    'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥',
  transliteration:
    "karmaṇyevādhikāraste mā phaleṣu kadācana |\nmā karmaphalaheturbhūrmā te saṅgo'stvakarmaṇi ||",
  translation:
    'You have a right only to perform your duty; the fruits thereof are not your concern. Let not the fruit of action be your motive, nor let attachment to inaction take hold of you.',
  hindi:
    'तुम्हारा अधिकार केवल कर्म करने में है, फल में कभी नहीं। न तो कर्म के फल का कारण बनो, और न ही कर्म न करने में आसक्त हो।',
  hindiExplanation:
    'श्रीकृष्ण यहाँ कर्म पर पूरा ध्यान देने और परिणाम की आसक्ति छोड़ने की शिक्षा देते हैं। यह निष्क्रियता नहीं, बल्कि उद्देश्यपूर्ण कर्म करते हुए फल को नियंत्रित करने के भ्रम से मुक्त होना है।',
  researchNote:
    'आधुनिक मनोविज्ञान में “nonattachment” को अनुभवों से चिपके बिना उनके साथ संतुलित ढंग से जुड़ने के रूप में अध्ययन किया जाता है। शोध में इसका बेहतर well-being और कम psychological distress से संबंध मिला है, लेकिन उपलब्ध प्रमाण मुख्यतः सहसंबंधात्मक हैं—यह गीता की शिक्षा का वैज्ञानिक सत्यापन या कारण-परिणाम का प्रमाण नहीं है।',
  source: 'भगवद्गीता २.४७',
  chapter: 2,
};

type ListedCategory = (typeof categories)[number]['id'];

const categoryIcons: Record<ListedCategory, ReactNode> = {
  veda: <Flame className="h-5 w-5" aria-hidden="true" />,
  upanishad: <BookOpen className="h-5 w-5" aria-hidden="true" />,
  itihasa: <Scroll className="h-5 w-5" aria-hidden="true" />,
  purana: <TreePine className="h-5 w-5" aria-hidden="true" />,
  smriti: <Scale className="h-5 w-5" aria-hidden="true" />,
  other: <Heart className="h-5 w-5" aria-hidden="true" />,
};

function formatCount(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value);
}

export default function HomePage() {
  const scriptures = getAllScriptures();
  const availableScriptures = getAvailableScriptures();
  const featuredTexts = availableScriptures.slice(0, 6);
  const realVerses = getRealVerseCount();
  const realChapters = getRealChapterCount();
  const realScriptures = getRealScriptureCount();

  return (
    <main className="min-h-screen">
      <HeroSection />

      <section
        aria-labelledby="featured-texts-heading"
        className="border-b border-dharma-border bg-dharma-bg py-14 sm:py-16"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-saffron-700">
                Start reading
              </p>
              <h2
                id="featured-texts-heading"
                className="text-3xl font-bold text-dharma-text sm:text-4xl"
              >
                Featured Texts
              </h2>
              <p className="mt-2 max-w-2xl text-dharma-muted">
                Begin with texts that already include verse-by-verse translations and commentary.
              </p>
            </div>
            <Link
              href="/scriptures?explained=1"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-dharma-border bg-dharma-card px-5 py-2.5 text-sm font-bold text-dharma-text transition hover:border-saffron-300 hover:text-saffron-700"
            >
              View the full library
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <dl className="mb-8 flex flex-wrap gap-x-7 gap-y-2 border-y border-dharma-border py-4 text-sm">
            <div className="flex items-baseline gap-2">
              <dt className="text-dharma-muted">Explained texts</dt>
              <dd className="font-bold text-dharma-text">{formatCount(realScriptures)}</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-dharma-muted">Chapters</dt>
              <dd className="font-bold text-dharma-text">{formatCount(realChapters)}</dd>
            </div>
            <div className="flex items-baseline gap-2">
              <dt className="text-dharma-muted">Verses</dt>
              <dd className="font-bold text-dharma-text">{formatCount(realVerses)}</dd>
            </div>
          </dl>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredTexts.map((scripture) => (
              <Link
                key={scripture.id}
                href={`/scripture/${scripture.id}`}
                className="group flex h-full flex-col rounded-2xl border border-dharma-border bg-dharma-card p-5 shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-saffron-300 hover:shadow-lg"
              >
                <div className="mb-4 flex items-start justify-between gap-4">
                  <span className="rounded-full bg-saffron-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-saffron-700">
                    {scripture.category}
                  </span>
                  <ChevronRight
                    className="h-5 w-5 text-dharma-muted transition-transform group-hover:translate-x-0.5 group-hover:text-saffron-600"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-xl font-bold text-dharma-text transition group-hover:text-saffron-700">
                  {scripture.title}
                </h3>
                <p lang="sa" className="mt-1 font-devanagari text-sm text-dharma-muted">
                  {scripture.titleSanskrit}
                </p>
                <p className="mt-3 line-clamp-2 text-sm text-dharma-muted">
                  {scripture.description}
                </p>
                <p className="mt-auto pt-5 text-xs font-semibold text-dharma-muted">
                  {formatCount(scripture.totalChapters)} chapters ·{' '}
                  {formatCount(scripture.totalVerses)} verses
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="categories-heading"
        className="border-b border-dharma-border bg-dharma-card/45 py-14 sm:py-16"
      >
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-saffron-700">
              Explore the tradition
            </p>
            <h2 id="categories-heading" className="text-3xl font-bold text-dharma-text sm:text-4xl">
              Browse by Category
            </h2>
            <p className="mt-2 text-dharma-muted">Find the branch of sacred literature you want to study.</p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const count = scriptures.filter((scripture) => scripture.category === category.id).length;
              return (
                <Link
                  key={category.id}
                  href={`/scriptures#${category.id}`}
                  className="group flex items-start gap-4 rounded-2xl border border-dharma-border bg-dharma-card p-4 transition hover:border-saffron-300 hover:shadow-md"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-saffron-500/10 text-saffron-700 transition group-hover:bg-saffron-600 group-hover:text-white">
                    {categoryIcons[category.id]}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="font-serif text-lg font-bold text-dharma-text group-hover:text-saffron-700">
                        {category.label}
                      </span>
                      <span className="shrink-0 text-xs font-semibold text-dharma-muted">{count} texts</span>
                    </span>
                    <span className="mt-1 block line-clamp-2 text-sm leading-relaxed text-dharma-muted">
                      {category.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section aria-labelledby="daily-wisdom-heading" className="bg-dharma-bg py-14 sm:py-20">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <div className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-saffron-700">
              Daily wisdom
            </p>
            <h2 id="daily-wisdom-heading" className="text-3xl font-bold text-dharma-text sm:text-4xl">
              One verse, read with care
            </h2>
          </div>

          <article className="overflow-hidden rounded-3xl border border-dharma-border bg-dharma-card shadow-lg">
            <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
              <div className="bg-gradient-to-br from-saffron-800 to-amber-700 p-6 text-white sm:p-8 lg:p-10">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-saffron-100/80">
                  {featuredVerse.source}
                </p>
                <p className="mt-6 whitespace-pre-line font-devanagari text-2xl leading-loose text-white sm:text-3xl">
                  {featuredVerse.sanskrit}
                </p>
                <p className="mt-5 whitespace-pre-line text-sm italic leading-relaxed text-saffron-100/80">
                  {featuredVerse.transliteration}
                </p>
              </div>

              <div className="space-y-6 p-6 sm:p-8 lg:p-10">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-dharma-muted">
                    Plain-English meaning
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-dharma-text">
                    {featuredVerse.translation}
                  </p>
                </div>
                <div className="border-t border-dharma-border pt-5">
                  <h3 className="font-devanagari text-sm font-bold text-rose-700">हिंदी भावार्थ</h3>
                  <p className="mt-2 font-devanagari leading-loose text-dharma-text">
                    {featuredVerse.hindi}
                  </p>
                  <p className="mt-2 font-devanagari text-sm leading-loose text-dharma-muted">
                    {featuredVerse.hindiExplanation}
                  </p>
                </div>

                <details className="group rounded-2xl border border-dharma-border bg-dharma-bg p-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-dharma-text marker:content-none">
                    <span className="inline-flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-emerald-600" aria-hidden="true" />
                      Research note and source
                    </span>
                    <ChevronRight
                      className="h-4 w-4 text-dharma-muted transition-transform group-open:rotate-90"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="pt-4 text-sm leading-relaxed text-dharma-muted">
                    <p className="font-devanagari">{featuredVerse.researchNote}</p>
                    <a
                      href="https://pubmed.ncbi.nlm.nih.gov/35690041/"
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 font-semibold text-saffron-700 underline decoration-saffron-300 underline-offset-4"
                    >
                      Read the 2022 meta-analysis on PubMed
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </div>
                </details>

                <Link
                  href={`/scripture/bhagavadgita/chapter/${featuredVerse.chapter}`}
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-saffron-600 to-amber-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:from-saffron-700 hover:to-amber-700 hover:shadow-lg"
                >
                  अध्याय २ पढ़ें
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section aria-labelledby="daily-practice-heading" className="border-t border-dharma-border bg-dharma-card/35 py-14">
        <div className="mx-auto max-w-6xl px-5 sm:px-6">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-saffron-700">Practice</p>
          <h2 id="daily-practice-heading" className="text-3xl font-bold text-dharma-text sm:text-4xl">
            Bring the teaching into your day
          </h2>
          <p className="mt-2 max-w-2xl text-dharma-muted">
            Use the calendar and daily-practice guide when you are ready to move from reading to routine.
          </p>
        </div>
        <PanchangCalendar />
        <NityaKarmaKriya />
      </section>

      <footer className="border-t border-white/10 bg-stone-950 py-12 text-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 sm:flex-row sm:items-end sm:justify-between sm:px-6">
          <div className="max-w-2xl">
            <p className="font-devanagari text-2xl font-bold text-saffron-300">अहं ब्रह्मास्मि</p>
            <p className="mt-2 text-sm text-white/55">बृहदारण्यक उपनिषद् १.४.१०</p>
            <p className="mt-5 text-lg text-white/80">
              Read sacred texts with translation, context, and carefully framed modern parallels.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/scripture/bhagavadgita"
              className="inline-flex items-center gap-2 rounded-full bg-saffron-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-saffron-500"
            >
              <Flame className="h-4 w-4" aria-hidden="true" />
              Read the Gita
            </Link>
            <Link
              href="/scriptures"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <BookOpen className="h-4 w-4" aria-hidden="true" />
              Browse all texts
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
