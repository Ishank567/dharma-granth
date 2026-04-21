/**
 * Worker thread for PDF page rendering via mupdf (WASM).
 * Receives render requests, returns PNG buffers.
 * Each worker caches opened documents for efficiency.
 */
import { parentPort } from 'node:worker_threads';
import fs from 'fs';

let mupdfModule: typeof import('mupdf') | null = null;
const docCache = new Map<string, { doc: any; pageCount: number }>();

async function ensureMupdf() {
  if (!mupdfModule) {
    mupdfModule = await import('mupdf');
  }
  return mupdfModule;
}

const initPromise = ensureMupdf();

parentPort!.on('message', async (msg: any) => {
  if (msg.type === 'render') {
    const mupdf = await initPromise;
    try {
      let cached = docCache.get(msg.pdfPath);
      if (!cached) {
        const buf = fs.readFileSync(msg.pdfPath);
        const doc = mupdf.Document.openDocument(buf, 'application/pdf');
        cached = { doc, pageCount: doc.countPages() };
        docCache.set(msg.pdfPath, cached);
      }
      const page = cached.doc.loadPage(msg.pageIdx);
      const pixmap = page.toPixmap(
        [msg.scale, 0, 0, msg.scale, 0, 0],
        mupdf.ColorSpace.DeviceRGB
      );
      const png = Buffer.from(pixmap.asPNG());
      parentPort!.postMessage(
        { id: msg.id, pageIdx: msg.pageIdx, png, error: null },
        [png.buffer] // zero-copy transfer
      );
    } catch (e: any) {
      parentPort!.postMessage({
        id: msg.id,
        pageIdx: msg.pageIdx,
        png: null,
        error: e.message,
      });
    }
  } else if (msg.type === 'evict') {
    docCache.delete(msg.pdfPath);
  }
});
