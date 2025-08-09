import { Button, Col, Form, Row, Table } from 'react-bootstrap';
import AddTransaction from '../AddTransaction/AddTransaction';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { deleteTransactionById, setEndDate,setFilterType,setPage,setStartDate,setTotalPages,setTransaction,setTypeValue,setLoading} from './TransactionList.slice';
import { useEffect, useState } from 'react';
import {deleteTransactionApi,getAllUserTransactionApi} from '../../../../service/allApi';
import { setTransactionAdded } from '../AddTransaction/AddTransaction.slice';
import CommonPagination from '../../../CommonPagination';
import EditTransaction from '../EditTransaction/EditTransaction';
import { setTransactionUpdated } from '../EditTransaction/EditTransaction.slice';

function TransactionList({ uid }) {
  const dispatch = useDispatch();

  const {list: transaction,loading, page,totalPages, filterType, typeValue, startDate, endDate} = useSelector((state) => state.transactionlist);

  const { transactionAdded } = useSelector((state) => state.addtransaction);
  const { transactionUpdated } = useSelector((state) => state.editTransaction);

  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const getuserTransaction = async (params = {}) => {
    dispatch(setLoading(true));
    try {
      const token = localStorage.getItem('token');
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      if (!params.page) params.page = page || 1;
      if (!params.limit) params.limit = 10;
      if (params.startDate) params.startDate = String(params.startDate).split('T')[0];
      if (params.endDate) params.endDate = String(params.endDate).split('T')[0];

      const result = await getAllUserTransactionApi(uid, headers, params);
      const payload =
        result?.data?.message ??
        result?.data?.transactions ??
        (Array.isArray(result?.data) ? result.data : []);

      dispatch(setTransaction(Array.isArray(payload) ? payload : []));
      dispatch(setTotalPages(result?.data?.totalPages ?? 1));
    } catch (err) {
      console.error('Failed to fetch transactions:', err);
      dispatch(setTransaction([]));
      dispatch(setTotalPages(1));
      toast.error('Failed to load transactions');
    } finally {
      dispatch(setLoading(false));
    }
  };

  useEffect(() => {
    const params = { page, limit: 10 };

    if (filterType === 'Type' && typeValue) {
      params.type = typeValue;
    }

    if (filterType === 'Date') {
      if (startDate && endDate) {
        params.startDate = startDate;
        params.endDate = endDate;
      } else if (!startDate && !endDate) {
      } else {
        return;
      }
    }

    getuserTransaction(params);
  }, [page, filterType, typeValue, startDate, endDate]);

  useEffect(() => {
    if (transactionAdded) {
      getuserTransaction({ page: 1, limit: 10 });
      dispatch(setTransactionAdded(false));
      dispatch(setPage(1));
    }
    if (transactionUpdated) {
      getuserTransaction({ page: 1, limit: 10 });
      dispatch(setTransactionUpdated(false));
      dispatch(setPage(1));
    }
  }, [transactionAdded, transactionUpdated]);

  const handleDelete = async (jid) => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json' 
      };
      const result = await deleteTransactionApi(jid, headers);
      if (result.status >= 200 && result.status < 300) {
        dispatch(deleteTransactionById(jid));
        toast.success(result.data.message || 'Deleted');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete transaction');
    }
  };

  const filterOptions = [
    { label: 'Type', value: 'Type' },
    { label: 'Date', value: 'Date' }
  ];
  const typeOptions = [
    { label: 'Income', value: 'Income' },
    { label: 'Expense', value: 'Expense' }
  ];

  return (
    <div>
      <Form className="container mb-3">
        <Row className="align-items-center g-2">
          <Col xs={3}>
            <Form.Select
              value={filterType}
              onChange={(e) => {
                dispatch(setFilterType(e.target.value));
                dispatch(setTypeValue(''));
                dispatch(setStartDate(''));
                dispatch(setEndDate(''));
                dispatch(setPage(1));
              }}
            >
              <option value="">Filter By</option>
              {filterOptions.map((opt, idx) => (
                <option key={idx} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Form.Select>
          </Col>

          {filterType === 'Type' && (
            <Col xs={3}>
              <Form.Select value={typeValue} onChange={(e) => dispatch(setTypeValue(e.target.value))}>
                <option value="">Select Type</option>
                {typeOptions.map((opt, idx) => (
                  <option key={idx} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Form.Select>
            </Col>
          )}

          {filterType === 'Date' && (
            <>
              <Col xs={2}>
                <Form.Control type="date" value={startDate} onChange={(e) => dispatch(setStartDate(e.target.value))} />
              </Col>
              <Col xs={2}>
                <Form.Control type="date" value={endDate} onChange={(e) => dispatch(setEndDate(e.target.value))} />
              </Col>
            </>
          )}
          {filterType && (
            <Col xs="auto">
              <Button
                variant="primary"
                onClick={() => {
                  dispatch(setPage(1));
                }}
              >
                Search
              </Button>
            </Col>
          )}

          <Col className="ms-auto" xs="auto">
            <AddTransaction uid={uid} />
          </Col>
        </Row>
      </Form>

      {loading ? (
        'Loading...'
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
                  <td>{item.income || item.expense}</td>
                  <td>{item.date}</td>
                  <td>{item.description}</td>
                  <td>
                    <div className="d-flex justify-content-center">
                      <i className="fa-regular fa-pen-to-square text-primary me-3" style={{ cursor: 'pointer' }} onClick={() => setSelectedTransaction(item)}></i>
                      <i className="fa-solid fa-trash text-danger" style={{ cursor: 'pointer' }} onClick={() => handleDelete(item._id)}></i>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <CommonPagination currentPage={page} totalPages={totalPages} onPageChange={(newPage) => dispatch(setPage(newPage))} />
        </div>
      )}
      {selectedTransaction && <EditTransaction transaction={selectedTransaction} onClose={() => setSelectedTransaction(null)} />}
    </div>
  );
}

export default TransactionList;