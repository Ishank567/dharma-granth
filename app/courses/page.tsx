import Link from 'next/link';
import type { Metadata } from 'next';
import LearningArchivePanel from '@/app/components/LearningArchivePanel';
import { getBookBySlug } from '@/app/lib/content';
import { getAllGuidedCourseDefinitions } from '@/app/lib/guidedCourses';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'अध्ययन पथ — धर्म ग्रंथ',
  description: 'गीता, प्रमुख उपनिषद और रामचरितमानस के अध्यायवार मार्गदर्शित अध्ययन पथ',
};

export default function GuidedCoursesPage() {
  const courses = getAllGuidedCourseDefinitions().filter((course) => getBookBySlug(course.bookSlug));
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted">
        <Link href="/" className="hover:text-accent transition-colors">मुख्य पृष्ठ</Link>
        <span className="mx-2">›</span>
        <span className="text-foreground">अध्ययन पथ</span>
      </nav>

      <section className="rounded-[2rem] border border-border bg-card p-8 md:p-10 mb-10">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold tracking-wide text-accent mb-3">🧭 मार्गदर्शित अध्ययन</p>
          <h1 className="font-serif-deva text-4xl font-bold text-foreground mb-4">
            अध्यायवार अध्ययन पथ
          </h1>
          <p className="text-muted leading-relaxed text-lg">
            गीता, प्रमुख उपनिषद और श्री रामचरितमानस के लिए ऐसे अध्ययन पथ, जिनमें हर अध्याय के साथ विषय, मनन-प्रश्न, अभ्यास और आधार श्लोक जोड़े गए हैं।
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-border bg-background/70 p-5">
            <p className="text-2xl mb-3">📚</p>
            <h2 className="font-semibold text-foreground mb-2">अध्याय क्रम</h2>
            <p className="text-sm text-muted">हर ग्रंथ को उसके मुख्य अध्यायों या परम्परागत खंडों के अनुसार अध्ययन-इकाइयों में रखा गया है।</p>
          </div>
          <div className="rounded-2xl border border-border bg-background/70 p-5">
            <p className="text-2xl mb-3">🧠</p>
            <h2 className="font-semibold text-foreground mb-2">मनन और तर्क</h2>
            <p className="text-sm text-muted">हर इकाई में चिंतन-प्रश्न और अभ्यास दिए गए हैं, ताकि अध्ययन अनुभव और विवेक से जुड़ सके।</p>
          </div>
          <div className="rounded-2xl border border-border bg-background/70 p-5">
            <p className="text-2xl mb-3">✨</p>
            <h2 className="font-semibold text-foreground mb-2">आधार श्लोक</h2>
            <p className="text-sm text-muted">प्रत्येक अध्ययन-खंड एक आधार श्लोक से जुड़ता है, जिसकी गहन व्याख्या अलग से खोली जा सकती है।</p>
          </div>
        </div>
      </section>

      <div className="mb-10">
        <LearningArchivePanel />
      </div>

      {courses.length === 0 && (
        <div className="mb-10 rounded-2xl border border-border bg-card p-6 text-sm text-muted">
          वर्तमान PDF संग्रह में अभी कोई ऐसा ग्रंथ नहीं मिला जिसके लिए मार्गदर्शित अध्ययन पथ उपलब्ध हो।
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <Link
            key={course.bookSlug}
            href={`/courses/${course.bookSlug}`}
            className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-accent/30 hover:shadow-lg hover:bg-card-hover"
          >
            <div className="flex items-center justify-between gap-4">
              <span className="inline-flex items-center rounded-full bg-accent-bg px-3 py-1 text-xs font-semibold text-accent">
                {course.tradition}
              </span>
              <span className="text-xs text-muted">{course.modules.length} अध्ययन-खंड</span>
            </div>
            <h2 className="mt-4 font-serif-deva text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
              {course.title}
            </h2>
            <p className="mt-2 text-sm text-muted-light">{course.subtitle}</p>
            <p className="mt-4 text-sm text-muted leading-relaxed">{course.summary}</p>
            <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent">
              पाठ्यक्रम खोलें <span>→</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}