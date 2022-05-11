// We currently using express
const express = require('express')
const { userRouter } = require('./routes/users_route')
const { authRouter } = require('./routes/auth_route')
const { friendShipsRouter } = require('./routes/friendships_route')
const { storiesRouter } = require('./routes/stories_route')
const { postsRouter } = require('./routes/posts_route')
const { commentsRouter } = require('./routes/comments_route')


function startServer() {
    // Creates the express app
    const app = express()

    app.use(express.json())

    app.use('/api/', authRouter)

    app.use('/api/users/', userRouter)

    app.use('/api/friendships/', friendShipsRouter)

    app.use('/api/stories/', storiesRouter)

    app.use('/api/posts/', postsRouter)

    app.use('/api/comments/', commentsRouter)

    app.listen(5000, () => {
        console.log("Listening on port 5000...")
    })
}

module.exports = { startServer }