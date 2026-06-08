import { test, expect } from '@playwright/test';

const HAR_FILE = 'tests/ingredients.har';

test.describe('Constructor page integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(HAR_FILE, {
      url: /\/api\//
    });

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
      document.cookie = 'accessToken=Bearer mock-access-token; path=/';
    });

    await page.goto('/');
  });

  test('opens ingredient modal and closes by close button', async ({
    page
  }) => {
    const bunCard = page.locator('li', { hasText: 'Тестовая булка' });

    await bunCard.click();

    await expect(page.getByText('Детали ингредиента')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.getByText('Детали ингредиента')).toHaveCount(0);
  });

  test('creates order, checks order number and clears constructor', async ({
    page
  }) => {
    const bunCard = page.locator('li', { hasText: 'Тестовая булка' });
    const mainCard = page.locator('li', { hasText: 'Тестовая начинка' });

    await bunCard.getByRole('button', { name: 'Добавить' }).click();
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.locator('text=Тестовая булка (верх)')).toBeVisible();
    await expect(page.locator('text=Тестовая булка (низ)')).toBeVisible();

    await expect(
      page.locator('.constructor-element__text', {
        hasText: 'Тестовая начинка'
      })
    ).toBeVisible();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByText('12345')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(page.getByText('12345')).toHaveCount(0);
  });
});
