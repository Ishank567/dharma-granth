/**
 * Download missing PDFs from Archive.org
 * =========================================
 * Downloads high-quality Gita Press editions for books with missing PDFs
 */

import fs from 'fs';
import path from 'path';
import https from 'https';
import Database from 'better-sqlite3';

const DB_PATH = path.join(__dirname, '..', 'db', 'dharma.db');
const PDF_DIR = path.resolve(__dirname, '..', '..');

interface MissingBook {
  id: number;
  title: string;
  category: string;
  pdf_filename: string;
  downloadUrl: string;
}

const MISSING_BOOKS: MissingBook[] = [
  {
    id: 88,
    title: 'Bhagavad Gita',
    category: 'gita',
    pdf_filename: 'ShrimadBhagavadGita_GitaPress.pdf',
    downloadUrl: 'https://archive.org/download/shrimad-bhagwat-geeta-hindi-sanskrit-gorkhpur-press/Shrimad%20Bhagwat%20Geeta%20Hindi-Sanskrit%20%28Gorkhpur%20Press%29.pdf',
  },
  {
    id: 89,
    title: 'Ramcharitmanas',
    category: 'bhakti',
    pdf_filename: 'ShriRamcharitmanas_GitaPress.pdf',
    downloadUrl: 'https://archive.org/download/shri-ramcharitmanas-gita-press-hindi/Shri%20Ramcharitmanas%20-%20Gita%20Press%20%28Hindi%29.pdf',
  },
];

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    console.log(`  Downloading from: ${url.substring(0, 80)}...`);

    https.get(url, (response) => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Follow redirect
        console.log(`  Following redirect to: ${response.headers.location?.substring(0, 80)}...`);
        https.get(response.headers.location!, (redirectResponse) => {
          const totalSize = parseInt(redirectResponse.headers['content-length'] || '0');
          let downloaded = 0;

          redirectResponse.on('data', (chunk) => {
            downloaded += chunk.length;
            if (totalSize > 0 && downloaded % (1024 * 1024) < 10000) {
              const pct = ((downloaded / totalSize) * 100).toFixed(1);
              const downloadedMB = (downloaded / 1024 / 1024).toFixed(1);
              const totalMB = (totalSize / 1024 / 1024).toFixed(1);
              process.stdout.write('\r  Progress: ' + pct + '% (' + downloadedMB + ' MB / ' + totalMB + ' MB)');
            }
          });

          redirectResponse.pipe(file);
          file.on('finish', () => {
            file.close();
            console.log(`\n  Saved to: ${dest}`);
            console.log(`\n  ✅ Saved to: ${dest}`);
            resolve();
          });
        }).on('error', reject);
      } else if (response.statusCode === 200) {
        const totalSize = parseInt(response.headers['content-length'] || '0');
        let downloaded = 0;

        response.on('data', (chunk) => {
          downloaded += chunk.length;
          if (totalSize > 0 && downloaded % (1024 * 1024) < 10000) {
            const pct = ((downloaded / totalSize) * 100).toFixed(1);
            const dlMB = (downloaded / 1024 / 1024).toFixed(1);
            const totMB = (totalSize / 1024 / 1024).toFixed(1);
            process.stdout.write('\r  Progress: ' + pct + '% (' + dlMB + ' MB / ' + totMB + ' MB)');
          }
        });

        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`\n  ✅ Saved to: ${dest}`);
          resolve();
        });
      } else {
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function main() {
  console.log('📚 Downloading missing PDFs from Archive.org...\n');

  if (!fs.existsSync(DB_PATH)) {
    console.error('❌ Database not found at:', DB_PATH);
    return;
  }

  const db = new Database(DB_PATH);

  for (const book of MISSING_BOOKS) {
    const pdfPath = path.join(PDF_DIR, book.pdf_filename);

    // Check if already downloaded
    if (fs.existsSync(pdfPath)) {
      const stats = fs.statSync(pdfPath);
      const sizeMB = (stats.size / 1024 / 1024).toFixed(1);
      console.log(`📄 ${book.title}: Already exists (${sizeMB} MB)`);
    } else {
      console.log(`\n📥 Downloading: ${book.title}`);
      try {
        await downloadFile(book.downloadUrl, pdfPath);
      } catch (e) {
        console.error(`  ❌ Download failed: ${e}`);
        continue;
      }
    }

    // Update database with new PDF filename
    const updateStmt = db.prepare('UPDATE books SET pdf_filename = ? WHERE id = ?');
    updateStmt.run(book.pdf_filename, book.id);
    console.log(`  ✅ Database updated for book ID ${book.id}`);
  }

  console.log('\n✅ All done!');
  db.close();
}

main().catch(console.error);
