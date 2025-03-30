const { PrismaClient } = require("@prisma/client");
const { deleteMedia, uploadMedia , deleteVideo  } = require("../utils/cloundinary");
const prisma = new PrismaClient();
const createCourse = async (req, res) => {
    try {
        const { coursetitle, category } = req.body;
        const course = await prisma.course.create({
            data: {
                coursetitle,
                category,
                creatorId: req.id
            } // ✅ Fix: Connects user ID
            
        });
        
        return res.status(201).json({
            course,
            message: "Course Created Successfully",
        });
    } catch (error) {
        console.error(error); // Log error for debugging

        return res.status(500).json({
            message: "Failed to create course",
            error: error.message,
        });
    }
};

const getCreatorCourse = async(req , res)=>{
    try{
        const userId = req.id;
        const course = await prisma.course.findMany({
            where:{
                creatorId:userId
            }
        })
        if(!course){
            return res.status(404).json({
                success:false,
                message:"Course not found"
            })
        }

        return res.status(200).json({
            course
        })
    }catch(error){
        console.error(error); // Log error for debugging

        return res.status(500).json({
            message: "Failed to create course",
            error: error.message,
        });
    }
}

const updateCourses = async (req, res) => {
    try {
        const { coursetitle, coursesubtitle, coursedescription, category, courseLevel, coursePrice } = req.body;
        const userId = parseInt(req.params.id); // Convert id to integer
        const parsedCoursePrice = parseInt(coursePrice); // Convert coursePrice to integer
        const courseThumbnail = req.file;

        if (isNaN(userId)) {
            return res.status(400).json({
                message: "Invalid course ID",
                success: false
            });
        }

        if (isNaN(parsedCoursePrice)) {
            return res.status(400).json({
                message: "Invalid course price",
                success: false
            });
        }

        let course = await prisma.course.findUnique({
            where: {
                id: userId
            }
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found",
                success: false
            });
        }

        let courseThumbnails;
        if (courseThumbnail) {
            if (course.courseThumbnail) {
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMedia(publicId); // Delete the old image before updating
            }
            courseThumbnails = await uploadMedia(courseThumbnail.path);
        }
        const formattedCourseLevel = courseLevel.charAt(0).toUpperCase() + courseLevel.slice(1).toLowerCase();
        // Preparing updated course data
        const updateData = {
            coursetitle,
            coursesubtitle,
            coursedescription,
            category,
            courseLevel:formattedCourseLevel,
            coursePrice: parsedCoursePrice, // Ensure it's an integer
            courseThumbnail: courseThumbnails?.secure_url // Ensure proper assignment
        };

        course = await prisma.course.update({
            where: {
                id: userId
            },
            data: updateData
        });

        return res.status(200).json({
            course,
            message: "Course updated successfully"
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to update course",
            error: error.message,
        });
    }
};

const getCourseById = async(req , res)=>{
    try{
        const courseId = req.params.id;
        const course = await prisma.course.findUnique({
            where:{
                id:courseId
            }
        })
        if(!course){
            return res.status(404).json({
                message:"the course is not found",
                success:false,
            })
        }

        res.status(200).json({
            message:"Fetch Succefully",
            success:true,
            course
        })
    }catch(error){
        return res.status(500).json({
            message: "Failed to get by id",
            error: error.message,
        });
    }
};
const createLecture = async (req, res) => {
    try {
        const { title } = req.body;
        const courseId = parseInt(req.params.id); // Ensure courseId is an integer

        // Check if the course exists
        const course = await prisma.course.findUnique({
            where: { id: courseId },
        });

        if (!course) {
            return res.status(400).json({ message: "Course not found" });
        }

        // Create a new lecture
        const lecture = await prisma.lectures.create({
            data: {
                title,
                courseId, // Link lecture to course
            },
        });

        return res.status(201).json({
            lecture,
            message: "Lecture Created Successfully",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to create the lecture",
            error: error.message,
        });
    }
};

const getAllLecture = async(req , res)=>{
    try{
        const courseId = parseInt(req.params.id);
        const course = await prisma.course.findUnique({
            where:{
                id:courseId,
            },
            include:{
                lectures:true
            }
        });

        if(!course){
            return res.status(404).json({
                message:"Course not found"
            })
        }
        return res.status(200).json({
            lectures:course.lectures,
        });
    }catch(error){
        return res.status(500).json({
            message: "Failed to get the lecture",
            error: error.message,
        });
    }
}
const editLecture = async (req, res) => {
    try {
        const { lecturetitle, videoInfo, isPreviewFree } = req.body;
        const { id, lectureId } = req.params;
        

        // Find the lecture
        const lecture = await prisma.lectures.findUnique({
            where: { id: Number(lectureId) }, 
        });

        if (!lecture) { 
            return res.status(404).json({ message: "Lecture not found!" });
        }

        // Update lecture details
        const updatedLecture = await prisma.lectures.update({
            where: { id: Number(lectureId) },
            data: {
                title: lecturetitle || lecture.title,
                videoUrl: videoInfo?.videoUrl ,
                publicId: videoInfo?.publicId,
                isPreviewFree: isPreviewFree !== undefined ? isPreviewFree : lecture.isPreviewFree,
            },
        });

        // Ensure the course still has the lecture ID if it wasn't already added
        const course = await prisma.course.findUnique({
            where: { id: Number(id) },
            include: { lectures: true },
        });

        if (course && !course.lectures.some(l => l.id === Number(lectureId))) {
            await prisma.course.update({
                where: { id: Number(id) },
                data: {
                    lectures: { connect: { id: Number(lectureId) } }, // Add lecture to course
                },
            });
        }

        return res.status(200).json({
            lecture: updatedLecture,
            message: "Lecture updated successfully.",
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to edit lectures" });
    }
};


const removeLecture = async (req, res) => {
    try {
        const lectureId = Number(req.params.lectureId); // Convert to number

        console.log("Lecture ID received:", lectureId);

        if (!lectureId || isNaN(lectureId)) {
            return res.status(400).json({
                message: "Invalid or missing Lecture ID",
            });
        }

        // Find the lecture before deleting
        const lecture = await prisma.lectures.findUnique({
            where: { id: lectureId },
            include: { course: true } // Include related course
        });

        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found",
            });
        }

        // Delete video from Cloudinary if it exists
        if (lecture.publicId) {
            await deleteVideo(lecture.publicId);  // Ensure deleteVideo function exists
        }

        // Delete the lecture from the database
        await prisma.lectures.delete({
            where: { id: lectureId }
        });

        return res.status(200).json({
            message: "Lecture deleted successfully",
        });

    } catch (error) {
        console.error("Error deleting lecture:", error); // Log the full error for debugging
        return res.status(500).json({
            message: "Failed to delete the lecture",
            error: error.message,
        });
    }
};

const getLectureById = async (req, res) => {
    try {
        const lectureId = req.params.id;// ✅ Fixed params typo

        // Find the lecture by ID
        const lecture = await prisma.lectures.findUnique({
            where: { id: lectureId },
        });

        // If lecture not found, return 404
        if (!lecture) {
            return res.status(404).json({ 
                message: "Lecture not found",
            });
        }

        // Send the lecture data as a response
        return res.status(200).json({
            message: "Lecture fetched successfully",
            lecture,
        });

    } catch (error) {
        return res.status(500).json({
            message: "Failed to get the lecture",
            error: error.message,
        });
    }
};

//to uplish and publish logic
const togglePublishCourse = async (req, res) => {
    try {
        const id = Number(req.params.id); // Convert ID to number
        const { publish } = req.query; // "true" or "false"

        if (isNaN(id)) {
            return res.status(400).json({
                message: "Invalid course ID",
            });
        }

        const course = await prisma.course.findUnique({
            where: { id }
        });

        if (!course) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        // Convert publish query to boolean
        const isPublished = publish === "true";

        // Update course publication status
        await prisma.course.update({
            where: { id },
            data: { isPublished },
        });

        return res.status(200).json({
            message: `Course has been ${isPublished ? "published" : "unpublished"}.`,
        });

    } catch (error) {
        console.error("Error updating course status:", error); // Log error for debugging
        return res.status(500).json({
            message: "Failed to update course publication status",
            error: error.message,
        });
    }
};

//to show to ui
const getPublishedCourse = async(req , res)=>{
    try{
        const courses = await prisma.course.findMany({
            where:{
                isPublished:true
            },
            include: {
                creator: {
                    select: {
                        photoUrl: true,  // Fetch only profileImage
                        userName: true           // Optional: Fetch user name too
                    }
                }
            }
        })
        if(!courses){
            return res.status(404).json({
                message:"the course not found",
                success:false,
            });
        }

        return res.status(200).json({
            success:true,
            message:"the course found",
            courses
        })
    }catch(error){
        return res.status(500).json({
            message: "Failed to fetch the Publiched course",
            error: error.message,
        });
    }
}

// to fetch the course detail 
const getCourseDetailById = async(req , res)=>{
    try{
        const id = Number(req.params.id);
        const courses = await prisma.course.findUnique({
            where: {
              id: id,
            },
            include: {
              lectures: {
                orderBy: {
                  title: 'asc',
                },
                select: {
                  title: true,
                  isPreviewFree: true,
                }
              }
            }
          });
          
        if(!courses){
            return res.status(402).json({
                message:"the courses not found",
                success:false,
            });
        }

        return res.status(200).json({
            message:"Succefully Fetch the courses Detail",
            success:true,
            courses
        })
    }catch(error){
        return res.status(500).json({
            message: "Failed to fetch the Publiched course",
            error: error.message,
        });
    }
}

const filter = async (req, res) => {
    try {
        const { category, price, courselevel } = req.body;

        const filter = await prisma.course.findMany({
            where: {
                OR: [
                    category ? { category: { contains: category, mode: 'insensitive' } } : null,
                    price ? { coursePrice: Number(price) } : null,
                    courselevel ? { courseLevel: { contains: courselevel, mode: 'insensitive' } } : null,
                ].filter(Boolean) // Ye null values hata dega
            }
        });

        if (filter.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Koi related data nahi mila",
            });
        }

        return res.status(200).json({
            message: "Ye raha filtered data",
            success: true,
            filter
        });
    } catch (error) {
        return res.status(500).json({
            message: "Filter lagane me error aaya",
            error: error.message,
        });
    }
};

//to get the mylearning of the user
const getMyLearning = async (req , res)=>{
    try{
        const userId = req?.id;
        const mylearning = await prisma.user.findUnique({
            where:{
                id:userId,
            },
            include:{
                enrolledCourses:true,
            }
        });
        return res.status(200).json({
            success:true,
            message:"this is your enrolled Course",
            mylearning
        })

        
    }catch(error){
        console.error("Error fetching user profile:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to get my learning",
        });
    }
}

//fetch data of course the by the id
const getEnrolledCourse = async (req, res) => {
    const courseId =Number(req.params.id);
    const userId = req.id; // Assuming user ID is available in `req.user`

    try {
        // Check if the course exists
        const checkCourse = await prisma.course.findUnique({
            where: {
                id: courseId,
            },
            include: {
                enrollStudent: true,
                lectures: { orderBy: { createdAt: 'asc' } }
            },
        });

        if (!checkCourse) {
            return res.status(404).json({
                message: "The course not found",
                success: false,
            });
        }

        // Check if the user is enrolled in the course
        const isEnrolled = checkCourse.enrollStudent.some(student => student.id === userId);

        if (!isEnrolled) {
            return res.status(403).json({
                message: "You are not enrolled in this course",
                success: false,
            });
        }

        return res.status(200).json({
            message: "Course fetched successfully",
            success: true,
            course: checkCourse,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Facing error on fetching the data",
            success: false,
        });
    }
};


// chatbotController.js
// chatbotController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const streamChatResponse = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required!" });
    }

    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.9, // Increased for more creative responses
        maxOutputTokens: 2000, // More room for detailed answers
      },
    });

    const chat = model.startChat();
    const result = await chat.sendMessageStream(message);

    for await (const chunk of result.stream) {
      res.write(chunk.text());
    }
    res.end();

  } catch (error) {
    console.error("Error in streamChatResponse:", error);
    res.status(500).write(
      JSON.stringify({
        success: false,
        message: "System overload detected!",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      })
    );
    res.end();
  }
};
module.exports = { createCourse , getCreatorCourse ,updateCourses ,getCourseById , createLecture , 
    getAllLecture , editLecture , removeLecture , getLectureById , togglePublishCourse , getPublishedCourse , getCourseDetailById
, filter , getMyLearning , getEnrolledCourse , streamChatResponse };
