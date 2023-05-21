import React from "react";
import { useEffect, useState } from "react";
import { db } from "../Firebase/config";
import { useRouter } from "next/router";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { useContext } from "react";
import { user_Detail_Context } from "../../context/userContext";

const DispAllCourses = ({ showDeleteBtn ,isStaff}) => {
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [isDeleting, setIsDeleting] = useState("");
  const [confirmPassModal, setConfirmPassModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordErrorMsg, setPasswordErrorMsg] = useState("");
  const [courseToDelete, setCourseToDelete] = useState("");
  const {user}=useContext(user_Detail_Context);

  const closeConfirmModal = (e) => {
    e.preventDefault();
    setConfirmPassModal(false);
    setPasswordErrorMsg("");
    setPassword("");
  };
  const router = useRouter();

  useEffect(() => {
    return db.collection("courses").onSnapshot((snapshot) => {
      let data = [];
      snapshot.forEach((doc) => {
        data.push({ ...doc.data(), firebaseId: doc.id });
      });
      setCourses(data);
    });
  }, [router.query]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordErrorMsg("");
  };

  const handleClick = (courseFirebaseId) => {
     router.push(router.pathname + "/" + courseFirebaseId);
  };

  const deleteCourseRecord = (courseFirebaseId) => {
    // Get a reference to the Firestore collection
    const collectionRef = firebase.firestore().collection("courses");

    // Get a reference to the document you want to delete
    const docRef = collectionRef.doc(courseFirebaseId);

    // Delete the document
    docRef
      .delete()
      .then(() => {
        return;
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const deleteCourseStorageFiles = async (course) => {
    // Course Thumbnail
    course.courseThumbnail &&
      course.courseThumbnail.URL &&
      (await firebase
        .storage()
        .refFromURL(course.courseThumbnail.URL)
        .delete());
    //Course Outline File
    course.courseOutlineFile &&
      course.courseOutlineFile.courseOutlineFileURL &&
      (await firebase
        .storage()
        .refFromURL(course.courseOutlineFile.courseOutlineFileURL)
        .delete());
    if (course.lectureFiles && course.lectureFiles.length !== 0) {
      course.lectureFiles.map(async (file) => {
        await firebase.storage().refFromURL(file.fileURL).delete();
      });
    }
    if (
      course.courseAdditionalDocs &&
      course.courseAdditionalDocs.length !== 0
    ) {
      course.courseAdditionalDocs.map(async (file) => {
        await firebase.storage().refFromURL(file.additionalFileURL).delete();
      });
    }
  };

  // Removing this course from instructor side
  const removeCourseFromInstructorArray = (
    courseFirebaseId,
    courseInstructorId,
    courseName
  ) => {
    db.collection("teachers")
      .doc(courseInstructorId)
      .update({
        courses: firebase.firestore.FieldValue.arrayRemove(courseFirebaseId),
        coursesname: firebase.firestore.FieldValue.arrayRemove(courseName),
      });
  };

  function deleteStudentFees(ids) {
    ids.forEach((id) => {
      const docRef = db.collection("fees").doc(id);
      docRef.delete();
    });
  }

  // Remove course from students array/side
  const removeCourseFromStudentsArray = (
    courseFirebaseId,
    enrolledStudents,
    courseName
  ) => {
    for (const studentId of enrolledStudents) {
      db.collection("students")
        .doc(studentId)
        .update({
          courses: firebase.firestore.FieldValue.arrayRemove(courseFirebaseId),
          batch: firebase.firestore.FieldValue.arrayRemove(courseName),
        });
    }
  };

  const handleCourseDelete = async (e) => {
    e.preventDefault();
    setIsDeleting(true);
    try {
      // Confirm the password
      const user = firebase.auth().currentUser;
      const credentials = firebase.auth.EmailAuthProvider.credential(
        user.email,
        password
      );
      await user.reauthenticateWithCredential(credentials);
      setPasswordErrorMsg("");

      // Password is also confirmed so delete everything.
      await deleteCourseStorageFiles(courseToDelete);

      // Removing Course from every student side
      if (
        courseToDelete.enrolledStudents &&
        courseToDelete.enrolledStudents.length !== 0
      ) {
        removeCourseFromStudentsArray(
          courseToDelete.firebaseId,
          courseToDelete.enrolledStudents,
          courseToDelete.courseName
        );
      }
      // Removing course from instructor side
      if (
        courseToDelete.courseInstructorId &&
        courseToDelete.courseInstructorId.length !== 0
      ) {
        removeCourseFromInstructorArray(
          courseToDelete.firebaseId,
          courseToDelete.courseInstructorId,
          courseToDelete.courseName
        );
      }
      if (
        courseToDelete.studentfees &&
        courseToDelete.studentfees.length !== 0
      ) {
        await deleteStudentFees(courseToDelete.studentfees);
      }

      await deleteCourseRecord(courseToDelete.firebaseId);
     
      setIsDeleting(false);
      closeConfirmModal(e);
    } catch (err) {
      setPasswordErrorMsg("Incorrect Password");
      setIsDeleting(false);
    }
  };

  const goToAddCourse=(e)=>{
    e.preventDefault();
    router.push(router.pathname + "/addcourse" );
  }

  return (
    <div className="container mx-auto min-h-screen ">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
        {/* Confirmation Modal */}
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          style={{ display: confirmPassModal ? "block" : "none" }}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <form>
                <div className="bg-white px-4 pt-2 pb-4 sm:p-6 sm:pb-4 flex justify-center flex-col items-center">
                  <div className="sm:flex sm:items-start flex flex-col ">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10 ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                      >
                        <path fill="none" d="M0 0h24v24H0z" />
                        <path d="M12 3c-3.3 0-6 2.7-6 6v2h1.5v-2c0-2.5 2-4.5 4.5-4.5s4.5 2 4.5 4.5v2H18v-2c0-3.3-2.7-6-6-6zm-6 8v2h12v-2H6z" />
                      </svg>
                    </div>
                    <div className=" text-center sm:mt-0 sm:ml-4 sm:text-left mt-1">
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Password
                      </label>
                      <input
                        type="password"
                        id="password"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        name="password"
                        placeholder="Enter Password"
                        value={password}
                        required
                        onChange={handlePasswordChange}
                      />
                      {passwordErrorMsg.length !== 0 ? (
                        <span className="text-red-600">{passwordErrorMsg}</span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className=" mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleCourseDelete}
                  >
                    {!isDeleting && "Confirm&Delete"}
                    {isDeleting && "Deleting..."}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={closeConfirmModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

         {/* Download Button */}
         <div className="d-flex  justify-center lg:justify-end md:justify-end  w-100 ">
        <div>
          <button
            type="submit"
            id="edit-button"
            className="border rounded px-2 py-1 w-[140px] ml-1 hover:bg-blue-600 hover:text-white"
            onClick={goToAddCourse}
          >
           <i class="bi bi-plus-circle"></i>
            Add Course
          </button>
        </div>
      </div>


        {/* Course Search Bar */}
        <div className="flex items-center justify-center pb-4 ">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              id="table-search"
              name="search"
              onChange={handleSearchChange}
              className="ml-10 block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Course"
            />
          </div>
        </div>



        <div className="flex flex-wrap gap-3 justify-center ">
          {courses.map((courseRow) => {
            const isMatched =
              courseRow.courseName
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              courseRow.courseId.toLowerCase().includes(search.toLowerCase()) ||
              courseRow.courseDesc
                .toLowerCase()
                .includes(search.toLowerCase()) ||
              search.length === 0;

            return isMatched ? (
              <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer select-none" key={courseRow.firebaseId}>
                <div className="flex flex-col items-center pb-10 mt-3">
                  <img
                    className="w-24 h-24 mb-3 rounded-full shadow-lg"
                    src={
                      courseRow.courseThumbnail.URL ||
                      "/no_profile_picture.jpeg"
                    }
                    alt="Course image"
                  />
                  <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                    {courseRow.courseName}({courseRow.courseId.toUpperCase()})
                  </h5>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {courseRow.courseDesc.match(/(\b\w+\b[\s,]*){1,5}/g)}
                  </span>
                  <div className="flex mt-4 space-x-3 md:mt-6">
                 { ((isStaff)?(user&& user.courseauthority && user.courseauthority.edit):true ) && <a
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-700 dark:focus:ring-gray-700"
                      onClick={() => {
                        handleClick(courseRow.firebaseId);
                      }}
                    >
                      Detail
                    </a>}
                    {showDeleteBtn && (
                      <a
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 hover:underline focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        onClick={() => {
                            setCourseToDelete(courseRow);
                          setConfirmPassModal(true);
                        }}
                      >
                        Delete
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              ""
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DispAllCourses;
