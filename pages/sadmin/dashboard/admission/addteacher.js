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





const addteacher = () => {
  const [teacherForm, setTeacherForm] = useState(teacherFormInit);
  const [teacherPhotoURL, setTeacherPhotoURL] = useState(""); //Student Photo URL
  const [isSaving, setIsSaving] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [profilePictureError, setProfilePictureError] = useState(false);
  const [teacherCNICErr, setTeacherCNICErr] = useState(false);
  const [teacherCvErr, setTeacherCvErr] = useState(false);
  const [teacherDegErr, setTeacherDegError] = useState(false);
  const [medicalRecordError, setMedicalRecordError] = useState(false);
  const [additionalDocError, setAdditionalDocError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = () => {
      db.collection("courses").onSnapshot((snapshot) => {
        let data = [];

        snapshot.forEach((doc) => {
          data.push({ ...doc.data(), firebaseId: doc.id });
        });
        setAvailableCourses(data);
      });
    };

    fetchCourses();
  }, [router.query]);
  
  const teacherInputs = [
    {
      id: "tid",
      name: "tid",
      label: "Teacher ID",
      isRequired: true,
      isSelect: false,
      type: "text",
      isTextArea: false,
      value: teacherForm.tid,
      pattern:"[tT][a-zA-Z0-9]{4}",
      placeholder: "t0000",
    },
    {
      id: "firstname",
      name: "firstname",
      label: "First Name",
      isRequired: true,
      isSelect: false,
      isTextArea: false,
      type: "text",
      value: teacherForm.firstname,
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
      value: teacherForm.lastname,
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
      value: teacherForm.dob.toString().substr(0, 10),
      placeholder: "3/6/2023",
    },
    {
      id: "gender",
      name: "gender",
      label: "Gender",
      isRequired: true,
      isSelect: true,
      isTextArea: false,
      value: teacherForm.gender,
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
      value: teacherForm.phone,
      placeholder: "Phone",
    },
    {
      id: "email",
      name: "email",
      label: "Email",
      isRequired: false,
      isSelect: false,
      isTextArea: false,
      type: "text",
      value: teacherForm.email,
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
      value: teacherForm.cnic,
      placeholder: "CNIC",
    },
  ];

  const qualificationInputs=[
    {
      id: "degree",
      name: "degree",
      label: "Degree",
      isRequired: false,
      isSelect: false,
      isTextArea: false,
      type: "text",
      value: teacherForm.degree,
      placeholder: "Degree",
    },
    {
      id: "institutename",
      name: "institutename",
      label: "Institute Name",
      isRequired: false,
      isSelect: false,
      isTextArea: false,
      type: "text",
      value: teacherForm.institutename,
      placeholder: "IIT,India",
    },
    {
      id: "passingyear",
      name: "passingyear",
      label: "Passing Year",
      isRequired: false,
      isSelect: false,
      isTextArea: false,
      type: "date",
      value: teacherForm.passingyear,
      placeholder: "Passing Year",
    },
    {
      id: "obtgpa",
      name: "obtgpa",
      label: "Obtained CGPA",
      isRequired: false,
      isSelect: false,
      isTextArea: false,
      type: "text",
      value: teacherForm.obtgpa,
      placeholder: "Obtained CGPA",
    }
  ]

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
    if (e.target.name === "teacherphoto") {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        alert("Profile Picture size should not exceed 1MB");
        setProfilePictureError(true);
        return;
      }
      setProfilePictureError(false);
      setTeacherForm({
        ...teacherForm,
        [e.target.name]: e.target.files[0],
      });
      setTeacherPhotoURL(URL.createObjectURL(e.target.files[0]));
    } else if (e.target.name === "teachercnicphoto") {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        alert("Teacher CNIC File of size > 1mb is not accepted");
        setTeacherCNICErr(true);
        return;
      }
      setTeacherCNICErr(false);
      setTeacherForm({
        ...teacherForm,
        [e.target.name]: e.target.files[0],
      });
    } else if (e.target.name === "degreefile") {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        alert("Degree File of size > 1mb is not accepted");
        setTeacherDegError(true);
        return;
      }
      setTeacherDegError(false);
      setTeacherForm({
        ...teacherForm,
        [e.target.name]: e.target.files[0],
      });
    }
    else if (e.target.name === "cv") {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        alert("Degree File of size > 1mb is not accepted");
        setTeacherCvErr(true);
        return;
      }
      setTeacherCvErr(false);
      setTeacherForm({
        ...teacherForm,
        [e.target.name]: e.target.files[0],
      });
    }
    else if (e.target.name === "medicalrecordsphoto") {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        alert("Medical Record File of size > 1mb is not accepted");
        setMedicalRecordError(true);
        return;
      }
      setMedicalRecordError(false);
      setTeacherForm({
        ...teacherForm,
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
      setTeacherForm({
        ...teacherForm,
        [e.target.name]: e.target.files,
      });
    } else {
      setTeacherForm({
        ...teacherForm,
        [e.target.name]: e.target.value,
      });
    }
  };


    //Funtion to save the changes
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSaving(true);
  
        // Checks Whether a user is not already exists
    //Add email and password to firebase auth

    try {
      const signInMethods = await firebase
        .auth()
        .createUserWithEmailAndPassword(
          `${teacherForm.tid}${organizationDetails.userMailDomain}`,
          organizationDetails.defaultPassword
        );
    } catch (err) {
      alert("Teacher with same ID already exists");
      setIsSaving(false);
      return;
    }


      try {
        // Create a reference to the students collection
        const teacherRef = db.collection("teachers");
        // Create a storage reference
        const storageRef = firebase.storage().ref();
        // Taking the files from from
        const {
          teacherphoto,
          teachercnicphoto,
          degreefile,
          cv,
          medicalrecordsphoto,
          additionaldocuments,
        } = teacherForm;
  
        let teacherPhotoURL = {};
        let teachercnicphotoURL = {};
        let degreefileURL = {};
        let cvURL = {};
        let medicalrecordphotoURL = {};
        let additionalFilesURL = {};
  
        const teacherTextForm = teacherForm;
        teacherTextForm.tid = teacherTextForm.tid.toLowerCase();
        teacherTextForm.teacherphoto = "";
        teacherTextForm.teachercnicphoto = "";
        teacherTextForm.degreefile = "";
        teacherTextForm.cv = "";
        teacherTextForm.medicalrecordsphoto = "";
        teacherTextForm.additionaldocuments = "";
        // Saving the form text
        const docRef = await teacherRef.add(teacherTextForm);
  
        //If profile picture is added
        if (teacherphoto) {
          const metadata = {
            contentType: teacherphoto.type,
            customMetadata: {
              fileExtension: teacherphoto.name.split(".").pop(),
            },
          };
          const teacherphotoSnapshot = await storageRef
            .child(`teacher/${teacherForm.tid}/teacherphoto`)
            .put(teacherphoto);
          let URL = await teacherphotoSnapshot.ref.getDownloadURL();
          teacherPhotoURL = { URL, metadata };
        }
        //If CNIC FILE is added
        if (teachercnicphoto) {
          const metadata = {
            contentType: teachercnicphoto.type,
            customMetadata: {
              fileExtension: teachercnicphoto.name.split(".").pop(),
            },
          };
          const teachercnicphotoSnapshot = await storageRef
            .child(`teacher/${teacherForm.tid}/teachercnic`)
            .put(teachercnicphoto);
          let URL = await teachercnicphotoSnapshot.ref.getDownloadURL();
          teachercnicphotoURL = { URL, metadata };
        }
        //If Degree FILE is Degree
        if (degreefile) {
          const metadata = {
            contentType: degreefile.type,
            customMetadata: {
              fileExtension: degreefile.name.split(".").pop(),
            },
          };
          const teacherdegreeSnapshot = await storageRef
            .child(`teacher/${teacherForm.tid}/degree`)
            .put(degreefile);
          let URL = await teacherdegreeSnapshot.ref.getDownloadURL();
          degreefileURL = { URL, metadata };
        }
        //If CV FILE is Degree
        if (cv) {
          const metadata = {
            contentType: cv.type,
            customMetadata: {
              fileExtension: cv.name.split(".").pop(),
            },
          };
          const teachercvSnapshot = await storageRef
            .child(`teacher/${teacherForm.tid}/cv`)
            .put(degreefile);
          let URL = await teachercvSnapshot.ref.getDownloadURL();
          cvURL = { URL, metadata };
        }
  
        //If Medical Record file is added
        if (medicalrecordsphoto) {
          const metadata = {
            contentType: medicalrecordsphoto.type,
            customMetadata: {
              fileExtension: medicalrecordsphoto.name.split(".").pop(),
            },
          };
  
          const medicalrecordphotoSnapshot = await storageRef
            .child(`teacher/${teacherForm.tid}/medicalrecord`)
            .put(medicalrecordsphoto);
          let URL = await medicalrecordphotoSnapshot.ref.getDownloadURL();
          medicalrecordphotoURL = { URL, metadata };
        }
  
        //If Additional files is added
        if (additionaldocuments) {
          let metadata = {};
          additionalFilesURL = [];
          for (var i = 0; i < teacherForm.additionaldocuments.length; i++) {
            metadata = {
              contentType: additionaldocuments[i].type,
              customMetadata: {
                fileExtension: additionaldocuments[i].name.split(".").pop(),
              },
            };
            const additionaldocumentSnapshot = await storageRef
              .child(
                `teacher/${teacherForm.tid}/additionaldocuments${Number(i) + 1}`
              )
              .put(additionaldocuments[i], { metadata });
            let URL = await additionaldocumentSnapshot.ref.getDownloadURL();
            additionalFilesURL.push({ URL, metadata });
          }
        }
  

          // Fee Receipt
          const salaryReceipt = {
            photoURL: teacherPhotoURL,
            id: teacherForm.tid,
            name: teacherForm.firstname + " " + teacherForm.lastname,
            salary: teacherForm.initsalary,
            paid: false,
            teacherfirebaseid: doc.id,
            date: currentDate,
          };

           // Adding the receipt in the fees collection
        const salaryRef = await db.collection("salaries").add(salaryReceipt);

        // update the document with the file URLs
        await teacherRef.doc(doc.id).update({
          teacherphoto: teacherPhotoURL,
          teachercnicphoto: teachercnicphotoURL,
          medicalrecordsphoto: medicalrecordphotoURL,
          additionaldocuments: additionalFilesURL,
          cv: cvURL,
          degreefile: degreeURL,
          salaryfirebaseid: salaryRef.id,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });


        if (teacherForm.courses.length !== 0) {
          db.collection("courses").doc(teacherForm.courses[0]).update({
            courseInstructorId: doc.id,
          });
        }

        setIsSaving(false);
        showSuccessToast();
      } catch (err) {
        setIsSaving(false);
        showErrorToast();
      }
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
              Upload Student Photo
            </label>
            <input
              className={`block w-full text-sm text-gray-900 border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none border-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${(profilePictureError)&&"border-red-700"}`}
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
            {teacherInputs.map((inputData) => {
              return (
                <div>
                  {/* Not Select Dropdown inputs */}
                  {!(inputData.isSelect) && !(inputData.isTextArea) && (
                    <div>
                      <label
                        htmlFor={inputData.id}
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {inputData.label}{inputData.isRequired&&"*"}
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
                        {inputData.label}{inputData.isRequired&&"*"}
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
              value={teacherForm.address}
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
                  {!(inputData.isSelect) && !(inputData.isTextArea) && (
                    <div>
                      <label
                        htmlFor={inputData.id}
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        {inputData.label}{inputData.isRequired&&"*"}
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
                </div>
              );
            })}
          </div>

          <div className="title bg-dark  text-center text-white w-100 mt-3 rounded">
            <h5 className="text-white">Courses</h5>
          </div>
          {/* Course Select */}
          <div className="mt-2">
            <div>
              <select
                name="courses"
                id="courses"
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                required
              >
                <option value="" selected>
                  Select Course
                </option>
                {availableCourses.map((course) => {
                  return (
                    <option value={course.firebaseId} key={course.firebaseId}>
                      {course.courseName}({course.courseId})
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label
                  htmlFor="designation"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Designation*
                </label>
                <input
                  type="text"
                  id="designation"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="designation"
                  min={0}
                  value={teacherForm.designation}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="doj"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                 Date of joining
                </label>
                <input
                  type="date"
                  id="doj"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="doj"
                  min={1}
                  value={teacherForm.doj}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="initsalary"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Salary*
                </label>
                <input
                  type="text"
                  id="initsalary"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="initsalary"
                  min={0}
                  value={teacherForm.initsalary}
                  onChange={handleChange}
                  required
                />
              </div>
            
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
                value={teacherForm.emergencyname}
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
                value={teacherForm.emergencyrelationship}
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
                value={teacherForm.emergencyphone}
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
                className={`block w-full text-sm text-gray-900 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${(teacherCNICErr)&&"border-red-700"}`}
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
                for="degreefile"
              >
                Degree
              </label>
              <input
                className={`block w-full text-sm text-gray-900 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${(teacherDegErr)&&"border-red-700"}`}
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
                className={`block w-full text-sm text-gray-900 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${(teacherCvErr)&&"border-red-700"}`}
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
                for="medicalrecordsphoto"
              >
                Medical Records
              </label>
              <input
                className={`block w-full text-sm text-gray-900 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${(medicalRecordError)&&"border-red-700"}`}
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
                className={`block w-full text-sm text-gray-900 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${(additionalDocError)&&"border-red-700"}`}
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
            disabled={isSaving || teacherCNICErr ||profilePictureError || teacherDegErr ||teacherCvErr || medicalRecordError || additionalDocError} 
          >
            <span className="bi bi-file-earmark-arrow-up pr-1"></span>

            {isSaving && "Saving.."}
            {!isSaving && "Save"}
          </button>
        </form>
      </div>
    </SAdminLayout>
  )
}

export default addteacher
