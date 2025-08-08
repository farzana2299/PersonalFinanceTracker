import { configureStore } from '@reduxjs/toolkit';
import addtransaction from '../Components/User/Transaction/AddTransaction/AddTransaction.slice';
import transactionlist from '../Components/User/Transaction/TransactionList/TransactionList.slice';
import editTransaction from '../Components/User/Transaction/EditTransaction/EditTransaction.slice';
import dashboard from '../Components/User/Dashboard/Dashboard.slice';
import bargraph from '../Components/User/BarGraph/BarGraph.slice';

export const store = configureStore({
    reducer: {
        addtransaction,
        transactionlist,
        editTransaction,
        dashboard,
        bargraph
    },
});