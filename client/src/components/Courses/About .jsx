import React from "react";
import { FaReact, FaNodeJs, FaDatabase, FaPython, FaHtml5, FaCss3Alt, FaJsSquare, FaGithub, FaDocker } from "react-icons/fa";
import { motion } from "framer-motion";

const floatingVariants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

const About = () => {
  return (
    <div className="relative min-h-screen w-full pt-20 bg-gradient-to-r from-gray-900 via-[#09090B] to-black text-white flex justify-center p-6 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-5xl bg-white bg-opacity-10 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-gray-600"
      >
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-extrabold text-center mb-6 uppercase text-gray-200"
        >
          About Me
        </motion.h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info Card */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-blue-400 mb-4">Who Am I?</h2>
            <p className="text-gray-300 leading-relaxed">
              Hi, I'm <span className="text-blue-400 font-semibold">Abhishek Bisht</span>, a passionate web developer pursuing a BCA. I started my web development journey in June 2024 and have been building full-stack applications ever since.
            </p>
          </motion.div>
          
          {/* Skills Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.2 }}
            className="bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg"
          >
            <h2 className="text-2xl font-semibold text-green-400 mb-4">My Skills</h2>
            <p className="text-gray-300 leading-relaxed">
              I specialize in the <span className="text-green-400 font-semibold">MERN stack</span>, system design, and AI integrations. Currently learning <span className="text-yellow-400 font-semibold">Next.js, TypeScript, and Prisma</span> to build scalable applications.
            </p>
          </motion.div>
        </div>
        
        {/* Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
          className="mt-8 bg-gray-800 bg-opacity-50 p-6 rounded-xl shadow-lg"
        >
          <h2 className="text-2xl font-semibold text-yellow-400 mb-4">Notable Projects</h2>
          <ul className="list-disc list-inside text-gray-400">
            <li>Study Notion App - A platform for students and instructors.</li>
            <li>E-commerce Website - A full-fledged marketplace.</li>
            <li>Employee Management System - Task assignment & tracking.</li>
          </ul>
        </motion.div>
        
        {/* Tech Stack Section */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-2xl font-bold text-center mt-8 text-gray-300"
        >
          Tech Stack
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="flex flex-wrap justify-center gap-6 mt-6"
        >
          {[ 
            { Icon: FaReact, color: "text-blue-400" },
            { Icon: FaNodeJs, color: "text-green-400" },
            { Icon: FaDatabase, color: "text-orange-400" },
            { Icon: FaPython, color: "text-yellow-400" },
            { Icon: FaHtml5, color: "text-red-500" },
            { Icon: FaCss3Alt, color: "text-blue-500" },
            { Icon: FaJsSquare, color: "text-yellow-300" },
            { Icon: FaGithub, color: "text-gray-400" },
            { Icon: FaDocker, color: "text-blue-600" },
          ].map(({ Icon, color }, index) => (
            <motion.div
              key={index}
              variants={floatingVariants}
              animate="animate"
              whileHover={{ scale: 1.3 }}
              className={`text-5xl ${color}`}
            >
              <Icon />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default About;
