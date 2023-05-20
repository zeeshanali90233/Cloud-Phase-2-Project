import React, { useContext } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { db } from "../Firebase/config";
import "../Css/AllTransPage.css";
import * as XLSX from "xlsx";
import TransPagination from "../Components/TransPagination";
import PrintAllTransactions from "../Components/PrintAllTransactions";
import firebase from "firebase/compat/app";
import { useNavigate } from "react-router-dom";
import CSVDownload from "../Assets/Logos/CSVDownload.png";
import { adminUser } from "./AdminDashboard";
import { teacherUser } from "./TeacherDashboard";
import { studentUser } from "./StudentDashboard";
import { staffUser } from "./StaffDashboard";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import PrintSVG from "../Assets/Logos/PrintICON.png";
import moment from "moment";

// Modal MUI Style
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  bgcolor: "background.paper",
  border: "1px solid #0086c9",
  borderRadius: "23px",
  boxShadow: 24,
  p: 4,
};

const AllTransPage = ({ isTeacher, isAdmin, isStaff, isStudent }) => {
  const [allTrans, setAllTrans] = useState([]);
  const [transToPrint, setTransToPrint] = useState([]);
  const [selectedDates, setSelectedDates] = useState({
    from: moment().format("YYYY-MM-DD"),
    to: moment().format("YYYY-MM-DD"),
  });
  const [showPrintFilter, setShowPrintFilter] = useState(false);
 

  const handleShowPrintFilterClose = () => {
    setShowPrintFilter(false);
    setSelectedDates({
      from: moment().format("YYYY-MM-DD"),
      to: moment().format("YYYY-MM-DD"),
    });
  };
  const navigate = useNavigate();
  const userData = useContext(
    isAdmin
      ? adminUser
      : isStaff
      ? staffUser
      : isTeacher
      ? teacherUser
      : isStudent
      ? studentUser
      : ""
  );

  useEffect(() => {
    // Get the currently signed-in user
    const user = firebase.auth().currentUser;
    if (!user) {
      navigate("/");
    }

    const unsubscribe = db.collection("transactions").onSnapshot((snapshot) => {
      let postData = [];
      snapshot.forEach((doc) => {
        postData.push({ ...doc.data(), firebaseid: doc.id });
      });

      // For Admin
      if (isAdmin) {
        postData = postData.filter((data) => {
          if (
            data.to.toLowerCase().includes(userData.aid) ||
            data.from.includes(userData.aid)
          ) {
            return data;
          }
        });
      }

      // For Teacher
      if (isTeacher) {
        postData = postData.filter((data) => {
          if (
            data.to.toLowerCase().includes(userData.tid) ||
            data.from.includes(userData.tid)
          ) {
            return data;
          }
        });
      }
      // For Staff
      if (isStaff) {
        postData = postData.filter((data) => {
          if (
            data.isStudent && data.isStudent===true
          ) {
            return data;
          }
        });
      }
      // For Student
      if (isStudent) {
        postData = postData.filter((data) => {
          if (
            data.to.toLowerCase().includes(userData.sid) ||
            data.from.includes(userData.sid)
          ) {
            return data;
          }
        });
      }

      //Sorting Transaction Record on the basis of date and time
      setAllTrans(
        postData.sort(function (a, b) {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);

          if (dateA < dateB) {
            return 1;
          } else if (dateA > dateB) {
            return -1;
          } else {
            return 0;
          }
        })
      );
      setTransToPrint(
        postData.sort(function (a, b) {
          const dateA = new Date(`${a.date} ${a.time}`);
          const dateB = new Date(`${b.date} ${b.time}`);

          if (dateA < dateB) {
            return 1;
          } else if (dateA > dateB) {
            return -1;
          } else {
            return 0;
          }
        })
      );
    });

    return () => {
      // Unsubscribe listener when component unmounts
      unsubscribe();
    };
  }, []);

  function handleDateChange(e) {
    setSelectedDates({ ...selectedDates, [e.target.name]: e.target.value });
    if (e.target.name === "from") {
      let filteredTrans = allTrans.filter((transaction) => {
        const transactionDate = moment(transaction.date, "MMM-DD-YY");
        return (
          transactionDate.isSameOrAfter(
            moment(e.target.value).format("MMM-DD-YY")
          ) &&
          transactionDate.isSameOrBefore(
            moment(selectedDates.to).format("MMM-DD-YY")
          )
        );
      });
      setTransToPrint(filteredTrans);
    } else if (e.target.name === "to") {
      let filteredTrans = allTrans.filter((transaction) => {
        const transactionDate = moment(transaction.date, "MMM-DD-YY");
        return (
          transactionDate.isSameOrAfter(
            moment(selectedDates.from).format("MMM-DD-YY")
          ) &&
          transactionDate.isSameOrBefore(
            moment(e.target.value).format("MMM-DD-YY")
          )
        );
      });
      setTransToPrint(filteredTrans);
    }
  }

  const downloadData = (allTrans) => {
    // Reorder the data
    const reorderedData = allTrans.map((record) => [
      record.id,
      (record.stdname!==undefined)?record.stdname+"("+record.from+","+record.coursename+")":record.from,
      record.to,
      record.date,
      record.time,
    ]);

    // Add Subtitle
    reorderedData.unshift(["id", "from", "to", "date", "time"]);

    // Add Main Title
    reorderedData.unshift(["Transaction History", "", "", "", ""]);

    // Generate Worksheet
    const ws = XLSX.utils.aoa_to_sheet(reorderedData);

    // Merge cells for Main Title
    if (ws["A1"]) {
      ws["A1"] = {
        v: "Transaction History",
        s: {
          font: { sz: 16, bold: true },
          alignment: { horizontal: "center", vertical: "center" },
          mergeCells: "A1:E1",
        },
      };
    }

    // Add Subtitle styles
    for (let i = 2; i <= 6; i++) {
      if (ws[`A${i}`]) {
        ws[`A${i}`].s = { font: { sz: 14, bold: true } };
      }
    }

    // Generate Workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Transactions");

    // Download the Excel file
    XLSX.writeFile(wb, "transactions.xlsx");
  };

  return (
    <div>
      <div className="w-100 d-flex mt-2 justify-content-end">
        {/* Print all transaction */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={showPrintFilter}
          onClose={handleShowPrintFilterClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={showPrintFilter}>
            <Box sx={style}>
              {/* Title Input*/}
              <div className="d-flex flex-column col">
                <label htmlFor="video-title">
                  From:<span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="from"
                  name="from"
                  className="py-1 px-2 rounded "
                  value={selectedDates.from}
                  onChange={(e) => {
                    handleDateChange(e);
                  }}
                  required
                ></input>
              </div>
              {/* Video Youtube Link */}
              <div className="d-flex flex-column col">
                <label htmlFor="video-link">
                  To:<span className="required">*</span>
                </label>
                <input
                  type="date"
                  id="to"
                  name="to"
                  className="py-2 px-2 rounded "
                  value={selectedDates.to}
                  onChange={(e) => {
                    handleDateChange(e);
                  }}
                  required
                ></input>
              </div>

              {/* Save Button */}
              <div className="d-flex justify-content-center mt-2">
                <PrintAllTransactions allTransactionRecords={transToPrint} />
              </div>
            </Box>
          </Fade>
        </Modal>

        {/* Print Filter  */}
        <button
          className="btn-showAllTrans btn border mb-2"
          onClick={() => {
            setShowPrintFilter(true);

            let filteredTrans = allTrans.filter((transaction) => {
              const transactionDate = moment(transaction.date, "MMM-DD-YY");
              return (
                transactionDate.isSameOrAfter(
                  moment(selectedDates.from).format("MMM-DD-YY")
                ) &&
                transactionDate.isSameOrBefore(
                  moment(selectedDates.to).format("MMM-DD-YY")
                )
              );
            });
            setTransToPrint(filteredTrans);
          }}
        >
          <img src={PrintSVG} alt="" /> Print
        </button>
        {/* Download CSV button */}
        <button
          className="btn-showAllTrans btn border  mb-2 ms-2"
          onClick={() => {
            downloadData(allTrans);
          }}
        >
          <img src={CSVDownload} alt="" />
          Download
        </button>
      </div>
      <div className="titlebar w-100 bg-dark d-flex text-white ps-2 flex-sm-wrap text-center justify-content-center">
        All Transactions
      </div>
      {/* Paginations Listing all the transaction records */}
      {allTrans && allTrans.length !== 0 ? (
         <TransPagination data={allTrans} pageSize={10} showDeleteBtn={!isAdmin && !isStaff && !isStudent && !isTeacher}/>
      ) : (
        <div className="text-center">No Transaction Record</div>
      )}
    </div>
  );
};

export default AllTransPage;
