import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type Form, type Question, type Response } from "../../types/index.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const formsApi = createApi({
  reducerPath: "formsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/forms`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Forms", "Form"],
  endpoints: (builder) => ({
    createForm: builder.mutation<
      Form,
      {
        title: string;
        description?: string;
        questions: Question[];
        expiresAt: undefined | string;
      }
    >({
      query: (formDetails) => ({
        url: "/",
        method: "POST",
        body: formDetails,
      }),
    }),
    getAdminForms: builder.query<Form[], void>({
      query: () => "/",
      providesTags: ["Forms"],
    }),
    getFormById: builder.query<Form, string>({
      query: (formId) => `/${formId}`,
    }),
    getFormResponses: builder.query<Response[], string>({
      query: (formId) => `/${formId}/responses`,
    }),
    deleteForm: builder.mutation<void, string>({
      query: (formId) => ({
        url: `/${formId}`,
        method: "DELETE",
      }),
      // This invalidates the cache for getAdminForms, forcing a refetch after deletion
      invalidatesTags: ["Forms"],
    }),
    getAdminFormDetails: builder.query<Form, string>({
      query: (formId) => `/${formId}/admin-details`,
      providesTags: (result, error, id) => [{ type: "Form", id }],
    }),
  }),
});

export const {
  useCreateFormMutation,
  useGetAdminFormsQuery,
  useGetFormByIdQuery,
  useGetFormResponsesQuery,
  useDeleteFormMutation,
  useGetAdminFormDetailsQuery,
} = formsApi;
