import { test, expect } from '@playwright/test';
import path from 'path';

const HAR_FILE = path.join(process.cwd(), 'tests', 'ingredients.har');

test.describe('Constructor page integration', () => {
  test.beforeEach(async ({ page, context }) => {
    await context.routeFromHAR(HAR_FILE);
    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
      document.cookie = 'accessToken=Bearer mock-access-token; path=/';
    });
  });

  test('opens ingredient modal and closes by close button', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('text=Соберите бургер')).toBeVisible();

    const bunItem = page.locator('li:has-text("Тестовая булка")').first();
    await expect(bunItem).toContainText('Добавить');

    await bunItem.getByRole('link').click();
    await expect(page.locator('text=Детали ингредиента')).toBeVisible();
    await expect(page.locator('text=Тестовая булка')).toBeVisible();

    await page.locator('div[class*="modal"] button').first().click();
    await expect(page.locator('text=Детали ингредиента')).toHaveCount(0);
  });

  test('creates order, checks order number and clears constructor', async ({ page }) => {
    await page.goto('/');

    await page.locator('li:has-text("Тестовая булка")').first().getByRole('button', { name: 'Добавить' }).click();
    await page.locator('li:has-text("Тестовая начинка")').first().getByRole('button', { name: 'Добавить' }).click();

    await expect(page.locator('text=Тестовая булка (верх)')).toBeVisible();
    await expect(page.locator('text=Тестовая булка (низ)')).toBeVisible();
    await expect(page.locator('text=Тестовая начинка')).toBeVisible();

    await page.locator('button:has-text("Оформить заказ")').click();

    await expect(page.locator('text=12345')).toBeVisible();
    await expect(page.locator('text=Выберите булки')).toBeVisible();
    await expect(page.locator('text=Выберите начинку')).toBeVisible();

    await page.locator('div[class*="overlay"]').click();
    await expect(page.locator('text=12345')).toHaveCount(0);
  });
});
