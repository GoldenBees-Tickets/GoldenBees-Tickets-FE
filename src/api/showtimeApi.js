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
      query: (params) => {
        const { branch_id, page = 1, limit = 5, search = "", status = "all", sort_order = "desc" } = params || {};
        let url = `/branch/${branch_id}`;
        
        // Thêm query params 
        const queryParams = [];
        if (page) queryParams.push(`page=${page}`);
        if (limit) queryParams.push(`limit=${limit}`);
        if (search) queryParams.push(`search=${search}`);
        if (status && status !== "all") queryParams.push(`status=${status}`);
        if (sort_order) queryParams.push(`sort_order=${sort_order}`);
        
        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        }
        
        return { url };
      },
      providesTags: () => [{ type: "Showtime", id: "LIST" }],
    }),

    getShowtimesByMovieId: builder.query({
      query: (params) => {
        // Hỗ trợ cả khi tham số là movie_id string hoặc là object chứa các tham số lọc
        if (typeof params === 'object' && params !== null) {
          const { movie_id, branch_id, cinema_id, current_time } = params;
          let url = `/movie/${movie_id}`;
          
          // Thêm query params vào URL nếu cần
          const queryParams = [];
          if (branch_id) queryParams.push(`branch_id=${branch_id}`);
          if (cinema_id) queryParams.push(`cinema_id=${cinema_id}`);
          if (current_time) queryParams.push(`current_time=true`);
          
          if (queryParams.length > 0) {
            url += `?${queryParams.join('&')}`;
          }
          
          return {
            url,
            method: "GET",
          };
        }
        
        // Trường hợp tham số là movie_id chuỗi (hỗ trợ code cũ)
        return {
          url: `/movie/${params}`,
          method: "GET",
        };
      },
      providesTags: () => [{ type: "Showtime", id: "LIST" }],
    }),

    getShowtimeByRoomId: builder.query({
      query: ({ room_id, start_time, end_time, show_date }) => ({
        url: `/check`,
        method: "POST",
        data: { room_id, start_time, end_time, show_date },
      }),
      invalidatesTags: [{ type: "Showtime", id: "LIST" }],
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
