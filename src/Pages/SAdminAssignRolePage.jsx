import React from "react";
import { useEffect, useState, useRef } from "react";
import { db } from "../Firebase/config";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import { styled } from "@mui/system";
import firebase from "firebase/compat/app";
import "../Css/AssignRolePage.css";
import { useNavigate } from "react-router-dom";
import { sAdminUser } from "./SAdminDashboard";
import { useContext } from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const SuccessAlert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SaveButton = styled(LoadingButton)({
  backgroundColor: "#00233a",
  "&:hover": {
    backgroundColor: "#393c41",
  },
});

const SAdminAssignRolePage = () => {
  const [teachers, setTeachers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [admin, setAdmin] = useState([]);
  const [roleForm, setRoleForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const formRef = useRef();
  const navigate=useNavigate();
  const user=useContext(sAdminUser);
  // Success Alert
  const [alertState, setAlertState] = React.useState({
    open: false,
    vertical: "top",
    horizontal: "right",
  });
  const { vertical, horizontal, open } = alertState;
  // For Success Toast
  const handleAlertClick = () => {
    setAlertState({ ...alertState, open: true });
  };
  const handleAlertClose = () => {
    setAlertState({ ...alertState, open: false });
  };

 

  const handleChange = (e) => {
    e.preventDefault();
    setRoleForm({ ...roleForm, [e.target.name]: e.target.value });
  };

 


  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Current Date
    let today = new Date();
      let currentDate = today.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "2-digit",
      });

      // Current Time
     let currentTime= new Date().toLocaleString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })

      
      // Updating the Admin
    //   console.log(user);
     db.collection("admin")
     .doc(roleForm.staffId)
     .update({
       assignedrole: firebase.firestore.FieldValue.arrayUnion(
         {role:roleForm.role,date:currentDate,time:currentTime,assignedby:`${user.firstname+" "+user.lastname+"("+user.said+")"}`}
       ),
     })
     .catch((err)=>{
      return;
     })
    //  Updating the teachers
    db.collection("teachers")
      .doc(roleForm.staffId)
      .update({
        assignedrole: firebase.firestore.FieldValue.arrayUnion({role:roleForm.role,date:currentDate,time:currentTime,assignedby:`${user.firstname+" "+user.lastname+"("+user.said+")"}`}),
      })
      .catch((err)=>{
        return;
       })
     // Updating the lstaff
     db.collection("staff")
     .doc(roleForm.staffId)
     .update({
       assignedrole: firebase.firestore.FieldValue.arrayUnion(
         {role:roleForm.role,date:currentDate,time:currentTime,assignedby:`${user.firstname+" "+user.lastname+"("+user.said+")"}`}
       ),
     }).catch((err)=>{
      return;
     })

     

    setIsSaving(false);
    handleAlertClick();
    formRef.current.reset();
  };
  useEffect(() => {
     // Get the currently signed-in user
var user = firebase.auth().currentUser;

if (!user) {
  navigate("/404page")
} 
    // Getting the teachers record from firebase
    const fetchTeacher = async () => {
      await db.collection("teachers").onSnapshot((snapshot) => {
        let data = [];
        snapshot.forEach((doc) => {
          data.push({ ...doc.data(), firebaseId: doc.id });
        });
        setTeachers(data);
      });
    };
    // Getting the lower Staff record from firebase
    const fetchLStaff = async () => {
      await db.collection("staff").onSnapshot((snapshot) => {
        let data = [];
        snapshot.forEach((doc) => {
          data.push({ ...doc.data(), firebaseId: doc.id });
        });
        setStaff(data);
      });
    };
    // Getting the Admin record from firebase
    const fetchAdmin = async () => {
      await db.collection("admin").onSnapshot((snapshot) => {
        let data = [];
        snapshot.forEach((doc) => {
          data.push({ ...doc.data(), firebaseId: doc.id });
        });
        setAdmin(data);
      });
    };

    fetchTeacher();
    fetchLStaff();
    fetchAdmin();
  }, [navigate]);
  return (
    <div className="assignrole-container mt-2 container w-100">
       {/* Success Alert */}
      {/* Success Message Toaster */}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={open}
        onClose={handleAlertClose}
        autoHideDuration={1500}
        key={vertical + horizontal}
      >
        <SuccessAlert
          onClose={handleAlertClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Successfully Sended
        </SuccessAlert>
      </Snackbar>
      <div className="title-wrapper text-center w-100">
        <h4 className="title">Assign Role</h4>
      </div>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        ref={formRef}
      >
        {/* Selecting the staff */}
        <div className="d-flex flex-column role-input">
          <label htmlFor="s-id">
            Staff:<span className="required">*</span>
          </label>
          <select
            name="staffId"
            id="staffId"
            onChange={(e) => {
              handleChange(e);
            }}
            className="py-2 rounded"
            required
          >
            <option value="">Select the staff</option>
            {/* Admin Map */}
            {admin.map((eachStaff) => {
              return (
                <option
                  value={`${eachStaff.firebaseId}`}
                  key={eachStaff.firebaseId}
                >
                  {eachStaff.firstname + " " + eachStaff.lastname}(
                  {eachStaff.designation},{eachStaff.aid.toUpperCase()})
                </option>
              );
            })}
            {/* Teacher Map */}
            {teachers.map((eachStaff) => {
              return (
                <option
                  value={`${eachStaff.firebaseId}`}
                  key={eachStaff.firebaseId}
                >
                  {eachStaff.firstname + " " + eachStaff.lastname}(
                  {eachStaff.designation},{eachStaff.tid.toUpperCase()})
                </option>
              );
            })}

            {/* Staff Map */}
            {staff.map((eachStaff) => {
              return (
                <option
                  value={`${eachStaff.firebaseId}`}
                  key={eachStaff.firebaseId}
                >
                  {eachStaff.firstname + " " + eachStaff.lastname}(
                  {eachStaff.designation},{eachStaff.staffid.toUpperCase()})
                </option>
              );
            })}
          </select>
        </div>
        {/* Input the role */}
        <div className="d-flex flex-column role-input">
          <label htmlFor="s-id">
            Assign Role :<span className="required">*</span>
          </label>
          <textarea
            type="text"
            id="role"
            name="role"
            rows="7"
            className="py-1 px-2 rounded "
            placeholder="Make a presentation for our new developement strategies and forward it to me before 5pm"
            onChange={(e) => {
              handleChange(e);
            }}
            required
          ></textarea>
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
            >
              <span>Assign</span>
            </SaveButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default SAdminAssignRolePage;
