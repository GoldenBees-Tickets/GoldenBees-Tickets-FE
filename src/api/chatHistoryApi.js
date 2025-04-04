import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/v1/api/";

export const chatHistoryApi = createApi({
  reducerPath: "chatHistoryApi",
  baseQuery: axiosBaseQuery({
    baseUrl: `${API_BASE_URL}chatbot/history`,
    useHttpClient: true,
  }),
  tagTypes: ["ChatHistory"],
  endpoints: (builder) => ({
    // Lấy tất cả lịch sử chat
    getAllChatHistories: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
      providesTags: [{ type: "ChatHistory", id: "LIST" }],
    }),

    // Lấy lịch sử chat của một người dùng
    getChatHistoryByUserId: builder.query({
      query: (userId) => ({
        url: `/${userId}`,
        method: "GET",
      }),
      providesTags: (result, error, userId) => [{ type: "ChatHistory", id: userId }],
    }),

    // Thêm tin nhắn mới
    addMessage: builder.mutation({
      query: ({ userId, message }) => ({
        url: "/message",
        method: "POST",
        data: { userId, message },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "ChatHistory", id: userId },
        { type: "ChatHistory", id: "LIST" },
      ],
    }),

    // Xóa toàn bộ lịch sử chat của một người dùng
    deleteChatHistory: builder.mutation({
      query: (userId) => ({
        url: `/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, userId) => [
        { type: "ChatHistory", id: userId },
        { type: "ChatHistory", id: "LIST" },
      ],
    }),

    // Xóa một tin nhắn cụ thể
    deleteMessage: builder.mutation({
      query: ({ userId, messageId }) => ({
        url: `/${userId}/message/${messageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "ChatHistory", id: userId },
      ],
    }),

    // Cập nhật nội dung tin nhắn
    updateMessage: builder.mutation({
      query: ({ userId, messageId, newText }) => ({
        url: `/${userId}/message/${messageId}`,
        method: "PUT",
        data: { newText },
      }),
      invalidatesTags: (result, error, { userId }) => [
        { type: "ChatHistory", id: userId },
      ],
    }),
  }),
});

export const {
  useGetAllChatHistoriesQuery,
  useGetChatHistoryByUserIdQuery,
  useAddMessageMutation,
  useDeleteChatHistoryMutation,
  useDeleteMessageMutation,
  useUpdateMessageMutation,
} = chatHistoryApi; 