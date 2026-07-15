import { Page } from '@playwright/test';
import {
  HeaderComponent,
  LoginFormComponent,
  RecentlyViewedComponent,
} from '@components';
import { BasePage } from './BasePage';

/**
 * Home Page Object.
 * Состоит из компонентов: login form, header/cart, recently viewed.
 */
export class HomePage extends BasePage {
  readonly header: HeaderComponent;
  readonly loginForm: LoginFormComponent;
  readonly recentlyViewed: RecentlyViewedComponent;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);
    this.loginForm = new LoginFormComponent(page);
    this.recentlyViewed = new RecentlyViewedComponent(page);
  }

  async open(): Promise<void> {
    await this.goto('./');
  }

  async login(email: string, password: string): Promise<void> {
    await this.open();
    await this.loginForm.login(email, password);
  }

  async expectLoggedIn(): Promise<void> {
    await this.loginForm.expectLoggedIn();
  }

  async expectLoginFailed(): Promise<void> {
    await this.loginForm.expectLoginFailed();
  }

  async expectCartSummary(quantity: number, total: number): Promise<void> {
    await this.header.expectSummary(quantity, total);
  }

  async openCheckout(): Promise<void> {
    await this.header.openCheckout();
  }

  async expectRecentlyViewedContains(productPaths: string[]): Promise<void> {
    await this.recentlyViewed.expectContains(productPaths);
  }
}
