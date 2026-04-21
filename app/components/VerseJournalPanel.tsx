'use client';

import { useEffect, useState } from 'react';
import {
  getVerseNote,
  LEARNING_DATA_UPDATED_EVENT,
  readLearningData,
  setVerseNote,
} from '@/app/lib/learningStorage';

interface Props {
  verseId: number;
  bookSlug: string;
  categorySlug: string;
  bookTitle: string;
  verseNumber: number;
}

export default function VerseJournalPanel({
  verseId,
  bookSlug,
  categorySlug,
  bookTitle,
  verseNumber,
}: Props) {
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('');
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    const refresh = () => {
      const entry = getVerseNote(verseId, readLearningData());
      setNote(entry?.note || '');
      setUpdatedAt(entry?.updatedAt || null);
    };

    refresh();
    window.addEventListener(LEARNING_DATA_UPDATED_EVENT, refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener(LEARNING_DATA_UPDATED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [verseId]);

  const saveNote = () => {
    setVerseNote({
      verseId,
      bookSlug,
      categorySlug,
      bookTitle,
      verseNumber,
      note,
      updatedAt: new Date().toISOString(),
    });
    setStatus(note.trim() ? 'श्लोक-डायरी सहेज ली गई।' : 'श्लोक-डायरी रिक्त कर दी गई।');
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-serif-deva text-xl font-bold text-foreground mb-2">मेरी श्लोक-डायरी</h2>
          <p className="text-sm text-muted leading-relaxed">
            इस श्लोक ने भीतर क्या छुआ, कौन-सा प्रश्न उठाया, और आप इसे जीवन में कैसे उतारना चाहते हैं, उसे यहाँ लिखें।
          </p>
        </div>
        {updatedAt && (
          <p className="text-xs text-muted-light">
            अंतिम संशोधन: {new Date(updatedAt).toLocaleString('hi-IN')}
          </p>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-border bg-background/60 p-4">
        <p className="text-xs font-semibold text-primary mb-2">लेखन संकेत</p>
        <p className="text-sm text-foreground/85 leading-relaxed">
          यह श्लोक मेरी किसी आदत, भय, निर्णय या साधना को कैसे देखना सिखा रहा है?
        </p>
      </div>

      <textarea
        value={note}
        onChange={(event) => {
          setNote(event.target.value);
          setStatus('');
        }}
        placeholder="आज का मनन, प्रश्न, अनुभव या संकल्प यहाँ लिखें..."
        className="mt-4 min-h-40 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-relaxed text-foreground outline-none transition-colors focus:border-accent"
      />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted-light">
          यह नोट स्थानीय रूप से सहेजा जाता है और अध्ययन संग्रह निर्यात करने पर साथ जाएगा।
        </p>
        <button
          onClick={saveNote}
          className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
        >
          श्लोक-डायरी सहेजें
        </button>
      </div>

      {status && (
        <p className="mt-3 text-sm text-primary">{status}</p>
      )}
    </section>
  );
}