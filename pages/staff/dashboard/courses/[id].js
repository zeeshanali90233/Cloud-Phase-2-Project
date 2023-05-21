import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../../../src/Firebase/config";
import "react-toastify/dist/ReactToastify.css";
import CourseEdit from "../../../../src/components/CourseEdit";
import CourseDetail from "../../../../src/components/CourseDetail";
import { createContext } from "react";
import { useContext } from "react";
import { user_Detail_Context } from "../../../../context/userContext";
import StaffLayout from "../../../../src/layouts/StaffLayout";

const isObjectEmpty = (objectName) => {
  return JSON.stringify(objectName) === "{}";
};

export const staffReRenderContext = createContext();

const courseindex = () => {
  const [course, setCourse] = useState({});
  const {user,setUser}=useContext(user_Detail_Context);
  const [editCourse, setEditCourse] = useState(false);
  const [instructorName, setInstructorName] = useState();
  const [teachers, setTeachers] = useState([]);
  const [reRenderState, setReRenderState] = useState(Math.random());
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
    const fetchUser=async()=>{
       // Getting the id from local storage
       const userId = localStorage.getItem("staffUser");
       // Fetching the record from firebase
       const snapshot = await db.collection("staff").doc(userId).get();
       setUser({ ...snapshot.data(), firebaseId: snapshot.id });
      }
    fetchCourse();
    fetchTeachers();
    fetchUser()
  }, [router.query]);

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

  return (
    <StaffLayout>
      <div className="detail">
        <div className="text-center">
          {!editCourse && "Course Detail"}
          {editCourse && "Course Edit"}
        </div>

        {/* Edit Button */}
        <div className="d-flex  justify-center lg:justify-end md:justify-end  w-100 ">
          {(user && user.courseauthority && user.courseauthority.edit)&&<div>
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
          </div>}
        </div>
                {console.log(user.courseauthority)}
        {/* Displaying Detail when editing is turned off */}

        <staffReRenderContext.Provider
          value={{
            setReRenderState,
            course,
            teachers,
            hideAddMaterialButton: !(user && user.courseauthority && user.courseauthority.edit),
            hideAddRoughMaterialButton: !(user && user.courseauthority && user.courseauthority.edit),
            hideAttendencePanel: !(user && user.courseauthority && user.courseauthority.edit),
            storageAddButtons:(user && user.courseauthority && user.courseauthority.edit) ,
            storageDeleteButtons:(user && user.courseauthority && user.courseauthority.edit) || false,
            hideCreateLectureButton: !(user && user.courseauthority && user.courseauthority.edit)||false,
            hideEnrollStudentPanel: !(user && user.courseauthority && user.courseauthority.edut)||false,
            hideMaterialDeleteButton: !(user && user.courseauthority && user.courseauthority.edit)||false,
            instructorName,
          }}
        >
          {!isObjectEmpty(course) && !editCourse && <CourseDetail />}
          {!isObjectEmpty(course) && editCourse && <CourseEdit />}
        </staffReRenderContext.Provider>
      </div>
    </StaffLayout>
  );
};

export default courseindex;
