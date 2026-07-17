import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { orderSuccessPattern } from '@helpers/price';

export class OrderSuccessPage extends BasePage {
  readonly successMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.successMessage = page.locator('//*[contains(., "Your order is successfully completed")]');
  }

  async expectOrderCreated(): Promise<void> {
    await expect(this.page).toHaveURL(/order_success/);
    await expect(this.page.locator('body')).toContainText(orderSuccessPattern);
    await expect(this.successMessage.first()).toBeVisible();
  }
}
