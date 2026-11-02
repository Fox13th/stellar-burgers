import { test, expect } from '@playwright/test';

const mockOrder = {
  _id: 'mock-order',
  status: 'done',
  name: 'Бургер для теста',
  createdAt: '2026-10-31T12:00:00.000Z',
  updatedAt: '2026-10-31T12:00:00.000Z',
  number: 14322,
  ingredients: [
    '643d69a5c3f7b9001cfa093c',
    '643d69a5c3f7b9001cfa0941',
    '643d69a5c3f7b9001cfa0942',
  ],
};

const mockNewOrderResponse = {
  success: true,
  order: mockOrder,
  name: mockOrder.name,
};

test.beforeEach(async ({ page }) => {
  await page.routeFromHAR('./tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false,
  });

  await page.goto('/');
  await expect(page.getByTestId('preloader')).not.toBeVisible();
});

test.describe('add ingredients to constructor', function () {
  test('add bun and filling and sauce to the constructor', async ({ page }) => {
    //добавление ингредиентов из списка в конструктор
    await page.getByTestId('button_add-643d69a5c3f7b9001cfa093c').click();
    await page.getByTestId('button_add-643d69a5c3f7b9001cfa0941').click();
    await page.getByTestId('button_add-643d69a5c3f7b9001cfa0942').click();

    await expect(page.getByTestId('bun-top')).toHaveText(
      'Краторная булка N-200i (верх)1255'
    );
    await expect(page.getByTestId('fill')).toHaveText(
      'Биокотлета из марсианской Магнолии424Соус Spicy-X90'
    );
    await expect(page.getByTestId('bun-bottom')).toHaveText(
      'Краторная булка N-200i (низ)1255'
    );
  });
});

test.describe('modal window', function () {
  test.beforeEach(async ({ page }) => {
    //открытие модального окна ингредиента
    await page.getByTestId('ingredient-643d69a5c3f7b9001cfa0940').click();
    await expect(page.getByTestId('modal')).toBeVisible();
    await expect(page.getByTestId('ingrDetails-name')).toHaveText(
      'Говяжий метеорит (отбивная)'
    );
    await expect(page.getByTestId('ingrDetails-cal')).toHaveText('2674');
    await expect(page.getByTestId('ingrDetails-prot')).toHaveText('800');
    await expect(page.getByTestId('ingrDetails-fat')).toHaveText('800');
    await expect(page.getByTestId('ingrDetails-carb')).toHaveText('300');
  });

  //закрытие по клику на крестик
  test('close by cross', async ({ page }) => {
    await page.getByTestId('modal-close').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();
    await expect(page).toHaveURL('/');
  });

  //закрытие по клику на оверлей
  test('close by overlay', async ({ page }) => {
    await page.getByTestId('modal-overlay').click({ position: { x: 64, y: 25 } });
    await expect(page.getByTestId('modal')).not.toBeVisible();
    await expect(page).toHaveURL('/');
  });
});

test.describe('create order', function () {
  test.beforeEach(async ({ context, page }) => {
    await page.routeFromHAR('./tests/hars/user.har', {
      url: '**/api/auth/user',
      update: false,
    });

    await page.route('**/api/orders', (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockNewOrderResponse),
        });
      }
      return route.continue();
    });

    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer access-super-token',
        url: 'http://localhost:4000',
      },
    ]);

    await page.addInitScript(() => {
      localStorage.setItem('refreshToken', 'refresh-super-token');
    });
  });

  test('build a burger, make an order, show modal and clear constructor', async ({
    page,
  }) => {
    await page.goto('/');

    await expect(page.getByTestId('preloader')).not.toBeVisible();
    //Собираем бургер
    await page.getByTestId('button_add-643d69a5c3f7b9001cfa093c').click();
    await page.getByTestId('button_add-643d69a5c3f7b9001cfa0941').click();
    await page.getByTestId('button_add-643d69a5c3f7b9001cfa0942').click();

    await expect(page.getByTestId('bun-top')).toBeVisible();
    await expect(page.getByTestId('bun-top')).toHaveText(
      'Краторная булка N-200i (верх)1255'
    );
    await expect(page.getByTestId('fill')).toBeVisible();
    await expect(page.getByTestId('fill')).toHaveText(
      'Биокотлета из марсианской Магнолии424Соус Spicy-X90'
    );
    await expect(page.getByTestId('bun-bottom')).toBeVisible();
    await expect(page.getByTestId('bun-bottom')).toHaveText(
      'Краторная булка N-200i (низ)1255'
    );

    //Вызывается клик по кнопке «Оформить заказ»
    await page.getByTestId('but-order').click();

    //Проверяется, что модальное окно открылось и номер заказа верный
    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(page.getByTestId('order-number')).toHaveText('14322');

    //Проверяется, что конструктор пуст
    await expect(page.getByTestId('bun-top')).toHaveCount(0);
    await expect(page.getByTestId('fill')).toHaveText('Выберите начинку');
    await expect(page.getByTestId('bun-bottom')).toHaveCount(0);

    //Закрывается модальное окно и проверяется успешность закрытия
    await page.getByTestId('modal-close').click();
    await expect(page.getByTestId('modal')).not.toBeVisible();
    await expect(page).toHaveURL('/');
  });
});
