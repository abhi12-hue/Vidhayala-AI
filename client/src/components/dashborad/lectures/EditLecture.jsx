import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, Save, Loader2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useEditCourseLectureMutation, useEditRemoveLectureMutation } from "@/features/api/courseApi";

const mediaAPI = "http://localhost:5000/api/v1/media";

const EditLecture = () => {
  const { id, lectureId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [isFree, setIsFree] = useState(false);
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const [editCourseLecture] = useEditCourseLectureMutation();
  const [editRemoveLecture, { isLoading: removing }] = useEditRemoveLectureMutation();

  // Handle Video Upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${mediaAPI}/upload-video`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload");

      const res = await response.json();

      if (res.success) {
        toast.success("🎥 Video uploaded successfully!");
        setUploadVideoInfo({
          videoUrl: res.data.secure_url,
          publicId: res.data.public_id,
        });
      } else {
        toast.error("Video upload failed!");
      }
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Error uploading video.");
    } finally {
      setUploading(false);
    }
  };

  // Handle Lecture Update
  const handleUpdateLecture = async () => {
    if (!title.trim()) {
      toast.error("Lecture title cannot be empty!");
      return;
    }
    setIsUpdating(true);
    try {
      await editCourseLecture({
        lecturetitle: title,
        videoInfo: uploadVideoInfo,
        isPreviewFree: isFree,
        id,
        lectureId,
      }).unwrap();
      toast.success("Lecture updated successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("Failed to update lecture.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Lecture Removal
  const handleRemoveLecture = async () => {
    if (!lectureId) return;

    try {
      await editRemoveLecture(lectureId).unwrap();
      toast.success("Lecture removed successfully!");
      navigate(-1);
    } catch (error) {
      console.error("Remove Error:", error);
      toast.error("Failed to remove lecture.");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center p-8 bg-gray-950 text-white pt-20">
      {/* Header */}
      <div className="w-full flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-white transition"
        >
          <ArrowLeft size={24} className="mr-2" />
          <span className="text-lg font-medium">Back</span>
        </button>
      </div>

      {/* Card Container */}
      <div className="w-full max-w-2xl bg-gray-900 shadow-xl rounded-xl p-6 mt-6">
        <h2 className="text-2xl font-semibold mb-4">Edit Lecture</h2>

        {/* Title Input */}
        <label className="block text-sm font-medium text-gray-400 mb-2">Lecture Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter lecture title"
          className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
        />

        {/* Upload Video */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-400 mb-2">Upload Video</label>
          <label
            className={`flex items-center justify-center w-full h-16 border-2 border-dashed rounded-lg cursor-pointer transition ${
              uploading
                ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {uploading ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload size={20} className="mr-2 text-pink-400" />
                Choose Video
              </>
            )}
            <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" disabled={uploading} />
          </label>

          {/* Show Uploaded Video */}
          {uploadVideoInfo && (
            <p className="text-green-400 text-sm mt-2">
              ✅ Video Uploaded: {uploadVideoInfo.videoUrl}
            </p>
          )}
        </div>

        {/* Free/Paid Toggle */}
        <div className="mt-6 flex items-center justify-between">
          <span className="text-gray-300">Is this video free?</span>
          <div
            className={`relative w-16 h-8 rounded-full cursor-pointer transition ${
              isFree ? "bg-green-500" : "bg-red-500"
            }`}
            onClick={() => setIsFree(!isFree)}
          >
            <motion.div
              className="w-6 h-6 bg-white rounded-full shadow-md"
              animate={{ x: isFree ? "100%" : "0%" }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex space-x-4">
          {/* Update Lecture Button */}
          <button
            onClick={handleUpdateLecture}
            className={`flex-1 flex justify-center items-center py-3 rounded-lg font-semibold shadow-lg transition ${
              isUpdating
                ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white hover:scale-105"
            }`}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save size={20} className="mr-2" />
                Update Lecture
              </>
            )}
          </button>

          {/* Remove Lecture Button */}
          <button
            onClick={handleRemoveLecture}
            className="flex-1 flex justify-center items-center py-3 rounded-lg font-semibold shadow-lg bg-red-600 hover:bg-red-500 text-white hover:scale-105 transition"
            disabled={removing}
          >
            {removing ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                Removing...
              </>
            ) : (
              <>
                <Trash2 size={20} className="mr-2" />
                Remove Lecture
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditLecture;
