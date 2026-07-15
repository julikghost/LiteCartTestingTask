import { Locator, Page, expect } from '@playwright/test';
import { HeaderComponent } from '@components';
import { BasePage } from './BasePage';

/**
 * Product Page Object — карточка товара, qty, options, Add to Cart.
 */
export class ProductPage extends BasePage {
  readonly header: HeaderComponent;
  readonly title: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly sizeSelect: Locator;
  readonly regularPrice: Locator;
  readonly campaignPrice: Locator;

  constructor(page: Page) {
    super(page);
    this.header = new HeaderComponent(page);

    // CSS
    this.title = page.locator('#box-product h1.title');
    this.quantityInput = page.locator('form[name="buy_now_form"] input[name="quantity"]');
    this.addToCartButton = page.locator('button[name="add_cart_product"]');
    this.regularPrice = page.locator('#box-product .regular-price');
    this.campaignPrice = page.locator('#box-product .campaign-price');

    // XPath
    this.sizeSelect = page.locator('//form[@name="buy_now_form"]//select[contains(@name, "Size")]');
  }

  async open(productPath: string): Promise<void> {
    await this.goto(productPath);
    await expect(this.title).toBeVisible();
  }

  async expectProductSelected(productName: string): Promise<void> {
    await expect(this.title).toHaveText(new RegExp(productName, 'i'));
  }

  async selectSize(size: string): Promise<void> {
    await this.sizeSelect.selectOption(size);
  }

  async addToCart(quantity: number, options?: { size?: string }): Promise<void> {
    const previous = await this.header.getState();

    if (options?.size) {
      await this.selectSize(options.size);
    }

    await this.quantityInput.fill(String(quantity));
    await this.addToCartButton.click();

    await expect(this.header.quantity).toHaveText(String(previous.quantity + quantity), {
      timeout: 15_000,
    });
  }

  /** Бизнес-метод: открыть товар → убедиться → добавить в корзину. */
  async selectAndAdd(
    productPath: string,
    productName: string,
    quantity: number,
    options?: { size?: string },
  ): Promise<void> {
    await this.open(productPath);
    await this.expectProductSelected(productName);
    await this.addToCart(quantity, options);
  }
}
