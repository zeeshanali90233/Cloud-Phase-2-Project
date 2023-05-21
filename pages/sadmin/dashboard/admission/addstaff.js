import SAdminLayout from "../../../../src/layouts/SAdminLayout";
import React, { useEffect } from "react";
import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../../../../src/Firebase/config";
import { useRouter } from "next/router";
import moment from "moment";
import { organizationDetails } from "../../../../src/Organization/details";

const staffFormInit = {
  staffid: "",
  firstname: "",
  lastname: "",
  cnic: "",
  dob: "",
  gender: "",
  address: "",
  phone: "",
  email: "",
  designation: "",
  initsalary: "",
  education: "",
  institutename: "",
  yearofpass: "",
  emergencyname: "",
  emergencyrelationship: "",
  emergencyphone: "",
  staffphoto: "",
  staffcnicphoto: "",
  medicalrecordsphoto: "",
  additionaldocuments: [],
  assignedrole: [],
  courseauthority: { review: false, add: false, edit: false },
  feesauthority: { review: false, add: false, edit: false },
  studentauthority: { review: false, add: false, edit: false },
};

const authortities = [
  { authorityname: "Students" },
  { authorityname: "Courses" },
  { authorityname: "Fees" },
];

const addstaff = () => {
  const [staffForm, setStaffForm] = useState(staffFormInit);
  const [staffPhotoURL, setStaffPhotoURL] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [profilePictureError, setProfilePictureError] = useState(false);
  const [staffCNICErr, setstaffCNICErr] = useState(false);
  const [medicalRecordError, setMedicalRecordError] = useState(false);
  const [additionalDocError, setAdditionalDocError] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === "staffphoto") {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        setProfilePictureError(true);
        alert("Profile Picture size should not exceed 1MB");
        return;
      }
      setProfilePictureError(false);
      setStaffForm({ ...staffForm, [e.target.name]: e.target.files[0] });
      setStaffPhotoURL(URL.createObjectURL(e.target.files[0]));
    } else if (e.target.name === "staffcnicphoto") {
      if (e.target.files[0].size > 1000000) {
        // 2 MB
        setstaffCNICErr(true);
        alert("File of size > 1mb is not accepted");
        return;
      }
      setstaffCNICErr(false);
      setStaffForm({ ...staffForm, [e.target.name]: e.target.files[0] });
    } else if (e.target.name === "medicalrecordsphoto") {
      if (e.target.files[0].size > 1000000) {
        // 2 MB
        setMedicalRecordError(true);
        alert("File of size > 1mb is not accepted");
        return;
      }
      setMedicalRecordError(false);
      setStaffForm({ ...staffForm, [e.target.name]: e.target.files[0] });
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
      setStaffForm({ ...staffForm, [e.target.name]: e.target.files });
    } else {
      setStaffForm({ ...staffForm, [e.target.name]: e.target.value });
    }
  };

  const staffInputs = [
    {
      id: "staffid",
      name: "staffid",
      label: "Staff ID",
      isRequired: true,
      isSelect: false,
      type: "text",
      isTextArea: false,
      value: staffForm.tid,
      pattern: "[e][a-zA-Z0-9]{4}",
      placeholder: "e0000",
    },
    {
      id: "firstname",
      name: "firstname",
      label: "First Name",
      isRequired: true,
      isSelect: false,
      isTextArea: false,
      type: "text",
      value: staffForm.firstname,
      placeholder: "Zeeshan",
    },
    {
      id: "lastname",
      name: "lastname",
      label: "Last Name",
      isRequired: true,
      isSelect: false,
      isTextArea: false,
      type: "text",
      value: staffForm.lastname,
      placeholder: "Ali",
    },
    {
      id: "dob",
      name: "dob",
      label: "Date of birth",
      isRequired: false,
      isSelect: false,
      isTextArea: false,
      type: "date",
      value: staffForm.dob.toString().substr(0, 10),
      placeholder: "3/6/2023",
    },
    {
      id: "gender",
      name: "gender",
      label: "Gender",
      isRequired: true,
      isSelect: true,
      isTextArea: false,
      value: staffForm.gender,
      placeholder: "3/6/2023",
      options: [
        { value: "", text: "Select Gender" },
        { value: "male", text: "Male" },
        { value: "female", text: "Female" },
        { value: "other", text: "Other" },
      ],
    },

    {
      id: "phone",
      name: "phone",
      label: "Phone",
      isRequired: false,
      isSelect: false,
      isTextArea: false,
      type: "text",
      value: staffForm.phone,
      placeholder: "03xxxxxxxxx",
    },
    {
      id: "email",
      name: "email",
      label: "Email",
      isRequired: false,
      isSelect: false,
      isTextArea: false,
      type: "text",
      value: staffForm.email,
      placeholder: "Email",
    },
    {
      id: "cnic",
      name: "cnic",
      label: "CNIC",
      isRequired: true,
      isSelect: false,
      isTextArea: false,
      type: "text",
      pattern: "[0-9]{5}[0-9]{7}[0-9]" || "[0-9]{5}-[0-9]{7}-[0-9]",
      value: staffForm.cnic,
      placeholder: "CNIC",
    },
  ];

  const qualificationInputs = [
    {
      id: "education",
      name: "education",
      label: "Education",
      isRequired: false,
      isSelect: true,
      isTextArea: false,
      value: staffForm.education,
      placeholder: "Graduated",
      options: [
        { value: "", text: "Select Education Level" },
        { value: "matric", text: "Matric" },
        { value: "intermediate", text: "Intermediate" },
        { value: "graduated", text: "Graduated" },
      ],
    },
    {
      id: "institutename",
      name: "institutename",
      label: "Institute Name",
      isRequired: false,
      isSelect: false,
      isTextArea: false,
      type: "text",
      value: staffForm.institutename,
      placeholder: "IIT,India",
    },
    {
      id: "yearofpass",
      name: "yearofpass",
      label: "Year of passing",
      isRequired: false,
      isSelect: false,
      isTextArea: false,
      type: "date",
      value: staffForm.yearofpass,
      placeholder: "Passing Year",
    },
  ];

  const handleAuthorityChange = (e, authorityname) => {
    e.preventDefault();
    if (authorityname === "Students") {
      setStaffForm({
        ...staffForm,
        studentauthority: {
          ...staffForm.studentauthority,
          [e.target.name]: e.target.checked,
        },
      });
    } else if (authorityname === "Courses") {
      setStaffForm({
        ...staffForm,
        courseauthority: {
          ...staffForm.courseauthority,
          [e.target.name]: e.target.checked,
        },
      });
    } else if (authorityname === "Fees") {
      setStaffForm({
        ...staffForm,
        feesauthority: {
          ...staffForm.feesauthority,
          [e.target.name]: e.target.checked,
        },
      });
    }
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Create a reference to the students collection
    const staffRef = db.collection("staff");
    const salaryref = db.collection("salaries");

    // Checks Whether a user is not already exists
    //Add email and password to firebase auth

    try {
      // Create user with email and password
      const signInMethods = await firebase
        .auth()
        .createUserWithEmailAndPassword(
          `${staffForm.staffid}${organizationDetails.userMailDomain}`,
          organizationDetails.defaultPassword
        );
    } catch (err) {
      setIsSaving(false);
      alert("Staff with same ID already exists");
      return;
    }

    // Taking the files
    const {
      staffphoto,
      staffcnicphoto,
      medicalrecordsphoto,
      additionaldocuments,
    } = staffForm;
    const staffTextForm = staffForm;
    staffTextForm.staffid = staffTextForm.staffid.toLowerCase();
    staffTextForm.staffphoto = "";
    staffTextForm.staffcnicphoto = "";
    staffTextForm.medicalrecordsphoto = "";
    staffTextForm.additionaldocuments = "";
    // Create a storage reference
    const storageRef = firebase.storage().ref();

    let staffphotoURL = "";
    let staffcnicphotoURL = "";
    let medicalrecordsphotoURL = "";

    // Creating due date for the fees receipt in fee collection
    // get the current date
    const today = new Date();
    const dd = String(today.getDate()).padStart(2, "0");
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
    const yyyy = today.getFullYear();
    const currentDate = `${dd}-${mm}-${yyyy}`;

    await staffRef
      .add(staffForm)
      .then(async (doc) => {
        //Upload the files
        if (staffphoto) {
          const metadata = {
            contentType: staffphoto.type,
            customMetadata: {
              fileExtension: staffphoto.name.split(".").pop(),
            },
          };
          const staffphotoSnapshot = await storageRef
            .child(`staff/${staffForm.staffid}/staffphoto`)
            .put(staffphoto, { metadata });
          const URL = await staffphotoSnapshot.ref.getDownloadURL();
          staffphotoURL = { URL, metadata };
        }
        if (staffcnicphoto) {
          const metadata = {
            contentType: staffcnicphoto.type,
            customMetadata: {
              fileExtension: staffcnicphoto.name.split(".").pop(),
            },
          };
          const staffcnicphotoSnapshot = await storageRef
            .child(`staff/${staffForm.staffid}/cnicphoto`)
            .put(staffcnicphoto, { metadata });
          const URL = await staffcnicphotoSnapshot.ref.getDownloadURL();
          staffcnicphotoURL = { URL, metadata };
        }
        if (medicalrecordsphoto) {
          const metadata = {
            contentType: medicalrecordsphoto.type,
            customMetadata: {
              fileExtension: medicalrecordsphoto.name.split(".").pop(),
            },
          };
          const medicalrecordphotoSnapshot = await storageRef
            .child(`staff/${staffForm.staffid}/medicalrecords`)
            .put(medicalrecordsphoto, { metadata });
          const URL = await medicalrecordphotoSnapshot.ref.getDownloadURL();
          medicalrecordsphotoURL = { URL, metadata };
        }
        let additionalFiles = [];
        if (additionaldocuments) {
          let metadata;
          for (var i = 0; i < additionaldocuments.length; i++) {
            metadata = {
              contentType: additionaldocuments[i].type,
              customMetadata: {
                fileExtension: additionaldocuments[i].name.split(".").pop(),
              },
            };
            const additionaldocumentsSnapshot = await storageRef
              .child(`staff/${staffForm.staffid}/additionaldocuments${i + 1}`)
              .put(additionaldocuments[i], { metadata });
            const URL = await additionaldocumentsSnapshot.ref.getDownloadURL();
            additionalFiles.push({ URL, metadata });
          }
        }

        // Salary Receipt
        const salaryReceipt = {
          photoURL: staffphotoURL,
          id: staffForm.staffid,
          name: staffForm.firstname + " " + staffForm.lastname,
          salary: staffForm.initsalary,
          paid: false,
          stafffirebaseid: doc.id,
          date: currentDate,
        };

        // Adding the receipt in the fees collection
        const salaryRef = await salaryref.add(salaryReceipt);

        // update the document with the file URLs
        await staffRef.doc(doc.id).update({
          staffphoto: staffphotoURL,
          staffcnicphoto: staffcnicphotoURL,
          medicalrecordsphoto: medicalrecordsphotoURL,
          additionaldocuments: additionalFiles,
          salaryfirebaseid: salaryRef.id,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });

        setIsSaving(false);
        showSuccessToast()
        // Setting student form to init
        setStaffForm(staffFormInit);
        setStaffPhotoURL("");
      })
      .catch((err) => {
        showErrorToast();
        console.log(err);
        setIsSaving(false);
        return;
      });
  };


  return (
    <SAdminLayout>
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
        <div className="teacherphoto w-100 d-flex justify-content-center mt-2 mb-1">
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
              for="staffphoto"
            >
              Upload Student Photo
            </label>
            <input
              className={`block w-full text-sm text-gray-900 border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none border-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${
                profilePictureError && "border-red-700"
              }`}
              aria-describedby="file_input_help"
              id="staffphoto"
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
            {staffInputs.map((inputData) => {
              return (
                <div>
                  {/* Not Select Dropdown inputs */}
                  {!inputData.isSelect && !inputData.isTextArea && (
                    <div>
                      <label
                        htmlFor={inputData.id}
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {inputData.label}
                        {inputData.isRequired && "*"}
                      </label>
                      <input
                        type={inputData.type}
                        id={inputData.id}
                        aria-label="disabled input"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                        name={inputData.name}
                        pattern={inputData.pattern}
                        value={inputData.value}
                        onChange={handleChange}
                        required={inputData.isRequired}
                      />
                    </div>
                  )}

                  {/* Select Dropdown Inputs */}
                  {inputData.isSelect && (
                    <div>
                      <label
                        htmlFor={inputData.name}
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {inputData.label}
                        {inputData.isRequired && "*"}
                      </label>
                      <select
                        name={inputData.name}
                        id={inputData.name}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        {inputData.options.map((opt) => {
                          return <option value={opt.value}>{opt.text}</option>;
                        })}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}
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
              value={staffForm.address}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="title bg-dark  text-center text-white w-100 mt-3 rounded">
            <h5 className="text-white">Qualification</h5>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
            {qualificationInputs.map((inputData) => {
              return (
                <div>
                  {/* Not Select Dropdown inputs */}
                  {!inputData.isSelect && !inputData.isTextArea && (
                    <div>
                      <label
                        htmlFor={inputData.id}
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {inputData.label}
                        {inputData.isRequired && "*"}
                      </label>
                      <input
                        type={inputData.type}
                        id={inputData.id}
                        aria-label="disabled input"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                        name={inputData.name}
                        pattern={inputData.pattern}
                        value={inputData.value}
                        onChange={handleChange}
                        required={inputData.isRequired}
                      />
                    </div>
                  )}

                  {/* Select Dropdown Inputs */}
                  {inputData.isSelect && (
                    <div>
                      <label
                        htmlFor={inputData.name}
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {inputData.label}
                        {inputData.isRequired && "*"}
                      </label>
                      <select
                        name={inputData.name}
                        id={inputData.name}
                        onChange={handleChange}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                        {inputData.options.map((opt) => {
                          return <option value={opt.value}>{opt.text}</option>;
                        })}
                      </select>
                    </div>
                  )}
                </div>
              );
            })}

            // Designation
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
              placeholder="Coordinator"
              value={staffForm.designation}
              onChange={handleChange}
              required
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
                value={staffForm.emergencyname}
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
                value={staffForm.emergencyrelationship}
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
                value={staffForm.emergencyphone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="title bg-dark  text-center text-white w-100 mt-3 rounded">
            <h5 className="text-white">Authorities Table </h5>
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
                {authortities.map((auth) => {
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
                for="teachercnicphoto"
              >
                CNIC
              </label>
              <input
                className={`block w-full text-sm text-gray-900 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${
                  staffCNICErr && "border-red-700"
                }`}
                aria-describedby="file_input_help"
                id="file_input"
                type="file"
                name="teachercnicphoto"
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
                className={`block w-full text-sm text-gray-900 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${
                  medicalRecordError && "border-red-700"
                }`}
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
                className={`block w-full text-sm text-gray-900 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${
                  additionalDocError && "border-red-700"
                }`}
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
              isSaving ||
              staffCNICErr ||
              profilePictureError ||
              medicalRecordError ||
              additionalDocError
            }
          >
            <span className="bi bi-file-earmark-arrow-up pr-1"></span>

            {isSaving && "Saving.."}
            {!isSaving && "Save"}
          </button>
        </form>
      </div>
    </SAdminLayout>
  );
};

export default addstaff;
