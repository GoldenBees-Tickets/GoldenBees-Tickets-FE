import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const movieGenreApi = createApi({
  reducerPath: "movieGenreApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${API_BASE_URL}movieGenre`,
    useHttpClient: true,
  }),
  tagTypes: ["MovieGenre"],
  endpoints: (builder) => ({
    createMovieGenre: builder.mutation({
      query: ({ movie_id, genre_id }) => {

        return {
          url: `/`,
          method: "POST",
          data: { movie_id, genre_id },
        };
      },
      // ...
    }),



    updateMovieGenre: builder.mutation({
      query: ({ id, movieId, genreId }) => ({
        url: `/${id}`,
        method: "PUT",
        data: { movie_id: movieId, genre_id: genreId },
        useHttpClient: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "MovieGenre", id },
        { type: "MovieGenre", id: "LISTMOVIEGENRE" },
      ],
    }),

    deleteMovieGenre: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "MovieGenre", id },
        { type: "MovieGenre", id: "LISTMOVIEGENRE" },
      ],
    }),

    getMovieGenres: builder.query({
      query: () => ({
        url: `/`,
      }),
      providesTags: [{ type: "MovieGenre", id: "LISTMOVIEGENRE" }],
    }),

    getMovieGenreById: builder.query({
      query: (id) => ({
        url: `/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "MovieGenre", id }],
    }),
  }),
});

export const {
  useCreateMovieGenreMutation,
  useUpdateMovieGenreMutation,
  useDeleteMovieGenreMutation,
  useGetMovieGenresQuery,
  useGetMovieGenreByIdQuery,
} = movieGenreApi;
