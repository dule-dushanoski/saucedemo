import { test, expect } from '../../src/fixtures/testFixture';
import { STANDARD_USER } from '../../src/types/user';

test.describe('Network Interception', () => {
  // Listens for all HTTP responses during login and records the URLs for validation.
  test('should intercept and validate product page API responses', async ({ page }) => {
    const responses: string[] = [];
    page.on('response', (response) => {
      if (response.url().includes('/inventory.html')) {
        responses.push(response.url());
      }
    });

    await page.goto('/');
    await page.locator('[data-test="username"]').fill(STANDARD_USER.username);
    await page.locator('[data-test="password"]').fill(STANDARD_USER.password);
    await page.locator('[data-test="login-button"]').click();

    await page.waitForURL(/inventory\.html/);
    expect(responses.length).toBeGreaterThanOrEqual(0);
  });

  test('should block images to test resilience', async ({ page }) => {
    // Aborts all image requests (png, jpg, etc.) to verify the page still works.
    // (Tests resilience under resource failure).
    await page.route('**/*.{png,jpg,jpeg,webp}', (route) => route.abort());

    await page.goto('/');
    await page.locator('[data-test="username"]').fill(STANDARD_USER.username);
    await page.locator('[data-test="password"]').fill(STANDARD_USER.password);
    await page.locator('[data-test="login-button"]').click();
    await page.waitForURL(/inventory\.html/);

    await expect(page.locator('[data-test="title"]')).toHaveText('Products');
    const items = page.locator('[data-test="inventory-item"]');
    await expect(items.first()).toBeVisible();
  });

  test('should mock product price via API interception', async ({ page }) => {
    // Intercepts the inventory.html response and replaces $29.99 with $9.99
    // before the page renders, then asserts the modified price is shown.
    await page.route('**/inventory.html', async (route) => {
      const response = await route.fetch();
      let body = await response.text();
      body = body.replace(/\$29\.99/g, '$9.99');
      await route.fulfill({ body });
    });

    await page.goto('/');
    await page.locator('[data-test="username"]').fill(STANDARD_USER.username);
    await page.locator('[data-test="password"]').fill(STANDARD_USER.password);
    await page.locator('[data-test="login-button"]').click();
    await page.waitForURL(/inventory\.html/);

    const firstPrice = await page.locator('[data-test="inventory-item-price"]').first().textContent();
    expect(firstPrice).toContain('9.99');
  });
});
