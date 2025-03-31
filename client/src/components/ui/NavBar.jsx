import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Brain, Book, Menu } from "lucide-react";
import { Code2 } from "lucide-react"; // Example Lucide React icon

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useCheckuserQuery, useLogoutUserMutation } from "@/features/api/authApi";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const NavBar = () => {
  const navigate = useNavigate();
  const {data , refetch} = useCheckuserQuery();
  const [menuOpen, setMenuOpen] = useState(false);

  const [logoutUser , {isSuccess}] = useLogoutUserMutation(); // Mutation for logout

const logoutHandler = async () => {
  try {
    await logoutUser(); // Call the logout mutation
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

useEffect(()=>{
  if(isSuccess ){
    toast.success("Logout Succefully!");
    refetch();
    navigate("/login"); // Redirect to login page
  }
},[isSuccess])

  return (
    <div className="h-16 border-b-[2px] border-[#181A28] fixed top-0 left-0 right-0 z-10 backdrop-blur-md ">
      <div className="container mx-auto px-4 flex items-center justify-between h-full">
        {/* Animated Logo */}
        <motion.h1
          className="text-2xl font-bold text-white tracking-wide cursor-pointer"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          
          
        >
          <Link to='/'>Vidhayala AI</Link>
        </motion.h1>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center space-x-6">
          <Link to="/about" className="text-white hover:text-gray-300">About</Link>
         
          {data ? (
            <>
              <Link 
                to="/ai" 
                className="flex items-center space-x-2 text-white transition duration-300 hover:text-purple-400"
              >
                <Brain className="w-5 h-5" />
                <span className="hidden md:block">AI</span>
              </Link>
              <Link 
                to="/explore-course" 
                className="flex items-center space-x-2 text-white transition duration-300 hover:text-purple-400"
              >
                <Book className="w-5 h-5" />
                <span className="hidden md:block">Explore Courses</span>
              </Link>

              {/* Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar className="w-10 h-10 cursor-pointer hover:scale-105 transition duration-300">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black text-white border border-gray-700 w-48 right-0">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem><Link to="/learning">My Learning</Link></DropdownMenuItem>
                  <DropdownMenuItem><Link to="/profile">Edit Profile</Link></DropdownMenuItem>
                  {
                    data.user.role ==='admin' && <DropdownMenuItem><Link to="/admin">Dashboard</Link></DropdownMenuItem>
                  }
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-400 hover:text-red-500"
                  onClick={logoutHandler}
                  >Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/signin" className="text-white hover:text-gray-300">Sign In</Link>
              <Link to="/login" className="text-white hover:text-gray-300">Login</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="sm:hidden relative">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <Menu className="w-6 h-6 text-white" />
          </button>
          {menuOpen && (
            <div className="absolute top-16 right-0 bg-black border border-white rounded-md shadow-md w-48 p-2 overflow-hidden">
              <Link to="/about" className="block text-white hover:bg-gray-800 p-2 rounded-md">About</Link>
              <Link to="/courses" className="block text-white hover:bg-purple-500 p-2 rounded-md transition duration-300">Courses</Link>
              {data ? (
                <>
                  <Link 
                    to="/ai" 
                    className="text-white hover:bg-purple-500 p-2 rounded-md flex items-center space-x-2 transition duration-300"
                  >
                    <Brain className="w-5 h-5" />
                    <span>AI</span>
                  </Link>
                  <Link 
                    to="/explore-course" 
                    className="text-white hover:bg-purple-500 p-2 rounded-md flex items-center space-x-2 transition duration-300"
                  >
                    <Book className="w-5 h-5" />
                    <span>Explore Courses</span>
                  </Link>

                  {/* Avatar Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-800 rounded-md">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src="https://github.com/shadcn.png" />
                          <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <span className="text-white">My Account</span>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-black text-white border border-gray-700 w-48 right-0">
                      <DropdownMenuLabel>My Account</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem><Link to="/learning">My Learning</Link></DropdownMenuItem>
                      <DropdownMenuItem><Link to="/profile">Edit Profile</Link></DropdownMenuItem>
                      <DropdownMenuItem><Link to="/dashboard">Dashboard</Link></DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-400 hover:text-red-500">Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <>
                  <Link to="/signin" className="block text-white hover:bg-gray-800 p-2 rounded-md">Sign In</Link>
                  <Link to="/login" className="block text-white hover:bg-gray-800 p-2 rounded-md mt-2">Login</Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;
