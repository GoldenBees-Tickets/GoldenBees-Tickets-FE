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
      query: (params) => {
        const { page = 1, limit = 10, search = "", sort_order = "desc", type = "" } = params || {};
        
        // Xây dựng query params
        const queryParams = [];
        if (page) queryParams.push(`page=${page}`);
        if (limit) queryParams.push(`limit=${limit}`);
        if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
        if (sort_order) queryParams.push(`sort_order=${sort_order}`);
        if (type) queryParams.push(`type=${type}`);
        
        let url = '/';
        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        }
        
        return { url };
      },
      providesTags: ["FoodAndDrink"],
    }),
    addFoodAndDrink: builder.mutation({
      query: (data) => ({
        url: "/", // Đảm bảo URL là chính xác
        method: "POST",
        data: data, // Dùng data thay vì body để phù hợp với axiosBaseQuery
        useHttpClient: true,
        isFormData: true,
      }),
      invalidatesTags: ["FoodAndDrink"],
    }),
    updateFoodAndDrink: builder.mutation({
      query: ({ id, data }) => ({
        url: `/${id}`, // Đảm bảo URL là chính xác
        method: "PUT",
        data: data, // Dùng data thay vì body
        useHttpClient: true,
        isFormData: true,
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
