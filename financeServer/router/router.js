const { jwtMiddleware } = require('../middlewares/token');
const express = require('express')
const router = new express.Router()
const { userRegistration} = require('../controllers/userController')

// userRouter
router.post('/user/register', userRegistration);

module.exports = router 