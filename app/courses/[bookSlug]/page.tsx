import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import GuidedCourseDetailClient from '@/app/components/GuidedCourseDetailClient';
import {
  getBookBySlug,
  getVerseByBookAndNumber,
  getInterpretationForVerse,
} from '@/app/lib/content';
import {
  getAllGuidedCourseDefinitions,
  getGuidedCourseDefinition,
  resolveGuidedCourse,
} from '@/app/lib/guidedCourses';
import type { Interpretation } from '@/app/lib/types';

export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  return getAllGuidedCourseDefinitions()
    .filter((c) => getBookBySlug(c.bookSlug))
    .map((c) => ({ bookSlug: c.bookSlug }));
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

  const book = getBookBySlug(bookSlug);
  if (!book) {
    notFound();
  }

  const totalVerses = book.verse_count;
  const course = resolveGuidedCourse(courseDefinition, totalVerses);

  const modules = course.modules.map((module) => {
    const anchorVerse = getVerseByBookAndNumber(bookSlug, module.anchorVerseNumber);
    const rawInterp = anchorVerse ? getInterpretationForVerse(bookSlug, anchorVerse.id) : null;
    const anchorInterpretation: Interpretation | undefined = rawInterp
      ? {
          id: rawInterp.id,
          verse_id: rawInterp.verse_id,
          shabdarth: rawInterp.shabdarth ?? '',
          bhavarth: rawInterp.bhavarth ?? '',
          simple_example: rawInterp.simple_example ?? '',
          guided_learning: rawInterp.guided_learning ?? '',
          scientific_temperament: rawInterp.scientific_temperament ?? '',
          modern_relevance: rawInterp.modern_relevance ?? '',
          next_curiosity: rawInterp.next_curiosity ?? '',
          source: (rawInterp.source as Interpretation['source']) || 'ai',
          created_at: rawInterp.created_at ?? '',
        }
      : undefined;

    return {
      ...module,
      anchorVerse: anchorVerse ?? undefined,
      anchorInterpretation,
    };
  });

  return <GuidedCourseDetailClient book={book} course={course} modules={modules} />;
}