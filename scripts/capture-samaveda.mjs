import { chromium } from '@playwright/test';

const artifactDir = 'C:/Users/ishan/.gemini/antigravity/brain/05284b2a-5af3-4958-9375-d22d00435eeb';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  console.log('Navigating to Sama Veda Chapter 1...');
  await page.goto('http://localhost:3000/scripture/samaveda/chapter/1', {
    waitUntil: 'networkidle',
    timeout: 60000,
  });
  await page.waitForTimeout(2000);

  const verse2 = page.locator('#verse-2');
  if (await verse2.count() > 0) {
    await verse2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);
  }

  // Take screenshot of Sama Veda verse cards
  await page.screenshot({ path: `${artifactDir}/samaveda_verses_detail.png`, fullPage: false });
  console.log('Saved samaveda_verses_detail.png');

  await browser.close();
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
