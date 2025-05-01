import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const producerApi = createApi({
  reducerPath: "producerApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${API_BASE_URL}producer`,
    useHttpClient: true,
  }),
  tagTypes: ["Producer"],
  endpoints: (builder) => ({
    createProducer: builder.mutation({
      query: (producerData) => ({
        url: `/`,
        method: "POST",
        data: producerData,
        isFormData: true,
      }),

      invalidatesTags: [{ type: "Producer", id: "LISTPRODUCER" }],
    }),

    updateProducer: builder.mutation({
      query: ({ id, ...dataForm }) => {        
        return {
          url: `/${id}`,
          method: "PUT",
          data: dataForm.formData,
          isFormData: true,
        };
      },

      invalidatesTags: (result, error, { id }) => [
        { type: "Producer", id },
        { type: "Producer", id: "LISTPRODUCER" },
      ],
    }),

    deleteProducer: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),

      invalidatesTags: (result, error, id) => [
        { type: "Producer", id },
        { type: "Producer", id: "LISTPRODUCER" },
      ],
    }),

    getProducers: builder.query({
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
        }
        
        return {
          url: url,
        };
      },
      providesTags: [{ type: "Producer", id: "LISTPRODUCER" }],
    }),

    getProducerById: builder.query({
      query: (id) => ({
        url: `/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Producer", id }],
    }),

    getProducersNotPage: builder.query({
      query: () => ({
        url: `/getAll`,
      }),
      providesTags: [{ type: "Producer", id: "LISTPRODUCER" }],
    }),
  }),
});

export const {
  useCreateProducerMutation,
  useUpdateProducerMutation,
  useDeleteProducerMutation,
  useGetProducersQuery,
  useGetProducerByIdQuery,
  useGetProducersNotPageQuery,
} = producerApi;
