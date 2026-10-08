import { learningPaths, type LearningPath, type LearningPathLesson } from './learning-paths';

export interface PathwayStep {
  id: string;
  title: string;
  titleSanskrit?: string;
  description: string;
  /** Link to the scripture chapter or external resource */
  href: string;
  /** Estimated reading time in minutes */
  estimatedMinutes: number;
  /** Optional key concepts to focus on */
  focusConcepts?: string[];
}

export interface Pathway {
  id: string;
  title: string;
  titleSanskrit?: string;
  description: string;
  /** Difficulty level */
  level: 'beginner' | 'intermediate' | 'advanced';
  /** Category icon emoji or lucide name */
  icon: string;
  /** Gradient color classes for the card */
  gradient: string;
  /** Ordered list of steps */
  steps: PathwayStep[];
  /** What you'll gain from this pathway */
  learningOutcomes: string[];
}

// Convert LearningPath into Pathway shape for backwards compatibility with any legacy code
function convertToPathway(lp: LearningPath): Pathway {
  return {
    id: lp.id,
    title: lp.title,
    titleSanskrit: lp.titleSanskrit,
    description: lp.learningObjective,
    level: lp.difficulty,
    icon: lp.icon,
    gradient: lp.gradient,
    learningOutcomes: lp.overview.learningOutcomes,
    steps: lp.lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title,
      titleSanskrit: lesson.titleSanskrit,
      description: lesson.description,
      href: `/learn/${lp.id}`,
      estimatedMinutes: lesson.estimatedMinutes,
      focusConcepts: lesson.conceptsCovered,
    })),
  };
}

export const pathways: Pathway[] = learningPaths.map(convertToPathway);

// Alias mapping for old pathway IDs so existing progress / bookmarks remain intact
const ALIASES: Record<string, string> = {
  'beginner-7day': 'beginner',
  'gita-pathway': 'bhagavad-gita',
  'upanishad-pathway': 'upanishads',
  'dharma-pathway': 'beginner',
  'yoga-pathway': 'bhagavad-gita',
  'vedanta-pathway': 'vedanta-foundations',
  'bhakti-pathway': 'bhakti-traditions',
};

export function getPathway(id: string): Pathway | undefined {
  const resolvedId = ALIASES[id] || id;
  return pathways.find((p) => p.id === resolvedId);
}
