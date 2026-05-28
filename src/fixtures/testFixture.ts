import { test as base } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { CheckoutCompletePage } from '../pages/CheckoutCompletePage';
import { ApiClient } from '../api/ApiClient';
import { BookingApi } from '../api/BookingApi';

type UiPages = {
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  checkoutCompletePage: CheckoutCompletePage;
};

type ApiFixtures = {
  apiClient: ApiClient;
  bookingApi: BookingApi;
};

export const test = base.extend<UiPages & ApiFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productsPage: async ({ page }, use) => {
    await use(new ProductsPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  checkoutCompletePage: async ({ page }, use) => {
    await use(new CheckoutCompletePage(page));
  },
  apiClient: async ({ request }, use) => {
    const client = new ApiClient(request);
    await use(client);
  },
  bookingApi: async ({ apiClient }, use) => {
    await use(new BookingApi(apiClient));
  },
});

export { expect } from '@playwright/test';
