import { Routes, Route, createBrowserRouter } from "react-router-dom";
import Home from "./components/ui/Home";
import Navbar from "@components/ui/Navbar"; // Import your Navbar component
import MyLearning from "./components/Courses.jsx/MyLearning";
import AI from "./components/Courses.jsx/AI";
import About from "./components/Courses.jsx/About ";
import EditProfile from "./components/Courses.jsx/EditProfile";
import { Login } from "./page/login";
import SideBar from "./components/dashborad/SideBar";
import CoursesTable from "./components/dashborad/courses/coursesTable";
import Course from "./components/dashborad/courses/course";
import EditCourse from "./components/dashborad/courses/EditCourse";
import CreateLecture from "./components/dashborad/lectures/CreateLecture";
import EditLecture from "./components/dashborad/lectures/EditLecture";
import CourseDetail from "./components/dashborad/courses/CourseDetail";
import CourseProgress from "./components/dashborad/courses/courseProgress";
import ExploreCourse from "./components/Courses.jsx/ExploreCourse";
import AiChat  from "./components/Courses.jsx/AiChat";

// // 🛡️ Private Route for Admin
// const PrivateRoute = ({ children }) => {
//   const user = JSON.parse(localStorage.getItem("user")); // Assuming user data is stored in localStorage
//   if (!user || user.role !== "student") {
//     return <Navigate to="/login"/>;
//   }
//   return children;
// };

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/learning" element={<MyLearning />} />
        <Route path="/ai" element={<AI />} />
        <Route path="/chat" element={<AiChat/>} />
        <Route path="/about" element={<About />} />
        <Route path="/profile" element={<EditProfile />} />
        <Route path="/login" element={<Login />} />

        {/* 🛡️ Admin Routes */}
        <Route path="/admin/*" element={<SideBar/>} />
        <Route path="/courseTable" element={<CoursesTable/>} />
        <Route path="/course" element={<Course/>} />
        <Route path="Editcourse/:id" element={<EditCourse/>} />
        <Route path="/Editcourse/:id/lecture" element={<CreateLecture/>} />
        <Route path="/Editcourse/:id/lecture/:lectureId" element={<EditLecture/>} />
        <Route path="/course-detail/:id" element={<CourseDetail/>}/>
        <Route path="/course-progress/:id" element={<CourseProgress />} />
        <Route path="/explore-course" element={<ExploreCourse/>} />
      </Routes>
    </>
  );
}

export default App;
