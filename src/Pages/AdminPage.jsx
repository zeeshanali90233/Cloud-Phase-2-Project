import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import AdminPagination from "../Components/AdminPagination";
import { db } from "../Firebase/config";
import AddSuperAndAdminICON from "../Assets/Logos/AddSuperAndAdminICON.png";
import * as XLSX from "xlsx";
import CSVDownload from "../Assets/Logos/CSVDownload.png";

const AdminPage = () => {
  const [admin, setAdmin] = useState([]);
  useEffect(() => {
    db.collection("admin").onSnapshot((snapshot) => {
      let data = [];
      snapshot.forEach((doc) => {
        data.push({ ...doc.data(), firebaseId: doc.id });
      });
      setAdmin(data);
    });
  }, []);

  const downloadData = (adminRecords) => {
    // Reorder the data
    const reorderedData = adminRecords.map((record) => [
      record.aid,
      record.firstname,
      record.lastname,
      record.dob,
      record.gender,
      record.address,
      record.phone,
      record.email,
      record.cnic,
      record.education,
      record.institutename,
      record.passingyear,
      record.obtcgpa,
      record.designation,
      record.initsalary,
      record.emergencyname,
      record.emergencyphone,
      record.emergencyrelationship,
      record.canmanagesalary ? "Yes" : "No",
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
      "Qualification",
      "Institute Name",
      "Passing Year",
      "CGPA",
      "Designation",
      "Salary(PKR)",
      "Emergency Contact Name",
      "Emergency Contact Number",
      "Relationship",
      "Manage Salary",
    ]);

    // Add Main Title
    reorderedData.unshift(["Admin Records"]);

    // Generate Worksheet
    const ws = XLSX.utils.aoa_to_sheet(reorderedData);

    // Merge cells for Main Title
    if (ws["A1"]) {
      ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 18 } }];
      ws["A1"] = {
        v: "Admin Records",
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
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
      { wch: 20 },
    ];

    ws["!cols"] = columnWidths;

    // Generate Workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "admin");

    // Download the Excel file
    XLSX.writeFile(wb, "admin.xlsx");
  };

  return (
    <div className="adminSide">
      <div className="d-flex justify-content-end w-100 mt-1 mb-2">
        {/* Download CSV button */}
        <div className=" px-2">
          <button
            className="btn-showAllTrans btn border  mb-1 ms-2 "
            onClick={() => {
              downloadData(admin);
            }}
          >
            <img src={CSVDownload} alt="" />
            Download
          </button>
        </div>

        <NavLink to="add-admin" className="text-decoration-none">
          <button className="btn-showAllTrans  border edit d-flex px-2 py-2 align-items-center rounded justify-content-center">
            <div className="icon">
              <img src={AddSuperAndAdminICON} alt="" width={20} />
            </div>
            <div className="text-dark text ">Add Admin</div>
          </button>
        </NavLink>

        <NavLink to="add-sadmin" className="text-decoration-none">
          <button className="btn-showAllTrans  border edit d-flex px-2 py-2 align-items-center rounded justify-content-center ms-1">
            <div className="icon">
              <img src={AddSuperAndAdminICON} alt="" width={20} />
            </div>
            <div className="text-dark text ">Add Super Admin</div>
          </button>
        </NavLink>
      </div>
      <AdminPagination data={admin} />
    </div>
  );
};

export default AdminPage;
