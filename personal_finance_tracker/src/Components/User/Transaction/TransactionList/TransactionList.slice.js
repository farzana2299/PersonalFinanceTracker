import { createSlice } from '@reduxjs/toolkit';

const TransactionListSlice = createSlice({
  name: 'transactionlist',
  initialState: {
    list: [],
    page: 1,
    totalPages: 1,
    searchTerm: '',
  },
  reducers: {
    setTransaction: (state, action) => {
      state.list = action.payload;
      state.loading = false;
    },
    deleteTransactionById: (state, action) => {
      state.list = state.list.filter((transaction) => transaction._id !== action.payload);
    },
     setPage: (state, action) => {
      state.page = action.payload;
    },
    setTotalPages: (state, action) => {
      state.totalPages = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
});

export const { setTransaction, deleteTransactionById,setPage,setTotalPages,setSearchTerm } = TransactionListSlice.actions;
export default TransactionListSlice.reducer;