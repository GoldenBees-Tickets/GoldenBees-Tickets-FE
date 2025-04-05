import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${API_BASE_URL}order`,
    useHttpClient: true,
  }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    addOrder: builder.mutation({
      query: ({ user_id, total, amount, seat_ids, showtime_id, combos, promotion_id, orderInfo }) => {        
        return {
          url: `/pay-with-momo`,
          method: "POST",
          data: { user_id, total, amount, seat_ids, showtime_id, combos, promotion_id, orderInfo },  // Sửa từ `data` thành `body`
        };
      },
      invalidatesTags: [{ type: "Order", id: "ORDER" }],
    }),

    //Check order
    checkOrder: builder.query({
      query: (id) => ({
        url: `/status/${id}` 
      }),
      providesTags: ["Order"],
    }),

    getOrderByUser: builder.query({
      query: (user_id) => ({
        url: `/${user_id}` 
      }),
      providesTags: ["Order"],
    }),

    getOrders: builder.query({
      query: () => ({
        url: `/` 
      }),
      providesTags: ["Order"],
    })
  }),  
});

// Xuất các hook tự động được tạo ra
export const {
 useAddOrderMutation,
 useCheckOrderQuery,
 useGetOrderByUserQuery,
 useGetOrdersQuery
} = orderApi;
