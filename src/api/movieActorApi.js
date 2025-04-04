import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const movieActorApi = createApi({
  reducerPath: "movieActorApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${API_BASE_URL}movieActor`,
    useHttpClient: true,
  }),
  tagTypes: ["MovieActor"],
  endpoints: (builder) => ({
    createMovieActor: builder.mutation({
      query: ({ movie_id, actor_id }) => {
        return {
          url: `/`,
          method: "POST",
          data: { movie_id, actor_id },
        };
      },
      invalidatesTags: [{ type: "MovieActor", id: "LISTMOVIEACTOR" }],
    }),

    deleteMovieActor: builder.mutation({
      query: ({ movie_id, actor_id }) => ({
        url: `/${movie_id}/${actor_id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { movie_id, actor_id }) => [
        { type: "MovieActor", id: `${movie_id}_${actor_id}` },
        { type: "MovieActor", id: "LISTMOVIEACTOR" },
      ],
    }),
  }),
});

export const {
  useCreateMovieActorMutation,
  useDeleteMovieActorMutation,
} = movieActorApi;
