import React from "react";
import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../Firebase/config";  
import { useContext } from "react";
import { saReRenderContext } from "../../pages/sadmin/dashboard/courses/[id]";
import { staffReRenderContext } from "../../pages/staff/dashboard/courses/[id]";

const CourseEdit = () => {
  const {course,teachers,setReRenderState}=useContext(saReRenderContext) || useContext(staffReRenderContext);
  const [courseEditForm, setCourseEditForm] = useState(course);
  const [courseThumbnailURL, setCourseThumbnailURL] = useState(
    undefined ||
      (courseEditForm.courseThumbnail && courseEditForm.courseThumbnail.URL)
  ); //Student Photo URL
  const [isSaving, setIsSaving] = useState(false);
  const [outlineFileErr,setOutlineFileErr]=useState(false)
  const [thumbnailErr,setThumbnailErr]=useState(false)
  const [addiFileErr,setAddiFileErr]=useState(false)

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
        alert("Thumbnail size should not exceed 1MB");
        setThumbnailErr(true);
        return;
    }
    setThumbnailErr(false);
      setCourseEditForm({ ...courseEditForm, [e.target.name]: e.target.files[0] });
      courseThumbnailURL(URL.createObjectURL(e.target.files[0]));
    } else if (e.target.name === "courseAdditionalDocs") {
  // Additional Files Size
  const files = e.target.files;
  let totalSize = 0;
  for (let i = 0; i < files.length; i++) {
    totalSize += files[i].size;
  }
  if (totalSize > 1000000) {
    // 1 MB
    alert("Additional files size should not exceed 1MB");
    setAddiFileErr(true);
    return;
  }
  setAddiFileErr(false);
      setCourseEditForm({ ...courseEditForm, [e.target.name]: e.target.files });
    } else if (e.target.name === "courseOutlineFile") {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        alert("Outline File size should not exceed 1MB");
        setOutlineFileErr(true);
        return;
    }
    setOutlineFileErr(false);
      setCourseEditForm({ ...courseEditForm, [e.target.name]: e.target.files[0] });
    } else {
      setCourseEditForm({ ...courseEditForm, [e.target.name]: e.target.value });
    }
  };


 //It handles the for submit
 const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSaving(true);
try{
    // Create a reference to the courses collection
    const coursesRef = db.collection("courses");
    const storageRef = firebase.storage().ref();
    //Updating the text fields
    if (
      courseEditForm.courseId !== course.courseId ||
      courseEditForm.courseName !== course.courseName ||
      courseEditForm.courseDuration !== course.courseDuration ||
      courseEditForm.courseInstructorId !== course.courseInstructorId ||
      courseEditForm.noOfStudents !== course.noOfStudents ||
      courseEditForm.courseDesc !== course.courseDesc
    ) {
      await coursesRef.doc(course.firebaseId).update({
        courseId: courseEditForm.courseId,
        courseName: courseEditForm.courseName,
        courseDesc: courseEditForm.courseDesc,
        courseDuration: courseEditForm.courseDuration,
        courseInstructorId: courseEditForm.courseInstructorId,
        noOfStudents: courseEditForm.noOfStudents,
      });
    }
    // If Instrcutor changed
    if (
      courseEditForm.courseInstructorId !== course.courseInstructorId &&
      courseEditForm.courseInstructorId !== ""
    ) {
      // Adding this course to new instructor
      db.collection("teachers")
        .doc(courseEditForm.courseInstructorId)
        .update({
          courses: firebase.firestore.FieldValue.arrayUnion(
            courseEditForm.firebaseId
          ),
          coursesname: firebase.firestore.FieldValue.arrayUnion(
            courseEditForm.courseName
          ),
        });
      // Removing this course from previous Instructor
      if (course.courseInstructorId !== "") {
        db.collection("teachers")
          .doc(course.courseInstructorId)
          .update({
            courses: firebase.firestore.FieldValue.arrayRemove(
              course.firebaseId
            ),
            coursesname: firebase.firestore.FieldValue.arrayRemove(
              course.courseName
            ),
          });
      }
    }
  
    // CourseName Change
    if (courseEditForm.courseName !== course.courseName) {
      // Instructor Side Updation
      if (courseEditForm.courseInstructorId !== "") {
        const teacherRef = db
          .collection("teachers")
          .doc(courseEditForm.courseInstructorId);
        teacherRef.get().then((doc) => {
          if (doc.exists) {
            const teacherData = doc.data();
            const coursesname = teacherData.coursesname;
            const oldCourseName = course.courseName;
            const newCourseName = courseEditForm.courseName;
            const courseNameIndex = coursesname.indexOf(oldCourseName);
            coursesname[courseNameIndex] = newCourseName;
            if (courseNameIndex > -1) {
              teacherRef.update({ coursesname: coursesname });
            }
          }
        });
      }
      if (courseEditForm.noOfStudents !== 0) {
        // Student side update
        courseEditForm.enrolledStudents.forEach((studentId) => {
          const studentRef = db.collection("students").doc(studentId);
          studentRef.get().then((doc) => {
            if (doc.exists) {
              const studentData = doc.data();
              const batch = studentData.batch;
              const oldCourseName = course.courseName;
              const newCourseName = courseEditForm.courseName;
              const courseNameIndex = batch.indexOf(oldCourseName);
              batch[courseNameIndex] = newCourseName;
              if (courseNameIndex > -1) {
                studentRef.update({ batch: batch });
              }
            }
          });
        });
        // Fees side update
        courseEditForm.studentsfee.forEach((feeId) => {
          const feeRef = db.collection("fees").doc(feeId);
          feeRef.get().then((doc) => {
            if (doc.exists) {
              feeRef.update({ coursename: courseEditForm.courseName });
            }
          });
        });
      }
    }
    // Taking the files
    const { courseThumbnail, courseAdditionalDocs, courseOutlineFile } =
      courseEditForm;
    if (
      JSON.stringify(courseEditForm.courseThumbnail) !==
      JSON.stringify(course.courseThumbnail)
    ) {
      await firebase
        .storage()
        .refFromURL(course.courseThumbnail.URL)
        .delete()
        .then(async () => {
          const metadata = {
            contentType: courseThumbnail.type,
            customMetadata: {
              fileExtension: courseThumbnail.name.split(".").pop(),
            },
          };
          const coursethumbnailSnapshot = await storageRef
            .child(`courses/${course.courseId}/coursethumbnail`)
            .put(courseThumbnail);
          let URL = await coursethumbnailSnapshot.ref.getDownloadURL();
          let courseThumbnailURL = { URL, metadata };
          await coursesRef.doc(course.firebaseId).update({
            courseThumbnail: courseThumbnailURL,
          });
        });
    }
    if (
      JSON.stringify(courseEditForm.courseOutlineFile) !==
      JSON.stringify(course.courseOutlineFile)
    ) {
      const metadata = {
        contentType: courseOutlineFile.type,
        customMetadata: {
          fileExtension: courseOutlineFile.name.split(".").pop(),
        },
      };
  
      if (course.courseOutlineFile.length !== 0) {
        await firebase
          .storage()
          .refFromURL(course.courseOutlineFile.courseOutlineFileURL)
          .delete()
          .then(async () => {
            const courseoutlineurlSnapshot = await storageRef
              .child(`courses/${course.courseId}/courseoutline`)
              .put(courseOutlineFile, { metadata });
            let courseOutlineFileURL =
              await courseoutlineurlSnapshot.ref.getDownloadURL();
            await coursesRef.doc(course.firebaseId).update({
              courseOutlineFile: { courseOutlineFileURL, metadata },
            });
          });
      } else {
        const courseoutlineurlSnapshot = await storageRef
          .child(`courses/${course.courseId}/courseoutline`)
          .put(courseOutlineFile, { metadata });
        let courseOutlineFileURL =
          await courseoutlineurlSnapshot.ref.getDownloadURL();
        await coursesRef.doc(course.firebaseId).update({
          courseOutlineFile: { courseOutlineFileURL, metadata },
        });
      }
    }
  
    if (
      courseEditForm.courseAdditionalDocs.length !== 0 &&
      courseEditForm.courseAdditionalDocs[0].URL === undefined &&
      JSON.stringify(courseEditForm.courseAdditionalDocs) !==
        JSON.stringify(course.courseAdditionalDocs)
    ) {
      let metadata = {};
      //Deleting the previous additional Files
      if (
        course.courseAdditionalDocs &&
        course.courseAdditionalDocs.length !== 0
      ) {
        course.courseAdditionalDocs.map(async (courseAdditionalDoc) => {
          await firebase
            .storage()
            .refFromURL(courseAdditionalDoc.additionalFileURL)
            .delete();
          db.collection("courses")
            .doc(course.firebaseId)
            .update({
              courseAdditionalDocs:
                firebase.firestore.FieldValue.arrayRemove(courseAdditionalDoc),
            });
        });
      }
  
      for (var i = 0; i < courseEditForm.courseAdditionalDocs.length; i++) {
        metadata = {
          contentType: courseAdditionalDocs[i].type,
          customMetadata: {
            fileExtension: courseAdditionalDocs[i].name.split(".").pop(),
          },
        };
        const courseAdditionalDocsSnapshot = await storageRef
          .child(`courses/${courseEditForm.courseId}/additionaldocuments${i + 1}`)
          .put(courseAdditionalDocs[i], { metadata });
  
        let additionalFileURL =
          await courseAdditionalDocsSnapshot.ref.getDownloadURL();
        await coursesRef.doc(course.firebaseId).update({
          courseAdditionalDocs: firebase.firestore.FieldValue.arrayUnion({
            additionalFileURL,
            metadata,
          }),
        });
      }
    }
  
    setIsSaving(false);
    setReRenderState(Math.random())
    showSuccessToast();
  }
  catch(err){
  setIsSaving(false);
  showErrorToast(); 
  
}
};
  return (
    <div className="main-content mb-5">
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
    <div className="studentphoto w-100 d-flex justify-content-center mt-2 mb-1">
      <img
        src={courseThumbnailURL || "/no_profile_picture.jpeg"}
        alt="profile"
        className="rounded-circle"
        width={150}
      />
    </div>

    <form onSubmit={handleSubmit}>
      <div>
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          for="file_input"
        >
          Upload Course Photo
        </label>
        <input
          className={`block w-full text-sm text-gray-900 border-2 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  ${
            thumbnailErr ? "border-red-700" : "border-gray-300"
          } `}
          aria-describedby="file_input_help"
          id="file_input"
          type="file"
          name="courseThumbnail"
          onChange={(e) => {
            handleChange(e);
          }}
        />
        <p
          className="mt-1 text-sm text-gray-500 dark:text-gray-300"
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
            id="disabled-input"
            aria-label="disabled input"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 cursor-not-allowed"
            name="courseId"
            value={courseEditForm.courseId}
            disabled
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
            value={courseEditForm.courseName}
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
            value={courseEditForm.courseInstructorId}
            name="courseInstructorId"
            onChange={handleChange}
          >
            {teachers.map((teacher)=>{
              return(

                <option value={teacher.firebaseId} key={teacher.firebaseId}> {teacher.firstname + " " + teacher.lastname}({teacher.type},
                  {teacher.tid})</option>

              )
            })}
          </select>
        </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-2 ">
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
            placeholder="-"
            value={courseEditForm.courseDuration}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label
            htmlFor="courseTotalLectures"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Total Lectures
          </label>
          <input
            type="text"
            id="courseTotalLectures"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="courseTotalLectures"
            placeholder="-"
            value={courseEditForm.courseTotalLectures}
            onChange={handleChange}
            required
          />
        </div>

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
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            name="courseDesc"
            value={courseEditForm.courseDesc}
            onChange={handleChange}
            rows={5}
            required
          />
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
            Course Outline
          </label>
          <input
            className={`block w-full text-sm text-gray-900 border-2 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${(outlineFileErr)?"border-red-700":"border-gray-300"}`}
            aria-describedby="file_input_help"
            id="file_input"
            type="file"
            name="courseOutlineFile"
            onChange={(e) => {
              handleChange(e);
            }}
          />
          <p
            className="mt-1 text-sm text-gray-500 dark:text-gray-300"
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
             Additional Documents:
          </label>
          <input
            className={`block w-full text-sm text-gray-900 border-2 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${(addiFileErr)?"border-red-700":"border-gray-300"}`}
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
            className="mt-1 text-sm text-gray-500 dark:text-gray-300"
            id="file_input_help"
          >
            Max Size:1MB.
          </p>
        </div>

   
      </div>

      {/* Save Button */}
      <button type="submit" className="w-full bg-green-600 py-2 rounded text-white hover:bg-green-500" disabled={isSaving ||addiFileErr ||outlineFileErr}>
        <span className="bi bi-file-earmark-arrow-up pr-1"></span>

         {isSaving && "Saving.."}
         {!isSaving && "Save"}
      </button>
    </form>
  </div>
  )
}

export default CourseEdit
