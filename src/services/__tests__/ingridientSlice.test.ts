import { expect, test, describe } from '@jest/globals';

import ingredientReducer, {
  initialState,
  getIngredients,
} from '@services/ingridientSlice';

import type { TIngredient } from '@/utils/types';

const initialIngredient: TIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://code.s3.yandex.net/react/code/bun-02.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  },
];

describe('tests for ingredient', () => {

  test('state not exists', () => {
    const result = ingredientReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(result).toEqual(initialState);
  });

  test('test pending', () => {
    const result = ingredientReducer(
      initialState,
      getIngredients.pending('text_request')
    );
    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  test('test rejected', () => {
    const result = ingredientReducer(
      initialState,
      getIngredients.rejected(new Error('Error occured'), 'text_request')
    );
    expect(result.isLoading).toBe(false);
    expect(result.error?.message).toBe('Error occured');
    expect(result.ingredients).toEqual([]);
  });

  test('test fulfilled', () => {
    const result = ingredientReducer(
      initialState,
      getIngredients.fulfilled(initialIngredient, 'text_request')
    );
    expect(result.isLoading).toBe(false);
    expect(result.error).toBeNull();
    expect(result.ingredients).toEqual(initialIngredient);
  });
});
