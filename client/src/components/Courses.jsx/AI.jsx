import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaRobot, FaCogs, FaLightbulb, FaBrain, FaChartLine } from "react-icons/fa";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { MdStars } from "react-icons/md";
import { useNavigate } from "react-router-dom";
const AI = () => {
  const navigate = useNavigate();
  const [messageIndex, setMessageIndex] = useState(0);
  const messages = [
    "Hello! How can I assist you?",
    "Looking for a course? Let me help!",
    "Ask me anything about learning.",
    "Need guidance? I'm here for you!"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-screen overflow-y-auto bg-gradient-to-r from-gray-900 via-[#0a0a0e] to-black
     text-white pt-20">
      <div className="flex flex-col items-center justify-start min-h-full pb-20">
        
        {/* Floating Icons */}
        {[
          { icon: <FaCogs />, className: "top-20 left-16" },
          { icon: <FaBrain />, className: "top-40 right-20" },
          { icon: <FaChartLine />, className: "bottom-20 left-24" },
          { icon: <MdStars />, className: "bottom-40 right-16" },
        ].map((item, index) => (
          <motion.div
            key={index}
            className={`absolute text-blue-500 text-3xl md:text-5xl ${item.className}`}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            {item.icon}
          </motion.div>
        ))}

        {/* AI Title */}
        <motion.h1
          className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text 
          text-transparent text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Meet Your AI Assistant
        </motion.h1>
        <motion.p
          className="text-gray-400 mt-4 text-lg md:text-xl text-center max-w-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Get instant answers, course recommendations, and guidance powered by AI.
        </motion.p>

        {/* AI Chat Interface */}
        <motion.div
          className="mt-10 bg-gray-800 bg-opacity-30 backdrop-blur-lg p-6 md:p-8 rounded-lg shadow-xl max-w-2xl w-full text-center border border-gray-700"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex items-center justify-center mb-4"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaRobot className="text-6xl text-blue-400 mx-auto" />
          </motion.div>
          <h2 className="text-2xl font-semibold flex items-center justify-center gap-2">
            <FaLightbulb className="text-yellow-400" /> {messages[messageIndex]}
          </h2>
          <p className="text-gray-400 mt-2">Ask me anything about courses, learning progress, or career guidance.</p>

          <motion.button
            className="mt-6 flex items-center gap-2 bg-blue-500 text-white py-3 px-6 rounded-lg text-lg font-semibold hover:bg-blue-600 transition-all duration-300 shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/chat")}
          >
            <IoChatbubbleEllipsesSharp className="text-2xl" /> Talk to AI
          </motion.button>
        </motion.div>

        {/* AI Features Section */}
        <motion.div
          className="mt-10 bg-gray-800 bg-opacity-50 p-6 md:p-8 rounded-lg shadow-xl max-w-xl w-full text-center border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-blue-400">How This AI Helps You</h3>
          <p className="text-gray-300 mt-4">This AI assistant provides:</p>
          <ul className="text-gray-400 mt-2 list-disc list-inside text-left mx-auto w-fit">
            <li>Instant answers to your queries</li>
            <li>Personalized course recommendations</li>
            <li>Guidance for your learning journey</li>
            <li>Interactive and engaging AI chat</li>
          </ul>
        </motion.div>
      </div>
    </div>
  );
};

export default AI;
