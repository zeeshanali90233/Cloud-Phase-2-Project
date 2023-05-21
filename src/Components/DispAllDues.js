import { useRouter } from "next/router";
import React from "react";
import { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import { db } from "../Firebase/config";
import moment from "moment";

const DispAllDues = ({ showAdmin }) => {
  const [salaryRecords, setSalaryRecords] = useState([]);
  const [search, setSearch] = useState("");
  const router = useRouter();
  useEffect(() => {
    // Get the currently signed-in user
    var user = firebase.auth().currentUser;

    // if (!user) {
    //   router.push("/");
    // }

    return db.collection("salaries").onSnapshot((snapshot) => {
      const postData = [];
      // get the current date
      const today = new Date();
      const dd = String(today.getDate()).padStart(2, "0");
      const mm = String(today.getMonth() + 1).padStart(2, "0"); // January is 0!
      const yyyy = today.getFullYear();
      const currentDate = `${dd}-${mm}-${yyyy}`;
      snapshot.forEach((doc) => {
        const currentMonth = new Date().getMonth() + 1;
        const month = moment(doc.data().date, "DD-MM-YYYY").format("MM");
        if (month < currentMonth && doc.data().paid) {
          doc.ref.update({
            date: currentDate,
            paid: false,
          });
        }
        postData.push({ ...doc.data(), firebaseId: doc.id });
      });

      setSalaryRecords(
        postData.filter((salary) => {
          return showAdmin || salary.id[0] !== "a";
        })
      );
    });
  }, [router.query]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };


  const handleClick=(id)=>{
    router.push(router.asPath+"/"+id);
  }

  return (
    <div className="all-dues">
      {/* Course Search Bar */}
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
            placeholder="Search Staff"
          />
        </div>
      </div>

      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <td scope="col" className="px-6 py-3">
                    Profile
                </td>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Salary
              </th>
              <th scope="col" className="px-6 py-3">
                Month
              </th>
              <th scope="col" className="px-6 py-3">
               Status
              </th>
            </tr>
          </thead>
          <tbody>
            {/* All Students Fees Map */}
            {salaryRecords.map((row) => {
              const isMatched =
              (row.id.includes(search.toLowerCase()) || row.name.toLowerCase().includes(search.toLowerCase())|| (moment(row.date, "DD-MM-YYYY").format("MMM")).toLowerCase().includes(search.toLowerCase()) || search.length===0)

              return isMatched ? (
                <tr
                  key={row.firebaseId}
                  onClick={() => {
                    handleClick(row.firebaseId);
                  }}
                  className={`cursor-pointer hover:bg-slate-300 border-b dark:bg-gray-800 dark:border-gray-700  dark:hover:bg-gray-600`}
                >
                    <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <img
                      src={row.photoURL.URL || "/no_profile_picture.jpeg"}
                      alt="profile"
                      className="rounded-circle"
                      width="45"
                      height="45"
                    />
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {row.id}
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
                    {row.salary}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                     {moment(row.date, "DD-MM-YYYY").format("MMM")}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                   {row.paid ? "Paid" : "Not Paid"}
                  </th>
                </tr>
              ) : null;
            })}
          </tbody>
        </table>


    </div>
  );
};

export default DispAllDues;
