import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type User } from "../../types/index.ts";
import { authApi } from "./authApi";
import { formsApi } from "../forms/formsApi";
import { responsesApi } from "../responses/responsesApi";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const user = localStorage.getItem("user");
const token = localStorage.getItem("token");

const initialState: AuthState = {
  user: user ? JSON.parse(user) : null,
  token: token || null,
  isAuthenticated: !!token,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", action.payload.token);
      // Invalidate all API cache tags on successful login/registration
      authSlice.caseReducers.resetAllApiState();
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      // Invalidate all API cache tags on logout
      authSlice.caseReducers.resetAllApiState();
    },
    // New internal reducer to handle full API state reset
    resetAllApiState: () => {
      // This action will be handled by RTK Query middleware to reset API state
      // This clears all cached data across the specified API slices.
      formsApi.util.resetApiState();
      responsesApi.util.resetApiState();
      authApi.util.resetApiState();
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(authApi.endpoints.login.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        localStorage.setItem("user", JSON.stringify(action.payload));
        localStorage.setItem("token", action.payload.token);
      })
      .addMatcher(authApi.endpoints.login.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as any)?.message || "Login failed";
      })
      .addMatcher(authApi.endpoints.register.matchPending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addMatcher(
        authApi.endpoints.register.matchFulfilled,
        (state, action) => {
          state.isLoading = false;
          state.user = action.payload;
          state.token = action.payload.token;
          state.isAuthenticated = true;
          localStorage.setItem("user", JSON.stringify(action.payload));
          localStorage.setItem("token", action.payload.token);
        }
      )
      .addMatcher(authApi.endpoints.register.matchRejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as any)?.message || "Registration failed";
      });
  },
});

export const { setCredentials, logout, resetAllApiState } = authSlice.actions;
export default authSlice.reducer;
