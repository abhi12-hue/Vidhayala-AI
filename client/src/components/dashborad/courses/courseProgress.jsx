import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { useGetEnrolledCourseDataQuery } from '@/features/api/courseApi';
import { useState } from "react";

const CourseProgress = () => {
  const { id } = useParams();
  const { data, isLoading, isSuccess } = useGetEnrolledCourseDataQuery(id);
  const [completedLectures, setCompletedLectures] = useState(new Set());
  const [activeLecture, setActiveLecture] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full pt-20 bg-gradient-to-r from-gray-900 via-[#09090B] to-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-t-blue-500 border-gray-700 rounded-full"
        />
      </div>
    );
  }

  if (!isSuccess || !data?.course) {
    return (
      <div className="min-h-screen w-full pt-20 bg-gradient-to-r from-gray-900 via-[#09090B] to-black text-white p-6 flex items-center justify-center">
        <p>Course not found or you haven't enrolled yet</p>
      </div>
    );
  }

  const { course } = data;
  const progressPercentage = (completedLectures.size / course.lectures.length) * 100;

  const toggleLectureCompletion = (lectureId) => {
    setCompletedLectures((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lectureId)) {
        newSet.delete(lectureId);
      } else {
        newSet.add(lectureId);
      }
      return newSet;
    });
  };

  const handleLectureClick = (lecture) => {
    setActiveLecture(lecture);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="min-h-screen w-full pt-20 bg-gradient-to-r from-gray-900 via-[#09090B] to-black text-white p-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Course Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{course.coursetitle}</h1>
              <p className="text-gray-400 text-lg">{course.coursesubtitle}</p>
            </div>
            <div className="text-sm text-gray-500 text-right">
              <p>Purchased Course</p>
              <p>Level: {course.courseLevel}</p>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Lectures List (Left Side) */}
          <motion.div
            variants={itemVariants}
            className={`lg:w-1/3 transition-all duration-300 ${
              activeLecture ? "lg:w-1/3" : "lg:w-full"
            }`}
          >
            <h2 className="text-xl font-semibold mb-4">Your Learning Journey</h2>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
              {course.lectures.map((lecture) => (
                <motion.div
                  key={lecture.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className={`bg-gray-800/50 p-4 rounded-lg flex items-center justify-between cursor-pointer ${
                    activeLecture?.id === lecture.id ? "border-2 border-blue-500" : ""
                  }`}
                  onClick={() => handleLectureClick(lecture)}
                >
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleLectureCompletion(lecture.id);
                      }}
                      className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                        completedLectures.has(lecture.id)
                          ? "bg-green-500 border-green-500"
                          : "border-gray-500"
                      }`}
                    >
                      {completedLectures.has(lecture.id) && (
                        <span className="text-white text-xs">✓</span>
                      )}
                    </button>
                    <div>
                      <h3 className="font-medium">{lecture.title}</h3>
                      <p className="text-xs text-gray-400">
                        {lecture.videoUrl ? "Video Content" : "Text Content"} • Added{" "}
                        {new Date(lecture.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Video Player (Right Side) */}
          {activeLecture && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="lg:w-2/3"
            >
              <div className="bg-gray-800/30 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4">{activeLecture.title}</h2>
                {activeLecture.videoUrl ? (
                  <div className="relative" style={{ paddingBottom: "56.25%" /* 16:9 Aspect Ratio */ }}>
                    <video
                      controls
                      className="absolute top-0 left-0 w-full h-full rounded-md"
                      src={activeLecture.videoUrl}
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                ) : (
                  <p className="text-gray-400">No video content available for this lecture.</p>
                )}
                <button
                  onClick={() => setActiveLecture(null)}
                  className="mt-4 text-sm px-4 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-md transition-colors"
                >
                  Close Player
                </button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Progress Section (Moved Below) */}
        <motion.div variants={itemVariants} className="mt-12 bg-gray-800/30 p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Your Progress</h2>
            <span className="text-sm">
              {completedLectures.size}/{course.lectures.length} Lectures Completed
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-3">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="bg-blue-500 h-3 rounded-full"
            />
          </div>
          <p className="text-sm text-gray-400 mt-2">
            {Math.round(progressPercentage)}% Complete
            {progressPercentage === 100 && (
              <span className="text-green-400 ml-2">🎉 Course Completed!</span>
            )}
          </p>
        </motion.div>

        {/* Course Description */}
        <motion.div variants={itemVariants} className="mt-12">
          <h2 className="text-xl font-semibold mb-4">Course Details</h2>
          <p className="text-gray-300 whitespace-pre-line">{course.coursedescription}</p>
          <div className="mt-4 text-sm text-gray-400">
            <p>Course Created: {new Date(course.createdAt).toLocaleDateString()}</p>
            <p>Last Updated: {new Date(course.updatedAt).toLocaleDateString()}</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CourseProgress;