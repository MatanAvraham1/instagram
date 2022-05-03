require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')


// Connects to the database
mongoose.connect(process.env.DATABASE_URL).then((result) => { console.log("Connected to db!") }).catch((err) => {
    console.log(err)
})


// Creates the express app
const app = express()

app.use(express.json())

const { authRouter } = require('./routes/user/auth_route')
app.use('/api/', authRouter)

const { userRouter } = require('./routes/user/user_route')
app.use('/api/users/', userRouter)

// const { chatRouter } = require('./routes/chat/chat_route')
// app.use('/api/chats/', chatRouter)


app.listen(5000, () => {
    console.log("Listening on port 5000...")
})