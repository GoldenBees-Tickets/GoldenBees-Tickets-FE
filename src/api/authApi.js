import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({baseUrl: `${API_BASE_URL}auth`}),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: ({email, password}) => ({
                url: "/login",
                method: "POST",
                body: {email, password},
            })
        }),
        verifyGoogleToken: builder.mutation({
            query: (token) => ({
                url: "/verifyGoogle",
                method: "POST",
                body: {token},
            })
        }),
        regiter: builder.mutation({
            query: ({username, email, password}) => ({
                url: "/register",
                method: "POST",
                body: {username, email, password},
            })
        }),
        resetPass: builder.mutation({
            query: (email) => ({
                url: "/resetPass",
                method: "POST",
                body: {email},
            })
        }), 
        newPass: builder.mutation({
            query: ({token, password, email}) => ({
                url: "/newPass",
                method: "POST",
                body: {token, password, email},
            })
        }), 
    })
});

export const {
    useLoginMutation,
    useVerifyGoogleTokenMutation,
    useRegiterMutation,
    useResetPassMutation,
    useNewPassMutation,
} = authApi;