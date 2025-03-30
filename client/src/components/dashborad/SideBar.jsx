import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Settings, LayoutDashboard, PlusCircle, ClipboardList } from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const SideBar = () => {
  return (
    <motion.div
      initial={{ x: -200, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative min-h-screen w-full pt-20 bg-gradient-to-r from-gray-900 via-[#09090B] to-black text-white flex flex-col items-center p-6 overflow-y-auto"
    >
      <div className="space-y-4 text-center">
        <motion.h1
          className="text-3xl font-bold tracking-wide md:text-5xl"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          Admin Dashboard
        </motion.h1>
        <p className="text-gray-400 text-lg max-w-2xl">
          Welcome to the admin panel! Here, you can manage all your courses, track student progress, and optimize learning experiences. Use the tools below to navigate and perform necessary actions efficiently.
        </p>
      </div>

      {/* Animated Info Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <LayoutDashboard size={22} className="text-blue-500" /> Dashboard Overview
          </h2>
          <p className="text-gray-400 mt-2">
            Get an overview of all courses, enrolled students, and performance metrics.
          </p>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <PlusCircle size={22} className="text-green-500" /> Create New Courses
          </h2>
          <p className="text-gray-400 mt-2">
            Design, upload, and publish new courses to expand your educational offerings.
          </p>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ClipboardList size={22} className="text-yellow-500" /> Student Management
          </h2>
          <p className="text-gray-400 mt-2">
            Track student progress, manage enrollments, and respond to queries efficiently.
          </p>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
        >
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Settings size={22} className="text-purple-500" /> Settings & Customization
          </h2>
          <p className="text-gray-400 mt-2">
            Configure platform settings, update content, and ensure smooth administration.
          </p>
        </motion.div>
      </div>

      {/* Navigation Buttons */}
      <div className="mt-8 flex flex-col md:flex-row gap-4">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
          >
            <LayoutDashboard size={22} />
            <span className="font-medium text-lg">Dashboard</span>
          </Link>
        </motion.div>

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/courseTable"
            className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
          >
            <PlusCircle size={22} />
            <span className="font-medium text-lg">Create Course</span>
          </Link>
        </motion.div>
      </div>

      {/* Floating Settings Icon */}
      <motion.button
        className="fixed bottom-8 right-8 bg-blue-500 p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
      >
        <Settings size={24} />
      </motion.button>
    </motion.div>
  );
};

export default SideBar;
