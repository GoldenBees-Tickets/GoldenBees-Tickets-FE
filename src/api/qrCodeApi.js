import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const qrCodeApi = createApi({
  reducerPath: "qrCodeApi",
  baseQuery: axiosBaseQuery({
      baseUrl: `${API_BASE_URL}qr`,
      useHttpClient: true,
      timeout: 15000,
    }),
  tagTypes: ["QrCode"],

  endpoints: (builder) => ({
    // Tạo mã QR mới
    generateQrCode: builder.mutation({
      query: ({ data, email }) => {
        return {
          url: `/generate`,
          method: "POST",
          body: { data, email },
        };
      },
      transformResponse: (response) => {
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('Error response from server:', response);
        return response;
      },
    }),
    
    // Quét mã QR
    scanQrCode: builder.mutation({
      query: (order_id) => {        
        // // Kiểm tra kiểu dữ liệu của ticketId
        // let processedTicketId = ticketId;
        
        // // Nếu là chuỗi số, chuyển đổi sang số
        // if (!isNaN(ticketId) && typeof ticketId === 'string') {
        //   processedTicketId = parseInt(ticketId, 10);
        // }
        
        return {
          url: '/scan',
          method: 'POST',
          data: { order_id },
        };
      },
      transformResponse: (response) => {
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('Error response from server for QR scan:', response);
        if (response.status === 404) {
          console.error('Ticket not found with ID', response.data?.ticketId);
        }
        return response;
      },
    }),
    
    // Gửi lại mã QR qua email
    resendQrCodeEmail: builder.mutation({
      query: ({ ticketId, email }) => {
        return {
          url: '/resend-email',
          method: 'POST',
          body: { ticketId, email },
        };
      },
      transformResponse: (response) => {
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('Error response from server for QR email resend:', response);
        return response;
      },
    }),
  }),
});

export const { 
  useGenerateQrCodeMutation, 
  useScanQrCodeMutation,
  useResendQrCodeEmailMutation 
} = qrCodeApi; 