import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const foodAndDrinkApi = createApi({
  reducerPath: "foodAndDrinkApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${API_BASE_URL}foodanddrink`,
    useHttpClient: true,
  }),
  tagTypes: ["FoodAndDrink"],
  endpoints: (builder) => ({
    getFoodAndDrinks: builder.query({
      query: () => ({
        url: "/",
      }),
      providesTags: ["FoodAndDrink"],
    }),
    addFoodAndDrink: builder.mutation({
      query: (data) => ({
        url: "/", // Đảm bảo URL là chính xác
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["FoodAndDrink"],
    }),
    updateFoodAndDrink: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`, // Đảm bảo URL là chính xác
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["FoodAndDrink"],
    }),
    deleteFoodAndDrink: builder.mutation({
      query: (id) => ({
        url: `/${id}`, // Đảm bảo URL là chính xác
        method: "DELETE",
      }),
      invalidatesTags: ["FoodAndDrink"],
    }),
  }),
});

export const {
  useGetFoodAndDrinksQuery,
  useAddFoodAndDrinkMutation,
  useUpdateFoodAndDrinkMutation,
  useDeleteFoodAndDrinkMutation,
} = foodAndDrinkApi;
