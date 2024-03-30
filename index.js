

const express = require('express')
const mongoose = require('mongoose');
const CourseRoute = require('./routes/course.route')
const UserRoute = require('./routes/user.route')
const httpStatusText = require('./utils/httpStatusText')
const path = require('path');
require('dotenv').config()

// const url = 'mongodb+srv://eslamgmegahed010:nodejs_123@learn-node-db.7u6c9hf.mongodb.net/test_api?retryWrites=true&w=majority&appName=learn-node-db'
mongoose.connect(process.env.URL).then((req, res)=>{
    console.log('server started');
})

const app = express()
app.use(express.json())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))


app.use('/api/courses',CourseRoute)
app.use('/api/users',UserRoute)


app.use('*', (req, res)=>{
    return res.status(404).json({status: 'error', message: 'route not found'})
})

app.use((error, req, res, next)=>{
    res.status(error.statusCode || 500).json({status: error.statusText || httpStatusText.ERROR, message: error.message, code: error.statusCode || 500, data: null});

})

app.listen(process.env.Port || 5000,(req, res)=>{
    console.log('listening on port 5000');
})