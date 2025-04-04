import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const priceSettingApi = createApi({
  reducerPath: "priceSettingApi",
  baseQuery: axiosBaseQuery({ baseUrl: `${API_BASE_URL}priceSetting`, useHttpClient: true,  }),
  endpoints: (builder) => ({
    getPriceSettings: builder.query({
      query: (branch_id) => ({
        url: `/${branch_id}`,
      }),
      providesTags: [{ type: "PriceSetting", id: "PRICESETTING" }],
    }),
    createPriceSetting: builder.mutation({
      query: (dataSubmit) => ({
        url: `/`,
        method: "POST",
        data: dataSubmit,      
    }),
      invalidatesTags: [{ type: "PriceSetting", id: "PRICESETTING" }],
    }),

    updatePriceSetting: builder.mutation({
      query: ({ id, name }) => ({
        url: `/${id}`,
        method: "PUT",
        body: { name },
        useHttpClient: true,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "PriceSetting", id }],
    }),
  }),
});

export const {
  useGetPriceSettingsQuery,
  useCreatePriceSettingMutation,
  useUpdatePriceSettingMutation,
} = priceSettingApi;
