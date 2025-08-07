import { Col, Row } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux";
import { getCurrentBalanceApi, getTotalExpressApi, getTotalIncomeApi } from "../../../service/allApi";
import { setAverageExpense, setAverageIncome, setCurrentBalance, setTotalExpense, setTotalIncome } from "./Dashboard.slice";
import { useEffect } from "react";

function Dashboard({ uid }) {
  const dispatch = useDispatch();

  const { income, expense, balance,averageincome,averageexpense } = useSelector((state) => state.dashboard);

  const getuserTransaction = async () => {
    try {
      const token = localStorage.getItem("token");
      const reqHeader = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const incomeresult = await getTotalIncomeApi(uid, reqHeader);
      dispatch(setTotalIncome(incomeresult.data.data));

      const expenseresult = await getTotalExpressApi(uid, reqHeader);
      dispatch(setTotalExpense(expenseresult.data.data));

      const balanceresult = await getCurrentBalanceApi(uid, reqHeader);
      dispatch(setCurrentBalance(balanceresult.data.message));

       const avgincomeresult = await getCurrentBalanceApi(uid, reqHeader);
       console.log("avgincomeresult",avgincomeresult);
       
      dispatch(setAverageIncome(avgincomeresult.data.message));

       const avgexpenseresult = await getTotalExpressApi(uid, reqHeader);
       console.log("avgexpenseresult",avgexpenseresult);
       
      dispatch(setAverageExpense(avgexpenseresult.data.data));

    } catch (err) {
      console.error("Failed to fetch jobs.");
    }
  };

  useEffect(() => {
    getuserTransaction();
  }, []);

  return (
    <div className="container">
      <h5 className="mt-4">Annual Summary</h5>
      <Row>
        <Col lg={4}>
          <div className="border m-3 p-4 rounded bg-success-subtle text-center">
            <h6>Income</h6>
            <h4 className="text-success">₹ {income}</h4>
          </div>
        </Col>
        <Col lg={4}>
          <div className="border m-3 p-4 rounded bg-warning-subtle text-center">
            <h6>Expense</h6>
            <h4 className="text-danger">₹ {expense}</h4>
          </div>
        </Col>
        <Col lg={4}>
          <div className="border m-3 p-4 rounded bg-primary-subtle text-center">
            <h6>Balance</h6>
            <h4 className="text-primary">₹ {balance}</h4>
          </div>
        </Col>
      </Row>
      <h5 className="mt-4">Average Per Month</h5>
      <Row>
        <Col lg={6}>
          <div className="border m-3 p-4 rounded bg-success-subtle text-center">
            <h6>Income</h6>
            <h4 className="text-success">₹ {averageincome}</h4>
          </div>
        </Col>
        <Col lg={6}>
          <div className="border m-3 p-4 rounded bg-warning-subtle text-center">
            <h6>Expense</h6>
            <h4 className="text-danger">₹ {averageexpense}</h4>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
