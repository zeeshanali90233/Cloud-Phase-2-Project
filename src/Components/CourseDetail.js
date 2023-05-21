import React from "react";
import Image from "next/image";
import { useState } from "react";
import CourseMaterial from "./CourseMaterial";
import { useContext } from "react";
import { saReRenderContext } from "../../pages/sadmin/dashboard/courses/[id]";
import { staffReRenderContext } from "../../pages/staff/dashboard/courses/[id]";
import CourseRoughMat from "./CourseRoughMat";
import CourseAttendance from "./CourseAttendance";
import CourseEnroll from "./CourseEnroll";

const CourseDetail = () => {
  const {
    course,
    instructorName,
    hideAttendencePanel,
  } = useContext(saReRenderContext) || useContext(staffReRenderContext);
  const [showMaterialsBox, setShowMaterialsBox] = useState(false);
  const [showAttendence, setShowAttendence] = useState(false);
  const [showAssignmentBox, setShowAssignmentBox] = useState(false);
  const [showQuizes, setShowQuizes] = useState(false);
  const [showEnrollStudentBox, setShowEnrollStudentBox] = useState(false);
  const [showRoughMaterialBox, setShowRoughMaterialBox] = useState(false);

  return (
    <div className="main-content">
      <div className="adminphoto w-100 d-flex justify-content-center mt-2 mb-1">
        <img
          src={
            (course && course.courseThumbnail && course.courseThumbnail.URL) ||
            "/no_profile_picture.jpeg"
          }
          alt="profile"
          className="rounded-circle"
          width={150}
        />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor="courseid">Course ID:</label>
          <div className="border-b-2 border-blue-500 ">{course.courseId}</div>
        </div>
        <div>
          <label htmlFor="name">Course Name:</label>
          <div className="border-b-2 border-blue-500">{course.courseName}</div>
        </div>
        <div>
          <label htmlFor="duration">Duration:</label>
          <div className="border-b-2 border-blue-500">{`${course.courseDuration} Months `}</div>
        </div>
        <div>
          <label htmlFor="studentenrolled">No of Students Enrolled:</label>
          <div className="border-b-2 border-blue-500 capitalize">
            {course.noOfStudents}
          </div>
        </div>
        <div>
          <label htmlFor="lecturedelevered">Lecture Delivered:</label>
          <div className="border-b-2 border-blue-500">
            {course.noOfLecturesDelivered || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="phonenumber">Phone Number:</label>
          <div className="border-b-2 border-blue-500">
            {course.phone || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="instname">Instructor Name:</label>
          <div className="border-b-2 border-blue-500">
            {instructorName || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="desc">Description:</label>
          <div className="border-b-2 border-blue-500">
            {course.courseDesc || "-"}
          </div>
        </div>
      </div>

      {/*Cards */}
      <div className="cards mt-3 grid grid-cols-4 lg:grid-cols-6 gap-4">
        {/* Material */}
        <div
            className="cursor-pointer max-w-xs py-3 text-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 select-none"
            onClick={() => {
              setShowMaterialsBox(!showMaterialsBox);
              setShowAssignmentBox(false);
              setShowAttendence(false);
              setShowQuizes(false);
              setShowRoughMaterialBox(false);
              setShowEnrollStudentBox(false);
            }}
          >
            <div className="logo border-2 border-blue-500 rounded-full ">
              <Image src={"/logos/MaterialsICON.png"} width={50} height={50} />
            </div>
            <div className="text text-xl font-bold">Material</div>
          </div>
        {/* Attendance */}
      { !hideAttendencePanel&& <div className="cursor-pointer max-w-xs py-3 text-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 select-none"  onClick={() => {
            setShowMaterialsBox(false);
            setShowAssignmentBox(false);
            setShowAttendence(!showAttendence);
            setShowQuizes(false);
            setShowRoughMaterialBox(false);
            setShowEnrollStudentBox(false);
          }}>
            <div
              className="logo border-2 border-blue-500 rounded-full "
             
            >
              <Image src={"/logos/AttendanceICON.png"} width={50} height={50} />
            </div>
            <div className="text text-xl font-bold">Attendance</div>
          </div>}
        {/* Assignment */}
        <div className="cursor-pointer max-w-xs py-3 text-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 select-none"  onClick={() => {
              setShowMaterialsBox(false);
              setShowAssignmentBox(!showAssignmentBox);
              setShowAttendence(false);
              setShowQuizes(false);
              setShowRoughMaterialBox(false);
              setShowEnrollStudentBox(false);
            }}>
          <div
            className="logo border-2 border-blue-500 rounded-full "
           
          >
            <Image src={"/logos/AssignmentICON.png"} width={50} height={50} />
          </div>
          <div className="text text-xl font-bold">Assignment</div>
        </div>
        {/* Quiz */}
        <div
          className="cursor-pointer max-w-xs py-3 text-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 select-none"
          onClick={() => {
            setShowMaterialsBox(false);
            setShowAssignmentBox(false);
            setShowAttendence(false);
            setShowQuizes(!showQuizes);
            setShowRoughMaterialBox(false);
            setShowEnrollStudentBox(false);
          }}
        >
          <div className="logo border-2 border-blue-500 rounded-full ">
            <Image src={"/logos/QuizesICON.png"} width={50} height={50} />
          </div>
          <div className="text text-xl font-bold">Quiz</div>
        </div>
        {/* Enroll */}
        <div
            className="cursor-pointer max-w-xs py-3 text-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 select-none"
            onClick={() => {
              setShowMaterialsBox(false);
              setShowAssignmentBox(false);
              setShowAttendence(false);
              setShowQuizes(false);
              setShowRoughMaterialBox(false);
              setShowEnrollStudentBox(!showEnrollStudentBox);
            }}
          >
            <div className="logo border-2 border-blue-500 rounded-full ">
              <Image
                src={"/logos/EnrollStudentICON.png"}
                width={50}
                height={50}
              />
            </div>
            <div className="text text-xl font-bold">Enroll</div>
          </div>
        {/* Rough Material */}
        <div
            className="cursor-pointer max-w-xs py-3 text-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 select-none"
            onClick={() => {
              setShowMaterialsBox(false);
              setShowAssignmentBox(false);
              setShowAttendence(false);
              setShowQuizes(false);
              setShowRoughMaterialBox(!showRoughMaterialBox);
              setShowEnrollStudentBox(false);
            }}
          >
            <div className="logo border-2 border-blue-500 rounded-full ">
              <Image
                src={"/logos/RoughMaterialICON.png"}
                width={50}
                height={50}
              />
            </div>
            <div className="text text-xl font-bold">Rough Material</div>
          </div>
      </div>

      {showMaterialsBox && <CourseMaterial />}
      {showRoughMaterialBox && <CourseRoughMat />}
      {showAttendence && <CourseAttendance />}
      {showEnrollStudentBox && <CourseEnroll />}
    </div>
  );
};

export default CourseDetail;
