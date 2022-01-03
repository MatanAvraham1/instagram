require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')


// Connects to the database
mongoose.connect(process.env.DATABASE_URL).then((result) => { console.log("Connected to db!") }).catch((err) => {
    console.log(err)
})


// Creates the express aoo
const app = express()

app.use(express.json())

const { authRouter } = require('./routes/auth')
app.use('/api/', authRouter)

const { userRouter } = require('./routes/user/user')
app.use('/api/users/', userRouter)

app.listen(5000, () => {
    console.log("Listening on port 5000...")
})
