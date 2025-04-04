import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const movieProducerApi = createApi({
  reducerPath: "movieProducerApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${API_BASE_URL}movieProducer`,
    useHttpClient: true,
  }),
  tagTypes: ["MovieProducer"],
  endpoints: (builder) => ({
    createMovieProducer: builder.mutation({
      query: ({ movie_id, producer_id }) => {

        return {
          url: `/`,
          method: "POST",
          data: { movie_id, producer_id },
        };
      },
      invalidatesTags: [{ type: "MovieProducer", id: "LISTMOVIEPRODUCER" }],
    }),

    deleteMovieProducer: builder.mutation({
      query: ({ movieId, producerId }) => ({
        url: `/${movieId}/${producerId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { movieId, producerId }) => [
        { type: "MovieProducer", id: `${movieId}_${producerId}` },
        { type: "MovieProducer", id: "LISTMOVIEPRODUCER" },
      ],
    }),
  }),
});

export const {
  useCreateMovieProducerMutation,
  useDeleteMovieProducerMutation,
} = movieProducerApi;
