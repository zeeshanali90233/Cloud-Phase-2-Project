import React, { useState, useContext } from "react";
import { user_Detail_Context } from "../../context/userContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../Firebase/config";
import firebase from "firebase/compat/app";

const CourseMsgModal = ({ enrolledStudents, closeMsgModal }) => {
  const [isSending, setIsSending] = useState(false);
  const [msgForm, setMsgForm] = useState({ msgContent: "" });
  const { user } = useContext(user_Detail_Context);

  const handleChange = (e) => {
    e.preventDefault();
    setMsgForm({ ...msgForm, [e.target.name]: e.target.value });
  };

  const showSuccessToast = () => {  
    toast.success("Successfully Send", {
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


  const sendMessage = (e) => {
    e.preventDefault();
    setIsSending(true);
    try{
    // Current Date
    let today = new Date();
    let currentDate = today.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "2-digit",
    });

    // Current Time
    let currentTime = new Date().toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
    enrolledStudents.map((studentId) => {
      // Updating the students
      db.collection("students")
        .doc(studentId)
        .update({
          assignedrole: firebase.firestore.FieldValue.arrayUnion({
            role: msgForm.msgContent,
            date: currentDate,
            time: currentTime,
            assignedby: `${
              user.firstname + " " + user.lastname + "(" + (user.said ||user.tid||user.staffid) + ")"
            }`,
          }),
        })
    });
    setIsSending(false);
    showSuccessToast();
    closeMsgModal();
}
catch(err){
    setIsSending(false);
    showErrorToast();
    console.log(err);
}
  };
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto select-none">
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
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity"
          aria-hidden="true"
          onClick={closeMsgModal}
        >
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full "
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <form onSubmit={sendMessage}>
            <div className="bg-white px-3 pt-2 pb-1 sm:p-6 sm:pb-2 flex justify-center flex-col items-center">
              <div className=" flex flex-col w-full">
                <div className=" block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  <textarea
                    id="msgContent"
                    rows="4"
                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Write your message here..."
                    name="msgContent"
                    value={msgForm.msgContent || ""}
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
                {!isSending && "Send"}
                {isSending && "Sending..."}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={closeMsgModal}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CourseMsgModal;
