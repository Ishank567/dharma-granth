import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';

const PROJECT_ROOT = path.resolve(__dirname, '..');
(process as typeof process & { loadEnvFile?: (p?: string) => void }).loadEnvFile?.(
  path.join(PROJECT_ROOT, '.env.local')
);

async function main() {
  const keys = [
    { name: 'K1', value: process.env.GOOGLE_GEMINI_API_KEY },
    { name: 'K2', value: process.env.GOOGLE_GEMINI_API_KEY_2 },
    { name: 'K3', value: process.env.GOOGLE_GEMINI_API_KEY_3 },
    { name: 'K4', value: process.env.GOOGLE_GEMINI_API_KEY_4 },
    { name: 'K5', value: process.env.GOOGLE_GEMINI_API_KEY_5 },
    { name: 'K6', value: process.env.GOOGLE_GEMINI_API_KEY_6 },
    { name: 'K7', value: process.env.GOOGLE_GEMINI_API_KEY_7 },
    { name: 'K8', value: process.env.GOOGLE_GEMINI_API_KEY_8 },
    { name: 'K9', value: process.env.GOOGLE_GEMINI_API_KEY_9 },
    { name: 'K10', value: process.env.GOOGLE_GEMINI_API_KEY_10 },
  ];

  for (const k of keys) {
    if (!k.value) {
      console.log(`${k.name}: MISSING`);
      continue;
    }
    try {
      const m = new GoogleGenerativeAI(k.value).getGenerativeModel({ model: 'gemini-2.5-flash' });
      await m.generateContent('hi');
      console.log(`${k.name}: OK  (prefix ${k.value.substring(0, 10)}...)`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`${k.name}: ${msg.substring(0, 150)}  (prefix ${k.value.substring(0, 10)}...)`);
    }
    await new Promise(r => setTimeout(r, 5000)); // 5s between keys to avoid cross-key rate limit
  }
}

main();
