import * as allure from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { products, quantities } from '@data/test-data';
import { test } from '@fixtures/base.fixture';

test.describe('TC2 — Order one product with discount', () => {
  test.beforeEach(async () => {
    await allure.epic('LiteCart E2E');
    await allure.feature('Checkout');
    await allure.story('Order with discount');
    await allure.severity(Severity.CRITICAL);
    await allure.tag('UI');
  });

  test('login, add 2 Yellow Duck (sale), verify discounted total and confirm @allure.id=2', async ({ app }) => {
    const product = products.withDiscount;
    const qty = quantities.withDiscount;
    const total = product.campaignPrice * qty;

    // Сессия из storageState (auth.setup.ts)
    await app.prepareLoggedInEmptyCart();
    await app.selectAndAddProduct(product, qty, { size: product.size });
    await app.verifyCart(qty, total);
    await app.openCheckoutAndVerify({
      items: [{ name: product.name, quantity: qty, unitPrice: product.campaignPrice }],
      paymentDue: total,
    });
    await app.confirmOrderSuccessfully();
  });
});
