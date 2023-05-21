import React from "react";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../Firebase/config";

const DueEdit = ({ dueRec, setReRenderState }) => {
  const [dueForm, setDueForm] = useState(dueRec);
  const [isSaving,setIsSaving]=useState(false);

  const handleChange = (e) => {
    e.preventDefault();
    setDueForm({ ...dueForm, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    try{
      db.collection("salaries")
      .doc(dueRec.firebaseId)
      .update({
        name: dueForm.name,
        salary: dueForm.salary,
      })
      setIsSaving(false);
      setReRenderState(Math.random());
      showSuccessToast();
    }catch(err){
      setIsSaving(false);
      showErrorToast();
    }
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

  return (
    <div className="due-change-container">
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

      <form onSubmit={handleSubmit}>
        <div className="due-form grid gap-3 grid-cols-2">
        <div>
            <label
              htmlFor="id"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              ID
            </label>
            <input
              type="text"
              id="id"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="id"
              value={dueForm.id}
              onChange={handleChange}
              disabled
            />
          </div>


        <div>
            <label
              htmlFor="name"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Employee Name
            </label>
            <input
              type="text"
              id="name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="name"
              value={dueForm.name}
              onChange={handleChange}
            />
          </div>


        <div>
            <label
              htmlFor="salary"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Salary(PKR)
            </label>
            <input
              type="text"
              id="salary"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="salary"
              value={dueForm.salary}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
        type="submit"
        className="w-full bg-green-600 py-1 mt-2 rounded text-white hover:bg-green-500"
        disabled={isSaving}
      >
        <span className="bi bi-file-earmark-arrow-up pr-1"></span>
        {!isSaving &&"Save"}
        {isSaving &&"Saving..."}
      </button>
      </form>
    </div>
  );
};

export default DueEdit;
