import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Lấy URL gốc không có prefix v1/api
const BASE_URL = import.meta.env.VITE_IMAGE_BASE_URL || 'http://localhost:3000/';

export const voiceConverterApi = createApi({
  reducerPath: 'voiceConverterApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${BASE_URL}api/voice-converter` }),
  tagTypes: ['Voice'],
  endpoints: (builder) => ({
    // Chuyển văn bản thành giọng nói
    textToSpeech: builder.mutation({
      query: (textData) => ({
        url: '/text-to-speech',
        method: 'POST',
        body: textData,
      }),
    }),
  }),
});

export const { 
  useTextToSpeechMutation
} = voiceConverterApi; 