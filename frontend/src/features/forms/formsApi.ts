import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { type Form, type Question, type Response } from '../../types/index.ts';

export const formsApi = createApi({
  reducerPath: 'formsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/forms',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    createForm: builder.mutation<Form, { title: string; description?: string; questions: Question[] }>({
      query: (formDetails) => ({
        url: '/',
        method: 'POST',
        body: formDetails,
      }),
    }),
    getAdminForms: builder.query<Form[], void>({
      query: () => '/',
    }),
    getFormById: builder.query<Form, string>({
      query: (formId) => `/${formId}`,
    }),
    getFormResponses: builder.query<Response[], string>({
      query: (formId) => `/${formId}/responses`,
    }),
  }),
});

export const {
  useCreateFormMutation,
  useGetAdminFormsQuery,
  useGetFormByIdQuery,
  useGetFormResponsesQuery,
} = formsApi;
