import { Locator, Page, expect } from '@playwright/test';
import { cartWidgetPattern, parseMoney } from '@helpers/price';

export class HeaderComponent {
  readonly root: Locator;
  readonly quantity: Locator;
  readonly formattedValue: Locator;
  readonly checkoutLink: Locator;

  constructor(private readonly page: Page) {
    this.root = page.locator('#cart');
    this.quantity = page.locator('#cart .quantity');
    this.formattedValue = page.locator('#cart .formatted_value');
    this.checkoutLink = page.locator('#cart a.link');
  }

  async getState(): Promise<{ quantity: number; total: number }> {
    return {
      quantity: Number((await this.quantity.innerText()).trim()),
      total: parseMoney(await this.formattedValue.innerText()),
    };
  }

  async expectSummary(quantity: number, total: number): Promise<void> {
    await expect(this.quantity).toHaveText(String(quantity));
    expect(parseMoney(await this.formattedValue.innerText())).toBe(total);
    expect(await this.root.innerText()).toMatch(cartWidgetPattern);
  }

  async openCheckout(): Promise<void> {
    await this.checkoutLink.click();
    await this.page.waitForURL(/\/checkout/);
  }
}
