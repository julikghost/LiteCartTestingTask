import { Locator, Page, expect } from '@playwright/test';

/** Component Object — блок Recently Viewed на домашней. */
export class RecentlyViewedComponent {
  readonly root: Locator;
  readonly title: Locator;

  constructor(page: Page) {
    // XPath root + CSS title
    this.root = page.locator('//div[@id="box-recently-viewed-products"]');
    this.title = this.root.locator('h3.title');
  }

  async expectContains(productPaths: string[]): Promise<void> {
    await expect(this.root).toBeVisible();
    await expect(this.title).toHaveText(/Recently Viewed/i);

    for (const path of productPaths) {
      await expect(this.root.locator(`xpath=.//a[contains(@href, "${path}")]`)).toBeVisible();
    }
  }
}
