import * as allure from 'allure-js-commons';
import { Severity } from 'allure-js-commons';
import { EMPTY_STORAGE_STATE } from '@auth/storage';
import { credentials } from '@data/test-data';
import { test } from '@fixtures/base.fixture';

// UI-логин нужен с чистой сессии, не из storageState
test.use({ storageState: EMPTY_STORAGE_STATE });

test.describe('Auth — Successful login', () => {
  test.beforeEach(async () => {
    await allure.epic('LiteCart E2E');
    await allure.feature('Authorization');
    await allure.story('Successful login');
    await allure.severity(Severity.CRITICAL);
    await allure.tag('UI');
  });

  test('user can log in with valid credentials @allure.id=5', async ({ app }) => {
    await app.loginWithValidCredentials(
      credentials.valid.email,
      credentials.valid.password,
    );
  });
});
