import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./authQuery/axiosBaseQuery";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const holidayDateApi = createApi({
  reducerPath: "holidayDateApi",
  baseQuery: axiosBaseQuery({ baseUrl: `${API_BASE_URL}holidayDate`, useHttpClient: true,  }),
  endpoints: (builder) => ({
    createHolidayDate: builder.mutation({
      query: (dataSubmit) => ({
        url: `/`,
        method: "POST",
        data: dataSubmit,      
    }),
      invalidatesTags: [{ type: "HolidayDate", id: "HOLIDAYDATE" }],
    }),

    updateHolidayDate: builder.mutation({
      query: ({ id, name }) => ({
        url: `/${id}`,
        method: "PUT",
        body: { name },
        useHttpClient: true,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "HolidayDate", id }],
    }),
  }),
});

export const {
  useCreateHolidayDateMutation,
  useUpdateHolidayDateMutation,
} = holidayDateApi;
