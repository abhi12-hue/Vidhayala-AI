import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useCreateLectureMutation, useGetCourseLectureQuery } from "@/features/api/courseApi";
import { Pencil } from "lucide-react"; // Edit icon

const CreateLecture = () => {
  const { id } = useParams(); // Course ID
  const navigate = useNavigate();
  const [title, setTitle] = useState("");

  const [createLecture, { isLoading, isSuccess, error, reset }] = useCreateLectureMutation();
  
  // Fetch existing lectures
  const { data: lectureData, isLoading: lectureLoading, refetch } = useGetCourseLectureQuery(id);

  // Handle lecture creation
  const createLectureHandler = async () => {
    if (!title.trim()) {
      toast.error("Lecture title cannot be empty!");
      return;
    }

    await createLecture({ title, id });
  };

  // Handle notifications on success/error
  useEffect(() => {
    if (isSuccess) {
      toast.success("Lecture created successfully!");
      setTitle(""); // Clear input field after success
      refetch();
      reset();
    }
    if (error) {
      toast.error(error?.data?.message || "Failed to create lecture");
    }
  }, [isSuccess, error]);

  return (
    <div className="relative min-h-screen w-full pt-20 bg-gradient-to-r from-gray-900 via-[#09090B] to-black text-white flex flex-col items-center p-6 overflow-hidden">
      {/* Heading */}
      <motion.h1
        className="text-4xl font-bold mb-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Manage Course Lectures
      </motion.h1>
      <p className="text-gray-400 mb-6 text-lg text-center">
        Add, edit, and manage lectures efficiently.
      </p>

      {/* Lecture Form */}
      <motion.div
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-lg space-y-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <label className="block text-sm font-medium text-gray-300">Lecture Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter lecture title"
            className="w-full mt-2 p-3 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={createLectureHandler}
          disabled={isLoading}
          className="w-full px-6 py-2 bg-blue-600 hover:bg-blue-700 transition rounded-lg text-white font-medium shadow-md disabled:opacity-50"
        >
          {isLoading ? "Creating..." : "Create Lecture"}
        </button>
      </motion.div>

      {/* Lecture List */}
      <div className="mt-10 w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Lecture List</h2>

        {lectureLoading ? (
          <p className="text-gray-400">Loading lectures...</p>
        ) : lectureData?.lectures?.length > 0 ? (
          <ul className="space-y-3">
            {lectureData.lectures.map((lecture, index) => (
              <li
                key={lecture.id}
                className="flex justify-between items-center bg-gray-800 p-4 rounded-lg shadow-md"
              >
                <span className="text-white">
                  <span className="font-semibold text-gray-300">Lecture {index + 1}: </span>
                  {lecture.title}
                </span>
                <button
                  onClick={() => navigate(`/Editcourse/${id}/lecture/${lecture.id}`)}
                  className="text-blue-400 hover:text-blue-500"
                >
                  <Pencil size={20} />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No lectures available.</p>
        )}
      </div>
    </div>
  );
};

export default CreateLecture;
