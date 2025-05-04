import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const movieApi = createApi({
  reducerPath: "movieApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${API_BASE_URL}movie`,
    useHttpClient: true,
  }),

  tagTypes: ["Movie"],

  endpoints: (builder) => ({
    createMovie: builder.mutation({
      query: (movieData) => {
        return {
          url: `/`,
          method: "POST",
          data: movieData,
          useHttpClient: true,
          isFormData: true,
        };
      },
      invalidatesTags: [{ type: "Movie", id: "LISTMOVIE" }],
    }),

    updateMovie: builder.mutation({
      query: ({ id, movieData }) => {
        return {
          url: `/${id}`,
          method: "PUT",
          data: movieData,
          isFormData: true,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Movie", id },
        { type: "Movie", id: "LISTMOVIE" },
      ],
    }),

    deleteMovie: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Movie", id },
        { type: "Movie", id: "LISTMOVIE" },
      ],
    }),

    getMovies: builder.query({
      query: (params) => {
        const {
          page = 1,
          limit = 5,
          search = "",
          status = "",
          sort_order = "desc",
        } = params || {};

        // Thêm query params
        const queryParams = [];
        if (page) queryParams.push(`page=${page}`);
        if (limit) queryParams.push(`limit=${limit}`);
        if (search) queryParams.push(`search=${search}`);
        if (status) queryParams.push(`status=${status}`);
        if (sort_order) queryParams.push(`sort_order=${sort_order}`);

        let url = "/";
        if (queryParams.length > 0) {
          url += `?${queryParams.join("&")}`;
        }

        return {
          url: url,
          useHttpClient: false,
        };
      },
      providesTags: [{ type: "Movie", id: "LISTMOVIE" }],
    }),

    getAllMoviesByUser: builder.query({
      query: () => ({
        url: "/getAll",
        method: "GET",
        useHttpClient: false,
      }),
      providesTags: [{ type: "Movie", id: "LISTMOVIE" }],
    }),

    getMovieById: builder.query({
      query: (id) => ({
        url: `/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Movie", id }],
    }),

    getAllMoviesByAdmin: builder.query({
      query: () => ({
        url: `/getAllByAdmin`,
      }),
      providesTags: [{ type: "Movie", id: "LISTMOVIE" }],
    }),

    getMoviesByBranch: builder.query({
      query: (adminId) => ({
        url: `/branch/${adminId}`,
        method: "GET",
      }),
      providesTags: [{ type: "Movie", id: "LISTMOVIE" }],
    }),

    getMoviesByAddShowtime: builder.query({
      query: () => ({
        url: `/getAllMoviesAddShowtime`,
      }),
      providesTags: [{ type: "Movie", id: "LISTMOVIE" }],
    }),

  }),
});

export const {
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
  useGetMoviesQuery,
  useGetMovieByIdQuery,
  useGetAllMoviesByUserQuery,
  useGetAllMoviesByAdminQuery,
  useGetMoviesByBranchQuery,
  useGetMoviesByAddShowtimeQuery,
} = movieApi;
