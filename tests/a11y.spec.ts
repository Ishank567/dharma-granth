import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

/**
 * Automated accessibility audit (axe, WCAG 2 A/AA). Fails on serious and
 * critical violations only; moderate/minor ones are listed in the report.
 */
const PAGES = [
  '/',
  '/scriptures/',
  '/scripture/bhagavadgita/',
  '/scripture/bhagavadgita/chapter/2/',
  '/scripture/bhagavadgita/chapter/2/verse/47/',
  '/dashboard/',
  '/practice/',
];

for (const path of PAGES) {
  test(`a11y: ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    await page.waitForLoadState('networkidle');
    const { violations } = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    const blocking = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
    console.log(
      `${path}: ` + (violations.map((v) => `${v.id}(${v.impact},${v.nodes.length})`).join(' ') || 'clean'),
    );
    expect(
      blocking.map((v) => `${v.id}: ${v.help} — ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`),
    ).toEqual([]);
  });
}
