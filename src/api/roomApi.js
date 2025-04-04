import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const roomApi = createApi({
  reducerPath: "roomApi",
  baseQuery: axiosBaseQuery({ baseUrl: `${API_BASE_URL}room`, useHttpClient: true,  }),
  endpoints: (builder) => ({
    // Thêm phòng mới
    createRoom: builder.mutation({
      query: (dataSubmit) => ({
        url: `/`,
        method: "POST",
        data: dataSubmit,      }),
      invalidatesTags: [{ type: "Room", id: "LISTROOM" }],
    }),

    // Cập nhật phòng
    updateRoom: builder.mutation({
      query: ({ id, name }) => ({
        url: `/${id}`,
        method: "PUT",
        body: { name },
        useHttpClient: true,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Room", id }],
    }),

    // Xóa phòng
    deleteRoom: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Room", id },
        { type: "Room", id: "LISTROOM" },
      ],
    }),
    getRoomsByCinemaId: builder.query({
      query: (cinema_id) => ({
        url: `/cinema/${cinema_id}`,
      }),
      providesTags: [{ type: "Room", id: "LISTROOM" }],
    }),
    // Lấy danh sách phòng
    getRooms: builder.query({
      query: () => ({
        url: "/",
      }),
      providesTags: [{ type: "Room", id: "LISTROOM" }],
    }),

    // Lấy phòng theo ID
    getRoomById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        useHttpClient: true,
      }),
      providesTags: (result, error, id) => [{ type: "Room", id }],
    }),
  }),
});

export const {
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useGetRoomsQuery,
  useGetRoomByIdQuery,
  useGetRoomsByCinemaIdQuery
} = roomApi;
