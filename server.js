require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

//Database Connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))

app.use(express.json())

const userRouter = require('./route/users')

//Router Middleware
app.use('/users', userRouter)

app.listen(3000, () => console.log('Server Started'))