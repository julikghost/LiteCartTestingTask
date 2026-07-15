import * as allure from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { EMPTY_STORAGE_STATE } from '@auth/storage';
import { products } from '@data/test-data';
import { test } from '@fixtures/base.fixture';

// Гостевой сценарий — без cookies залогиненного пользователя
test.use({ storageState: EMPTY_STORAGE_STATE });

test.describe('TC3 — Add products without login', () => {
  test.beforeEach(async () => {
    await allure.epic('LiteCart E2E');
    await allure.feature('Checkout');
    await allure.story('Guest cart and Recently Viewed');
    await allure.severity(Severity.NORMAL);
    await allure.tag('UI');
  });

  test('add two products as guest, empty customer data, Recently Viewed @allure.id=3', async ({ app }) => {
    const first = products.withoutDiscount;
    const second = products.secondGuestProduct;
    const total = first.unitPrice + second.unitPrice;

    await app.prepareGuestEmptyCart();
    await app.selectAndAddProduct(first, 1);
    await app.selectAndAddProduct(second, 1);
    await app.verifyCart(2, total);
    await app.openCheckoutAndVerify({
      items: [
        { name: first.name, quantity: 1, unitPrice: first.unitPrice },
        { name: second.name, quantity: 1, unitPrice: second.unitPrice },
      ],
      paymentDue: total,
    });
    await app.expectGuestCustomerDataEmpty();
    await app.expectRecentlyViewed([first.path, second.path]);
  });
});
