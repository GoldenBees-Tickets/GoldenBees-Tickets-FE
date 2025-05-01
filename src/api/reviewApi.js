import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${API_BASE_URL}review`,
    useHttpClient: true,
  }),
  tagTypes: ["Review"], 
  endpoints: (builder) => ({
    getReviews: builder.query({
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
          useHttpClient: true,
        };
      },
      providesTags: (result) =>
        result
          ? [
              ...result?.items?.map(({ id }) => ({ type: "Review", id })),
              { type: "Review", id: "LIST" },
            ]
          : [{ type: "Review", id: "LIST" }],
    }),

    getReviewsByMovieId: builder.query({
      query: (id) => ({
        url: `/${id}`,
        useHttpClient: true,
      }),
      providesTags: (result, error, id) => [
        { type: "Review", id },
        { type: "Review", id: `MOVIE_${id}` }
      ],
      pollingInterval: 10000,
    }),

    createReview: builder.mutation({
      query: ({ user_id, movie_id, rating }) => ({
        url: `/`,
        method: "POST",
        data: { user_id, movie_id, rating },
        useHttpClient: true,
      }),
      invalidatesTags: (result, error, { movie_id }) => [
        { type: "Review", id: movie_id },
        { type: "Review", id: `MOVIE_${movie_id}` },
        { type: "Review", id: "LIST" },
      ],
      async onQueryStarted({ movie_id }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            reviewApi.util.invalidateTags([
              { type: "Review", id: movie_id },
              { type: "Review", id: `MOVIE_${movie_id}` },
            ])
          );
        } catch {}
      },
    }),
  }),
});

// Export hooks
export const {
  useGetReviewsQuery,
  useGetReviewsByMovieIdQuery,
  useCreateReviewMutation,
} = reviewApi;
