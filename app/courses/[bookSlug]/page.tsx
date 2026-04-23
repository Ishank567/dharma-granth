import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import GuidedCourseDetailClient from '@/app/components/GuidedCourseDetailClient';
import {
  getBookBySlug,
  getInterpretation,
  getTotalVerseCount,
  getVerseByBookAndNumber,
} from '@/app/lib/db';
import {
  getGuidedCourseDefinition,
  resolveGuidedCourse,
} from '@/app/lib/guidedCourses';
import type { Book, Interpretation, Verse } from '@/app/lib/types';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  // For demo, return sample book slugs
  return [
    { bookSlug: 'gita' },
    { bookSlug: 'ramcharitmanas' }
  ];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ bookSlug: string }>;
}): Promise<Metadata> {
  const { bookSlug } = await params;
  const course = getGuidedCourseDefinition(bookSlug);
  if (!course) {
    return { title: 'अध्ययन पथ — धर्म ग्रंथ' };
  }

  return {
    title: `${course.title} — धर्म ग्रंथ`,
    description: course.summary,
  };
}

export default async function GuidedCourseDetailPage({
  params,
}: {
  params: Promise<{ bookSlug: string }>;
}) {
  const { bookSlug } = await params;
  const courseDefinition = getGuidedCourseDefinition(bookSlug);
  if (!courseDefinition) {
    notFound();
  }

  const book = getBookBySlug(bookSlug) as Book | undefined;
  if (!book) {
    notFound();
  }

  const totalVerses = getTotalVerseCount(book.id);
  const course = resolveGuidedCourse(courseDefinition, totalVerses);

  const modules = course.modules.map((module) => {
    const anchorVerse = getVerseByBookAndNumber(book.id, module.anchorVerseNumber) as Verse | undefined;
    const anchorInterpretation = anchorVerse
      ? (getInterpretation(anchorVerse.id) as Interpretation | undefined)
      : undefined;

    return {
      ...module,
      anchorVerse,
      anchorInterpretation,
    };
  });

  return <GuidedCourseDetailClient book={book} course={course} modules={modules} />;
}