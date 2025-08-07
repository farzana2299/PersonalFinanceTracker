import { createSlice } from '@reduxjs/toolkit';

const AddTransactionSlice = createSlice({
  name: 'addtransaction',
  initialState: {
    transactionAdded: false,
    error: null
  },
  reducers: {
    setTransactionAdded: (state, action) => {
      state.transactionAdded = action.payload;
    },
    setAddTransactionError: (state, action) => {
      state.error = action.payload;
    }
  },
});

export const { setTransactionAdded, setAddTransactionError } = AddTransactionSlice.actions;
export default AddTransactionSlice.reducer;