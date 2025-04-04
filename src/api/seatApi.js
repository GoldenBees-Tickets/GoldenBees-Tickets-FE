import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const seatApi = createApi({
  reducerPath: "seatApi",
  baseQuery: axiosBaseQuery({ baseUrl: `${API_BASE_URL}seat`, useHttpClient: true,  }),
  endpoints: (builder) => ({
    updateSeats: builder.mutation({
      query: (seats) => {
        return {
          url: `/`,
          method: "PATCH",
          data: seats,
          useHttpClient: true,
        };
      },
      invalidatesTags: (result, error, ) => [{ type: "Seat", id: "LISTSEAT" }],
    }),
    

    getSeats: builder.query({
      query: () => '/',
      providesTags: [{ type: "Seat", id: "LISTSEAT" }],
    }),

    // Lấy phòng theo ID
    getSeatById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Seat", id }],
    }),
  }),
});

export const {
  useUpdateSeatsMutation,
  useGetSeatsQuery,
  useGetSeatByIdQuery,
} = seatApi;
