import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const promotionApi = createApi({
  reducerPath: "promotionApi",
  baseQuery: axiosBaseQuery({ baseUrl: `${API_BASE_URL}promotion`, useHttpClient: true }),

  tagTypes: ["Promotion"],  // This is similar to Movie tag for cache invalidation

  endpoints: (builder) => ({
    // Tạo khuyến mãi mới (Create a new promotion)
    createPromotion: builder.mutation({
      query: (formattedValues) => ({
        url: `/`,
        method: "POST",
        data: formattedValues,
      }),
      invalidatesTags: [{ type: "Promotion", id: "LISTPROMOTION" }],
    }),

    // Cập nhật khuyến mãi (Update a promotion)
    updatePromotion: builder.mutation({
        query: ({ id, ...promotionData }) => {                
          return {
            url: `/${id}`,
            method: "PUT",
            data: promotionData,
            useHttpClient: true,
          };
        },
        invalidatesTags: (result, error, { id }) => [
          { type: "Promotion", id },
          { type: "Promotion", id: "LISTPROMOTION" },
        ],
      }),
      
    // Xóa khuyến mãi (Delete a promotion)
    deletePromotion: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Promotion", id },
        { type: "Promotion", id: "LISTPROMOTION" },
      ],
    }),

    // Lấy danh sách khuyến mãi (Get all promotions)
    getPromotions: builder.query({
      query: (params) => {
        const { page, limit = 10, search = "", sort_order = "desc" } = params || {};
        
        // Xây dựng query params
        const queryParams = [];
        if (page) queryParams.push(`page=${page}`);
        if (limit) queryParams.push(`limit=${limit}`);
        if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
        if (sort_order) queryParams.push(`sort_order=${sort_order}`);
        
        let url = '/';
        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        }
        
        return { url };
      },
      providesTags: [{ type: "Promotion", id: "LISTPROMOTION" }],
    }),

    // Lấy khuyến mãi theo ID (Get a promotion by ID)
    getPromotionById: builder.query({
      query: (id) => ({
        url: `/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Promotion", id }],
    }),

    checkPromotion: builder.mutation({
      query: (data) => ({
        url: `/check`,
        method: "POST",
        data: data,
      }),
      providesTags: (result, error, code) => [{ type: "Promotion", id: code }],
    })
  }),
});

export const {
  useCreatePromotionMutation,
  useUpdatePromotionMutation,
  useDeletePromotionMutation,
  useGetPromotionsQuery,
  useGetPromotionByIdQuery,
  useCheckPromotionMutation,
} = promotionApi;
