import React from "react";
import { LucideYoutube, Twitter, Instagram, Linkedin } from "lucide-react";
import { ArrowLeftRight } from "lucide-react";
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs } from "react-icons/fa";
import { SiTailwindcss, SiExpress } from "react-icons/si";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import FAQSection from "../Courses.jsx/Fqs";
import { useGetCourseQuery } from "@/features/api/courseApi";
import { useNavigate } from "react-router-dom";

// Tech Stack Icons
const techIcons = [
  { icon: <FaHtml5 className="text-orange-500" />, name: "HTML" },
  { icon: <FaCss3Alt className="text-blue-500" />, name: "CSS" },
  { icon: <FaJs className="text-yellow-400" />, name: "JavaScript" },
  { icon: <SiTailwindcss className="text-cyan-400" />, name: "Tailwind" },
  { icon: <SiExpress className="text-gray-400" />, name: "Express.js" },
  { icon: <FaReact className="text-blue-400" />, name: "React" },
  { icon: <FaNodeJs className="text-green-500" />, name: "Node.js" },
];

const advantages = [
  "Structured + problem-solving based",
  "Fastest 1:1 doubt support",
  "Integrated prep platform",
  "Profile highlighted on Naukri",
  "Real-world project-based learning",
  "Industry expert mentorship",
  "Personalized career guidance",
  "Lifetime access to course materials",
];



const testimonials = [
  {
    name: "Amit Sharma",
    role: "Software Engineer",
    feedback:
      "The course was well-structured and easy to follow. It really helped me boost my skills!",
    avatar: "https://tse3.mm.bing.net/th?id=OIP.ZZf5ANaOGgdbBM-ot_12FgHaHa&pid=Api&P=0&h=220", // Replace with actual image path
  },
  {
    name: "Priya Mehta",
    role: "Frontend Developer",
    feedback:
      "Great content and engaging lessons! The live batches were super helpful for doubt-solving.",
    avatar: "https://tse3.mm.bing.net/th?id=OIP.JFI2Xfey2oVbpOBcZbNDAAAAAA&pid=Api&P=0&h=220",
  },
  {
    name: "Rohan Verma",
    role: "Full-Stack Developer",
    feedback:
      "Loved the practical approach! The real-world projects made learning super effective.",
    avatar: "https://tse4.mm.bing.net/th?id=OIP.wEsBe2udHBieFeZVmus8qAHaHk&pid=Api&P=0&h=220",
  },
  {
    name: "Amit Sharma",
    role: "Software Engineer",
    feedback:
      "The course was well-structured and easy to follow. It really helped me boost my skills!",
    avatar: "https://tse3.mm.bing.net/th?id=OIP.ZZf5ANaOGgdbBM-ot_12FgHaHa&pid=Api&P=0&h=220", // Replace with actual image path
  },
  {
    name: "Priya Mehta",
    role: "Frontend Developer",
    feedback:
      "Great content and engaging lessons! The live batches were super helpful for doubt-solving.",
    avatar: "https://tse3.mm.bing.net/th?id=OIP.JFI2Xfey2oVbpOBcZbNDAAAAAA&pid=Api&P=0&h=220",
  },
  {
    name: "Rohan Verma",
    role: "Full-Stack Developer",
    feedback:
      "Loved the practical approach! The real-world projects made learning super effective.",
    avatar: "https://tse4.mm.bing.net/th?id=OIP.wEsBe2udHBieFeZVmus8qAHaHk&pid=Api&P=0&h=220",
  },
];


const data = [
  { platform: "YouTube", count: "1M+", color: "text-red-500", icon: <LucideYoutube size={50} className="text-red-500" /> },
  { platform: "Twitter", count: "6K+", color: "text-blue-400", icon: <Twitter size={50} className="text-blue-400" /> },
  { platform: "Instagram", count: "135K+", color: "text-pink-500", icon: <Instagram size={50} className="text-pink-500" /> },
  { platform: "LinkedIn", count: "20K+", color: "text-blue-600", icon: <Linkedin size={50} className="text-blue-600" /> }
];


const Home = () => {
  const {data:courseDataP , isLoading:courseLoder , isSuccess} = useGetCourseQuery();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen min-w-screen pt-8 bg-gradient-to-r from-gray-900 via-[#09090B] to-black text-white">
      {/* Hero Section */}
      <div className="h-[150px] flex items-center justify-center text-center">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-wide animate-fade-in">
          Chill <span className="text-[#00FFC6]">.</span> And{" "}
          <span className="text-[#00FFC6]">.</span> Code
        </h1>
      </div>

      {/* Tech Icons Animation */}
      <motion.div
        className="flex flex-wrap justify-center gap-6 mt-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        {techIcons.map((tech, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            className="text-4xl md:text-5xl"
          >
            {tech.icon}
          </motion.div>
        ))}
      </motion.div>

      {/* CTA Buttons */}
      <div className="flex flex-col items-center mt-10 space-y-6">
        <Button variant="outline" className="border-dotted border-[#7718C9]">
          Check Out Vidhayala AI
        </Button>

        {/* Introduction Section */}
        <div className="mt-10 text-center px-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Start Your Web and Web3 Journey with Us
          </h2>
          <p className="text-gray-400 mt-6 text-sm sm:text-base md:text-lg ">
            Join our courses and get first-hand knowledge about Web & Web3.
            Leverage AI to make your learning journey smoother.
          </p>
        </div>

        <Button className="h-14 sm:h-16 bg-gradient-to-r from-blue-700 to-blue-900 
          text-white px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl md:text-2xl rounded-full 
          flex items-center gap-3 transition hover:from-blue-800 hover:to-black mt-12">
          CheckOut Courses <ArrowLeftRight size={24} />
        </Button>
      </div>

      {/* Community Section */}
      <div className="flex flex-col items-center justify-center py-16 px-4 sm:px-8 md:px-12 lg:px-20">
        <motion.h2
          className="text-3xl sm:text-4xl font-extrabold mb-12 tracking-wide text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Community
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 w-full max-w-5xl">
          {data.map((item, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center p-6 rounded-xl shadow-lg bg-gray-800 hover:bg-gray-700 transition-all duration-300 border border-gray-700"
              whileHover={{ scale: 1.1 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              {item.icon}
              <p className={`text-3xl sm:text-4xl font-bold ${item.color} mt-4`}>{item.count}</p>
              <p className="text-gray-400 text-lg text-center">{item.platform}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* for advantage also */}
      <div className=" text-white  py-16 px-4 sm:px-8 md:px-12 lg:px-20 flex flex-col items-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          Vidhayala Advantages: Your Competitive Edge
        </h1>
        <p className="mt-3 text-gray-300 text-center max-w-3xl">
          Explore the unique benefits that set CodeHelp apart, giving you the
          competitive edge in your coding endeavors.
        </p>

        {/* Advantages Section */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-3 bg-gray-800 p-4 rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <CheckCircle size={30} className="text-green-500" />
              <p className="text-lg">{advantage}</p>
            </motion.div>
          ))}
        </div>

        <h1 className="text-2xl md:text-7xl font-semibold text-white my-8">
          Courses Offered.
        </h1>
      </div>

      {/* Courses Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-12 w-full px-4 sm:px-8">
      {courseDataP?.courses.slice(0,2).map((course) => (
        <div
          key={course.id}
          onClick={() => navigate(`/course-detail/${course.id}`)}
          className="bg-gray-900 rounded-2xl p-6 shadow-lg flex flex-col transition-all transform hover:scale-[1.03] hover:shadow-2xl cursor-pointer"
        >
          <img
            src={course.courseThumbnail}
            alt={course.coursetitle}
            className="w-full h-48 object-cover rounded-lg mb-5"
          />
          <h2 className="text-2xl font-semibold text-white">{course.coursetitle}</h2>
          <p className="text-gray-400 text-sm mb-2">{course.coursesubtitle}</p>
          <p className="text-gray-300 text-sm">{course.category} • {course.courseLevel}</p>
          <div className="flex items-start mt-3">
            <span className="text-red-400 line-through text-lg font-medium mr-3">
              ₹{course.coursePrice}
            </span>
            <span className="text-white text-2xl font-extrabold">₹120</span>
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Instructor: {course.creator.userName}
          </p>
          <button className="mt-5 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-full text-white font-semibold transition-all transform hover:scale-105 shadow-md">
            Enroll Now
          </button>
        </div>
      ))}
    </div>

      {/* testional for the user */}
      <div className="w-full py-16 px-6 sm:px-12  text-white">
      <h2 className="text-3xl font-bold text-center mb-12 md:text-6xl">What Our Students Say</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 w-full">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={index}
            className="bg-gray-800 rounded-2xl p-6 shadow-lg flex flex-col items-center text-center transition-all"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            whileHover={{ scale: 1.05, boxShadow: "0px 10px 20px rgba(255,255,255,0.2)" }}
          >
            <Avatar className="w-20 h-20 mb-4">
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
              <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold">{testimonial.name}</h3>
            <p className="text-gray-400 text-sm">{testimonial.role}</p>
            <p className="mt-4 text-gray-300 italic">"{testimonial.feedback}"</p>
          </motion.div>
        ))}
      </div>
    </div>
    <FAQSection/>
    </div>
  );
};

export default Home;
