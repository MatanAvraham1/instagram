const express = require('express')
const { AuthenticationService } = require('../../../CustomHelpers/Authantication')
const { getCommentById, addComment, deleteCommentById, getCommentsByPublisherId, getRepliesComments, getCommentsByPostId } = require('../../../Use_cases/comment')
const { getPostById } = require('../../../Use_cases/post')
const { authenticateToken, doesOwnCommentObject } = require('../middleware')
const commentsRouter = express.Router()

// Add comment
commentsRouter.post('/', authenticateToken, (req, res) => {
    const userId = req.userId

    addComment({ publisherId: userId, postId: req.body.postId, comment: req.body.comment, replyToComment: req.body.replyToComment })
        .then((commentId) => {
            res.status(201).json({ commentId: commentId })
        }).catch((error) => {
            if (error instanceof AppError) {
                return res.status(400).json(error.message)
            }

            res.sendStatus(500)
            console.error(error)
        })
})


// Gets comment
commentsRouter.get('/:commentId', authenticateToken, (req, res) => {
    const commentId = req.params.commentId

    getCommentById({ commentId }).then(async (comment) => {

        const firstUserId = req.userId
        const secondUserId = (await getPostById(comment.postId)).publisherId
        const doesHasPermission = await AuthenticationService.hasPermission(firstUserId, secondUserId)
        if (!doesHasPermission) {
            return res.sendStatus(403)
        }

        const returnedObject = {
            publisherId: comment.publisherId,
            postId: comment.postId,
            comment: comment.comment,
            replyToComment: comment.replyToComment,
            id: comment.id,
            createdAt: comment.createdAt,

            likes: comment.likes,
            replies: comment.replies,
        }

        res.status(200).json(returnedObject)
    }).catch((error) => {
        if (error instanceof AppError) {
            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})


// Deletes comment
commentsRouter.delete('/:commentId', authenticateToken, doesOwnCommentObject, (req, res) => {
    const commentId = req.params.commentId

    deleteCommentById(commentId).then(() => {
        res.sendStatus(200)
    }).catch((error) => {
        if (error instanceof AppError) {
            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})


// Gets comments by publisher
commentsRouter.get('/', authenticateToken, (req, res) => {
    const publisherId = req.query.publisherId
    const startIndex = parseInt(req.query.startIndex)

    if (!Number.isInteger(startIndex)) {
        return res.status(400).json("Invalid start index.")
    }

    getCommentsByPublisherId(publisherId, startIndex).then(async (comments) => {


        const returnedList = []
        for (const comment of comments) {

            const firstUserId = req.userId
            const secondUserId = (await getPostById(comment.postId)).publisherId
            const doesHasPermission = await AuthenticationService.hasPermission(firstUserId, secondUserId)
            if (!doesHasPermission) {
                continue
            }

            const objectToReturn = {
                publisherId: comment.publisherId,
                postId: comment.postId,
                comment: comment.comment,
                replyToComment: comment.replyToComment,
                id: comment.id,
                createdAt: comment.createdAt,

                likes: comment.likes,
                replies: comment.replies,
            }

            returnedList.push(objectToReturn)
        }


        res.sendStatus(200).json(returnedList)
    }).catch((error) => {
        if (error instanceof AppError) {
            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})

// Gets replies
commentsRouter.get('/', authenticateToken, (req, res) => {
    const replyToComment = req.query.replyToComment
    const startIndex = parseInt(req.query.startIndex)

    if (!Number.isInteger(startIndex)) {
        return res.status(400).json("Invalid start index.")
    }

    getRepliesComments(replyToComment, startIndex).then(async (comments) => {

        const firstUserId = req.userId
        const secondUserId = (await getPostById((await getCommentById(replyToComment)).postId)).publisherId
        const doesHasPermission = await AuthenticationService.hasPermission(firstUserId, secondUserId)
        if (!doesHasPermission) {
            return res.sendStatus(403)
        }

        const returnedList = []
        for (const comment of comments) {

            const objectToReturn = {
                publisherId: comment.publisherId,
                postId: comment.postId,
                comment: comment.comment,
                replyToComment: comment.replyToComment,
                id: comment.id,
                createdAt: comment.createdAt,

                likes: comment.likes,
                replies: comment.replies,
            }


            returnedList.push(objectToReturn)
        }


        res.sendStatus(200).json(returnedList)
    }).catch((error) => {
        if (error instanceof AppError) {
            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})


// Gets comments by post id
commentsRouter.get('/', authenticateToken, async (req, res) => {
    const postId = req.query.postId
    const startIndex = parseInt(req.query.startIndex)

    if (!Number.isInteger(startIndex)) {
        return res.status(400).json("Invalid start index.")
    }

    const firstUserId = req.userId
    const secondUserId = (await getPostById(postId)).publisherId
    const doesHasPermission = await AuthenticationService.hasPermission(firstUserId, secondUserId)
    if (!doesHasPermission) {
        return res.sendStatus(403)
    }

    getCommentsByPostId(postId, startIndex).then((comments) => {
        const returnedList = []
        for (const comment of comments) {

            const objectToReturn = {
                publisherId: comment.publisherId,
                postId: comment.postId,
                comment: comment.comment,
                replyToComment: comment.replyToComment,
                id: comment.id,
                createdAt: comment.createdAt,

                likes: comment.likes,
                replies: comment.replies,
            }

            returnedList.push(objectToReturn)
        }

        res.sendStatus(200).json(returnedList)
    }).catch((error) => {
        if (error instanceof AppError) {
            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})

module.exports = { commentsRouter }