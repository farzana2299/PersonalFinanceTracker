const { jwtMiddleware } = require('../middlewares/token');
const express = require('express')
const router = new express.Router()
const { userRegistration, userLogin, addTransaction, allTransactionByUser, deleteTransaction, editTransaction, getTotalIncome,
    getTotalExpense, getCurrentBalance, getAverageMonthlyIncome, getAverageMonthlyExpense } = require('../controllers/userController')

router.post('/user/register', userRegistration);
router.post('/user/login', userLogin)
router.post('/user/addtransaction/:uid', jwtMiddleware, addTransaction);
router.get('/user/transaction/list/:uid', jwtMiddleware, allTransactionByUser)
router.put('/user/transaction/:id', jwtMiddleware, editTransaction)
router.delete('/user/transaction/:id', jwtMiddleware, deleteTransaction)
router.get('/user/totalincome/:uid', jwtMiddleware, getTotalIncome);
router.get('/user/totalexpense/:uid', jwtMiddleware, getTotalExpense);
router.get("/user/currentbalance/:uid", jwtMiddleware, getCurrentBalance);
router.get("/user/averageincome/:uid", jwtMiddleware, getAverageMonthlyIncome);
router.get("/user/averageexpense/:uid", jwtMiddleware, getAverageMonthlyExpense);

module.exports = router 