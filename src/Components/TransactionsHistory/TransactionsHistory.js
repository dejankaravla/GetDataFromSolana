import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAccountTransactionsHistory } from "../../features/allData";
import { setSpinner } from "../../features/controls";
import axios from "axios";
import Moment from "react-moment";
import "moment-timezone";
import "../../styles/TransactionsHistory/TransactionHistory.css";
import Spiner from "../Spiner/Spiner";

function TransactionsHistory({ transactionHistoryData }) {
  const accountTransactionsHistory = useSelector((state) => state.allData.accountTransactionsHistory);
  const spinner = useSelector((state) => state.controls.spinner);
  console.log(accountTransactionsHistory);
  const dispatch = useDispatch();

  const refreshTransactions = () => {
    axios
      .get(`https://public-api.solscan.io/account/transactions?account=${transactionHistoryData}&limit=10`)
      .then((res) => {
        dispatch(getAccountTransactionsHistory(res.data));
      });
  };

  useEffect(() => {
    axios
      .get(`https://public-api.solscan.io/account/transactions?account=${transactionHistoryData}&limit=10`)
      .then((res) => {
        dispatch(setSpinner(false));
        dispatch(getAccountTransactionsHistory(res.data));
      });
  }, [transactionHistoryData]);
  console.log(transactionHistoryData);
  if (spinner) {
    return <Spiner />;
  }

  return (
    <div className="Acc_transactionHistoryContainer">
      <div className="Acc_transactionHistory">
        <div className="Acc_transactionHistoryHeader">
          <h2>Transaction History</h2>
          <button onClick={refreshTransactions}>Refresh</button>
        </div>
        <div className="Acc_transactionHistoryProperties">
          <h4>TRANSACTION SIGNATURE</h4>
          <div className="Acc_transactionHistorySlotAge">
            <h4>FEE</h4>
            <h4>SLOT</h4>
            <h4 style={{ width: "70px" }}>AGE</h4>
            <h4>RESULT</h4>
          </div>
        </div>
        <div className="Acc_transactionHistoryInfo">
          {accountTransactionsHistory.map((accData) => {
            return (
              <div className="Acc_transactionHistoryInfoData">
                <a>{accData.txHash}</a>
                <div className="Acc_transactionHistoryInfoSlotBlockTime">
                  <p>{accData.fee}</p>
                  <p>{accData.slot}</p>
                  <Moment style={{ width: "150px" }} fromNow unix>
                    {accData.blockTime}
                  </Moment>
                  <p style={accData.status === "Fail" ? { backgroundColor: "red" } : { backgroundColor: "#116939" }}>
                    {accData.status}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default TransactionsHistory;
