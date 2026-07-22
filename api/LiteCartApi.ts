import { APIRequestContext, expect } from '@playwright/test';
import { wrongCredentialsPattern } from '@helpers/price';

export type CartJson = {
  quantity: number;
  value: number;
  formatted_value: string;
};

function baseUrl(): string {
  return (process.env.BASE_URL?.trim() || 'https://litecart.stqa.ru/en/').replace(/\/?$/, '/');
}

export class LiteCartApi {
  constructor(private readonly request: APIRequestContext) {}

  async getCsrfToken(fromPath = './'): Promise<string> {
    const response = await this.request.get(fromPath);
    expect(response.ok(), `Failed to open ${fromPath} for CSRF token`).toBeTruthy();
    const html = await response.text();
    const match = html.match(/name="token"\s+value="([a-f0-9]+)"/i);
    expect(match, `CSRF token not found on ${fromPath}`).toBeTruthy();
    return match![1];
  }

  async getCart(): Promise<CartJson> {
    const response = await this.request.get('./ajax/cart.json');
    expect(response.ok(), 'GET /ajax/cart.json failed').toBeTruthy();
    expect(response.headers()['content-type'] ?? '').toMatch(/application\/json/i);
    return response.json() as Promise<CartJson>;
  }

  async expectCart(quantity: number, value: number): Promise<CartJson> {
    const cart = await this.getCart();
    expect(cart.quantity).toBe(quantity);
    expect(cart.value).toBe(value);
    expect(cart.formatted_value).toMatch(new RegExp(`\\$${value}\\b`));
    return cart;
  }

  async login(email: string, password: string): Promise<void> {
    const token = await this.getCsrfToken('./');
    const response = await this.request.post('./login', {
      form: {
        token,
        redirect_url: baseUrl(),
        email,
        password,
        login: 'Login',
      },
      maxRedirects: 0,
      failOnStatusCode: false,
    });

    const status = response.status();
    if (![302, 303].includes(status)) {
      const body = await response.text();
      const hint = wrongCredentialsPattern.test(body)
        ? ' Server rejected credentials (wrong password, disabled, or missing account). Check TEST_USER_EMAIL / TEST_USER_PASSWORD in .env.'
        : '';
      throw new Error(`Expected login redirect 302/303, got ${status}.${hint}`);
    }
  }

  async loginExpectFailure(email: string, password: string): Promise<void> {
    const token = await this.getCsrfToken('./');
    const response = await this.request.post('./login', {
      form: {
        token,
        email,
        password,
        login: 'Login',
      },
      failOnStatusCode: false,
    });

    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toMatch(wrongCredentialsPattern);
  }

  async logout(): Promise<void> {
    const response = await this.request.get('./logout', {
      maxRedirects: 5,
      failOnStatusCode: false,
    });
    expect(response.ok() || [302, 303].includes(response.status())).toBeTruthy();
  }

  async clearCart(): Promise<void> {
    for (let attempt = 0; attempt < 5; attempt++) {
      const cart = await this.getCart();
      if (cart.quantity === 0) {
        return;
      }

      const checkout = await this.request.get('./checkout');
      expect(checkout.ok(), 'GET /checkout failed while clearing cart').toBeTruthy();
      const html = await checkout.text();

      if (/There are no items in your cart/i.test(html)) {
        return;
      }

      const token = html.match(/name="token"\s+value="([a-f0-9]+)"/i)?.[1];
      const key = html.match(/name="key"\s+value="([^"]+)"/i)?.[1];
      expect(token && key, 'Cart item key/token not found on checkout').toBeTruthy();

      const remove = await this.request.post('./checkout', {
        form: {
          token: token!,
          key: key!,
          remove_cart_item: 'Remove',
        },
        maxRedirects: 5,
        failOnStatusCode: false,
      });
      expect([200, 302, 303]).toContain(remove.status());
    }

    await this.expectCart(0, 0);
  }
}
