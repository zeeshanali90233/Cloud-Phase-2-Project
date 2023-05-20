import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import PrintSVG from "../Assets/Logos/PrintICON.png";
import orgLogo from "../Assets/Logos/organization_Logo.png";
import Chart from "chart.js/auto";
import TextField from "@mui/material/TextField";
import { Pie } from "react-chartjs-2";
import FeePagination from "../Components/FeePagination";

export const PrintCourseFinance = ({ courseFinanceDetail }) => {
  let componentRef = useRef();
  const printDate = new Date().toLocaleString();

  const studentFeeLabel = ["Fee Paid", "Fee Not Paid"];
  const studentFeePieChart = {
    labels: studentFeeLabel,
    datasets: [
      {
        label: "Students Fee",
        backgroundColor: ["#00c3ff", "#f7bf41"],
        borderColor: "#393c41",
        data: [
          courseFinanceDetail.totalFeesPaid,
          courseFinanceDetail.totalFeesRemaining,
        ],
      },
    ],
    
  };

  return (
    <>
      <ReactToPrint
        trigger={() => (
          <button className="btn mb-2">
            <img src={PrintSVG} alt="" />
          </button>
        )}
        content={() => componentRef}
      />
      <div style={{ display: "none" }}>
        <div
          id="printContainer"
          ref={(el) => (componentRef = el)}
          style={{ marginLeft: "20px" }}
        >
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "14px" }}>{printDate}</p>
          </div>
          <img src={orgLogo} alt="" width={50} className="text-center mx-auto" />

          <div  style={{ textAlign: "center" }} className="w-100">

          <img src={orgLogo} alt="" width={120} className="text-center mx-auto" />
          </div>
          <h1
          className="mt-3"
            style={{
              textAlign: "center",
              fontSize: "35px",
              marginBottom: "20px",
            }}
          >
            Course Finance Receipt
          </h1>

          {/* // Displaying the report */}
          <div className="w-100 mt-2 ">
            <div className="course-info container">
              <div className="row">
                <div className="d-flex flex-column col">
                  <TextField
                    id="standard-basic"
                    label="ID"
                    variant="standard"
                    value={courseFinanceDetail.courseId}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </div>
                <div className="d-flex flex-column col">
                  <TextField
                    id="standard-basic"
                    label="Name"
                    variant="standard"
                    value={courseFinanceDetail.courseName}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </div>
              </div>

              <div className="row">
                <div className="d-flex flex-column col">
                  <TextField
                    id="standard-basic"
                    label="Duration"
                    variant="standard"
                    value={`${courseFinanceDetail.courseDuration} Months`}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </div>
                <div className="d-flex flex-column col">
                  <TextField
                    id="standard-basic"
                    label="Remaining(Month&Days)"
                    variant="standard"
                    value={`${courseFinanceDetail.remainingMonths} Months ${courseFinanceDetail.remainingDays} Days`}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="student-fee-chart text-center " style={{marginLeft:"250px"}}>
              <Pie data={studentFeePieChart} style={{ width: "auto", height: "auto" }} options={{ responsive: false }}/>
            </div>

            <div className="panels  mt-3 flex-wrap mx-auto container pe-4">
              {/* Panels showing the data */}
              {/* Total Course Fees */}
              <div className="panel border totalfees  d-flex flex-column px-3 py-2 align-items-center rounded justify-content-center">
                <h4 className="text-dark text">Expected Fees</h4>
                <h4>{courseFinanceDetail.totalFees}PKR</h4>
              </div>
              {/* Total Fee Paid Percentage */}
              <div className="panel border totalfees  d-flex flex-column px-3 py-2 align-items-center rounded justify-content-center">
                <h4 className="text-dark text">Total Fee Paid</h4>
                <h4>{courseFinanceDetail.feePaidPercentage}%</h4>
              </div>

              {/* Total Fee Remaining Percentage */}
              <div className="panel border totalfees  d-flex flex-column px-3 py-2 align-items-center rounded justify-content-center">
                <h4 className="text-dark text">Remaining Fee</h4>
                <h4>{courseFinanceDetail.feeRemainingPercentage}%</h4>
              </div>

              <div className="panel border totalfees  d-flex flex-column px-3 py-2 align-items-center rounded justify-content-center">
                <h4 className="text-dark text">Fee Defaulters</h4>
                <h4>{courseFinanceDetail.numDefaulters}</h4>
              </div>
              <div className="panel border totalfees  d-flex flex-column px-3 py-2 align-items-center rounded justify-content-center">
                <h4 className="text-dark text">Students Enrolled</h4>
                <h4>{courseFinanceDetail.noOfStudents}</h4>
              </div>
            </div>

            {/* Fee Defaulters Pagination */}
            <div className="container">
           {(courseFinanceDetail.defaultersArr&&courseFinanceDetail.defaultersArr.length!==0)? <FeePagination data={courseFinanceDetail.defaultersArr} pageSize={10} isSuperAdmin={true} isAdmin={false} isStaff={false}/>:""}
            </div>
          </div>
          <p
            style={{
              fontSize: "14px",
              marginBottom: "10px",
              fontStyle: "italic",
              textAlign: "center",
            }}
          >
            The authenticity of this receipt does not require any further
            validation as it has been generated by a computer system.
          </p>
        </div>
      </div>
    </>
  );
};

export default PrintCourseFinance;
