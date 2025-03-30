import { useEditCourseMutation, useGetCoursesByIdQuery, usePublishCourseMutation } from "@/features/api/courseApi";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react"; // Import back icon

const CourseTab = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch course data with the correct ID
  const { data:courseData, isLoading:courseLoading ,refetch} = useGetCoursesByIdQuery(id);
  const populate = courseData?.courses;
  console.log(populate);
  const [course, setCourse] = useState({
    title: "",
    subtitle: "",
    description: "",
    category: "",
    level: "",
    price: "",
    thumbnail: null,
    previewThumbnail: null,
  });

  //to for render the course after the updates
  useEffect(() => {
    if (populate) {  
      setCourse({  
        title: populate?.coursetitle,
        subtitle:populate?.coursesubtitle,
        description: populate?.coursedescription,
        category: populate?.category,
        level: populate?.courseLevel,
        price: populate?.coursePrice,
        thumbnail: "",
      });
    }
  }, [courseData]);

  
  const [editCourse, { data, isLoading, isSuccess, error  }] = useEditCourseMutation();

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewURL = URL.createObjectURL(file);
      setCourse((prev) => ({
        ...prev,
        thumbnail: file,
        previewThumbnail: previewURL,
      }));
    }
  };

  useEffect(() => {
    return () => {
      if (course.previewThumbnail) {
        URL.revokeObjectURL(course.previewThumbnail);
      }
    };
  }, [course.previewThumbnail]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("id", id);
    formData.append("coursetitle", course.title);
    formData.append("coursesubtitle", course.subtitle);
    formData.append("coursedescription", course.description);
    formData.append("category", course.category);
    formData.append("courseLevel", course.level);
    formData.append("coursePrice", Number(course.price));

    if (course.thumbnail) {
      formData.append("courseThumbnail", course.thumbnail);
    }

    console.log("Submitting form data:", Object.fromEntries(formData));

    editCourse({ formData, id });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course Updated Successfully");
    }
    if (error) {
      toast.error(error?.data?.message || "Failed to update course");
    }
  }, [isSuccess, error, data, navigate]);

  const [PublishCourse, { isLoading: publishLoading }] = usePublishCourseMutation();
  const publishHandler = async (action) => {
    try {
      const response = await PublishCourse({ id, query:action });
      refetch();

      if (response.data) {
        toast.success(`Course ${action === "true" ? "Published" : "Unpublished"} Successfully`);
      } else {
        throw new Error(response?.error?.data?.message || "Failed to update publish status");
      }
    } catch (error) {
      toast.error(error.message || "Error publishing course");
    }
  };


  const handleDeleteCourse = () => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      console.log("Course deleted");
    }
  };

  if (courseLoading) return <p className="text-white">Loading...</p>;


  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md">
      {/* Buttons Section */}
      <button
        onClick={() => publishHandler(populate?.isPublished ? "false" : "true")}
        className={`px-5 py-2 rounded-lg ${populate?.isPublished ? "bg-red-500 hover:bg-red-600" : "bg-green-600 hover:bg-green-700"
          }`}
        disabled={publishLoading}  // Disable when loading
      >
        {publishLoading ? "Processing..." : populate?.isPublished ? "Unpublish" : "Publish"}
      </button>


      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        {/* Back Button */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2
         text-black">
          <ArrowLeft size={24} />
          <span>Back</span>
        </button>

        {/* Save Changes Button at Top */}
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading}
          className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <h2 className="text-lg font-semibold mb-4">Course Details</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Course Title */}
        <div>
          <label className="block text-sm font-medium">Course Title</label>
          <input
            type="text"
            name="title"
            value={course.title}
            onChange={handleChange}
            placeholder="Enter course title"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none"
          />
        </div>

        {/* Course Subtitle */}
        <div>
          <label className="block text-sm font-medium">Course Subtitle</label>
          <input
            type="text"
            name="subtitle"
            value={course.subtitle}
            onChange={handleChange}
            placeholder="Enter course subtitle"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none"
          />
        </div>

        {/* Course Description */}
        <div>
          <label className="block text-sm font-medium">Course Description</label>
          <textarea
            name="description"
            value={course.description}
            onChange={handleChange}
            placeholder="Enter course description"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none h-32"
          ></textarea>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium">Category</label>
          <select
            name="category"
            value={course.category}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none"
          >
            <option value="">Select Category</option>
            <option value="web-development">Web Development</option>
            <option value="data-science">Data Science</option>
            <option value="ai">Artificial Intelligence</option>
          </select>
        </div>

        {/* Course Level */}
        <div>
          <label className="block text-sm font-medium">Course Level</label>
          <select
            name="level"
            value={course.level}
            onChange={handleChange}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none"
          >
            <option value="">Select Level</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        {/* Course Price */}
        <div>
          <label className="block text-sm font-medium">Price ($)</label>
          <input
            type="number"
            name="price"
            value={course.price}
            onChange={handleChange}
            placeholder="Enter price"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none"
          />
        </div>

        {/* Course Thumbnail */}
        <div>
          <label className="block text-sm font-medium">Course Thumbnail</label>
          <input
            type="file"
            name="thumbnail"
            onChange={handleThumbnailChange}
            accept="image/*"
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none"
          />
        </div>

        {/* Thumbnail Preview */}
        {course.previewThumbnail && (
          <div className="mt-4">
            <p className="text-sm">Thumbnail Preview:</p>
            <img
              src={course.previewThumbnail}
              alt="Thumbnail Preview"
              className="w-40 h-40 object-cover rounded border border-gray-600"
            />
          </div>
        )}

        {/* Save Changes Button at Bottom */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-2 bg-blue-500 rounded hover:bg-blue-600 transition disabled:opacity-50"
        >
          {isLoading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default CourseTab;
