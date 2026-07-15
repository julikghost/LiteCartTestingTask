import fs from 'fs';
import path from 'path';
import { test as setup, expect } from '@playwright/test';
import { LiteCartApi } from '@api/LiteCartApi';
import { AUTH_STORAGE_PATH } from '@auth/storage';
import { credentials } from '@data/test-data';

setup('authenticate and save storageState', async ({ page }) => {
  fs.mkdirSync(path.dirname(AUTH_STORAGE_PATH), { recursive: true });

  const api = new LiteCartApi(page.request);
  await page.goto('./');
  await api.login(credentials.valid.email, credentials.valid.password);
  await api.clearCart();
  await api.expectCart(0, 0);

  await page.goto('./');
  await expect(page.locator('#box-account')).toBeVisible();
  await expect(
    page.locator('//div[@id="box-account"]//a[contains(@href, "logout")]'),
  ).toBeVisible();

  await page.context().storageState({ path: AUTH_STORAGE_PATH });
});
