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
import { styled, alpha } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import PrintFeeTransactionData from "./PrintFeeTransactionData";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import PrintTransactionData from "./PrintTransactionData";
import firebase from "firebase/compat/app";
import DeleteIcon from "@mui/icons-material/Delete";
import { db } from "../Firebase/config";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const SuccessAlert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// MUI Search Bar
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(1),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "12ch",
      "&:focus": {
        width: "20ch",
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

const TransPagination = ({ data, pageSize, showDeleteBtn }) => {
  const [search, setSearch] = useState("");
  const rows = [...data].sort((a, b) => (a.calories < b.calories ? -1 : 1));
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Alert
  const [alertState, setAlertState] = React.useState({
    successOpen: false,
    errorOpen: false,
    vertical: "top",
    horizontal: "right",
  });
  const { vertical, horizontal, successOpen, errorOpen } = alertState;
  // For Alert Toast
  const handleSuccessClick = () => {
    setAlertState({ ...alertState, successOpen: true });
  };
  const handleErrorClick = () => {
    setAlertState({ ...alertState, errorOpen: true });
  };
  const handleAlertClose = () => {
    setAlertState({ ...alertState, successOpen: false, errorOpen: false });
  };

  const handleTranDelete = async (e, trans) => {
    e.preventDefault();
    if (window.confirm("Are you sure to delete this transactions")) {
      try {
        const querySnapshot = await db
          .collection("fees")
          .where("coursename", "==", trans.coursename)
          .where("name", "==", trans.stdname)
          .limit(1)
          .get();
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const feeRec = doc.data();
          const updatedPrevTrans = feeRec.previousTransactions.filter(
            (element) => {
              return !(
                element.amount === trans.amount &&
                element.date === trans.date &&
                element.from === trans.from &&
                element.isStudent === trans.isStudent &&
                element.to === trans.to &&
                element.time === trans.time
              );
            }
          );

          // Updating the Fees record
          await db
            .collection("fees")
            .doc(doc.id)
            .update({
              previousTransactions: updatedPrevTrans,
              feepaid: firebase.firestore.FieldValue.increment(-trans.amount),
            });

            handleSuccessClick();
          await db.collection("transactions").doc(trans.firebaseid).delete();

        }
      } catch (error) {
        handleErrorClick();
      }
    } else {
      return;
    }
  };

  // It Handle The Search
  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(e.target.value);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TableContainer component={Paper}>
      {/* Success Alert */}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={successOpen}
        onClose={handleAlertClose}
        autoHideDuration={1500}
        key={"topSuccessRight"}
      >
        <SuccessAlert
          onClose={handleAlertClose}
          severity="success"
          sx={{ width: "100%" }}
        >
          Successfully Deleted
        </SuccessAlert>
      </Snackbar>
      {/* Error Alert */}
      <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={errorOpen}
        onClose={handleAlertClose}
        autoHideDuration={1500}
        key={"topErrorRight"}
      >
        <SuccessAlert
          onClose={handleAlertClose}
          severity="error"
          sx={{ width: "100%" }}
        >
          Something Went Wrong
        </SuccessAlert>
      </Snackbar>
      <StyledTableCell
        align="right"
        className="w-100 d-flex justify-content-center"
        style={{ backgroundColor: "#393c41", color: "white" }}
      >
        {" "}
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Search…"
            inputProps={{ "aria-label": "search" }}
            onChange={(e) => {
              handleSearch(e);
            }}
          />
        </Search>
      </StyledTableCell>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>ID</StyledTableCell>
            <StyledTableCell align="right">From</StyledTableCell>
            <StyledTableCell align="right">To</StyledTableCell>
            <StyledTableCell align="right">Amount(Rs)</StyledTableCell>
            <StyledTableCell align="right">Date</StyledTableCell>
            <StyledTableCell align="right">Time</StyledTableCell>
            {showDeleteBtn && <StyledTableCell align="right"></StyledTableCell>}
            <StyledTableCell align="right"></StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows
          ).map((row) => {
            const isMatched =
              search.length === 0 ||
              row.id.includes(search) ||
              row.to.toLowerCase().includes(search.toLowerCase());

            const isStudentMatched =
              row.stdname && row.stdname !== undefined
                ? row.stdname.toLowerCase().includes(search.toLowerCase()) ||
                  row.coursename.toLowerCase().includes(search.toLowerCase())
                : row.from.includes(search);

            return isMatched || isStudentMatched ? (
              <StyledTableRow key={row.firebaseid} className={`fees-row`}>
                <StyledTableCell component="th" scope="row">
                  {row.id}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row.stdname !== undefined
                    ? `${row.stdname}(${row.from},${row.coursename})`
                    : row.from}
                </StyledTableCell>
                <StyledTableCell align="right">{row.to}</StyledTableCell>
                <StyledTableCell align="right">{row.amount}</StyledTableCell>
                <StyledTableCell align="right">{row.date}</StyledTableCell>
                <StyledTableCell align="right">{row.time}</StyledTableCell>
                {/* Delete Btn */}
                {showDeleteBtn && row.from[0] === "s" ? (
                  <StyledTableCell
                    align="right"
                    onClick={(e) => {
                      handleTranDelete(e, row);
                    }}
                  >
                    <DeleteIcon />
                  </StyledTableCell>
                ) : (
                  <StyledTableCell align="right"></StyledTableCell>
                )}

                <StyledTableCell align="right">
                  {/* Print transaction receipt button */}
                  {row.from[0] === "s" ? (
                    <PrintFeeTransactionData transactionData={row} />
                  ) : (
                    <PrintTransactionData transactionData={row} />
                  )}
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

export default TransPagination;
