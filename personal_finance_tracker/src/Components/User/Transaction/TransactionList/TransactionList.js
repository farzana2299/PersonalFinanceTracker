import { Button, Form, Table } from 'react-bootstrap'
import AddTransaction from '../AddTransaction/AddTransaction'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteTransactionById, setPage, setSearchTerm, setTotalPages, setTransaction } from './TransactionList.slice';
import { useEffect, useState } from 'react';
import { deleteTransactionApi, getAllUserTransactionApi } from '../../../../service/allApi';
import { setTransactionAdded } from '../AddTransaction/AddTransaction.slice';
import CommonPagination from '../../../CommonPagination';
import EditTransaction from '../EditTransaction/EditTransaction';
import { setTransactionUpdated } from '../EditTransaction/EditTransaction.slice';

function TransactionList({ uid }) {
  const dispatch = useDispatch();

  const { list: transaction, loading, page, totalPages, searchTerm } = useSelector((state) => state.transactionlist);
  const { transactionAdded } = useSelector((state) => state.addtransaction);
  const { transactionUpdated } = useSelector((state) => state.editTransaction);

  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const getuserTransaction = async (page, search) => {
    try {
      const token = localStorage.getItem("token");
      const reqHeader = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const result = await getAllUserTransactionApi(uid, reqHeader, {
        page,
        limit: 10,
        search,
      });
      dispatch(setTransaction(result.data.message));
      dispatch(setTotalPages(result.data.totalPages));
    } catch (err) {
      console.error("Failed to fetch jobs.");
    }
  };

  const handleDelete = async (jid) => {
    try {
      const token = localStorage.getItem("token");
      const reqHeader = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      };
      const result = await deleteTransactionApi(jid, reqHeader);
      if (result.status >= 200 && result.status < 300) {
        toast.success(result.data.message, {
          position: "top-center",
          autoClose: 3000,
        });
        dispatch(deleteTransactionById(jid));
      }
    } catch (err) {
      toast.error("Failed to delete job", {
        position: "top-center",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    getuserTransaction(page, searchTerm);

    if (transactionAdded) {
      dispatch(setTransactionAdded(false));
    }
    if (transactionUpdated) {
      dispatch(setTransactionUpdated(false));
    }
  }, [dispatch, transactionAdded, transactionUpdated, page]);

  const handleSearch = () => {
    dispatch(setPage(1));
    getuserTransaction(1, searchTerm);
  };

  return (
    <div>
      <Form className="d-flex align-items-center mb-3 container">
        <Form.Control
          type="text"
          placeholder="Search by Category"
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
          className="me-2"
        />
        <Button onClick={handleSearch}>Search</Button>
        <div className="ms-auto">
          <AddTransaction uid={uid} />
        </div>
      </Form>

      {loading ? (
        "Loading..."
      ) : (transaction?.length ?? 0) === 0 ? (
        <div className="text-center mt-5">No Transactions Posted Yet</div>
      ) : (
        <div className="container mt-5 mb-5 px-0">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Sl No</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Category</th>
                <th>Date</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {transaction.map((item, index) => (
                <tr key={item._id}>
                  <td>{index + 1}</td>
                  <td>{item.amount}</td>
                  <td>{item.type}</td>
                  <td>{item.income}{item.expense}</td>
                  <td>{item.date}</td>
                  <td>{item.description}</td>
                  <td>
                    <div className="row text-center">
                      <div className="col-6">
                        <i
                          className="fa-regular fa-pen-to-square text-primary"
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedTransaction(item)}
                        ></i>
                      </div>
                      <div className="col-6">
                        <i
                          role="button"
                          className="fa-solid fa-trash text-danger"
                          onClick={() => handleDelete(item._id)}
                        ></i>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <CommonPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => dispatch(setPage(newPage))}
          />
        </div>
      )}
      {selectedTransaction && (
        <EditTransaction
          transaction={selectedTransaction}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
    </div>
  );
}

export default TransactionList;
