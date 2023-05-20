import React, { useEffect, useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import StudentPagination from "../Components/StudentPagination";
import { db } from "../Firebase/config";
import firebase from "firebase/compat/app";
import { useNavigate } from "react-router-dom";
import AddStudentICON from "../Assets/Logos/AddStudentICON.png";
import "../Css/StudentPage.css";
import { staffUser } from "./StaffDashboard";
import * as XLSX from "xlsx";
import CSVDownload from "../Assets/Logos/CSVDownload.png";

const StudentPage = ({ isSuperAdmin, isAdmin, isStaff }) => {
  const staff = useContext(staffUser);
  const [studentData, setStudentData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Get the currently signed-in user
    var user = firebase.auth().currentUser;

    if (!user) {
      navigate("/");
    }
    return db.collection("students").onSnapshot((snapshot) => {
      let data = [];
      snapshot.forEach((doc) => {
        data.push({ ...doc.data(), firebaseId: doc.id });
      });
      setStudentData(data);
    });
  }, []);

  const downloadData = (studentRecords) => {
    // Reorder the data
    const reorderedData = studentRecords.map((record) => [
      record.sid,
      record.firstname,
      record.lastname,
      record.dob,
      record.gender,
      record.address,
      record.phone,
      record.email,
      record.cnic,
      record.parentname,
      record.parentphone,
      record.parentemail,
      record.parentcnic,
      record.batch,
      record.totalfees,
      record.emergencyname,
      record.emergencyphone,
      record.emergencyrelationship,
    ]);

    // Add Subtitle
    reorderedData.unshift([
      "ID",
      "FirstName",
      "LastName",
      "DOB",
      "Gender",
      "Address",
      "Phone Number",
      "Email",
      "CNIC",
      "Parent Name",
      "Parent Phone",
      "Parent Email",
      "Parent CNIC",
      "Enrolled Courses",
      "Total Fees",
      "Emergency Contact Name",
      "Emergency Contact Number",
      "Relationship",
    ]);

    // Add Main Title
    reorderedData.unshift(["Student Records"]);

    // Generate Worksheet
    const ws = XLSX.utils.aoa_to_sheet(reorderedData);

    // Merge cells for Main Title
    if (ws["A1"]) {
      ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 17 } }];
      ws["A1"] = {
        v: "Student Records",
        s: {
          font: { sz: 16, bold: true },
        },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }

    // Add Subtitle styles
    for (let i = 2; i <= 6; i++) {
      if (ws[`A${i}`]) {
        ws[`A${i}`].s = { font: { sz: 14, bold: true } };
      }
    }

    // Set column widths
    const columnWidths = [
      { wch: 5 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 10 },
      { wch: 25 },
      { wch: 15 },
      { wch: 20 },
      { wch: 15 },
      { wch: 15 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 15 },
      { wch: 25 },
      { wch: 20 },
      { wch: 15 },
    ];

    ws["!cols"] = columnWidths;

    // Generate Workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Student");

    // Download the Excel file
    XLSX.writeFile(wb, "student.xlsx");
  };

  return (
    <div className="studentSide">
      {/* Checking if the user is staff then this button will be visible on check */}
      {(
        isStaff
          ? staff && staff.studentauthority && staff.studentauthority.add
            ? true
            : false
          : true
      ) ? (
        <div className="d-flex justify-content-end w-100 mt-1 ">
          {/* Download CSV button */}
          <div>
            <button
              className="btn-showAllTrans btn border  mb-1 ms-2 mt-1"
              onClick={() => {
                downloadData(studentData);
              }}
            >
              <img src={CSVDownload} alt="" />
              Download
            </button>
          </div>

          <NavLink
            to={`/${
              isSuperAdmin
                ? "sadmin"
                : isAdmin
                ? "admin"
                : isStaff
                ? "staff"
                : ""
            }/dashboard/admission/add-student`}
            className="text-decoration-none border d-flex  align-items-center px-3 addstudent mx-1 py-2 rounded justify-content-center"
          >
            <div className="icon">
              <img src={AddStudentICON} alt="" width={30} />
            </div>
            <h5 className="text-dark text ">Add Student</h5>
          </NavLink>
        </div>
      ) : (
        ""
      )}

      <StudentPagination data={studentData} />
    </div>
  );
};

export default StudentPage;
