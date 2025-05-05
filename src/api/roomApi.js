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
      invalidatesTags: (result, error, { id }) => [
        { type: "Room", id },
        { type: "RoomSeats", id }
      ],
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
        { type: "RoomSeats", id }
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
      query: (params) => {
        const { page = 1, limit = 10, search = "", sort_order = "desc" } = params || {};
        
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
        
        return { url };
      },
      providesTags: [{ type: "Room", id: "LISTROOM" }],
    }),

    // Lấy phòng theo ID
    getRoomById: builder.query({
      query: ({room_id, showtime_id}) => ({
        url: `/${room_id}?showtime_id=${showtime_id}`,
        useHttpClient: true,
      }),
      providesTags: (result, error, {room_id}) => [{ type: "Room", id: room_id }],
    }),

    getSeatsByRoomId: builder.query({
      query: (room_id) => ({
        url: `/seats/${room_id}`,
        useHttpClient: true,
      }),
      providesTags: (result, error, room_id) => [{ type: "RoomSeats", id: room_id }],
    }),
  }),
});

export const {
  useCreateRoomMutation,
  useUpdateRoomMutation,
  useDeleteRoomMutation,
  useGetRoomsQuery,
  useGetRoomByIdQuery,
  useGetRoomsByCinemaIdQuery,
  useGetSeatsByRoomIdQuery
} = roomApi;
