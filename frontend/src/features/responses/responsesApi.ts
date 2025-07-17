import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { type Answer } from '../../types/index.ts';

export const responsesApi = createApi({
  reducerPath: 'responsesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:5000/api/responses',
  }),
  endpoints: (builder) => ({
    submitResponse: builder.mutation<
      { message: string; responseId: string },
      { formId: string; answers: Answer[] }
    >({
      query: (responseDetails) => ({
        url: '/',
        method: 'POST',
        body: responseDetails,
      }),
    }),
  }),
});

export const { useSubmitResponseMutation } = responsesApi;
