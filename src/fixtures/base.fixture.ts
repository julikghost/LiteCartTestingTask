import { test as base } from '@playwright/test';
import { LiteCartApi } from '@api/LiteCartApi';
import { LiteCartApp } from '@app/LiteCartApp';
import {
  CheckoutPage,
  HomePage,
  OrderSuccessPage,
  ProductPage,
} from '@pages';

type Fixtures = {
  /** Главная точка входа в POM: бизнес-шаги поверх Page Objects + API. */
  app: LiteCartApp;
  homePage: HomePage;
  productPage: ProductPage;
  checkoutPage: CheckoutPage;
  orderSuccessPage: OrderSuccessPage;
  api: LiteCartApi;
};

/**
 * Fixtures:
 * - `app` — facade (рекомендуется в тестах)
 * - отдельные PO / api — если нужен точечный доступ
 */
export const test = base.extend<Fixtures>({
  app: async ({ page }, use) => {
    await use(new LiteCartApp(page));
  },
  homePage: async ({ app }, use) => {
    await use(app.home);
  },
  productPage: async ({ app }, use) => {
    await use(app.product);
  },
  checkoutPage: async ({ app }, use) => {
    await use(app.checkout);
  },
  orderSuccessPage: async ({ app }, use) => {
    await use(app.orderSuccess);
  },
  api: async ({ app }, use) => {
    await use(app.api);
  },
});

export { expect } from '@playwright/test';
