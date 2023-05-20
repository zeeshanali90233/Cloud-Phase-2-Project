import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import PrintSVG from "../Assets/Logos/PrintICON.png";
import orgLogo from "../Assets/Logos/organization_Logo.png";

export const PrintFeeTransactionData = ({ transactionData }) => {
  let componentRef = useRef();
  const printDate = new Date().toLocaleString();

  function getOrdinalIndicator(number) {
    const lastDigit = number % 10;
    const lastTwoDigits = number % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
      return "th"; // special case for 11th, 12th, 13th
    } else if (lastDigit === 1) {
      return "st";
    } else if (lastDigit === 2) {
      return "nd";
    } else if (lastDigit === 3) {
      return "rd";
    } else {
      return "th";
    }
  }

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
          <img src={orgLogo} alt="" width={50} className="text-center" />
          <h1
            style={{
              textAlign: "center",
              fontSize: "24px",
              marginBottom: "20px",
            }}
          >
            Transaction Receipt
          </h1>

          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <th style={{ textAlign: "left", paddingRight: "1em" }}>
                  Transaction ID:
                </th>
                <td style={{ textAlign: "left" }}>{transactionData.id}</td>
              </tr>
              <tr>
                <th style={{ textAlign: "left", paddingRight: "1em" }}>
                  Course Name:
                </th>
                <td style={{ textAlign: "left" }}>
                  {transactionData.coursename}
                </td>
              </tr>
              <tr>
                <th style={{ textAlign: "left", paddingRight: "1em" }}>
                  Student Name:
                </th>
                <td style={{ textAlign: "left" }}>
                  {transactionData.stdname}
                </td>
              </tr>
              <tr>
                <th style={{ textAlign: "left", paddingRight: "1em" }}>
                  ID:
                </th>
                <td style={{ textAlign: "left" }}>{transactionData.from}</td>
              </tr>
              <tr>
                <th style={{ textAlign: "left", paddingRight: "1em" }}>To:</th>
                <td style={{ textAlign: "left" }}>{transactionData.to}</td>
              </tr>

              <tr>
                <th style={{ textAlign: "left", paddingRight: "1em" }}>
                  Date:
                </th>
                <td style={{ textAlign: "left" }}>{transactionData.date}</td>
              </tr>
              <tr>
                <th style={{ textAlign: "left", paddingRight: "1em" }}>
                  Time:
                </th>
                <td style={{ textAlign: "left" }}>{transactionData.time}</td>
              </tr>
            </tbody>
          </table>

          <h2 style={{ fontSize: "20px", marginTop: "20px" }}>
            Installments Paid
          </h2>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid black",
              marginTop: "10px",
            }}
          >
            <thead>
              <tr>
                <th style={{ textAlign: "left", padding: "5px" }}>
                  Installment No.
                </th>
                <th style={{ textAlign: "left", padding: "5px" }}>
                  Amount Paid
                </th>
              </tr>
            </thead>
            <tbody>
             {/* All Previous Transactions */}
              {transactionData.previousTransactions &&
              transactionData.previousTransactions.length !== 0
                ? transactionData.previousTransactions.map(
                    (installment, index) => (
                      <tr>
                        <th style={{ textAlign: "left", padding: "5px" }}>
                          {index + 1}
                          {getOrdinalIndicator(index + 1)} Installment
                        </th>
                        <td style={{ textAlign: "left" }}>
                          {installment.amount
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                          PKR
                        </td>
                      </tr>
                    )
                  )
                : ""}
                {/* Current Receipt Transactions */}
                 <tr>
                <th style={{ textAlign: "left", padding: "5px" }}>
                  {transactionData.previousTransactions.length+1}{getOrdinalIndicator(transactionData.previousTransactions.length + 1)} Installment
                </th>
                <td style={{ textAlign: "left" }}>
                  {transactionData.amount
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  PKR
                </td>
              </tr>
              <hr />
              {/* Total Fees */}
              <tr>
                <th style={{ textAlign: "left", padding: "5px" }}>
                  Total Fees:
                </th>
                <td style={{ textAlign: "left" }}>
                  {transactionData.totalfees
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  PKR
                </td>
              </tr>
              {/* Fee Paid */}
              <tr>
                <th style={{ textAlign: "left", padding: "5px" }}>Fee Paid:</th>
                <td style={{ textAlign: "left" }}>
                  {(transactionData.feepaid+transactionData.amount)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  PKR
                </td>
              </tr>

              {/* Fee Remaining */}
              <tr>
                <th style={{ textAlign: "left", padding: "5px" }}>
                  Fee Remaining:
                </th>
                <td style={{ textAlign: "left" }}>
                  {(transactionData.totalfees - transactionData.feepaid-transactionData.amount)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  PKR
                </td>
              </tr>
            </tbody>
          </table>
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
          <span className="required">Fee is not refundable</span>
        </div>
      </div>
    </>
  );
};

export default PrintFeeTransactionData;
