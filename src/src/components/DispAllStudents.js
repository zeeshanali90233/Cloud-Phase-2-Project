import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { db } from "../Firebase/config";
import * as XLSX from "xlsx";
import { useContext } from "react";
import { user_Detail_Context } from "../../context/userContext";

const DispAllStudents = ({isStaff}) => {
  const [search, setSearch] = useState("");
  const [allStudents, setAllStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState(allStudents);
  const router = useRouter();
  const {user,setUser}=useContext(user_Detail_Context);

  useEffect(() => {
    return db.collection("students").onSnapshot((snapshot) => {
      let data = [];
      snapshot.forEach((doc) => {
        data.push({ ...doc.data(), firebaseId: doc.id });
      });
      setAllStudents(data);
      setFilteredStudents(data);
    });
  }, [router.query]);
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    let filtered =allStudents.filter((row)=>{
      const [searchCourseName, searchStudentId] = e.target.value.split("/");
      const isMatched =
        (searchCourseName
          ? row.sid.includes(e.target.value.toLowerCase()) ||
            row.batch.some((batchName) =>
              batchName
                .toLowerCase()
                .includes(searchCourseName.toLowerCase())
            ) ||
            row.firstname
              .toLowerCase()
              .includes(searchCourseName.toLowerCase()) ||
            row.lastname
              .toLowerCase()
              .includes(searchCourseName.toLowerCase())
          : true) &&
        (searchStudentId
          ? row.sid
              .toLowerCase()
              .includes(searchStudentId.toLowerCase()) ||
            row.firstname
              .toLowerCase()
              .includes(searchStudentId.toLowerCase()) ||
            row.lastname
              .toLowerCase()
              .includes(searchStudentId.toLowerCase())
          : true);


          return isMatched;

    })

    setFilteredStudents(filtered);
  };

  const handleClick = (firebaseId) => {
   // Not Staff
   if(!isStaff){
    router.push(router.pathname + "/" + firebaseId);
  }
  else if(user&& user.studentauthority &&  user.studentauthority.add){ //For Staff
      router.push(router.pathname + "/" + firebaseId);
  }
  };

  const downloadData = () => {
    // Reorder the data
    const reorderedData = filteredStudents.map((record) => [
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
      "Total Fees(PKR)",
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
    XLSX.writeFile(wb, "students.xlsx");
  };

  return (
    <div className="container mx-auto min-h-screen ">
      {/* Download Button */}
      <div className="d-flex  justify-center lg:justify-end md:justify-end  w-100 ">
        <div>
          <button
            type="submit"
            id="edit-button"
            className="border rounded px-2 py-1 w-[140px] ml-1 hover:bg-blue-600 hover:text-white"
            onClick={downloadData}
          >
            <i class="bi bi-cloud-download  px-1"></i>
            Download
          </button>
        </div>
      </div>

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
                Student Photo
              </th>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              <th scope="col" className="px-6 py-3">
                Type
              </th>
              <th scope="col" className="px-6 py-3">
                Courses
              </th>
            </tr>
          </thead>
          <tbody>
            {/* All Students Map */}
            {allStudents.map((row) => {
              const [searchCourseName, searchStudentId] = search.split("/");
              const isMatched =
                (searchCourseName
                  ? row.sid.includes(search.toLowerCase()) ||
                    row.batch.some((batchName) =>
                      batchName
                        .toLowerCase()
                        .includes(searchCourseName.toLowerCase())
                    ) ||
                    row.firstname
                      .toLowerCase()
                      .includes(searchCourseName.toLowerCase()) ||
                    row.lastname
                      .toLowerCase()
                      .includes(searchCourseName.toLowerCase())
                  : true) &&
                (searchStudentId
                  ? row.sid
                      .toLowerCase()
                      .includes(searchStudentId.toLowerCase()) ||
                    row.firstname
                      .toLowerCase()
                      .includes(searchStudentId.toLowerCase()) ||
                    row.lastname
                      .toLowerCase()
                      .includes(searchStudentId.toLowerCase())
                  : true);

              return isMatched ? (
                <tr
                  key={row.firebaseId}
                  onClick={() => {
                    handleClick(row.firebaseId);
                  }}
                  className="cursor-pointer hover:bg-slate-300 border-b dark:bg-gray-800 dark:border-gray-700  dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <img
                      src={row.studentphoto.URL || "/no_profile_picture.jpeg"}
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
                    {row.sid.toUpperCase()}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {row.firstname + " " + row.lastname}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {row.type.toUpperCase()}
                  </th>
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {row.batch.join(",")}
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

export default DispAllStudents;
