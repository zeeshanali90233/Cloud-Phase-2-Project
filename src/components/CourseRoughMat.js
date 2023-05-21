import React, { useContext } from "react";
import { saReRenderContext } from "../../pages/sadmin/dashboard/courses/[id]";
import { staffReRenderContext } from "../../pages/staff/dashboard/courses/[id]";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";
import { useState } from "react";
import CourseRoughPagination from "./CourseRoughPagination";
import { db } from "../Firebase/config";
import firebase from "firebase/compat/app";

const CourseRoughMat = () => {
  const { course, setReRenderState,hideAddRoughMaterialButton } = useContext(saReRenderContext) || useContext(staffReRenderContext);
  const [showRoughMBox, setShowRoughMBox] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [roughMaterialForm, setRoughMaterialForm] = useState({});

  const closeRoughBox = () => {
    setShowRoughMBox(false);
    setRoughMaterialForm({});
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

  const handleChange = (e) => {
    e.preventDefault();
    setRoughMaterialForm({ [e.target.name]: e.target.value });
  };

  const saveRoughMaterial = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const coursesUpdate = await db
        .collection("courses")
        .doc(course.firebaseId)
        .update({
          roughMaterial: firebase.firestore.FieldValue.arrayUnion(
            roughMaterialForm.roughcontent
          ),
        });
      setIsSaving(false);
      setReRenderState(Math.random());
      closeRoughBox();
      showSuccessToast();
    } catch (err) {
      setIsSaving(false);
      showErrorToast();
      console.log(err);
    }
  };

  return (
    <div className="mb-32">
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
      <div className="title bg-dark  text-center text-white w-100 mt-3 rounded">
        <h5 className="text-white">Rough Material</h5>
      </div>

      <div className="panel flex justify-evenly mt-1">
        {!hideAddRoughMaterialButton && (
          <div
            className="cursor-pointer max-w-xs py-3 px-2 text-center bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700"
            onClick={() => {
              setShowRoughMBox(!showRoughMBox);
            }}
          >
            <div className="logo border-2 border-blue-500 rounded-full ">
              <Image
                src={"/logos/RoughMaterialICON.png"}
                width={40}
                height={40}
              />
            </div>
            <div className="text font-bold">Add Rough Material</div>
          </div>
        )}
      </div>

      {/*Rough Material Modal */}
      <div
        className="fixed z-10 inset-0 overflow-y-auto select-none"
        style={{ display: showRoughMBox ? "block" : "none" }}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 transition-opacity"
            aria-hidden="true"
            onClick={closeRoughBox}
          >
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <div
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full "
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            <form onSubmit={saveRoughMaterial}>
              <div className="bg-white px-3 pt-2 pb-1 sm:p-6 sm:pb-2 flex justify-center flex-col items-center">
                <div className=" flex flex-col w-full">
                  <div className=" block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    <textarea
                      id="roughcontent"
                      rows="4"
                      className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Write your content here..."
                      name="roughcontent"
                      value={roughMaterialForm.roughcontent || ""}
                      required
                      onChange={handleChange}
                    ></textarea>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="submit"
                  className=" mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {!isSaving && "Save"}
                  {isSaving && "Saving..."}
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={closeRoughBox}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {course&& course.roughMaterial && course.roughMaterial.length!==0&& <CourseRoughPagination  />}
    </div>
  );
};

export default CourseRoughMat;
