import { test, expect } from '../../src/fixtures/testFixture';
import { STANDARD_USER } from '../../src/types/user';

test.describe('Checkout Flow Tests', () => {
  test.beforeEach(async ({ loginPage, productsPage }) => {
    await loginPage.goto();
    await loginPage.login(STANDARD_USER.username, STANDARD_USER.password);
  });

  test('should complete a successful checkout', async ({ productsPage, cartPage, checkoutPage, checkoutCompletePage, page }) => {
    await productsPage.addItemToCart('Sauce Labs Backpack');
    await productsPage.addItemToCart('Sauce Labs Bike Light');
    expect(await productsPage.getCartBadgeCount()).toBe(2);

    await productsPage.gotoCart();
    await expect(page).toHaveURL(/cart\.html/);

    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/checkout-step-one\.html/);

    await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
    await checkoutPage.continue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    expect(await checkoutPage.getItemTotal()).toContain('Item total');
    expect(await checkoutPage.getTax()).toContain('Tax');
    expect(await checkoutPage.getTotal()).toContain('Total');

    await checkoutPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);
    expect(await checkoutCompletePage.getCompleteHeader()).toContain('Thank you for your order');
  });

  test('should show validation errors with empty checkout form', async ({ productsPage, cartPage, checkoutPage, page }) => {
    await productsPage.addItemToCart('Sauce Labs Backpack');
    await productsPage.gotoCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.continue();
    const errorMessage = await checkoutPage.getErrorMessage();
    expect(errorMessage).toContain('First Name is required');

    await checkoutPage.fillCheckoutInfo('John', '', '');
    await checkoutPage.continue();
    const errorMessage2 = await checkoutPage.getErrorMessage();
    expect(errorMessage2).toContain('Last Name is required');

    await checkoutPage.fillCheckoutInfo('John', 'Doe', '');
    await checkoutPage.continue();
    const errorMessage3 = await checkoutPage.getErrorMessage();
    expect(errorMessage3).toContain('Postal Code is required');
  });

  test('should cancel checkout and return to cart', async ({ productsPage, cartPage, checkoutPage, page }) => {
    await productsPage.addItemToCart('Sauce Labs Backpack');
    await productsPage.gotoCart();
    await cartPage.proceedToCheckout();

    await checkoutPage.fillCheckoutInfo('John', 'Doe', '12345');
    await checkoutPage.continue();
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    await checkoutPage.cancel();
    await expect(page).toHaveURL(/inventory\.html/);
  });

  test('should verify cart contents before completing checkout', async ({ productsPage, cartPage, checkoutPage, checkoutCompletePage, page }) => {
    await productsPage.addItemToCart('Sauce Labs Backpack');
    await productsPage.gotoCart();
    expect(await cartPage.getItemCount()).toBe(1);

    await cartPage.proceedToCheckout();
    await checkoutPage.fillCheckoutInfo('Jane', 'Smith', '67890');
    await checkoutPage.continue();

    expect(await checkoutPage.cartItems.count()).toBe(1);
    expect(await checkoutPage.getItemTotal()).toContain('Item total');
    expect(await checkoutPage.getTotal()).toContain('Total');

    await checkoutPage.finish();
    await expect(page).toHaveURL(/checkout-complete\.html/);
  });
});
