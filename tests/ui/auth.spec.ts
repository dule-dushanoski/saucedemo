import { test, expect } from '../../src/fixtures/testFixture';
import { STANDARD_USER, LOCKED_OUT_USER, INVALID_USER } from '../../src/types/user';

test.describe('Authentication Tests', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('should successfully login with valid credentials', async ({ loginPage, page, productsPage }) => {
    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(productsPage.title).toHaveText('Products');
  });

  test('should display error for invalid login', async ({ loginPage }) => {
    await loginPage.login(INVALID_USER.username, INVALID_USER.password);
    expect(await loginPage.isErrorMessageVisible()).toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('Username and password do not match');
  });

  test('should display error for locked out user', async ({ loginPage }) => {
    await loginPage.login(LOCKED_OUT_USER.username, LOCKED_OUT_USER.password);
    expect(await loginPage.isErrorMessageVisible()).toBe(true);
    const errorMessage = await loginPage.getErrorMessage();
    expect(errorMessage).toContain('locked out');
  });

  test('should successfully logout', async ({ loginPage, page, productsPage }) => {
    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
    await expect(page).toHaveURL(/inventory\.html/);
    await productsPage.logout();
    await expect(page).toHaveURL('/');
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('should clear error message after dismissal', async ({ loginPage }) => {
    await loginPage.login(INVALID_USER.username, INVALID_USER.password);
    expect(await loginPage.isErrorMessageVisible()).toBe(true);
    await loginPage.dismissError();
    expect(await loginPage.isErrorMessageVisible()).toBe(false);
  });
});
