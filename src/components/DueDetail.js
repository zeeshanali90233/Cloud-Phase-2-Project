import moment from "moment/moment";
import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../Firebase/config";

const DueDetail = ({ dueRec,setReRenderState}) => {
  const [calcModal, setCalcModal] = useState(false);
  const [remarksForm, setRemarksForm] = useState(dueRec && dueRec.remarks);
  const [isSaving,setIsSaving]=useState(false);

  const handleRemarksChange = (e) => {
    e.preventDefault();
    setRemarksForm(e.target.value);
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




  const handleRemarkSub = (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      remarksForm &&
      db.collection("salaries")
      .doc(dueRec.firebaseId)
      .update({
        remarks: remarksForm,
      })
      setIsSaving(false);
      setReRenderState(Math.random());
      showSuccessToast();
    } catch (err) {
      setIsSaving(false);
      showErrorToast();
    }
  };

  return (
    <div className="dues-detail-content">
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
      <div className="staffphoto w-100 d-flex justify-content-center mt-2 mb-1">
        <img
          src={
            (dueRec && dueRec.photoURL && dueRec.photoURL.URL) ||
            "/no_profile_picture.jpeg"
          }
          alt="profile"
          className="rounded-circle"
          width={150}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="sid">ID:</label>
          <div className="border-b-2 border-blue-500 ">{dueRec.id}</div>
        </div>
        <div>
          <label htmlFor="ename">Employee Name:</label>
          <div className="border-b-2 border-blue-500">{dueRec.name}</div>
        </div>
        <div>
          <label htmlFor="salary">Salary(PKR):</label>
          <div className="border-b-2 border-blue-500">{dueRec.salary}</div>
        </div>
        <div>
          <label htmlFor="month">Month:</label>
          <div className="border-b-2 border-blue-500 capitalize">
            {moment(dueRec.date, "DD-MM-YYYY").format("MMMM")}
          </div>
        </div>
        <div>
          <label htmlFor="status">Status:</label>
          <div className="border-b-2 border-blue-500">
            {dueRec.paid ? "Paid" : "Not Paid"}
          </div>
        </div>
      </div>

      {/* Remarks Section */}
      <form onSubmit={handleRemarkSub}>
        <div className="remarksSec  mt-3 ">
          <button
            type="submit"
            className=" w-full py-1 addicon cursor-pointer bg-blue-500 text-center text-white rounded"
          >
            <i className="bi bi-plus-lg"></i>Save
          </button>
          <div className="w-full">
            <textarea
              type="text"
              id="remarks"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="remarks"
              rows={4}
              placeholder={dueRec.remarks || "Remarks"}
              value={remarksForm}
              onChange={handleRemarksChange}
            />
          </div>
        </div>
      </form>

      <button
        type="submit"
        className="w-full bg-green-600 py-1 mt-2 rounded text-white hover:bg-green-500"
      >
        <i class="bi bi-calculator"></i>
        Calculate
      </button>
    </div>
  );
};

export default DueDetail;
