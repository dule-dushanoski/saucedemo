import { test, expect } from '../../src/fixtures/testFixture';
import { STANDARD_USER } from '../../src/types/user';

test.describe('Console Error Capturing', () => {
  test('should capture console errors during login with invalid credentials', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.locator('[data-test="username"]').fill('invalid_user');
    await page.locator('[data-test="password"]').fill('bad_password');
    await page.locator('[data-test="login-button"]').click();

    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('should not have unexpected console errors during standard login flow', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.locator('[data-test="username"]').fill(STANDARD_USER.username);
    await page.locator('[data-test="password"]').fill(STANDARD_USER.password);
    await page.locator('[data-test="login-button"]').click();
    await page.waitForURL(/inventory\.html/);

    const appErrors = consoleErrors.filter((e) => !e.includes('favicon') && !e.includes('Failed to load resource'));
    expect(appErrors.length).toBe(0);
  });
});
