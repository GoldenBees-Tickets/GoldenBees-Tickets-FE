import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export const comboApi = createApi({
  reducerPath: "comboApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${API_BASE_URL}combo`,
    useHttpClient: true,
  }),
  tagTypes: ["Combo"],
  endpoints: (builder) => ({
    createCombo: builder.mutation({
      query: (formData) => {
        return {
          url: `/`, 
          method: "POST",
          data: formData,
          useHttpClient: true,
          isFormData: true,
        };
      },
      invalidatesTags: [{ type: "Combo", id: "LISTCOMBO" }],
    }),
    
    updateCombo: builder.mutation({
      query: (data) => {
        return {
          url: `/${data.id}`,
          method: "PUT",
          data: data.data,
          useHttpClient: true,
          isFormData: true,
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: "Combo", id },
        { type: "Combo", id: "LISTCOMBO" },
      ],
    }),
    

    deleteCombo: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Combo", id },
        { type: "Combo", id: "LISTCOMBO" },
      ],
    }),

    getCombos: builder.query({
      query: (params) => {
        const { page = 1, limit = 10, search = "", sort_order = "desc" } = params || {};
        
        // Xây dựng query params
        const queryParams = [];
        if (page) queryParams.push(`page=${page}`);
        if (limit) queryParams.push(`limit=${limit}`);
        if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
        if (sort_order) queryParams.push(`sort_order=${sort_order}`);
        
        let url = '/';
        if (queryParams.length > 0) {
          url += `?${queryParams.join('&')}`;
        }
        
        return { url };
      },
      providesTags: [{ type: "Combo", id: "LISTCOMBO" }],
    }),

    getComboById: builder.query({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Combo", id }],
    }),
  }),
});

export const {
  useCreateComboMutation,
  useUpdateComboMutation,
  useDeleteComboMutation,
  useGetCombosQuery,
  useGetComboByIdQuery,
} = comboApi;
