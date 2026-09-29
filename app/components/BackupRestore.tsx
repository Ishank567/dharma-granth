'use client';

import { useRef, useState } from 'react';
import { Download, Upload } from 'lucide-react';
import { createBackup, restoreBackup } from '@/lib/backup';

/** Export / import of bookmarks, notes and progress, which live only in this browser. */
export function BackupRestore() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState('');

  function download() {
    const blob = new Blob([JSON.stringify(createBackup(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dharma-granth-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage('बैकअप डाउनलोड हो गया · Backup downloaded.');
  }

  async function upload(file: File | undefined) {
    if (!file) return;
    try {
      const count = restoreBackup(await file.text());
      setMessage(`${count} items restored — reloading… · ${count} आइटम पुनर्स्थापित`);
      setTimeout(() => window.location.reload(), 900);
    } catch {
      setMessage('यह फ़ाइल मान्य बैकअप नहीं है · This is not a valid backup file.');
    }
    if (fileInput.current) fileInput.current.value = '';
  }

  return (
    <section aria-labelledby="backup-heading" className="mt-10 rounded-2xl border border-saffron-200 bg-white/60 p-5 dark:bg-white/5">
      <h2 id="backup-heading" className="text-lg font-serif font-bold text-dharma-text">
        बैकअप · Backup
      </h2>
      <p className="mt-1 text-sm text-dharma-muted">
        Your bookmarks, notes and progress are saved only in this browser. Download a copy to move them to another device.
      </p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={download} className="inline-flex items-center gap-2 rounded-lg bg-saffron-600 px-4 py-2 text-sm font-medium text-white hover:bg-saffron-700">
          <Download className="h-4 w-4" aria-hidden /> Export
        </button>
        <button type="button" onClick={() => fileInput.current?.click()} className="inline-flex items-center gap-2 rounded-lg border border-saffron-300 px-4 py-2 text-sm font-medium text-saffron-800 hover:bg-saffron-50 dark:text-saffron-200">
          <Upload className="h-4 w-4" aria-hidden /> Import
        </button>
        <input ref={fileInput} type="file" accept="application/json,.json" className="hidden" onChange={(e) => upload(e.target.files?.[0])} />
      </div>
      <p role="status" className="mt-3 text-sm text-dharma-muted">{message}</p>
    </section>
  );
}
