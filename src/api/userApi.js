import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery({ baseUrl: `${API_BASE_URL}user`, useHttpClient: true,  }),
  tagTypes: ["User"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => ({
        url: `/`,
        method: "GET",
      }),
      providesTags: () => [{ type: "User", id: "LIST" }],
    }),
    getUser: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
        useHttpClient: false,
      }),      
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),
    getListUsers: builder.query({
      query: () => ({
        url: `/`,
        method: "GET",
      }),
      providesTags: () => [{ type: "User", id: "LIST" }],
    }),
    getAdminBranches: builder.query({
      query: () => ({
        url: `/admin_branches`,
      }),
      providesTags: () => [{ type: "User", id: "LIST" }],
    }),
    createUserByAdmin: builder.mutation({
      query: (data) => ({
        url: `/`,
        method: "POST",
        data,
      }),
      invalidatesTags: () => [{ type: "User", id: "LIST" }],
    }),
    addUser: builder.mutation({
      query: (data) => ({
        url: `/register`,
        method: "POST",
        data,
      }),
      invalidatesTags: () => [{ type: "User", id: "LIST" }],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: () => [{ type: "User", id: "LIST" }],
    }),
    updateUser: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/${id}`,
        method: "PATCH",
        data: updateData,
        isFormData: true,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetListUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useCreateUserByAdminMutation,
  useGetAdminBranchesQuery,
  useAddUserMutation,
  useDeleteUserMutation,
} = userApi;
