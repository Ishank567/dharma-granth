import { chromium } from '@playwright/test';

const artifactDir = 'C:/Users/ishan/.gemini/antigravity/brain/05284b2a-5af3-4958-9375-d22d00435eeb';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  console.log('Navigating to Durga Saptashati Chapter 1...');
  await page.goto('http://localhost:3000/scripture/durgasaptashati/chapter/1', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);

  // Take screenshot of toolbar and Durga Saptashati verses
  await page.screenshot({ path: `${artifactDir}/durga_saptashati_reader.png`, fullPage: false });
  console.log('Saved durga_saptashati_reader.png');

  // Click on listen button to show the active chanting playback controls
  const listenBtn = page.locator('article[id^="verse-"] button[title*="Listen"]').first();
  if (await listenBtn.count() > 0) {
    await listenBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${artifactDir}/chanting_controls.png`, fullPage: false });
    console.log('Saved chanting_controls.png');
  }

  console.log('Navigating to Brahma Sutra Chapter 1...');
  await page.goto('http://localhost:3000/scripture/brahmasutra/chapter/1', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(4000);
  await page.screenshot({ path: `${artifactDir}/brahma_sutra_reader.png`, fullPage: false });
  console.log('Saved brahma_sutra_reader.png');

  await browser.close();
  console.log('Screenshots complete.');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
