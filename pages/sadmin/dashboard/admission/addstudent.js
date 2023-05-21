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
  totalfees: "",
  other: "",
  noofinstallments: 1,
  courses: [],
  emergencyname: "",
  emergencyrelationship: "",
  emergencyphone: "",
  studentphoto: "",
  studentcnicphoto: "",
  parentcnicphoto: "",
  medicalrecordsphoto: "",
  additionaldocuments: [],
  batch: [],
  assignedtask: [],
  coursesfee: [],
  type: "student",
  enrolleddate: "",
};

const addstudent = () => {
  const [studentForm, setStudentForm] = useState(studentFormInit);
  const [studentPhotoURL, setStudentPhotoURL] = useState(""); //Student Photo URL
  const [isSaving, setIsSaving] = useState(false);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [profilePictureError, setProfilePictureError] = useState(false);
  const [stdCnicError, setStdCnicError] = useState(false);
  const [parentCnicError, setParentCnicError] = useState(false);
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
  const stdInputs = [
    {
      id: "sid",
      name: "sid",
      label: "Student ID",
      isRequired: true,
      isSelect: false,
      type: "text",
      isTextArea: false,
      value: studentForm.sid,
      pattern: "[sS][a-zA-Z0-9]{5}",
      placeholder: "s00001",
    },
    {
      id: "firstname",
      name: "firstname",
      label: "First Name",
      isRequired: true,
      isSelect: false,
      isTextArea: false,
      type: "text",
      value: studentForm.firstname,
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
      value: studentForm.lastname,
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
      value: studentForm.dob.toString().substr(0, 10),
      placeholder: "3/6/2023",
    },
    {
      id: "gender",
      name: "gender",
      label: "Gender",
      isRequired: true,
      isSelect: true,
      isTextArea: false,
      value: studentForm.gender,
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
      value: studentForm.phone,
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
      value: studentForm.email,
      placeholder: "Email",
    },
    {
      id: "cnic",
      name: "cnic",
      label: "CNIC/BForm",
      isRequired: false,
      isSelect: false,
      isTextArea: false,
      type: "text",
      pattern: "[0-9]{5}[0-9]{7}[0-9]" || "[0-9]{5}-[0-9]{7}-[0-9]",
      value: studentForm.cnic,
      placeholder: "CNIC",
    },
    {
      id: "parentname",
      name: "parentname",
      label: "Parent/Guardian Name",
      isRequired: false,
      isSelect: false,
      isTextArea: false,
      type: "text",
      value: studentForm.parentname,
      placeholder: "Parent/Guardian Name",
    },
    {
      id: "parentphone",
      name: "parentphone",
      label: "Parent/Guardian Phone ",
      isRequired: false,
      isSelect: false,
      isTextArea: false,
      type: "text",
      value: studentForm.parentphone,
      placeholder: "Parent/Guardian Phone",
    },
    {
      id: "parentemail",
      name: "parentemail",
      label: "Parent/Guardian Email ",
      isRequired: false,
      isSelect: false,
      isTextArea: false,
      type: "text",
      value: studentForm.parentemail,
      placeholder: "Parent/Guardian Email",
    },
    {
      id: "parentcnic",
      name: "parentcnic",
      label: "Parent/Guardian CNIC ",
      isRequired: false,
      isSelect: false,
      isTextArea: false,
      type: "text",
      pattern: "[0-9]{5}[0-9]{7}[0-9]" || "[0-9]{5}-[0-9]{7}-[0-9]",
      value: studentForm.parentcnic,
      placeholder: "Parent/Guardian CNIC",
    },
  ];

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
        setProfilePictureError(true);
        return;
      }
      setProfilePictureError(false);
      setStudentForm({
        ...studentForm,
        [e.target.name]: e.target.files[0],
      });
      setStudentPhotoURL(URL.createObjectURL(e.target.files[0]));
    } else if (e.target.name === "studentcnicphoto") {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        alert("Student CNIC/BForm File of size > 1mb is not accepted");
        setStdCnicError(true);
        return;
      }
      setStdCnicError(false);
      setStudentForm({
        ...studentForm,
        [e.target.name]: e.target.files[0],
      });
    } else if (e.target.name === "parentcnicphoto") {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        alert("Parent CNIC File of size > 1mb is not accepted");
        setParentCnicError(true);
        return;
      }
      setParentCnicError(false);
      setStudentForm({
        ...studentForm,
        [e.target.name]: e.target.files[0],
      });
    } else if (e.target.name === "medicalrecordsphoto") {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        alert("Medical Record File of size > 1mb is not accepted");
        setMedicalRecordError(true);
        return;
      }
      setMedicalRecordError(false);
      setStudentForm({
        ...studentForm,
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
      setStudentForm({
        ...studentForm,
        [e.target.name]: e.target.files,
      });
    } else {
      setStudentForm({
        ...studentForm,
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
          `${studentForm.sid}${organizationDetails.userMailDomain}`,
          organizationDetails.defaultPassword
        );
    } catch (error) {
      alert("Student with same ID already exists");
      setIsSaving(false);
      return;
    }

    try {
      // Create a reference to the students collection
      const studentsRef = db.collection("students");
      const feesRef = db.collection("fees");
      // Create a storage reference
      const storageRef = firebase.storage().ref();
      // Taking the files from from
      const {
        studentphoto,
        studentcnicphoto,
        parentcnicphoto,
        medicalrecordsphoto,
        additionaldocuments,
      } = studentForm;

      let studentphotoURL = {};
      let parentcnicphotoURL = {};
      let studentcnicphotoURL = {};
      let medicalrecordphotoURL = {};
      let additionalFilesURL = {};

      const studentTextForm = studentForm;
      studentTextForm.sid = studentTextForm.sid.toLowerCase();
      studentTextForm.studentphoto = "";
      studentTextForm.studentcnicphoto = "";
      studentTextForm.parentcnicphoto = "";
      studentTextForm.medicalrecordsphoto = "";
      studentTextForm.additionaldocuments = "";
      // Saving the form text
      const docRef = await db.collection("students").add(studentTextForm);

      //If profile picture is added
      if (studentphoto) {
        const metadata = {
          contentType: studentphoto.type,
          customMetadata: {
            fileExtension: studentphoto.name.split(".").pop(),
          },
        };
        const studentphotoSnapshot = await storageRef
          .child(`students/${studentForm.sid}/studentphoto`)
          .put(studentphoto);
        let URL = await studentphotoSnapshot.ref.getDownloadURL();
        studentphotoURL = { URL, metadata };
      }
      //If CNIC/BFORM FILE is added
      if (studentcnicphoto) {
        const metadata = {
          contentType: studentcnicphoto.type,
          customMetadata: {
            fileExtension: studentcnicphoto.name.split(".").pop(),
          },
        };
        const studentcnicphotoSnapshot = await storageRef
          .child(`students/${studentForm.sid}/studentcnic`)
          .put(studentcnicphoto);
        let URL = await studentcnicphotoSnapshot.ref.getDownloadURL();
        studentcnicphotoURL = { URL, metadata };
      }

      //If Parent cnic file is added
      if (parentcnicphoto) {
        const metadata = {
          contentType: parentcnicphoto.type,
          customMetadata: {
            fileExtension: parentcnicphoto.name.split(".").pop(),
          },
        };

        const parentcnicphotoSnapshot = await storageRef
          .child(`students/${studentForm.sid}/parentcnic`)
          .put(parentcnicphoto);
        let URL = await parentcnicphotoSnapshot.ref.getDownloadURL();
        parentcnicphotoURL = { URL, metadata };
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
          .child(`students/${studentForm.sid}/medicalrecord`)
          .put(medicalrecordsphoto);
        let URL = await medicalrecordphotoSnapshot.ref.getDownloadURL();
        medicalrecordphotoURL = { URL, metadata };
      }

      //If Additional files is added
      if (additionaldocuments) {
        let metadata = {};
        additionalFilesURL = [];
        for (var i = 0; i < studentForm.additionaldocuments.length; i++) {
          metadata = {
            contentType: additionaldocuments[i].type,
            customMetadata: {
              fileExtension: additionaldocuments[i].name.split(".").pop(),
            },
          };
          const additionaldocumentSnapshot = await storageRef
            .child(
              `students/${studentForm.sid}/additionaldocuments${Number(i) + 1}`
            )
            .put(additionaldocuments[i], { metadata });
          let URL = await additionaldocumentSnapshot.ref.getDownloadURL();
          additionalFilesURL.push({ URL, metadata });
        }
      }

      // get the current date in the format dd-mm-yy
      const currentDate = new Date();
      const dateString = currentDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      // update the document with the file URLs plus adding the current date as enrolled date
      await studentsRef.doc(docRef.id).update({
        studentphoto: studentphotoURL,
        studentcnicphoto: studentcnicphotoURL,
        parentcnicphoto: parentcnicphotoURL,
        medicalrecordsphoto: medicalrecordphotoURL,
        additionaldocuments: additionalFilesURL,
        enrolleddate: dateString,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      // Increasing The no of students enrolled of course record and feereceipt
      if (studentForm.courses.length !== 0) {
        // Selected Course
        const selectedCourse = availableCourses.find(
          (course) => course.firebaseId === studentForm.courses[0]
        );
        // Fee Receipt
        const feeReceipt = {
          sid: studentForm.sid,
          name: studentForm.firstname + " " + studentForm.lastname,
          totalfees: Number(studentForm.totalfees) + Number(studentForm.other),
          other: studentForm.other,
          noofinstallments: studentForm.noofinstallments,
          feepaid: 0,
          feeperinstallment: parseInt(
            studentForm.totalfees / studentForm.noofinstallments
          ),
          studentfirebaseid: doc.id,
          coursefirebaseid: studentForm.courses[0],
          coursename: selectedCourse.courseName,
          previousTransactions: [],
          duedate: moment(studentForm.duedate).format("MMM DD, YYYY"),
          remarks: "",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };

        // Adding the receipt in the fees collection
        await feesRef.add(feeReceipt).then(async (feedocRef) => {
          // Adding the receipt in the student record
          await studentsRef.doc(doc.id).update({
            coursesfee: firebase.firestore.FieldValue.arrayUnion(feedocRef.id),
          });

          // Updating the courses record
          await db
            .collection("courses")
            .doc(studentForm.courses[0])
            .update({
              noOfStudents: firebase.firestore.FieldValue.increment(1),
              enrolledStudents: firebase.firestore.FieldValue.arrayUnion(
                doc.id
              ),
              studentsfee: firebase.firestore.FieldValue.arrayUnion(
                feedocRef.id
              ),
            });
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
              className={`block w-full text-sm text-gray-900 border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none border-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${
                profilePictureError && "border-red-700"
              }`}
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
            {stdInputs.map((inputData) => {
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
              value={studentForm.address}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="title bg-dark  text-center text-white w-100 mt-3 rounded">
            <h5 className="text-white">Course</h5>
          </div>
          {/* Course Select */}
          <div className="mt-3">
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
                  htmlFor="totalfees"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Total Fees*
                </label>
                <input
                  type="text"
                  id="totalfees"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="totalfees"
                  min={0}
                  value={studentForm.totalfees}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="noofinstallments"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  No of Installment*
                </label>
                <input
                  type="text"
                  id="noofinstallments"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="noofinstallments"
                  min={1}
                  value={studentForm.noofinstallments}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="other"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Other PKR
                </label>
                <input
                  type="text"
                  id="other"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="other"
                  min={0}
                  value={studentForm.other}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label
                  htmlFor="duedate"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Due Date*
                </label>
                <input
                  type="date"
                  id="duedate"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  name="duedate"
                  value={studentForm.duedate}
                  onChange={handleChange}
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
                value={studentForm.emergencyname}
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
                value={studentForm.emergencyrelationship}
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
                value={studentForm.emergencyphone}
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
                className={`block w-full text-sm text-gray-900 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${
                  stdCnicError && "border-red-700"
                }`}
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
                className={`block w-full text-sm text-gray-900 border-2 border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 ${
                  parentCnicError && "border-red-700"
                }`}
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
              stdCnicError ||
              profilePictureError ||
              parentCnicError ||
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

export default addstudent;
