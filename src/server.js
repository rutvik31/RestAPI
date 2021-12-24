require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')
const cors = require('cors')

//Database Connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())
app.use(cors())
app.use(express.static('public'))

// Virtual Path Prefix '/static'
app.use('/static', express.static('public'))

const userRouter = require('./route/userRoute')

//Router Middleware
app.use('/users', userRouter)

var port = process.env.PORT || 8080;

app.listen(port, () => console.log('Server is listening on port ' + port + '!'))