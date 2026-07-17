# LiteCart E2E — Playwright + TypeScript

Автотесты для [https://litecart.stqa.ru](https://litecart.stqa.ru).

---

## Тестовое задание

### Требования

| #   | Требование                             | Статус                                                                      |
| --- | -------------------------------------- | --------------------------------------------------------------------------- |
| 1   | Инструмент — **Playwright**            | ✅                                                                          |
| 2   | Язык — **TypeScript**                  | ✅                                                                          |
| 3   | Покрыть **все тест-кейсы** автотестами | ✅ TC1–TC4 + доп. успешный логин                                            |
| 4   | Показать **CSS** и **XPath** локаторы  | ✅                                                                          |
| 5   | Показать **регулярные выражения**      | ✅                                                                          |
| 6   | Выложить на **публичный GitHub**       | ✅ [LiteCartTestingTask](https://github.com/julikghost/LiteCartTestingTask) |
| 7   | Использовать известные **паттерны**    | ✅ POM, Component, Facade, Fixture, storageState                            |
| 8   | Отчёт **Allure** (не обязательно)      | ✅                                                                          |

**Сайт:** https://litecart.stqa.ru

### Тест-кейсы задания

#### Test case 1 — Заказ одного товара без скидки

Предусловие: корзина пустая.

| #   | Шаг                      | Ожидаемый результат                  |
| --- | ------------------------ | ------------------------------------ |
| 1   | Логин с тестовой учёткой | Логин успешен                        |
| 2   | Выбрать товар без скидки | Товар выбран                         |
| 3   | Добавить в корзину 3 шт. | Товары в корзине                     |
| 4   | Перейти в корзину        | Кол-во и цена соответствуют ожиданию |
| 5   | Подтвердить заказ        | Заказ создан успешно                 |

**Автотест:** `tests/checkout/order-without-discount.spec.ts`  
**Название:** `TC1 — Order one product without discount` → `login, add 3 Blue Duck, verify cart and confirm order`

#### Test case 2 — Заказ одного товара со скидкой

Предусловие: корзина пустая.

| #   | Шаг                      | Ожидаемый результат           |
| --- | ------------------------ | ----------------------------- |
| 1   | Логин с тестовой учёткой | Логин успешен                 |
| 2   | Выбрать товар со скидкой | Товар выбран                  |
| 3   | Добавить в корзину 2 шт. | Товары в корзине              |
| 4   | Перейти в корзину        | Кол-во и цена с учётом скидки |
| 5   | Подтвердить заказ        | Заказ создан успешно          |

**Автотест:** `tests/checkout/order-with-discount.spec.ts`  
**Название:** `TC2 — Order one product with discount` → `login, add 2 Yellow Duck (sale), verify discounted total and confirm`

#### Test case 3 — Заказ товара без логина

Предусловие: корзина пустая.

| #   | Шаг                                            | Ожидаемый результат                |
| --- | ---------------------------------------------- | ---------------------------------- |
| 1   | Выбрать два разных товара и добавить в корзину | Оба товара в корзине, сумма верна  |
| 2   | Проверить данные пользователя                  | Поля покупателя пустые             |
| 3   | Вернуться на домашнюю                          | Товары в блоке **Recently Viewed** |

**Автотест:** `tests/checkout/guest-cart-recently-viewed.spec.ts`  
**Название:** `TC3 — Add products without login` → `add two products as guest, empty customer data, Recently Viewed`

#### Test case 4 — Невалидный логин

| #   | Шаг                          | Ожидаемый результат                        |
| --- | ---------------------------- | ------------------------------------------ |
| 1   | Логин с некорректным паролем | Логин неуспешен                            |
| 2   | Проверить сообщение          | Красным выделено, что логин/пароль неверны |

**Автотест:** `tests/auth/invalid-login.spec.ts`  
**Название:** `TC4 — Invalid login` → `shows red error when password is incorrect (UI + API)`

#### Дополнительно — Успешная авторизация

Не входит в обязательные ТК задания; добавлен для проверки позитивного логина через UI.

| #   | Шаг                              | Ожидаемый результат                        |
| --- | -------------------------------- | ------------------------------------------ |
| 1   | Логин с валидными email/password | Логин успешен, виден блок Account / Logout |

**Автотест:** `tests/auth/successful-login.spec.ts`  
**Название:** `Auth — Successful login` → `user can log in with valid credentials`

### Сводка названий автотестов

| ТК   | Suite (`describe`)                         | Test title                                                             |
| ---- | ------------------------------------------ | ---------------------------------------------------------------------- |
| TC1  | `TC1 — Order one product without discount` | `login, add 3 Blue Duck, verify cart and confirm order`                |
| TC2  | `TC2 — Order one product with discount`    | `login, add 2 Yellow Duck (sale), verify discounted total and confirm` |
| TC3  | `TC3 — Add products without login`         | `add two products as guest, empty customer data, Recently Viewed`      |
| TC4  | `TC4 — Invalid login`                      | `shows red error when password is incorrect (UI + API)`                |
| доп. | `Auth — Successful login`                  | `user can log in with valid credentials`                               |

---

## Что сделано

### Покрытие

- Все 4 тест-кейса из задания (TC1–TC4)
- **Доп. тест:** успешная авторизация (`successful-login.spec.ts`)
- Проверки UI и API (корзина `ajax/cart.json`, логин/logout, очистка корзины)
- Allure-отчёт с epic / feature / story / severity / steps
- Кроссбраузер локально: Chromium, Firefox, WebKit, Edge
- CI на GitHub Actions (Chromium + Allure)

### Архитектура и паттерны

```
tests  →  LiteCartApp (facade)  →  pages  →  components  →  BasePage
                              ↘  LiteCartApi
```

- **Page Object Model** + **Component Object** (Header, LoginForm, RecentlyViewed)
- **Facade** (`LiteCartApp`) — в тестах только бизнес-шаги
- **Fixtures** — точка входа `app`
- **storageState** — логин один раз в `auth.setup.ts`, TC1/TC2 переиспользуют сессию
- Auth / guest сбрасывают cookies через `EMPTY_STORAGE_STATE`

### CSS / XPath / RegExp

| Тип    | Где смотреть                                              |
| ------ | --------------------------------------------------------- |
| CSS    | `LoginFormComponent`, `HeaderComponent`, `CheckoutPage`   |
| XPath  | logout-ссылка, Recently Viewed, ошибка логина             |
| RegExp | сообщения, виджет корзины, Payment Due, разбор rgb ошибки |

### Инфраструктура

- Креды и `BASE_URL` в `.env` (шаблон `.env.example`)
- Path aliases: `@app`, `@pages`, `@components`, `@api`, …
- ESLint + Prettier (`npm run lint` / `npm run format`)
- Автогенерация Allure после прогона + архив в `allure-history/`
- CI: typecheck, прогон, артефакты отчётов

---

## Быстрый старт

```bash
npm install
npx playwright install chromium
copy .env.example .env          # macOS/Linux: cp .env.example .env

npm test                        # Chromium + Allure
npm run test:headed             # с окном браузера
npm run allure:open             # открыть отчёт
```

## Структура проекта

```
├── .github/workflows/e2e.yml    # CI
├── playwright.config.ts
├── api/                         # HTTP/AJAX
├── app/                         # Facade (LiteCartApp)
├── auth/                        # storageState paths
├── components/                  # UI-блоки (Component Object)
├── data/                        # данные + креды из .env
├── fixtures/                    # Playwright fixtures
├── helpers/                     # цены, RegExp
├── pages/                       # Page Objects
├── tests/
│   ├── auth.setup.ts            # логин → .auth/user.json
│   ├── auth/                    # TC4 + успешный логин
│   └── checkout/                # TC1, TC2, TC3
└── scripts/                     # Allure generate / open
```

## Команды

| Команда                               | Описание                            |
| ------------------------------------- | ----------------------------------- |
| `npm test`                            | Основной прогон (Chromium) + Allure |
| `npm run test:cross`                  | Firefox + WebKit                    |
| `npm run test:all`                    | Chromium + Firefox + WebKit         |
| `npm run test:headed`                 | Chromium headed                     |
| `npm run test:auth` / `test:checkout` | По фичам                            |
| `npm run typecheck`                   | `tsc --noEmit`                      |
| `npm run lint` / `format`             | ESLint / Prettier                   |
| `npm run allure:open`                 | Открыть Allure                      |
| `npm run report`                      | Playwright HTML-отчёт               |

> **Edge:** по умолчанию выключен (иначе 5 красных без установленного браузера).  
> Включение: `WITH_EDGE=1 npx playwright test --project=edge` (нужен `npx playwright install msedge`).

## CI

[`.github/workflows/e2e.yml`](.github/workflows/e2e.yml)

- **Chromium** — typecheck + тесты + Allure
- Кроссбраузер (`npm run test:cross`) — только локально

Триггеры: push / PR в `main` \| `master`, ручной запуск.

Артефакты:

- `allure-report-chromium` — **single-file** `index.html` (можно открыть двойным кликом)
- `allure-results-chromium` — сырые результаты (при необходимости: `allure generate`)
- `playwright-report-chromium` — HTML Playwright
- при падении — `test-results` (trace/video)

> Обычный Allure-отчёт (папка) при открытии `index.html` из zip выглядит пустым — нужен сервер (`allure open`). В CI поэтому генерируется `--single-file`.
