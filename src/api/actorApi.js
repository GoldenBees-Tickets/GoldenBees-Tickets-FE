import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const actorApi = createApi({
  reducerPath: "actorApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${API_BASE_URL}actor`,
    useHttpClient: true,
  }),
  tagTypes: ["Actor"],
  endpoints: (builder) => ({
   
    createActor: builder.mutation({
      query: (actorData) => ({
        url: `/`,
        method: "POST",
        data: actorData,
        isFormData:true
      }),
      
      invalidatesTags: [{ type: "Actor", id: "LISTACTOR" }],
    }),

    
    updateActor: builder.mutation({
      query: ({ id, ...actorData }) => ({
        url: `/${id}`,
        method: "PUT",
        data: actorData,
        useHttpClient: true,
        isFormData: true,
      }),
      
      invalidatesTags: (result, error, { id }) => [
        { type: "Actor", id },
        { type: "Actor", id: "LISTACTOR" },
      ],
    }),

    // Xóa diễn viên
    deleteActor: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      // Invalidate tag cá nhân và tag danh sách diễn viên sau khi xóa
      invalidatesTags: (result, error, id) => [
        { type: "Actor", id },
        { type: "Actor", id: "LISTACTOR" },
      ],
    }),

    // Lấy danh sách diễn viên
    getActors: builder.query({
      query: () => ({
        url: `/`,
      }),
      // Cung cấp tag danh sách diễn viên cho endpoint này
      providesTags: [{ type: "Actor", id: "LISTACTOR" }],
    }),

    // Lấy diễn viên theo ID
    getActorById: builder.query({
      query: (id) => ({
        url: `/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: "Actor", id }],
    }),
  }),
});

// Xuất các hook tự động được tạo ra
export const {
  useCreateActorMutation,
  useUpdateActorMutation,
  useDeleteActorMutation,
  useGetActorsQuery,
  useGetActorByIdQuery,
} = actorApi;
