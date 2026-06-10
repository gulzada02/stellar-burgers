import { test, expect } from '@playwright/test';

const HAR_FILE = 'tests/hars/ingredients.har';

test.describe('Constructor page integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.routeFromHAR(HAR_FILE, {
      url: /\/api\//,
      update: false,
      notFound: 'abort'
    });

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
      document.cookie = 'accessToken=Bearer mock-access-token; path=/';
    });

    await page.goto('/');
    await expect(page.locator('li', { hasText: 'Тестовая булка' })).toBeVisible(
      { timeout: 15000 }
    );
    await expect(page.locator('#modals')).toBeAttached();
  });

  test('opens ingredient modal and closes it', async ({ page }) => {
    const bun = page.locator('li', { hasText: 'Тестовая булка' });
    const modal = page.locator('#modals');
    const ingredientLink = bun.getByRole('link');

    await expect(bun).toBeVisible({ timeout: 15000 });

    await bun.scrollIntoViewIfNeeded();
    await ingredientLink.click();

    const modalTitle = modal.getByRole('heading', {
      name: 'Детали ингредиента'
    });

    await expect(modal).toContainText('Детали ингредиента', {
      timeout: 15000
    });
    await expect(modalTitle).toBeVisible({ timeout: 15000 });
    await expect(
      modal.getByRole('heading', { name: 'Тестовая булка' })
    ).toBeVisible();
    await expect(modal.getByText('Калории, ккал')).toBeVisible();
    await expect(modal.getByText('100')).toBeVisible();
    await expect(modal.getByText('Белки, г')).toBeVisible();
    await expect(modal.getByText('10', { exact: true })).toBeVisible();
    await expect(modal.getByText('Жиры, г')).toBeVisible();
    await expect(modal.getByText('20')).toBeVisible();
    await expect(modal.getByText('Углеводы, г')).toBeVisible();
    await expect(modal.getByText('30')).toBeVisible();

    await page.keyboard.press('Escape');

    await expect(modal).toBeEmpty();
  });

  test('creates order and clears constructor', async ({ page }) => {
    const bun = page.locator('li', { hasText: 'Тестовая булка' });
    const main = page.locator('li', { hasText: 'Тестовая начинка 1' });

    await expect(bun).toBeVisible({ timeout: 15000 });
    await expect(main).toBeVisible({ timeout: 15000 });

    await bun.scrollIntoViewIfNeeded();
    await main.scrollIntoViewIfNeeded();

    await bun.getByRole('button', { name: 'Добавить' }).click();
    await main.getByRole('button', { name: 'Добавить' }).click();

    // проверка конструктора
    await expect(page.locator('text=Тестовая булка (верх)')).toBeVisible();
    await expect(page.locator('text=Тестовая булка (низ)')).toBeVisible();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    const orderModal = page.locator('#modals');

    const orderNumber = orderModal.getByRole('heading', {
      name: '12345'
    });

    await expect(orderNumber).toBeVisible({ timeout: 15000 });

    await page.keyboard.press('Escape');

    await expect(orderModal).toBeEmpty();

    // очистка конструктора
    await expect(page.locator('text=Тестовая булка (верх)')).toHaveCount(0);
    await expect(page.locator('text=Тестовая булка (низ)')).toHaveCount(0);
    await expect(page.locator('.constructor-element__text')).toHaveCount(0);
  });

  //MOVE UP
  test('moves ingredient up', async ({ page }) => {
    const bun = page.locator('li', { hasText: 'Тестовая булка' });
    const ingredient1 = page.locator('li', { hasText: 'Тестовая начинка 1' });
    const ingredient2 = page.locator('li', { hasText: 'Тестовая начинка 2' });

    await expect(bun).toBeVisible();
    await expect(ingredient1).toBeVisible();
    await expect(ingredient2).toBeVisible();

    await bun.getByRole('button', { name: 'Добавить' }).click();
    await ingredient1.getByRole('button', { name: 'Добавить' }).click();
    await ingredient2.getByRole('button', { name: 'Добавить' }).click();

    const item = page.locator('.constructor-element__text', {
      hasText: 'Тестовая начинка 2'
    });

    await expect(item).toBeVisible({ timeout: 15000 });

    const row = item.locator('xpath=ancestor::li');

    const upButton = row.locator('button').first();

    await expect(upButton).toBeVisible();

    await upButton.click();

    const items = page.locator('.constructor-element__text');

    await expect(items.nth(1)).toHaveText('Тестовая начинка 2');
    await expect(items.nth(2)).toHaveText('Тестовая начинка 1');
  });

  //MOVE DOWN
  test('moves ingredient down', async ({ page }) => {
    const bun = page.locator('li', { hasText: 'Тестовая булка' });
    const ingredient1 = page.locator('li', { hasText: 'Тестовая начинка 1' });
    const ingredient2 = page.locator('li', { hasText: 'Тестовая начинка 2' });

    await expect(bun).toBeVisible();
    await expect(ingredient1).toBeVisible();
    await expect(ingredient2).toBeVisible();

    await bun.getByRole('button', { name: 'Добавить' }).click();

    await ingredient1.scrollIntoViewIfNeeded();
    await ingredient2.scrollIntoViewIfNeeded();

    await ingredient1.getByRole('button', { name: 'Добавить' }).click();
    await ingredient2.getByRole('button', { name: 'Добавить' }).click();

    const first = page.locator('.constructor-element__text', {
      hasText: 'Тестовая начинка 1'
    });

    await expect(first).toBeVisible({ timeout: 15000 });

    const row = first.locator('xpath=ancestor::li');

    const downButton = row.locator('button').last();

    await expect(downButton).toBeVisible();

    await downButton.click();

    const items = page.locator('.constructor-element__text');

    await expect(items.nth(1)).toHaveText('Тестовая начинка 2');
    await expect(items.nth(2)).toHaveText('Тестовая начинка 1');
  });
});
