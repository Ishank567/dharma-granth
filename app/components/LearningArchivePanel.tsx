'use client';

import { useEffect, useRef, useState } from 'react';
import {
  exportLearningData,
  getLearningSummary,
  importLearningData,
  LEARNING_DATA_UPDATED_EVENT,
  readLearningData,
  setLearnerName,
} from '@/app/lib/learningStorage';

interface Props {
  title?: string;
  description?: string;
}

export default function LearningArchivePanel({
  title = 'अध्ययन संग्रह',
  description = 'अपनी प्रगति, जर्नल नोट्स और पाठ्यक्रम उपलब्धियों को एक फ़ाइल में सहेजें, फिर दूसरे ब्राउज़र या उपकरण में आयात करें।',
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [learnerName, setLearnerNameState] = useState('');
  const [summary, setSummary] = useState({
    learnerName: '',
    startedCourses: 0,
    completedCourses: 0,
    moduleNotes: 0,
    verseNotes: 0,
    activeDays: 0,
    currentStreak: 0,
    longestStreak: 0,
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    const refresh = () => {
      const data = readLearningData();
      setLearnerNameState(data.learnerName);
      setSummary(getLearningSummary(data));
      setMounted(true);
    };

    refresh();
    window.addEventListener(LEARNING_DATA_UPDATED_EVENT, refresh);
    window.addEventListener('storage', refresh);

    return () => {
      window.removeEventListener(LEARNING_DATA_UPDATED_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  const saveLearnerName = () => {
    setLearnerName(learnerName);
    setStatus('साधक का नाम सहेज लिया गया।');
  };

  const handleExport = () => {
    const payload = exportLearningData();
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `dharma-learning-data-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    setStatus('अध्ययन संग्रह फ़ाइल निर्यात कर दी गई।');
  };

  const openImportDialog = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const payload = await file.text();
      importLearningData(payload);
      setStatus('अध्ययन संग्रह सफलतापूर्वक आयात हो गया।');
    } catch {
      setStatus('आयात विफल रहा। कृपया वैध JSON फ़ाइल चुनें।');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <section className="rounded-[2rem] border border-border bg-card p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-3xl">
          <h2 className="font-serif-deva text-2xl font-bold text-foreground mb-2">{title}</h2>
          <p className="text-sm text-muted leading-relaxed">{description}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-border bg-background/70 px-4 py-3">
            <p className="text-xs font-semibold text-primary mb-1">शुरू किए गए पाठ्यक्रम</p>
            <p className="text-2xl font-bold text-foreground">{mounted ? summary.startedCourses : '...'}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background/70 px-4 py-3">
            <p className="text-xs font-semibold text-primary mb-1">पूर्ण प्रमाणपत्र</p>
            <p className="text-2xl font-bold text-foreground">{mounted ? summary.completedCourses : '...'}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background/70 px-4 py-3">
            <p className="text-xs font-semibold text-primary mb-1">जर्नल नोट्स</p>
            <p className="text-2xl font-bold text-foreground">{mounted ? summary.moduleNotes + summary.verseNotes : '...'}</p>
          </div>
          <div className="rounded-2xl border border-border bg-background/70 px-4 py-3">
            <p className="text-xs font-semibold text-primary mb-1">वर्तमान अध्ययन क्रम</p>
            <p className="text-2xl font-bold text-foreground">{mounted ? summary.currentStreak : '...'}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="rounded-2xl border border-border bg-background/60 p-5">
          <p className="text-xs font-semibold text-primary mb-2">प्रमाणपत्र नाम</p>
          <div className="flex flex-wrap gap-3">
            <input
              value={learnerName}
              onChange={(event) => setLearnerNameState(event.target.value)}
              placeholder="उदाहरण: इशान"
              className="min-w-[220px] flex-1 rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-accent"
            />
            <button
              onClick={saveLearnerName}
              className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent/90"
            >
              नाम सहेजें
            </button>
          </div>
          <p className="mt-2 text-xs text-muted-light">
            यह नाम पाठ्यक्रम पूर्ण होने पर प्रमाणपत्र कार्ड पर दिखेगा।
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-background/60 p-5">
          <p className="text-xs font-semibold text-primary mb-2">डेटा निर्यात और आयात</p>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExport}
              className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-card-hover"
            >
              अध्ययन संग्रह निर्यात करें
            </button>
            <button
              onClick={openImportDialog}
              className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
            >
              संग्रह आयात करें
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            onChange={handleImport}
            className="hidden"
          />
          <p className="mt-2 text-xs text-muted-light">
            आयात की गई फ़ाइल मौजूदा प्रगति, नोट्स और उपलब्धियों के साथ जोड़ दी जाएगी।
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-light">
        <span>कुल सक्रिय अध्ययन-दिवस: {mounted ? summary.activeDays : '...'}</span>
        <span>सबसे लंबा क्रम: {mounted ? summary.longestStreak : '...'}</span>
        <span>मॉड्यूल नोट्स: {mounted ? summary.moduleNotes : '...'}</span>
        <span>श्लोक नोट्स: {mounted ? summary.verseNotes : '...'}</span>
      </div>

      {status && (
        <p className="mt-4 rounded-xl border border-accent/20 bg-accent-bg/40 px-4 py-3 text-sm text-foreground/85">
          {status}
        </p>
      )}
    </section>
  );
}