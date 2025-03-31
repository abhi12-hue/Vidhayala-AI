import React from "react";
import { motion } from "framer-motion";
import { SiJavascript, SiReact, SiNodedotjs, SiMongodb, SiNextdotjs } from "react-icons/si";
import { useGetmylearningQuery } from "@/features/api/courseApi";
import { useNavigate } from "react-router-dom";
const icons = [
  { Icon: SiJavascript, color: "text-yellow-400", direction: 1 },
  { Icon: SiReact, color: "text-blue-400", direction: -1 },
  { Icon: SiNodedotjs, color: "text-green-400", direction: 1 },
  { Icon: SiMongodb, color: "text-green-500", direction: -1 },
  { Icon: SiNextdotjs, color: "text-white", direction: 1 },
];

const MyLearning = () => {
  const navigate = useNavigate();
  const {data , isLoading , isSucess} = useGetmylearningQuery();
  return (
    <div className="relative min-h-screen w-full pt-20 bg-gradient-to-r from-gray-900 via-[#09090B] to-black text-white overflow-hidden">
      {/* Floating Background Icons */}
      {icons.map(({ Icon, color, direction }, index) => (
        <motion.div
          key={index}
          className={`absolute opacity-20 ${color}`}
          initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight }}
          animate={{ 
            y: ["100vh", "-10vh"], 
            x: direction === 1 ? ["5vw", "95vw"] : ["95vw", "5vw"]
          }}
          transition={{ duration: Math.random() * 15 + 10, repeat: Infinity, ease: "linear" }}
        >
          <Icon className="text-8xl opacity-40" />
        </motion.div>
      ))}

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.h1 
          className="text-4xl font-bold md:text-6xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Welcome to The Learning Hub! 🚀
        </motion.h1>
        
        <motion.p 
          className="text-gray-400 mt-4 text-lg md:text-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Keep track of your learning progress with interactive and exciting courses.
        </motion.p>

        {/* Courses Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold md:text-4xl">Your Courses</h2>

          {/* Course Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            {data?.course.map((course) => (
              <motion.div
              onClick={() => navigate(`/course-detail/${course.id}`)}
                key={course.id}
                className="bg-gray-800 p-4 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300 relative z-10"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={course.courseThumbnail} 
                  alt={course.coursetitle} 
                  className="w-full h-40 object-cover rounded-md"
                />
                <div className="flex items-center gap-3 mt-4">
                  {course.icon}
                  <h3 className="text-xl font-semibold">{course.coursetitle}</h3>
                </div>
                <p className="text-gray-400 mt-2">{course.coursedescription}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default MyLearning;