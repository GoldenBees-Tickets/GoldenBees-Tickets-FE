import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const countryApi = createApi({
  reducerPath: "countryApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://restcountries.com/v3.1" }),
  tagTypes: ["Country"],

  endpoints: (builder) => ({
    // Lấy danh sách tất cả các quốc gia
    getCountries: builder.query({
      query: () => `/all?fields=name,cca2`,
      transformResponse: (response) => {
        if (!Array.isArray(response)) return [];
        
        // Sắp xếp các quốc gia theo tên tiếng Anh
        return response
          .sort((a, b) => a.name.common.localeCompare(b.name.common))
          .map(country => ({
            code: country.cca2,
            name: country.name.common
          }));
      },
      providesTags: ["Country"],
    }),
  }),
});

export const {
  useGetCountriesQuery,
} = countryApi; 