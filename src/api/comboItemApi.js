import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const comboItemApi = createApi({
  reducerPath: "comboItemApi", 
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/v1/api/comboItem" }), // Base URL cho combo item API
  endpoints: (builder) => ({
    // Tạo một combo item mới
    createComboItem: builder.mutation({
      query: ({ combo_id, ...item }) => ({
        url: "/",
        method: "POST",
        body: { combo_id, ...item }, // Gửi dữ liệu combo item để tạo mới
      }),
      invalidatesTags: [{ type: "ComboItem", id: "LISTCOMBOITEMS" }], // Làm mới bộ nhớ cache của danh sách combo items sau khi tạo
    }),

    // Cập nhật một combo item
    updateComboItem: builder.mutation({
      query: ({ id, combo_id, product_id, quantity }) => ({
        url: `/${id}`,
        method: "PUT",
        body: { combo_id, product_id, quantity }, // Gửi dữ liệu cập nhật combo item
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "ComboItem", id }, // Làm mới bộ nhớ cache của combo item đã cập nhật
        { type: "ComboItem", id: "LISTCOMBOITEMS" }, // Làm mới bộ nhớ cache của danh sách combo items
      ],
    }),

    // Xóa một combo item
    deleteComboItem: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE", // Gửi yêu cầu xóa combo item
      }),
      invalidatesTags: (result, error, id) => [
        { type: "ComboItem", id }, // Làm mới bộ nhớ cache của combo item đã xóa
        { type: "ComboItem", id: "LISTCOMBOITEMS" }, // Làm mới bộ nhớ cache của danh sách combo items
      ],
    }),

    // Lấy danh sách tất cả combo items
    getComboItems: builder.query({
      query: () => "/",
      providesTags: [{ type: "ComboItem", id: "LISTCOMBOITEMS" }], // Cung cấp bộ nhớ cache cho danh sách combo items
    }),

    // Lấy một combo item theo ID
    getComboItemById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "ComboItem", id }], // Cung cấp bộ nhớ cache cho một combo item cụ thể
    }),
  }),
});

export const {
  useCreateComboItemMutation,
  useUpdateComboItemMutation,
  useDeleteComboItemMutation,
  useGetComboItemsQuery,
  useGetComboItemByIdQuery,
} = comboItemApi;
