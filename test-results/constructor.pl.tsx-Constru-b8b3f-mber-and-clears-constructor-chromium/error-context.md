# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: constructor.pl.tsx >> Constructor page integration >> creates order, checks order number and clears constructor
- Location: tests/constructor.pl.tsx:30:7

# Error details

```
Error: page.goto: net::ERR_FAILED at http://localhost:4000/
Call log:
  - navigating to "http://localhost:4000/", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import path from 'path';
  3  | 
  4  | const HAR_FILE = path.join(process.cwd(), 'tests', 'ingredients.har');
  5  | 
  6  | test.describe('Constructor page integration', () => {
  7  |   test.beforeEach(async ({ page, context }) => {
  8  |     await context.routeFromHAR(HAR_FILE);
  9  |     await page.addInitScript(() => {
  10 |       localStorage.setItem('refreshToken', 'mock-refresh-token');
  11 |       document.cookie = 'accessToken=Bearer mock-access-token; path=/';
  12 |     });
  13 |   });
  14 | 
  15 |   test('opens ingredient modal and closes by close button', async ({ page }) => {
  16 |     await page.goto('/');
  17 |     await expect(page.locator('text=Соберите бургер')).toBeVisible();
  18 | 
  19 |     const bunItem = page.locator('li:has-text("Тестовая булка")').first();
  20 |     await expect(bunItem).toContainText('Добавить');
  21 | 
  22 |     await bunItem.getByRole('link').click();
  23 |     await expect(page.locator('text=Детали ингредиента')).toBeVisible();
  24 |     await expect(page.locator('text=Тестовая булка')).toBeVisible();
  25 | 
  26 |     await page.locator('div[class*="modal"] button').first().click();
  27 |     await expect(page.locator('text=Детали ингредиента')).toHaveCount(0);
  28 |   });
  29 | 
  30 |   test('creates order, checks order number and clears constructor', async ({ page }) => {
> 31 |     await page.goto('/');
     |                ^ Error: page.goto: net::ERR_FAILED at http://localhost:4000/
  32 | 
  33 |     await page.locator('li:has-text("Тестовая булка")').first().getByRole('button', { name: 'Добавить' }).click();
  34 |     await page.locator('li:has-text("Тестовая начинка")').first().getByRole('button', { name: 'Добавить' }).click();
  35 | 
  36 |     await expect(page.locator('text=Тестовая булка (верх)')).toBeVisible();
  37 |     await expect(page.locator('text=Тестовая булка (низ)')).toBeVisible();
  38 |     await expect(page.locator('text=Тестовая начинка')).toBeVisible();
  39 | 
  40 |     await page.locator('button:has-text("Оформить заказ")').click();
  41 | 
  42 |     await expect(page.locator('text=12345')).toBeVisible();
  43 |     await expect(page.locator('text=Выберите булки')).toBeVisible();
  44 |     await expect(page.locator('text=Выберите начинку')).toBeVisible();
  45 | 
  46 |     await page.locator('div[class*="overlay"]').click();
  47 |     await expect(page.locator('text=12345')).toHaveCount(0);
  48 |   });
  49 | });
  50 | 
```