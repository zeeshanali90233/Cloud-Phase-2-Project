import React, { useContext } from "react";
import { useState } from "react";
import { db } from "../Firebase/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { user_Detail_Context } from "../../context/userContext";
import firebase from "firebase/compat/app";
import { useEffect } from "react";
import { useRouter } from "next/router";

const StudentFeeDetail = ({ studentFee, profilePic, setReRenderState }) => {
  const [feeChangings, setFeeChangings] = useState({
    feeToPay: "",
    duedate: "",
  });

  const [remarksForm,setRemarksForm]=useState(studentFee && studentFee.remarks);
  const router = useRouter();
  const [isSaving, setIsSaving] = useState("");
  const { user, setUser } = useContext(user_Detail_Context);

  useEffect(() => {
    const fetchUser = async () => {
      if (localStorage.getItem("sAdminUser")) {
        // Getting the id from local storage
        const userId = localStorage.getItem("sAdminUser");
        // Fetching the record from firebase
        const snapshot = await db.collection("superadmin").doc(userId).get();
        setUser({ ...snapshot.data(), firebaseId: snapshot.id });
      } else if (localStorage.getItem("adminUser")) {
        // Getting the id from local storage
        const userId = localStorage.getItem("adminUser");
        // Fetching the record from firebase
        const snapshot = await db.collection("students").doc(userId).get();
        setUser({ ...snapshot.data(), firebaseId: snapshot.id });
      } else if (localStorage.getItem("staffUser")) {
        // Getting the id from local storage
        const userId = localStorage.getItem("staffUser");
        // Fetching the record from firebase
        const snapshot = await db.collection("staff").doc(userId).get();
        setUser({ ...snapshot.data(), firebaseId: snapshot.id });
      } else if (localStorage.getItem("teacherUser")) {
        // Getting the id from local storage
        const userId = localStorage.getItem("teacherUser");
        // Fetching the record from firebase
        const snapshot = await db.collection("teacher").doc(userId).get();
        setUser({ ...snapshot.data(), firebaseId: snapshot.id });
      } else if (localStorage.getItem("studentUser")) {
        // Getting the id from local storage
        const userId = localStorage.getItem("studentUser");
        // Fetching the record from firebase
        const snapshot = await db.collection("students").doc(userId).get();
        setUser({ ...snapshot.data(), firebaseId: snapshot.id });
      }
    };

    fetchUser();
  }, [router.query]);
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

  const handleFeeChangings = (e) => {
    setFeeChangings({ ...feeChangings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      // Getting today date
      let today = new Date();
      let transDate = today.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "2-digit",
      });
      let transReceipt = {
        // Generating the unique id

        id: Date.now().toString(),
        stdname: studentFee.name,
        from: studentFee.sid,
        to: `${
          user.firstname.toUpperCase() + " " + user.lastname.toUpperCase()
        }(${
          user.said || user.aid || user.staffid
        },${user.designation.toUpperCase()})`,
        date: transDate,
        amount: Number(feeChangings.feeToPay),
        totalfees: studentFee.totalfees,
        feepaid: studentFee.feepaid,
        coursename: studentFee.coursename,
        previousTransactions: studentFee.previousTransactions || [],
        isStudent: true,
        time: new Date().toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      };

      let previousFeeRecord = {
        from: studentFee.sid,
        to: `${
          user.firstname.toUpperCase() + " " + user.lastname.toUpperCase()
        }(${
          user.said || user.aid || user.staffid
        },${user.designation.toUpperCase()})`,
        date: transDate,
        isStudent: true,
        amount: Number(feeChangings.feeToPay),
        time: new Date().toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      };

      await db.collection("transactions").add(transReceipt);

      await db
        .collection("fees")
        .doc(studentFee.firebaseId)
        .update({
          feepaid: firebase.firestore.FieldValue.increment(
            Number(feeChangings.feeToPay)
          ),
          duedate: feeChangings.duedate,
          previousTransactions:
            firebase.firestore.FieldValue.arrayUnion(previousFeeRecord),
        });

      showSuccessToast();
      setIsSaving(false);
      setReRenderState(Math.random());
      setFeeChangings({ feeToPay: "", duedate: "" });
    } catch (err) {
      showErrorToast();
      setIsSaving(false);
    }
  };

  const handleRemarksChange=(e)=>{
    e.preventDefault();
    setRemarksForm(e.target.value);
  }
  const handleRemarkSub = (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      remarksForm && db.collection("fees")
        .doc(studentFee.firebaseId)
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
    <div className="main-content mb-10">
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

      <div className="studentphoto w-100 d-flex justify-content-center mt-2 mb-1">
        <img
          src={
            (profilePic.length !== 0 && profilePic) ||
            "/no_profile_picture.jpeg"
          }
          alt="profile"
          className="rounded-circle"
          width={150}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label htmlFor="sid">ID:</label>
          <div className="border-b-2 border-blue-500 ">{studentFee.sid}</div>
        </div>
        <div>
          <label htmlFor="name">Name:</label>
          <div className="border-b-2 border-blue-500">{studentFee.name}</div>
        </div>
        <div>
          <label htmlFor="dob">Course Name:</label>
          <div className="border-b-2 border-blue-500">
            {studentFee.coursename}
          </div>
        </div>
        <div>
          <label htmlFor="gender">No of Installments:</label>
          <div className="border-b-2 border-blue-500 capitalize">
            {studentFee.noofinstallments}
          </div>
        </div>
        <div>
          <label htmlFor="address">Fee per Installment:</label>
          <div className="border-b-2 border-blue-500">
            {studentFee.feeperinstallment}
          </div>
        </div>
        <div>
          <label htmlFor="phonenumber">Others:</label>
          <div className="border-b-2 border-blue-500">
            {studentFee.other || "-"}
          </div>
        </div>
        <div>
          <label htmlFor="email">Total Fees:</label>
          <div className="border-b-2 border-blue-500">
            {studentFee.totalfees}
          </div>
        </div>
        <div>
          <label htmlFor="cnic">Fee Paid:</label>
          <div className="border-b-2 border-blue-500">{studentFee.feepaid}</div>
        </div>
        <div>
          <label htmlFor="parentname">Due Date(yyyy-mm-dd):</label>
          <div className="border-b-2 border-blue-500">{studentFee.duedate}</div>
        </div>
      </div>

      {/* Remarks Section */}
      <form onSubmit={handleRemarkSub}>

        <div className="remarksSec  mt-3 ">
          <button type="submit" className=" w-full py-1 addicon cursor-pointer bg-blue-500 text-center text-white rounded" disabled={remarksForm==studentFee.remarks ||  isSaving} >
          <i className="bi bi-plus-lg"></i>Save
          </button>
        <div className="w-full">
            <textarea
              type="text"
              id="remarks"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="remarks"
              rows={4}
              placeholder={studentFee.remarks || "Remarks"}
              value={remarksForm}
              onChange={handleRemarksChange}
            />
          </div>
        </div>
      </form>
      {/* Fee Pay Section */}
      <form onSubmit={handleSubmit}>
        <div className="feePay grid grid-cols-2 mt-3 gap-2">
          <div>
            <label
              htmlFor="feeToPay"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Fee Paid
            </label>
            <input
              type="text"
              id="feeToPay"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="feeToPay"
              placeholder="Enter Fee Paid"
              value={feeChangings.feeToPay}
              onChange={handleFeeChangings}
              required
            />
          </div>

          <div>
            <label
              htmlFor="dueDate"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Due Date
            </label>
            <input
              type="date"
              id="duedate"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              name="duedate"
              value={feeChangings.duedate}
              onChange={handleFeeChangings}
              required
            />
          </div>
        </div>

        {/* Pay Button */}
        <button
          type="submit"
          className="w-full bg-green-600 py-1 mt-2 rounded text-white hover:bg-green-500"
          disabled={isSaving}
        >
          <span className="bi bi-file-earmark-arrow-up pr-1"></span>

          {isSaving && "Saving.."}
          {!isSaving && "Pay&Save"}
        </button>
      </form>
    </div>
  );
};

export default StudentFeeDetail;
