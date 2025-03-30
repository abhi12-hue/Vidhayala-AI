import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const USER_API = 'http://localhost:5000/api/v1/courses';

export const coursApi = createApi({
  reducerPath: 'coursApi', // Ensure consistent naming
  tagTypes: ['Refetch_Creator_Course', 'Refetch_Lecture'],
  baseQuery: fetchBaseQuery({
    baseUrl: USER_API,
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    createCourse: builder.mutation({
      query: ({ coursetitle, category }) => ({  // Fix parameter destructuring
        url: "",
        method: "POST",
        body: { coursetitle, category } // Ensure correct keys
      }),
      invalidatesTags: ['Refetch_Creator_Course']
    }),
    getCourse: builder.query({
      query: () => ({  // Fix parameter destructuring
        url: "/published-course",
        method: "GET",
      }),
      invalidatesTags: ['Refetch_Creator_Course']
    }),
    getCreatorCourse: builder.query({
      query: () => ({  // Fix parameter destructuring
        url: "",
        method: "GET",

      }),
    }),
    getfilterdata: builder.mutation({
      query: ({category, price, courselevel}) => ({  // Fix parameter destructuring
        url: "",
        method: "POST",
        body: {category, price, courselevel}

      }),
    }),
    //to get the myLearning
    getmylearning: builder.query({
      query: () => ({  // Fix parameter destructuring
        url: "",
        method: "GET",
      }),
    }),
    getCourseDetailById: builder.query({
      query: (id) => ({  // Fix parameter destructuring
        url: `/${id}`,
        method: "GET",

      }),
    }),
    editCourse: builder.mutation({
      query: ({ formData, id, lectureId }) => ({
        url: `/${id}`, // Include the ID in the URL
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ['Refetch_Creator_Course']
    }),
    getCoursesById: builder.query({
      query: (id) => ({
        url: `/${id}`,
        method: "GET"
      })
    }),
    createLecture: builder.mutation({
      query: ({ id, title }) => ({
        url: `/${id}/lecture`,
        method: "POST",
        body: { title }
      })
    }),
    getCourseLecture: builder.query({
      query: (id) => ({
        url: `/${id}/lecture`,
        method: "GET",
      }),
      providesTags: ['Refetch_Lecture']
    }),
    EditCourseLecture: builder.mutation({
      query: ({ lecturetitle, videoInfo, isPreviewFree, id, lectureId }) => ({
        url: `/${id}/lecture/${lectureId}`,
        method: "PUT",
        body: { lecturetitle, videoInfo, isPreviewFree }
      })
    }),
    editRemoveLecture: builder.mutation({
      query: (lectureId) => ({
        url: `/lecture/${lectureId}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Refetch_Lecture']
    }),
    PublishCourse: builder.mutation({
      query: ({ id, query }) => ({
        url: `/${id}?publish=${query}`,
        method: "PATCH",
      })
    }),
    getEnrolledCourseData:builder.query({
      query:(id)=>({
        url:`/course-progress/${id}`,
        method:"GET",
      })
    }),
  })
});

export const { useCreateCourseMutation, useGetCreatorCourseQuery, useEditCourseMutation,
  useGetCoursesByIdQuery, useCreateLectureMutation, useGetCourseLectureQuery, useEditCourseLectureMutation, useEditRemoveLectureMutation,
  usePublishCourseMutation, useGetCourseQuery, useGetCourseDetailByIdQuery , useGetfilterdataMutation ,
   useGetmylearningQuery , useGetEnrolledCourseDataQuery
} = coursApi;
