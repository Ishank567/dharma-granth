/** Keys that hold the reader's own data (progress, bookmarks, notes, settings). */
const EXTRA_KEYS = ['verse-bookmarks', 'bookmarkedSections', 'darkMode'];

export const BACKUP_FORMAT = 'dharma-granth-backup';

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  version: 1;
  exportedAt: string;
  data: Record<string, string>;
}

const isOwnKey = (key: string) =>
  key.startsWith('dharma.') || key.startsWith('dharma_') || key.startsWith('dharma-') || EXTRA_KEYS.includes(key);

export function createBackup(storage: Storage = window.localStorage): BackupFile {
  const data: Record<string, string> = {};
  for (let i = 0; i < storage.length; i++) {
    const key = storage.key(i);
    const value = key ? storage.getItem(key) : null;
    if (key && value !== null && isOwnKey(key)) data[key] = value;
  }
  return { format: BACKUP_FORMAT, version: 1, exportedAt: new Date().toISOString(), data };
}

/** Restores a backup; returns how many keys were written. Throws on a foreign file. */
export function restoreBackup(raw: string, storage: Storage = window.localStorage): number {
  const parsed: unknown = JSON.parse(raw);
  const file = parsed as Partial<BackupFile> | null;
  if (!file || file.format !== BACKUP_FORMAT || file.version !== 1 || typeof file.data !== 'object' || !file.data) {
    throw new Error('Not a Dharma Granth backup file');
  }
  let written = 0;
  for (const [key, value] of Object.entries(file.data)) {
    if (typeof value === 'string' && isOwnKey(key)) {
      storage.setItem(key, value);
      written++;
    }
  }
  return written;
}
