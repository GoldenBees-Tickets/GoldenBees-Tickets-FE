import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cinemaApi = createApi({
  reducerPath: "cinemaApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/v1/api/cinema" }),
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
      query: (params) => {
        const { page = 1, limit = 5, search = "", sort_order = "desc" } = params || {};
        
        // Thêm query params 
        const queryParams = [];
        if (page) queryParams.push(`page=${page}`);
        if (limit) queryParams.push(`limit=${limit}`);
        if (search) queryParams.push(`search=${search}`);
        if (sort_order) queryParams.push(`sort_order=${sort_order}`);
        
        let url = '/';
        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        }
        
        return url;
      },
      // Provides the tag to refetch the cinema list
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
} = cinemaApi;
