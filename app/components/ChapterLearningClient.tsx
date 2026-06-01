"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Verse } from "@/data/types";
import {
  Atom,
  BookOpen,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Languages,
  Lightbulb,
  ListChecks,
  PenLine,
  RotateCcw,
  Share2,
  Sparkles,
  Tag,
} from "lucide-react";

type LearningVerse = Verse & {
  explanationHi?: string;
};

type Language = "en" | "hi";
type RevealKey =
  | "transliteration"
  | "translation"
  | "meaning"
  | "explanation"
  | "science"
  | "lifeLesson"
  | "practice";

interface ChapterLearningClientProps {
  scriptureTitle: string;
  chapterTitle: string;
  verses: LearningVerse[];
}

const copy = {
  en: {
    study: "Study",
    verses: "Verses",
    progress: "Progress",
    complete: "Complete",
    sanskrit: "Sanskrit",
    transliteration: "Transliteration",
    translation: "Translation",
    meaning: "Simple Meaning",
    hindiMeaning: "Hindi Meaning",
    explanation: "Explanation",
    science: "Scientific Insight",
    scienceSubtitle: "Bridging ancient wisdom with modern science",
    lifeLesson: "Life Lesson",
    lifeLessonSubtitle: "Apply this in your daily life",
    keywords: "Key Themes",
    practice: "Practice",
    reflection: "Reflection",
    reflectionPlaceholder: "Write one idea you can carry into daily life.",
    prompt: "What is the core lesson here?",
    previous: "Previous",
    next: "Next",
    mark: "Mark Learned",
    learned: "Learned",
    reset: "Reset",
  },
  hi: {
    study: "अध्ययन",
    verses: "श्लोक",
    progress: "प्रगति",
    complete: "पूर्ण",
    sanskrit: "संस्कृत",
    transliteration: "उच्चारण",
    translation: "अनुवाद",
    meaning: "सरल अर्थ",
    hindiMeaning: "हिन्दी अर्थ",
    explanation: "हिन्दी व्याख्या",
    science: "वैज्ञानिक दृष्टिकोण",
    scienceSubtitle: "प्राचीन ज्ञान और आधुनिक विज्ञान का संगम",
    lifeLesson: "जीवन की सीख",
    lifeLessonSubtitle: "इसे अपने दैनिक जीवन में लागू करें",
    keywords: "मुख्य विषय",
    practice: "अभ्यास",
    reflection: "मनन",
    reflectionPlaceholder: "दैनिक जीवन के लिए एक सीख लिखें।",
    prompt: "इस श्लोक का मुख्य संदेश क्या है?",
    previous: "पिछला",
    next: "अगला",
    mark: "सीख लिया",
    learned: "सीखा",
    reset: "रीसेट",
  },
};

const initialReveal: Record<RevealKey, boolean> = {
  transliteration: true,
  translation: true,
  meaning: true,
  explanation: false,
  science: false,
  lifeLesson: false,
  practice: false,
};

export function ChapterLearningClient({
  scriptureTitle,
  chapterTitle,
  verses,
}: ChapterLearningClientProps) {
  const [language, setLanguage] = useState<Language>("hi");
  const [activeIndex, setActiveIndex] = useState(0);
  const reduce = useReducedMotion();
  const [reveal, setReveal] = useState(initialReveal);
  const [learnedVerseIds, setLearnedVerseIds] = useState<number[]>([]);
  const [reflection, setReflection] = useState("");
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [shareStatus, setShareStatus] = useState<
    "idle" | "copy" | "shared" | "error"
  >("idle");
  const [cardTheme, setCardTheme] = useState<
    "saffron" | "blue" | "green" | "purple"
  >("saffron");
  const flashcardRef = useRef<HTMLDivElement>(null);

  const labels = copy[language];
  const activeVerse = verses[activeIndex];
  const learnedSet = useMemo(() => new Set(learnedVerseIds), [learnedVerseIds]);
  const progress =
    verses.length === 0
      ? 0
      : Math.round((learnedSet.size / verses.length) * 100);
  const meaning = activeVerse.meaning;
  const explanation =
    language === "hi" && activeVerse.explanationHi
      ? activeVerse.explanationHi
      : activeVerse.explanation;
  const hindiMeaning =
    activeVerse.explanationHi ?? activeVerse.meaning;

  const cardThemes = {
    saffron: {
      bg: "bg-saffron-50",
      border: "border-saffron-200",
      accent: "bg-saffron-100",
      text: "text-saffron-700",
      button: "bg-saffron-600 hover:bg-saffron-700",
      buttonBorder: "border-saffron-400",
    },
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      accent: "bg-blue-100",
      text: "text-blue-700",
      button: "bg-blue-600 hover:bg-blue-700",
      buttonBorder: "border-blue-400",
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      accent: "bg-green-100",
      text: "text-green-700",
      button: "bg-green-600 hover:bg-green-700",
      buttonBorder: "border-green-400",
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      accent: "bg-purple-100",
      text: "text-purple-700",
      button: "bg-purple-600 hover:bg-purple-700",
      buttonBorder: "border-purple-400",
    },
  };

  const currentTheme = cardThemes[cardTheme];

  const storageKey = useMemo(() => {
    const normalized = (value: string) =>
      value.trim().toLowerCase().replace(/\s+/g, "-");
    return `dharma.chapterLearning.${normalized(scriptureTitle)}.${normalized(chapterTitle)}`;
  }, [scriptureTitle, chapterTitle]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as { cardTheme?: string };
        if (
          typeof parsed.cardTheme === "string" &&
          ["saffron", "blue", "green", "purple"].includes(parsed.cardTheme)
        ) {
          setCardTheme(
            parsed.cardTheme as "saffron" | "blue" | "green" | "purple",
          );
        }
      }
    } catch {
      // ignore localStorage failures
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ cardTheme }));
    } catch {
      // ignore localStorage write failures
    }
  }, [storageKey, cardTheme]);

  function selectVerse(index: number) {
    setActiveIndex(index);
    setReveal(initialReveal);
    setReflection("");
  }

  function toggleReveal(key: RevealKey) {
    setReveal((current) => ({ ...current, [key]: !current[key] }));
  }

  function toggleLearned() {
    setLearnedVerseIds((current) => {
      if (current.includes(activeVerse.id)) {
        return current.filter((id) => id !== activeVerse.id);
      }
      return [...current, activeVerse.id];
    });
  }

  function goBy(offset: number) {
    const nextIndex = Math.min(
      Math.max(activeIndex + offset, 0),
      verses.length - 1,
    );
    selectVerse(nextIndex);
  }

  async function shareFlashCard() {
    if (!flashcardRef.current) return;
    try {
      const { toPng } = await import("html-to-image");
      const dataUrl = await toPng(flashcardRef.current, {
        cacheBust: true,
        quality: 0.95,
        pixelRatio: 2,
      });
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      const file = new File([blob], `verse-${activeVerse.id}.png`, {
        type: blob.type,
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${scriptureTitle} — ${chapterTitle} (Flash Card)`,
          files: [file],
        });
        setShareStatus("shared");
      } else {
        const link = document.createElement("a");
        link.download = `verse-${activeVerse.id}.png`;
        link.href = dataUrl;
        link.click();
        setShareStatus("copy");
      }
    } catch {
      setShareStatus("error");
    }
  }

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-dharma-border bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-saffron-700">
              {labels.study}
            </p>
            <h2 className="mt-1 text-2xl font-serif font-bold text-dharma-text">
              {chapterTitle}
            </h2>
            <p className="text-sm text-dharma-muted">{scriptureTitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-1 rounded-lg border border-dharma-border bg-dharma-bg p-1">
              <Languages className="ml-2 h-4 w-4 text-dharma-muted" />
              {(["hi", "en"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setLanguage(option)}
                  className={`rounded-md px-3 py-1.5 text-sm font-semibold transition ${
                    language === option
                      ? "bg-white text-saffron-800 shadow-sm"
                      : "text-dharma-muted hover:text-dharma-text"
                  }`}
                >
                  {option === "hi" ? "हिन्दी" : "English"}
                </button>
              ))}
            </div>
            <div className="min-w-32">
              <div className="mb-1 flex items-center justify-between text-xs text-dharma-muted">
                <span>{labels.progress}</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-saffron-100">
                <div
                  className="h-2 rounded-full bg-saffron-600 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsCardFlipped((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full border border-dharma-border bg-white px-4 py-2 text-sm font-semibold text-dharma-text transition hover:border-saffron-400 hover:text-saffron-700"
            >
              <BookOpen className="h-4 w-4" />
              {isCardFlipped
                ? language === "hi"
                  ? "पीछे करें"
                  : "Show Front"
                : language === "hi"
                  ? "फ्लैश कार्ड"
                  : "Flash Card"}
            </button>
            <button
              type="button"
              onClick={shareFlashCard}
              className="inline-flex items-center gap-2 rounded-full bg-saffron-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-saffron-700"
            >
              <Share2 className="h-4 w-4" />
              {language === "hi" ? "साझा करें" : "Share"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[230px_1fr]">
        <aside className="rounded-lg border border-dharma-border bg-white p-4 shadow-sm lg:sticky lg:top-4 lg:self-start">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-dharma-muted">
              {labels.verses}
            </p>
            <button
              type="button"
              onClick={() => setLearnedVerseIds([])}
              className="inline-flex h-8 w-8 items-center justify-center rounded-md text-dharma-muted hover:bg-saffron-50 hover:text-saffron-700"
              aria-label={labels.reset}
              title={labels.reset}
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-4 gap-2 lg:grid-cols-3">
            {verses.map((verse, index) => {
              const isActive = index === activeIndex;
              const isLearned = learnedSet.has(verse.id);
              return (
                <button
                  key={verse.id}
                  type="button"
                  onClick={() => selectVerse(index)}
                  className={`relative flex h-11 items-center justify-center rounded-lg border text-sm font-semibold transition ${
                    isActive
                      ? "border-saffron-600 bg-saffron-600 text-white"
                      : "border-dharma-border bg-white text-dharma-text hover:border-saffron-300 hover:bg-saffron-50"
                  }`}
                >
                  {verse.id}
                  {isLearned && (
                    <CheckCircle2
                      className={`absolute -right-1 -top-1 h-4 w-4 ${isActive ? "text-white" : "text-green-600"}`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        <AnimatePresence mode="wait" initial={false}>
          <motion.article
            key={activeVerse.id}
            className="rounded-lg border border-dharma-border bg-white shadow-sm"
            initial={reduce ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: -16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
          <div className="border-b border-dharma-border bg-saffron-50/60 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <span className="verse-number">{activeVerse.id}</span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-saffron-800">
                    {labels.verses} {activeIndex + 1} / {verses.length}
                  </p>
                  <p className="text-sm text-dharma-muted">
                    {learnedSet.has(activeVerse.id)
                      ? labels.learned
                      : labels.study}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleLearned}
                className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  learnedSet.has(activeVerse.id)
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-saffron-600 text-white hover:bg-saffron-700"
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                {learnedSet.has(activeVerse.id) ? labels.learned : labels.mark}
              </button>
            </div>
          </div>

          <div className="space-y-5 p-5 md:p-6">
            <section>
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-dharma-muted">
                {labels.sanskrit}
              </h3>
              <p
                lang="sa"
                className="sanskrit-text text-2xl text-dharma-text whitespace-pre-line"
              >
                {activeVerse.sanskrit}
              </p>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between gap-4 px-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {(["saffron", "blue", "green", "purple"] as const).map(
                      (color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setCardTheme(color)}
                          className={`h-6 w-6 rounded-full border-2 transition ${
                            cardTheme === color
                              ? "border-gray-800"
                              : "border-gray-300"
                          } ${
                            color === "saffron"
                              ? "bg-saffron-500"
                              : color === "blue"
                                ? "bg-blue-500"
                                : color === "green"
                                  ? "bg-green-500"
                                  : "bg-purple-500"
                          }`}
                          title={`${color} theme`}
                        />
                      ),
                    )}
                  </div>
                </div>
                <span
                  className={`rounded-full ${currentTheme.bg} border ${currentTheme.border} px-3 py-1 text-xs font-semibold uppercase tracking-wider ${currentTheme.text}`}
                >
                  {isCardFlipped
                    ? language === "hi"
                      ? "पीछे"
                      : "Back"
                    : language === "hi"
                      ? "सामने"
                      : "Front"}
                </span>
              </div>

              <div
                ref={flashcardRef}
                className={`relative overflow-hidden rounded-3xl border ${currentTheme.border} ${currentTheme.bg} p-6 shadow-sm`}
              >
                <div className="mb-5 text-center">
                  <p
                    className={`text-xs font-semibold uppercase tracking-wider ${currentTheme.text}`}
                  >
                    {scriptureTitle}
                  </p>
                  <h3 className="mt-1 text-xl font-serif font-bold text-dharma-text">
                    {chapterTitle} •{" "}
                    {language === "hi"
                      ? `श्लोक ${activeVerse.id}`
                      : `Verse ${activeVerse.id}`}
                  </h3>
                </div>
                <div className="rounded-3xl bg-white p-6 shadow-sm min-h-[260px] flex flex-col justify-center">
                  {isCardFlipped ? (
                    <div className="flex h-full flex-col justify-between gap-4">
                      <div>
                        {hindiMeaning ? (
                          <>
                            <p className="text-xs uppercase tracking-wider text-dharma-muted">
                              {language === "hi" ? "हिंदी अर्थ" : "Hindi Meaning"}
                            </p>
                            {activeVerse.hindi && (
                              <p
                                lang="hi"
                                className="mt-3 font-devanagari text-lg leading-relaxed text-rose-700 font-medium"
                              >
                                {activeVerse.hindi}
                              </p>
                            )}
                            <p
                              lang={language === "hi" ? "hi" : "en"}
                              className={`mt-3 text-base leading-relaxed text-dharma-text whitespace-pre-line ${language === "hi" ? "font-devanagari text-lg" : ""}`}
                            >
                              {hindiMeaning}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-xs uppercase tracking-wider text-dharma-muted">
                              {language === "hi" ? "अनुवाद" : "Translation"}
                            </p>
                            <p className="mt-3 text-base leading-relaxed text-dharma-text">
                              {activeVerse.translation}
                            </p>
                          </>
                        )}
                      </div>
                      {hindiMeaning && (
                        <div
                          className={`rounded-2xl ${currentTheme.accent} p-4 text-sm text-dharma-text`}
                        >
                          <p className="font-semibold">
                            {language === "hi" ? "अनुवाद" : "Translation"}
                          </p>
                          <p className="mt-2">{activeVerse.translation}</p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex h-full flex-col justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-dharma-muted">
                          {language === "hi" ? "संस्कृत" : "Sanskrit"}
                        </p>
                        <p
                          lang="sa"
                          className="mt-3 text-2xl leading-relaxed text-dharma-text whitespace-pre-line font-devanagari"
                        >
                          {activeVerse.sanskrit}
                        </p>
                      </div>
                      <div
                        className={`rounded-2xl ${currentTheme.accent} p-4 text-sm text-dharma-text`}
                      >
                        <p className="font-semibold">
                          {language === "hi" ? "उच्चारण" : "Transliteration"}
                        </p>
                        <p className="mt-2 whitespace-pre-line italic">
                          {activeVerse.transliteration}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-5 flex justify-between items-center px-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full border ${currentTheme.border} ${currentTheme.accent} ${currentTheme.text} font-bold`}
                    >
                      <span
                        lang="sa"
                        className="font-devanagari text-base leading-none"
                      >
                        ॐ
                      </span>
                    </span>
                    <p
                      className={`text-xs font-bold uppercase tracking-[0.2em] ${currentTheme.text}`}
                    >
                      Dharma Granth
                    </p>
                  </div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-dharma-muted">
                    {(
                      process.env.NEXT_PUBLIC_SHARE_URL || "dharma-granth"
                    ).replace(/^https?:\/\//, "")}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 px-2">
                <button
                  type="button"
                  onClick={() => setIsCardFlipped((prev) => !prev)}
                  className={`inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-dharma-text transition border border-dharma-border hover:${currentTheme.buttonBorder} hover:text-dharma-text`}
                >
                  <BookOpen className="h-4 w-4" />
                  {language === "hi" ? "पलटें" : "Flip Card"}
                </button>
                <button
                  type="button"
                  onClick={shareFlashCard}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white transition ${currentTheme.button}`}
                >
                  <Share2 className="h-4 w-4" />
                  {language === "hi" ? "साझा करें" : "Share / Download"}
                </button>
              </div>
              {shareStatus !== "idle" && (
                <p className="mt-3 px-2 text-sm text-dharma-muted">
                  {shareStatus === "shared" &&
                    (language === "hi"
                      ? "कार्ड साझा किया गया।"
                      : "Card shared successfully.")}
                  {shareStatus === "copy" &&
                    (language === "hi"
                      ? "कार्ड डाउनलोड हो गया।"
                      : "Card image downloaded.")}
                  {shareStatus === "error" &&
                    (language === "hi"
                      ? "साझा करने में त्रुटि।"
                      : "Unable to share the card.")}
                </p>
              )}
            </section>

            <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
              {(
                [
                  "transliteration",
                  "translation",
                  "meaning",
                  "explanation",
                  "science",
                  "lifeLesson",
                  "practice",
                ] as const
              ).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleReveal(key)}
                  className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${
                    reveal[key]
                      ? "border-saffron-500 bg-saffron-50 text-saffron-800"
                      : "border-dharma-border text-dharma-muted hover:border-saffron-300 hover:text-saffron-700"
                  }`}
                >
                  {key === "science" ? (
                    <Atom className="h-4 w-4" />
                  ) : key === "lifeLesson" ? (
                    <Lightbulb className="h-4 w-4" />
                  ) : key === "practice" ? (
                    <ListChecks className="h-4 w-4" />
                  ) : (
                    <BookOpen className="h-4 w-4" />
                  )}
                  {labels[key]}
                </button>
              ))}
            </div>

            {reveal.transliteration && (
              <section className="rounded-lg border border-dharma-border p-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-dharma-muted">
                  {labels.transliteration}
                </h3>
                <p
                  lang="sa-Latn"
                  className="text-sm italic leading-relaxed text-dharma-text whitespace-pre-line"
                >
                  {activeVerse.transliteration}
                </p>
              </section>
            )}

            {reveal.translation && (
              <section className="rounded-lg border border-dharma-border p-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-dharma-muted">
                  {labels.translation}
                </h3>
                <p className="text-base leading-relaxed text-dharma-text">
                  {activeVerse.translation}
                </p>
              </section>
            )}

            {reveal.meaning && meaning && (
              <section className="rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 p-5">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rose-700">
                  <span className="text-base">🪷</span>
                  {labels.hindiMeaning}
                </h3>
                {activeVerse.hindi && (
                  <p
                    lang="hi"
                    className="font-devanagari text-lg leading-relaxed text-rose-900 mb-3 font-medium"
                  >
                    {activeVerse.hindi}
                  </p>
                )}
                <p
                  lang={language === "hi" ? "hi" : "en"}
                  className={`text-sm leading-relaxed text-rose-800 ${language === "hi" ? "font-devanagari text-base" : ""}`}
                >
                  {meaning}
                </p>
              </section>
            )}

            {reveal.explanation && (
              <section className="explanation-box">
                <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-saffron-800">
                  <Sparkles className="h-4 w-4" />
                  {labels.explanation}
                </h3>
                <p
                  lang={
                    language === "hi" && activeVerse.explanationHi ? "hi" : "en"
                  }
                  className={`text-sm leading-relaxed text-dharma-text ${language === "hi" ? "font-devanagari text-base" : ""}`}
                >
                  {explanation}
                </p>
              </section>
            )}

            {reveal.science && activeVerse.science && (
              <section className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-50 p-5">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-indigo-700">
                  <Atom className="h-4 w-4" />
                  {labels.science}
                  <span className="ml-1 text-indigo-400 font-normal normal-case tracking-normal">
                    — {labels.scienceSubtitle}
                  </span>
                </h3>
                <p
                  className={`text-sm leading-relaxed text-indigo-900 ${language === "hi" ? "font-devanagari text-base" : ""}`}
                >
                  {activeVerse.science}
                </p>
              </section>
            )}

            {reveal.lifeLesson && activeVerse.lifeLesson && (
              <section className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-5">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700">
                  <Lightbulb className="h-4 w-4" />
                  {labels.lifeLesson}
                  <span className="ml-1 text-amber-400 font-normal normal-case tracking-normal">
                    — {labels.lifeLessonSubtitle}
                  </span>
                </h3>
                <p
                  className={`text-sm leading-relaxed text-amber-900 ${language === "hi" ? "font-devanagari text-base" : ""}`}
                >
                  {activeVerse.lifeLesson}
                </p>
              </section>
            )}

            {reveal.practice && (
              <section className="rounded-lg border border-dharma-border bg-dharma-bg p-4">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-dharma-muted">
                  <PenLine className="h-4 w-4" />
                  {labels.practice}
                </h3>
                <p className="mb-3 text-sm font-medium text-dharma-text">
                  {labels.prompt}
                </p>
                <p
                  className={`mb-4 text-sm leading-relaxed text-dharma-muted ${language === "hi" ? "font-devanagari text-base" : ""}`}
                >
                  {explanation}
                </p>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider text-dharma-muted"
                  htmlFor="reflection-note"
                >
                  {labels.reflection}
                </label>
                <textarea
                  id="reflection-note"
                  value={reflection}
                  onChange={(event) => setReflection(event.target.value)}
                  placeholder={labels.reflectionPlaceholder}
                  className="mt-2 min-h-24 w-full resize-y rounded-lg border border-dharma-border bg-white p-3 text-sm leading-relaxed text-dharma-text outline-none transition focus:border-saffron-500 focus:ring-2 focus:ring-saffron-100"
                />
              </section>
            )}

            {activeVerse.keywords && activeVerse.keywords.length > 0 && (
              <section className="border-t border-dharma-border pt-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-dharma-muted">
                  {language === "hi" ? "मुख्य विषय" : "Key Themes"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {activeVerse.keywords.map((keyword) => (
                    <span
                      key={keyword}
                      className="inline-flex items-center rounded-full bg-saffron-100 px-3 py-1 text-xs font-semibold text-saffron-800 border border-saffron-200"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-dharma-border p-5">
            <button
              type="button"
              onClick={() => goBy(-1)}
              disabled={activeIndex === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-dharma-border px-4 py-2 text-sm font-semibold text-dharma-text transition hover:bg-saffron-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              {labels.previous}
            </button>
            <button
              type="button"
              onClick={() => goBy(1)}
              disabled={activeIndex === verses.length - 1}
              className="inline-flex items-center gap-2 rounded-lg bg-saffron-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-saffron-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {labels.next}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
}
