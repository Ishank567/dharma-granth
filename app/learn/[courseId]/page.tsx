import { clipDescription } from '@/lib/meta-text';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLearningPath, learningPaths } from '@/data/learning-paths';
import { JsonLd } from '@/app/components/JsonLd';
import { courseLd, pageLd } from '@/lib/jsonld';
import { CoursePageClient } from './CoursePageClient';

interface PageProps {
  params: {
    courseId: string;
  };
}

export function generateStaticParams() {
  return learningPaths.map((path) => ({
    courseId: path.id,
  }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const course = getLearningPath(params.courseId);
  if (!course) {
    return {
      title: 'Course Not Found',
    };
  }

  return {
    title: `${course.title} — Learning Hub`,
    description: clipDescription(course.learningObjective),
    alternates: {
      canonical: `/learn/${course.id}`,
    },
  };
}

export default function CoursePage({ params }: PageProps) {
  const course = getLearningPath(params.courseId);

  if (!course) {
    notFound();
  }

  const path = `/learn/${course.id}`;
  return (
    <>
      <JsonLd
        data={pageLd(
          [
            { name: 'Learn', path: '/learn' },
            { name: course.title, path },
          ],
          courseLd({
            path,
            name: `${course.title} (${course.titleSanskrit})`,
            description: course.learningObjective,
            level: course.difficulty,
            minutes: course.estimatedMinutes,
            outcomes: course.overview.learningOutcomes,
            prerequisites: course.overview.prerequisites,
            lessons: course.lessons.map((l) => ({ title: l.title, description: l.description, minutes: l.estimatedMinutes })),
          }),
        )}
      />
      <CoursePageClient course={course} />
    </>
  );
}
