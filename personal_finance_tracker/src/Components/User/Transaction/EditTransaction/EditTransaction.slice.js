import { createSlice } from '@reduxjs/toolkit';

const EditTransactionSlice = createSlice({
  name: 'editTransaction',
  initialState: {
    error: null,
    transactionUpdated: false
  },
  reducers: {
    setEditTransactionError: (state, action) => {
      state.error = action.payload;
    },
    setTransactionUpdated: (state, action) => {
      state.transactionUpdated = action.payload;
    },
  }
});

export const { setEditTransactionError, setTransactionUpdated } = EditTransactionSlice.actions;
export default EditTransactionSlice.reducer;