import { getIngredientsApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from '../utils/types';
import type { SerializedError } from '@reduxjs/toolkit';

export type IngridientState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: SerializedError | null;
};

const initialState: IngridientState = {
  ingredients: [],
  isLoading: false,
  error: null,
};

export const getIngredients = createAsyncThunk(
  'ingredients/getingredients',
  async () => {
    return await getIngredientsApi();
  }
);

const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  selectors: {
    isIngredientLoadingSelector: (state) => state.isLoading,
    ingredientSelector: (state) => state.ingredients,
    ingredientErrorSelector: (state) => state.error,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
        state.ingredients = [];
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.ingredients = action.payload;
        state.error = null;
        state.isLoading = false;
      });
  },
});

export const {
  isIngredientLoadingSelector,
  ingredientSelector,
  ingredientErrorSelector,
} = ingredientSlice.selectors;
export default ingredientSlice.reducer;
