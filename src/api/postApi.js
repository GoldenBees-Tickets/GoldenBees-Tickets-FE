import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/v1/api/";

export const postApi = createApi({
  reducerPath: "postApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${API_BASE_URL}post`,
    useHttpClient: true,
  }),
  tagTypes: ["Post"],
  endpoints: (builder) => ({
    getPosts: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: [{ type: "Post", id: "LIST" }],
    }),

    getPostById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Post", id }],
    }),

    searchPosts: builder.query({
      query: (query) => ({
        url: `/search?query=${query}`,
        method: "GET",
      }),
      providesTags: [{ type: "Post", id: "SEARCH" }],
    }),

    createPost: builder.mutation({
      query: (formData) => ({
        url: "/",
        method: "POST",
        data: formData,
        isFormData: true,
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),

    updatePost: builder.mutation({
      query: ({ id, formData }) => ({
        url: `/${id}`,
        method: "PUT",
        data: formData,
        isFormData: true,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Post", id },
        { type: "Post", id: "LIST" },
      ],
    }),

    deletePost: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Post", id: "LIST" }],
    }),
  }),
});

// Export hooks for usage in components
export const {
  useGetPostsQuery,
  useGetPostByIdQuery, 
  useSearchPostsQuery,
  useCreatePostMutation,
  useUpdatePostMutation,
  useDeletePostMutation
} = postApi; 