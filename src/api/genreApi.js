import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const genreApi = createApi({
  reducerPath: "genreApi",
  baseQuery: axiosBaseQuery({ baseUrl: `${API_BASE_URL}genre`, useHttpClient: true }),
  tagTypes: ["Genre"],
  endpoints: (builder) => ({
    getGenres: builder.query({
      query: ({ page = 1, limit = 5, search = '' } = {}) => ({ // 👈 Thêm = {} ở đây
        url: `/?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`,
        method: "GET",
      }),
      providesTags: () => [{ type: "Genre", id: "LIST" }],
    }),
    getGenre: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Genre", id }],
    }),
    createGenre: builder.mutation({
      query: (data) => ({
        url: `/`,
        method: "POST",
        data,
      }),
      invalidatesTags: () => [{ type: "Genre", id: "LIST" }],
    }),
    updateGenre: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/${id}`,
        method: "PUT",
        data,
      }),
      invalidatesTags: () => [{ type: "Genre", id: "LIST" }]}),
    deleteGenre: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: () => [{ type: "Genre", id: "LIST" }],
    }),

    getAllGenresForDashboard: builder.query({
      query: () => ({
        url: `/getAll`,
        method: "GET",
      }),
      providesTags: () => [{ type: "Genre", id: "LIST" }],
    }),
  }),
});

export const {
  useGetGenresQuery,
  useGetGenreQuery,
  useCreateGenreMutation,
  useUpdateGenreMutation,
  useDeleteGenreMutation,
  useGetAllGenresForDashboardQuery
} = genreApi;
