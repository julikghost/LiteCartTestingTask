import * as allure from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { EMPTY_STORAGE_STATE } from '@auth/storage';
import { credentials } from '@data/test-data';
import { test } from '@fixtures/base.fixture';

// Негативный логин — только с пустой сессией
test.use({ storageState: EMPTY_STORAGE_STATE });

test.describe('TC4 — Invalid login', () => {
  test.beforeEach(async () => {
    await allure.epic('LiteCart E2E');
    await allure.feature('Authorization');
    await allure.story('Invalid credentials');
    await allure.severity(Severity.NORMAL);
    await allure.tag('UI');
  });

  test('shows red error when password is incorrect (UI + API) @allure.id=4', async ({ app }) => {
    await app.loginWithInvalidCredentials(
      credentials.invalid.email,
      credentials.invalid.password,
    );
  });
});
