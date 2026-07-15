import { Locator, Page } from '@playwright/test';

/**
 * Base Page Object — общий page + cookie banner.
 * Все страницы наследуют BasePage (классический POM).
 */
export abstract class BasePage {
  readonly page: Page;
  readonly cookieAcceptButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // CSS
    this.cookieAcceptButton = page.locator('button:has-text("OK")');
  }

  async acceptCookiesIfPresent(): Promise<void> {
    if (await this.cookieAcceptButton.isVisible().catch(() => false)) {
      await this.cookieAcceptButton.click();
    }
  }

  protected async goto(path: string): Promise<void> {
    await this.page.goto(path);
    await this.page.waitForLoadState('domcontentloaded');
    await this.acceptCookiesIfPresent();
  }
}
