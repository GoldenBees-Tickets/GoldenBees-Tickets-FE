import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const genreApi = createApi({
  reducerPath: "genreApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/v1/api/genre" }),
  tagTypes: ["Genre"], // Định nghĩa tagType

  endpoints: (builder) => ({
    // Thêm thể loại mới
    createGenre: builder.mutation({
      query: ({ name }) => ({
        url: `/`,
        method: "POST",
        body: { name },
      }),
      invalidatesTags: ["Genre"], // Cập nhật danh sách thể loại
    }),

    // Cập nhật thể loại
    updateGenre: builder.mutation({
      query: ({ id, name }) => ({
        url: `/${id}`,
        method: "PUT",
        body: { name },
      }),
      invalidatesTags: ["Genre"], // Cập nhật danh sách thể loại
    }),

    // Xóa thể loại
    deleteGenre: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Genre"], // Cập nhật danh sách thể loại
    }),

    // Lấy danh sách thể loại
    getGenres: builder.query({
      query: () => `/`,
      providesTags: ["Genre"], // Gán tag để RTK Query biết khi nào cần cập nhật
    }),

    // Lấy thể loại theo ID
    getGenreById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Genre", id }],
    }),
  }),
});

export const {
  useCreateGenreMutation,
  useUpdateGenreMutation,
  useDeleteGenreMutation,
  useGetGenresQuery,
  useGetGenreByIdQuery,
} = genreApi;
