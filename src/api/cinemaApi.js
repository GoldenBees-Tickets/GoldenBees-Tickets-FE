import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const cinemaApi = createApi({
  reducerPath: "cinemaApi",
    baseQuery: axiosBaseQuery({
      baseUrl: `${API_BASE_URL}cinema`,
      useHttpClient: true,
    }),
  endpoints: (builder) => ({
    // Thêm cinema mới
    createCinema: builder.mutation({
      query: ({ name, city, district, ward, street, branch_id }) => ({
        url: `/`,
        method: "POST",
        body: { name, city, district, ward, street, branch_id },
      }),
      // After creating a cinema, invalidate the cinema list
      invalidatesTags: [{ type: "Cinema", id: "LISTCINEMA" }],
    }),

    // Cập nhật cinema
    updateCinema: builder.mutation({
      query: ({ name, city, district, ward, street, branch_id, id }) => ({
        url: `/${id}`,
        method: "PUT",
        body: { name, city, district, ward, street, branch_id },
      }),
      // After updating a cinema, invalidate the updated cinema and the list
      invalidatesTags: (result, error, { id }) => [
        { type: "Cinema", id },
        { type: "Cinema", id: "LISTCINEMA" },
      ],
    }),

    // Xóa cinema
    deleteCinema: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      // After deleting a cinema, invalidate the cinema list
      invalidatesTags: (result, error, id) => [
        { type: "Cinema", id },
        { type: "Cinema", id: "LISTCINEMA" },
      ],
    }),

    // Lấy danh sách cinema
    getCinemas: builder.query({
      query: ({ page = 1, limit = 5, search = "", sort_order = "desc" } = {}) => ({
        url: "", // Đảm bảo endpoint gốc đúng
        method: "GET",
        params: {
          page,
          limit,
          search,
          sort_order,
        },
      }),
      providesTags: [{ type: "Cinema", id: "LISTCINEMA" }],
    }),
    

    getCinemaByBranchId: builder.query({
      query: (branch_id) => ({
        url: `/branch/${branch_id}`
      })
    }),

    // Lấy cinema theo ID
    getCinemaById: builder.query({
      query: (id) => `/${id}`,
      // Cache the result for a specific cinema
      providesTags: (result, error, id) => [{ type: "Cinema", id }],
    }),

    getAllCinemaNotPagination: builder.query({
      query: () => ({
        url: `/getAll`,
        method: "GET",
      }),
      // Provides the tag to refetch the cinema list
      providesTags: [{ type: "Cinema", id: "LISTCINEMA" }],
    }),

    // Thêm endpoint
    getCinemasByBranch: builder.query({
      query: (adminId) => ({
        url: `/branch/${adminId}`,
        method: "GET",
      }),
      providesTags: ["Cinema"],
    }),
    
    getCinemasForDashboardByBranch: builder.query({
      query: (branchId) => ({
        url: `/dashboard/${branchId}`,
        method: "GET",
      }),
      providesTags: ["Cinema"],
    }),
  }),
});

export const {
  useCreateCinemaMutation,
  useUpdateCinemaMutation,
  useDeleteCinemaMutation,
  useGetCinemasQuery,
  useGetCinemaByIdQuery,
  useGetCinemaByBranchIdQuery,
  useGetAllCinemaNotPaginationQuery,
  useGetCinemasByBranchQuery,
  useGetCinemasForDashboardByBranchQuery,
} = cinemaApi;
