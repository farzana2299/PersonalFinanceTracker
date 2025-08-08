const cors = require('cors')
require('dotenv').config()
const path = require('path')
const express = require('express')
require('express-async-errors');
const router = require('./router/router')
const server = express()
server.use(cors())
server.use(express.json())
server.use(router)
require('./database/connection')
const port = 4000 || process.env.PORT
server.listen(port, () => {
    console.log(`-----Server is running on port ${port}--------`);
})