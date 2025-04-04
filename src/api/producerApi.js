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
      query: ({ id, formData }) => {        
        return {
          url: `/${id}`,
          method: "PUT",
          data: formData,
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
      query: () => ({
        url: `/`,
      }),

      providesTags: [{ type: "Producer", id: "LISTPRODUCER" }],
    }),

    getProducerById: builder.query({
      query: (id) => ({
        url: `/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Producer", id }],
    }),
  }),
});

export const {
  useCreateProducerMutation,
  useUpdateProducerMutation,
  useDeleteProducerMutation,
  useGetProducersQuery,
  useGetProducerByIdQuery,
} = producerApi;
