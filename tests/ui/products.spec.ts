import { test, expect } from '../../src/fixtures/testFixture';
import { STANDARD_USER } from '../../src/types/user';

test.describe('Products Page Tests', () => {
  test.beforeEach(async ({ loginPage, productsPage }) => {
    await loginPage.goto();
    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
  });

  test('should display all products', async ({ productsPage }) => {
    await expect(productsPage.title).toHaveText('Products');
    const itemCount = await productsPage.inventoryItems.count();
    expect(itemCount).toBeGreaterThan(0);
  });

  test('should add product to cart and update badge', async ({ productsPage }) => {
    await productsPage.addItemToCart('Sauce Labs Backpack');
    const badgeCount = await productsPage.getCartBadgeCount();
    expect(badgeCount).toBe(1);
  });

  test('should add and remove product from cart', async ({ productsPage }) => {
    await productsPage.addItemToCart('Sauce Labs Backpack');
    expect(await productsPage.getCartBadgeCount()).toBe(1);
    await productsPage.removeItemFromCart('Sauce Labs Backpack');
    expect(await productsPage.getCartBadgeCount()).toBe(0);
  });

  test('should verify cart badge for multiple items', async ({ productsPage }) => {
    await productsPage.addItemToCart('Sauce Labs Backpack');
    await productsPage.addItemToCart('Sauce Labs Bike Light');
    expect(await productsPage.getCartBadgeCount()).toBe(2);
  });

  test('should sort products by name (A to Z)', async ({ productsPage }) => {
    await productsPage.sortBy('az');
    const names = await productsPage.getItemNames();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  test('should sort products by name (Z to A)', async ({ productsPage }) => {
    await productsPage.sortBy('za');
    const names = await productsPage.getItemNames();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  test('should sort products by price (low to high)', async ({ productsPage }) => {
    await productsPage.sortBy('lohi');
    const prices = await productsPage.getItemPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('should sort products by price (high to low)', async ({ productsPage }) => {
    await productsPage.sortBy('hilo');
    const prices = await productsPage.getItemPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });
});
