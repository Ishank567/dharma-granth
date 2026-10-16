'use client';

import { useEffect } from 'react';
import { Certificate } from '@/app/components/Certificate';
import { useLocalStorage } from '@/lib/useLocalStorage';

/**
 * Shown only after every lesson of one course is marked.
 * The name and date stay in this browser. This is not a rank.
 */
export function CourseCertificate({
  courseId,
  title,
  titleSanskrit,
  completedAt,
}: {
  courseId: string;
  title: string;
  titleSanskrit?: string;
  completedAt?: string;
}) {
  const [name, setName] = useLocalStorage<string>('dharma.certificate.name', '');
  const [storedWhen, setStoredWhen] = useLocalStorage<string>(`dharma.certificate.when.${courseId}`, '');

  useEffect(() => {
    if (completedAt) return;
    const key = `dharma.certificate.when.${courseId}`;
    try {
      if (window.localStorage.getItem(key)) return;
      const iso = new Date().toISOString();
      window.localStorage.setItem(key, JSON.stringify(iso));
      setStoredWhen(iso);
    } catch {
      /* this browser blocked storage */
    }
  }, [completedAt, courseId, setStoredWhen]);

  const when = completedAt || storedWhen;
  if (!when) return null;

  return (
    <section aria-labelledby="cert-h" className="mx-auto max-w-6xl px-6 py-8">
      <h2 id="cert-h" className="font-serif text-2xl font-bold text-dharma-text">
        <span lang="hi" className="font-devanagari">पूरा होने का पत्र</span>
      </h2>
      <p lang="hi" className="mt-2 text-sm leading-relaxed text-dharma-text">
        यह पत्र इसी ब्राउज़र में रखा गया है। यह पद या सार्वजनिक अंक नहीं है।
      </p>
      <label className="mt-4 block text-sm font-semibold text-dharma-text">
        <span lang="hi" className="font-devanagari">नाम</span>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="mt-1 block min-h-[44px] w-full max-w-sm rounded-xl border border-dharma-border bg-dharma-bg px-3 text-dharma-text"
          autoComplete="name"
        />
      </label>
      <div className="mt-4">
        <Certificate
          pathwayTitle={title}
          pathwayTitleSanskrit={titleSanskrit}
          studentName={name.trim() || 'अध्ययनकर्ता'}
          completedDate={when}
          certificateId={`DG-${courseId}`}
        />
      </div>
    </section>
  );
}
