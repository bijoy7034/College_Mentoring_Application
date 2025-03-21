import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLogin from "./pages/adminLogin";
import AdminHome from "./pages/adminHome";
import ProtectedRoute from "./utils/protected";
import AdminStudents from "./pages/adminStudents";
import AdminTeachers from "./pages/addTeachers";
import UserLogin from "./pages/userLogin";
import Student from "./pages/student";
import TeacherNav from "./components/teacherNav";
import Teacher from "./pages/teacher";
import StudentDetails from "./pages/studentDetails";
import StudentProfile from "./pages/studentProfile";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/" element={<UserLogin />} />
          {/* Protect this route */}
          <Route
            path="/admin/home"
            element={
              <ProtectedRoute>
                <AdminHome />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <ProtectedRoute>
                <AdminStudents />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/admin/teachers"
            element={
              <ProtectedRoute>
                <AdminTeachers />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/student/profile"
            element={
              <ProtectedRoute>
                <StudentProfile/>
              </ProtectedRoute>
            }
          />
          <Route path="/teacher/student/:id" element={<StudentDetails />} />
          <Route path="/student/home" element={<Student />} />
          <Route path="/teacher/home" element={<Teacher />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
