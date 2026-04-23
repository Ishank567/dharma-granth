import type { Speaker } from '@/app/lib/gitaContext';
import { getSpeakerMeta } from '@/app/lib/gitaContext';

const TONE_CLASSES: Record<Speaker, string> = {
  krishna: 'border-amber-500/40 bg-amber-50 text-amber-900 dark:bg-amber-950/40 dark:text-amber-200',
  arjuna: 'border-emerald-500/40 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200',
  sanjaya: 'border-sky-500/40 bg-sky-50 text-sky-900 dark:bg-sky-950/40 dark:text-sky-200',
  dhritarashtra: 'border-stone-500/40 bg-stone-100 text-stone-800 dark:bg-stone-800/50 dark:text-stone-200',
};

export default function SpeakerBadge({ speaker }: { speaker: Speaker }) {
  const meta = getSpeakerMeta(speaker);
  return (
    <div
      role="note"
      aria-label={`वक्ता: ${meta.hindi}`}
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium ${TONE_CLASSES[speaker]}`}
    >
      <span aria-hidden="true" className="text-sm leading-none">{meta.emoji}</span>
      <span className="font-serif-deva">
        <span className="font-semibold">{meta.hindi}</span>
        <span className="mx-1 opacity-60">·</span>
        <span className="opacity-80">{meta.roleHindi}</span>
      </span>
    </div>
  );
}
