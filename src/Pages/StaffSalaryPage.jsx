import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { db } from "../Firebase/config";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useContext } from "react";
import { staffUser } from "./StaffDashboard";
import moment from "moment";


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  
    "&": {
      width: "12rem",
  
    },
    
  }));

const StaffSalaryPage = () => {

    const [staffSalary,setStaffSalary]=useState({});
    const staff=useContext(staffUser);

    useEffect(() => {
        const fetchSalaryRecord = async () => {
            if (staff) {
              db
              .collection("salaries")
              .doc(staff.salaryfirebaseid)
              .get()
              .then((snapshot) => {
                if (snapshot.exists) {
                    setStaffSalary(snapshot.data());
                }
              })
              .catch((error) => {
                console.log("Error getting data from Firestore: ", error);
              });
            }
          }

       fetchSalaryRecord();
      }, []);
  return (
    <div className="d-flex flex-column align-items-center">
        <div className="teacher-salary-details  mt-5 ">
    <Table sx={{ minWidth: 100 }} aria-label="customized table">
      <TableBody>
        <TableRow>
          <TableHead>
            <StyledTableCell>ID</StyledTableCell>
          </TableHead>
          <StyledTableCell align="left"> {staffSalary.id}</StyledTableCell>
        </TableRow>
        <TableRow>
          <TableHead>
            <StyledTableCell>Teacher Name</StyledTableCell>
          </TableHead>
          <StyledTableCell align="left">
            {" "}
            {staffSalary.name}
          </StyledTableCell>
        </TableRow>
        <TableRow>
          <TableHead>
            <StyledTableCell>Salary</StyledTableCell>
          </TableHead>
          <StyledTableCell align="left">
            {staffSalary.salary}PKR
          </StyledTableCell>
        </TableRow>
        <TableRow>
          <TableHead>
            <StyledTableCell>Status</StyledTableCell>
          </TableHead>
          <StyledTableCell align="left">
            {(staffSalary.paid)?"Paid":"Not Paid"}
          </StyledTableCell>
        </TableRow>
        <TableRow>
          <TableHead>
            <StyledTableCell>Salary Month</StyledTableCell>
          </TableHead>
          <StyledTableCell align="left">
            {moment(staffSalary.date,"DD-MM-YYYY").format("MMMM")}
          </StyledTableCell>
        </TableRow>
       
      </TableBody>
    </Table>
  </div>
    </div>

  )
}

export default StaffSalaryPage
