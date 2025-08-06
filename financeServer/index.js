const cors = require('cors')
require('dotenv').config()
const path = require('path')
const express = require('express')
require('express-async-errors');
const router = require('./router/router')
// const errorMiddleware = require('./middlewares/error');
const server = express()
server.use(cors())
server.use(express.json())
server.use(router)
// const m = path.join(__dirname,'resumes')
// server.use('/resumes',express.static('./resumes'))
// console.log(m);
// server.use(errorMiddleware)
require('./database/connection')
const port = 4000 || process.env.PORT
server.listen(port, () => {
    console.log(`-----Server is running on port ${port}--------`);
})