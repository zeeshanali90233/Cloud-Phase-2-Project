import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { styled ,alpha} from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import "../Css/FeesPage.css";
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import CSVDownload from "../Assets/Logos/CSVDownload.png";
import * as XLSX from "xlsx";

// MUI Search Bar
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

const FeePagination = ({ data, isSuperAdmin}) => {
  const rows = [...data];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(rows.length);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const handleClick = ( row) => {
    if (isSuperAdmin) {
      navigate("/sadmin/dashboard/fees/editfees", { state: row });
    } else {
      navigate("editfees", { state: row });
    }
  };

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

  const downloadData = (studentRecords) => {
    // Reorder the data
    const reorderedData = studentRecords.map((record) => [
      record.sid,
      record.name,
      record.totalfees,
      record.feeperinstallment,
      record.feepaid,
      record.duedate,
      record.coursename,
    ]);

    // Add Subtitle
    reorderedData.unshift([
      "ID",
      "Name",
      "Total Fees",
      "Fees Per Installment",
      "Fees Paid",
      "Due Date",
      "Courses",
    ]);

    // Add Main Title
    reorderedData.unshift(["Fees Records"]);

    // Generate Worksheet
    const ws = XLSX.utils.aoa_to_sheet(reorderedData);

    // Merge cells for Main Title
    if (ws["A1"]) {
      ws["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 17 } }];
      ws["A1"] = {
        v: "Fees Records",
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
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 15 },
      { wch: 10 },
      { wch: 25 },
      { wch: 15 },
     
    ];

    ws["!cols"] = columnWidths;

    // Generate Workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Fees");

    // Download the Excel file
    XLSX.writeFile(wb, "fees.xlsx");
  };


  //It checks whether the props date is passed or not
  function isDueDatePassed(dueDate) {
    const currentDate = new Date();
    const dueDateObject = new Date(dueDate + ", " + new Date().getFullYear());
    return dueDateObject.getTime() < currentDate.getTime();
  }
  return (
    <TableContainer component={Paper}>
      <StyledTableCell align="right" className="w-100 d-flex " style={{backgroundColor:"#393c41",color:"white"}}> 
      <div className="mx-auto">
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
              className="btn-showAllTrans btn border  mb-1 ms-2"
              onClick={() => {
                downloadData(rows);
              }}
            >
              <img src={CSVDownload} alt="" />
            </button>
          </div>
          
          </StyledTableCell>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell align="right">Name</StyledTableCell>
            <StyledTableCell align="right">Total Fees</StyledTableCell>
            <StyledTableCell align="right">
              Fees Per Installement
            </StyledTableCell>
            <StyledTableCell align="right">Fees Paid</StyledTableCell>
            <StyledTableCell align="right">Due Date</StyledTableCell>
            <StyledTableCell align="right">Course</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => {
            const [searchCourseName, searchStudentId] = search.split("/");
            const isMatched =
              (searchCourseName
                ? row.sid.includes(search.toLowerCase()) ||
                  row.coursename
                    .toLowerCase()
                    .includes(searchCourseName.toLowerCase()) || row.name.toLowerCase().includes(search.toLowerCase())
                : true) &&
              (searchStudentId
                ? row.sid
                    .toLowerCase()
                    .includes(searchStudentId.toLowerCase()) ||
                  row.name.toLowerCase().includes(searchStudentId.toLowerCase())
                : true);

            return isMatched ? (
              <StyledTableRow
                key={row.firebaseid}
                className={`fees-row ${
                  isDueDatePassed(row.duedate) && row.feepaid < row.totalfees
                    ? "fee-defaulter"
                    : ""
                }`}
                onClick={() => {
                  handleClick(row);
                }}
              >
                <StyledTableCell
                  component="th"
                  scope="row"
                  className="text-uppercase"
                >
                  {row.sid}
                </StyledTableCell>
                <StyledTableCell align="right">{row.name}</StyledTableCell>
                <StyledTableCell align="right">{row.totalfees}</StyledTableCell>
                <StyledTableCell align="right">
                  {row.feeperinstallment}
                </StyledTableCell>
                <StyledTableCell align="right">{row.feepaid}</StyledTableCell>
                <StyledTableCell align="right">{row.duedate}</StyledTableCell>
                <StyledTableCell align="right">
                  {row.coursename}
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

export default FeePagination;
