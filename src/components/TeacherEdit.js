import React from "react";
import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../Firebase/config";

const TeacherEdit = ({ teacher, coursesInstructor }) => {
  const [teacherEditForm, setTeacherEditForm] = useState(teacher);
  const [teacherPhotoURL, setTeacherPhotoURL] = useState(
    undefined ||
      (teacherEditForm.teacherphoto && teacherEditForm.teacherphoto.URL)
  ); //Staff Photo URL
  const [isSaving, setIsSaving] = useState(false);
  const [isRemoving, setIsRemving] = useState(false);
  const [profilePictureError, setProfilePictureError] = useState(false);
  const [cnicError, setCnicError] = useState(false);
  const [degreeError, setDegreeError] = useState(false);
  const [cvError, setCvError] = useState(false);
  const [medicalRecordError, setMedicalRecordError] = useState(false);
  const [additionalDocError, setAdditionalDocError] = useState(false);
  const [courseToRemove, setCourseToRemove] = useState(false);
  const [confirmRemModal, setConfirmRemModal] = useState(false);

  const closeConfirmModal = () => {
    setConfirmRemModal(false);
  };
  const showConfirmModal = (e) => {
    e.preventDefault();
    setConfirmRemModal(true);
  };

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

  // It handles the changes
  const handleChange = (e) => {
    if (e.target.name === "teacherphoto") {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        setProfilePictureError(true);
        alert("Profile Picture size should not exceed 1MB");
        return;
      }
      setProfilePictureError(false);
      setTeacherEditForm({
        ...teacherEditForm,
        [e.target.name]: e.target.files[0],
      });
      setTeacherPhotoURL(URL.createObjectURL(e.target.files[0]));
    } else if (e.target.name === "teachercnicphoto") {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        setCnicError(true);
        alert("File of size > 1mb is not accepted");
        return;
      }

      setCnicError(false);
      setTeacherEditForm({
        ...teacherEditForm,
        [e.target.name]: e.target.files[0],
      });
    } else if (e.target.name === "cv") {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        setCvError(true);
        alert("File of size > 1mb is not accepted");
        return;
      }

      setCvError(false);
      setTeacherEditForm({
        ...teacherEditForm,
        [e.target.name]: e.target.files[0],
      });
    } else if (e.target.name === "degreefile") {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        setDegreeError(true);
        alert("File of size > 1mb is not accepted");
        return;
      }
      setDegreeError(false);
      setTeacherEditForm({
        ...teacherEditForm,
        [e.target.name]: e.target.files[0],
      });
    } else if (e.target.name === "medicalrecordsphoto") {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        setMedicalRecordError(true);
        alert("File of size > 1mb is not accepted");
        return;
      }

      setMedicalRecordError(false);
      setTeacherEditForm({
        ...teacherEditForm,
        [e.target.name]: e.target.files[0],
      });
    } else if (e.target.name === "additionaldocuments") {
      // Additional Files Size
      const files = e.target.files;
      let totalSize = 0;
      for (let i = 0; i < files.length; i++) {
        totalSize += files[i].size;
      }
      if (totalSize > 5000000) {
        // 5 MB
        setAdditionalDocError(true);
        alert("Additional files size should not exceed 5MB");
        return;
      }
      setAdditionalDocError(false);
      setTeacherEditForm({
        ...teacherEditForm,
        [e.target.name]: e.target.files,
      });
    } else if (e.target.name === "courses") {
      const newForm = teacherEditForm;
      newForm.courses = e.target.value === "" ? [] : [e.target.value];
      const selectedCourse = courses.find(
        (course) => course.firebaseId === e.target.value
      );
      newForm.coursesname =
        e.target.value === "" ? [] : [selectedCourse.courseName];
      setTeacherEditForm(newForm);
    } else if (e.target.name === "dob") {
      setTeacherEditForm({
        ...teacherEditForm,
        [e.target.name]: e.target.value,
      });
    } else {
      setTeacherEditForm({
        ...teacherEditForm,
        [e.target.name]: e.target.value,
      });
    }
  };

  // It handles the submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try{
    // Create a reference to the students collection
    const teachersRef = db.collection("teachers");
    const salaryref = db.collection("salaries");
    const storageRef = firebase.storage().ref();

    const {
      teacherphoto,
      teachercnicphoto,
      medicalrecordsphoto,
      additionaldocuments,
      cv,
      degreefile,
    } = teacherEditForm;

    //Updating the salary if updated
    if (teacher.initsalary !== teacherEditForm.initsalary) {
      await salaryref.doc(teacherEditForm.salaryfirebaseid).update({
        salary: teacherEditForm.initsalary,
      });
    }

    //Name if updated
    if (
      teacher.firstname !== teacherEditForm.firstname ||
      teacher.lastname !== teacherEditForm.lastname
    ) {
      await salaryref.doc(teacherEditForm.salaryfirebaseid).update({
        name: teacherEditForm.firstname + " " + teacherEditForm.lastname,
      });
    }

    //Updating the text record of teacher record except courses array
    db.collection("teachers").doc(teacher.firebaseId).update({
      tid: teacherEditForm.tid,
      firstname: teacherEditForm.firstname,
      lastname: teacherEditForm.lastname,
      dob: teacherEditForm.dob,
      gender: teacherEditForm.gender,
      address: teacherEditForm.address,
      phone: teacherEditForm.phone,
      email: teacherEditForm.email,
      cnic: teacherEditForm.cnic,
      degree: teacherEditForm.degree,
      institutename: teacherEditForm.institutename,
      passingyear: teacherEditForm.passingyear,
      obtgpa: teacherEditForm.obtgpa,
      designation: teacherEditForm.designation,
      doj: teacherEditForm.doj,
      initsalary: teacherEditForm.initsalary,
      emergencyname: teacherEditForm.emergencyname,
      emergencyphone: teacherEditForm.emergencyphone,
      emergencyrelationship: teacherEditForm.emergencyrelationship,
    });

    //If profile picture is changed
    if (
      JSON.stringify(teacherEditForm.teacherphoto) !==
      JSON.stringify(teacher.teacherphoto)
    ) {
      const metadata = {
        contentType: teacherphoto.type,
        customMetadata: {
          fileExtension: teacherphoto.name.split(".").pop(),
        },
      };
      await firebase
        .storage()
        .refFromURL(teacher.teacherphoto.URL)
        .delete()
        .then(async () => {
          const teacherphotoSnapshot = await storageRef
            .child(`teacher/${teacherEditForm.tid}/teacherphoto`)
            .put(teacherphoto);
          let URL = await teacherphotoSnapshot.ref.getDownloadURL();
          let teacherphotoURL = { URL, metadata };
          await teachersRef.doc(teacher.firebaseId).update({
            teacherphoto: teacherphotoURL,
          });
          await salaryref.doc(teacherEditForm.salaryfirebaseid).update({
            photoURL: teacherphotoURL,
          });
        });
    }

    //If CNIC FILE is changed
    if (
      JSON.stringify(teacherEditForm.studentcnicphoto) !==
      JSON.stringify(teacher.studentcnicphoto)
    ) {
      const metadata = {
        contentType: teachercnicphoto.type,
        customMetadata: {
          fileExtension: teachercnicphoto.name.split(".").pop(),
        },
      };
      if (teacher.studentcnicphoto.length !== 0) {
        await firebase
          .storage()
          .refFromURL(teacher.teachercnicphoto.URL)
          .delete()
          .then(async () => {
            const teachercnicphotoSnapshot = await storageRef
              .child(`teacher/${teacherEditForm.tid}/teachercnic`)
              .put(teachercnicphoto);
            let URL = await teachercnicphotoSnapshot.ref.getDownloadURL();
            let teachercnicphotoURL = { URL, metadata };
            await teachersRef.doc(teacher.firebaseId).update({
              teachercnicphoto: teachercnicphotoURL,
            });
          });
      } else {
        const teachercnicphotoSnapshot = await storageRef
          .child(`teacher/${teacherEditForm.tid}/teachercnic`)
          .put(teachercnicphoto);
        let URL = await teachercnicphotoSnapshot.ref.getDownloadURL();
        let teachercnicphotoURL = { URL, metadata };
        await teachersRef.doc(teacher.firebaseId).update({
          teachercnicphoto: teachercnicphotoURL,
        });
      }
    }
    //If Degree FILE is changed
    if (
      JSON.stringify(teacherEditForm.degreefile) !==
      JSON.stringify(teacher.degreefile)
    ) {
      const metadata = {
        contentType: degreefile.type,
        customMetadata: {
          fileExtension: degreefile.name.split(".").pop(),
        },
      };
      if (teacher.degreefile.length !== 0) {
        await firebase
          .storage()
          .refFromURL(teacher.degreefile.URL)
          .delete()
          .then(async () => {
            const degreefileSnapshot = await storageRef
              .child(`teacher/${teacherEditForm.tid}/degree`)
              .put(degreefile);
            let URL = await degreefileSnapshot.ref.getDownloadURL();
            let degreefileURL = { URL, metadata };
            await teachersRef.doc(teacher.firebaseId).update({
              degreefile: degreefileURL,
            });
          });
      } else {
        const degreefileSnapshot = await storageRef
          .child(`teacher/${teacherEditForm.tid}/degree`)
          .put(degreefile);
        let URL = await degreefileSnapshot.ref.getDownloadURL();
        let degreefileURL = { URL, metadata };
        await teachersRef.doc(teacher.firebaseId).update({
          degreefile: degreefileURL,
        });
      }
    }
    //If CV FILE is changed
    if (JSON.stringify(teacherEditForm.cv) !== JSON.stringify(teacher.cv)) {
      const metadata = {
        contentType: cv.type,
        customMetadata: {
          fileExtension: cv.name.split(".").pop(),
        },
      };

      if (teacher.cv.length !== 0) {
        await firebase
          .storage()
          .refFromURL(teacher.cv.URL)
          .delete()
          .then(async () => {
            const cvSnapshot = await storageRef
              .child(`teacher/${teacherEditForm.tid}/cv`)
              .put(cv);
            let URL = await cvSnapshot.ref.getDownloadURL();
            let cvURL = { URL, metadata };
            await teachersRef.doc(teacher.firebaseId).update({
              cv: cvURL,
            });
          });
      } else {
        const cvSnapshot = await storageRef
          .child(`teacher/${teacherEditForm.tid}/cv`)
          .put(cv);
        let URL = await cvSnapshot.ref.getDownloadURL();
        let cvURL = { URL, metadata };
        await teachersRef.doc(teacher.firebaseId).update({
          cv: cvURL,
        });
      }
    }

    //If Medical Record file is changed
    if (
      JSON.stringify(teacherEditForm.medicalrecordsphoto) !==
      JSON.stringify(teacher.medicalrecordsphoto)
    ) {
      const metadata = {
        contentType: medicalrecordsphoto.type,
        customMetadata: {
          fileExtension: medicalrecordsphoto.name.split(".").pop(),
        },
      };
      if (teacher.medicalrecordsphoto.length !== 0) {
        await firebase
          .storage()
          .refFromURL(teacher.medicalrecordsphoto.URL)
          .delete()
          .then(async () => {
            const medicalrecordphotoSnapshot = await storageRef
              .child(`teacher/${teacherEditForm.tid}/medicalrecord`)
              .put(medicalrecordsphoto);
            let URL = await medicalrecordphotoSnapshot.ref.getDownloadURL();
            let medicalrecordphotoURL = { URL, metadata };
            await teachersRef.doc(teacher.firebaseId).update({
              medicalrecordsphoto: medicalrecordphotoURL,
            });
          });
      } else {
        const medicalrecordphotoSnapshot = await storageRef
          .child(`teacher/${teacherEditForm.tid}/medicalrecord`)
          .put(medicalrecordsphoto);
        let URL = await medicalrecordphotoSnapshot.ref.getDownloadURL();
        let medicalrecordphotoURL = { URL, metadata };
        await teachersRef.doc(teacher.firebaseId).update({
          medicalrecordsphoto: medicalrecordphotoURL,
        });
      }
    }

    //If Additional files is changed
    if (
      JSON.stringify(teacherEditForm.additionaldocuments) !==
      JSON.stringify(teacher.additionaldocuments)
    ) {
      let metadata = {};
      //Deleting the previous additional Files
      if (additionaldocuments && additionaldocuments.length !== 0) {
        teacher.additionaldocuments.map(async (additionaldocument) => {
          await firebase.storage().refFromURL(additionaldocument.URL).delete();
          db.collection("teachers")
            .doc(teacherEditForm.firebaseId)
            .update({
              additionaldocuments:
                firebase.firestore.FieldValue.arrayRemove(additionaldocument),
            });
        });
      }
      let additionalFilesURL = [];
      for (var i = 0; i < teacherEditForm.additionaldocuments.length; i++) {
        metadata = {
          contentType: additionaldocuments[i].type,
          customMetadata: {
            fileExtension: additionaldocuments[i].name.split(".").pop(),
          },
        };
        const additionaldocumentSnapshot = await storageRef
          .child(`teacher/${teacherEditForm.tid}/additionaldocument${i + 1}`)
          .put(additionaldocuments[i], { metadata });
        let URL = await additionaldocumentSnapshot.ref.getDownloadURL();
        additionalFilesURL.push({ URL, metadata });
        await teachersRef.doc(teacherEditForm.firebaseId).update({
          additionaldocuments: firebase.firestore.FieldValue.arrayUnion({
            URL,
            metadata,
          }),
        });
      }
    }

    setIsSaving(false);
    showSuccessToast();
  }
  catch(err){
    setIsSaving(false);
    showErrorToast();
  }
  };

  const handleCourseRemove = async (e) => {
    e.preventDefault();
    setIsRemving(true);
    let updatedForm = teacherEditForm;
    let atIndex = updatedForm.courses.indexOf(courseToRemove.firebaseId);
    updatedForm.courses.splice(atIndex, 1);
    setTeacherEditForm(updatedForm);

    // Updaing the course record in database
    await db
      .collection("teachers")
      .doc(teacherEditForm.firebaseId)
      .update({
        courses: updatedForm.courses,
        coursesname: firebase.firestore.FieldValue.arrayRemove(
          courseToRemove.courseName
        ),
      });
    // Updaing the course record in database
    await db.collection("courses").doc(courseToRemove.firebaseId).update({
      courseInstructorId: "",
    });
    setIsRemving(false);
    closeConfirmModal();
  };

  return (
    <div className="main-content mb-5">
      {/* Confirmation Modal */}
      <div
        className="fixed z-10 inset-0 overflow-y-auto"
        style={{ display: confirmRemModal ? "block" : "none" }}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <div
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <form>
              <div className="bg-white px-4 pt-2 pb-2 sm:p-6 sm:pb-4 flex justify-center flex-col items-center">
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
                </div>
                <div className="pt-3">
                  <h1>Are you sure to remove this course </h1>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-2 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className=" mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleCourseRemove}
                >
                  {!isRemoving && "Yes Remove"}
                  {isRemoving && "Removing..."}
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
          src={teacherPhotoURL || "/no_profile_picture.jpeg"}
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
            Upload admin Photo
          </label>
          <input
            className={`block w-full text-sm text-gray-900 border-2  rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${
              profilePictureError ? "border-red-700" : "border-gray-300"
            } `}
            aria-describedby="file_input_help"
            id="file_input"
            type="file"
            name="teacherphoto"
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
              htmlFor="tid"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Teacher ID
            </label>
            <input
              type="text"
              id="disabled-input"
              aria-label="disabled input"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 cursor-not-allowed"
              name="tid"
              value={teacherEditForm.tid}
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
              value={teacherEditForm.firstname}
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
              value={teacherEditForm.lastname}
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
              value={teacherEditForm.dob.toString().substr(0, 10)}
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
              value={teacherEditForm.gender}
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
            value={teacherEditForm.address}
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
              value={teacherEditForm.phone}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="cnic"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              CNIC
            </label>
            <input
              type="text"
              id="cnic"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="cnic"
              placeholder="-"
              pattern="[0-9]{5}[0-9]{7}[0-9]"
              value={teacherEditForm.cnic}
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
              value={teacherEditForm.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="education"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Qualification
            </label>
            <select
              id="education"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={teacherEditForm.degree}
              name="education"
              onChange={handleChange}
            >
              <option selected>Choose Education Level</option>
              <option value="matric">Matric</option>
              <option value="intermediate">Intermediate</option>
              <option value="graduated">Graduated</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="institutename"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Institute Name
            </label>
            <input
              type="text"
              id="institutename"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="institutename"
              placeholder="-"
              value={teacherEditForm.institutename}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="yearofpass"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Passing Year
            </label>
            <input
              type="text"
              id="yearofpass"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="yearofpass"
              placeholder="-"
              value={teacherEditForm.passingyear}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="cgpa"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              CGPA
            </label>
            <input
              type="text"
              id="obtgpa"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="obtgpa"
              placeholder="-"
              value={teacherEditForm.obtgpa}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="designation"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Designation
            </label>
            <input
              type="text"
              id="designation"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="designation"
              placeholder="-"
              value={teacherEditForm.designation}
              onChange={handleChange}
            />
          </div>
          <div>
            <label
              htmlFor="doj"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Date of Joining
            </label>
            <input
              type="text"
              id="doj"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="doj"
              placeholder="-"
              value={teacherEditForm.doj}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="initsalary"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Salary
            </label>
            <input
              type="text"
              id="initsalary"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="initsalary"
              placeholder="-"
              value={teacherEditForm.initsalary}
              onChange={handleChange}
            />
          </div>
        </div>

        {coursesInstructor &&
          coursesInstructor.length !== 0 &&
          teacher.courses.length !== 0 && (
            <div className=" mt-3 title bg-dark  text-center text-white w-100 rounded">
              <h5 className="text-white">Instructor Of Following Courses</h5>
            </div>
          )}

        {coursesInstructor &&
          coursesInstructor.length !== 0 &&
          coursesInstructor.map((course) => {
            return teacher.courses &&
              teacher.courses.includes(course.firebaseId) ? (
              <div
                className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 cursor-pointer select-none mt-2"
                key={course.firebaseId}
              >
                <div className="flex flex-col items-center pb-10 mt-3">
                  <img
                    className="w-24 h-24 mb-3 rounded-full shadow-lg"
                    src={
                      course.courseThumbnail.URL || "/no_profile_picture.jpeg"
                    }
                    alt="Course image"
                  />
                  <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                    {course.courseName}({course.courseId.toUpperCase()})
                  </h5>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {course.courseDesc.match(/(\b\w+\b[\s,]*){1,5}/g)}
                  </span>
                  <div className="flex mt-4 space-x-3 md:mt-6">
                    <a
                      className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 hover:underline focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                      onClick={(e) => {
                        setCourseToRemove(course);
                        showConfirmModal(e);
                      }}
                    >
                      Remove
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              ""
            );
          })}

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
              value={teacherEditForm.emergencyname}
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
              value={teacherEditForm.emergencyrelationship}
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
              value={teacherEditForm.emergencyphone}
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
              for="teachercnicphoto"
            >
              CNIC
            </label>
            <input
              className={`block w-full text-sm text-gray-900 border-2  rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${
                cnicError ? "border-red-700" : "border-gray-300"
              } `}
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              name="teachercnicphoto"
              onChange={handleChange}
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
              for="degreefile"
            >
              Degree File
            </label>
            <input
              className={`block w-full text-sm text-gray-900 border-2  rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${
                degreeError ? "border-red-700" : "border-gray-300"
              } `}
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              name="degreefile"
              onChange={handleChange}
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
              className={`block w-full text-sm text-gray-900 border-2  rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${
                medicalRecordError ? "border-red-700" : "border-gray-300"
              } `}
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
              for="cv"
            >
              CV
            </label>
            <input
              className={`block w-full text-sm text-gray-900 border-2  rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${
                cvError ? "border-red-700" : "border-gray-300"
              } `}
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              name="cv"
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
              className={`block w-full text-sm text-gray-900 border-2  rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${
                additionalDocError ? "border-red-700" : "border-gray-300"
              } `}
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
        <button
          type="submit"
          className="w-full bg-green-600 py-2 rounded text-white hover:bg-green-500"
          disabled={
            profilePictureError ||
            cnicError ||
            cvError ||
            degreeError ||
            medicalRecordError ||
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
  );
};

export default TeacherEdit;
