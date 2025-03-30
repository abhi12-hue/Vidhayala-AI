const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, // Using your .env names
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SCREAT, // Fixed typo in 'API_SCREAT' (should be 'API_SECRET' if it's a mistake)
});

// Function to upload media (image, video, etc.)
const uploadMedia = async (file) => {
    try {
        const uploadResponse = await cloudinary.uploader.upload(file, {
            resource_type: "auto",
        });
        return uploadResponse; // Return the uploaded file URL
    } catch (error) {
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }
};

// Function to delete an image or any other media
const deleteMedia = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`Deleted media with ID: ${publicId}`);
    } catch (error) {
        console.error("Cloudinary Deletion Error:", error);
        throw error;
    }
};

// Function to delete a video
const deleteVideo = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId, {
            resource_type: "video",
        });
        console.log(`Deleted video with ID: ${publicId}`);
    } catch (error) {
        console.error("Cloudinary Video Deletion Error:", error);
        throw error;
    }
};

// Export functions for use in other files
module.exports = { uploadMedia, deleteMedia, deleteVideo };
