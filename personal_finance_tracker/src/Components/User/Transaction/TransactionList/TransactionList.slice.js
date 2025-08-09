import { createSlice } from '@reduxjs/toolkit';

const TransactionListSlice = createSlice({
  name: 'transactionlist',
  initialState: {
    list: [],
    page: 1,
    totalPages: 1,
    loading: false,
    filterType: "",
    typeValue: "",
    startDate: "",
    endDate: ""
  },
  reducers: {
    setTransaction: (state, action) => {
      state.list = action.payload;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
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
    setFilterType: (state, action) => {
      state.filterType = action.payload;
      if (action.payload !== "Type") state.typeValue = "";
      if (action.payload !== "Date") {
        state.startDate = "";
        state.endDate = "";
      }
    },
    setTypeValue: (state, action) => {
      state.typeValue = action.payload;
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload;
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
    },
    resetFilters: (state) => {
      state.filterType = "";
      state.typeValue = "";
      state.startDate = "";
      state.endDate = "";
    }
  },
});

export const { setTransaction, setLoading, deleteTransactionById, setPage, setTotalPages, resetFilters, setEndDate,setFilterType,setStartDate,setTypeValue} = TransactionListSlice.actions;
export default TransactionListSlice.reducer;