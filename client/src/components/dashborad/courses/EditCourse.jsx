import { Button } from "@/components/ui/button";
import React from "react";
import { Link, useParams } from "react-router-dom";
import CourseTab from "./CourseTab";

const EditCourse = () => {
  const { id } = useParams();


  
  return (
    <div className="min-h-screen w-full pt-20 bg-gradient-to-r from-gray-900 via-[#09090B] to-black text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Top Section: Title & Button */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit Course Details</h1>
          <Link to={`/Editcourse/${id}/lecture`}>
            <Button className="bg-blue-500 hover:bg-blue-600 px-5 py-2 rounded-lg">
              Go to Lecture Page
            </Button>
          </Link>
        </div>

        <p className="text-gray-400 mb-6">Create your course effortlessly and manage lectures with ease.</p>

      
        <CourseTab />
      </div>
    </div>
  );
};

export default EditCourse;
