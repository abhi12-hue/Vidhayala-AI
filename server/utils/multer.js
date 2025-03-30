const multer = require("multer");

// Set up storage configuration
const upload = multer({ dest: "uploads/" });

module.exports = upload;
