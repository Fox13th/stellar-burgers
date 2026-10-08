import { combineReducers } from '@reduxjs/toolkit';

import ConstructorReducer from './constructorSlice';
import FeedsReducer from './feedSlice';
import IngredientReducer from './ingridientSlice';
import OrderReducer from './orderSlice';
import UserReducer from './userSlice';

// TODO: Заменить на настоящий корневой редьюсер
export const rootReducer = combineReducers({
  // TODO: Собрать здесь редьюсеры слайсов
  user: UserReducer,
  ingredients: IngredientReducer,
  order: OrderReducer,
  burgerConstructor: ConstructorReducer,
  feed: FeedsReducer,
});
