import { expect, test } from '@playwright/test';

/** Keyboard-only use of the search modal and the skip link. */

test('search modal: open with Ctrl+K, arrow to a result, Enter navigates', async ({ page }) => {
  await page.goto('/scriptures/');
  await page.waitForLoadState('networkidle');
  await page.locator('body').click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('Control+k');
  const dialog = page.getByRole('dialog', { name: 'Global Search' });
  const input = dialog.getByRole('combobox');
  await expect(input).toBeFocused();
  await input.fill('gita 2.47');
  const first = dialog.getByRole('option').first();
  await expect(first).toBeVisible();
  await page.keyboard.press('ArrowDown');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/\/scripture\/bhagavadgita\/chapter\/2\/verse\/47\/?$/);
});

test('search modal: "/" opens it, Escape closes it and returns focus to the page', async ({ page }) => {
  await page.goto('/scriptures/');
  await page.waitForLoadState('networkidle');
  await page.locator('body').click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('/');
  const dialog = page.getByRole('dialog', { name: 'Global Search' });
  await expect(dialog).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
  // Focus must not be lost to <body>: the next Tab lands on a real control.
  await page.keyboard.press('Tab');
  const tag = await page.evaluate(() => document.activeElement?.tagName);
  expect(tag).not.toBe('BODY');
});

test('search modal keeps Tab focus inside the dialog', async ({ page }) => {
  await page.goto('/scriptures/');
  await page.waitForLoadState('networkidle');
  await page.locator('body').click({ position: { x: 5, y: 5 } });
  await page.keyboard.press('/');
  const dialog = page.getByRole('dialog', { name: 'Global Search' });
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Tab');
    const inside = await page.evaluate(
      () => !!document.activeElement?.closest('[role="dialog"][aria-label="Global Search"]'),
    );
    expect(inside, `focus escaped the dialog on Tab #${i + 1}`).toBe(true);
  }
});

test('skip link is the first Tab stop and moves focus to the main content', async ({ page }) => {
  await page.goto('/scriptures/');
  await page.waitForLoadState('networkidle');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to main content' });
  await expect(skip).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
});
