import React from "react";
import SAdminLayout from "../../../src/layouts/SAdminLayout";
import { useRouter } from "next/router";
import { db } from "../../../src/Firebase/config";
import { useState } from "react";
import { useContext } from "react";
import { user_Detail_Context } from "../../../context/userContext";
import { useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/storage";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Image from "next/image";

const myaccount = () => {
  const router = useRouter();
  const { user } = useContext(user_Detail_Context);
  const [superAdminForm, setSuperAdminForm] = useState(user);
  const [superAdminPhotoURL, setSuperAdminPhotoURL] = useState("");
  const [toEdit, setToEdit] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldpassword: "",
    newpassword: "",
    confirmpassword: "",
  });
  const [passResetModal, setPassResetModal] = useState(false);
  const [isChanging, setIsChanging] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    const fetchSAdmin = () => {
      const firebaseId = localStorage.getItem("sAdminUser");
      db.collection("superadmin")
        .doc(firebaseId || user.firebaseId)
        .onSnapshot((snapshot) => {
          setSuperAdminForm(snapshot.data());
          setSuperAdminPhotoURL(snapshot.data().superadminphoto.URL);
        });
    };
    fetchSAdmin();
  }, [router.query]);

  const closePasswordModal = (e) => {
    e && e.preventDefault();
    setPassResetModal(false);
  };
  const showPasswordModal = (e) => {
    e.preventDefault();
    setPassResetModal(true);
  };

  const showPassError = (err) => {
    setPasswordError(err);
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

  const handlePassChange = (e) => {
    e.preventDefault();
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
    showPassError("");
  };
  // It Validates the password
  function validatePassword(password) {
    // Check if password meets minimum length requirement
    if (password.length < 8) {
      return false;
    }

    // Check if password contains at least one uppercase letter, one lowercase letter, one number, and one special character
    var regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!regex.test(password)) {
      return false;
    }

    // Password meets all requirements
    return true;
  }

  const changePassword = (e) => {
    e.preventDefault();
    setIsChanging(true);
    if (passwordForm.newpassword !== passwordForm.confirmpassword) {
      showPassError("New and Confirm Password should be same");
    } else if (!validatePassword(passwordForm.newpassword)) {
      showPassError(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)."
      );
    } else {
      const user = firebase.auth().currentUser;
      const credentials = firebase.auth.EmailAuthProvider.credential(
        user.email,
        passwordForm.oldpassword
      );

      user
        .reauthenticateWithCredential(credentials)
        .then(() => {
          user.updatePassword(passwordForm.newpassword);
        })
        .then(() => {
          showSuccessToast();
          setIsChanging(false);
          setTimeout(() => {
            setIsChanging(false);
            closePasswordModal();
            firebase.auth().signOut();
            router.push("/sadmin/login");
          }, 1500);
        })

        .catch((err) => {
          showPassError("Incorrect Current Password");
          setIsChanging(false);
        });
    }
    setIsChanging(false);
  };

  // It downloads the files
  const handleDownload = (file, fileTitle = "") => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", file.URL, true);
    xhr.responseType = "blob";
    xhr.onload = function (event) {
      const blob = xhr.response;
      // Set the content-disposition header to specify the original file type and extension
      const contentDispositionHeader = `attachment; filename=${fileTitle}.${file.metadata.customMetadata.fileExtension};`;

      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `${fileTitle}.${file.metadata.customMetadata.fileExtension}`;
      link.setAttribute("style", "display: none;");
      link.setAttribute(
        "download",
        `${fileTitle}.${file.metadata.customMetadata.fileExtension}`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
    xhr.send();
  };

  const handleEditToggle = (e) => {
    e.preventDefault();
    setToEdit(!toEdit);
  };
  return (
    <SAdminLayout>
      <div className="main-content">
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
                onClick={showPasswordModal}
              >
                Reset Password
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
              {toEdit === false && (
                <span>
                  {" "}
                  <span className="bi bi-pen"></span> Turn Edit On
                </span>
              )}
              {toEdit === true && (
                <span>
                  {" "}
                  <span className="bi bi-pen"></span> Turn Edit Off
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Password Change Modal */}
        {/* Confirmation Modal */}
        <div
          className="fixed z-10 inset-0 overflow-y-auto"
          style={{ display: passResetModal ? "block" : "none" }}
        >
          <div className="flex items-end justify-center min-h-screen text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 transition-opacity"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={closePasswordModal}></div>
            </div>
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:pr-5 lg:pr-5"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <form onSubmit={changePassword}>
                <div className="bg-white sm:p-6 sm:pb-4 flex justify-center flex-col items-center w-full">
                  <div className=" text-center sm:mt-0 sm:ml-4 sm:text-left mt-1 w-full">
                    <label
                      htmlFor="oldpassword"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Old Password
                    </label>
                    <input
                      type="password"
                      id="oldpassword"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      name="oldpassword"
                      placeholder="Enter Old Password"
                      value={passwordForm.oldpassword}
                      required
                      onChange={handlePassChange}
                    />
                  </div>
                  <div className=" text-center sm:mt-0 sm:ml-4 sm:text-left mt-1 w-full">
                    <label
                      htmlFor="newpassword"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="newpassword"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      name="newpassword"
                      placeholder="Enter New Password"
                      value={passwordForm.newpassword}
                      required
                      onChange={handlePassChange}
                    />
                  </div>
                  <div className=" text-center sm:mt-0 sm:ml-4 sm:text-left mt-1 w-full">
                    <label
                      htmlFor="confirmpassword"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="confirmpassword"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      name="confirmpassword"
                      placeholder="Enter Confirm Password"
                      value={passwordForm.confirmpassword}
                      required
                      onChange={handlePassChange}
                    />
                    {passwordError.length !== 0 ? (
                      <span className="text-red-600">{passwordError}</span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className=" mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {!isChanging && "Change"}
                    {isChanging && "Changing..."}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={closePasswordModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </SAdminLayout>
  );
};

export default myaccount;
