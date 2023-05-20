import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import orgLogo from "../Assets/Logos/organization_Logo.png";
import TextField from "@mui/material/TextField";
import moment from "moment";

const PrintPaidSalaryRecords = ({ previousRecords }) => {
  let componentRef = useRef();
  const printDate = new Date().toLocaleDateString();
  return (
    <>
      <ReactToPrint
        trigger={() => (
          <button
            type="submit"
            id="edit-button"
            className="border rounded"
            style={{ width: "250px" }}
          >
            Print Previous Salaries
          </button>
        )}
        content={() => componentRef}
      />
      <div style={{ display: "none" }}>
        <div
          id="printContainer"
          ref={(el) => (componentRef = el)}
          className="container"
        >
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "14px" }}>{printDate}</p>
          </div>
          <img
            src={orgLogo}
            alt=""
            width={50}
            className="text-center"
            style={{ marginLeft: "20px" }}
          />
          <div style={{ textAlign: "center" }} className="w-100">
            <img
              src={orgLogo}
              alt=""
              width={120}
              className="text-center mx-auto"
            />
          </div>
          <h1
            style={{
              textAlign: "center",
              fontSize: "24px",
              marginBottom: "20px",
            }}
          >
            Salary Records
          </h1>
          <div>
            <div className="row">
              <div className="col d-flex flex-column">
                <TextField
                  id="standard-basic"
                  label="ID"
                  variant="standard"
                  value={previousRecords[0].id}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>

              <div className="col d-flex flex-column">
                <TextField
                  id="standard-basic"
                  label="Name"
                  variant="standard"
                  value={previousRecords[0].name}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>
            </div>
          </div>

          <br />
          <hr />

          {previousRecords.map((salarySlipData) => {
            return (
              <div>
                <div>
                  <div className="row">
                    <div className="col d-flex flex-column">
                      <TextField
                        id="standard-basic"
                        label="Month"
                        variant="standard"
                        value={moment(salarySlipData.month, "M").format("MMMM")}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </div>
                    <div className="col d-flex flex-column">
                      <TextField
                        id="standard-basic"
                        label="Year"
                        variant="standard"
                        value={salarySlipData.year}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col d-flex flex-column">
                      <TextField
                        id="standard-basic"
                        label="Total Days"
                        variant="standard"
                        value={salarySlipData.totalDays}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </div>
                    <div className="col d-flex flex-column">
                      <TextField
                        id="standard-basic"
                        label="Total Presents"
                        variant="standard"
                        value={salarySlipData.totalPresent}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col d-flex flex-column">
                    <TextField
                      id="standard-basic"
                      label="Increment"
                      variant="standard"
                      name="increment"
                      value={salarySlipData.increment}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>
                  <div className="col d-flex flex-column">
                    <TextField
                      id="standard-basic"
                      label="Decrement"
                      variant="standard"
                      name="decrement"
                      value={salarySlipData.decrement}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </div>

                  <div className="row">
                    <div className="col d-flex flex-column">
                      <TextField
                        id="standard-basic"
                        label="Net Salary"
                        variant="standard"
                        value={salarySlipData.netSalary}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </div>
                    <div className="col d-flex flex-column">
                      <TextField
                        id="standard-basic"
                        label="Status"
                        variant="standard"
                        value={"Paid"}
                        InputProps={{
                          readOnly: true,
                        }}
                      />
                    </div>
                  </div>
                </div>
                <hr />
                <br />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default PrintPaidSalaryRecords;
