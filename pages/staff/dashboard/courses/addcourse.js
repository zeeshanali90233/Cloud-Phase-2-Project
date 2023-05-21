import React from "react";
import StaffLayout from "../../../../src/layouts/StaffLayout";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../../../../src/Firebase/config";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRef } from "react";

const courseFormInit = {
  courseId: "",
  courseName: "",
  courseDesc: "",
  courseThumbnail: "",
  courseDuration: "",
  courseInstructorId: "",
  courseOutlineFile: "",
  courseAdditionalDocs: [],
  lectureVideos: [],
  lectureFiles: [],
  enrolledStudents: [],
  attendence: [],
  noOfStudents: 0,
  noOfTotalLectures: 0,
  noOfLecturesDelivered: 0,
  studentsfee: [],
  roughMaterial: [],
};

const addcourse = () => {
  const [courseForm, setCourseForm] = useState(courseFormInit);
  const [courseThumbnailPic, setCourseThumbnailPic] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [thumbnailImageError, setThumbnailImageError] = useState(false);
  const [outlineFileError, setOutlineFileError] = useState(false);
  const [additionalDocError, setAdditionalDocError] = useState(false);
  const formRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    return db.collection("teachers").onSnapshot((snapshot) => {
      let data = [];
      snapshot.forEach((doc) => {
        data.push({ ...doc.data(), firebaseId: doc.id });
      });
      setTeachers(data);
    });
  }, [router.query]);

  const showSuccessToast = () => {
    toast.success("Successfully Saved", {
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

  //It handles the form changes
  const handleChange = (e) => {
    if (e.target.name === "courseThumbnail") {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        setThumbnailImageError(true);
        alert("Thumbnail size should not exceed 1MB");
        return;
      }
      setThumbnailImageError(false);
      setCourseForm({ ...courseForm, [e.target.name]: e.target.files[0] });
      setCourseThumbnailPic(URL.createObjectURL(e.target.files[0]));
    } else if (e.target.name === "courseAdditionalDocs") {
      // Additional Files Size
      const files = e.target.files;
      let totalSize = 0;
      for (let i = 0; i < files.length; i++) {
        totalSize += files[i].size;
      }
      if (totalSize > 1000000) {
        // 5 MB
        setAdditionalDocError(true);
        alert("Additional files size should not exceed 5MB");
        return;
      }
      setAdditionalDocError(false);
      setCourseForm({ ...courseForm, [e.target.name]: e.target.files });
    } else if (e.target.name === "courseOutlineFile") {
      if (e.target.files[0].size > 2000000) {
        // 2 MB
        setOutlineFileError(true);
        alert("File of size > 2mb is not accepted");
        return;
      }
      setOutlineFileError(false);
      setCourseForm({ ...courseForm, [e.target.name]: e.target.files[0] });
    } else {
      setCourseForm({ ...courseForm, [e.target.name]: e.target.value });
    }
  };

  //It handles the for submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Create a reference to the courses collection
    const coursesRef = db.collection("courses");
    // Checks Whether a user is not already exists
    try {
      const res = await db
        .collection("courses")
        .where("courseId", "==", courseForm.courseId)
        .get();
      if (res.docs.length !== 0) {
        alert("Course with same ID already exists");
        setIsSaving(false);
        return;
      }
    } catch (err) {
      console.log(err);
    }

    // Taking the files
    const { courseThumbnail, courseAdditionalDocs, courseOutlineFile } =
      courseForm;
    const courseFormText = courseForm;
    courseFormText.courseId = courseForm.courseId.toLowerCase();
    courseFormText.courseOutlineFile = "";
    courseFormText.courseThumbnail = "";
    courseFormText.courseAdditionalDocs = "";
    // Create a storage reference
    const storageRef = firebase.storage().ref();

    let courseThumbnailURL = "";
    let courseOutlineFileURL = "";

    let metadata = {};
    await coursesRef
      .add(courseFormText)
      .then(async (doc) => {
        //Upload the files
        if (courseThumbnail) {
          metadata = {
            contentType: courseThumbnail.type,
            customMetadata: {
              fileExtension: courseThumbnail.name.split(".").pop(),
            },
          };
          const coursethumbnailSnapshot = await storageRef
            .child(`courses/${courseForm.courseId}/coursethumbnail`)
            .put(courseThumbnail);
          let URL = await coursethumbnailSnapshot.ref.getDownloadURL();
          courseThumbnailURL = { URL, metadata };
        }
        if (courseOutlineFile) {
          metadata = {
            contentType: courseOutlineFile.type,
            customMetadata: {
              fileExtension: courseOutlineFile.name.split(".").pop(),
            },
          };
          const courseoutlinefileSnapshot = await storageRef
            .child(`courses/${courseForm.courseId}/courseoutline`)
            .put(courseOutlineFile, { metadata });
          courseOutlineFileURL =
            await courseoutlinefileSnapshot.ref.getDownloadURL();
          courseOutlineFileURL = { courseOutlineFileURL, metadata };
        }

        let additionalFiles = [];
        if (courseAdditionalDocs) {
          for (var i = 0; i < courseAdditionalDocs.length; i++) {
            metadata = {
              contentType: courseAdditionalDocs[i].type,
              customMetadata: {
                fileExtension: courseAdditionalDocs[i].name.split(".").pop(),
              },
            };
            const courseadditionaldocsSnapshot = await storageRef
              .child(
                `courses/${courseForm.courseId}/additionaldocuments${i + 1}`
              )
              .put(courseAdditionalDocs[i], { metadata });
            let additionalFileURL =
              await courseadditionaldocsSnapshot.ref.getDownloadURL();
            additionalFiles.push({ additionalFileURL, metadata });
          }
        }

        // update the document with the file URLs
        await coursesRef.doc(doc.id).update({
          courseThumbnail: courseThumbnailURL,
          courseOutlineFile: courseOutlineFileURL,
          courseAdditionalDocs: additionalFiles,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        // Fetching the selected teacher and then updating the courses attribute
        if (courseFormText.courseInstructorId !== "") {
          db.collection("teachers")
            .doc(courseFormText.courseInstructorId)
            .update({
              courses: firebase.firestore.FieldValue.arrayUnion(doc.id),
            });
        }

        setIsSaving(false);
        showSuccessToast();
        // Setting student form to init
        setCourseForm(courseFormInit);
        setCourseThumbnailPic("");
        formRef.current.reset();
      })
      .catch((err) => {
        setIsSaving(false);
        showErrorToast();
        console.log(err);
      });
  };

  return (
    <StaffLayout>
      <div className="add-course">
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
        <div className="title bg-dark  text-center text-white w-100 mt-3 rounded">
          <h5 className="text-white">Add Course</h5>
        </div>

        <div className="studentphoto w-100 d-flex justify-content-center mt-2 mb-1">
          <img
            src={courseThumbnailPic || "/no_profile_picture.jpeg"}
            alt="profile"
            className="rounded-circle"
            width={150}
          />
        </div>

        <form onSubmit={handleSubmit} ref={formRef}>
          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              for="file_input"
            >
              Upload Course Thumbnail
            </label>
            <input
              className={`block w-full text-sm text-gray-900 border-2 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${
                thumbnailImageError ? "border-red-700" : "border-gray-300"
              }`}
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              name="courseThumbnail"
              onChange={(e) => {
                handleChange(e);
              }}
              required
            />
            <p
              class="mt-1 text-sm text-gray-500 dark:text-gray-300"
              id="file_input_help"
            >
              SVG, PNG, JPG or GIF (MAX. 800x400px) & Max Size:1MB.
            </p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-2 ">
            <div>
              <label
                htmlFor="courseId"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Course ID
              </label>
              <input
                type="text"
                id="courseId"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                name="courseId"
                value={courseForm.courseId}
                pattern="[cC][0-9a-zA-Z]{5}"
                onChange={handleChange}
                title="Course ID should start with 'C' or 'c' followed by 5 alphanumeric characters."
                required
              />
            </div>

            <div>
              <label
                htmlFor="courseName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Course Name
              </label>
              <input
                type="text"
                id="courseName"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                name="courseName"
                value={courseForm.courseName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label
                htmlFor="courseDuration"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Course Duration(Months)
              </label>
              <input
                type="text"
                id="courseDuration"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                name="courseDuration"
                value={courseForm.courseDuration}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                htmlFor="courseTotalLectures"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Course Total Lectures
              </label>
              <input
                type="text"
                id="courseDuration"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                name="courseTotalLectures"
                placeholder="Enter the total number of lectures"
                value={courseForm.courseTotalLectures}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="courseInstructorId"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Course Instructor
            </label>
            <select
              id="courseInstructorId"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={courseForm.gender}
              name="courseInstructorId"
              onChange={handleChange}
            >
              <option value="">Select Instructor</option>
              {teachers.map((teacher) => {
                return (
                  <option value={teacher.firebaseId} key={teacher.firebaseId}>
                    {teacher.firstname + " " + teacher.lastname}({teacher.tid})
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label
              htmlFor="courseDesc"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Description
            </label>
            <textarea
              type="text"
              id="courseDesc"
              name="courseDesc"
              placeholder="Enter the description of course"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={courseForm.courseDesc}
              onChange={handleChange}
            ></textarea>
          </div>

          {/* Related Files */}
          <div className="title bg-dark  text-center text-white w-100 mt-3 rounded">
            <h5 className="text-white">Related Documents</h5>
          </div>

          <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-3 mb-1">
            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                for="courseOutlineFile"
              >
                Course Outline:
              </label>
              <input
                className={`block w-full text-sm text-gray-900 border-2 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${
                  outlineFileError ? "border-red-700" : "border-gray-300"
                } `}
                aria-describedby="file_input_help"
                id="file_input"
                type="file"
                name="courseOutlineFile"
                onChange={(e) => {
                  handleChange(e);
                }}
              />
              <p
                class="mt-1 text-sm text-gray-500 dark:text-gray-300"
                id="file_input_help"
              >
                Max Size:1MB.
              </p>
            </div>

            <div>
              <label
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                for="courseAdditionalDocs"
              >
                Additional Documents
              </label>
              <input
                className={`block w-full text-sm text-gray-900 border-2  rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${
                  additionalDocError ? "border-red-700" : "border-gray-300"
                }`}
                aria-describedby="file_input_help"
                id="file_input"
                type="file"
                name="courseAdditionalDocs"
                onChange={(e) => {
                  handleChange(e);
                }}
                multiple
              />
              <p
                class="mt-1 text-sm text-gray-500 dark:text-gray-300"
                id="file_input_help"
              >
                Max Size:1MB.
              </p>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full bg-green-600 py-2 rounded text-white hover:bg-green-500"
            disabled={
              thumbnailImageError ||
              outlineFileError ||
              additionalDocError ||
              isSaving
            }
          >
            <span className="bi bi-file-earmark-arrow-up pr-1"></span>

            {isSaving && "Saving.."}
            {!isSaving && "Save"}
          </button>
        </form>
      </div>
    </StaffLayout>
  );
};

export default addcourse;
