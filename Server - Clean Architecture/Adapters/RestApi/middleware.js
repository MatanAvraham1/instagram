const { AppError } = require('../../app_error')
const { AuthenticationService } = require('../../CustomHelpers/Authantication')
const { Id } = require('../../CustomHelpers/Id_helper')
const { CommentsDB } = require('../DB/comments_db')
const { PostsDB } = require('../DB/posts_db')
const { UsersDB } = require('../DB/users_db')

function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization

    if (authHeader != null) {
        const token = authHeader.split(' ')[1]

        try {
            const { userId } = AuthenticationService.authenticateToken(token)
            req.userId = userId

            return next()
        }
        catch (err) {
            return res.sendStatus(401)
        }
    }
    else {
        return res.sendStatus(403)
    }
}

async function doesOwnUserObject(req, res, next) {

    try {

        if (!Id.isValid(req.params.userId)) {
            return res.status(400).json("Can't perfrom request of invalid id.")
        }

        const user = await UsersDB.findById(req.params.userId)

        if (user.id != req.userId) {
            return res.sendStatus(403)
        }

        next()
    }
    catch (err) {
        if (err instanceof AppError) {
            return res.status(400).json(err.message)
        }

        console.log(err)
        return res.sendStatus(500)
    }
}

async function doesOwnPostObject(req, res, next) {

    try {

        if (!Id.isValid(req.params.postId)) {
            return res.status(400).json("Can't perfrom request of invalid id.")
        }

        const post = await PostsDB.findById(req.params.postId)

        if (post.publisherId != req.userId) {
            return res.sendStatus(403)
        }

        next()
    }
    catch (err) {
        if (err instanceof AppError) {
            return res.status(400).json(err.message)
        }

        console.log(err)
        return res.sendStatus(500)
    }
}

async function doesOwnCommentObject(req, res, next) {

    try {

        if (!Id.isValid(req.params.commentId)) {
            return res.status(400).json("Can't perfrom request of invalid id.")
        }

        const comment = await CommentsDB.findById(req.params.commentId)

        if (comment.publisherId != req.userId) {
            return res.sendStatus(403)
        }

        next()
    }
    catch (err) {
        if (err instanceof AppError) {
            return res.status(400).json(err.message)
        }

        console.log(err)
        return res.sendStatus(500)
    }
}


// async function doesHasPermission(req, res, next) {

//     const firstUserId = req.userId
//     const secondUserId = req.params.userId

//     const doesHasPermission = await AuthenticationService.hasPermission(firstUserId, secondUserId)
//     if (!doesHasPermission) {
//         return res.sendStatus(401)
//     }

//     next()
// }

module.exports = { authenticateToken, doesOwnUserObject, doesOwnPostObject, doesOwnCommentObject }