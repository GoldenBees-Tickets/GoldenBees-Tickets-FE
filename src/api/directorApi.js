import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const directorApi = createApi({
  reducerPath: "directorApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${API_BASE_URL}director`,
    useHttpClient: true,
  }),
  tagTypes: ["Director"],
  endpoints: (builder) => ({
    // Tạo đạo diễn mới
    createDirector: builder.mutation({
      query: (directorData) => ({
        url: `/`,
        method: "POST",
        data: directorData,
        isFormData: true,
      }),
      invalidatesTags: [{ type: "Director", id: "LISTDIRECTOR" }],
    }),

    // Cập nhật thông tin đạo diễn
    updateDirector: builder.mutation({
      query: ({ id, ...directorData }) => ({
        url: `/${id}`,
        method: "PUT",
        data: directorData,
        useHttpClient: true,
        isFormData: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Director", id },
        { type: "Director", id: "LISTDIRECTOR" },
      ],
    }),

    // Xoá đạo diễn (không cập nhật UI tự động)
    deleteDirector: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      // Không dùng invalidatesTags để không tự động cập nhật UI sau khi xoá.
      // Nếu cần cập nhật UI, bạn có thể xử lý bằng cách cập nhật cache thủ công trong onQueryStarted.
    }),

    // Lấy danh sách đạo diễn
    getDirectors: builder.query({
      query: () => ({
        url: `/`,
      }),
      providesTags: [{ type: "Director", id: "LISTDIRECTOR" }],
    }),

    // Lấy đạo diễn theo ID
    getDirectorById: builder.query({
      query: (id) => ({
        url: `/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Director", id }],
    }),
  }),
});

// Xuất các hook tự động được tạo ra để sử dụng trong component React
export const {
  useCreateDirectorMutation,
  useUpdateDirectorMutation,
  useDeleteDirectorMutation,
  useGetDirectorsQuery,
  useGetDirectorByIdQuery,
} = directorApi;
