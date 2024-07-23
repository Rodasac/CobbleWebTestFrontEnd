import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LoginState {
  token: string | null;
}

const initialState: LoginState = {
  token: null,
};

export const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    login(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    logout(state) {
      state.token = null;
    },
  },
  selectors: {
    isLoggedIn: (state) => state.token !== null,
    selectToken: (state) => state.token,
  },
});

export const { login, logout } = loginSlice.actions;

export const { isLoggedIn, selectToken } = loginSlice.selectors;
