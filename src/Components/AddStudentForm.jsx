import React from "react";
import emptyProfile from "../Assets/Images/no_profile_picture.jpeg";
import "../Css/AddStudentForm.css";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { db } from "../Firebase/config";
import { useState, useEffect, useRef } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { styled } from "@mui/system";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import moment from "moment";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { organizationDetails } from "../Organization/details";


const SuccessAlert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SaveButton = styled(LoadingButton)({
  backgroundColor: "#00233a",
  "&:hover": {
    backgroundColor: "#393c41",
    color: "white",
  },
});

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
  other:"",
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
const AddStudentForm = () => {
  const [studentForm, setStudentForm] = useState(studentFormInit);
  const [studentPhotoURL, setStudentPhotoURL] = useState(""); //Student Photo URL
  const [isSaving, setIsSaving] = useState(false); //Is Form saving
  const [availableCourses, setAvailableCourses] = useState([]);
  const formRef = useRef(null);
  const coursesRef=useRef(null);

  // Alert
  const [alertState, setAlertState] = React.useState({
    successOpen: false,
    errorOpen:false,
    vertical: "top",
    horizontal: "right",
  });
  const { vertical, horizontal, successOpen ,errorOpen} = alertState;
  // For Alert Toast
  const handleSuccessClick = () => {
    setAlertState({ ...alertState, successOpen: true });
  };
  const handleErrorClick = () => {
    setAlertState({ ...alertState, errorOpen: true });
  };
  const handleAlertClose = () => {
    setAlertState({ ...alertState, successOpen: false ,errorOpen});
  };


  const [profilePictureError, setProfilePictureError] = useState(false);
  const [cnicError, setCnicError] = useState(false);
  const [medicalRecordError, setMedicalRecordError] = useState(false);
  const [additionalDocError, setAdditionalDocError] = useState(false);
  useEffect(() => {
    const fetchData = () => {
      db.collection("courses").onSnapshot((snapshot) => {
        let data = [];

        snapshot.forEach((doc) => {
          data.push({ ...doc.data(), firebaseId: doc.id });
        });
        setAvailableCourses(data);
      });
    };

    fetchData();
  }, []);


  const handleChange = (e) => {
    if (e.target.name === "studentphoto") {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        setProfilePictureError(true);
        alert("Profile Picture size should not exceed 1MB");
        return;
      }
      setProfilePictureError(false);
      setStudentForm({ ...studentForm, [e.target.name]: e.target.files[0] });
      setStudentPhotoURL(URL.createObjectURL(e.target.files[0]));
    } else if (
      e.target.name === "studentcnicphoto" ||
      e.target.name === "parentcnicphoto" ||
      e.target.name === "medicalrecordsphoto"
    ) {
      if (e.target.files[0].size > 1000000) {
        // 1 MB
        setCnicError(true);
        setMedicalRecordError(true);
        alert("File of size > 1mb is not accepted");
        return;
      }

      setCnicError(false);
      setMedicalRecordError(false);
      setStudentForm({ ...studentForm, [e.target.name]: e.target.files[0] });
    } else if (e.target.name === "additionaldocuments") {
      // Additional Files Size
      const files = e.target.files;
      let totalSize = 0;
      for (let i = 0; i < files.length; i++) {
        totalSize += files[i].size;
      }
      if (totalSize > 1000000) {
        // 1 MB
        setAdditionalDocError(true);
        alert("Additional files size should not exceed 1MB");
        return;
      }
      setAdditionalDocError(false);
      setStudentForm({ ...studentForm, [e.target.name]: e.target.files });
    } else if (e.target.name === "courses") {
      const newForm = studentForm;
      newForm.courses = e.target.value === "" ? [] : [e.target.value];
      const selectedCourse = availableCourses.find(
        (course) => course.firebaseId === e.target.value
      );
      newForm.batch =
        e.target.value === "" ? [] : [selectedCourse.courseName];
      setStudentForm(newForm);
    } else {
      setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Create a reference to the students collection
    const studentsRef = db.collection("students");
    const feesRef = db.collection("fees");

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

    // Taking the files from from
    const {
      studentphoto,
      studentcnicphoto,
      parentcnicphoto,
      medicalrecordsphoto,
      additionaldocuments,
    } = studentForm;
    const studentTextForm = studentForm;
    studentTextForm.sid = studentTextForm.sid.toLowerCase();
    studentTextForm.studentphoto = "";
    studentTextForm.studentcnicphoto = "";
    studentTextForm.parentcnicphoto = "";
    studentTextForm.medicalrecordsphoto = "";
    studentTextForm.additionaldocuments = "";
    // Create a storage reference
    const storageRef = firebase.storage().ref();

    let studentphotoURL = "";
    let studentcnicphotoURL = "";
    let parentcnicphotoURL = "";
    let medicalrecordsphotoURL = "";

    // Creating due date for the fees receipt in fee collection
    var currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + 7);

    await studentsRef
      .add(studentTextForm)
      .then(async (doc) => {
        //Upload the files
        if (studentphoto) {
          const metadata = {
            contentType: studentphoto.type,
            customMetadata: {
              fileExtension: studentphoto.name.split(".").pop(),
            },
          };
          const studentphotoSnapshot = await storageRef
            .child(`students/${studentTextForm.sid}/studentphoto`)
            .put(studentphoto, { metadata });
          let URL = await studentphotoSnapshot.ref.getDownloadURL();
          studentphotoURL = { URL, metadata };
        }
        if (studentcnicphoto) {
          const metadata = {
            contentType: studentcnicphoto.type,
            customMetadata: {
              fileExtension: studentcnicphoto.name.split(".").pop(),
            },
          };
          const studentcnicphotoSnapshot = await storageRef
            .child(`students/${studentTextForm.sid}/studentcnic`)
            .put(studentcnicphoto, { metadata });
          const URL = await studentcnicphotoSnapshot.ref.getDownloadURL();
          studentcnicphotoURL = { URL, metadata };
        }
        if (parentcnicphoto) {
          const metadata = {
            contentType: parentcnicphoto.type,
            customMetadata: {
              fileExtension: parentcnicphoto.name.split(".").pop(),
            },
          };

          const parentcnicphotoSnapshot = await storageRef
            .child(`students/${studentTextForm.sid}/parentcnic`)
            .put(parentcnicphoto, { metadata });
          const URL = await parentcnicphotoSnapshot.ref.getDownloadURL();
          parentcnicphotoURL = { URL, metadata };
        }
        if (medicalrecordsphoto) {
          const metadata = {
            contentType: medicalrecordsphoto.type,
            customMetadata: {
              fileExtension: medicalrecordsphoto.name.split(".").pop(),
            },
          };
          const medicalrecordphotoSnapshot = await storageRef
            .child(`students/${studentTextForm.sid}/medicalrecord`)
            .put(medicalrecordsphoto, { metadata });
          const URL = await medicalrecordphotoSnapshot.ref.getDownloadURL();
          medicalrecordsphotoURL = { URL, metadata };
        }
        let additionalFiles = [];
        if (additionaldocuments) {
          let metadata = {};
          for (var i = 0; i < additionaldocuments.length; i++) {
            metadata = {
              contentType: additionaldocuments[i].type,
              customMetadata: {
                fileExtension: additionaldocuments[i].name.split(".").pop(),
              },
            };
            const additionaldocumentsSnapshot = await storageRef
              .child(
                `students/${studentTextForm.sid}/additionaldocument${i + 1}`
              )
              .put(additionaldocuments[i], { metadata });
            let URL = await additionaldocumentsSnapshot.ref.getDownloadURL();
            additionalFiles.push({ URL, metadata });
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
        await studentsRef.doc(doc.id).update({
          studentphoto: studentphotoURL,
          studentcnicphoto: studentcnicphotoURL,
          parentcnicphoto: parentcnicphotoURL,
          medicalrecordsphoto: medicalrecordsphotoURL,
          additionaldocuments: additionalFiles,
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
            totalfees: Number(studentForm.totalfees)+Number(studentForm.other),
            other:studentForm.other,
            noofinstallments: studentForm.noofinstallments,
            feepaid: 0,
            feeperinstallment: parseInt(
              studentForm.totalfees / studentForm.noofinstallments
            ),
            studentfirebaseid: doc.id,
            coursefirebaseid: studentForm.courses[0],
            coursename: selectedCourse.courseName,
            previousTransactions:[],
            duedate: moment(studentForm.duedate).format("MMM DD, YYYY"),
            remarks: "",
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          };

          // Adding the receipt in the fees collection
          await feesRef.add(feeReceipt).then(async (feedocRef) => {
            // Adding the receipt in the student record
            await studentsRef.doc(doc.id).update({
              coursesfee: firebase.firestore.FieldValue.arrayUnion(
                feedocRef.id
              ),
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
                )
              });
          });
        }

        setIsSaving(false);
        handleSuccessClick();
        // Setting student form to init
        formRef.current.reset();
        coursesRef.current.blur();
        coursesRef.current.value = '';
        setStudentPhotoURL("");
        setStudentForm(studentFormInit);
       
      })
      .catch((err) => {
        console.log(err);
        handleErrorClick();
        setIsSaving(false);
        return;
      });
  };

  return (
    <div className="add-student-form container mt-2 w-100 ">
       {/* Success Alert */}
       <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={successOpen}
        onClose={handleAlertClose}
        autoHideDuration={1500}
        key={"topSuccessRight"}
      >
        <SuccessAlert
          onClose={handleAlertClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Successfully Added
        </SuccessAlert>
      </Snackbar>
      {/* Error Alert */}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={errorOpen}
        onClose={handleAlertClose}
        autoHideDuration={1500}
        key={"topErrorRight"}
      >
        <SuccessAlert
          onClose={handleAlertClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Something Went Wrong
        </SuccessAlert>
      </Snackbar>
      <div>
        <h2 className="text-center">Student Admission Form</h2>
      </div>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        ref={formRef}
        autoComplete="off"
      >
        {/* Student Photo */}
        <div className=" d-flex justify-content-center me-auto">
          <div>
            <img
              src={studentPhotoURL === "" ? emptyProfile : studentPhotoURL}
              alt="studentPicture "
              width={130}
            />
          </div>
        </div>

        <div className="row mt-2">
        <span className="required">Max Size: 1MB</span>
          <div className="input-group mb-3">
            <input
              type="file"
              className="form-control"
              id="studentphoto"
              name="studentphoto"
              onChange={(e) => {
                handleChange(e);
              }}
            ></input>
          </div>
        </div>
        {/* Main Student Information */}
        <div className="row">
          <div className="d-flex flex-column col">
            <TextField
              id="outlined-basic"
              label="Student ID"
              variant="outlined"
              name="sid"
              inputProps={{
                pattern: "[sS][a-zA-Z0-9]{5}",
              }}
              title="The input should start with 's' or 'S' followed by 4 characters that can be either letters or numbers."
              placeholder="s10000"
              value={studentForm.sid}
              onChange={(e) => {
                handleChange(e);
              }}
              required
            />
          </div>
        </div>
        <div className="row mt-2">
          <div className="d-flex flex-column col">
            <TextField
              id="outlined-basic"
              label="First Name"
              variant="outlined"
              type="text"
              name="firstname"
              placeholder="Mukesh"
              className="rounded "
              value={studentForm.firstname}
              onChange={(e) => {
                handleChange(e);
              }}
              required
            />
          </div>

          <div className="d-flex flex-column col">
            <TextField
              id="outlined-basic"
              label="Last Name"
              variant="outlined"
              type="text"
              name="lastname"
              placeholder="khan"
              className="rounded "
              value={studentForm.lastname}
              onChange={(e) => {
                handleChange(e);
              }}
              required
            />
          </div>
        </div>
        <div className="row">
          <div className="d-flex flex-column col">
            <label htmlFor="">Date Of Birth</label>
            <TextField
              id="outlined-basic"
              variant="outlined"
              type="date"
              name="dob"
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
          <div className="d-flex flex-column col">
            <InputLabel id="demo-simple-select-helper-label">
              Gender *
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              name="gender"
              className="py-1 px-2 rounded "
              value={studentForm.gender}
              onChange={(e) => {
                handleChange(e);
              }}
              required
            >
              <MenuItem value={"male"}>Male</MenuItem>
              <MenuItem value={"female"}>Female</MenuItem>
              <MenuItem value={"other"}>Other</MenuItem>
            </Select>
          </div>
        </div>

        <div className="d-flex flex-column ">
          <label htmlFor="address">
            Address:
          </label>
          <textarea
            type="text"
            id="address"
            name="address"
            placeholder="street#2 washington, America "
            className="py-1 px-2 rounded "
            value={studentForm.address}
            onChange={(e) => {
              handleChange(e);
            }}
          ></textarea>
        </div>
        <div className="row mt-3">
          <div className="d-flex flex-column col">
            <TextField
              id="outlined-basic"
              label="Phone Number"
              variant="outlined"
              type="tel"
              name="phone"
              placeholder="03xxxxxxxxx"
              inputProps={{
                pattern: "[0-9]{11}",
              }}
              value={studentForm.phone}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
          <div className="d-flex flex-column col">
            <TextField
              id="outlined-basic"
              label="Email"
              variant="outlined"
              type="email"
              name="email"
              value={studentForm.email}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
        </div>
        <div className="row mt-3">
          <div className="d-flex flex-column col">
            <TextField
              id="outlined-basic"
              label="CNIC/B-Form"
              variant="outlined"
              type="text"
              name="cnic"
              placeholder="xxxxxxxxxxxxx"
              inputProps={{
                pattern: "[0-9]{5}[0-9]{7}[0-9]",
              }}
              value={studentForm.cnic}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
        </div>
        {/* Parent/gaurdian information */}
        <div className="mt-2">
          <h3 className="text-center">Parent/Guardian Contact Form</h3>
          <div className="row">
            <div className="d-flex flex-column col">
              <TextField
                id="outlined-basic"
                label="Name"
                variant="outlined"
                type="text"
                name="parentname"
                placeholder="Ali"
                value={studentForm.parentname}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
            <div className="d-flex flex-column col">
              <TextField
                id="outlined-basic"
                label="Phone Number"
                variant="outlined"
                type="tel"
                name="parentphone"
                placeholder="03xxxxxxxxx"
                value={studentForm.parentphone}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
          </div>
          <div className="row mt-3">
            <div className="d-flex flex-column col">
              <TextField
                id="outlined-basic"
                label="Email"
                variant="outlined"
                type="email"
                name="parentemail"
                value={studentForm.parentemail}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
            <div className="d-flex flex-column col">
              <TextField
                id="outlined-basic"
                label="Parent CNIC"
                variant="outlined"
                type="text"
                name="parentcnic"
                placeholder="xxxxxxxxxxxxx"
                pattern="[0-9]{5}[0-9]{7}[0-9]"
                value={studentForm.parentcnic}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
          </div>
        </div>
        {/* Enrollment Form */}
        <div className="mt-2">
          <h3 className="text-center">Enrollment Form</h3>
          <div className="row">
            <div className="d-flex flex-column col">
              <InputLabel id="demo-simple-select-helper-label">
                Select Course *
              </InputLabel>
              <select
                name="courses"
                id="courses"
                className="px-2 py-3 rounded"
                ref={coursesRef}
                value={studentForm.courses[0] && studentForm.courses[0].length===0?"":studentForm.courses[0]}
                onChange={(e) => {
                  handleChange(e);
                }}
                defaultValue={""}
                required
              >
                <option value="" defaultChecked >
                  <em>None</em>
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
          </div>
          <div className="row mt-3">
            <div className="d-flex flex-column col">
              <TextField
                id="outlined-basic"
                label="Total Fees"
                variant="outlined"
                type="number"
                name="totalfees"
                placeholder="2900"
                inputProps={{ min: 0 }}
                value={studentForm.totalfees}
                onChange={(e) => {
                  handleChange(e);
                }}
                required
              />
            </div>
            <div className="d-flex flex-column col">
              <TextField
                id="outlined-basic"
                label="No of Installments"
                variant="outlined"
                type="number"
                name="noofinstallments"
                placeholder="1"
                inputProps={{ min: 1 }} 
                value={studentForm.noofinstallments}
                onChange={(e) => {
                  handleChange(e);
                }}
                required
              />
            </div>
          </div>
          <div className="row mt-3">
            <label htmlFor="duedate">Other PKR</label>
            {/* Due Date */}
            <div className="d-flex flex-column col mt-2">
              <TextField
                id="outlined-basic"
                type="text"
                name="other"
                value={studentForm.other}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
            <label htmlFor="duedate">DueDate *</label>
            {/* Due Date */}
            <div className="d-flex flex-column col mt-2">
              <TextField
                id="outlined-basic"
                type="date"
                name="duedate"
                value={studentForm.duedate}
                onChange={(e) => {
                  handleChange(e);
                }}
                required
              />
            </div>
          </div>
        </div>
        {/* Emergency Contact Section */}
        <div className="mt-2">
          <h3 className="text-center">Emergency Contact Form</h3>
          <div className="row">
            <div className="d-flex flex-column col">
              <TextField
                id="outlined-basic"
                label="Name"
                variant="outlined"
                type="text"
                name="emergencyname"
                placeholder="Andaleep"
                value={studentForm.emergencyname}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
            <div className="d-flex flex-column col">
              <TextField
                id="outlined-basic"
                label="Relationship"
                variant="outlined"
                type="text"
                name="emergencyrelationship"
                placeholder="brother"
                value={studentForm.emergencyrelationship}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
          </div>
        </div>
        <div className="row mt-3">
          <div className="d-flex flex-column col">
            <TextField
              id="outlined-basic"
              label="Phone Number"
              variant="outlined"
              type="tel"
              name="emergencyphone"
              placeholder="03xxxxxxxxx"
              value={studentForm.emergencyphone}
              onChange={(e) => {
                handleChange(e);
              }}
            />
          </div>
        </div>

        {/* Related Documents */}
        <div className="mt-1">
          <h3 className="text-center">Related Documents</h3>
          <div className="row">
            <div className="col">
              <label htmlFor="studentcnic">
                CNIC/B-Form:
              </label>
              <input
                type="file"
                id="studentcnic"
                name="studentcnicphoto"
                onChange={(e) => {
                  handleChange(e);
                }}
              ></input>
            </div>
            <div className="col">
              <label htmlFor="parentcnic">
                Parent CNIC:
              </label>
              <input
                type="file"
                id="parentcnic"
                name="parentcnicphoto"
                onChange={(e) => {
                  handleChange(e);
                }}
              ></input>
            </div>

            <div className="col">
              <label htmlFor="medical-records">Medical Records:</label>
              <input
                type="file"
                id="medical-records"
                name="medicalrecordsphoto"
                onChange={(e) => {
                  handleChange(e);
                }}
              ></input>
            </div>
          </div>
          <div className="row mt-1 text-center">
            <div className="col">
              <label htmlFor="additional-documents">
                Additional Documents:
              </label>
              <input
                type="file"
                id="additional-documents"
                name="additionaldocuments"
                onChange={(e) => {
                  handleChange(e);
                }}
                multiple
              ></input>
            </div>
          </div>
          <span className="required">Max File Size:1MB</span>
        </div>
        <div className="row mb-5 mt-3 ">
          <div className="d-flex justify-content-center ">
            <SaveButton
              color="secondary"
              type="submit"
              loading={isSaving}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
              className="w-100"
              disabled={profilePictureError || cnicError || medicalRecordError || additionalDocError}
            >
              <span>Save</span>
            </SaveButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddStudentForm;
