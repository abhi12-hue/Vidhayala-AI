import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
const USER_API = 'https://vidhayala-ai-18.onrender.com/api/v1/user';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (inputData) => ({
        url: 'register',
        method: 'POST',
        body: inputData,
      }),
    }),
    loginUser: builder.mutation({
      query: (inputData) => ({
        url: 'login',
        method: 'POST',
        body: inputData,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled; // Get the response data
          // Assuming you have a 'userLoggedIn' action to dispatch user info
          dispatch(userLoggedIn({ user: data.user }));
        } catch (error) {
          console.log(error);
        }
      },
    }),
    loadUser:builder.query({
      query:()=>({
        url:'profile',
        method:'GET',
      })
    }),
    updateUser:builder.mutation({
      query:(formData)=>({
        url:"profileUpdate",
        method:'PUT',
        body:formData
      })
    }),
    checkuser:builder.query({
      query:()=>({
        url:'',
        method:'GET',
      })
    }),
    logoutUser:builder.mutation({
      query:()=>({
        url:'/logout',
        method:'POST',
      })
    }),
  }),
});

export const { useRegisterUserMutation, useLoginUserMutation,
  useLoadUserQuery , useUpdateUserMutation , useCheckuserQuery , useLogoutUserMutation
 } = authApi;
