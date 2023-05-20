import React, { useState } from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import { styled,alpha } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import Avatar from "@mui/material/Avatar";
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';

import "../Css/FeesPage.css";
import {  useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import CSVDownload from "../Assets/Logos/CSVDownload.png";


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));


function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
  "&:hover": {
    cursor: "pointer",
    backgroundColor: "#393c41",
  },

  "&:hover *": {
    color: "white",
  },
}));

const StaffPagination = ({ data}) => {
  const [search, setSearch] = useState("");

  const rows = [...data];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // It Handle The Search
  const handleSearch=(e)=>{
    e.preventDefault();
    setSearch(e.target.value);
  }
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //It navigates to their respective page
  function navigateTo(id) {
    switch (id[0]) {
      case "t":
        return `teacher/detail`;
      case "e":
        return `detail`;
      case "a":
        return `admin/detail`;
      default:
        return "/";
    }
  }

  const downloadData = (staffRecords) => {
    // Reorder the data
    const reorderedData = staffRecords.map((record) => [
      record.staffid || record.tid || record.aid,
      record.firstname,
      record.lastname,
      record.dob,
      record.gender,
      record.address,
      record.phone,
      record.cnic,
      record.email,
      record.education,
      record.institutename,
      record.passingyear,
      record.designation,
      record.initsalary,
      record.emergencyname,
      record.emergencyphone,
      record.emergencyrelationship,
      (record.canmanagesalary)?"Yes":"No",
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
      "CNIC",
      "Email",
      "Qualification",
      "Institute Name",
      "Passing Year",
      "Designation",
      "Salary(PKR)",
      "Emergency Contact Name",
      "Emergency Contact Number",
      "Relationship",
      "Can Manage Salary"
    ]);
  
    // Add Main Title
    reorderedData.unshift(["Staff Records"]);
  
    // Generate Worksheet
    const ws = XLSX.utils.aoa_to_sheet(reorderedData);
  
 // Merge cells for Main Title
if (ws["A1"]) {
  ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 17 } }];
  ws["A1"] = {
    v: "Staff Records",
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
    XLSX.utils.book_append_sheet(wb, ws, "Staff");
  
    // Download the Excel file
    XLSX.writeFile(wb, "staff.xlsx");
  };


  const handleClick=(id,firebaseId)=>{
    navigate(navigateTo(id),{state:{firebaseId:firebaseId}})
  }
  return (
    <TableContainer component={Paper}>
            <StyledTableCell align="right" className="w-100 d-flex justify-content-center" style={{backgroundColor:"#393c41",color:"white"}}><div className="mx-auto">
      <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
              onChange={(e)=>{handleSearch(e)}}
            />
          </Search>
      </div>
          <div >
         <button
          className="btn-showAllTrans btn border  mb-1 ms-2 mt-1"
          onClick={() => {
            downloadData(rows);
          }}
        >
          <img src={CSVDownload} alt="" />
        </button>
          </div></StyledTableCell>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Profile Photo</StyledTableCell>
            <StyledTableCell align="right">ID</StyledTableCell>
            <StyledTableCell align="right">Name</StyledTableCell>
            <StyledTableCell align="right">Designation</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => {
            return row.staffid === search.toLowerCase() ||
              row.aid === search.toLowerCase() ||
              row.tid === search.toLowerCase() ||
              row.firstname.toLowerCase().includes(search.toLowerCase()) ||
              row.lastname.toLowerCase().includes(search.toLowerCase()) ||
              row.designation.toLowerCase().includes(search.toLowerCase()) ||
              search.length === 0 ? (
                <StyledTableRow
                key={row.firebaseId}
                onClick={() => {
                  handleClick(row.aid || row.staffid || row.tid,row.firebaseId);
                }}
              >
                <StyledTableCell component="th" scope="row">
                  <Avatar
                    alt="Remy Sharp"
                    src={`${(row.adminphoto)?row.adminphoto.URL:(row.teacherphoto)?row.teacherphoto.URL:(row.staffphoto)?row.staffphoto.URL:""}`}
                    sx={{ width: 56, height: 56 }}
                  />
                </StyledTableCell>
                <StyledTableCell align="right" className="text-uppercase">
                  {row.aid || row.staffid || row.tid}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.firstname + " " + row.lastname}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.designation.toUpperCase()|| row.type.toUpperCase() }
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              ""
            );
          })}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={3}
              count={rows.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default StaffPagination;
