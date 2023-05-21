import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../../../../src/Firebase/config";
import SAdminLayout from "../../../../../src/layouts/SAdminLayout";
import TeacherDetail from "../../../../../src/components/TeacherDetail";
import TeacherEdit from "../../../../../src/components/TeacherEdit";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const isObjectEmpty = (objectName) => {
  return JSON.stringify(objectName) === "{}";
};

// Teacher Form Init
const teacherFormInit = {
  tid: "",
  firstname: "",
  lastname: "",
  cnic: "",
  dob: "",
  gender: "",
  address: "",
  phone: "",
  email: "",
  doj: "",
  initsalary: "",
  designation: "",
  courses: [],
  degree:"",
  institutename:"",
  passingyear:"",
  obtgpa:"",
  emergencyname: "",
  emergencyrelationship: "",
  emergencyphone: "",
  teacherphoto: "",
  teachercnicphoto: "",
  coursesname: [],
  degreefile: "",
  medicalrecordsphoto: "",
  cv: "",
  additionaldocuments: [],
  type: "teacher",
  assignedrole: [],
};


const getCourse = async (courseFirebaseId) => {
  const snapshot = await db.collection("courses").doc(courseFirebaseId).get();
  return { ...snapshot.data(), firebaseId: snapshot.id };
};

const teacherid = () => {
  const [teacher, setTeacher] = useState(teacherFormInit);
  const [coursesInstructor, setCoursesInstructor] = useState([]);
  const [resetProc, setResetProc] = useState(false);
  const [editTeacher, setEditTeacher] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchTeacherData = async () => {
      const snapshot = await db.collection("teachers").doc(id).get();
      setTeacher({ ...snapshot.data(), firebaseId: snapshot.id });
      let coursesData = [];
      if (snapshot.data() && snapshot.data().courses && snapshot.data().courses.length !== 0) {
        for (const courseFirebaseId of snapshot.data().courses) {
          const courseDetail = await getCourse(courseFirebaseId);
          coursesData.push(courseDetail);
        }
        setCoursesInstructor(coursesData);
      }
    };
    fetchTeacherData();
  }, [router.query]);

  const handleEditToggle = () => {
    setEditTeacher(!editTeacher);
  };

  const showErrorToast = () => {
    toast.error("Something Went Wrong", {
      position: "top-center",
      autoClose: 4000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const handleResetPassword = (email) => {
    {!resetProc && "Reset Password"}
                {resetProc && "Processing..."}
    axios
    .post(`/api/resetpassword`, {
      email: email,
    })
    .then((res) => {
      const link = res.data.link;
      setResetProc(false);
      // Open the link in a new tab
      window.open(link, "_blank");
    })
    .catch((err) => {
        setResetProc(false);
        showErrorToast();
      });
  };

  return (
    <SAdminLayout>
      <div className="detail">
        {/* React Toastify Container */}

        <ToastContainer
          position="top-center"
          autoClose={4000}
          hideProgressBar
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        {/* Buttons */}
        <div className="d-flex  justify-center lg:justify-end md:justify-end  w-100 ">
          <div>
            {/* Password Reset Button */}
            <div className="w-100 ">
              <button
                type="submit"
                id="edit-button"
                className="border rounded px-2 py-1 w-[140px] hover:bg-blue-600 hover:text-white"
                onClick={() => {
                  handleResetPassword(`${teacher.tid}@teps.edu.pk`);
                }}
              >
                {!resetProc && "Reset Password"}
                {resetProc && "Processing..."}
              </button>
            </div>
          </div>
          {/* Edit Button */}
          <div>
            <button
              type="submit"
              id="edit-button"
              className="border rounded px-2 py-1 w-[140px] ml-1 hover:bg-blue-600 hover:text-white"
              onClick={handleEditToggle}
            >
              {editTeacher === false && (
                <span>
                  {" "}
                  <span className="bi bi-pen"></span> Turn Edit On
                </span>
              )}
              {editTeacher === true && (
                <span>
                  {" "}
                  <span className="bi bi-pen"></span> Turn Edit Off
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Displaying Detail when editing is turned off */}
        {!isObjectEmpty(teacher) && !editTeacher && teacher && (
          <TeacherDetail teacher={teacher} coursesInstructor={coursesInstructor}/>
        )}

        {/* Displaying When edit is turn on  */}
        {!isObjectEmpty(teacher) && editTeacher && teacher && (
          <TeacherEdit teacher={teacher} coursesInstructor={coursesInstructor}/>
        )}
      </div>
    </SAdminLayout>
  );
};

export default teacherid;
