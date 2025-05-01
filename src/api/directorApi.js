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
      query: ({ id, ...directorData }) => {
        const formData = directorData.formData;
        return {
          url: `/${id}`,
          method: "PUT",
          data: formData,
          isFormData: true,
        };
      },
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
      invalidatesTags: [{ type: "Director", id: "LISTDIRECTOR" }],
    }),

    // Lấy danh sách đạo diễn
    getDirectors: builder.query({
      query: (params) => {
        const { page = 1, limit = 5, search = "", gender = "", sort_order = "desc" } = params || {};
        
        // Thêm query params 
        const queryParams = [];
        if (page) queryParams.push(`page=${page}`);
        if (limit) queryParams.push(`limit=${limit}`);
        if (search) queryParams.push(`search=${search}`);
        if (gender) queryParams.push(`gender=${gender}`);
        if (sort_order) queryParams.push(`sort_order=${sort_order}`);
        
        let url = '/';
        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        }
        
        return {
          url: url,
        };
      },
      providesTags: [{ type: "Director", id: "LISTDIRECTOR" }],
    }),

    // Lấy đạo diễn theo ID
    getDirectorById: builder.query({
      query: (id) => ({
        url: `/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Director", id }],
    }),

    getDirectorsNotPage: builder.query({

      query: () => ({
        url: `/getAll`,
      }),
      providesTags: [{ type: "Director", id: "LISTDIRECTOR" }],
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
  useGetDirectorsNotPageQuery,
} = directorApi;
