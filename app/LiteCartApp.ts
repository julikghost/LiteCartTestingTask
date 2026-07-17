import { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { LiteCartApi } from '@api/LiteCartApi';
import { CheckoutPage, HomePage, OrderSuccessPage, ProductPage } from '@pages';

type ProductRef = {
  name: string;
  path: string;
  unitPrice?: number;
  campaignPrice?: number;
  size?: string;
};

export class LiteCartApp {
  readonly home: HomePage;
  readonly product: ProductPage;
  readonly checkout: CheckoutPage;
  readonly orderSuccess: OrderSuccessPage;
  readonly api: LiteCartApi;

  constructor(page: Page) {
    this.home = new HomePage(page);
    this.product = new ProductPage(page);
    this.checkout = new CheckoutPage(page);
    this.orderSuccess = new OrderSuccessPage(page);
    this.api = new LiteCartApi(page.request);
  }

  async prepareLoggedInEmptyCart(): Promise<void> {
    await allure.step('Prepare empty cart for logged-in storageState', async () => {
      await this.home.open();
      await this.home.expectLoggedIn();
      await this.api.clearCart();
      await this.api.expectCart(0, 0);
      await this.home.open();
      await this.home.expectLoggedIn();
    });
  }

  async prepareGuestEmptyCart(): Promise<void> {
    await allure.step('Prepare guest session with empty cart', async () => {
      await this.home.open();
      await this.api.logout().catch(() => undefined);
      await this.api.clearCart();
      await this.api.expectCart(0, 0);
      await this.home.open();
    });
  }

  async selectAndAddProduct(
    product: ProductRef,
    quantity: number,
    options?: { size?: string },
  ): Promise<void> {
    await allure.step(`Add product "${product.name}" x${quantity}`, async () => {
      await this.product.selectAndAdd(
        product.path,
        product.name,
        quantity,
        options ?? (product.size ? { size: product.size } : undefined),
      );
    });
  }

  async verifyCart(quantity: number, total: number): Promise<void> {
    await allure.step(`Verify cart: ${quantity} item(s), total $${total}`, async () => {
      await this.api.expectCart(quantity, total);
      await this.home.expectCartSummary(quantity, total);
    });
  }

  async openCheckoutAndVerify(params: {
    items: Array<{ name: string; quantity: number; unitPrice: number }>;
    paymentDue: number;
  }): Promise<void> {
    await allure.step('Open checkout and verify cart contents', async () => {
      await this.home.openCheckout();
      await this.checkout.expectCartContents(params.items, params.paymentDue);
    });
  }

  async confirmOrderSuccessfully(): Promise<void> {
    await allure.step('Confirm order and verify success', async () => {
      await this.checkout.confirmOrder();
      await this.orderSuccess.expectOrderCreated();
      await this.api.expectCart(0, 0);
    });
  }

  async loginWithValidCredentials(email: string, password: string): Promise<void> {
    await allure.step('Log in with valid credentials (UI)', async () => {
      await this.home.open();
      await this.api.logout().catch(() => undefined);
      await this.home.open();
      await this.home.login(email, password);
      await this.home.expectLoggedIn();
    });
  }

  async loginWithInvalidCredentials(email: string, password: string): Promise<void> {
    await allure.step('Log in with invalid credentials (API + UI)', async () => {
      await this.api.loginExpectFailure(email, password);
      await this.home.open();
      await this.home.login(email, password);
      await this.home.expectLoginFailed();
    });
  }

  async expectGuestCustomerDataEmpty(): Promise<void> {
    await allure.step('Verify guest customer fields are empty', async () => {
      await this.checkout.expectCustomerFieldsEmpty();
    });
  }

  async expectRecentlyViewed(productPaths: string[]): Promise<void> {
    await allure.step('Verify Recently Viewed products on home', async () => {
      await this.home.open();
      await this.home.expectRecentlyViewedContains(productPaths);
    });
  }
}
