import React from "react";
import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../Firebase/config";  

const StudentEdit = ({ student, enrolledCourses }) => {
  const [studentEditForm, setStudentEditForm] = useState(student);
  const [studentPhotoURL, setStudentPhotoURL] = useState(
    undefined ||
      (studentEditForm.studentphoto && studentEditForm.studentphoto.URL)
  ); //Student Photo URL
  const [isRemoving, setIsRemoving] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
  const handleChange = (e) => {
    if (e.target.name === "studentphoto") {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        alert("Profile Picture size should not exceed 1MB");
        return;
      }
      setStudentEditForm({
        ...studentEditForm,
        [e.target.name]: e.target.files[0],
      });
      setStudentPhotoURL(URL.createObjectURL(e.target.files[0]));
    } else if (
      e.target.name === "studentcnicphoto" ||
      e.target.name === "parentcnicphoto" ||
      e.target.name === "medicalrecordsphoto"
    ) {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        alert("File of size > 1mb is not accepted");
        return;
      }
      setStudentEditForm({
        ...studentEditForm,
        [e.target.name]: e.target.files[0],
      });
    } else if (e.target.name === "additionaldocuments") {
      // Additional Files Size
      const files = e.target.files;
      let totalSize = 0;
      for (let i = 0; i < files.length; i++) {
        totalSize += files[i].size;
      }
      if (totalSize > 1000000) {
        // 1 MB
        alert("Additional files size should not exceed 1MB");
        return;
      }
      setStudentEditForm({
        ...studentEditForm,
        [e.target.name]: e.target.files,
      });
    } else if (e.target.name === "dob") {
      if (validateDob(e.target.value)) {
        setStudentEditForm({ ...studentForm, [e.target.name]: e.target.value });
      } else {
        alert("Date of birth is not correct!");
        return;
      }
    } else {
      setStudentEditForm({
        ...studentEditForm,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleCourseRemove = (courseFirebaseId, courseName) => {
    setIsRemoving(true);
    let updatedForm = studentEditForm;
    let atIndex = updatedForm.courses.indexOf(courseFirebaseId);
    updatedForm.courses.splice(atIndex, 1);
    setStudentEditForm(updatedForm);

    // Replace `state.firebaseId` and `courseName` with your actual values
    const studentDocRef = db.collection("students").doc(state.firebaseId);

    // Step 1: Fetch the `coursefees` array from the `student` document
    studentDocRef 
      .get()
      .then((doc) => {
        if (doc.exists) {
          const studentData = doc.data();
          const courseFees = studentData.coursesfee;

          // Step 2: Find the fee with matching `coursename`
          const feeQuery = db
            .collection("fees")
            .where("coursename", "==", courseName)
            .where("sid", "==", studentData.sid)
            .limit(1);

          feeQuery
            .get()
            .then((querySnapshot) => {
              if (querySnapshot.docs.length === 0) {
                // No fee found with matching `coursename`
                return;
              }

              const feeDoc = querySnapshot.docs[0];
              const feeIdToRemove = feeDoc.id;

              // Step 3: Remove the fee ID from the `coursefees` array
              const updatedCourseFees = courseFees.filter((feeId) => {
                return feeId !== feeIdToRemove;
              });

              // Step 4: Update the `student` document with the new `coursefees` array
              studentDocRef
                .update({
                  courses:
                    firebase.firestore.FieldValue.arrayRemove(courseFirebaseId),
                  batch: firebase.firestore.FieldValue.arrayRemove(courseName),
                  coursesfee: updatedCourseFees,
                })
                .then(() => {
                  // Step 5: Delete the fee document from the `fees` collection
                  db.collection("fees")
                    .doc(feeIdToRemove)
                    .delete()
                    .then(() => {
                      // console.log("Fee document deleted successfully!");
                    })
                    .catch((error) => {
                      console.error("Error deleting fee document:", error);
                    });
                })
                .catch((error) => {
                  console.error("Error updating student document:", error);
                });

              db.collection("courses")
                .doc(courseFirebaseId)
                .update({
                  noOfStudents: firebase.firestore.FieldValue.increment(-1),
                  enrolledStudents: firebase.firestore.FieldValue.arrayRemove(
                    state.firebaseId
                  ),
                  studentsfee:
                    firebase.firestore.FieldValue.arrayRemove(feeIdToRemove),
                });
            })
            .catch((error) => {
              console.error("Error fetching fee document:", error);
            });
        } else {
          console.error("Student document not found!");
        }
      })
      .catch((error) => {
        console.error("Error fetching student document:", error);
      });
    setIsRemoving(false);
  };

  //Funtion to save the changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Create a reference to the students collection
      const studentsRef = db.collection("students");
      const feesRef = db.collection("fees");
      // Taking the files from from
      const {
        studentphoto,
        studentcnicphoto,
        parentcnicphoto,
        medicalrecordsphoto,
        additionaldocuments,
      } = studentEditForm;

      if (student.noofintallments !== studentEditForm.noofintallments) {
        feesRef
          .where("sid", "==", studentEditForm.sid)
          .get()
          .then((res) => {
            const updateFeePerInstallment = Math.round(
              res.docs[0].data().totalfees / studentEditForm.noofintallments
            );
            feesRef.doc(res.docs[0].id).update({
              noofintallments: studentEditForm.noofintallments,
              feeperinstallment: updateFeePerInstallment,
            });
          });
      }

      //Updating the text record of student record except courses array
      db.collection("students").doc(student.firebaseId).update({
        sid: studentEditForm.sid,
        firstname: studentEditForm.firstname,
        lastname: studentEditForm.lastname,
        dob: studentEditForm.dob,
        gender: studentEditForm.gender,
        address: studentEditForm.address,
        phone: studentEditForm.phone,
        email: studentEditForm.email,
        cnic: studentEditForm.cnic,
        parentname: studentEditForm.parentname,
        parentphone: studentEditForm.parentphone,
        parentemail: studentEditForm.parentemail,
        parentcnic: studentEditForm.parentcnic,
        emergencyname: studentEditForm.emergencyname,
        emergencyrelationship: studentEditForm.emergencyrelationship,
        emergencyphone: studentEditForm.emergencyphone,
      });

      const storageRef = firebase.storage().ref();

      //If profile picture is changed
      if (
        JSON.stringify(studentEditForm.studentphoto) !==
        JSON.stringify(student.studentphoto)
      ) {
        // console.log(studentphoto);
        const metadata = {
          contentType: studentphoto.type,
          customMetadata: {
            fileExtension: studentphoto.name.split(".").pop(),
          },
        };
        // If Student Photo Exist
        if (student.studentphoto.length !== 0) {
          await firebase
            .storage()
            .refFromURL(student.studentphoto.URL)
            .delete()
            .then(async () => {
              const studentphotoSnapshot = await storageRef
                .child(`students/${studentEditForm.sid}/studentphoto`)
                .put(studentphoto);
              let URL = await studentphotoSnapshot.ref.getDownloadURL();
              let studentphotoURL = { URL, metadata };
              await studentsRef.doc(student.firebaseId).update({
                studentphoto: studentphotoURL,
              });
            });
        } else {
          const studentphotoSnapshot = await storageRef
            .child(`students/${studentEditForm.sid}/studentphoto`)
            .put(studentphoto);
          let URL = await studentphotoSnapshot.ref.getDownloadURL();
          let studentphotoURL = { URL, metadata };
          await studentsRef.doc(student.firebaseId).update({
            studentphoto: studentphotoURL,
          });
        }
      }
      //If CNIC/BFORM FILE is changed
      if (
        JSON.stringify(studentEditForm.studentcnicphoto) !==
        JSON.stringify(student.studentcnicphoto)
      ) {
        const metadata = {
          contentType: studentcnicphoto.type,
          customMetadata: {
            fileExtension: studentcnicphoto.name.split(".").pop(),
          },
        };

        if (student.studentcnicphoto.length !== 0) {
          await firebase
            .storage()
            .refFromURL(student.studentcnicphoto.URL)
            .delete()
            .then(async () => {
              const studentcnicphotoSnapshot = await storageRef
                .child(`students/${studentEditForm.sid}/studentcnic`)
                .put(studentcnicphoto);
              let URL = await studentcnicphotoSnapshot.ref.getDownloadURL();
              let studentcnicphotoURL = { URL, metadata };
              await studentsRef.doc(student.firebaseId).update({
                studentcnicphoto: studentcnicphotoURL,
              });
            });
        } else {
          const studentcnicphotoSnapshot = await storageRef
            .child(`students/${studentEditForm.sid}/studentcnic`)
            .put(studentcnicphoto);
          let URL = await studentcnicphotoSnapshot.ref.getDownloadURL();
          let studentcnicphotoURL = { URL, metadata };
          await studentsRef.doc(student.firebaseId).update({
            studentcnicphoto: studentcnicphotoURL,
          });
        }
      }

      //If Parent cnic file is changed
      if (
        JSON.stringify(studentEditForm.parentcnicphoto) !==
        JSON.stringify(student.parentcnicphoto)
      ) {
        const metadata = {
          contentType: parentcnicphoto.type,
          customMetadata: {
            fileExtension: parentcnicphoto.name.split(".").pop(),
          },
        };

        if (student.parentcnicphoto.length !== 0) {
          await firebase
            .storage()
            .refFromURL(student.parentcnicphoto.URL)
            .delete()
            .then(async () => {
              const parentcnicphotoSnapshot = await storageRef
                .child(`students/${studentEditForm.sid}/parentcnic`)
                .put(parentcnicphoto);
              let URL = await parentcnicphotoSnapshot.ref.getDownloadURL();
              let parentcnicphotoURL = { URL, metadata };
              await studentsRef.doc(student.firebaseId).update({
                parentcnicphoto: parentcnicphotoURL,
              });
            });
        } else {
          const parentcnicphotoSnapshot = await storageRef
            .child(`students/${studentEditForm.sid}/parentcnic`)
            .put(parentcnicphoto);
          let URL = await parentcnicphotoSnapshot.ref.getDownloadURL();
          let parentcnicphotoURL = { URL, metadata };
          await studentsRef.doc(student.firebaseId).update({
            parentcnicphoto: parentcnicphotoURL,
          });
        }
      }

      //If Medical Record file is changed
      if (
        JSON.stringify(studentEditForm.medicalrecordsphoto) !==
        JSON.stringify(student.medicalrecordsphoto)
      ) {
        const metadata = {
          contentType: medicalrecordsphoto.type,
          customMetadata: {
            fileExtension: medicalrecordsphoto.name.split(".").pop(),
          },
        };
        if (student.medicalrecordsphoto.length !== 0) {
          await firebase
            .storage()
            .refFromURL(student.medicalrecordsphoto.URL)
            .delete()
            .then(async () => {
              const medicalrecordphotoSnapshot = await storageRef
                .child(`students/${studentEditForm.sid}/medicalrecord`)
                .put(medicalrecordsphoto);
              let URL = await medicalrecordphotoSnapshot.ref.getDownloadURL();
              let medicalrecordphotoURL = { URL, metadata };
              await studentsRef.doc(student.firebaseId).update({
                medicalrecordsphoto: medicalrecordphotoURL,
              });
            });
        } else {
          const medicalrecordphotoSnapshot = await storageRef
            .child(`students/${studentEditForm.sid}/medicalrecord`)
            .put(medicalrecordsphoto);
          let URL = await medicalrecordphotoSnapshot.ref.getDownloadURL();
          let medicalrecordphotoURL = { URL, metadata };
          await studentsRef.doc(student.firebaseId).update({
            medicalrecordsphoto: medicalrecordphotoURL,
          });
        }
      }

      //If Additional files is changed
      if (
        JSON.stringify(studentEditForm.additionaldocuments) !==
        JSON.stringify(student.additionaldocuments)
      ) {
        let metadata = {};
        //Deleting the previous additional Files
        if (additionaldocuments && additionaldocuments.length !== 0) {
          student.additionaldocuments.map(async (additionaldocument) => {
            await firebase
              .storage()
              .refFromURL(additionaldocument.URL)
              .delete();
            db.collection("students")
              .doc(studentEditForm.firebaseId)
              .update({
                additionaldocuments:
                  firebase.firestore.FieldValue.arrayRemove(additionaldocument),
              });
          });
        }
        let additionalFilesURL = [];
        for (var i = 0; i < studentEditForm.additionaldocuments.length; i++) {
          metadata = {
            contentType: additionaldocuments[i].type,
            customMetadata: {
              fileExtension: additionaldocuments[i].name.split(".").pop(),
            },
          };
          const additionaldocumentSnapshot = await storageRef  
            .child(
              `students/${studentEditForm.sid}/additionaldocuments${Number(i) + 1}`
            )
            .put(additionaldocuments[i], { metadata });
          let URL = await additionaldocumentSnapshot.ref.getDownloadURL();
          additionalFilesURL.push({ URL, metadata });
          await studentsRef.doc(student.firebaseId).update({
            additionaldocuments: firebase.firestore.FieldValue.arrayUnion({
              URL,
              metadata,
            }),
          });
        }
      }

      setIsSaving(false);
      showSuccessToast();
    } catch (err) {
      console.log(err);
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
          src={studentPhotoURL || "/no_profile_picture.jpeg"}
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
            Upload Student Photo
          </label>
          <input
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            aria-describedby="file_input_help"
            id="file_input"
            type="file"
            name="studentphoto"
            onChange={(e) => {
              handleChange(e);
            }}
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
              htmlFor="sid"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Student ID
            </label>
            <input
              type="text"
              id="disabled-input"
              aria-label="disabled input"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 cursor-not-allowed"
              name="sid"
              value={studentEditForm.sid}
              disabled
              required
            />
          </div>

          <div>
            <label
              htmlFor="firstname"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstname"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="firstname"
              value={studentEditForm.firstname}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="lastname"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastname"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="lastname"
              value={studentEditForm.lastname}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="dob"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Date of Birth
            </label>
            <input
              type="date"
              id="dob"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="dob"
              value={studentEditForm.dob.toString().substr(0, 10)}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="gender"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Gender
            </label>
            <select
              id="gender"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={studentEditForm.gender}
              name="gender"
              onChange={handleChange}
            >
              <option selected>Choose a gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
        <div>
          <label
            htmlFor="address"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Address
          </label>
          <textarea
            type="text"
            id="address"
            name="address"
            placeholder="-"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={studentEditForm.address}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-2 ">
          <div>
            <label
              htmlFor="phone"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="phone"
              placeholder="-"
              value={studentEditForm.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="email"
              placeholder="-"
              value={studentEditForm.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="cnic"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              CNIC/B-Form
            </label>
            <input
              type="text"
              id="cnic"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="cnic"
              placeholder="-"
              pattern="[0-9]{5}[0-9]{7}[0-9]"
              value={studentEditForm.cnic}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="parentname"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Parent/Guardian Name
            </label>
            <input
              type="text"
              id="parentname"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="parentname"
              placeholder="-"
              value={studentEditForm.parentname}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="parentphone"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Parent/Guardian Phone
            </label>
            <input
              type="text"
              id="parentphone"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="parentphone"
              placeholder="-"
              value={studentEditForm.parentphone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="parentemail"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Parent/Guardian Email
            </label>
            <input
              type="text"
              id="parentemail"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="parentemail"
              placeholder="-"
              value={studentEditForm.parentemail}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="parentcnic"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Parent/Guardian CNIC
            </label>
            <input
              type="text"
              id="parentcnic"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="parentcnic"
              placeholder="-"
              value={studentEditForm.parentcnic}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Courses */}
        {enrolledCourses.length !== 0 ? (
          <div className="title bg-dark  text-center text-white w-100 mt-3 rounded">
            <h5 className="text-white">Courses</h5>
          </div>
        ) : (
          ""
        )}

        <div className="grid grid-cols-3 gap-3 mb-1">
          {enrolledCourses.length !== 0 &&
            enrolledCourses.map((course) => {
              return (
                <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mt-2">
                  <a href="#">
                    <img
                      className="rounded-t-lg"
                      src={course.courseThumbnail && course.courseThumbnail.URL}
                      alt=""
                    />
                  </a>
                  <div className="p-1 text-center ">
                    <a href="#">
                      <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {" "}
                        {course.courseName}({course.courseId})
                      </h5>
                    </a>

                    <a
                      type="button"
                      className=" focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                      onClick={() => {
                        handleCourseRemove(
                          course.firebaseId,
                          course.courseName
                        );
                      }}
                    >
                      {isRemoving ? "Please Wait..." : "Remove"}
                    </a>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Emergency Contact  */}
        <div className="title bg-dark  text-center text-white w-100 mt-3 rounded">
          <h5 className="text-white">Emergency Contact Form</h5>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-1">
          <div>
            <label
              htmlFor="emergencyname"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Name
            </label>
            <input
              type="text"
              id="emergencyname"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="emergencyname"
              placeholder="-"
              value={studentEditForm.emergencyname}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="emergencyrelationship"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Relationship
            </label>
            <input
              type="text"
              id="emergencyrelationship"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="emergencyrelationship"
              placeholder="-"
              value={studentEditForm.emergencyrelationship}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="emergencyphone"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Phone Number
            </label>
            <input
              type="text"
              id="emergencyphone"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="emergencyphone"
              placeholder="-"
              value={studentEditForm.emergencyphone}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Related Files */}
        <div className="title bg-dark  text-center text-white w-100 mt-3 rounded">
          <h5 className="text-white">Related Documents</h5>
        </div>

        <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-3 mb-1">
          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              for="studentcnicphoto"
            >
              Student CNIC/B-Form
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              name="studentcnicphoto"
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
              for="parentcnicphoto"
            >
              Parent CNIC
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              name="parentcnicphoto"
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
              for="medicalrecordsphoto"
            >
              Medical Records
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              name="medicalrecordsphoto"
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
              for="additionaldocuments"
            >
              Additional Documents
            </label>
            <input
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              name="additionaldocuments"
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
        <button type="submit" className="w-full bg-green-600 py-2 rounded text-white hover:bg-green-500" disabled={isSaving}>
          <span className="bi bi-file-earmark-arrow-up pr-1"></span>

           {isSaving && "Saving.."}
           {!isSaving && "Save"}
        </button>
      </form>
    </div>
  );
};

export default StudentEdit;
