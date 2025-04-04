import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const showtimeApi = createApi({
  reducerPath: "showtimeApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${API_BASE_URL}showtime`,
    useHttpClient: true,
  }),
  tagTypes: ["Showtime"], 
  endpoints: (builder) => ({
    getShowtimes: builder.query({
      query: (branch_id) => ({
        url: `/branch/${branch_id}`,
      }),
      providesTags: () => [{ type: "Showtime", id: "LIST" }],
    }),

    getShowtimesByMovieId: builder.query({
      query: (movie_id) => ({
        url: `/movie/${movie_id}`,
        method: "GET",
      }),
      providesTags: () => [{ type: "Showtime", id: "LIST" }],
    }),

    getShowtimeByRoomId: builder.query({
      query: ({ room_id, start_time, end_time }) => ({
        url: `/check`,
        method: "POST",
        data: { room_id, start_time, end_time },
      }),
      providesTags: () => [{ type: "Showtime", id: "LIST" }],
    }),

    getShowtimeById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
    }),
    
    createShowtime: builder.mutation({
      query: (data) => ({
        url: `/`,
        method: "POST",
        data,
      }),
      invalidatesTags: [{ type: "Showtime", id: "LIST" }],
    }),

    updateSeatTypes: builder.mutation({
      query: ({ id, status }) => ({
        url: `/${id}`,
        method: "PUT",
        data: {status},
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Showtime", id },
        { type: "Showtime", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetShowtimesQuery,
  useCreateShowtimeMutation,
  useLazyGetShowtimeByRoomIdQuery,
  useGetShowtimesByMovieIdQuery,
  useGetShowtimeByIdQuery,
} = showtimeApi;
