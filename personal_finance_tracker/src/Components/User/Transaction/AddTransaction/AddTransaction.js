import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTransactionApi } from "../../../../service/allApi";
import { toast, ToastContainer } from "react-toastify";
import { setAddTransactionError, setTransactionAdded } from "./AddTransaction.slice";
import { Button, Modal } from "react-bootstrap";
import {  FloatingLabel, Form } from "react-bootstrap";

function AddTransaction({ uid }) {
  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [transactions, settransactions] = useState({
    amount: "",
    type: "",
    income: "",
    expense: "",
    date: "",
    description: ""
  });

  const [validation, setValidation] = useState({
    amount: false,
    type: false,
    income: false,
    expense: false,
    date: false
  });

  const typeOptions = [
    { label: "Income", value: "Income" },
    { label: "Expense", value: "Expense" }
  ];

  const incomeOptions = [
    { label: "Salary", value: "Salary" },
    { label: "Investments", value: "Investments" },
    { label: "Rent", value: "Rent" },
    { label: "Miscellaneous", value: "Miscellaneous" }
  ];

  const expenseOptions = [
    { label: "Food", value: "Food" },
    { label: "Transport", value: "Transport" },
    { label: "Rent", value: "Rent" },
    { label: "Bill", value: "Bill" },
    { label: "Miscellaneous", value: "Miscellaneous" }
  ];

  const regexMap = {
    amount: /^[0-9]+$/,
    type: /^(Income|Expense)$/,
    income: /^[a-zA-Z .]+$/,
    expense: /^[a-zA-Z .]+$/,
    date: /^\d{4}-\d{2}-\d{2}$/,
    description: /^[a-zA-Z0-9 .]*$/
  };

  const setDatas = (e) => {
    const { name, value } = e.target;

    if (regexMap[name]) {
      setValidation((prev) => ({
        ...prev,
        [name]: !regexMap[name].test(value)
      }));
    }

    settransactions((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const { amount, type, income, expense, date } = transactions;

    if (!amount || !type || !date || (type === "Income" && !income) || (type === "Expense" && !expense)) {
      alert("Please fill all required fields.");
      return;
    }

    const token = localStorage.getItem("token");
    const reqHeader = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };

    try {
      const result = await addTransactionApi(uid, transactions, reqHeader);
      if (result.status >= 200 && result.status < 300) {
        toast.success("Transaction added successfully", {
          position: "top-center",
          autoClose: 3000
        });
        dispatch(setTransactionAdded(true));
        settransactions({
          amount: "",
          type: "",
          income: "",
          expense: "",
          date: "",
          description: ""
        });
      } else {
        dispatch(setAddTransactionError(result.response?.data?.message));
        toast.error(result.response?.data?.message || "Transaction failed", {
          position: "top-center",
          autoClose: 3000
        });
      }
    } catch (error) {
      dispatch(setAddTransactionError(error.message));
      toast.error("Error while adding transaction", {
        position: "top-center",
        autoClose: 3000
      });
    }

    handleClose();
  };

  return (
    <div>
      <div className="mt-5" style={{ position: "relative", left: "80%" }}>
        <Button onClick={handleShow} size="lg" variant="success">
          ADD
        </Button>
      </div>

      <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
        <Modal.Header closeButton>
          <Modal.Title>Add Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FloatingLabel controlId="amount" label="Amount" className="mb-3">
              <Form.Control
                type="text"
                name="amount"
                value={transactions.amount}
                onChange={setDatas}
                placeholder="Enter amount"
              />
              {validation.amount && <p className="text-danger">Invalid amount</p>}
            </FloatingLabel>

            <FloatingLabel controlId="type" label="Type" className="mb-3">
              <Form.Select name="type" value={transactions.type} onChange={setDatas}>
                <option value="">Select Type</option>
                {typeOptions.map((opt, idx) => (
                  <option key={idx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
              {validation.type && <p className="text-danger">Invalid type</p>}
            </FloatingLabel>

            {transactions.type === "Income" && (
              <FloatingLabel controlId="income" label="Income Category" className="mb-3">
                <Form.Select name="income" value={transactions.income} onChange={setDatas}>
                  <option value="">Select Income Category</option>
                  {incomeOptions.map((opt, idx) => (
                    <option key={idx} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Form.Select>
                {validation.income && <p className="text-danger">Select valid income category</p>}
              </FloatingLabel>
            )}

            {transactions.type === "Expense" && (
              <FloatingLabel controlId="expense" label="Expense Category" className="mb-3">
                <Form.Select name="expense" value={transactions.expense} onChange={setDatas}>
                  <option value="">Select Expense Category</option>
                  {expenseOptions.map((opt, idx) => (
                    <option key={idx} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </Form.Select>
                {validation.expense && <p className="text-danger">Select valid expense category</p>}
              </FloatingLabel>
            )}

            <FloatingLabel controlId="date" label="Date" className="mb-3">
              <Form.Control
                type="date"
                name="date"
                value={transactions.date}
                onChange={setDatas}
              />
              {validation.date && <p className="text-danger">Invalid date</p>}
            </FloatingLabel>

            <FloatingLabel controlId="description" label="Description (Optional)" className="mb-3">
              <Form.Control
                as="textarea"
                name="description"
                value={transactions.description}
                onChange={setDatas}
                placeholder="Enter any notes or description"
                style={{ height: "100px" }}
              />
            </FloatingLabel>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAdd}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
  );
}

export default AddTransaction;
