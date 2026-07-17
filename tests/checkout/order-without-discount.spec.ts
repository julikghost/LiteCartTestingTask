import * as allure from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { products, quantities } from '@data/test-data';
import { test } from '@fixtures/base.fixture';

test.describe('TC1 — Order one product without discount', () => {
  test.beforeEach(async () => {
    await allure.allureId('1');
    await allure.epic('LiteCart E2E');
    await allure.feature('Checkout');
    await allure.story('Order without discount');
    await allure.severity(Severity.CRITICAL);
    await allure.tag('UI');
  });

  test('login, add 3 Blue Duck, verify cart and confirm order', async ({ app }) => {
    const product = products.withoutDiscount;
    const qty = quantities.withoutDiscount;
    const total = product.unitPrice * qty;

    await app.prepareLoggedInEmptyCart();
    await app.selectAndAddProduct(product, qty);
    await app.verifyCart(qty, total);
    await app.openCheckoutAndVerify({
      items: [{ name: product.name, quantity: qty, unitPrice: product.unitPrice }],
      paymentDue: total,
    });
    await app.confirmOrderSuccessfully();
  });
});
