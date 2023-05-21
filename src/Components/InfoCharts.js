import React, { useState, useEffect } from "react";
import FeePieChart from "./dashboard/FeePieChart";
import { Col, Row } from "reactstrap";
import { db } from "../Firebase/config";
import SalaryPieChart from "./dashboard/SalaryPieChart";
import StudentEnrollChart from "./dashboard/StudentEnrollChart";

const InfoCharts = ({showFeeChart,showSalaryChart,showEnrollChart}) => {
  const [studentFeeData, setStudentFeeData] = useState({
    feepaid: 0,
    feenotpaid: 0,
  });
  const [employeeSalaryData, setEmployeeSalaryData] = useState({
    salarypaid: 0,
    salarynotpaid: 0,
  });
  const [studentEnrollDate, setStudentEnrollDate] = useState([]);

  useEffect(() => {
    const fetchStudentFee = async () => {
      db.collection("fees").onSnapshot((snapshot) => {
        // Separating the fee amount paid and not paid
        let feepaid = 0;
        let feenotpaid = 0;
        snapshot.forEach((fee) => {
          feepaid += parseFloat(fee.data().feepaid, 10);
          feenotpaid +=
            parseInt(fee.data().totalfees) - parseFloat(fee.data().feepaid);
        });
        setStudentFeeData({ feepaid: feepaid, feenotpaid: feenotpaid });
      });
    };
    const fetchEmployeeSalaries = async () => {
      db.collection("salaries").onSnapshot((snapshot) => {
        // Separating the salary paid and not paid
        let salarypaid = 0;
        let salarynotpaid = 0;
        snapshot.forEach((salary) => {
          salary.data().paid
            ? (salarypaid = salarypaid + parseFloat(salary.data().salary))
            : (salarynotpaid =
                salarynotpaid + parseFloat(salary.data().salary));
        });
        setEmployeeSalaryData({
          salarypaid: salarypaid,
          salarynotpaid: salarynotpaid,
        });
      });
    };

    const fetchStudentEnroll = async () => {
      db.collection("students").onSnapshot((snapshot) => {
        const currentYear = new Date().getFullYear(); // get the current year and modulo 100 to get the last two digits

        let enrollPerMonth = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        snapshot.forEach((doc) => {
          const dateString = doc.data().enrolleddate;
          const date = new Date(dateString);
          const month = date.getMonth(); // returns a number between 0 and 11, so we add 1 to get the month number
          const year = date.getFullYear(); // get the year as a 4-digit string and take the last 2 digits
          if (year === currentYear) {
            enrollPerMonth[month] += 1;
          }
        });
        setStudentEnrollDate(enrollPerMonth);
      });
    };
    showFeeChart && fetchStudentFee();
    showSalaryChart&& fetchEmployeeSalaries();
    showEnrollChart&& fetchStudentEnroll();
  }, []);

  return (
    <Row>
      {showEnrollChart&&<Col sm="12" lg="12" xl="12" xxl="12">
        <StudentEnrollChart studentEnrollDate={studentEnrollDate} />
      </Col>}
      {showFeeChart&&<Col sm="12" lg="6" xl="6" xxl="8">
        <FeePieChart
          feepaid={studentFeeData.feepaid}
          feenotpaid={studentFeeData.feenotpaid}
        />
      </Col>}
     {showSalaryChart&& <Col sm="12" lg="6" xl="6" xxl="6">
        <SalaryPieChart
          salarypaid={employeeSalaryData.salarypaid}
          salarynotpaid={employeeSalaryData.salarynotpaid}
        />
      </Col>}
    </Row>
  );
};

export default InfoCharts;
