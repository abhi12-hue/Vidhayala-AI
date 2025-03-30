const express = require("express");
const { isAuthicated } = require("../middleware/isAuthicated");
const {createCourse, getCreatorCourse, getMyLearning,
    filter , updateCourses, getCourseById ,getEnrolledCourse , streamChatResponse, getPublishedCourse ,getCourseDetailById,createLecture ,editLecture , getAllLecture , removeLecture , getLectureById , togglePublishCourse}  = require('../controller/CourseController')
const upload = require('../utils/multer')
const router = express.Router();
router.post('/' , isAuthicated , createCourse);
router.get('/published-course' ,isAuthicated , getPublishedCourse);
router.get('/:id' ,isAuthicated , getCourseDetailById);
router.get('/'  , getCreatorCourse);
router.put('/:id' , isAuthicated , upload.single("courseThumbnail") ,updateCourses);
router.get('/:id' , isAuthicated , getCourseById);
router.post('/:id/lecture' , isAuthicated , createLecture);
router.put('/:id/lecture/:lectureId' , isAuthicated , editLecture);
router.get('/:id/lecture' , isAuthicated , getAllLecture);
router.delete('/lecture/:lectureId' , isAuthicated , removeLecture);
router.get('/lecture/:id' , isAuthicated , getLectureById);
router.patch('/:id' , isAuthicated , togglePublishCourse);
router.get('/' , isAuthicated , filter);
router.get('/' , isAuthicated , getMyLearning);
router.get('/course-progress/:id' , isAuthicated , getEnrolledCourse);
router.post('/ai'  ,streamChatResponse)
module.exports = router; // Fix missing export
