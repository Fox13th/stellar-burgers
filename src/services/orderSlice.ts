import { orderBurgerApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '../utils/types';
import type { SerializedError } from '@reduxjs/toolkit';

export type OrdersSlice = {
  order: TOrder | null;
  isLoading: boolean;
  error: SerializedError | null;
};

const initialState: OrdersSlice = {
  order: null,
  isLoading: false,
  error: null,
};

export const postOrder = createAsyncThunk('order/postorder', async (data: string[]) => {
  return await orderBurgerApi(data);
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  selectors: {
    isOrderLoadingSelector: (state) => state.isLoading,
    orderSelector: (state) => state.order,
  },
  reducers: {
    removeOrder: (state) => {
      state.error = null;
      state.isLoading = false;
      state.order = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(postOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
        state.order = null;
      })
      .addCase(postOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.order = action.payload.order;
      });
  },
});

export const { removeOrder } = orderSlice.actions;
export const { isOrderLoadingSelector, orderSelector } = orderSlice.selectors;
export default orderSlice.reducer;
