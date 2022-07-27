const { AppError, AppErrorMessages } = require('../../app_error')
const { AuthenticationService } = require('../../CustomHelpers/Authantication')
const { Id } = require('../../CustomHelpers/Id_helper')
const { getUserById, doesUserExist } = require('../../Use_cases/user')
const { getPostById } = require('../../Use_cases/post')
const { getStoryById } = require('../../Use_cases/story')
const { getCommentById } = require('../../Use_cases/comment')

async function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization

    if (authHeader != null) {
        const token = authHeader.split(' ')[1]

        try {
            const { userId } = AuthenticationService.authenticateToken(token)
            req.userId = userId

            // If the requester user doesn't exist
            if (!(await doesUserExist({ userId }))) {
                return res.sendStatus(403)
            }

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
        const user = await getUserById({ userId: req.params.userId })

        if (user.id != req.userId) {
            return res.sendStatus(403)
        }

        next()
    }
    catch (err) {
        if (err instanceof AppError) {

            if (err.message == AppErrorMessages.userDoesNotExist) {
                return res.sendStatus(404)
            }

            return res.status(400).json(err.message)
        }

        console.log(err)
        return res.sendStatus(500)
    }
}

async function doesOwnStoryObject(req, res, next) {

    try {
        const story = await getStoryById(req.params.storyId)

        if (story.publisherId != req.userId) {
            return res.sendStatus(403)
        }

        next()
    }
    catch (err) {
        if (err instanceof AppError) {

            if (err.message == AppErrorMessages.storyDoesNotExist) {
                return res.sendStatus(404)
            }

            return res.status(400).json(err.message)
        }

        console.log(err)
        return res.sendStatus(500)
    }
}


async function doesOwnPostObject(req, res, next) {

    try {
        const post = await getPostById({ postId: req.params.postId })

        if (post.publisherId != req.userId) {
            return res.sendStatus(403)
        }

        next()
    }
    catch (err) {
        if (err instanceof AppError) {

            if (err.message == AppErrorMessages.postDoesNotExist) {
                return res.sendStatus(404)
            }

            return res.status(400).json(err.message)
        }

        console.log(err)
        return res.sendStatus(500)
    }
}

async function doesOwnCommentObject(req, res, next) {

    try {
        const comment = await getCommentById(req.params.commentId)

        if (comment.publisherId != req.userId) {
            return res.sendStatus(403)
        }

        next()
    }
    catch (err) {
        if (err instanceof AppError) {

            if (err.message == AppErrorMessages.commentDoesNotExist) {
                return res.sendStatus(404)
            }

            return res.status(400).json(err.message)
        }

        console.log(err)
        return res.sendStatus(500)
    }
}

module.exports = { authenticateToken, doesOwnUserObject, doesOwnStoryObject, doesOwnPostObject, doesOwnCommentObject }