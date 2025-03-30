import React from "react";
import { useLoadUserQuery } from "@/features/api/authApi";

const EditProfile = () => {
  const { data, isLoading } = useLoadUserQuery();

  console.log("Fetched user data:", data);

  // Check if data is still loading
  if (isLoading) return <p className="text-white">Loading...</p>;

  // Ensure `data` exists and provide fallback values
  const userName = data?.userName || "Guest";
  const photoUrl = data?.photoUrl || "/default-profile.png"; // Use a default image

  return (
    <div
      className="w-full h-screen overflow-y-auto bg-gradient-to-r from-gray-900 via-[#0a0a0e] to-black
        text-white pt-20 flex flex-col items-center"
    >
      {/* Profile Section */}
      <div className="w-3/4 md:w-2/3 lg:w-1/2 bg-gray-800 p-6 rounded-lg flex items-center gap-6 shadow-lg">
        <img
          src={photoUrl}
          alt="Profile"
          className="w-24 h-24 rounded-full border-2 border-gray-300"
        />
        <div>
          <h2 className="text-2xl font-semibold">{userName}</h2>
          <button
            className="mt-2 px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
            onClick={() => console.log("Edit button clicked")} // Placeholder action
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
