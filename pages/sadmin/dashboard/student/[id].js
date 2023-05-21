import React, { useState, useEffect } from "react";
import SAdminLayout from "../../../../src/layouts/SAdminLayout";
import { useRouter } from "next/router";
import { db } from "../../../../src/Firebase/config";
import StudentDetail from "../../../../src/components/StudentDetail";
import axios from "axios";
import StudentEdit from "../../../../src/components/StudentEdit";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const isObjectEmpty = (objectName) => {
  return JSON.stringify(objectName) === "{}";
};

// Student Form Attributes
const studentFormInit = {
  sid: "",
  firstname: "",
  lastname: "",
  cnic: "",
  dob: "",
  gender: "",
  address: "",
  phone: "",
  email: "",
  parentname: "",
  parentphone: "",
  parentemail: "",
  parentcnic: "",
  courses: [],
  emergencyname: "",
  emergencyrelationship: "",
  emergencyphone: "",
  studentphoto: "",
  studentcnicphoto: "",
  parentcnicphoto: "",
  medicalrecordsphoto: "",
  additionaldocuments: [],
  type: "student",
  enrolleddate: "",
};

const detail = () => {
  const [student, setStudent] = useState(studentFormInit);


  const [editStudent, setEditStudent] = useState(false);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchStudentData = async () => {
      const snapshot = await db.collection("students").doc(id).get();
      setStudent({ ...snapshot.data(), firebaseId: snapshot.id });
      let coursesData = [];
      if (snapshot.data() && snapshot.data().courses.length !== 0) {
        for (const courseFirebaseId of snapshot.data().courses) {
          const courseDetail = await getCourse(courseFirebaseId);
          coursesData.push(courseDetail);
        }
        setEnrolledCourses(coursesData);
      }
    };
    fetchStudentData();
  }, [router.query]);

  const getCourse = async (courseFirebaseId) => {
    const snapshot = await db.collection("courses").doc(courseFirebaseId).get();
    return { ...snapshot.data(), firebaseId: snapshot.id };
  };

  const handleEditToggle = () => {
    setEditStudent(!editStudent);
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
    axios
      .post("/api/resetpassword", {
        email: email,
      })
      .then((res) => {
        const link = res.data.link;
        // Open the link in a new tab
        window.open(link, "_blank");
      })
      .catch((err) => {
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
                  handleResetPassword(`${student.sid}@teps.edu.pk`);
                }}
              >
                Reset Password
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
              {editStudent === false && (
                <span>
                  {" "}
                  <span className="bi bi-pen"></span> Turn Edit On
                </span>
              )}
              {editStudent === true && (
                <span>
                  {" "}
                  <span className="bi bi-pen"></span> Turn Edit Off
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Displaying Detail when editing is turned off */}
        {!isObjectEmpty(student) && !editStudent && student && (
          <StudentDetail student={student} enrolledCourses={enrolledCourses} />
        )}

        {/* Displaying When edit is turn on  */}
        {!isObjectEmpty(student) && editStudent && student && (
          <StudentEdit student={student} enrolledCourses={enrolledCourses}/>
        )}
      </div>
    </SAdminLayout>
  );
};

export default detail;
