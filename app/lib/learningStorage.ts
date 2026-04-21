export const LEARNING_STORAGE_KEY = 'dharma-learning-data';
const LEGACY_PROGRESS_KEY = 'dharma-course-progress';
export const LEARNING_DATA_UPDATED_EVENT = 'dharma-learning-data-updated';

export interface CourseProgressRecord {
  completedModules: string[];
  certificateIssuedAt?: string;
  updatedAt?: string;
}

export interface VerseNoteRecord {
  verseId: number;
  bookSlug: string;
  categorySlug: string;
  bookTitle: string;
  verseNumber: number;
  note: string;
  updatedAt: string;
}

export interface LearningActivity {
  timestamp: string;
  dayKey: string;
  type:
    | 'module-complete'
    | 'module-reset'
    | 'module-note'
    | 'verse-note'
    | 'certificate'
    | 'import'
    | 'export';
  courseBookSlug?: string;
  moduleSlug?: string;
  verseId?: number;
}

export interface LearningData {
  version: 1;
  learnerName: string;
  courseProgress: Record<string, CourseProgressRecord>;
  moduleNotes: Record<string, string>;
  verseNotes: Record<string, VerseNoteRecord>;
  activityLog: LearningActivity[];
  lastExportedAt?: string;
  lastImportedAt?: string;
}

export interface LearningSummary {
  learnerName: string;
  startedCourses: number;
  completedCourses: number;
  moduleNotes: number;
  verseNotes: number;
  activeDays: number;
  currentStreak: number;
  longestStreak: number;
}

export interface CourseLearningSummary {
  completedCount: number;
  progressPercent: number;
  certificateIssuedAt?: string;
  currentStreak: number;
  longestStreak: number;
  activeDays: number;
}

function createDefaultLearningData(): LearningData {
  return {
    version: 1,
    learnerName: '',
    courseProgress: {},
    moduleNotes: {},
    verseNotes: {},
    activityLog: [],
  };
}

function isBrowser() {
  return typeof window !== 'undefined';
}

function dayKeyFromTimestamp(timestamp: string) {
  return timestamp.slice(0, 10);
}

function unique<T>(items: T[]) {
  return [...new Set(items)];
}

function sortDayKeys(dayKeys: string[]) {
  return [...dayKeys].sort((left, right) => right.localeCompare(left));
}

function normalizeLearningData(input: unknown): LearningData {
  const defaults = createDefaultLearningData();

  if (!input || typeof input !== 'object') {
    return defaults;
  }

  const value = input as Partial<LearningData>;
  const learnerName = typeof value.learnerName === 'string' ? value.learnerName : '';
  const courseProgressEntries = Object.entries(value.courseProgress || {}).map(([bookSlug, progress]) => {
    const record = progress as Partial<CourseProgressRecord> | undefined;
    return [
      bookSlug,
      {
        completedModules: unique(Array.isArray(record?.completedModules) ? record!.completedModules.filter((item): item is string => typeof item === 'string') : []),
        certificateIssuedAt: typeof record?.certificateIssuedAt === 'string' ? record.certificateIssuedAt : undefined,
        updatedAt: typeof record?.updatedAt === 'string' ? record.updatedAt : undefined,
      },
    ] as const;
  });

  const verseNotesEntries = Object.entries(value.verseNotes || {}).map(([key, note]) => {
    const record = note as Partial<VerseNoteRecord> | undefined;
    return [
      key,
      {
        verseId: typeof record?.verseId === 'number' ? record.verseId : 0,
        bookSlug: typeof record?.bookSlug === 'string' ? record.bookSlug : '',
        categorySlug: typeof record?.categorySlug === 'string' ? record.categorySlug : '',
        bookTitle: typeof record?.bookTitle === 'string' ? record.bookTitle : '',
        verseNumber: typeof record?.verseNumber === 'number' ? record.verseNumber : 0,
        note: typeof record?.note === 'string' ? record.note : '',
        updatedAt: typeof record?.updatedAt === 'string' ? record.updatedAt : new Date().toISOString(),
      },
    ] as const;
  }).filter(([, note]) => note.verseId > 0 && note.note.trim().length > 0);

  const activityLog = Array.isArray(value.activityLog)
    ? value.activityLog
        .map((item) => item as Partial<LearningActivity>)
        .filter((item) => typeof item.timestamp === 'string' && typeof item.type === 'string')
        .map((item) => ({
          timestamp: item.timestamp!,
          dayKey: typeof item.dayKey === 'string' ? item.dayKey : dayKeyFromTimestamp(item.timestamp!),
          type: item.type as LearningActivity['type'],
          courseBookSlug: typeof item.courseBookSlug === 'string' ? item.courseBookSlug : undefined,
          moduleSlug: typeof item.moduleSlug === 'string' ? item.moduleSlug : undefined,
          verseId: typeof item.verseId === 'number' ? item.verseId : undefined,
        }))
    : [];

  return {
    version: 1,
    learnerName,
    courseProgress: Object.fromEntries(courseProgressEntries),
    moduleNotes: Object.fromEntries(
      Object.entries(value.moduleNotes || {}).filter(([, note]) => typeof note === 'string')
    ),
    verseNotes: Object.fromEntries(verseNotesEntries),
    activityLog,
    lastExportedAt: typeof value.lastExportedAt === 'string' ? value.lastExportedAt : undefined,
    lastImportedAt: typeof value.lastImportedAt === 'string' ? value.lastImportedAt : undefined,
  };
}

function migrateLegacyProgress(data: LearningData) {
  if (!isBrowser()) {
    return data;
  }

  const legacyRaw = window.localStorage.getItem(LEGACY_PROGRESS_KEY);
  if (!legacyRaw) {
    return data;
  }

  try {
    const parsed = JSON.parse(legacyRaw) as Record<string, string[]>;
    for (const [bookSlug, completedModules] of Object.entries(parsed)) {
      if (!Array.isArray(completedModules)) {
        continue;
      }

      const existing = data.courseProgress[bookSlug] || { completedModules: [] };
      data.courseProgress[bookSlug] = {
        ...existing,
        completedModules: unique([...existing.completedModules, ...completedModules.filter((item): item is string => typeof item === 'string')]),
      };
    }
  } catch {
    return data;
  }

  return data;
}

function dispatchLearningUpdate() {
  if (!isBrowser()) {
    return;
  }
  window.dispatchEvent(new Event(LEARNING_DATA_UPDATED_EVENT));
}

function writeLearningData(data: LearningData) {
  if (!isBrowser()) {
    return data;
  }

  window.localStorage.setItem(LEARNING_STORAGE_KEY, JSON.stringify(data));
  window.localStorage.removeItem(LEGACY_PROGRESS_KEY);
  dispatchLearningUpdate();
  return data;
}

export function readLearningData(): LearningData {
  if (!isBrowser()) {
    return createDefaultLearningData();
  }

  const raw = window.localStorage.getItem(LEARNING_STORAGE_KEY);
  let parsed: unknown;

  try {
    parsed = raw ? JSON.parse(raw) : undefined;
  } catch {
    parsed = undefined;
  }

  const normalized = migrateLegacyProgress(normalizeLearningData(parsed));

  if (!raw) {
    writeLearningData(normalized);
  }

  return normalized;
}

function appendActivity(data: LearningData, activity: Omit<LearningActivity, 'timestamp' | 'dayKey'>) {
  const timestamp = new Date().toISOString();
  data.activityLog.push({
    ...activity,
    timestamp,
    dayKey: dayKeyFromTimestamp(timestamp),
  });

  if (data.activityLog.length > 1000) {
    data.activityLog = data.activityLog.slice(-1000);
  }
}

export function moduleNoteKey(bookSlug: string, moduleSlug: string) {
  return `${bookSlug}::${moduleSlug}`;
}

export function getVerseNoteKey(verseId: number) {
  return `${verseId}`;
}

export function setLearnerName(name: string) {
  const data = readLearningData();
  data.learnerName = name.trim();
  return writeLearningData(data);
}

export function toggleCourseModuleCompletion(bookSlug: string, moduleSlug: string, totalModules: number) {
  const data = readLearningData();
  const existing = data.courseProgress[bookSlug] || { completedModules: [] };
  const completedModules = new Set(existing.completedModules);

  if (completedModules.has(moduleSlug)) {
    completedModules.delete(moduleSlug);
  } else {
    completedModules.add(moduleSlug);
    appendActivity(data, { type: 'module-complete', courseBookSlug: bookSlug, moduleSlug });
  }

  const updatedModules = [...completedModules];
  const nextRecord: CourseProgressRecord = {
    completedModules: updatedModules,
    updatedAt: new Date().toISOString(),
  };

  if (updatedModules.length === totalModules) {
    nextRecord.certificateIssuedAt = existing.certificateIssuedAt || new Date().toISOString();
    if (!existing.certificateIssuedAt) {
      appendActivity(data, { type: 'certificate', courseBookSlug: bookSlug });
    }
  }

  data.courseProgress[bookSlug] = nextRecord;
  return writeLearningData(data);
}

export function clearCourseProgress(bookSlug: string) {
  const data = readLearningData();
  delete data.courseProgress[bookSlug];
  appendActivity(data, { type: 'module-reset', courseBookSlug: bookSlug });
  return writeLearningData(data);
}

export function setModuleNote(bookSlug: string, moduleSlug: string, note: string) {
  const data = readLearningData();
  const key = moduleNoteKey(bookSlug, moduleSlug);
  const trimmed = note.trim();

  if (trimmed) {
    data.moduleNotes[key] = note;
    appendActivity(data, { type: 'module-note', courseBookSlug: bookSlug, moduleSlug });
  } else {
    delete data.moduleNotes[key];
  }

  return writeLearningData(data);
}

export function getModuleNote(bookSlug: string, moduleSlug: string, data = readLearningData()) {
  return data.moduleNotes[moduleNoteKey(bookSlug, moduleSlug)] || '';
}

export function setVerseNote(noteRecord: VerseNoteRecord) {
  const data = readLearningData();
  const key = getVerseNoteKey(noteRecord.verseId);
  const trimmed = noteRecord.note.trim();

  if (trimmed) {
    data.verseNotes[key] = {
      ...noteRecord,
      note: noteRecord.note,
      updatedAt: new Date().toISOString(),
    };
    appendActivity(data, {
      type: 'verse-note',
      courseBookSlug: noteRecord.bookSlug,
      verseId: noteRecord.verseId,
    });
  } else {
    delete data.verseNotes[key];
  }

  return writeLearningData(data);
}

export function getVerseNote(verseId: number, data = readLearningData()) {
  return data.verseNotes[getVerseNoteKey(verseId)] || null;
}

function calculateStreaks(dayKeys: string[]) {
  const sorted = sortDayKeys(unique(dayKeys));
  if (sorted.length === 0) {
    return { currentStreak: 0, longestStreak: 0, activeDays: 0 };
  }

  const asDates = sorted.map((dayKey) => new Date(`${dayKey}T00:00:00`));
  let longestStreak = 1;
  let runningStreak = 1;

  for (let index = 1; index < asDates.length; index += 1) {
    const diffInDays = Math.round((asDates[index - 1].getTime() - asDates[index].getTime()) / 86_400_000);
    if (diffInDays === 1) {
      runningStreak += 1;
      longestStreak = Math.max(longestStreak, runningStreak);
    } else {
      runningStreak = 1;
    }
  }

  let currentStreak = 1;
  for (let index = 1; index < asDates.length; index += 1) {
    const diffInDays = Math.round((asDates[index - 1].getTime() - asDates[index].getTime()) / 86_400_000);
    if (diffInDays === 1) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  return {
    currentStreak,
    longestStreak,
    activeDays: sorted.length,
  };
}

export function getLearningSummary(data = readLearningData()): LearningSummary {
  const completedCourses = Object.values(data.courseProgress).filter((progress) => !!progress.certificateIssuedAt).length;
  const dayKeys = data.activityLog.map((activity) => activity.dayKey);
  const streaks = calculateStreaks(dayKeys);

  return {
    learnerName: data.learnerName,
    startedCourses: Object.keys(data.courseProgress).length,
    completedCourses,
    moduleNotes: Object.keys(data.moduleNotes).length,
    verseNotes: Object.keys(data.verseNotes).length,
    ...streaks,
  };
}

export function getCourseLearningSummary(bookSlug: string, totalModules: number, data = readLearningData()): CourseLearningSummary {
  const record = data.courseProgress[bookSlug] || { completedModules: [] };
  const dayKeys = data.activityLog
    .filter((activity) => activity.courseBookSlug === bookSlug)
    .map((activity) => activity.dayKey);
  const streaks = calculateStreaks(dayKeys);
  const completedCount = record.completedModules.length;

  return {
    completedCount,
    progressPercent: totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0,
    certificateIssuedAt: record.certificateIssuedAt,
    ...streaks,
  };
}

export function getCourseMilestones(completedCount: number, totalModules: number, currentStreak: number) {
  const checkpoints = [
    { title: 'आरम्भ', reached: completedCount >= 1, detail: 'पहला अध्ययन-खंड पूरा किया' },
    { title: 'मनन-पथ', reached: completedCount >= Math.max(2, Math.ceil(totalModules / 3)), detail: 'नियमित अध्ययन की लय बनी' },
    { title: 'अभ्यास-दीक्षा', reached: completedCount >= Math.max(3, Math.ceil(totalModules / 2)), detail: 'अध्ययन को आचरण से जोड़ा' },
    { title: '३-दिवसीय क्रम', reached: currentStreak >= 3, detail: 'लगातार तीन अध्ययन-दिवस' },
    { title: '७-दिवसीय साधना', reached: currentStreak >= 7, detail: 'सात दिन की निरंतरता' },
    { title: 'पाठ्यक्रम पूर्ण', reached: totalModules > 0 && completedCount >= totalModules, detail: 'सभी अध्ययन-खंड पूर्ण' },
  ];

  return checkpoints.filter((item) => item.reached);
}

function mergeActivityLogs(current: LearningActivity[], incoming: LearningActivity[]) {
  const map = new Map<string, LearningActivity>();
  for (const activity of [...current, ...incoming]) {
    const key = `${activity.timestamp}:${activity.type}:${activity.courseBookSlug || ''}:${activity.moduleSlug || ''}:${activity.verseId || ''}`;
    map.set(key, activity);
  }
  return [...map.values()].sort((left, right) => left.timestamp.localeCompare(right.timestamp)).slice(-1000);
}

function mergeLearningData(current: LearningData, incoming: LearningData): LearningData {
  const merged: LearningData = {
    version: 1,
    learnerName: incoming.learnerName || current.learnerName,
    courseProgress: { ...current.courseProgress },
    moduleNotes: { ...current.moduleNotes, ...incoming.moduleNotes },
    verseNotes: { ...current.verseNotes },
    activityLog: mergeActivityLogs(current.activityLog, incoming.activityLog),
    lastExportedAt: current.lastExportedAt,
    lastImportedAt: new Date().toISOString(),
  };

  for (const [bookSlug, progress] of Object.entries(incoming.courseProgress)) {
    const existing = merged.courseProgress[bookSlug] || { completedModules: [] };
    merged.courseProgress[bookSlug] = {
      completedModules: unique([...existing.completedModules, ...progress.completedModules]),
      certificateIssuedAt: progress.certificateIssuedAt || existing.certificateIssuedAt,
      updatedAt: progress.updatedAt || existing.updatedAt,
    };
  }

  for (const [key, note] of Object.entries(incoming.verseNotes)) {
    const existing = merged.verseNotes[key];
    if (!existing || existing.updatedAt <= note.updatedAt) {
      merged.verseNotes[key] = note;
    }
  }

  return merged;
}

export function exportLearningData() {
  const data = readLearningData();
  data.lastExportedAt = new Date().toISOString();
  appendActivity(data, { type: 'export' });
  writeLearningData(data);
  return JSON.stringify(data, null, 2);
}

export function importLearningData(payload: string) {
  const parsed = normalizeLearningData(JSON.parse(payload));
  const merged = mergeLearningData(readLearningData(), parsed);
  appendActivity(merged, { type: 'import' });
  return writeLearningData(merged);
}