import { chromium } from '@playwright/test';

const artifactDir = 'C:/Users/ishan/.gemini/antigravity/brain/05284b2a-5af3-4958-9375-d22d00435eeb';

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2
  });
  const page = await context.newPage();

  console.log('Navigating to Bhagavad Gita Chapter 2...');
  await page.goto('http://localhost:3000/scripture/bhagavadgita/chapter/2', {
    waitUntil: 'domcontentloaded',
    timeout: 60000,
  });
  await page.waitForTimeout(4000);

  // Scroll to verse 47
  const verse47 = page.locator('#verse-47');
  if (await verse47.count() > 0) {
    await verse47.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1000);

    // 1. Click Listen button on verse 47
    const listenBtn = verse47.locator('button[title*="Listen"], button[title*="पाठ"]').first();
    if (await listenBtn.count() > 0) {
      console.log('Clicking Listen button on verse 47...');
      await listenBtn.click();
      await page.waitForTimeout(1500);

      // Take screenshot with Global Audio Player docked at bottom
      await page.screenshot({ path: `${artifactDir}/global_audio_player_dock.png`, fullPage: false });
      console.log('Saved global_audio_player_dock.png');
    }

    // 2. Click on a glossary term inside verse 47 (e.g. कर्म)
    const glossaryWord = verse47.locator('span[role="button"][title*="शब्दार्थ"]').first();
    if (await glossaryWord.count() > 0) {
      console.log('Clicking glossary term...');
      await glossaryWord.click();
      await page.waitForTimeout(1000);

      // Take screenshot with Glossary Popover visible
      await page.screenshot({ path: `${artifactDir}/glossary_tooltip_popover.png`, fullPage: false });
      console.log('Saved glossary_tooltip_popover.png');
    }
  }

  await browser.close();
  console.log('Enhancements capture complete.');
}

capture().catch((err) => {
  console.error(err);
  process.exit(1);
});
