import { Locator, Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { formatUsdFixed, parseMoney } from '@helpers/price';

export class CheckoutPage extends BasePage {
  readonly cartBox: Locator;
  readonly customerBox: Locator;
  readonly summaryBox: Locator;
  readonly confirmOrderButton: Locator;
  readonly removeItemButton: Locator;
  readonly cartItems: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.cartBox = page.locator('#box-checkout-cart');
    this.customerBox = page.locator('#box-checkout-customer');
    this.summaryBox = page.locator('#box-checkout-summary');
    this.confirmOrderButton = page.locator('button[name="confirm_order"]');
    this.cartItems = page.locator('#box-checkout-cart li.item');
    this.emptyCartMessage = page.getByText(/There are no items in your cart/i);

    this.removeItemButton = page.locator(
      '//div[@id="box-checkout-cart"]//button[@name="remove_cart_item"]',
    );
  }

  async open(): Promise<void> {
    await this.goto('checkout');
  }

  async expectLineItem(productName: string, quantity: number, unitPrice: number): Promise<void> {
    const row = this.summaryBox
      .locator('table.dataTable tr')
      .filter({ has: this.page.locator('td.item', { hasText: productName }) });

    await expect(row).toBeVisible();
    await expect(row.locator('td').first()).toHaveText(String(quantity));
    await expect(row.locator('td.item')).toContainText(productName);

    expect(parseMoney(await row.locator('td.unit-cost').innerText())).toBe(unitPrice);
    expect(parseMoney(await row.locator('td.sum').innerText())).toBe(quantity * unitPrice);
  }

  async expectPaymentDue(total: number): Promise<void> {
    const footer = this.summaryBox.locator('tr.footer');
    await expect(footer).toContainText(/Payment Due/i);
    const dueText = await footer.locator('td').last().innerText();
    expect(parseMoney(dueText)).toBe(total);
    expect(dueText.replace(/\s/g, '')).toMatch(
      new RegExp(`\\$${total.toFixed(2).replace('.', '\\.')}`),
    );
    expect(formatUsdFixed(total)).toBe(`$${total.toFixed(2)}`);
  }

  async expectCustomerFieldsEmpty(): Promise<void> {
    await expect(this.customerBox).toBeVisible();

    const values = await this.customerBox.evaluate((box) => {
      const fields = Array.from(
        box.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
          'input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"]), textarea',
        ),
      );
      return fields.map((field) => ({
        name: field.getAttribute('name') ?? '',
        value: (field.value ?? '').trim(),
      }));
    });

    const personalFields = values.filter((field) =>
      /firstname|lastname|address1|address2|postcode|city|email|phone|company|tax_id/i.test(
        field.name,
      ),
    );

    expect(personalFields.length).toBeGreaterThan(0);
    for (const field of personalFields) {
      expect(field.value, `Expected empty customer field: ${field.name}`).toBe('');
    }
  }

  async confirmOrder(): Promise<void> {
    await this.confirmOrderButton.click();
    await this.page.waitForURL(/order_success/, { timeout: 20_000 });
  }

  async expectCartContents(
    items: Array<{ name: string; quantity: number; unitPrice: number }>,
    paymentDue: number,
  ): Promise<void> {
    for (const item of items) {
      await this.expectLineItem(item.name, item.quantity, item.unitPrice);
    }
    await this.expectPaymentDue(paymentDue);
  }
}
