const { jwtMiddleware } = require('../middlewares/token');
const express = require('express')
const router = new express.Router()
const { userRegistration,userLogin} = require('../controllers/userController')

// userRouter
router.post('/user/register', userRegistration);
router.post('/user/login', userLogin)

module.exports = router 