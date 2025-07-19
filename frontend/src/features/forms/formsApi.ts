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
  tagTypes: ["Forms", "Form", "Responses"],
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
      invalidatesTags: [{ type: 'Forms', id: 'LIST' }],
    }),
    getAdminForms: builder.query<Form[], void>({
      query: () => "/",
      providesTags: [{ type: 'Forms', id: 'LIST' }],
    }),
    getFormById: builder.query<Form, string>({
      query: (formId) => `/${formId}`,
      providesTags: (_result, _error, id) => [{ type: 'Form', id }],
    }),
    getFormResponses: builder.query<Response[], string>({
      query: (formId) => `/${formId}/responses`,
      // Provide a tag for responses associated with a specific formId
      providesTags: (result, _error, formId) =>
        result
          ? [
              { type: 'Responses', id: formId },
              { type: 'Responses', id: 'LIST' }, 
            ]
          : [{ type: 'Responses', id: 'LIST' }],
    }),
    deleteForm: builder.mutation<void, string>({
      query: (formId) => ({
        url: `/${formId}`,
        method: "DELETE",
      }),
      // This invalidates the cache for getAdminForms, forcing a refetch after deletion
      invalidatesTags: (_result, _error, id) => [
        { type: 'Forms', id: 'LIST' },
        { type: 'Form', id },
        { type: 'Responses', id }, // Also invalidate responses for this form
        { type: 'Responses', id: 'LIST' }, // Invalidate overall responses list
      ],
    }),
    getAdminFormDetails: builder.query<Form, string>({
      query: (formId) => `/${formId}/admin-details`,
      providesTags: (_result, _error, id) => [{ type: "Form", id }],
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
