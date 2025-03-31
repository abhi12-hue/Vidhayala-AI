require("dotenv").config();
const express = require("express");
const authRoute = require('./routes/UserRoute');
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const cookieParser = require('cookie-parser')
const app = express(); //  Define the app instance
const prisma = new PrismaClient();
const videoupload = require('./routes/mediaRoute')
const courseRoute = require('./routes/courseRoute');
const paymentRoutes = require("./routes/paymentRoute");
const path = require("path");
app.use(cookieParser());
app.use(
    cors({
      origin: "https://vidhayala-ai-18.onrender.com", // Replace with your actual frontend URL
      credentials: true,
    })
  );

app.use(express.json());

 // Correct path resolution
app.use("/api/v1/media" ,videoupload )
app.use('/api/v1/user', authRoute); 
app.use('/api/v1/courses', courseRoute);
app.use("/payment", paymentRoutes);

//  Error Handling Middleware (Should be last)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: "Something went wrong",
    });
});

// ✅ Serve static frontend files
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"), (err) => {
        if (err) {
            res.status(500).send(err);
        }
    });
});



//  Properly start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
































  

