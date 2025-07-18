import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { type Answer } from "../../types/index.ts";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const responsesApi = createApi({
  reducerPath: "responsesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${baseUrl}/api/responses`,
  }),
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
    }),
  }),
});

export const { useSubmitResponseMutation } = responsesApi;
