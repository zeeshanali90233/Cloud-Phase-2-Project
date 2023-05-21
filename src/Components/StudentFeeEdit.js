import React from "react";
import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../Firebase/config";

const StudentFeeEdit = ({ studentFee, profilePic ,setReRenderState}) => {
  const [feeEditForm, setFeeEditForm] = useState(studentFee || {});
  const [isSaving, setIsSaving] = useState(false);

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

  const handleEditChange = (e) => {
    e.preventDefault();
    setFeeEditForm({ ...feeEditForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    setIsSaving(true);
    try{
      await db.collection("fees")
      .doc(studentFee.firebaseId)
      .update({
        feepaid: feeEditForm.feepaid,
        totalfees:feeEditForm.totalfees,
        duedate: feeEditForm.duedate,
        noofinstallments: feeEditForm.noofinstallments,
        feeperinstallment: parseInt(
          feeEditForm.totalfees / feeEditForm.noofinstallments
        ),
      })
      setIsSaving(false);
      showSuccessToast();
      setReRenderState(Math.random());
    }
    catch(err){
      showErrorToast()
      setIsSaving(false);

    }
   

  };

  return (
    <div className="main-content mb-5">
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
          src={profilePic || "/no_profile_picture.jpeg"}
          alt="profile"
          className="rounded-circle"
          width={150}
        />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-2 ">
          <div>
            <label
              htmlFor="sid"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Student ID
            </label>
            <input
              type="text"
              id="disabled-input"
              aria-label="disabled input"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 cursor-not-allowed"
              name="sid"
              value={feeEditForm.sid}
              disabled
              required
            />
          </div>

          <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Student Name
            </label>
            <input
              type="text"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="name"
              value={feeEditForm.name}
              disabled
              required
            />
          </div>

          <div>
            <label
              htmlFor="totalfees"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Total Fees
            </label>
            <input
              type="text"
              id="totalfees"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="totalfees"
              value={feeEditForm.totalfees}
              onChange={handleEditChange}
            />
          </div>

          <div>
            <label
              htmlFor="noofinstallments"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              No of Installments
            </label>
            <input
              type="text"
              id="noofinstallments"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="noofinstallments"
              value={feeEditForm.noofinstallments}
              onChange={handleEditChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="feeperinstallment"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Fee Per Installment
            </label>
            <input
              type="text"
              id="feeperinstallment"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="feeperinstallment"
              value={feeEditForm.feeperinstallment}
              onChange={handleEditChange}
              required
            />
          </div>

          <div>
            <label
              htmlFor="feepaid"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Fee Paid
            </label>
            <input
              type="text"
              id="feepaid"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="feepaid"
              placeholder="-"
              value={feeEditForm.feepaid}
              onChange={handleEditChange}
            />
          </div>

          <div>
            <label
              htmlFor="duedate"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Due Date
            </label>
            <input
              type="text"
              id="duedate"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="duedate"
              placeholder="-"
              value={feeEditForm.duedate}
              onChange={handleEditChange}
            />
          </div>
          
        </div>

       

        {/* Save Button */}
        <button
          type="submit"
          className="w-full bg-green-600 py-2 rounded text-white hover:bg-green-500 mt-3"
          disabled={isSaving}
        >
          <span className="bi bi-file-earmark-arrow-up pr-1"></span>

          {isSaving && "Saving.."}
          {!isSaving && "Save"}
        </button>
      </form>
    </div>
  );
};

export default StudentFeeEdit;
