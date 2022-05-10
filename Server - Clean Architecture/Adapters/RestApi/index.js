// We currently using express
const express = require('express')
const { userRouter } = require('./routes/user_route')
const { authRouter } = require('./routes/auth_route')
const { friendShipsRouter } = require('./routes/friendships')

function startServer() {
    // Creates the express app
    const app = express()

    app.use(express.json())

    app.use('/api/', authRouter)

    app.use('/api/users/', userRouter)

    app.use('/api/friendships/', friendShipsRouter)

    // const { chatRouter } = require('./routes/chat/chat_route')
    // app.use('/api/chats/', chatRouter)

    app.listen(5000, () => {
        console.log("Listening on port 5000...")
    })
}

module.exports = { startServer }