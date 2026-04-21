import * as mupdf from 'mupdf';
import vision from '@google-cloud/vision';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.GOOGLE_APPLICATION_CREDENTIALS = String.raw`C:\Users\ishan\Downloads\skilled-tangent-491310-b2-60f4ac6dad37.json`;

const pdfDir = path.resolve(__dirname, '..', '..');
const files = fs.readdirSync(pdfDir);
const match = files.find(f => f.includes('Mukt') && f.endsWith('.pdf'));

if (!match) { console.log('PDF not found'); process.exit(1); }
console.log('Found file:', match);

const buf = fs.readFileSync(path.join(pdfDir, match));
const doc = mupdf.Document.openDocument(buf, 'application/pdf');
const page = doc.loadPage(3);
const scale = 150 / 72;
const pixmap = page.toPixmap([scale, 0, 0, scale, 0, 0], mupdf.ColorSpace.DeviceRGB);
const png = Buffer.from(pixmap.asPNG());
console.log('Page rendered:', png.length, 'bytes');

const client = new vision.ImageAnnotatorClient();
const [result] = await client.documentTextDetection({
  image: { content: png },
  imageContext: { languageHints: ['hi', 'sa', 'en'] },
});
const text = result.fullTextAnnotation?.text || '';
console.log('OCR text length:', text.length);
console.log('---');
console.log(text.substring(0, 1500));
