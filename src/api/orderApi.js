import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const orderApi = createApi({
  reducerPath: "orderApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${API_BASE_URL}order`,
    useHttpClient: true, // Sử dụng httpClient có token
  }),
  tagTypes: ["Order"],
  endpoints: (builder) => ({
    addOrder: builder.mutation({
      query: ({ user_id, total, amount, seat_ids, showtime_id, combos, promotion_id, orderInfo, starDiscount }) => {        
        return {
          url: `/pay-with-momo`,
          method: "POST",
          data: { user_id, total, amount, seat_ids, showtime_id, combos, promotion_id, orderInfo, starDiscount }
        };
      },
      invalidatesTags: [{ type: "Order", id: "ORDER" }],
    }),

    // Gọi callback từ client để cập nhật trạng thái đơn hàng
    clientCallback: builder.mutation({
      query: ({ orderId, resultCode, message, extraData }) => {
        return {
          url: `/client-callback`,
          method: "POST",
          data: { 
            orderId, 
            resultCode, 
            message,
            extraData 
          }
        };
      },
      invalidatesTags: [{ type: "Order", id: "ORDER" }],
    }),

    //Check order
    checkOrder: builder.query({
      query: (id) => ({
        url: `/status/${id}` 
      }),
      providesTags: [{ type: "Order", id: "ORDER" }],
    }),

    getOrderByUser: builder.query({
      query: (user_id) => ({
        url: `/${user_id}` 
      }),
      providesTags: [{ type: "Order", id: "ORDER" }],
    }),

    getOrders: builder.query({
      query: () => ({
        url: `/` 
      }),
      providesTags: [{ type: "Order", id: "ORDER" }],
    }),

    getOrdersPagination: builder.query({
      query: (params) => {
        const { page, limit = 10, search = "", sort_order = "desc" } = params || {};
        
        // Xây dựng query params
        const queryParams = [];
        if (page) queryParams.push(`page=${page}`);
        if (limit) queryParams.push(`limit=${limit}`);
        if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
        if (sort_order) queryParams.push(`sort_order=${sort_order}`);
        
        // Thêm timestamp để tránh cache
        queryParams.push(`_t=${Date.now()}`);
        
        let url = '/getAllPagination';
        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        }
        return { url };
      },
      providesTags: [{ type: "Order", id: "ORDER" }],
    }),

    getOrdersByBranch: builder.query({
      query: (adminId) => ({
        url: `/branch/${adminId}`,
        method: "GET",
      }),
      providesTags: [{ type: "Order", id: "ORDER" }],
    }),

    //lấy danh sách đơn hàng theo id chi nhánh
    getListOrdersByBranchId: builder.query({
      query: (params) => {
        const { id, page, limit = 10, search = "", sort_order = "desc" } = params || {};
        
        // Xây dựng query params
        const queryParams = [];
        if (page) queryParams.push(`page=${page}`);
        if (limit) queryParams.push(`limit=${limit}`);
        if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
        if (sort_order) queryParams.push(`sort_order=${sort_order}`);
        
        // Thêm timestamp để tránh cache
        queryParams.push(`_t=${Date.now()}`);
        
        let url = `/list/branch/${id}`;
        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        }
        return { url };
      },
      providesTags: [{ type: "Order", id: "ORDER" }],
    }),

  }),  
});

// Xuất các hook tự động được tạo ra
export const {
 useAddOrderMutation,
 useClientCallbackMutation,
 useCheckOrderQuery,
 useGetOrderByUserQuery,
 useGetOrdersQuery,
 useGetOrdersPaginationQuery,
 useGetOrdersByBranchQuery,
 useGetListOrdersByBranchIdQuery,
} = orderApi;
