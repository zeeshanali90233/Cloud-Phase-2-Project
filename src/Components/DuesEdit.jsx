import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../Firebase/config";
import firebase from "firebase/compat/app";
import TextField from "@mui/material/TextField";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import LoadingButton from "@mui/lab/LoadingButton";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import PaymentIcon from "@mui/icons-material/Payment";
import { styled } from "@mui/system";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import moment from "moment";
import { organizationDetails } from "../Organization/details";
import PrintPaidSalaryRecords from "./PrintPaidSalaryRecords";

// Modal MUI Style
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  border: "1px solid #0086c9",
  borderRadius: "23px",
  boxShadow: 24,
  p: 4,
};

const SaveButton = styled(LoadingButton)({
  backgroundColor: "#00233a",
  "&:hover": {
    backgroundColor: "#393c41",
  },
});
const isObjectEmpty = (objectName) => {
  return JSON.stringify(objectName) === "{}";
};
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const DuesEdit = ({ isSuperAdmin }) => {
  // To get the firebase record id from url
  const { state } = useLocation();
  // It stores the student fee object
  const [dues, setDues] = useState({ ...state });
  // It stores the changings
  const [duesChangings, setDuesChangings] = useState({ ...state });
  const [alertState, setAlertState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "right",
  });
  const { vertical, horizontal, open } = alertState;
  // Shows the edit form
  const [toEdit, setToEdit] = useState(false);
  const [salarySlipData, setSalarySlipData] = useState({});
  const [showSalarySlipModal, setShowSalarySlipModal] = useState(false);
  const [showAddRemarksModal, setShowAddRemarksModal] = useState(false);
  const [remarksForm, setRemarksForm] = useState(state.remarks);
  const [isSaving, setIsSaving] = useState(false); //For Saving and Calculating
  const [isPaying, setIsPaying] = useState(false); //For Paying
  const [attendanceData, setAttendanceData] = useState("");

  // MUI Alert CLose/Open
  const handleAlertOpen = () => {
    setAlertState({ ...alertState, open: true });
  };
  const handleAlertClose = () => {
    setAlertState({ ...alertState, open: false });
  };

  const handleShowAddRemarksModalClose = () => {
    setShowAddRemarksModal(false);
  };
  const handleShowSalarySlipModalClose = () => {
    setShowSalarySlipModal(false);
  };

  const handleRemarksChange = (e) => {
    e.preventDefault();
    setRemarksForm(e.target.value);
  };

  const salarySlipChange = (e) => {
    e.preventDefault();
    if (e.target.name === "increment") {
      let increment = +e.target.value;
      let updatedNetSalary =
        salarySlipData.totalDaysSalary -
        salarySlipData.absentDaysSalary +
        increment -
        salarySlipData.decrement; //Incrementing the increment
      setSalarySlipData({
        ...salarySlipData,
        increment: increment,
        netSalary: Math.round(updatedNetSalary),
      });
    } else if (e.target.name === "decrement") {
      let decrement = e.target.value;
      let updatedNetSalary =
        salarySlipData.totalDaysSalary -
        salarySlipData.absentDaysSalary -
        decrement +
        salarySlipData.increment; //Decrementing the decrement from net salary
      setSalarySlipData({
        ...salarySlipData,
        decrement: decrement,
        netSalary: Math.round(updatedNetSalary),
      });
    }
  };

  useEffect(() => {
    db.collection("salaries")
      .doc(state.firebaseId)
      .onSnapshot((snapshot) => {
        setDues({ ...snapshot.data(), firebaseId: snapshot.id });
      });
    const fetchAttendance = async () => {
      const snapshot = await db.collection("attendance").get();
      setAttendanceData({
        ...snapshot.docs[0].data(),
        firebaseId: snapshot.docs[0].id,
      });
    };

    fetchAttendance();
  }, []);
  const handleChange = (e) => {
    setDuesChangings({ ...duesChangings, [e.target.name]: e.target.value });
  };

  const handleRemarksSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    db.collection("salaries")
      .doc(state.firebaseId)
      .update({
        remarks: remarksForm,
      })
      .then((res) => {
        setIsSaving(false);
        setShowAddRemarksModal(false);
        handleAlertOpen();
      })
      .catch((err) => {
        setIsSaving(false);
        setShowAddRemarksModal(false);
        setRemarksForm("");
      });
  };

  const getAttendanceStats = (attendance, id, month, year) => {
    let totalDays = 0;
    let totalPresent = 0;
    attendance
      .filter((record) => {
        // Convert the date string to a Date object
        const date = moment(record.date, "DD-MMM-YY");
        // Check if the record's date matches the given month and year
        return date.format("MM") === month && date.format("YYYY") === year;
      })
      .forEach((record) => {
        // Check if the attendance record contains the ID
        if (record.attendance[id] !== undefined) {
          totalDays++;

          // Check if the staff was present on the given date
          if (record.attendance[id] === true) {
            totalPresent++;
          }
        }
      });

    return {
      totalDays,
      totalPresent,
    };
  };

  //   Calculates the attendance of employee(present,absend, percentage);
  const calculateAttendance = () => {
    let salaryPerDay;
    let totalDaysSalary;
    let absentDaysSalary;
    let netSalary;
    if (dues.id[0] === "a") {
      //Admin

      let date = moment(dues.date, "DD-MM-YYYY");
      let attendanceDetail = getAttendanceStats(
        attendanceData.adminattendance,
        dues.id,
        date.format("MM"),
        date.format("YYYY")
      );
      salaryPerDay = dues.salary / 30;
      totalDaysSalary = salaryPerDay * attendanceDetail.totalDays;
      absentDaysSalary =
        salaryPerDay *
        (attendanceDetail.totalDays - attendanceDetail.totalPresent);
      netSalary = totalDaysSalary - absentDaysSalary;
      setSalarySlipData({
        ...attendanceDetail,
        id: dues.id,
        month: date.format("MM"),
        salary:dues.salary,
        year: date.format("YYYY"),
        totalDaysSalary: Math.round(totalDaysSalary),
        absentDaysSalary:Math.round(absentDaysSalary),
        netSalary: Math.round(netSalary),
        increment: 0,
        decrement: Math.round(absentDaysSalary),
        name: dues.name,
      });
    } else {
      //Staff and Teacher
      let date = moment(dues.date, "DD-MM-YYYY");
      let attendanceDetail = getAttendanceStats(
        attendanceData.staffattendance,
        dues.id,
        date.format("MM"),
        date.format("YYYY")
      );
      salaryPerDay = dues.salary / 30;
      totalDaysSalary = salaryPerDay * attendanceDetail.totalDays;
      absentDaysSalary =
        salaryPerDay *
        (attendanceDetail.totalDays - attendanceDetail.totalPresent);
      netSalary = totalDaysSalary - absentDaysSalary;

      setSalarySlipData({
        ...attendanceDetail,
        id: dues.id,
        month: date.format("MM"),
        year: date.format("YYYY"),
        salary:dues.salary,
        totalDaysSalary: Math.round(totalDaysSalary),
        absentDaysSalary:Math.round(absentDaysSalary),
        netSalary: Math.round(netSalary),
        increment: 0,
        decrement: Math.round(absentDaysSalary),
        name: dues.name,
      });
    }
  };

  const handleSalaryPay = (e) => {
    setIsPaying(true)
    e.preventDefault();
    const currentDate = moment(new Date());

    // Parse the date string into a moment object
    const dateObj = moment(dues.date, "DD-MM-YYYY");

    // Add one month to the date object
    const nextMonthObj = dateObj.add(1, "month");

    // Format the resulting date object into the desired format
    const nextMonthString = nextMonthObj.format("DD-MM-YYYY");
    // First if the salary is of current month
    if (
      salarySlipData.month === currentDate.format("MM") &&
      salarySlipData.year === currentDate.format("YYYY")
    ) {
      // Updating the salary record with the new one and storing this recored in the previousRecord
      db.collection("salaries")
        .doc(dues.firebaseId)
        .update({
          paid: true,
          previousRecord:
            firebase.firestore.FieldValue.arrayUnion(salarySlipData),
        });

         // Getting today date
      let today = new Date();
      let transDate = today.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "2-digit",
      });

        // Making a Receipt
        db.collection("transactions").add({
            // Generating the unique id
    
            id: Date.now().toString(),
            from: organizationDetails.name,
            to:`${salarySlipData.name}(${salarySlipData.id})`,
            date: transDate,
            amount: salarySlipData.netSalary,
            time: new Date().toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            }),
          });

        setIsPaying(false);
        handleShowSalarySlipModalClose();
        handleAlertOpen();
    }
    // Second If salary is of previous month
    else if (
      salarySlipData.month < currentDate.format("MM") &&
      salarySlipData.year <= currentDate.format("YYYY")
    ) {
      // Updating the salary record with the new one and storing this recored in the previousRecord
      db.collection("salaries")
        .doc(dues.firebaseId)
        .update({
          date: nextMonthString,
          previousRecord:
            firebase.firestore.FieldValue.arrayUnion(salarySlipData),
        });

          // Getting today date
      let today = new Date();
      let transDate = today.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "2-digit",
      });

        // Making a Receipt
        db.collection("transactions").add({
            // Generating the unique id
    
            id: Date.now().toString(),
            from: organizationDetails.name,
            to:`${salarySlipData.name}(${salarySlipData.id})`,
            date: transDate,
            amount: salarySlipData.netSalary,
            time: new Date().toLocaleString("en-US", {
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            }),
          });

        setIsPaying(false);
        handleShowSalarySlipModalClose();
        handleAlertOpen();
    }
    else{
        setIsPaying(false);
    }
  };

  const updateTotalSalary = (record) => {
    if (record.id[0] === "a") {
      //admin
      db.collection("admin").doc(record.adminfirebaseid).update({
        initsalary: duesChangings.salary,
      });
    } else if (record.id[0] === "e") {
      //staff
      db.collection("staff").doc(record.stafffirebaseid).update({
        initsalary: duesChangings.salary,
      });
    } else if (record.id[0] === "t") {
      //teacher
      db.collection("teachers").doc(record.teacherfirebaseid).update({
        initsalary: duesChangings.salary,
      });
    }
  };

  // Save the changes made from fee complete form
  const saveFormChanges = (e) => {
    e.preventDefault();
    setIsSaving(true);

    db.collection("salaries")
      .doc(state.firebaseId)
      .update({
        name: duesChangings.name,
        salary: duesChangings.salary,
      })
      .then((res) => {
        updateTotalSalary(state); //Updating the total salary from profile of employee
        setIsSaving(false);
        handleAlertOpen();
      })
      .catch((err) => {
        setIsSaving(true);
      });
  };

  return (
    <div className="d-flex flex-column align-items-center">
      <div className="title bg-dark  text-center text-white w-100">
        <h3 className="text-white">Salary</h3>
      </div>
      <div className="w-100">
        {/* Success Message Toaster */}
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={open}
          onClose={handleAlertClose}
          autoHideDuration={1500}
          key={vertical + horizontal}
        >
          <Alert
            onClose={handleAlertClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            Successfully Changed
          </Alert>
        </Snackbar>
      </div>

      {/* Edit Button */}
      <div className="w-100 d-flex mt-2 justify-content-end pe-2">
     { dues.previousRecord&&<PrintPaidSalaryRecords previousRecords={dues.previousRecord}/>}
        <button
          type="submit"
          id="edit-button"
          className="border rounded"
          onClick={() => {
            setToEdit(!toEdit);
          }}
        >
          Edit
        </button>
      </div>

      <div className="photo w-100 d-flex justify-content-center mt-2 mb-1">
        <img
          src={!isObjectEmpty(dues) ? dues.photoURL.URL : ""}
          alt="Employee "
          width={150}
          className="rounded"
        />
      </div>

      <div className="student-fee-details  ms-1">
        <div className="row">
          <div className="d-flex flex-column col">
            <TextField
              id="standard-basic"
              label="ID"
              variant="standard"
              value={dues.id}
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="d-flex flex-column col">
            <TextField
              id="standard-basic"
              label="Employee Name"
              variant="standard"
              value={dues.name}
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="d-flex flex-column col">
            <TextField
              id="standard-basic"
              label="Salary"
              variant="standard"
              value={`${dues.salary}PKR`}
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
        </div>

        <div className="row">
          <div className="d-flex flex-column col">
            <TextField
              id="standard-basic"
              label="Month"
              variant="standard"
              value={moment(dues.date, "DD-MM-YYYY").format("MMMM")}
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
        </div>
        {/* Status */}
        <div className="row">
          <div className="d-flex flex-column col">
            <TextField
              id="standard-basic"
              label="Status"
              variant="standard"
              value={dues.paid ? "Paid" : "Not Paid"}
              InputProps={{
                readOnly: true,
              }}
            />
          </div>
        </div>
      </div>
      <div className="w-100 px-1">
        <div className="d-flex align-items-center  ">
          <AddIcon
            sx={{ color: "action.active", mr: 1, my: 0.5 }}
            style={{ cursor: "pointer" }}
            onClick={(e) => {
              setShowAddRemarksModal(true);
            }} //Showing the remarks modal
          />
          <TextField
            id="standard-basic"
            multiline
            rows={2}
            className="w-100"
            label="Remarks"
            variant="standard"
            value={dues.remarks}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
      </div>

      {/* Calculate Salary Modal */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={showSalarySlipModal}
        onClose={handleShowSalarySlipModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showSalarySlipModal}>
          <Box sx={style}>
            <form
              onSubmit={(e) => {
                handleSalaryPay(e);
              }}
            >
              <div>
                <div className="row">
                  <div className="col d-flex flex-column">
                    <TextField
                      id="standard-basic"
                      label="ID"
                      variant="standard"
                      value={salarySlipData.id}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>

                  <div className="col d-flex flex-column">
                    <TextField
                      id="standard-basic"
                      label="Name"
                      variant="standard"
                      value={salarySlipData.name}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col d-flex flex-column">
                    <TextField
                      id="standard-basic"
                      label="Month"
                      variant="standard"
                      value={moment(salarySlipData.month, "M").format("MMMM")}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                  <div className="col d-flex flex-column">
                    <TextField
                      id="standard-basic"
                      label="Year"
                      variant="standard"
                      value={salarySlipData.year}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col d-flex flex-column">
                    <TextField
                      id="standard-basic"
                      label="Total Days"
                      variant="standard"
                      value={salarySlipData.totalDays}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                  <div className="col d-flex flex-column">
                    <TextField
                      id="standard-basic"
                      label="Total Presents"
                      variant="standard"
                      value={salarySlipData.totalPresent}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col d-flex flex-column">
                  <TextField
                    id="standard-basic"
                    label="Increment"
                    variant="standard"
                    name="increment"
                    value={salarySlipData.increment}
                    onChange={(e) => {
                      salarySlipChange(e);
                    }}
                  />
                </div>
                <div className="col d-flex flex-column">
                  <TextField
                    id="standard-basic"
                    label="Decrement"
                    variant="standard"
                    name="decrement"
                    value={salarySlipData.decrement}
                    onChange={(e) => {
                      salarySlipChange(e);
                    }}
                  />
                </div>

                <div className="row">
                  <div className="col d-flex flex-column">
                    <TextField
                      id="standard-basic"
                      label="Net Salary"
                      variant="standard"
                      value={salarySlipData.netSalary}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                </div>
              </div>
              {/* Save Button */}
              <div className="d-flex justify-content-center mt-2">
                <SaveButton
                  color="secondary"
                  type="submit"
                  loading={isPaying}
                  loadingPosition="start"
                  startIcon={<PaymentIcon />}
                  variant="contained"
                  className="w-100"
                >
                  <span>Pay</span>
                </SaveButton>
              </div>
            </form>
          </Box>
        </Fade>
      </Modal>

      {/* Add Remarks MODAL */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={showAddRemarksModal}
        onClose={handleShowAddRemarksModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showAddRemarksModal}>
          <Box sx={style}>
            <form
              onSubmit={(e) => {
                handleRemarksSubmit(e);
              }}
            >
              {/* Remarks Input*/}
              <div className=" w-100">
                <div className="d-flex flex-column mt-2 ">
                  <textarea
                    type="text"
                    id="remarks"
                    name="remarks"
                    className="w-100 rounded"
                    rows={5}
                    value={remarksForm}
                    placeholder="Enter the remarks here"
                    onChange={(e) => {
                      handleRemarksChange(e);
                    }}
                    required
                    autoFocus
                  ></textarea>
                </div>
              </div>

              {/* Save Button */}
              <div className="d-flex justify-content-center mt-2">
                <SaveButton
                  color="secondary"
                  type="submit"
                  loading={isSaving}
                  loadingPosition="start"
                  startIcon={<SaveIcon />}
                  variant="contained"
                  className="w-100"
                >
                  <span>Save</span>
                </SaveButton>
              </div>
            </form>
          </Box>
        </Fade>
      </Modal>
      {/* Calculate Salary Button*/}
      {toEdit === false ? (
         (!dues.paid)? <><div
            className="chnages-input d-flex flex-wrap  mt-3 w-100 justify-content-around"
            id="salary-edit"
            style={{ rowGap: "12px" }}
          ></div>
          <div className="mt-2 w-100 px-5">
            <SaveButton
              color="secondary"
              type="submit"
              onClick={() => {
                setShowSalarySlipModal(true);
                calculateAttendance();
              }}
              loading={isSaving}
              loadingPosition="start"
              startIcon={<PaymentIcon />}
              variant="contained"
              className="w-100"
            >
              <span>Calculate</span>
            </SaveButton>
          </div></>:""
      ) : (
        <>
          {/* Complete Fee Change Form */}
          <div className="chnages-input d-flex flex-wrap w-100 justify-content-around container">
            {/*  ID */}
            <div className="row w-100">
              <div className="d-flex flex-column col">
                <label htmlFor="s-id">
                  ID:<span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="id"
                  name="id"
                  value={duesChangings.id}
                  className="py-1 px-2 rounded "
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  disabled
                  required
                ></input>
              </div>
            </div>

            {/* Name */}
            <div className="row w-100">
              <div className="d-flex flex-column col">
                <label htmlFor="name">
                  Employee Name:<span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={duesChangings.name}
                  className="py-1 px-2 rounded "
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  required
                ></input>
              </div>
            </div>

            {/* Init Salary */}
            <div className="row w-100">
              <div className="d-flex flex-column col">
                <label htmlFor="name">
                  Salary(PKR):<span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="salary"
                  name="salary"
                  value={duesChangings.salary}
                  className="py-1 px-2 rounded "
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  required
                ></input>
              </div>
            </div>
          </div>
          <div className="mt-2 w-100 px-5">
            <button
              type="button"
              className="btn btn-success  w-100"
              onClick={(e) => {
                saveFormChanges(e);
              }}
            >
              Save Changes
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DuesEdit;
