import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
} from '@/utils/burger-api';
import { deleteCookie, setCookie } from '@/utils/cookie';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder, TUser } from '../utils/types';
import type { TLoginData, TRegisterData } from '@/utils/burger-api';

export type UserState = {
  isAuthChecked: boolean;
  user: TUser | null;
  error: string | null;
  loginUserRequest: boolean;
  userOrders: TOrder[];
  userOrdersRequest: boolean;
};

const initialState: UserState = {
  isAuthChecked: false,
  user: null,
  error: null,
  loginUserRequest: false,
  userOrders: [],
  userOrdersRequest: false,
};

export const loginUser = createAsyncThunk('user/loginUser', async (data: TLoginData) =>
  loginUserApi(data).then((data) => {
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  })
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi().then(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  });
});

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) =>
    registerUserApi(data).then((response) => {
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response.user;
    })
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (date: Partial<TRegisterData>) => updateUserApi(date)
);

export const getOrders = createAsyncThunk('user/getorders', async () => {
  return await getOrdersApi();
});

export const getUser = createAsyncThunk('user/getUser', async () => {
  return await getUserApi();
});

const UserSlice = createSlice({
  name: 'user',
  initialState,
  selectors: {
    isAuthCheckedSelector: (state) => state.isAuthChecked,
    userDataSelector: (state) => state.user,
    userOrdersSelector: (state) => state.userOrders,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      //Авторизация
      .addCase(loginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.isAuthChecked = true;
        state.error = action.error.message!;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.error = null;
        state.loginUserRequest = false;
        state.isAuthChecked = true;
      })
      //Получение данных пользователя
      .addCase(getUser.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.error = action.error.message!;
        state.isAuthChecked = true;
        state.user = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.error = null;
        state.loginUserRequest = false;
        state.user = action.payload.user;
      })
      //Логаут
      .addCase(logoutUser.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.error = action.error.message!;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthChecked = true;
        state.error = null;
        state.loginUserRequest = false;
        state.user = null;
      })
      //Регистрация
      .addCase(registerUser.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.error.message!;
        state.loginUserRequest = false;
        state.isAuthChecked = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.error = null;
        state.loginUserRequest = false;
        state.user = action.payload;
      })
      //Обновление данных
      .addCase(updateUser.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error.message!;
        state.loginUserRequest = false;
        state.isAuthChecked = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.error = null;
        state.loginUserRequest = false;
        state.user = action.payload.user;
      })
      //История
      .addCase(getOrders.pending, (state) => {
        state.userOrdersRequest = true;
        state.error = null;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.error = action.error.message!;
        state.userOrdersRequest = false;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.error = null;
        state.userOrdersRequest = false;
        state.userOrders = action.payload;
      });
  },
});

export const { isAuthCheckedSelector, userDataSelector, userOrdersSelector } =
  UserSlice.selectors;
export default UserSlice.reducer;
