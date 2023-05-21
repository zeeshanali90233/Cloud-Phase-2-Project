import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../Firebase/config";
import PrintFeeTransData from "./PrintFeeTransData";
import PrintTransData from "./PrintTransData";
import firebase from 'firebase/compat/app';

const DispAllTrans = ({ showDeleteBtn }) => {
  const [search, setSearch] = useState("");
  const [allTrans, setAllTrans] = useState([]);
  const router = useRouter();

  useEffect(() => {
    return db.collection("transactions").onSnapshot((snapshot) => {
      let data = [];
      snapshot.forEach((doc) => {
        data.push({ ...doc.data(), firebaseId: doc.id });
      });
      setAllTrans(data);
    });
  }, [router.query]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };


  const handleTranDelete = async (e, trans) => {
    e.preventDefault();
    if (window.confirm("Are you sure to delete this transactions")) {
      try {
        const querySnapshot = await db
          .collection("fees")
          .where("coursename", "==", trans.coursename)
          .where("name", "==", trans.stdname)
          .limit(1)
          .get();
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const feeRec = doc.data();
          const updatedPrevTrans = feeRec.previousTransactions.filter(
            (element) => {
              return !(
                element.amount === trans.amount &&
                element.date === trans.date &&
                element.from === trans.from &&
                element.isStudent === trans.isStudent &&
                element.to === trans.to &&
                element.time === trans.time
              );
            }
          );

          // Updating the Fees record
          await db
            .collection("fees")
            .doc(doc.id)
            .update({
              previousTransactions: updatedPrevTrans,
              feepaid: firebase.firestore.FieldValue.increment(-trans.amount),
            });

            // handleSuccessClick();
            await db.collection("transactions").doc(trans.firebaseId).delete();

        }
      } catch (error) {
        console.log(error);
        // handleErrorClick();
      }
    } else {
      return;
    }
  };


  return (
    <div className="container mx-auto min-h-screen max-w-screen-md ">
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
              placeholder="Search Transaction"
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
                From
              </th>
              <th scope="col" className="px-6 py-3">
                To
              </th>
              <th scope="col" className="px-6 py-3">
                Amount
              </th>
              <th scope="col" className="px-6 py-3">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Time
              </th>
              <th scope="col" className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {/* All Trans Map */}
            {allTrans.map((row) => {
              const isMatched =
                search.length === 0 ||
                row.id.includes(search) ||
                row.to.toLowerCase().includes(search.toLowerCase());

              const isStudentMatched =
                row.stdname && row.stdname !== undefined
                  ? row.stdname.toLowerCase().includes(search.toLowerCase()) ||
                    row.coursename.toLowerCase().includes(search.toLowerCase())
                  : row.from.includes(search);

              return isMatched || isStudentMatched ? (
                <tr
                  key={row.firebaseId}
                  className="  border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-slate-300 dark:hover:bg-gray-600"
                >
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
                    {row.stdname !== undefined
                      ? `${row.stdname}(${row.from},${row.coursename})`
                      : row.from}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {row.to}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {row.amount}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {row.date}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {row.time}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white flex justify-between"
                  >
                    {(showDeleteBtn && row.from[0] === "s")?(
                      <span
                        className="bi bi-trash cursor-pointer mr-1"
                        style={{ fontSize: "1.5rem" }}  
                        onClick={(e) => {
                            handleTranDelete(e, row);
                          }}
                      ></span>
                    ):<span></span>}
                    {row.from[0] === "s" ? (
                      <PrintFeeTransData transactionData={row} />
                    ) : (
                      <PrintTransData transactionData={row} />
                    )}
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


export default DispAllTrans;
