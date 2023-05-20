import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import LoginPage from "./Pages/LoginPage";
import AdminPage from "./Pages/AdminPage";
import StudentPage from "./Pages/StudentPage";
import SAdminDashboard from "./Pages/SAdminDashboard";
import AdminCharts from "./Components/AdminCharts";
import AdmissionPage from "./Pages/AdmissionPage";
import AddStudentForm from "./Components/AddStudentForm";
import AddTeacherForm from "./Components/AddTeacherForm";
import AddStaffForm from "./Components/AddStaffForm";
import PageNotFound from "./Pages/PageNotFound";
import FeesPage from "./Pages/FeesPage";
import StudentFeeEdit from "./Components/StudentFeeEdit";
import DuesPage from "./Pages/DuesPage";
import AllTransPage from "./Pages/AllTransPage";
import Panels from "./Components/Panels";
import CoursesPage from "./Pages/CoursesPage";
import AddCourseForm from "./Components/AddCourseForm";
import CourseDetails from "./Components/CourseDetails";
import SAdminAssignRolePage from "./Pages/SAdminAssignRolePage";
import AddAdmin from "./Components/AddAdmin";
import AddSuperAdmin from "./Components/AddSuperAdmin";
import StaffPage from "./Pages/StaffPage";
import StudentDetail from "./Components/StudentDetail";
import StudentEdit from "./Components/StudentEdit";
import AdminDetail from "./Components/AdminDetail";
import AdminDashboard from "./Pages/AdminDashboard";
import StaffDetail from "./Components/StaffDetail";
import TeacherDetail from "./Components/TeacherDetail";
import AdminEdit from "./Components/AdminEdit";
import StaffEdit from "./Components/StaffEdit";
import TeacherEdit from "./Components/TeacherEdit";
import AssignedRolePagination from "./Components/AssignedRolePagination";
import AdminAssignRolePage from "./Pages/AdminAssignRolePage";
import InformationPanels from "./Components/InformationPanels";
import SuperAdminEditProfile from "./Components/SuperAdminEditProfile";
import AdminEditProfile from "./Components/AdminEditProfile";
import TeacherDashboard from "./Pages/TeacherDashboard";
import TeacherAssignTaskPage from "./Pages/TeacherAssignTaskPage";
import TeacherEditProfile from "./Components/TeacherEditProfile";
import TeacherCoursesPage from "./Pages/TeacherCoursesPage";
import TeacherSalaryPage from "./Pages/TeacherSalaryPage";
import AdminSalaryPage from "./Pages/AdminSalaryPage";
import AttendancePage from "./Pages/AttendancePage";
import StudentDashboard from "./Pages/StudentDashboard";
import StudentCoursesPage from "./Pages/StudentCoursesPage";
import StudentAttendancePage from "./Pages/StudentAttendancePage";
import StudentEditProfile from "./Components/StudentEditProfile";
import StaffDashboard from "./Pages/StaffDashboard";
import StaffPanels from "./Components/StaffPanels";
import StaffAssignRolePage from "./Pages/StaffAssignRolePage";
import CourseFinancePage from "./Pages/CourseFinancePage";
import StaffEditProfile from "./Components/StaffEditProfile";
import DuesEdit from "./Components/DuesEdit";
import StaffSalaryPage from "./Pages/StaffSalaryPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* login pages */}
        <Route
          path="student/login"
          element={<LoginPage userType={"student"} isSuperAdmin={false} isAdmin={false} isStaff={false} isTeacher={false} isStudent={true}/>}
        />
        <Route
          path="sadmin/login"
          element={<LoginPage userType={"super admin"} isSuperAdmin={true} isAdmin={false} isStaff={false} isTeacher={false} isStudent={false}/>}
        />
        <Route path="admin/login" element={<LoginPage userType={"admin"} isSuperAdmin={false} isAdmin={true} isStaff={false} isTeacher={false} isStudent={false}/>} />
        <Route
          path="teacher/login"
          element={<LoginPage userType={"teacher"} isSuperAdmin={false} isAdmin={false} isStaff={false} isTeacher={true} isStudent={false}/>}
        />
        <Route path="staff/login" element={<LoginPage userType={"staff"} isSuperAdmin={false} isAdmin={false} isStaff={true} isTeacher={false} isStudent={true}/>} />

        {/* Dashboard pages */}


        <Route path="sadmin/dashboard/" element={<SAdminDashboard />}>

          {/* Attendance Page */}
          <Route
            path="attendance"
            element={
              <AttendancePage
                showAdminAttendance={true}
                showStaffAttendance={true}
              />
            }
          />
          {/* Course Finance  */}
          <Route exact path="coursefinance" element={<CourseFinancePage />} />
          {/* Edit Profile  */}
          <Route exact path="editprofile" element={<SuperAdminEditProfile />} />

          {/* Student Page Routing */}
          <Route exact path="students/detail/edit" element={<StudentEdit />} />
          <Route
            exact
            path="students/detail"
            element={<StudentDetail isStaff={false} />}
          />
          <Route
            exact
            path="students"
            element={
              <StudentPage
                isSuperAdmin={true}
                isAdmin={false}
                isStaff={false}
                isTeacher={false}
              />
            }
          />
          {/* Staff Page Routing */}
          <Route exact path="staff/admin/detail" element={<AdminDetail />} />
          <Route exact path="staff/admin/detail/edit" element={<AdminEdit />} />
          <Route
            exact
            path="staff/teacher/detail/edit"
            element={<TeacherEdit />}
          />
          <Route
            exact
            path="staff/teacher/detail"
            element={<TeacherDetail />}
          />
          <Route exact path="staff/detail/edit" element={<StaffEdit />} />
          <Route exact path="staff/detail" element={<StaffDetail />} />
          <Route
            exact
            path="staff"
            element={
              <StaffPage
                consistsStaff={true}
                consistsTeachers={true}
                consistsAdmins={true}
              />
            }
          />

          {/* Admin Page Routing */}
          <Route exact path="admin/add-admin" element={<AddAdmin />} />
          <Route exact path="admin/add-sadmin" element={<AddSuperAdmin />} />
          <Route path="admin" element={<AdminPage />} />
          {/* Show All Transaction  */}
          <Route
            path="showalltrans"
            element={
              <AllTransPage
                isTeacher={false}
                isAdmin={false}
                isStaff={false}
                isStudent={false}
              />
            }
          />
          {/* Course Routing */}
          <Route exact path="add-course" element={<AddCourseForm />} />
          <Route
            exact
            path="courses/detail"
            element={
              <CourseDetails
                showEditButton={true}
                showMaterialDeleteButton={true}
                showCreateLectureButton={true}
                showAddMaterialButtons={true}
                showAttendencePanel={true}
                showEnrollStudentPanel={true}
                showAddRoughMaterialButtons={true}
              />
            }
          />
          <Route
            path="courses"
            element={<CoursesPage showCourseDeleteBtn={true} isSuperAdmin={true} isAdmin={false} isStaff={false}/>}
          />
          {/* Assigning Role */}
          <Route path="role" element={<SAdminAssignRolePage />} />

          {/* Admission */}
          <Route
            exact
            path="admission/add-student"
            element={<AddStudentForm />}
          />
          <Route
            exact
            path="admission/add-teacher"
            element={<AddTeacherForm />}
          />

          <Route exact path="admission/add-staff" element={<AddStaffForm />} />
          <Route
            exact
            path="admission"
            element={
              <AdmissionPage
                canAddStaff={true}
                canAddStudent={true}
                canAddTeacher={true}
              />
            }
          />
          {/* Fees */}
          <Route
            exact
            path="fees/editfees"
            element={
              <StudentFeeEdit
                isSuperAdmin={true}
                isAdmin={false}
                isStaff={false}
              />
            }
          />
          <Route
            exact
            path="fees"
            element={
              <FeesPage isSuperAdmin={true}/>
            }
          />
          {/* Dues */}
          <Route exact path="dues/detail" element={<DuesEdit isSuperAdmin={true} />} />
          <Route exact path="dues" element={<DuesPage isSuperAdmin={true} />} />
          <Route
            path=""
            element={
              <>
                <AdminCharts />
                <InformationPanels
                  showTotalFeesPanel={true}
                  showTotalStudentsPanel={true}
                  showTotalSalaryPanel={true}
                  showTotalEmployeesPanel={true}
                  showTotalProfitPanel={true}
                />
                <Panels
                  showCoursePanel={true}
                  showFeePanel={true}
                  showDuesPanel={true}
                  showAdminPanel={true}
                  showAttendencePanel={true}
                  showSalaryPanel={false}
                  showFinancePanel={true}
                  isAdmin={false}
                />
              </>
            }
          />
        </Route>

        <Route path="*" element={<PageNotFound />} />
        <Route exact path="/" element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
