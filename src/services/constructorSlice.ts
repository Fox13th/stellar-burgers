import { createSlice } from '@reduxjs/toolkit';

import type {
  TConstructorState,
  TConstructorIngredient,
  TIngredient,
} from '@/utils/types';
import type { PayloadAction, SerializedError } from '@reduxjs/toolkit';

export type ConstructorState = {
  constructor: TConstructorState;
  error: SerializedError | null;
};

const initialState: ConstructorState = {
  constructor: {
    bun: null,
    ingredients: [],
  },
  error: null,
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  selectors: {
    constructorSelector: (state: ConstructorState) => state.constructor,
  },
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.constructor.bun = action.payload;
        } else {
          state.constructor.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => {
        const id = crypto.randomUUID();
        return { payload: { ...ingredient, id } };
      },
    },
    UpMove: (state, action: PayloadAction<number>) => {
      const array = state.constructor.ingredients;
      const index = action.payload;
      array.splice(index - 1, 0, array.splice(index, 1)[0]);
    },
    DownMove: (state, action: PayloadAction<number>) => {
      const array = state.constructor.ingredients;
      const index = action.payload;
      array.splice(index + 1, 0, array.splice(index, 1)[0]);
    },
    removeIngredient: (state, action: PayloadAction<TConstructorIngredient>) => {
      state.constructor.ingredients = state.constructor.ingredients.filter(
        (ingredient) => ingredient.id !== action.payload.id
      );
    },
    clear: (state) => {
      state.constructor.bun = null;
      state.constructor.ingredients = [];
      state.error = null;
    },
  },
});

export const { constructorSelector } = constructorSlice.selectors;
export const { addIngredient, UpMove, DownMove, removeIngredient, clear } =
  constructorSlice.actions;
export default constructorSlice.reducer;
