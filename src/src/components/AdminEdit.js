import React from "react";
import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../Firebase/config";

const AdminEdit = ({ admin }) => {
  const [adminEditForm, setAdminEditForm] = useState(admin);
  const [adminPhotoURL, setAdminPhotoURL] = useState(
    undefined || (adminEditForm.adminPhoto && adminEditForm.adminPhoto.URL)
  ); //Admin Photo URL
  const [isSaving, setIsSaving] = useState(false);
  const [profilePictureError, setProfilePictureError] = useState(false);
  const [cnicError, setCnicError] = useState(false);
  const [medicalRecordError, setMedicalRecordError] = useState(false);
  const [additionalDocError, setAdditionalDocError] = useState(false);
  const [cvError, setCvError] = useState(false);
  const [degreeError, setDegreeError] = useState(false);

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
    if (e.target.name === "adminphoto") {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        setProfilePictureError(true);
        alert("Profile Picture size should not exceed 1MB");
        return;
      }
      setProfilePictureError(false);

      setAdminEditForm({
        ...adminEditForm,
        [e.target.name]: e.target.files[0],
      });
      setAdminPhotoURL(URL.createObjectURL(e.target.files[0]));
    } else if (e.target.name === "medicalrecordsphoto") {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        setMedicalRecordError(true);
        alert("File of size > 1mb is not accepted");
        return;
      }

      setMedicalRecordError(false);
      setAdminEditForm({
        ...adminEditForm,
        [e.target.name]: e.target.files[0],
      });
    } else if (e.target.name === "admincnicphoto") {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        setCnicError(true);
        alert("File of size > 1mb is not accepted");
        return;
      }

      setCnicError(false);
      setAdminEditForm({
        ...adminEditForm,
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
      setAdminEditForm({
        ...adminEditForm,
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
      setAdminEditForm({
        ...adminEditForm,
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
        // 5 MB
        setAdditionalDocError(true);
        alert("Additional files size should not exceed 5MB");
        return;
      }
      setAdditionalDocError(false);
      setAdminEditForm({ ...adminEditForm, [e.target.name]: e.target.files });
    } else if (e.target.name === "dob") {
      setAdminEditForm({ ...adminEditForm, [e.target.name]: e.target.value });
    } else {
      setAdminEditForm({ ...adminEditForm, [e.target.name]: e.target.value });
    }
  };

  //Funtion to save the changes
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // Create a reference to the Admin collection
      const adminRef = db.collection("admin");
      const storageRef = firebase.storage().ref();

      await adminRef.doc(adminEditForm.firebaseId).update({
        firstname: adminEditForm.firstname,
        lastname: adminEditForm.lastname,
        dob: adminEditForm.dob,
        gender: adminEditForm.gender,
        address: adminEditForm.address,
        phone: adminEditForm.phone,
        email: adminEditForm.email,
        cnic: adminEditForm.cnic,
        education: adminEditForm.education,
        institutename: adminEditForm.institutename,
        yearofpass: adminEditForm.yearofpass,
        cgpa: adminEditForm.cgpa,
        designation: adminEditForm.designation,
        initsalary: adminEditForm.initsalary,
        emergencyname: adminEditForm.emergencyname,
        emergencyphone: adminEditForm.emergencyphone,
        emergencyrelationship: adminEditForm.emergencyrelationship,
        canmanagesalary: Boolean(adminEditForm.canmanagesalary),
      });

      // If salary changes than also updating it in the salary collection
      if (admin.initsalary !== adminEditForm.initsalary) {
        await db.collection("salaries").doc(adminEditForm.salaryref).update({
          salary: adminEditForm.initsalary,
        });
      }
      // If name changes
      if (
        admin.firstname !== adminEditForm.firstname ||
        admin.lastname !== adminEditForm.lastname
      ) {
        await db
          .collection("salaries")
          .doc(adminEditForm.salaryref)
          .update({
            name: adminEditForm.firstname + " " + adminEditForm.lastname,
          });
      }

      const {
        adminPhoto,
        admincnicphoto,
        medicalrecordsphoto,
        cv,
        degreefile,
        additionaldocuments,
      } = adminEditForm;

      // admin Photo
      if (
        JSON.stringify(adminEditForm.adminPhoto) !==
        JSON.stringify(admin.adminPhoto)
      ) {
        await firebase
          .storage()
          .refFromURL(admin.adminPhoto.URL)
          .delete()
          .then(async () => {
            const metadata = {
              contentType: adminPhoto.type,
              customMetadata: {
                fileExtension: adminPhoto.name.split(".").pop(),
              },
            };
            const staffphotoSnapshot = await storageRef
              .child(`admin/${adminEditForm.aid}/adminPhoto`)
              .put(adminPhoto, { metadata });
            const URL = await staffphotoSnapshot.ref.getDownloadURL();
            let adminPhotoURL = { URL, metadata };
            await db.collection("admin").doc(adminEditForm.firebaseId).update({
              adminPhoto: adminPhotoURL,
            });
            await db
              .collection("salaries")
              .doc(adminEditForm.salaryfirebaseid)
              .update({
                photoURL: adminPhotoURL,
              });
          });
      }

      // admin Cnic
      if (
        JSON.stringify(adminEditForm.admincnicphoto) !==
        JSON.stringify(admin.admincnicphoto)
      ) {
        if (admin.admincnicphoto.length !== 0) {
          await firebase
            .storage()
            .refFromURL(admin.admincnicphoto.URL)
            .delete()
            .then(async () => {
              const metadata = {
                contentType: admincnicphoto.type,
                customMetadata: {
                  fileExtension: admincnicphoto.name.split(".").pop(),
                },
              };
              const staffcnicphotoSnapshot = await storageRef
                .child(`admin/${adminEditForm.aid}/cnicphoto`)
                .put(admincnicphoto, { metadata });
              const URL = await staffcnicphotoSnapshot.ref.getDownloadURL();
              let staffcnicphotoURL = { URL, metadata };
              db.collection("admin").doc(adminEditForm.firebaseId).update({
                admincnicphoto: staffcnicphotoURL,
              });
            });
        } else {
          const metadata = {
            contentType: admincnicphoto.type,
            customMetadata: {
              fileExtension: admincnicphoto.name.split(".").pop(),
            },
          };
          const staffcnicphotoSnapshot = await storageRef
            .child(`admin/${adminEditForm.aid}/cnicphoto`)
            .put(admincnicphoto, { metadata });
          const URL = await staffcnicphotoSnapshot.ref.getDownloadURL();
          let staffcnicphotoURL = { URL, metadata };
          db.collection("admin").doc(adminEditForm.firebaseId).update({
            admincnicphoto: staffcnicphotoURL,
          });
        }
      }

      // admin medicalrecords
      if (
        JSON.stringify(adminEditForm.medicalrecordsphoto) !==
        JSON.stringify(admin.medicalrecordsphoto)
      ) {
        if (admin.medicalrecordsphoto.length !== 0) {
          await firebase
            .storage()
            .refFromURL(admin.medicalrecordsphoto.URL)
            .delete()
            .then(async () => {
              const metadata = {
                contentType: medicalrecordsphoto.type,
                customMetadata: {
                  fileExtension: medicalrecordsphoto.name.split(".").pop(),
                },
              };
              const medicalrecordsphotoSnapshot = await storageRef
                .child(`admin/${adminEditForm.aid}/medicalrecords`)
                .put(medicalrecordsphoto, { metadata });
              const URL =
                await medicalrecordsphotoSnapshot.ref.getDownloadURL();
              let medicalrecordsphotoURL = { URL, metadata };
              db.collection("admin").doc(adminEditForm.firebaseId).update({
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
            .child(`admin/${adminEditForm.aid}/medicalrecords`)
            .put(medicalrecordsphoto, { metadata });
          const URL = await medicalrecordsphotoSnapshot.ref.getDownloadURL();
          let medicalrecordsphotoURL = { URL, metadata };
          db.collection("admin").doc(adminEditForm.firebaseId).update({
            medicalrecordsphoto: medicalrecordsphotoURL,
          });
        }
      }

      // Cv
      if (JSON.stringify(adminEditForm.cv) !== JSON.stringify(admin.cv)) {
        if (admin.cv.length !== 0) {
          await firebase
            .storage()
            .refFromURL(admin.cv.URL)
            .delete()
            .then(async () => {
              const metadata = {
                contentType: cv.type,
                customMetadata: {
                  fileExtension: cv.name.split(".").pop(),
                },
              };
              const cvSnapshot = await storageRef
                .child(`admin/${adminEditForm.aid}/cv`)
                .put(cv, { metadata });
              const URL = await cvSnapshot.ref.getDownloadURL();
              let cvURL = { URL, metadata };
              db.collection("admin").doc(adminEditForm.firebaseId).update({
                cv: cvURL,
              });
            });
        } else {
          const metadata = {
            contentType: cv.type,
            customMetadata: {
              fileExtension: cv.name.split(".").pop(),
            },
          };
          const cvSnapshot = await storageRef
            .child(`admin/${adminEditForm.aid}/cv`)
            .put(cv, { metadata });
          const URL = await cvSnapshot.ref.getDownloadURL();
          let cvURL = { URL, metadata };
          db.collection("admin").doc(adminEditForm.firebaseId).update({
            cv: cvURL,
          });
        }
      }

      // Degree File
      if (
        JSON.stringify(admin.degreefile) !==
        JSON.stringify(adminEditForm.degreefile)
      ) {
        if (admin.degreefile.length !== 0) {
          await firebase
            .storage()
            .refFromURL(admin.degreefile.URL)
            .delete()
            .then(async () => {
              const metadata = {
                contentType: degreefile.type,
                customMetadata: {
                  fileExtension: degreefile.name.split(".").pop(),
                },
              };
              const degreefileSnapshot = await storageRef
                .child(`admin/${adminEditForm.aid}/degreefile`)
                .put(degreefile, { metadata });
              const URL = await degreefileSnapshot.ref.getDownloadURL();
              let degreefileURL = { URL, metadata };
              db.collection("admin").doc(adminEditForm.firebaseId).update({
                degreefile: degreefileURL,
              });
            });
        } else {
          const metadata = {
            contentType: degreefile.type,
            customMetadata: {
              fileExtension: degreefile.name.split(".").pop(),
            },
          };
          const degreefileSnapshot = await storageRef
            .child(`admin/${adminEditForm.aid}/degreefile`)
            .put(degreefile, { metadata });
          const URL = await degreefileSnapshot.ref.getDownloadURL();
          let degreefileURL = { URL, metadata };
          db.collection("admin").doc(adminEditForm.firebaseId).update({
            degreefile: degreefileURL,
          });
        }
      }

      //If Additional files is changed
      if (
        JSON.stringify(adminEditForm.additionaldocuments) !==
        JSON.stringify(admin.additionaldocuments)
      ) {
        let metadata = {};
        //Deleting the previous additional Files
        if (additionaldocuments && additionaldocuments.length !== 0) {
          admin.additionaldocuments.map(async (additionaldocument) => {
            await firebase
              .storage()
              .refFromURL(additionaldocument.URL)
              .delete();
            db.collection("admin")
              .doc(adminEditForm.firebaseId)
              .update({
                additionaldocuments:
                  firebase.firestore.FieldValue.arrayRemove(additionaldocument),
              });
          });
        }
        let additionalFilesURL = [];
        for (var i = 0; i < adminEditForm.additionaldocuments.length; i++) {
          metadata = {
            contentType: additionaldocuments[i].type,
            customMetadata: {
              fileExtension: additionaldocuments[i].name.split(".").pop(),
            },
          };
          const additionaldocumentSnapshot = await storageRef
            .child(
              `admin/${adminEditForm.aid}/additionaldocuments${Number(i) + 1}`
            )
            .put(additionaldocuments[i], { metadata });
          let URL = await additionaldocumentSnapshot.ref.getDownloadURL();
          additionalFilesURL.push({ URL, metadata });
          await db
            .collection("admin")
            .doc(adminEditForm.firebaseId)
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
          src={adminPhotoURL || "/no_profile_picture.jpeg"}
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
            name="adminphoto"
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
              htmlFor="aid"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Admin ID
            </label>
            <input
              type="text"
              id="disabled-input"
              aria-label="disabled input"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 cursor-not-allowed"
              name="aid"
              value={adminEditForm.aid}
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
              value={adminEditForm.firstname}
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
              value={adminEditForm.lastname}
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
              value={adminEditForm.dob.toString().substr(0, 10)}
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
              value={adminEditForm.gender}
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
            value={adminEditForm.address}
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
              value={adminEditForm.phone}
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
              value={adminEditForm.cnic}
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
              value={adminEditForm.email}
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
              value={adminEditForm.education}
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
              value={adminEditForm.institutename}
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
              value={adminEditForm.yearofpass}
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
              id="cgpa"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="cgpa"
              placeholder="-"
              value={adminEditForm.cgpa}
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
              value={adminEditForm.designation}
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
              min={0}
              value={adminEditForm.initsalary}
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
              value={adminEditForm.emergencyname}
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
              value={adminEditForm.emergencyrelationship}
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
              value={adminEditForm.emergencyphone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="title bg-dark  text-center text-white w-100 mt-3 rounded">
          <h5 className="text-white">Authorities</h5>
        </div>

        <div>
          <label
            htmlFor="canmanagesalary"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Manage Salary Records
          </label>
          <select
            id="canmanagesalary"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={adminEditForm.canmanagesalary}
            name="canmanagesalary"
            onChange={handleChange}
          >
            <option value={true}>Yes</option>
            <option value={false}>Two</option>
          </select>
        </div>

        {/* Related Files */}
        <div className="title bg-dark  text-center text-white w-100 mt-3 rounded">
          <h5 className="text-white">Related Documents</h5>
        </div>

        <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-3 mb-1">
          <div>
            <label
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              for="admincnicphoto"
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
              name="admincnicphoto"
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
              for="degreefile"
            >
              Degree
            </label>
            <input
              className={`block w-full text-sm text-gray-900 border-2  rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${
                degreeError ? "border-red-700" : "border-gray-300"
              } `}
              aria-describedby="file_input_help"
              id="file_input"
              type="file"
              name="degreefile"
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

export default AdminEdit;
