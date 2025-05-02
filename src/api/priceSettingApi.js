import { createApi } from '@reduxjs/toolkit/query/react';
import axiosBaseQuery from "./authQuery/axiosBaseQuery";
import { get } from 'react-hook-form';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const priceSettingApi = createApi({
  reducerPath: 'priceSettingApi',
  baseQuery: axiosBaseQuery({
    baseUrl: `${API_BASE_URL}priceSetting`,
    useHttpClient: true,
  }),
  tagTypes: ['PriceSettings'],
  endpoints: (builder) => ({
    // Price Settings
    getPriceSettings: builder.query({
      query: () => ({
        url: '',
      }),
      providesTags: ['PriceSettings']
    }),
    addPriceSetting: builder.mutation({
      query: (data) => ({
        url: '/',
        method: 'POST',
        data
      }),
      invalidatesTags: ['PriceSettings']
    }),
    updatePriceSetting: builder.mutation({
      query: (data) => ({
        url: `/${data.id}`,
        method: 'PUT',
        data
      }),
      invalidatesTags: ['PriceSettings']
    }),

    // Holiday Pricing
    getHolidayPricing: builder.query({
      query: () => ({
        url: '/holiday',
      }),
      providesTags: ['PriceSettings']
    }),
    addHolidayPricing: builder.mutation({
      query: (data) => ({
        url: '/holiday',
        method: 'POST',
        data
      }),
      invalidatesTags: ['PriceSettings']
    }),
    updateHolidayPricing: builder.mutation({
      query: (data) => ({
        url: `/holiday/${data.id}`,
        method: 'PUT',
        data
      }),
      invalidatesTags: ['PriceSettings']
    }),
  })
});

export const { 
  useGetPriceSettingsQuery,
  useAddPriceSettingMutation,
  useUpdatePriceSettingMutation,

  useGetHolidayPricingQuery,
  useAddHolidayPricingMutation,
  useUpdateHolidayPricingMutation,
} = priceSettingApi;
