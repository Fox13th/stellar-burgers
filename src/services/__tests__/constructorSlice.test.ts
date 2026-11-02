import { expect, test, describe } from '@jest/globals';
import { constructorSelector, ConstructorState } from '@/services/constructorSlice';


import ConstructorReducer, {
  initialState,
  addIngredient,
  UpMove,
  DownMove,
  removeIngredient,
  clear,
} from '@services/constructorSlice';

import type { TConstructorIngredient } from '@/utils/types';

const initialBun: TConstructorIngredient = {
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
  id: '018317d6-659f-4656-a5fc-5833ffeae0f9',
};

const addFill: TConstructorIngredient = {
  _id: '643d69a5c3f7b9001cfa0944',
  name: 'Соус традиционный галактический',
  type: 'sauce',
  proteins: 42,
  fat: 24,
  carbohydrates: 42,
  calories: 99,
  price: 15,
  image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png',
  id: '3db961a7-6460-43d5-80f9-566bd7e133df',
};

const initialFill: TConstructorIngredient[] = [
  {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://code.s3.yandex.net/react/code/meat-01.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
    id: 'cf0b6a13-c9c4-4a50-a25a-8350d5e2e2fb',
  },
  {
    _id: '643d69a5c3f7b9001cfa0943',
    name: 'Соус фирменный Space Sauce',
    type: 'sauce',
    proteins: 50,
    fat: 22,
    carbohydrates: 11,
    calories: 14,
    price: 80,
    image: 'https://code.s3.yandex.net/react/code/sauce-04.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/sauce-04-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/sauce-04-large.png',
    id: 'da7a23e8-b66a-44ab-8f51-ffe1fe20794d',
  },
];

const testState: ConstructorState = {
  ...initialState,
  constructor: {
    bun: initialBun,
    ingredients: initialFill,
  },
};

describe('tests for constructor', () => {
  test('test selector returns constructor part of state', () => {
    const rootState = {
        burgerConstructor: testState,
    };

    const result = constructorSelector(rootState);
    expect(result).toEqual(testState.constructor);
  });

  test('state not exists', () => {
    const result = ConstructorReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(result).toEqual(initialState);
  });

  test('test add buns', () => {
    const result = ConstructorReducer(initialState, addIngredient(initialBun));
    expect(result.constructor.bun).toMatchObject({
      _id: initialBun._id,
      name: initialBun.name,
    });
    expect(result.constructor.ingredients).toEqual([]);
  });

  test('test add fillings', () => {
    const result = ConstructorReducer(testState, addIngredient(addFill));
    expect(result.constructor.ingredients).toHaveLength(3);
    expect(result.constructor.bun).toMatchObject({
      name: testState.constructor.bun!.name,
    });
  });

  test('test up move', () => {
    const result = ConstructorReducer(testState, UpMove(1));
    expect(result.constructor.ingredients[0]).toMatchObject({
      name: testState.constructor.ingredients[1].name,
    });
  });

  test('test down move', () => {
    const result = ConstructorReducer(testState, DownMove(0));
    expect(result.constructor.ingredients[1]).toMatchObject({
      name: testState.constructor.ingredients[0].name,
    });
  });

  test('test remove ingredient', () => {
    const result = ConstructorReducer(testState, removeIngredient(initialFill[1]));
    expect(result.constructor.bun).toEqual(testState.constructor.bun);
    expect(result.constructor.ingredients).toHaveLength(1);
    expect(result.constructor.ingredients[0]).toMatchObject({
      _id: initialFill[0]._id,
    });
  });

  test('test clear constructor', () => {
    const result = ConstructorReducer(testState, clear());
    expect(result.constructor.bun).toBeNull();
    expect(result.constructor.ingredients).toHaveLength(0);
    expect(result.error).toBeNull();
  });
});
