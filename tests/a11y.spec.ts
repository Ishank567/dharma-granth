import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Automated accessibility audit (axe, WCAG 2 A/AA) in every colour theme.
 * Fails on serious and critical violations; lesser ones are only logged.
 */
const THEMES = ['day', 'sunset', 'night'] as const;
const PAGES = [
  '/',
  '/scriptures/',
  '/scripture/bhagavadgita/',
  '/scripture/bhagavadgita/chapter/2/',
  '/scripture/bhagavadgita/chapter/2/verse/47/',
  '/dashboard/',
  '/practice/',
  '/concepts/',
  '/dictionary/',
  '/topics/',
  '/characters/',
  '/festivals/',
  '/learn/pathways/',
  '/bookmarks/',
  '/timelines/',
];

for (const theme of THEMES) {
  for (const path of PAGES) {
    test(`a11y [${theme}]: ${path}`, async ({ page }) => {
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.addInitScript((t) => localStorage.setItem('dharma-theme', t), theme);
      await page.goto(path);
      await page.waitForLoadState('networkidle');
      // Scroll through so scroll-triggered sections appear, then let fades finish.
      await page.evaluate(async () => {
        for (let y = 0; y <= document.body.scrollHeight; y += 600) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, 0);
      });
      await page.waitForTimeout(1500);
      const { violations } = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
        .analyze();
      const blocking = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
      console.log(
        `${theme} ${path}: ` + (violations.map((v) => `${v.id}(${v.impact},${v.nodes.length})`).join(' ') || 'clean'),
      );
      expect(
        blocking.map(
          (v) => `${v.id}: ${v.help} — ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`,
        ),
      ).toEqual([]);
    });
  }
}
