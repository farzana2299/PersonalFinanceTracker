import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import { editTransactionApi } from "../../../../service/allApi";
import { setEditTransactionError, setTransactionUpdated } from "./EditTransaction.slice";
import { Button, Col, FloatingLabel, Form, Modal, Row } from "react-bootstrap";

function EditTransaction({ transaction, onClose }) {
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState(transaction);
  const [validation, setValidation] = useState({});

  useEffect(() => {
    setTransactions(transaction);
  }, [transaction]);

  const typeOptions = [
    { label: "Income", value: "Income" },
    { label: "Expense", value: "Expense" },
  ];

  const incomeOptions = [
    { label: "Salary", value: "Salary" },
    { label: "Investments", value: "Investments" },
    { label: "Rent", value: "Rent" },
    { label: "Miscellaneous", value: "Miscellaneous" },
  ];

  const expenseOptions = [
    { label: "Food", value: "Food" },
    { label: "Transport", value: "Transport" },
    { label: "Rent", value: "Rent" },
    { label: "Bill", value: "Bill" },
    { label: "Miscellaneous", value: "Miscellaneous" },
  ];

  const regexMap = {
    amount: /^[0-9]+$/,
    type: /^(Income|Expense)$/,
    category: /^[a-zA-Z .]+$/,
    date: /^\d{4}-\d{2}-\d{2}$/,
    description: /^[a-zA-Z0-9 .]*$/,
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If type is changed, reset category
    if (name === "type") {
      setTransactions((prev) => ({
        ...prev,
        type: value,
        category: "", // reset category on type change
      }));
    } else {
      setTransactions((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    setValidation((prev) => ({
      ...prev,
      [name]: !regexMap[name]?.test(value),
    }));
  };

  const handleEdit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };

    try {
      const result = await editTransactionApi(transactions._id, headers, transactions);
      console.log("result=",result);
      
      if (result.status >= 200 && result.status < 300) {
        toast.success("Transaction Updated Successfully", {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(setTransactionUpdated(true));
        onClose();
      } else {
        toast.error("Failed to Update Transaction", {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(setEditTransactionError("Failed to update transaction"));
      }
    } catch (err) {
      dispatch(setEditTransactionError(err.message));
    }
  };

  return (
    <>
      <Modal show onHide={onClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Transaction</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={12}>
                <FloatingLabel controlId="amount" label="Amount" className="mb-3">
                  <Form.Control
                    type="text"
                    name="amount"
                    value={transactions.amount}
                    onChange={handleInputChange}
                    isInvalid={validation.amount}
                  />
                </FloatingLabel>
              </Col>

              <Col md={12}>
                <FloatingLabel controlId="type" label="Type" className="mb-3">
                  <Form.Select
                    name="type"
                    value={transactions.type}
                    onChange={handleInputChange}
                    isInvalid={validation.type}
                  >
                    <option value="">Select Type</option>
                    {typeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
              </Col>

              {/* <Col md={12}>
                <FloatingLabel controlId="category" label="Category" className="mb-3">
                  <Form.Select
                    name="category"
                    value={transactions.category}
                    onChange={handleInputChange}
                    isInvalid={validation.category}
                    disabled={!transactions.type}
                  >
                    <option value="">Select Category</option>
                    {currentCategoryOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
              </Col> */}

              {transactions.type === "Income" && (
              <FloatingLabel controlId="income" label="Income Category" className="mb-3">
                <Form.Select name="income" value={transactions.income} onChange={handleInputChange}>
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
                <Form.Select name="expense" value={transactions.expense} onChange={handleInputChange}>
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


              <Col md={12}>
                <FloatingLabel controlId="date" label="Date" className="mb-3">
                  <Form.Control
                    type="date"
                    name="date"
                    value={transactions.date}
                    onChange={handleInputChange}
                    isInvalid={validation.date}
                  />
                </FloatingLabel>
              </Col>

              <Col md={12}>
                <FloatingLabel controlId="description" label="Description" className="mb-3">
                  <Form.Control
                    as="textarea"
                    style={{ height: "100px" }}
                    name="description"
                    value={transactions.description}
                    onChange={handleInputChange}
                    isInvalid={validation.description}
                  />
                </FloatingLabel>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleEdit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
}

export default EditTransaction;
