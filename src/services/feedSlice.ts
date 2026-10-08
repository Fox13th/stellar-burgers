import { getFeedsApi, getOrderByNumberApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '../utils/types';
import type { SerializedError } from '@reduxjs/toolkit';

export type FeedSlice = {
  orders: TOrder[];
  order: TOrder | null;
  total: number;
  totalToday: number;
  isLoading: boolean;
  isOrderLoading: boolean;
  error: SerializedError | null;
  errorOrder: SerializedError | null;
};

const initialState: FeedSlice = {
  orders: [],
  order: null,
  total: 0,
  totalToday: 0,
  isLoading: false,
  isOrderLoading: false,
  error: null,
  errorOrder: null,
};

export const getFeeds = createAsyncThunk('feed/getfeeds', async () => {
  return await getFeedsApi();
});

export const getOrderByNumber = createAsyncThunk(
  'feed/getorder',
  async (number: number) => {
    return await getOrderByNumberApi(number);
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  selectors: {
    feedOrdersSelector: (state) => state.orders,
    feedOrderSelector: (state) => state.order,
    feedTotalSelector: (state) => state.total,
    feedTotalTodaySelector: (state) => state.totalToday,
    feedIsLoadingSelector: (state) => state.isLoading,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })

      .addCase(getOrderByNumber.pending, (state) => {
        state.isOrderLoading = true;
        state.errorOrder = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.errorOrder = action.error;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.errorOrder = null;
        state.order = action.payload.orders[0];
      });
  },
});

export const {
  feedOrdersSelector,
  feedTotalSelector,
  feedTotalTodaySelector,
  feedOrderSelector,
} = feedSlice.selectors;
export default feedSlice.reducer;
