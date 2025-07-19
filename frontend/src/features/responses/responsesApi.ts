import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type Answer } from "../../types/index.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const responsesApi = createApi({
  reducerPath: "responsesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/responses`,
  }),
  tagTypes: ["Forms", "Form", "Responses"],
  endpoints: (builder) => ({
    submitResponse: builder.mutation<
      { message: string; responseId: string },
      { formId: string; answers: Answer[] }
    >({
      query: (responseDetails) => ({
        url: "/",
        method: "POST",
        body: responseDetails,
      }),
      // Invalidate the 'Responses' tag for the specific formId
      invalidatesTags: (_result, _error, { formId }) => [
        { type: 'Responses', id: formId },
        { type: 'Responses', id: 'LIST' },
      ],
    }),
  }),
});

export const { useSubmitResponseMutation } = responsesApi;
