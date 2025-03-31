import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGetCourseQuery, useGetfilterdataMutation } from '@/features/api/courseApi';
import { useNavigate } from "react-router-dom";

const ExploreCourse = () => {
  const navigate = useNavigate();
  
  // State variables for filters
  const [searchQuery, setSearchQuery] = useState("");
  const [mediumFilter, setMediumFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  
  // Fetch all courses
  const { data, isLoading } = useGetCourseQuery();
  const [getfilterdata, { data: filteredData, isLoading: isFiltering }] = useGetfilterdataMutation();
  
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    setCourses(data?.courses || []);
  }, [data]);

  // Function to filter courses
  const handleFilter = async () => {
    try {
      const category = categoryFilter !== "All Categories" ? categoryFilter : undefined;
      const courselevel =  mediumFilter !== "All Mediums" ? mediumFilter : undefined;
      const price =  priceFilter !== "All Prices" ? (priceFilter === "Free" ? 0 : priceFilter) : undefined;
    

      const result = await getfilterdata({category,price,courselevel}).unwrap();
      setCourses(result.filter);
    } catch (error) {
      console.error("Error filtering courses:", error);
    }
  };

  // Animation Variants
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen w-full pt-16 bg-gradient-to-r from-gray-900 via-[#09090B] to-black text-white">
      {/* Header */}
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-4xl md:text-5xl font-extrabold text-center mb-12 tracking-tight"
      >
        Drop your Comment Belo Down 
      </motion.h1>

      {/* Search Bar */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md mx-auto mb-6 px-6"
      >
        <input
          type="text"
          placeholder="Search the vibe..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all duration-300"
        />
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row justify-center gap-4 mb-6 px-8"
      >
        {[
          { value: mediumFilter, setter: setMediumFilter, options: ["All Mediums", " Beginner" , "Intermediate","Advanced"], placeholder: "Medium" },
          { value: categoryFilter, setter: setCategoryFilter, options: ["All Categories", "web Development", "Machine learning", "data science"], placeholder: "Category" },
          { value: priceFilter, setter: setPriceFilter, options: ["All Prices", "Free", "Paid", "0-500", "500-1000"], placeholder: "Price" },
        ].map((filter, idx) => (
          <select
            key={idx}
            value={filter.value}
            onChange={(e) => filter.setter(e.target.value)}
            className="p-3 rounded-xl bg-gray-800 border border-gray-700 text-white focus:outline-none focus:border-purple-500 transition-all duration-300"
          >
            <option value="">{filter.placeholder}</option>
            {filter.options.map((opt) => (
              <option key={opt} value={opt}>
                {opt === "0-500" || opt === "500-1000" ? `₹${opt}` : opt}
              </option>
            ))}
          </select>
        ))}
        <button
          onClick={handleFilter}
          className="px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300"
        >
          Apply Filters
        </button>
      </motion.div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8 md:px-12">
        {isLoading || isFiltering ? (
          <p className="text-center text-gray-400 text-lg">Loading The courses.....</p>
        ) : courses.length === 0 ? (
          <p className="text-center text-gray-400 text-lg">No Course Found.</p>
        ) : (
          courses
            .filter((course) =>
              course.coursetitle.toLowerCase().includes(searchQuery.toLowerCase())
            )
            .map((course) => (
              <motion.div
                key={course.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                onClick={() => navigate(`/course-detail/${course.id}`)}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-xl cursor-pointer"
              >
                <img src={course.courseThumbnail} alt={course.coursetitle} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h2 className="text-xl font-bold text-white">{course.coursetitle}</h2>
                  <p className="text-gray-400 text-sm mt-1">{course.coursesubtitle}</p>
                  <p className="text-gray-500 text-xs mt-2">
                    {course.category} • {course.courseLevel}
                  </p>
                  <p className="text-lg font-semibold mt-3 text-purple-400">
                    {course.coursePrice === 0 ? "Free" : `₹${course.coursePrice}`}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="mt-4 px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-300"
                  >
                    Join the Wave
                  </motion.button>
                </div>
              </motion.div>
            ))
        )}
      </div>
    </div>
  );
};

export default ExploreCourse;
