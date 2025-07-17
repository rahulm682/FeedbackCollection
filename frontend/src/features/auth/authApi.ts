import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { User } from '../../types'; // Already imported by other files

interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  token: string;
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/auth", // Replace with your backend URL
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token; // Access token from auth slice
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    register: builder.mutation<
      AuthResponse,
      { name: string; email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/register",
        method: "POST",
        body: credentials,
      }),
    }),
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const { useRegisterMutation, useLoginMutation } = authApi;
