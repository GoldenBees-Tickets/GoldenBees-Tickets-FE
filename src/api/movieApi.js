import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const movieApi = createApi({
  reducerPath: "movieApi",
  baseQuery: axiosBaseQuery({ baseUrl: `${API_BASE_URL}movie`, useHttpClient: true }),

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
          isFormData: true
        };
      },
      invalidatesTags: (result, error, { id }) => [{ type: "Movie", id }, { type: "Movie", id: "LISTMOVIE" }],
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
      query: () => ({
        url: `/`,
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
  }),
});


export const {
  useCreateMovieMutation,
  useUpdateMovieMutation,
  useDeleteMovieMutation,
  useGetMoviesQuery,
  useGetMovieByIdQuery,
} = movieApi;
