import React, { useState, useEffect } from "react";
import SAdminLayout from "../../../../../src/layouts/SAdminLayout";
import { useRouter } from "next/router";
import { db } from "../../../../../src/Firebase/config";
import AdminDetail from "../../../../../src/components/AdminDetail";
import AdminEdit from "../../../../../src/components/AdminEdit";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const isObjectEmpty = (objectName) => {
    return JSON.stringify(objectName) === "{}";
  };

  
  const addAdminFormInit = {
    aid: "",
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
    institutename:"",
    yearofpass:"",
    cgpa:"",
    emergencyname: "",
    emergencyrelationship: "",
    emergencyphone: "",
    adminphoto: "",
    admincnicphoto: "",
    medicalrecordsphoto: "",
    additionaldocuments: [],
    assignedrole: [],
    cgpa: 0,
    canmanagesalary: false,
    type: "Admin",
    canmanagesalary: "",
  };
  
const adminid = () => {
    const [admin, setAdmin] = useState(addAdminFormInit);
    const [editAdmin, setEditAdmin] = useState(false);
    const [resetProc, setResetProc] = useState(false);
    const router = useRouter();
    const { id } = router.query;
  
    useEffect(() => {
        const fetchAdminData = async () => {
          const snapshot = await db.collection("admin").doc(id).get();
          setAdmin({ ...snapshot.data(), firebaseId: snapshot.id });
         
        };
        fetchAdminData();
      }, [router.query]);


      
  const handleEditToggle = () => {
    setEditAdmin(!editAdmin);
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


  
  const handleResetPassword = (email) => {
    setResetProc(true);
    axios
    .post("/api/resetpassword", {
      email: email,
    })
    .then((res) => {
      const link = res.data.link;
      setResetProc(false);
      // Open the link in a new tab
      window.open(link, "_blank");
    })
    .catch((err) => {
        setResetProc(false);
        showErrorToast();
      });
  };



  return (
    <SAdminLayout>
      <div className="detail">
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
        {/* Buttons */}
        <div className="d-flex  justify-center lg:justify-end md:justify-end  w-100 ">
          <div>
            {/* Password Reset Button */}
            <div className="w-100 ">
              <button
                type="submit"
                id="edit-button"
                className="border rounded px-2 py-1 w-[140px] hover:bg-blue-600 hover:text-white"
                onClick={() => {
                  handleResetPassword(`${admin.aid}@teps.edu.pk`);
                }}
              >
                {!resetProc && "Reset Password"}
                {resetProc && "Processing..."}
              </button>
            </div>
          </div>
          {/* Edit Button */}
          <div>
            <button
              type="submit"
              id="edit-button"
              className="border rounded px-2 py-1 w-[140px] ml-1 hover:bg-blue-600 hover:text-white"
              onClick={handleEditToggle}
            >
              {editAdmin === false && (
                <span>
                  {" "}
                  <span className="bi bi-pen"></span> Turn Edit On
                </span>
              )}
              {editAdmin === true && (
                <span>
                  {" "}
                  <span className="bi bi-pen"></span> Turn Edit Off
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Displaying Detail when editing is turned off */}
        {!isObjectEmpty(admin) && !editAdmin && admin && (
          <AdminDetail admin={admin} />
        )}

        {/* Displaying When edit is turn on  */}
        {!isObjectEmpty(admin) && editAdmin && admin && (
          <AdminEdit admin={admin} />
        )}
      </div>
    </SAdminLayout>
  )
}

export default adminid
