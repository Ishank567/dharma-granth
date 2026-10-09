import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getLearningPath, learningPaths } from '@/data/learning-paths';
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
    title: `${course.title} (${course.titleSanskrit}) — Learning Hub`,
    description: course.learningObjective,
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

  return <CoursePageClient course={course} />;
}
