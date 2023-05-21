import React, { useState, useEffect } from "react";
import SAdminLayout from "../../../../src/layouts/SAdminLayout";
import { useRouter } from "next/router";
import { db } from "../../../../src/Firebase/config";
import "react-toastify/dist/ReactToastify.css";
import CourseEdit from "../../../../src/components/CourseEdit";
import CourseDetail from "../../../../src/components/CourseDetail";
import { createContext } from "react";
import CourseMsgModal from "../../../../src/components/CourseMsgModal";

const isObjectEmpty = (objectName) => {
  return JSON.stringify(objectName) === "{}";
};

export const saReRenderContext = createContext();

const courseindex = () => {
  const [course, setCourse] = useState({});
  const [editCourse, setEditCourse] = useState(false);
  const [instructorName, setInstructorName] = useState();
  const [teachers, setTeachers] = useState([]);
  const [reRenderState, setReRenderState] = useState(Math.random());
  const [msgModal, setMsgModal] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchCourse = async () => {
      // Fetching the student fees
      const courseSnapshot = await db.collection("courses").doc(id).get();
      setCourse({ ...courseSnapshot.data(), firebaseId: courseSnapshot.id });
      courseSnapshot.data()?.courseInstructorId &&
        (await getInstructorName(courseSnapshot.data().courseInstructorId));
    };

    const fetchTeachers = () => {
      db.collection("teachers").onSnapshot((snapshot) => {
        let data = [];
        snapshot.forEach((doc) => {
          data.push({ ...doc.data(), firebaseId: doc.id });
        });
        setTeachers(data);
      });
    };
    fetchCourse();
    fetchTeachers();
  }, [reRenderState, router.query]);

  const getInstructorName = async (id) => {
    const doc = await db.collection("teachers").doc(id).get();
    setInstructorName(
      doc.data().firstname +
        " " +
        doc.data().lastname +
        "(" +
        doc.data().tid +
        ")"
    );
  };

  const handleEditToggle = () => {
    setEditCourse(!editCourse);
  };

  const showMsgModal=()=>{
    setMsgModal(true);
  }

  const closeMsgModal=()=>{
    setMsgModal(false);
  }

  return (
    <SAdminLayout>
      <div className="detail">
        <div className="text-center">
          {!editCourse && "Course Detail"}
          {editCourse && "Course Edit"}
        </div>

        {/*  Buttons */}
        <div className="d-flex  justify-center lg:justify-end md:justify-end  w-100 ">
        <div className="mr-auto">
            <button
              type="submit"
              id="edit-button"
              className="border rounded px-2 py-1 w-[140px] ml-1 hover:bg-blue-600 hover:text-white"
              onClick={showMsgModal}
            >
                <span>
                  {" "}
                  <i class="bi bi-chat-dots"></i> Message
                </span>
            </button>
          </div>
          <div>
            <button
              type="submit"
              id="edit-button"
              className="border rounded px-2 py-1 w-[140px] ml-1 hover:bg-blue-600 hover:text-white"
              onClick={handleEditToggle}
            >
              {editCourse === false && (
                <span>
                  {" "}
                  <span className="bi bi-pen"></span> Turn Edit On
                </span>
              )}
              {editCourse === true && (
                <span>
                  {" "}
                  <span className="bi bi-pen"></span> Turn Edit Off
                </span>
              )}
            </button>
          </div>
        </div>

        {msgModal&&<CourseMsgModal enrolledStudents={course.enrolledStudents} closeMsgModal={closeMsgModal}/>}

        {/* Displaying Detail when editing is turned off */}
        <saReRenderContext.Provider
          value={{
            setReRenderState,
            course,
            teachers,
            isStaff:false,
            isTeacher:false,
            hideAddMaterialButton: false,
            hideAddRoughMaterialButton: false,
            hideAttendencePanel: false,
            storageAddButtons:true,
            storageDeleteButtons:true,
            hideCreateLectureButton: false,
            hideEnrollStudentPanel: false,
            hideMaterialDeleteButton: false,
            instructorName,
          }}
        >
          {!isObjectEmpty(course) && !editCourse && <CourseDetail />}
          {!isObjectEmpty(course) && editCourse && <CourseEdit />}
        </saReRenderContext.Provider>
      </div>
    </SAdminLayout>
  );
};

export default courseindex;
