import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { db } from "../Firebase/config";
import firebase from "firebase/compat/app";
import { sAdminUser } from "../Pages/SAdminDashboard";
import { useContext } from "react";
import TextField from "@mui/material/TextField";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import LoadingButton from "@mui/lab/LoadingButton";
import AddIcon from "@mui/icons-material/Add";
import SaveIcon from "@mui/icons-material/Save";
import { styled } from "@mui/system";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

function getNextDay(dateString) {
  const date = new Date(dateString.split("/").reverse().join("/"));
  date.setDate(date.getDate() + 1);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}
const SuccessAlert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

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

const StudentFeeEdit = ({ isSuperAdmin, isAdmin, isStaff }) => {
  // To get the firebase record id from url
  const { state } = useLocation();
  // It stores the student fee object
  const [studentFee, setStudentFee] = useState(state);
  // It stores the changings
  const [feeChangings, setFeeChangings] = useState({ ...state, feepaidnow: 0 });
  // Alert
  const [alertState, setAlertState] = React.useState({
    successOpen: false,
    errorOpen: false,
    vertical: "top",
    horizontal: "right",
  });
  const { vertical, horizontal, successOpen, errorOpen } = alertState;
  // For Alert Toast
  const handleSuccessClick = () => {
    setAlertState({ ...alertState, successOpen: true });
  };
  const handleErrorClick = () => {
    setAlertState({ ...alertState, errorOpen: true });
  };
  const handleAlertClose = () => {
    setAlertState({ ...alertState, successOpen: false, errorOpen });
  };

  // Shows the edit form
  const [toEdit, setToEdit] = useState(false);
  // Changed fee form
  const [feePaidIncrement, setFeePaidIncrement] = useState(0);
  const user = useContext(
    isSuperAdmin ? sAdminUser: ""
  );
  // Remarks Modal
  const [remarksForm, setRemarksForm] = useState(state.remarks);
  const [showAddRemarksModal, setShowAddRemarksModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleShowAddRemarksModalClose = () => {
    setShowAddRemarksModal(false);
  };
  useEffect(() => {
    db.collection("fees")
      .doc(state.firebaseid)
      .onSnapshot((snapshot) => {
        setStudentFee(snapshot.data());
        setFeeChangings({ ...snapshot.data(), feepaidnow: 0 });
      });
  },[]);

  const handleRemarksChange = (e) => {
    e.preventDefault();
    setRemarksForm(e.target.value);
  };
  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.name === "duedate") {
      const formattedDate = getNextDay(e.target.value);
      setFeeChangings({ ...feeChangings, duedate: formattedDate });
    } else if (e.target.name === "feepaidnow") {
      setFeePaidIncrement(e.target.value);
    } else {
      setFeeChangings({ ...feeChangings, [e.target.name]: e.target.value });
      console.log(feeChangings);
    }
  };

  const updateStudentProfileTotalFees = (sid) => {
    db.collection("students")
      .where("sid", "==", sid)
      .get()
      .then((res) => {
        db.collection("students").doc(res.docs[0].id).update({
          totalfees: feeChangings.totalfees,
        });
      });
  };

  const handleRemarksSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    db.collection("fees")
      .doc(state.firebaseid)
      .update({
        remarks: remarksForm,
      })
      .then((res) => {
        setIsSaving(false);
        setShowAddRemarksModal(false);
        handleSuccessClick();
      })
      .catch((err) => {
        setIsSaving(false);
        setShowAddRemarksModal(false);
        setRemarksForm("");
        handleErrorClick();
      });
  };

  // Save the changes made from fee complete form
  const saveFormChanges = (e) => {
    e.preventDefault();
    setIsSaving(true);
    db.collection("fees")
      .doc(state.firebaseid)
      .update({
        name: feeChangings.name,
        totalfees: Number(feeChangings.totalfees),
        feepaid: Number(feeChangings.feepaid),
        duedate: feeChangings.duedate,
        noofinstallments: Number(feeChangings.noofinstallments),
        feeperinstallment: parseInt(
          Number(feeChangings.totalfees) / Number(feeChangings.noofinstallments)
        ),
      })
      .then((res) => {
        setIsSaving(false);
        handleSuccessClick();
        setFeeChangings({ ...feeChangings, feepaidnow: 0 });
        setFeePaidIncrement(0);
      })
      .catch((err) => {
        setIsSaving(false);
        handleErrorClick();
      });
  };

  // It handles the changes from ready panels
  const saveChanges = (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // if total fees changes also update it on the student profile
      if (feeChangings.totalfees !== studentFee.totalfees) {
        updateStudentProfileTotalFees(studentFee.sid);
      }
      if (feePaidIncrement !== 0) {
        // Getting today date
        let today = new Date();
        let transDate = today.toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "2-digit",
        });
        // console.log(user);
        let transReceipt = {
          // Generating the unique id

          id: Date.now().toString(),
          stdname:studentFee.name,
          from: studentFee.sid,
          to: `${
            user.firstname.toUpperCase() + " " + user.lastname.toUpperCase()
          }(${
            user.said || user.aid || user.staffid
          },${user.designation.toUpperCase()})`,
          date: transDate,
          amount: Number(feePaidIncrement),
          totalfees:studentFee.totalfees,
          feepaid:studentFee.feepaid,
          coursename:studentFee.coursename,
          previousTransactions: state.previousTransactions || [],
          isStudent:true,
          time: new Date().toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
        };


        let previousFeeRecord={
          from: studentFee.sid,
          to: `${
            user.firstname.toUpperCase() + " " + user.lastname.toUpperCase()
          }(${
            user.said || user.aid || user.staffid
          },${user.designation.toUpperCase()})`,
          date: transDate,
          isStudent:true,
          amount: Number(feePaidIncrement),
          time: new Date().toLocaleString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          }),
        };

        db.collection("transactions").add(transReceipt);
        
        db.collection("fees")
        .doc(state.firebaseid)
        .update({
          feepaid: firebase.firestore.FieldValue.increment(
            Number(feePaidIncrement)
            ),
            duedate: feeChangings.duedate,
            previousTransactions: firebase.firestore.FieldValue.arrayUnion(previousFeeRecord),
          })
          .then((res) => {
            handleSuccessClick();
            setIsSaving(false);
            setFeePaidIncrement(0);
          });
        } else if (feePaidIncrement === 0) {
          db.collection("fees")
          .doc(state.firebaseid)
          .update({
            duedate: feeChangings.duedate,
            noofinstallments: feeChangings.noofinstallments,
            feeperinstallment: parseInt(
              feeChangings.totalfees / feeChangings.noofinstallments
            ),
          })
          .then((res) => {
            handleSuccessClick();
            setIsSaving(false);
            setFeeChangings({ ...feeChangings, feepaidnow: 0 });
            setFeePaidIncrement(0);
          });
      }
    } catch (err) {
      handleErrorClick();
      setIsSaving(false);
    }
  };
  return (
    <div className="d-flex flex-column align-items-center">
      <div className="title bg-dark  text-center text-white w-100">
        <h3 className="text-white">Fee</h3>
      </div>
      <div className="w-100">
        {/* Success Alert */}
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={successOpen}
          onClose={handleAlertClose}
          autoHideDuration={1500}
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
        >
          <SuccessAlert
            onClose={handleAlertClose}
            severity="error"
            sx={{ width: "100%" }}
          >
            Something Went Wrong
          </SuccessAlert>
        </Snackbar>
      </div>

      {/* Edit Button */}
      <div className="w-100 d-flex mt-2 justify-content-end pe-2">
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

      <div className="student-fee-details  ms-1">
        <div className="row">
          <div className="d-flex flex-column col">
            <TextField
              id="standard-basic"
              label="ID"
              variant="standard"
              value={studentFee.sid}
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
              label="Student Name"
              variant="standard"
              value={studentFee.name}
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
              label="Course Name"
              variant="standard"
              value={studentFee.coursename}
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
              label="No. Of Installments"
              variant="standard"
              value={studentFee.noofinstallments}
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
              label="Fee Per Installment(Rs)"
              variant="standard"
              value={studentFee.feeperinstallment}
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
              label="Other(Rs)"
              variant="standard"
              value={studentFee.other || ""}
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
              label="Total Fees(Rs)"
              variant="standard"
              value={studentFee.totalfees}
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
              label="Fee Paid(Rs)"
              variant="standard"
              value={studentFee.feepaid}
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
              label="Due Date"
              variant="standard"
              value={studentFee.duedate}
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
            value={studentFee.remarks}
            InputProps={{
              readOnly: true,
            }}
          />
        </div>
      </div>

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
      {/* Add Fees , Change Number of Installments , Due Date */}
      {toEdit === false ? (
        <>
          <div
            className="chnages-input d-flex flex-wrap  mt-3 w-100 justify-content-around"
            id="student-edit"
            style={{ rowGap: "12px" }}
          >
            <div>
              <TextField
                id="outlined-basic"
                label="Enter Amount Paid"
                variant="outlined"
                name="feepaidnow"
                value={feePaidIncrement}
                onChange={(e) => {
                  handleChange(e);
                }}
                focused
              />
            </div>
            <div className="">
              <TextField
                id="outlined-basic"
                label="Change No of Installments"
                variant="outlined"
                type="number"
                name="noofinstallments"
                value={feeChangings.noofinstallments}
                inputProps={{ min: "0" }}
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
            <div className="">
              <TextField
                id="outlined-basic"
                variant="outlined"
                type="date"
                name="duedate"
                onChange={(e) => {
                  handleChange(e);
                }}
              />
            </div>
          </div>
          <div className="mt-2 w-100 px-5">
            <SaveButton
              onClick={(e) => {
                saveChanges(e);
              }}
              color="secondary"
              type="submit"
              loading={isSaving}
              loadingPosition="start"
              startIcon={<SaveIcon />}
              variant="contained"
              className="w-100"
              disabled={studentFee.feepaid === studentFee.totalfees}
            >
              <span>Save</span>
            </SaveButton>
          </div>
        </>
      ) : (
        <>
          {/* Complete Fee Change Form */}
          <div className="chnages-input d-flex flex-wrap w-100 justify-content-around container">
            {/* Student ID */}
            <div className="row w-100">
              <div className="d-flex flex-column col">
                <label htmlFor="s-id">
                  Student ID:<span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="sid"
                  name="sid"
                  value={feeChangings.sid}
                  className="py-1 px-2 rounded "
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  disabled
                  required
                ></input>
              </div>
            </div>

            {/* Student Name */}
            <div className="row w-100">
              <div className="d-flex flex-column col">
                <label htmlFor="name">
                  Student Name:<span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={feeChangings.name}
                  className="py-1 px-2 rounded "
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  required
                ></input>
              </div>
            </div>
            {/* Total Fees */}
            <div className="row w-100">
              <div className="d-flex flex-column col">
                <label htmlFor="totalfees">
                  Total Fees:<span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="totalfees"
                  name="totalfees"
                  value={feeChangings.totalfees}
                  className="py-1 px-2 rounded "
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  required
                ></input>
              </div>
            </div>

            {/* No of installments */}
            <div className="row w-100">
              <div className="d-flex flex-column col">
                <label htmlFor="noofintallments">
                  No Of Installments:<span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="noofinstallments"
                  name="noofinstallments"
                  value={feeChangings.noofinstallments}
                  className="py-1 px-2 rounded "
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  required
                ></input>
              </div>
            </div>

            {/* Fee Per Installment */}
            <div className="row w-100">
              <div className="d-flex flex-column col">
                <label htmlFor="feeperinstallment">
                  Fee Per Installment:<span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="feeperinstallment"
                  name="feeperinstallment"
                  value={feeChangings.feeperinstallment}
                  className="py-1 px-2 rounded "
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  required
                ></input>
              </div>
            </div>
            {/* Fee Paid */}
            <div className="row w-100">
              <div className="d-flex flex-column col">
                <label htmlFor="feepaid">
                  Fee Paid:<span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="feepaid"
                  name="feepaid"
                  value={feeChangings.feepaid}
                  className="py-1 px-2 rounded "
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  required
                ></input>
              </div>
            </div>

            {/* Due Date */}
            <div className="row w-100">
              <div className="d-flex flex-column col">
                <label htmlFor="duedate">
                  Due Date:<span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="duedate"
                  name="duedate"
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

export default StudentFeeEdit;
