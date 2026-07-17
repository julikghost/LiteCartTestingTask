import { Locator, Page, expect } from '@playwright/test';
import { loggedInPattern, wrongCredentialsPattern } from '@helpers/price';

export class LoginFormComponent {
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly accountBox: Locator;
  readonly logoutLink: Locator;
  readonly notices: Locator;
  readonly errorNotice: Locator;

  constructor(private readonly page: Page) {
    this.emailInput = page.locator('#box-account-login input[name="email"]');
    this.passwordInput = page.locator('#box-account-login input[name="password"]');
    this.loginButton = page.locator('#box-account-login button[name="login"]');
    this.accountBox = page.locator('#box-account');
    this.notices = page.locator('#notices');

    this.logoutLink = page.locator('//div[@id="box-account"]//a[contains(@href, "logout")]');
    this.errorNotice = page.locator(
      '//div[@id="notices"]//div[contains(@class, "notice") and contains(@class, "errors")]',
    );
  }

  async isLoggedIn(): Promise<boolean> {
    return this.logoutLink.isVisible().catch(() => false);
  }

  async ensureLoggedOut(): Promise<void> {
    if (await this.isLoggedIn()) {
      await this.logoutLink.click();
      await this.page.waitForLoadState('domcontentloaded');
    }
  }

  async login(email: string, password: string): Promise<void> {
    await this.ensureLoggedOut();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  async expectLoggedIn(): Promise<void> {
    await expect(this.accountBox).toBeVisible();
    await expect(this.logoutLink).toBeVisible();
    const noticeText = await this.notices.innerText().catch(() => '');
    if (noticeText.trim()) {
      expect(noticeText).toMatch(loggedInPattern);
    }
  }

  async expectLoginFailed(): Promise<void> {
    await expect(this.errorNotice).toBeVisible();
    await expect(this.errorNotice).toContainText(wrongCredentialsPattern);

    const { r, g, b } = await this.errorNotice.evaluate((el) => {
      const match = getComputedStyle(el).backgroundColor.match(
        /rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/,
      );
      if (!match) {
        throw new Error(`Unexpected backgroundColor: ${getComputedStyle(el).backgroundColor}`);
      }
      return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) };
    });
    expect(r).toBeGreaterThan(g);
    expect(r).toBeGreaterThan(b);
  }
}
