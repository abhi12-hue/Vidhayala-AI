import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { useNavigate } from "react-router-dom";

const Course = () => {
  const [coursetitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");

  const navigate = useNavigate();
  const [createCourse , {data , isLoading , error , isSuccess}] = useCreateCourseMutation()
  const createCourseHandler = async () => {
    await createCourse({coursetitle ,category });
  };

  //for display the message
  useEffect(()=>{
    if(isSuccess){
        toast.success(data.message || "The Course Created Successfully");
        navigate("/courseTable");
    }
  } , [isSuccess , error])

  return (
    <div className="relative min-h-screen w-full pt-20 bg-gradient-to-r from-gray-900 via-[#09090B] to-black text-white flex flex-col items-center p-6 overflow-hidden">
      {/* Heading */}
      <motion.h1
        className="text-4xl font-bold mb-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Add a Course
      </motion.h1>
      <p className="text-gray-400 mb-2 text-lg text-center">Enter basic details for a new course.</p>
      <p className="text-sm text-gray-500 mb-4 text-center max-w-lg">
        Fill out the form below to create a new course and categorize it appropriately. Ensure you provide all necessary details such as the course name and category to help students find relevant content easily.
      </p>

      {/* Form */}
      <motion.div
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md space-y-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Course Name */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Course Name</label>
          <input
            type="text"
            name="courseTitle"
            value={coursetitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="Enter course name"
            className="w-full mt-1 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full mt-1 p-2 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            <option value="web">Web Development</option>
            <option value="ml">Machine Learning</option>
            <option value="design">UI/UX Design</option>
            <option value="marketing">Digital Marketing</option>
          </select>
        </div>
      </motion.div>

      {/* Create Course Button */}
      <button
        onClick={createCourseHandler}
        className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg text-white font-medium shadow-md"
      >
        {
        isLoading ? "loading.."  : "Create Course"
      }
       
      </button>
    </div>
  );
};

export default Course;
