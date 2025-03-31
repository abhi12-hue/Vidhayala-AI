import React from "react";
import { motion } from "framer-motion";

const Loadering = () => {
  return (
    <div className="w-full h-screen flex justify-center items-center bg-gradient-to-r from-gray-900 via-[#0a0a0e] to-black">
      {/* Animated Loader with a Glow Effect */}
      <motion.div
        className="relative w-20 h-20"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {/* Rotating outer ring */}
        <motion.div
          className="absolute inset-0 border-4 border-transparent border-t-purple-500 rounded-full animate-spin"
          style={{ animationDuration: "1.2s" }}
        />
        
        {/* Inner circle with a subtle pulse effect */}
        <motion.div
          className="absolute inset-4 bg-purple-500 rounded-full shadow-lg"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
};

export default Loadering;
