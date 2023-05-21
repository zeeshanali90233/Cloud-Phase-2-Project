import React from "react";
import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../Firebase/config";

var rows = [
  { authorityname: "Students" },
  { authorityname: "Courses" },
  { authorityname: "Fees" },
];

const StaffEdit = ({ staff, authorities }) => {
  const [staffEditForm, setStaffEditForm] = useState(staff);
  const [staffPhotoURL, setStaffPhotoURL] = useState(
    undefined || (staffEditForm.staffphoto && staffEditForm.staffphoto.URL)   
  ); //Staff Photo URL
  const [isSaving, setIsSaving] = useState(false);
  const [authoritiesEdit, setAuthoritiesEdit] = useState(authorities || rows);
  const [profilePictureError, setProfilePictureError] = useState(false);
  const [cnicError, setCnicError] = useState(false);
  const [medicalRecordError, setMedicalRecordError] = useState(false);
  const [additionalDocError, setAdditionalDocError] = useState(false);


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
    if (e.target.name === "staffphoto") {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        alert("Profile Picture size should not exceed 1MB");
        setProfilePictureError(true);
        return;
    }
    setProfilePictureError(false);
      setStaffEditForm({
        ...staffEditForm,
        [e.target.name]: e.target.files[0],
      });
      setStaffPhotoURL(URL.createObjectURL(e.target.files[0]));
    } else if (
      e.target.name === "staffcnicphoto" ||
      e.target.name === "medicalrecordsphoto"
    ) {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        alert("File of size > 1mb is not accepted");
        setCnicError(true);
        setMedicalRecordError(true);
        return;
      }
      setCnicError(false);
        setMedicalRecordError(false);
      setStaffEditForm({
        ...staffEditForm,
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
        setAdditionalDocError(true);
        return;
      }
      setAdditionalDocError(false);
      setStaffEditForm({
        ...staffEditForm,
        [e.target.name]: e.target.files,
      });
    } else if (e.target.name === "dob") {
      if (validateDob(e.target.value)) {
        setStaffEditForm({ ...studentForm, [e.target.name]: e.target.value });
      } else {
        alert("Date of birth is not correct!");
        return;
      }
    } else {
      setStaffEditForm({
        ...staffEditForm,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleAuthorityChange = (e, authorityname) => {
    e.preventDefault();
    if (authorityname === "Students") {
      setStaffEditForm({
        ...staffEditForm,
        studentauthority: {
          ...staffEditForm.studentauthority,
          [e.target.name]: e.target.checked,
        },
      });
      rows[0][e.target.name] = e.target.checked;
      setAuthoritiesEdit(rows);
    } else if (authorityname === "Courses") {
      setStaffEditForm({
        ...staffEditForm,
        courseauthority: {
          ...staffEditForm.courseauthority,
          [e.target.name]: e.target.checked,
        },
      });
      rows[1][e.target.name] = e.target.checked;
      setAuthoritiesEdit(rows);
    } else if (authorityname === "Fees") {
      setStaffEditForm({
        ...staffEditForm,
        feesauthority: {
          ...staffEditForm.feesauthority,
          [e.target.name]: e.target.checked,
        },
      });
      rows[2][e.target.name] = e.target.checked;
      setAuthoritiesEdit(rows);
    }
  };

  //Funtion to save the changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Create a reference to the students collection
      const staffRef = db.collection("staff");
      const storageRef = firebase.storage().ref();

      await staffRef.doc(staffEditForm.firebaseId).update({
        firstname: staffEditForm.firstname,
        lastname: staffEditForm.lastname,
        dob: staffEditForm.dob,
        gender: staffEditForm.gender,
        address: staffEditForm.address,
        phone: staffEditForm.phone,
        email: staffEditForm.email,
        cnic: staffEditForm.cnic,
        education: staffEditForm.education,
        institutename: staffEditForm.institutename,
        yearofpass: staffEditForm.yearofpass,
        designation: staffEditForm.designation,
        initsalary: staffEditForm.initsalary,
        emergencyname: staffEditForm.emergencyname,
        emergencyphone: staffEditForm.emergencyphone,
        emergencyrelationship: staffEditForm.emergencyrelationship,
        courseauthority: staffEditForm.courseauthority,
        feesauthority: staffEditForm.feesauthority,
        studentauthority: staffEditForm.studentauthority,
      });

      // If salary changes than also updating it in the salary collection
      if (staff.initsalary !== staffEditForm.initsalary) {
        await db
          .collection("salaries")
          .doc(staffEditForm.salaryfirebaseid)
          .update({
            salary: staffEditForm.initsalary,
          });
      }
      // If name changes
      if (
        staff.firstname !== staffEditForm.firstname ||
        staff.lastname !== staffEditForm.lastname
      ) {
        await db
          .collection("salaries")
          .doc(staffEditForm.salaryfirebaseid)
          .update({
            name: staffEditForm.firstname + " " + staffEditForm.lastname,
          });
      }

      const {
        staffphoto,
        staffcnicphoto,
        medicalrecordsphoto,
        additionaldocuments,
      } = staffEditForm;

      // Staff Photo
      if (
        JSON.stringify(staffEditForm.staffphoto) !==
        JSON.stringify(staff.staffphoto)
      ) {
        await firebase
          .storage()
          .refFromURL(staff.staffphoto.URL)
          .delete()
          .then(async () => {
            const metadata = {
              contentType: staffphoto.type,
              customMetadata: {
                fileExtension: staffphoto.name.split(".").pop(),
              },
            };
            const staffphotoSnapshot = await storageRef
              .child(`staff/${staffEditForm.staffid}/staffphoto`)
              .put(staffphoto, { metadata });
            const URL = await staffphotoSnapshot.ref.getDownloadURL();
            let staffphotoURL = { URL, metadata };
            await db.collection("staff").doc(staffEditForm.firebaseId).update({
              staffphoto: staffphotoURL,
            });
            await db
              .collection("salaries")
              .doc(staffEditForm.salaryfirebaseid)
              .update({
                photoURL: staffphotoURL,
              });
          });
      }

      // Staff Cnic
      if (
        JSON.stringify(staffEditForm.staffcnicphoto) !==
        JSON.stringify(staff.staffcnicphoto)
      ) {
        if (staff.staffcnicphoto.length !== 0) {
          await firebase
            .storage()
            .refFromURL(staff.staffcnicphoto.URL)
            .delete()
            .then(async () => {
              const metadata = {
                contentType: staffcnicphoto.type,
                customMetadata: {
                  fileExtension: staffcnicphoto.name.split(".").pop(),
                },
              };
              const staffcnicphotoSnapshot = await storageRef
                .child(`staff/${staffEditForm.staffid}/cnicphoto`)
                .put(staffcnicphoto, { metadata });
              const URL = await staffcnicphotoSnapshot.ref.getDownloadURL();
              let staffcnicphotoURL = { URL, metadata };
              db.collection("staff").doc(staffEditForm.firebaseId).update({
                staffcnicphoto: staffcnicphotoURL,
              });
            });
        } else {
          const metadata = {
            contentType: staffcnicphoto.type,
            customMetadata: {
              fileExtension: staffcnicphoto.name.split(".").pop(),
            },
          };
          const staffcnicphotoSnapshot = await storageRef
            .child(`staff/${staffEditForm.staffid}/cnicphoto`)
            .put(staffcnicphoto, { metadata });
          const URL = await staffcnicphotoSnapshot.ref.getDownloadURL();
          let staffcnicphotoURL = { URL, metadata };
          db.collection("staff").doc(staffEditForm.firebaseId).update({
            staffcnicphoto: staffcnicphotoURL,
          });
        }
      }

      // Staff medicalrecords
      if (
        JSON.stringify(staffEditForm.medicalrecordsphoto) !==
        JSON.stringify(staff.medicalrecordsphoto)
      ) {
        if (staff.medicalrecordsphoto.length !== 0) {
          await firebase
            .storage()
            .refFromURL(staff.medicalrecordsphoto.URL)
            .delete()
            .then(async () => {
              const metadata = {
                contentType: medicalrecordsphoto.type,
                customMetadata: {
                  fileExtension: medicalrecordsphoto.name.split(".").pop(),
                },
              };
              const medicalrecordsphotoSnapshot = await storageRef
                .child(`staff/${staffEditForm.staffid}/medicalrecords`)
                .put(medicalrecordsphoto, { metadata });
              const URL =
                await medicalrecordsphotoSnapshot.ref.getDownloadURL();
              let medicalrecordsphotoURL = { URL, metadata };
              db.collection("staff").doc(staffEditForm.firebaseId).update({
                medicalrecordsphoto: medicalrecordsphotoURL,
              });
            });
        } else {
          const metadata = {
            contentType: medicalrecordsphoto.type,
            customMetadata: {
              fileExtension: medicalrecordsphoto.name.split(".").pop(),
            },
          };
          const medicalrecordsphotoSnapshot = await storageRef
            .child(`staff/${staffEditForm.staffid}/medicalrecords`)
            .put(medicalrecordsphoto, { metadata });
          const URL = await medicalrecordsphotoSnapshot.ref.getDownloadURL();
          let medicalrecordsphotoURL = { URL, metadata };
          db.collection("staff").doc(staffEditForm.firebaseId).update({
            medicalrecordsphoto: medicalrecordsphotoURL,
          });
        }
      }

      //If Additional files is changed
      if (
        JSON.stringify(staffEditForm.additionaldocuments) !==
        JSON.stringify(staff.additionaldocuments)
      ) {
        let metadata = {};
        //Deleting the previous additional Files
        if (additionaldocuments && additionaldocuments.length !== 0) {
          staff.additionaldocuments.map(async (additionaldocument) => {
            await firebase
              .storage()
              .refFromURL(additionaldocument.URL)
              .delete();
            db.collection("staff")
              .doc(staffEditForm.firebaseId)
              .update({
                additionaldocuments:
                  firebase.firestore.FieldValue.arrayRemove(additionaldocument),
              });
          });
        }
        let additionalFilesURL = [];
        for (var i = 0; i < staffEditForm.additionaldocuments.length; i++) {
          metadata = {
            contentType: additionaldocuments[i].type,
            customMetadata: {
              fileExtension: additionaldocuments[i].name.split(".").pop(),
            },
          };
          const additionaldocumentSnapshot = await storageRef
            .child(
              `staff/${staffEditForm.staffid}/additionaldocuments${
                Number(i) + 1
              }`
            )
            .put(additionaldocuments[i], { metadata });
          let URL = await additionaldocumentSnapshot.ref.getDownloadURL();
          additionalFilesURL.push({ URL, metadata });
          await db
            .collection("staff")
            .doc(staffEditForm.firebaseId)
            .update({
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
      showErrorToast();
      console.log(err);
      setIsSaving(false);
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
          src={staffPhotoURL || "/no_profile_picture.jpeg"}
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
            Upload Staff Photo
          </label>
          <input
            className={`block w-full text-sm text-gray-900 border-2  rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${(profilePictureError)?"border-red-700":"border-gray-300"} `}
            aria-describedby="file_input_help"
            id="file_input"
            type="file"
            name="staffphoto"
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
              htmlFor="staffid"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Staff ID
            </label>
            <input
              type="text"
              id="disabled-input"
              aria-label="disabled input"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 cursor-not-allowed"
              name="staffid"
              value={staffEditForm.staffid}
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
              value={staffEditForm.firstname}
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
              value={staffEditForm.lastname}
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
              value={staffEditForm.dob.toString().substr(0, 10)}
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
              value={staffEditForm.gender}
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
            value={staffEditForm.address}
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
              value={staffEditForm.phone}
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
              value={staffEditForm.cnic}
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
              value={staffEditForm.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label
              htmlFor="education"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Education
            </label>
            <select
              id="education"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={staffEditForm.education}
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
              value={staffEditForm.institutename}
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
              value={staffEditForm.yearofpass}
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
              value={staffEditForm.designation}
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
              value={staffEditForm.initsalary}
              onChange={handleChange}
            />
          </div>
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
              value={staffEditForm.emergencyname}
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
              value={staffEditForm.emergencyrelationship}
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
              value={staffEditForm.emergencyphone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className=" mt-3 title bg-dark  text-center text-white w-100 rounded">
          <h5 className="text-white">Authorities</h5>
        </div>

        {/* Authorities Table */}
        <div class="relative overflow-x-auto">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3"></th>
                <th scope="col" class="px-6 py-3">
                  Review
                </th>
                <th scope="col" class="px-6 py-3">
                  Add
                </th>
                <th scope="col" class="px-6 py-3">
                  Edit
                </th>
              </tr>
            </thead>
            <tbody>
              {authoritiesEdit.map((auth) => {
                return (
                  <tr
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                    key={auth.name}
                  >
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {auth.authorityname}
                    </th>
                    <td class="px-6 py-4">
                      {" "}
                      <input
                        type="checkbox"
                        name="review"
                        id="review"
                        onChange={(e) => {
                          handleAuthorityChange(e, auth.authorityname);
                        }}
                        checked={auth.review}
                      />
                    </td>
                    <td class="px-6 py-4">
                      {" "}
                      <input
                        type="checkbox"
                        name="add"
                        id="add"
                        onChange={(e) => {
                          handleAuthorityChange(e, auth.authorityname);
                        }}
                        checked={auth.add}
                      />
                    </td>
                    <td class="px-6 py-4">
                      {" "}
                      <input
                        type="checkbox"
                        name="edit"
                        id="edit"
                        onChange={(e) => {
                          handleAuthorityChange(e, auth.authorityname);
                        }}
                        checked={auth.edit}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Related Files */}
        <div className="title bg-dark  text-center text-white w-100 mt-3 rounded">
          <h5 className="text-white">Related Documents</h5>
        </div>

        <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-3 mb-1">
          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              for="staffcnicphoto"
            >
            CNIC
            </label>
            <input
              className={`block w-full text-sm text-gray-900 border-2  rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${(cnicError)?"border-red-700":"border-gray-300"} `}
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              name="staffcnicphoto"
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
              className={`block w-full text-sm text-gray-900 border-2  rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${(medicalRecordError)?"border-red-700":"border-gray-300"} `}
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
              className={`block w-full text-sm text-gray-900 border-2  rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${(additionalDocError)?"border-red-700":"border-gray-300"} `}
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
            medicalRecordError ||
            additionalDocError || isSaving
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

export default StaffEdit;
