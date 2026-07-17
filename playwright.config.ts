import { defineConfig, devices, Project } from '@playwright/test';
import dotenv from 'dotenv';
import { AUTH_STORAGE_PATH } from './src/auth/storage';

dotenv.config();

const BASE_URL = (process.env.BASE_URL?.trim() || 'https://litecart.stqa.ru/en/').replace(
  /\/?$/,
  '/',
);

/**
 * Playwright config for LiteCart E2E suite.
 *
 * storageState:
 * - setup → логин один раз, пишет .auth/user.json
 * - browser projects зависят от setup и подключают storageState
 * - auth/guest тесты сбрасывают сессию через test.use(EMPTY_STORAGE_STATE)
 *
 * Edge: только при WITH_EDGE=1 (нужен установленный msedge).
 */
const browserProjects: Project[] = [
  {
    name: 'chromium',
    dependencies: ['setup'],
    testIgnore: /auth\.setup\.ts/,
    use: {
      ...devices['Desktop Chrome'],
      storageState: AUTH_STORAGE_PATH,
    },
  },
  {
    name: 'firefox',
    dependencies: ['setup'],
    testIgnore: /auth\.setup\.ts/,
    use: {
      ...devices['Desktop Firefox'],
      storageState: AUTH_STORAGE_PATH,
    },
  },
  {
    name: 'webkit',
    dependencies: ['setup'],
    testIgnore: /auth\.setup\.ts/,
    use: {
      ...devices['Desktop Safari'],
      storageState: AUTH_STORAGE_PATH,
    },
  },
];

if (process.env.WITH_EDGE === '1' || process.env.WITH_EDGE === 'true') {
  browserProjects.push({
    name: 'edge',
    dependencies: ['setup'],
    testIgnore: /auth\.setup\.ts/,
    use: {
      ...devices['Desktop Edge'],
      channel: 'msedge',
      storageState: AUTH_STORAGE_PATH,
    },
  });
}

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // workers: 1 — общий демо-аккаунт/корзина; параллель ломает TC1/TC2
  workers: 1,
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    [
      'allure-playwright',
      {
        detail: true,
        suiteTitle: false,
        environmentInfo: {
          E2E_NODE_VERSION: process.version,
          E2E_OS: process.platform,
          BASE_URL,
        },
      },
    ],
  ],
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'setup',
      testMatch: /auth\.setup\.ts/,
    },
    ...browserProjects,
  ],
});
