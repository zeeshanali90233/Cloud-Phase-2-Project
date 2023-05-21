import React from "react";
import { useState, useContext } from "react";
import { saReRenderContext } from "../../pages/sadmin/dashboard/courses/[id]";
import { staffReRenderContext } from "../../pages/staff/dashboard/courses/[id]";
import { db } from "../Firebase/config";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Comparator Function to sort attendance
const compareByDate = (a, b) => {
  const dateA = new Date(a.date);
  const dateB = new Date(b.date);

  if (dateA < dateB) {
    return 1; // a should come after b
  } else if (dateA > dateB) {
    return -1; // a should come before b
  } else {
    return 0; // a and b are equal
  }
};
const AttendancePagination = ({ enrolledStudentData }) => {
  const { course, setReRenderState } =useContext(saReRenderContext) || useContext(staffReRenderContext);
  const [attSearchForm, setAttSearchForm] = useState({
    selStdId: "",
    stdFilterId: "",
    completed: false,
  });

  const [attSearchModal, setAttSearchModal] = useState(false);
  const [attendanceDataPagination, setAttendanceDataPagination] = useState(
    course?.attendance?.sort(compareByDate)
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const showAttSearchModal = () => {
    setAttSearchModal(true);
  };
  const closeAttSearchModal = () => {
    setAttSearchModal(false);
    setAttSearchForm({ selStdId: "", stdFilterId: "", completed: false });
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

  //   It handles the attendance checkboxes changes
  const handleAttendanceCheckbox = (e, index, sid) => {
    e.preventDefault();
    let updatedAttendance = [...attendanceDataPagination];
    updatedAttendance[index].attendance[sid] =
      !updatedAttendance[index].attendance[sid];
    setAttendanceDataPagination(updatedAttendance);
  };
  const handleAttSearchChange = (e) => {
    if (e.target.name === "selStdId") {
      setAttSearchForm({
        ...attSearchForm,
        stdFilterId: e.target.value,
        selStdId: e.target.value,
      });
    } else {
      setAttSearchForm({ ...attSearchForm, [e.target.name]: e.target.value });
    }
  };

  const searchAtt = (e) => {
    e.preventDefault();
    let totalDays = 0;
    let totalPresentDays = 0;
    let totalAbsentDays = 0;
    let percentage = 0;
    attendanceDataPagination.map((attRow) => {
      if (attRow.attendance[attSearchForm.selStdId] !== undefined) {
        if (attRow.attendance[attSearchForm.selStdId]) {
          totalPresentDays++;
        }
        totalDays++;
      }
    });
    totalAbsentDays = totalDays - totalPresentDays;
    percentage = (totalPresentDays / totalDays) * 100;
    setAttSearchForm({
      ...attSearchForm,
      totalPresentDays,
      totalDays,
      totalAbsentDays,
      percentage,
      completed: true,
    });
  };

  const handleSaveAttendanceChanges = (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      db.collection("courses").doc(course.firebaseId).update({
        attendance: attendanceDataPagination,
      });
      setIsSaving(false);
      setReRenderState(Math.random());
      showSuccessToast();
    } catch (err) {
      setIsSaving(false);
      showErrorToast();
    }
  };

  return (
    <div className="attendance-pagination">
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

      {/* Search Modal */}
      <div
        className="fixed z-10 inset-0 overflow-y-auto select-none"
        style={{ display: attSearchModal ? "block" : "none" }}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 transition-opacity"
            aria-hidden="true"
            onClick={closeAttSearchModal}
          >
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <div
            className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full "
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-headline"
          >
            {attSearchForm.completed && (
              <div className="px-10 py-6">
                <div>
                  <label htmlFor="id">Student ID:</label>
                  <div className="border-b-2 border-blue-500">
                    {attSearchForm.selStdId || "-"}
                  </div>
                </div>
                <div>
                  <label htmlFor="id">Total Days:</label>
                  <div className="border-b-2 border-blue-500">
                    {attSearchForm.totalDays || "-"}
                  </div>
                </div>
                <div>
                  <label htmlFor="id">Total Presents:</label>
                  <div className="border-b-2 border-blue-500">
                    {attSearchForm.totalPresentDays || "-"}
                  </div>
                </div>
                <div>
                  <label htmlFor="id">Total Absents:</label>
                  <div className="border-b-2 border-blue-500">
                    {attSearchForm.totalAbsentDays || "-"}
                  </div>
                </div>
                <div>
                  <label htmlFor="id">Present Percentage:</label>
                  <div className="border-b-2 border-blue-500">
                    {Math.round(attSearchForm.percentage)}%
                  </div>
                </div>
              </div>
            )}
            {!attSearchForm.completed && (
              <form onSubmit={searchAtt}>
                <div className="bg-white px-3 pt-2 pb-1 sm:p-6 sm:pb-2 flex justify-center flex-col items-center">
                  <div className=" flex flex-col w-full">
                    <div className=" block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                      <label
                        htmlFor="selStdId"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Student Name
                      </label>
                      <select
                        id="selStdId"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        name="selStdId"
                        value={attSearchForm.selStdId}
                        onChange={handleAttSearchChange}
                        required
                      >
                        <option value="">Select Student</option>
                        {enrolledStudentData.map((std) => {
                          return attSearchForm.stdFilterId.length === 0 ||
                            std.sid.includes(
                              attSearchForm.stdFilterId.toLowerCase()
                            ) ? (
                            <option value={std.sid} key={std.firebaseId}>
                              {" "}
                              {std.firstname + " " + std.lastname}({std.sid})
                            </option>
                          ) : (
                            ""
                          );
                        })}
                      </select>
                    </div>
                    <div>
                      <label
                        htmlFor="stdFilterId"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Student ID
                      </label>
                      <input
                        type="text"
                        id="stdFilterId"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        name="stdFilterId"
                        value={attSearchForm.stdFilterId}
                        onChange={handleAttSearchChange}
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className=" mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    {!isSearching && "Search"}
                    {isSearching && "Searching..."}
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={closeAttSearchModal}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/*Attendance Save & Search Button */}
      <div className="flex items-center justify-center ">
        <button
          className="bg-green-500 w-full rounded text-white hover:bg-green-400"
          onClick={handleSaveAttendanceChanges}
        >
          {!isSaving && "Save"}
          {isSaving && "Saving..."}
        </button>
        <acronym title="Search Student Attendance">
          <div
            className=" flex items-center pl-3 cursor-pointer"
            onClick={showAttSearchModal}
          >
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400 "
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        </acronym>
      </div>
      <div className=" mx-auto relative overflow-x-auto shadow-md sm:rounded-lg max-w-4xl">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 overflow-x-auto">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 ">
            <tr>
              <th className="text-center px-3">Sr.</th>
              <th>Name</th>
              {attendanceDataPagination.map((attendance) => {
                return (
                  <th scope="col" className="px-6 py-3">
                    <div className="d-flex flex-column justify-content-center align-items-center">
                      <span>L-{attendance.lecturenumber}</span>
                      <span>{attendance.date}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {enrolledStudentData.map((row, index) => {
              return (
                <tr
                  className="bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                  key={row.firebaseId}
                >
                  <th className="text-center"> {index + 1}</th>
                  <th
                    scope="row"
                    className="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white cursor-pointer "
                  >
                    {row.firstname + " " + row.lastname + "(" + row.sid + ")"}
                  </th>

                  {attendanceDataPagination.map((attendance, index) => {
                    return index === 0 ? (
                      <td className="text-center">
                        <input
                          type="checkbox"
                          name=""
                          id=""
                          onChange={(e) => {
                            handleAttendanceCheckbox(e, index, row.sid);
                          }}
                          checked={attendance.attendance[row.sid]}
                        />
                      </td>
                    ) : (
                      <td className="text-center">
                        {attendance.attendance[row.sid]
                          ? "P"
                          : attendance.attendance[row.sid] !== undefined
                          ? "A"
                          : "-"}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendancePagination;
