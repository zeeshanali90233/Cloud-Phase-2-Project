import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";
import { db } from "../Firebase/config";
import firebase from "firebase/compat/app";
import { user_Detail_Context } from "../../context/userContext";

//It checks whether the props date is passed or not
function isDueDatePassed(dueDate) {
  const currentDate = new Date();
  const dueDateObject = new Date(dueDate + ", " + new Date().getFullYear());
  return dueDateObject.getTime() < currentDate.getTime();
}

const DispAllFees = ({ isStaff }) => {
  const [search, setSearch] = useState("");
  const [studentFees, setStudentFees] = useState([]);
  const router = useRouter();
  const { user } = useContext(user_Detail_Context);

  // It retreives all the student fees records
  useEffect(() => {
    // Get the currently signed-in user
    var user = firebase.auth().currentUser;

    if (!user) {
      localStorage.clear();
      router.push("/");
    }

    return db.collection("fees").onSnapshot((snapshot) => {
      const postData = [];
      snapshot.forEach((doc) =>
        postData.push({ ...doc.data(), firebaseId: doc.id })
      );
      postData.sort((a, b) => {
        return new Date(a.duedate) - new Date(b.duedate);
      });
      setStudentFees(postData);
    });
  }, [router.query]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleClick = (firebaseId) => {

    // Not Staff
    if(!isStaff){
      router.push(router.pathname + "/" + firebaseId);
    }
    else if(user&& user.feesauthority && user.feesauthority.add){ //For Staff
        router.push(router.pathname + "/" + firebaseId);
    }
  };

  return (
    <div className="container mx-auto min-h-screen ">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg ">
        <div className="flex items-center justify-center pb-4 ">
          <label htmlFor="table-search" className="sr-only">
            Search
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-500 dark:text-gray-400"
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
            <input
              type="text"
              id="table-search"
              name="search"
              onChange={handleSearchChange}
              className="ml-10 block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Search Student"
            />
          </div>
        </div>
        
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Total Fees
              </th>
              <th scope="col" className="px-6 py-3">
                Fee Per Installment
              </th>
              <th scope="col" className="px-6 py-3">
                Fee Paid
              </th>
              <th scope="col" className="px-6 py-3">
                Due Date
              </th>
              <th scope="col" className="px-6 py-3">
                Course
              </th>
            </tr>
          </thead>
          <tbody>
            {/* All Students Fees Map */}
            {studentFees.map((row) => {
              const [searchCourseName, searchStudentId] = search.split("/");
              const isMatched =
                (searchCourseName
                  ? row.sid.includes(search.toLowerCase()) ||
                    row.coursename
                      .toLowerCase()
                      .includes(searchCourseName.toLowerCase()) ||
                    row.name.toLowerCase().includes(search.toLowerCase())
                  : true) &&
                (searchStudentId
                  ? row.sid
                      .toLowerCase()
                      .includes(searchStudentId.toLowerCase()) ||
                    row.name
                      .toLowerCase()
                      .includes(searchStudentId.toLowerCase())
                  : true);

              return isMatched ? (
                <tr
                  key={row.firebaseId}
                  onClick={() => {
                    handleClick(row.firebaseId);
                  }}
                  className={`cursor-pointer hover:bg-slate-300 border-b dark:bg-gray-800 dark:border-gray-700  dark:hover:bg-gray-600 ${
                    isDueDatePassed(row.duedate) && row.feepaid < row.totalfees
                      ? "bg-red-600"
                      : ""
                  }`}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {row.sid}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {row.name}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {row.totalfees}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {row.feeperinstallment}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {row.feepaid}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {row.duedate}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {row.coursename}
                  </th>
                </tr>
              ) : null;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DispAllFees;
