import React, { useState, useEffect, useLayoutEffect } from "react";
import AdminLayout from "../../../../src/layouts/AdminLayout";
import { useRouter } from "next/router";
import { db } from "../../../../src/Firebase/config";
import StaffDetail from "../../../../src/components/StaffDetail";
import StaffEdit from "../../../../src/components/StaffEdit";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const isObjectEmpty = (objectName) => {
  return JSON.stringify(objectName) === "{}";
};

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

const staffid = () => {
  const [staff, setStaff] = useState(staffFormInit);
  const [resetProc, setResetProc] = useState(false);

  const [authorities, setAuthorities] = useState([
    { authorityname: "Students" },
    { authorityname: "Courses" },
    { authorityname: "Fees" },
  ]);

  const [editStaff, setEditStaff] = useState(false);
  const router = useRouter();
  const { id } = router.query;

  useLayoutEffect(() => {
    const fetchStaffData = async () => {
      const snapshot = await db.collection("staff").doc(id).get();
      setStaff({ ...snapshot.data(), firebaseId: snapshot.id });
      setAuthorities([
        { authorityname: "Students", ...snapshot.data()?.studentauthority },
        { authorityname: "Courses", ...snapshot.data()?.courseauthority },
        { authorityname: "Fees", ...snapshot.data()?.feesauthority },
      ]);
    };
    fetchStaffData();
  }, [router.query]);

  const handleEditToggle = () => {
    setEditStaff(!editStaff);
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
        // Open the link in a new tab
        setResetProc(false);
        window.open(link, "_blank");
      })
      .catch((err) => {
        setResetProc(false);
        showErrorToast();
      });
  };

  return (
    <AdminLayout>
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
                  handleResetPassword(`${staff.staffid}@teps.edu.pk`);
                }}
                disabled={resetProc}
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
              {editStaff === false && (
                <span>
                  {" "}
                  <span className="bi bi-pen"></span> Turn Edit On
                </span>
              )}
              {editStaff === true && (
                <span>
                  {" "}
                  <span className="bi bi-pen"></span> Turn Edit Off
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Displaying Detail when editing is turned off */}
        {!isObjectEmpty(staff) && !editStaff && staff && (
          <StaffDetail staff={staff} authorities={authorities} />
        )}

        {/* Displaying When edit is turn on  */}
        {!isObjectEmpty(staff) && editStaff && staff && (
          <StaffEdit staff={staff} authorities={authorities} />
        )}
      </div>
    </AdminLayout>
  );
};

export default staffid;
