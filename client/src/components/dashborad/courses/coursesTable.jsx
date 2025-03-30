import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PlusCircle, Edit } from "lucide-react";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";

const CoursesTable = () => {
  const navigate = useNavigate();
  const {data , isLoading } = useGetCreatorCourseQuery()
  const [courses, setCourses] = useState([
    { id: 1, title: "React Basics", price: "$49", status: "Published" },
    { id: 2, title: "Advanced Next.js", price: "$99", status: "Draft" },
    { id: 3, title: "Full Stack MERN", price: "$129", status: "Published" },
  ]);


  if(isLoading) return <h1>Loading...</h1>
  return (
    <div className="min-h-screen w-full pt-20 bg-gradient-to-r from-gray-900 via-[#09090B] to-black text-white p-6">
      {/* Page Heading */}
      <h1 className="text-3xl font-bold mb-2">Manage Your Courses</h1>
      <p className="text-gray-400 mb-6">
        Here, you can view, edit, and manage all the courses available on your platform.
      </p>

      {/* Create Course Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-3 px-6 py-3 mb-6 bg-green-600 text-white rounded-lg shadow-md hover:shadow-xl transition"
        onClick={() => navigate("/course")}
      >
        <PlusCircle size={22} />   
        <span className="font-medium text-lg">Create New Course</span>
      </motion.button>

      {/* Courses Table */}
      <div className="overflow-x-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 border-b border-gray-600">
              <th className="p-3">Title</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              data.course.map((co) => (
                <tr key={co.id} className="border-b border-gray-700">
                  <td className="p-3">{co.coursetitle}</td>
                  <td className="p-3">{co.coursePrice || "NA"}</td>
                  <td className="p-3">{co.isPublished ? "isPublished" : "Draft"}</td>
                  <td className="p-3">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-blue-500 text-white px-3 py-2 rounded-lg flex items-center gap-2"
                      onClick={() => navigate(`/Editcourse/${co.id}`)}
                    >
                      <Edit size={18} />
                      Edit
                    </motion.button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-5 text-gray-400">
                  No courses available. Click "Create New Course" to add one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoursesTable;
