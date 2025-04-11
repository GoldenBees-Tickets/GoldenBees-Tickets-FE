import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const seatTypeApi = createApi({
  reducerPath: "seatTypeApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${API_BASE_URL}seatType`,
    useHttpClient: true,
  }),
  tagTypes: ["SeatType"], 
  endpoints: (builder) => ({
    getListSeatTypes: builder.query({
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
        
        return {
          url: url,
        useHttpClient: true,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result?.seat_types?.map(({ id }) => ({ type: "SeatType", id })),
              { type: "SeatType", id: "LIST" },
            ]
          : [{ type: "SeatType", id: "LIST" }],
    }),

    createSeatTypes: builder.mutation({
      query: ({ type, color, price_offset }) => ({
        url: `/`,
        method: "POST",
        data: { type, color, price_offset },
        useHttpClient: true,
      }),
      invalidatesTags: [{ type: "SeatType", id: "LIST" }],
    }),

    updateSeatTypes: builder.mutation({
      query: ({ id, type, color, price_offset }) => ({
        url: `/${id}`,
        method: "PUT",
        data: { type, color, price_offset },
        useHttpClient: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "SeatType", id },
        { type: "SeatType", id: "LIST" },
      ],
    }),

    deleteSeatType: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
        useHttpClient: true,
      }),
      invalidatesTags: (result, error, id) => [
        { type: "SeatType", id },
        { type: "SeatType", id: "LIST" },
      ],
    }),
  }),
});

// Export hooks
export const {
  useGetListSeatTypesQuery,
  useCreateSeatTypesMutation,
  useUpdateSeatTypesMutation,
  useDeleteSeatTypeMutation,
} = seatTypeApi;
