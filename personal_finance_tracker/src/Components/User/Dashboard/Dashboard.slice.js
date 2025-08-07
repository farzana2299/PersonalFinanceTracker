import { createSlice } from '@reduxjs/toolkit';

const DashboardSlice = createSlice({
  name: 'dashboard',
  initialState: {
    income: [],
    expense:[],
    balance:[],
    averageincome:[],
    averageexpense:[]
  },
  reducers: {
    setTotalIncome: (state, action) => {
      state.income = action.payload;
      state.loading = false;
    },
     setTotalExpense: (state, action) => {
      state.expense = action.payload;
      state.loading = false;
    },
    setCurrentBalance: (state, action) => {
      state.balance = action.payload;
      state.loading = false;
    },
     setAverageIncome: (state, action) => {
      state.averageincome = action.payload;
      state.loading = false;
    },
     setAverageExpense: (state, action) => {
      state.averageexpense = action.payload;
      state.loading = false;
    },
  },
});

export const { setTotalIncome,setTotalExpense,setCurrentBalance,setAverageExpense,setAverageIncome } = DashboardSlice.actions;
export default DashboardSlice.reducer;