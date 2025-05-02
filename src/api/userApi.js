import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: axiosBaseQuery({ baseUrl: `${API_BASE_URL}user`, useHttpClient: true,  }),
  tagTypes: ["User", "AdminBranches"],
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: ({ page = 1, limit = 5, search = '' }) => ({
        url: `/?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`,
        method: "GET",
      }),
      providesTags: ["User"],
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
      providesTags: ["User"],
    }),
    getAdminBranches: builder.query({
      query: ({ page = 1, limit = 5, search = '' }) => ({
        url: `/admin_branches?page=${page}&limit=${limit}${search ? `&search=${search}` : ''}`,
        method: "GET",
      }),
      providesTags: ["AdminBranches"],
    }),
    createUserByAdmin: builder.mutation({
      query: (data) => ({
        url: `/`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["User"],
    }),
    addUser: builder.mutation({
      query: (data) => ({
        url: `/register`,
        method: "POST",
        data,
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
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
    updateAdmin: builder.mutation({
      query: ({ id, ...updateData }) => ({
        url: `/admin/${id}`,
        method: "PUT",
        data: updateData,
      }),
      invalidatesTags: ["AdminBranches"],
    }),
    getStarByUser: builder.query({
      query: (id) => ({
        url: `/star/${id}`,
        method: "GET",
      }),
      providesTags: ["User"],
    }),
    updateAdminStatus: builder.mutation({
      query: (data) => ({
        url: `/status/${data.id}`,
        method: 'PUT',
        data
      }),
      invalidatesTags: ["AdminBranches"]
    }),
    getAdminBranchInfo: builder.query({
      query: (adminId) => ({
        url: `/admin-branch/${adminId}`,
        method: "GET",
      }),
      providesTags: ["AdminBranches"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetListUsersQuery,
  useGetUserQuery,
  useUpdateUserMutation,
  useUpdateAdminMutation,
  useCreateUserByAdminMutation,
  useGetAdminBranchesQuery,
  useAddUserMutation,
  useDeleteUserMutation,
  useGetStarByUserQuery,
  useUpdateAdminStatusMutation,
  useGetAdminBranchInfoQuery
} = userApi;
