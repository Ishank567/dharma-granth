"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useSearchParams } from "next/navigation";
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
  Bookmark,
  Volume2,
  Play,
  Square,
  Settings,
} from "lucide-react";

type LearningVerse = Verse & {
  explanationHi?: string;
};
type VerseId = Verse["id"];

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
  const [learnedVerseIds, setLearnedVerseIds] = useState<VerseId[]>([]);
  const [reflection, setReflection] = useState("");
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [shareStatus, setShareStatus] = useState<
    "idle" | "copy" | "shared" | "error"
  >("idle");
  const [cardTheme, setCardTheme] = useState<
    "saffron" | "blue" | "green" | "purple"
  >("saffron");
  const flashcardRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const [bookmarkedVerses, setBookmarkedVerses] = useState<any[]>([]);
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  const [bpm, setBpm] = useState(50);
  const [isMetronomeActive, setIsMetronomeActive] = useState(false);
  const [metronomeTick, setMetronomeTick] = useState(false);

  // Poster states
  const [posterBg, setPosterBg] = useState<"saffron" | "charcoal" | "rose" | "sage">("saffron");
  const [posterBorder, setPosterBorder] = useState<"minimalist" | "classical" | "double">("classical");
  const [posterEmphasis, setPosterEmphasis] = useState<"balanced" | "devanagari" | "translation">("balanced");

  const currentScriptureId = useMemo(() => scriptureTitle.trim().toLowerCase().replace(/\s+/g, "-"), [scriptureTitle]);
  const currentChapterId = useMemo(() => chapterTitle.trim().toLowerCase().replace(/\s+/g, "-"), [chapterTitle]);

  const labels = copy[language];
  const activeVerse = verses[activeIndex];
  const activeVerseLabel = activeVerse.number ?? activeVerse.id;
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
    return `dharma.chapterLearning.${currentScriptureId}.${currentChapterId}`;
  }, [currentScriptureId, currentChapterId]);

  // Load verse from query parameter
  useEffect(() => {
    const verseParam = searchParams.get("verse");
    if (verseParam) {
      const idx = verses.findIndex((v) => String(v.id) === String(verseParam));
      if (idx !== -1) {
        setActiveIndex(idx);
      }
    }
  }, [searchParams, verses]);

  // Load bookmarks
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dharma.bookmarkedVerses");
      if (saved) {
        setBookmarkedVerses(JSON.parse(saved));
      }
    } catch {}
  }, []);

  // Metronome pulsing effect
  useEffect(() => {
    if (!isMetronomeActive) {
      setMetronomeTick(false);
      return;
    }
    const intervalMs = (60 / bpm) * 1000;
    const timer = setInterval(() => {
      setMetronomeTick((t) => !t);
    }, intervalMs);
    return () => clearInterval(timer);
  }, [isMetronomeActive, bpm]);

  // Handle SpeechSynthesis voice-mount loading
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.getVoices();
    }
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as { cardTheme?: string; learnedVerseIds?: VerseId[] };
        if (
          typeof parsed.cardTheme === "string" &&
          ["saffron", "blue", "green", "purple"].includes(parsed.cardTheme)
        ) {
          setCardTheme(
            parsed.cardTheme as "saffron" | "blue" | "green" | "purple",
          );
        }
        if (Array.isArray(parsed.learnedVerseIds)) {
          setLearnedVerseIds(parsed.learnedVerseIds);
        }
      }
    } catch {
      // ignore localStorage failures
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ cardTheme, learnedVerseIds }));
    } catch {
      // ignore localStorage write failures
    }
  }, [storageKey, cardTheme, learnedVerseIds]);

  function selectVerse(index: number) {
    setActiveIndex(index);
    setReveal(initialReveal);
    setReflection("");
  }

  function toggleBookmark() {
    const key = "dharma.bookmarkedVerses";
    let updated: any[] = [];
    const exists = bookmarkedVerses.some(
      (b) => b.scriptureId === currentScriptureId && b.verseId === activeVerse.id
    );

    if (exists) {
      updated = bookmarkedVerses.filter(
        (b) => !(b.scriptureId === currentScriptureId && b.verseId === activeVerse.id)
      );
    } else {
      const newBookmark = {
        scriptureId: currentScriptureId,
        scriptureTitle,
        chapterTitle,
        verseId: activeVerse.id,
        sanskrit: activeVerse.sanskrit,
        translation: activeVerse.translation,
        timestamp: new Date().toISOString(),
      };
      updated = [...bookmarkedVerses, newBookmark];
    }
    setBookmarkedVerses(updated);
    try {
      localStorage.setItem(key, JSON.stringify(updated));
    } catch {}
  }

  function speakSanskrit() {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    if (isPlayingSpeech) {
      window.speechSynthesis.cancel();
      setIsPlayingSpeech(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(activeVerse.sanskrit);
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find((v) => v.lang.startsWith("sa") || v.lang.startsWith("hi")) || null;
    if (voice) utterance.voice = voice;

    utterance.rate = 0.7; // deliberately slow
    utterance.onend = () => setIsPlayingSpeech(false);
    utterance.onerror = () => setIsPlayingSpeech(false);

    setIsPlayingSpeech(true);
    window.speechSynthesis.speak(utterance);
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

  // Map poster bg to CSS classes
  const posterBgClass = useMemo(() => {
    switch (posterBg) {
      case "charcoal":
        return "bg-gradient-to-br from-neutral-900 via-zinc-900 to-stone-950 text-white border-zinc-800";
      case "rose":
        return "bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 text-rose-950 border-rose-200";
      case "sage":
        return "bg-gradient-to-br from-emerald-50 via-teal-50/50 to-emerald-100 text-emerald-950 border-emerald-200";
      case "saffron":
      default:
        return "bg-gradient-to-br from-amber-50 via-saffron-50 to-orange-50 text-slate-900 border-saffron-200";
    }
  }, [posterBg]);

  // Map poster border to CSS classes
  const posterBorderClass = useMemo(() => {
    switch (posterBorder) {
      case "minimalist":
        return "border border-dharma-border";
      case "double":
        return "border-[6px] border-double border-dharma-muted/30 p-5";
      case "classical":
      default:
        return "border-[8px] border-double border-saffron-500/80 p-5";
    }
  }, [posterBorder]);

  return (
    <section className="space-y-6">
      <div className="rounded-lg border border-dharma-border bg-dharma-card p-4 shadow-sm">
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
                      ? "bg-dharma-card text-saffron-800 shadow-sm"
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
              className="inline-flex items-center gap-2 rounded-full border border-dharma-border bg-dharma-card px-4 py-2 text-sm font-semibold text-dharma-text transition hover:border-saffron-400 hover:text-saffron-700"
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
        <aside className="rounded-lg border border-dharma-border bg-dharma-card p-4 shadow-sm lg:sticky lg:top-4 lg:self-start">
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
              const verseLabel = verse.number ?? verse.id;
              return (
                <button
                  key={verse.id}
                  type="button"
                  onClick={() => selectVerse(index)}
                  className={`relative flex h-11 items-center justify-center rounded-lg border text-sm font-semibold transition ${
                    isActive
                      ? "border-saffron-600 bg-saffron-600 text-white"
                      : "border-dharma-border bg-dharma-card text-dharma-text hover:border-saffron-300 hover:bg-saffron-500/10"
                  }`}
                >
                  {verseLabel}
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
            className="rounded-lg border border-dharma-border bg-dharma-card shadow-sm"
            initial={reduce ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduce ? undefined : { opacity: 0, x: -16 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
          <div className="border-b border-dharma-border bg-saffron-50/20 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <span className="verse-number">{activeVerseLabel}</span>
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
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={toggleBookmark}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition border ${
                    bookmarkedVerses.some(
                      (b) => b.scriptureId === currentScriptureId && b.verseId === activeVerse.id
                    )
                      ? "bg-saffron-100 border-saffron-300 text-saffron-800 hover:bg-saffron-200"
                      : "bg-dharma-card border-dharma-border text-dharma-muted hover:border-saffron-300 hover:text-saffron-700"
                  }`}
                  title={
                    bookmarkedVerses.some(
                      (b) => b.scriptureId === currentScriptureId && b.verseId === activeVerse.id
                    )
                      ? "Remove Bookmark"
                      : "Add Bookmark"
                  }
                >
                  <Bookmark className={`h-4 w-4 ${
                    bookmarkedVerses.some(
                      (b) => b.scriptureId === currentScriptureId && b.verseId === activeVerse.id
                    ) ? "fill-saffron-600 text-saffron-600" : ""
                  }`} />
                  {bookmarkedVerses.some(
                    (b) => b.scriptureId === currentScriptureId && b.verseId === activeVerse.id
                  )
                    ? (language === "hi" ? "सहेजा गया" : "Saved")
                    : (language === "hi" ? "सहेजें" : "Save")}
                </button>

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
          </div>

          <div className="space-y-5 p-5 md:p-6">
            <section>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-dharma-muted">
                  {labels.sanskrit}
                </h3>
                <button
                  type="button"
                  onClick={speakSanskrit}
                  className={`inline-flex items-center gap-1.5 rounded-full border border-dharma-border px-3 py-1 text-xs font-semibold transition hover:border-saffron-400 hover:text-saffron-700 ${
                    isPlayingSpeech
                      ? "bg-saffron-100 border-saffron-300 text-saffron-800"
                      : "bg-dharma-card text-dharma-muted"
                  }`}
                >
                  <Volume2 className={`h-3.5 w-3.5 ${isPlayingSpeech ? "animate-pulse" : ""}`} />
                  {isPlayingSpeech
                    ? (language === "hi" ? "पाठ बंद करें" : "Stop Reciting")
                    : (language === "hi" ? "पाठ सुनें" : "Listen Reciting")}
                </button>
              </div>
              <p
                lang="sa"
                className="sanskrit-text text-2xl text-dharma-text whitespace-pre-line"
              >
                {activeVerse.sanskrit}
              </p>
            </section>

            {/* Chanting Metronome Widget */}
            <div className="rounded-xl border border-dharma-border bg-dharma-bg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsMetronomeActive(!isMetronomeActive)}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-full text-white transition ${
                    isMetronomeActive
                      ? "bg-red-500 hover:bg-red-600 animate-pulse"
                      : "bg-saffron-600 hover:bg-saffron-700"
                  }`}
                  title={isMetronomeActive ? "Stop Metronome" : "Start Metronome"}
                >
                  {isMetronomeActive ? (
                    <Square className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4 fill-current ml-0.5" />
                  )}
                </button>
                <div>
                  <h4 className="text-sm font-semibold text-dharma-text">
                    {language === "hi" ? "मंत्र जाप लय (Metronome)" : "Chanting Metronome"}
                  </h4>
                  <p className="text-xs text-dharma-muted">
                    {language === "hi" ? "मंत्रोच्चारण की लय बनाए रखने में मदद" : "Keep a steady rhythm for meditation"}
                  </p>
                </div>
              </div>

              {/* Ticking Visual Pulse indicator */}
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2, 3].map((index) => {
                    const isLit = isMetronomeActive && (metronomeTick ? index % 2 === 0 : index % 2 !== 0);
                    return (
                      <motion.div
                        key={index}
                        animate={isLit ? { scale: [1, 1.25, 1], opacity: 1 } : { scale: 1, opacity: 0.4 }}
                        transition={{ duration: 0.3 }}
                        className={`h-2.5 w-2.5 rounded-full ${
                          isLit
                            ? "bg-saffron-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]"
                            : "bg-dharma-muted"
                        }`}
                      />
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-dharma-muted">{bpm} BPM</span>
                  <input
                    type="range"
                    min="30"
                    max="100"
                    value={bpm}
                    onChange={(e) => setBpm(Number(e.target.value))}
                    className="h-1.5 w-24 rounded-lg bg-saffron-200 accent-saffron-600 cursor-pointer"
                  />
                </div>
              </div>
            </div>

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

              {/* High-Fidelity Poster Image Generator Area */}
              <div
                ref={flashcardRef}
                className={`relative overflow-hidden rounded-3xl transition-all shadow-md ${posterBgClass} ${posterBorderClass}`}
              >
                <div className="mb-5 text-center">
                  <p
                    className={`text-xs font-semibold uppercase tracking-wider ${
                      posterBg === "charcoal" ? "text-saffron-400" : currentTheme.text
                    }`}
                  >
                    {scriptureTitle}
                  </p>
                  <h3 className="mt-1 text-xl font-serif font-bold">
                    {chapterTitle} •{" "}
                    {language === "hi"
                      ? `श्लोक ${activeVerseLabel}`
                      : `Verse ${activeVerseLabel}`}
                  </h3>
                </div>
                <div className={`rounded-3xl p-6 shadow-sm min-h-[260px] flex flex-col justify-center ${
                  posterBg === "charcoal" ? "bg-zinc-800/80 text-white" : "bg-dharma-card text-dharma-text"
                }`}>
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
                              className={`mt-3 leading-relaxed whitespace-pre-line ${
                                language === "hi" ? "font-devanagari text-lg" : "text-base"
                              } ${
                                posterEmphasis === "translation"
                                  ? "text-xl font-medium text-saffron-600"
                                  : ""
                              }`}
                            >
                              {hindiMeaning}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-xs uppercase tracking-wider text-dharma-muted">
                              {language === "hi" ? "अनुवाद" : "Translation"}
                            </p>
                            <p className={`mt-3 leading-relaxed text-base ${
                              posterEmphasis === "translation" ? "text-lg font-semibold text-saffron-600" : ""
                            }`}>
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
                          className={`mt-3 leading-relaxed whitespace-pre-line font-devanagari ${
                            posterEmphasis === "devanagari"
                              ? "text-3xl font-bold text-saffron-600 drop-shadow-sm"
                              : "text-2xl text-dharma-text"
                          }`}
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
                      className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                        posterBg === "charcoal"
                          ? "border-zinc-700 bg-zinc-800"
                          : `${currentTheme.border} ${currentTheme.accent}`
                      } font-bold`}
                    >
                      <span
                        lang="sa"
                        className="font-devanagari text-base leading-none text-saffron-600"
                      >
                        ॐ
                      </span>
                    </span>
                    <p
                      className={`text-xs font-bold uppercase tracking-[0.2em] ${
                        posterBg === "charcoal" ? "text-zinc-400" : currentTheme.text
                      }`}
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
                  className={`inline-flex items-center gap-2 rounded-full bg-dharma-card px-4 py-2 text-sm font-semibold text-dharma-text transition border border-dharma-border hover:${currentTheme.buttonBorder} hover:text-dharma-text`}
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
                  {language === "hi" ? "साझा करें / डाउनलोड" : "Share / Download"}
                </button>
              </div>

              {/* Poster Generator Customizer Controls */}
              <div className="mt-4 rounded-2xl border border-dharma-border bg-dharma-bg/60 p-4 space-y-4 shadow-inner">
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-dharma-text">
                  <Settings className="h-4 w-4 text-saffron-600" />
                  {language === "hi" ? "पोस्टर कस्टमाइज़र" : "Premium Poster Generator Customizer"}
                </div>
                
                <div className="grid gap-4 sm:grid-cols-3">
                  {/* Background Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-dharma-muted">
                      {language === "hi" ? "पृष्ठभूमि (Background)" : "Background"}
                    </label>
                    <div className="flex gap-1.5">
                      {(["saffron", "charcoal", "rose", "sage"] as const).map((bg) => (
                        <button
                          key={bg}
                          type="button"
                          onClick={() => setPosterBg(bg)}
                          className={`h-7 px-2 rounded text-xs font-semibold border transition ${
                            posterBg === bg
                              ? "bg-saffron-600 border-saffron-600 text-white"
                              : "bg-dharma-card border-dharma-border text-dharma-text hover:border-saffron-400"
                          }`}
                        >
                          {bg === "saffron"
                            ? (language === "hi" ? "केसरिया" : "Saffron")
                            : bg === "charcoal"
                            ? (language === "hi" ? "कोयला" : "Charcoal")
                            : bg === "rose"
                            ? (language === "hi" ? "गुलाबी" : "Rose")
                            : (language === "hi" ? "ऋषि" : "Sage")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Border Style Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-dharma-muted">
                      {language === "hi" ? "बॉर्डर (Border Style)" : "Border Style"}
                    </label>
                    <div className="flex gap-1.5">
                      {(["minimalist", "classical", "double"] as const).map((border) => (
                        <button
                          key={border}
                          type="button"
                          onClick={() => setPosterBorder(border)}
                          className={`h-7 px-2 rounded text-xs font-semibold border transition ${
                            posterBorder === border
                              ? "bg-saffron-600 border-saffron-600 text-white"
                              : "bg-dharma-card border-dharma-border text-dharma-text hover:border-saffron-400"
                          }`}
                        >
                          {border === "minimalist"
                            ? (language === "hi" ? "सादा" : "Minimal")
                            : border === "classical"
                            ? (language === "hi" ? "शास्त्रीय" : "Classic")
                            : (language === "hi" ? "डबल" : "Double")}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Typography Emphasis Selector */}
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-bold uppercase tracking-wider text-dharma-muted">
                      {language === "hi" ? "महत्व (Emphasis)" : "Emphasis"}
                    </label>
                    <div className="flex gap-1.5">
                      {(["balanced", "devanagari", "translation"] as const).map((emp) => (
                        <button
                          key={emp}
                          type="button"
                          onClick={() => setPosterEmphasis(emp)}
                          className={`h-7 px-2 rounded text-xs font-semibold border transition ${
                            posterEmphasis === emp
                              ? "bg-saffron-600 border-saffron-600 text-white"
                              : "bg-dharma-card border-dharma-border text-dharma-text hover:border-saffron-400"
                          }`}
                        >
                          {emp === "balanced"
                            ? (language === "hi" ? "संतुलित" : "Balanced")
                            : emp === "devanagari"
                            ? (language === "hi" ? "संस्कृत" : "Sanskrit")
                            : (language === "hi" ? "अनुवाद" : "Translation")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {shareStatus !== "idle" && (
                <p className="mt-3 px-2 text-sm text-dharma-muted">
                  {shareStatus === "shared" &&
                    (language === "hi"
                      ? "कार्ड सफलतापूर्वक साझा किया गया।"
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
                      ? "border-saffron-500 bg-saffron-50/20 text-saffron-800 animate-pulse"
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
              <section className="rounded-lg border border-dharma-border p-4 bg-dharma-card">
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
              <section className="rounded-lg border border-dharma-border p-4 bg-dharma-card">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-dharma-muted">
                  {labels.translation}
                </h3>
                <p className="text-base leading-relaxed text-dharma-text">
                  {activeVerse.translation}
                </p>
              </section>
            )}

            {reveal.meaning && meaning && (
              <section className="rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50/10 to-pink-50/10 p-5">
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
              <section className="explanation-box bg-amber-50/10 border border-amber-200 p-5 rounded-xl">
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
              <section className="rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/10 to-blue-50/10 p-5">
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
              <section className="rounded-xl border border-amber-200 bg-gradient-to-br from-amber-50/10 to-yellow-50/10 p-5">
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
                  className="mt-2 min-h-24 w-full resize-y rounded-lg border border-dharma-border bg-dharma-card p-3 text-sm leading-relaxed text-dharma-text outline-none transition focus:border-saffron-500 focus:ring-2 focus:ring-saffron-100"
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

          <div className="flex items-center justify-between border-t border-dharma-border p-5 bg-dharma-bg/40">
            <button
              type="button"
              onClick={() => goBy(-1)}
              disabled={activeIndex === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-dharma-border px-4 py-2 text-sm font-semibold text-dharma-text transition hover:bg-saffron-500/10 disabled:cursor-not-allowed disabled:opacity-40 bg-dharma-card"
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
