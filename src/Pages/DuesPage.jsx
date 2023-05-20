import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { db } from "../Firebase/config";
import moment from "moment";
import "../Css/DuesPage.css";
import {  useNavigate } from "react-router-dom";
import DuesPagination from "../Components/DuesPagination";
import firebase from "firebase/compat/app";

import { createContext } from "react";


export const isSuperAdminForTransaction=createContext("");
const DuesPage = ({isSuperAdmin,isAdmin}) => {
  // It contais the Employees whom the salary is given
  const [salaryRecords, setSalaryRecords] = useState([]);
  // It contais the Employees whom the salary is not given yet
  const [fetchRender, setFetchRender] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setFetchRender(true);
  }, []);
  useEffect(() => {
    // Get the currently signed-in user
    var user = firebase.auth().currentUser;

    if (!user) {
      navigate("/");
    }

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
        postData.push({  ...doc.data(), firebaseId: doc.id });
      });
      //   Refining he data in to two categories , 1) Salary Paid and 2) Salary not paid
      setSalaryRecords(
        postData.filter((salary) => {
          return ((isSuperAdmin || salary.id[0] !== "a"));
        })
      );

    
    });
  }, [fetchRender]);
  return (
    <div className="duesSide">
      <div className="title text-center">
        <h1>Staff Salary</h1>
      </div>
      {salaryRecords!==0? (
        <>
          <div className="titlebar w-100 bg-dark d-flex text-white ps-2 flex-sm-wrap justify-content-between flex-fill">
            <isSuperAdminForTransaction.Provider value={isSuperAdmin}>

            <DuesPagination data={[...salaryRecords]}/>
            </isSuperAdminForTransaction.Provider>
          </div>
        </>
      ) : (
        ""
      )}
    </div>
  );
};

export default DuesPage;
