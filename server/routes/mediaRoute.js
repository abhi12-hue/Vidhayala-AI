const express = require("express");
const upload = require("../utils/multer");
const { uploadMedia } = require("../utils/cloundinary");

const router = express.Router();

router.post("/upload-video", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded!" });
    }

    const result = await uploadMedia(req.file.path);
    
    res.status(200).json({
      success: true,
      message: "File uploaded successfully",
      data: result,
    });

  } catch (error) {
    console.error("Upload Error:", error);
    
    res.status(500).json({
      success: false,
      message: "Error in uploading the file",
      error: error.message,
    });
  }
});

module.exports = router;
