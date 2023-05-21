import React, { useState,useEffect } from 'react'
import TopCards from './dashboard/TopCards';
import { Col, Row } from "reactstrap";
import { db } from '../Firebase/config';

const TopInfoPanels = ({showTotalSalary,showTotalEmployees,showProfitLoss}) => {
    const [totalFees, setTotalFees] = useState(0);
    const [totalStudents, setTotalStudents] = useState(0);
    const [totalSalary, setTotalSalary] = useState(0);
    const [totalEmployees, setTotalEmployee] = useState(0);
  

    useEffect(() => {
        // Fetching the no of students and fees
        const fetchTotalStudentsAndFees = async () => {
          await db.collection("students").onSnapshot((snapshot) => {
            let totalFeesFirebase = 0;
            let totalStudentsFirebase = 0;
            snapshot.forEach((doc) => {
              totalFeesFirebase += Number(doc.data().totalfees);
              totalStudentsFirebase += 1;
            });
            setTotalStudents(totalStudentsFirebase);
            setTotalFees(totalFeesFirebase);
          });
        };
    
        // Fetch Total number of employees and salary
        const fetchTotalEmployeesAndSalary = async () => {
          let totalEmployeesFirebase = 0;
          let totalSalaryFirebase = 0;
          // Admin
          await db.collection("admin").onSnapshot(async (snapshot) => {
            snapshot.forEach((doc) => {
              totalSalaryFirebase += Number(doc.data().initsalary);
              totalEmployeesFirebase += 1;
            });
            // Updating
            setTotalSalary(totalSalaryFirebase);
            setTotalEmployee(totalEmployeesFirebase);
          });
          // Staff
          await db.collection("staff").onSnapshot(async (snapshot) => {
            snapshot.forEach((doc) => {
              totalSalaryFirebase += Number(doc.data().initsalary);
              totalEmployeesFirebase += 1;
            });
            // Updating
            setTotalSalary(totalSalaryFirebase);
            setTotalEmployee(totalEmployeesFirebase);
          });
          // Teachers
          await db.collection("teachers").onSnapshot(async (snapshot) => {
            snapshot.forEach((doc) => {
              totalSalaryFirebase += Number(doc.data().initsalary);
              totalEmployeesFirebase += 1;
            });
            // Updating
            setTotalSalary(totalSalaryFirebase);
            setTotalEmployee(totalEmployeesFirebase);
          });
        };
    
        // Calling Each Function
        fetchTotalStudentsAndFees();
        fetchTotalEmployeesAndSalary();
        
      }, []);


      return (
          <Row >
            {/***Top Information Cards***/}
          <Col sm="6" lg="3" >
            <TopCards
              bg="bg-light-success text-success"
              title="Total Fees"
              subtitle="Total Earning"
              earning={`${totalFees.toLocaleString()}PKR`}
              icon="bi bi-wallet"
            />
          </Col>
          {showTotalSalary && <Col sm="6" lg="3"> 
            <TopCards
              bg="bg-light-danger text-danger"
              title="Total Salary"
              subtitle="Total Salary"
              earning={`${totalSalary.toLocaleString()}PKR`}
              icon="bi bi-coin"
            />
          </Col>}

          <Col sm="6" lg="3"> 
            <TopCards
              bg="bg-light-danger text-danger"
              title="Students"
              subtitle="Students"
              earning={`${totalStudents.toLocaleString()}`}
              icon="bi bi-person-video"
            />
          </Col>
          {showTotalEmployees&&<Col sm="6" lg="3">
            <TopCards
              bg="bg-light-warning text-warning"
              title="Employees"
              subtitle="Employees"
              earning={`${totalEmployees.toLocaleString()}`}
              icon="bi bi-person-video"
            />
          </Col>}
          {showProfitLoss&&<Col sm="6" lg="3">
            <TopCards
              bg="bg-light-info text-into"
              title="Profit/Loss"
              subtitle="Profit/Loss"
              earning={`${(totalFees-totalSalary).toLocaleString()}PKR`}
              icon="bi bi-wallet"
            />
          </Col>}
        </Row>
  )
}

export default TopInfoPanels
