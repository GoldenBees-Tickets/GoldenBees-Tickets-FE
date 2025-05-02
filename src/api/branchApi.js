import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";
const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const branchApi = createApi({
  reducerPath: "branchApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${VITE_API_BASE_URL}branch`,
    useHttpClient: true,
  }),
  tagTypes: ["Branch"],
  endpoints: (builder) => ({
    // Thêm chi nhánh mới
    createBranch: builder.mutation({
      query: ({ name, city }) => ({
        url: `/`,
        method: "POST",
        data: { name, city },
      }),
      invalidatesTags: [{ type: "Branch", id: "LISTBRANCH" }],
    }),

    // Cập nhật chi nhánh và cập nhật UI ngay lập tức
    updateBranch: builder.mutation({
      query: ({ name, city, id }) => ({
        url: `/${id}`,
        method: "PUT",
        body: { name, city },
      }),
      // Cập nhật dữ liệu trong cache ngay lập tức
      async onQueryStarted({ id, name, city }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          branchApi.util.updateQueryData("getBranches", undefined, (draft) => {
            const index = draft.findIndex((branch) => branch.id === id);
            if (index !== -1) {
              draft[index] = { ...draft[index], name, city };
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Branch", id },
        { type: "Branch", id: "LISTBRANCH" },
      ],
    }),

    // Xóa chi nhánh
    deleteBranch: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Branch", id },
        { type: "Branch", id: "LISTBRANCH" },
      ],
    }),

    // Lấy danh sách chi nhánh với phân trang, tìm kiếm và sắp xếp
    getBranches: builder.query({
      query: (params) => {
        const { page = 1, limit = 5, search = "", sort_order = "desc" } = params || {};
        
        // Thêm query params 
        const queryParams = [];
        if (page) queryParams.push(`page=${page}`);
        if (limit) queryParams.push(`limit=${limit}`);
        if (search) queryParams.push(`search=${search}`);
        if (sort_order) queryParams.push(`sort_order=${sort_order}`);
        
        let url = '/';
        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        } else {
          url += ``;
        }        
        return {
          url: url,
          method: "GET",
        };
      },
      providesTags: [{ type: "Branch", id: "LISTBRANCH" }],
    }),

    // Lấy chi nhánh theo ID
    getBranchById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Branch", id }],
    }),

    getBranchesByAdmin: builder.query({
      query: (adminId) => ({
        url: `/by-admin/${adminId}`,
        method: "GET",
      }),
      providesTags: ["Branch"],
    }),
  }),
});

export const {
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
  useGetBranchesQuery,
  useGetBranchByIdQuery,
  useGetBranchesByAdminQuery
} = branchApi;
