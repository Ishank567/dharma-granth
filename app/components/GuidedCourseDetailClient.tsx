'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import LearningArchivePanel from '@/app/components/LearningArchivePanel';
import {
  clearCourseProgress,
  getCourseLearningSummary,
  getCourseMilestones,
  getLearningSummary,
  getModuleNote,
  LEARNING_DATA_UPDATED_EVENT,
  readLearningData,
  setModuleNote,
  toggleCourseModuleCompletion,
} from '@/app/lib/learningStorage';
import type { Interpretation, Verse } from '@/app/lib/types';
import type { ResolvedGuidedCourse } from '@/app/lib/guidedCourses';

type CourseModuleWithContent = ResolvedGuidedCourse['modules'][number] & {
  anchorVerse?: Verse | null;
  anchorInterpretation?: Interpretation | null;
};

interface Props {
  book: {
    title_hindi: string;
    slug: string;
    category_slug?: string;
  };
  course: ResolvedGuidedCourse;
  modules: CourseModuleWithContent[];
}

export default function GuidedCourseDetailClient({ book, course, modules }: Props) {
  const [mounted, setMounted] = useState(false);
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [moduleNotes, setModuleNotes] = useState<Record<string, string>>({});
  const [noteStatus, setNoteStatus] = useState<Record<string, string>>({});
  const [certificateIssuedAt, setCertificateIssuedAt] = useState<string | undefined>();
  const [courseStreak, setCourseStreak] = useState({ currentStreak: 0, longestStreak: 0, activeDays: 0 });
  const [learnerName, setLearnerName] = useState('');

  useEffect(() => {
    const refresh = () => {
      const data = readLearningData();
      const record = data.courseProgress[course.bookSlug];
      const nextCompletedModules = record?.completedModules || [];
      const nextModuleNotes = Object.fromEntries(
        modules.map((module) => [module.slug, getModuleNote(course.bookSlug, module.slug, data)])
      );
      const courseSummary = getCourseLearningSummary(course.bookSlug, modules.length, data);
      const learningSummary = getLearningSummary(data);

      setCompletedModules(nextCompletedModules);
      setModuleNotes(nextModuleNotes);
      setCertificateIssuedAt(courseSummary.certificateIssuedAt);
      setCourseStreak({
        currentStreak: courseSummary.currentStreak,
        longestStreak: courseSummary.longestStreak,
        activeDays: courseSummary.activeDays,
      });
      setLearnerName(learningSummary.learnerName || 'समर्पित साधक');
      setMounted(true);
    };

    refresh();
    window.addEventListener(LEARNING_DATA_UPDATED_EVENT, refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener(LEARNING_DATA_UPDATED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [course.bookSlug, modules]);

  const completedSet = useMemo(() => new Set(completedModules), [completedModules]);
  const completedCount = completedModules.length;
  const progressPercent = modules.length > 0 ? Math.round((completedCount / modules.length) * 100) : 0;
  const nextModule = modules.find((module) => !completedSet.has(module.slug));
  const milestones = useMemo(
    () => getCourseMilestones(completedCount, modules.length, courseStreak.currentStreak),
    [completedCount, courseStreak.currentStreak, modules.length]
  );

  const toggleModuleCompletion = (moduleSlug: string) => {
    toggleCourseModuleCompletion(course.bookSlug, moduleSlug, modules.length);
  };

  const clearProgress = () => {
    clearCourseProgress(course.bookSlug);
    setNoteStatus({});
  };

  const saveModuleJournal = (moduleSlug: string) => {
    setModuleNote(course.bookSlug, moduleSlug, moduleNotes[moduleSlug] || '');
    setNoteStatus((current) => ({
      ...current,
      [moduleSlug]: moduleNotes[moduleSlug]?.trim() ? 'जर्नल सहेज लिया गया।' : 'जर्नल प्रविष्टि हटा दी गई।',
    }));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
        <Link href="/" className="hover:text-accent transition-colors">मुख्य पृष्ठ</Link>
        <span className="mx-2">›</span>
        <Link href="/courses" className="hover:text-accent transition-colors">अध्ययन पथ</Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">{course.title}</span>
      </nav>

      <section className="rounded-[2rem] border border-border bg-card p-8 md:p-10 mb-10">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="max-w-4xl">
            <span className="inline-flex items-center rounded-full bg-accent-bg px-3 py-1 text-xs font-semibold text-accent mb-4">
              {course.tradition}
            </span>
            <h1 className="font-serif-deva text-4xl font-bold text-foreground mb-3">
              {course.title}
            </h1>
            <p className="text-lg text-muted-light mb-4">{course.subtitle}</p>
            <p className="text-muted leading-relaxed">{course.summary}</p>
          </div>

          <div className="min-w-[260px] rounded-2xl border border-border bg-background/70 p-5">
            <div className="text-sm text-muted space-y-2">
              <p>ग्रंथ: <span className="text-foreground font-medium">{book.title_hindi}</span></p>
              <p>अध्ययन-खंड: <span className="text-foreground font-medium">{course.modules.length}</span></p>
              <p>कुल पाठ: <span className="text-foreground font-medium">{course.totalVerses}</span></p>
              <p>पूर्ण प्रगति: <span className="text-foreground font-medium">{mounted ? `${completedCount}/${modules.length}` : '...'}</span></p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-border">
              <div
                className="h-full rounded-full bg-accent transition-all duration-300"
                style={{ width: `${mounted ? progressPercent : 0}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-muted-light">
              {mounted
                ? nextModule
                  ? `अगला अध्ययन-खंड: ${nextModule.title}`
                  : 'आपने सभी अध्ययन-खंड पूर्ण कर लिए हैं।'
                : 'प्रगति लोड हो रही है...'}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/categories/${book.category_slug}/${book.slug}`}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
              >
                📖 मूल पाठ खोलें
              </Link>
              {mounted && completedCount > 0 && (
                <button
                  onClick={clearProgress}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-card-hover transition-colors"
                >
                  रीसेट करें
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-2xl border border-accent/20 bg-accent-bg/40 p-5">
          <h2 className="font-serif-deva text-lg font-bold text-primary mb-2">अध्ययन टिप्पणी</h2>
          <p className="text-sm text-foreground/85 leading-relaxed">{course.studyNote}</p>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="rounded-2xl border border-border bg-background/70 p-5">
            <h2 className="font-serif-deva text-lg font-bold text-foreground mb-3">अध्ययन उपलब्धियाँ</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-border bg-card px-4 py-3">
                <p className="text-xs font-semibold text-primary mb-1">वर्तमान क्रम</p>
                <p className="text-xl font-bold text-foreground">{mounted ? courseStreak.currentStreak : 0}</p>
              </div>
              <div className="rounded-xl border border-border bg-card px-4 py-3">
                <p className="text-xs font-semibold text-primary mb-1">सबसे लंबा क्रम</p>
                <p className="text-xl font-bold text-foreground">{mounted ? courseStreak.longestStreak : 0}</p>
              </div>
              <div className="rounded-xl border border-border bg-card px-4 py-3">
                <p className="text-xs font-semibold text-primary mb-1">सक्रिय दिन</p>
                <p className="text-xl font-bold text-foreground">{mounted ? courseStreak.activeDays : 0}</p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {milestones.length > 0 ? (
                milestones.map((milestone) => (
                  <span
                    key={milestone.title}
                    className="inline-flex items-center rounded-full border border-accent/30 bg-accent-bg px-3 py-1 text-xs font-semibold text-accent"
                    title={milestone.detail}
                  >
                    {milestone.title}
                  </span>
                ))
              ) : (
                <p className="text-sm text-muted">
                  पहला अध्ययन-खंड पूर्ण करते ही उपलब्धि-मुद्राएँ दिखाई देंगी।
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-accent/20 bg-accent-bg/40 p-5">
            <h2 className="font-serif-deva text-lg font-bold text-foreground mb-3">पाठ्यक्रम प्रमाणपत्र</h2>
            {mounted && certificateIssuedAt ? (
              <>
                <div className="rounded-2xl border border-accent/30 bg-background/80 p-5 text-center">
                  <p className="text-xs font-semibold tracking-[0.2em] text-primary mb-2">अध्ययन प्रमाणपत्र</p>
                  <p className="font-serif-deva text-2xl font-bold text-foreground mb-2">{learnerName}</p>
                  <p className="text-sm text-muted leading-relaxed">
                    ने {course.title} का मार्गदर्शित अध्ययन पूर्ण किया।
                  </p>
                  <p className="mt-3 text-xs text-muted-light">
                    पूर्णता तिथि: {new Date(certificateIssuedAt).toLocaleDateString('hi-IN')}
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="mt-4 w-full rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
                >
                  प्रमाणपत्र मुद्रित करें
                </button>
                <button
                  onClick={() => {
                    const canvas = document.createElement('canvas');
                    canvas.width = 1200;
                    canvas.height = 800;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return;
                    ctx.fillStyle = '#FFFDF5';
                    ctx.fillRect(0, 0, 1200, 800);
                    ctx.strokeStyle = '#D97706';
                    ctx.lineWidth = 6;
                    ctx.strokeRect(30, 30, 1140, 740);
                    ctx.strokeRect(40, 40, 1120, 720);
                    ctx.fillStyle = '#92400E';
                    ctx.font = '20px sans-serif';
                    ctx.textAlign = 'center';
                    ctx.fillText('अध्ययन प्रमाणपत्र', 600, 120);
                    ctx.fillStyle = '#1F2937';
                    ctx.font = 'bold 44px serif';
                    ctx.fillText(learnerName || 'अध्येता', 600, 300);
                    ctx.fillStyle = '#4B5563';
                    ctx.font = '22px sans-serif';
                    ctx.fillText(`ने ${course.title} का मार्गदर्शित अध्ययन पूर्ण किया।`, 600, 400);
                    ctx.fillStyle = '#9CA3AF';
                    ctx.font = '16px sans-serif';
                    ctx.fillText(`पूर्णता तिथि: ${new Date(certificateIssuedAt).toLocaleDateString('hi-IN')}`, 600, 500);
                    ctx.fillText('धर्म ग्रंथ — सनातन धर्म का डिजिटल अध्ययन', 600, 700);
                    const link = document.createElement('a');
                    link.download = `प्रमाणपत्र-${course.bookSlug}.png`;
                    link.href = canvas.toDataURL('image/png');
                    link.click();
                  }}
                  className="mt-2 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card-hover"
                >
                  प्रमाणपत्र डाउनलोड करें (PNG)
                </button>
              </>
            ) : (
              <p className="text-sm text-foreground/85 leading-relaxed">
                सभी {modules.length} अध्ययन-खंड पूर्ण होते ही यह पाठ्यक्रम प्रमाणपत्र सक्रिय हो जाएगा। प्रमाणपत्र पर वही नाम दिखेगा जिसे आपने अध्ययन संग्रह में सहेजा है।
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="mb-10">
        <LearningArchivePanel title="अध्ययन संग्रह और समकालिकरण" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {modules.map((module) => {
          const isCompleted = completedSet.has(module.slug);

          return (
            <article
              key={module.slug}
              className={`rounded-2xl border bg-card p-6 transition-colors ${
                isCompleted ? 'border-accent/40 shadow-sm' : 'border-border'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="inline-flex items-center rounded-full bg-accent-bg px-3 py-1 text-xs font-semibold text-accent">
                  अध्याय {module.order}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted">
                    अनुमानित पाठ: {module.startVerseNumber}-{module.endVerseNumber}
                  </span>
                  {mounted && (
                    <button
                      onClick={() => toggleModuleCompletion(module.slug)}
                      className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                        isCompleted
                          ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300'
                          : 'bg-background text-muted hover:bg-accent-bg hover:text-accent'
                      }`}
                    >
                      {isCompleted ? '✓ पूर्ण' : 'पूर्ण चिह्नित करें'}
                    </button>
                  )}
                </div>
              </div>

              <h2 className="mt-4 font-serif-deva text-2xl font-bold text-foreground">{module.title}</h2>
              <p className="mt-2 text-sm font-medium text-primary">{module.summary}</p>

              <div className="mt-4 rounded-xl border border-border bg-background/60 p-4">
                <p className="text-xs font-semibold text-primary mb-1">अध्याय सार</p>
                <p className="text-sm text-foreground/85 leading-relaxed">{module.headerSummary}</p>
              </div>

              <div className="mt-4 rounded-xl border border-border bg-background/60 p-4">
                <p className="text-xs font-semibold text-primary mb-1">मनन प्रश्न</p>
                <p className="text-sm text-foreground/85 leading-relaxed">{module.reflection}</p>
              </div>

              <div className="mt-4 rounded-xl border border-border bg-background/60 p-4">
                <p className="text-xs font-semibold text-primary mb-1">आज का अभ्यास</p>
                <p className="text-sm text-foreground/85 leading-relaxed">{module.practice}</p>
              </div>

              <div className="mt-4 rounded-xl border border-border bg-background/60 p-4">
                <div className="flex items-center justify-between gap-4 mb-2">
                  <p className="text-xs font-semibold text-primary">अध्ययन जर्नल</p>
                  {moduleNotes[module.slug]?.trim() && (
                    <span className="text-xs text-muted-light">नोट उपलब्ध</span>
                  )}
                </div>
                <textarea
                  value={moduleNotes[module.slug] || ''}
                  onChange={(event) => {
                    setModuleNotes((current) => ({
                      ...current,
                      [module.slug]: event.target.value,
                    }));
                    setNoteStatus((current) => ({ ...current, [module.slug]: '' }));
                  }}
                  placeholder="इस अध्ययन-खंड से मिली सीख, प्रश्न, अनुभव या अभ्यास-प्रतिबद्धता लिखें..."
                  className="min-h-32 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition-colors focus:border-accent"
                />
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-muted-light">
                    यह नोट अध्ययन संग्रह में सुरक्षित रहेगा और निर्यात करने पर साथ जाएगा।
                  </p>
                  <button
                    onClick={() => saveModuleJournal(module.slug)}
                    className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
                  >
                    जर्नल सहेजें
                  </button>
                </div>
                {noteStatus[module.slug] && (
                  <p className="mt-2 text-sm text-primary">{noteStatus[module.slug]}</p>
                )}
              </div>

              {module.anchorVerse && (
                <div className="mt-4 rounded-xl border border-accent/20 bg-accent-bg/30 p-4">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <p className="text-xs font-semibold text-primary">आधार श्लोक</p>
                    <span className="text-xs text-muted">श्लोक {module.anchorVerse.verse_number}</span>
                  </div>
                  <p className="font-scripture text-sm text-foreground whitespace-pre-wrap line-clamp-4">
                    {module.anchorVerse.original_text}
                  </p>
                  {module.anchorInterpretation && (
                    <p className="mt-3 text-sm text-muted line-clamp-4">
                      {module.anchorInterpretation.bhavarth}
                    </p>
                  )}
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={`/categories/${book.category_slug}/${book.slug}?page=${module.estimatedPage}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/70 px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-card-hover transition-colors"
                >
                  📚 इस खंड का पाठ पढ़ें
                </Link>
                {module.anchorVerse && (
                  <Link
                    href={`/categories/${book.category_slug}/${book.slug}/${module.anchorVerse.id}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent/90 transition-colors"
                  >
                    ✨ आधार श्लोक की व्याख्या
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}