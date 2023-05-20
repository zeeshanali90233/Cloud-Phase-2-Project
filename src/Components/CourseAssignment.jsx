import React, { useState,useEffect ,useRef,useContext} from "react";
import SaveIcon from '@mui/icons-material/Save';
import { styled } from '@mui/system';
import firebase from 'firebase/compat/app';
import { db } from "../Firebase/config";
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';

import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import { showMaterialDeleteButtonContext } from "./CourseDetails";
import AddAssignmentICON from "../Assets/Logos/AddAssignmentICON.png";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const SuccessAlert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



// Modal MUI Style
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width:"80%" ,
    bgcolor: 'background.paper',
    border: '1px solid #0086c9',
    borderRadius: "23px",
    boxShadow: 24,
    p: 4,
  };
  
  
  const SaveButton=styled(LoadingButton)({
      backgroundColor:"#00233a",
      '&:hover':{
        backgroundColor:"#393c41"
      }
    })




const CourseAssignment = ({ firebaseId }) => {
    const [showAddAssignmentBox, setShowAssignmentBox] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [course, setCourse] = useState(false);
    const { showAddMaterialButtons } = useContext(
      showMaterialDeleteButtonContext
    );
  
    // Form Reference
    const formRef = useRef(null);
  
    const handleShowAssignmentBoxOpen = () => {
      setShowAssignmentBox(true);
    };
    const handleShowAssignmentBoxClose = () => {
        setShowAssignmentBox(false);
    };
  
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
  
    useEffect(() => {
      return db
        .collection("courses")
        .doc(firebaseId)
        .onSnapshot((snapshot) => {
          setCourse({ ...snapshot.data(), firebaseId: snapshot.id });
        });
    }, []);
  return (
    <div className="w-100 container mt-1">
      <div className="title bg-dark  text-center text-white w-100 rounded py-1 ">
        <h4 className="text-white">Material</h4>
      </div>
      {/* Success Alert */}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={successOpen}
        onClose={handleAlertClose}
        autoHideDuration={1500}
        key={vertical + horizontal}
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
        key={vertical + horizontal}
      >
        <SuccessAlert
          onClose={handleAlertClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Something Went Wrong
        </SuccessAlert>
      </Snackbar>

 {/* Buttons */}
 {showAddMaterialButtons ? (
        <div className="btns d-flex w-100 justify-content-evenly flex-wrap mt-1">
          <div
            className="panel border addlecturevideo d-flex flex-column px-3 py-2 align-items-center rounded justify-content-center user-select-none"
            onClick={() => {
              setShowAssignmentBox(!showAddAssignmentBox);
            }}
          >
            <div className="icon">
              <img src={AddAssignmentICON} alt="" width={30} />
            </div>
            <h5 className="text-dark text user-select-none">
              Add Assignment
            </h5>
          </div>
         
        </div>
      ) : (
        ""
      )}
    </div>
  )
}

export default CourseAssignment
