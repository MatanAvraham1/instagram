const express = require('express')
const { getCommentById, addComment, deleteCommentById } = require('../../../Use_cases/comment')
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
        const secondUserId = comment.publisherId
        const doesHasPermission = await AuthenticationService.hasPermission(firstUserId, secondUserId)
        if (!doesHasPermission) {
            return res.sendStatus(403)
        }

        const returnedObject = {
            id: comment.id,
            publisherId: comment.publisherId,
            postId: comment.postId,
            comment: comment.comment,
            replyToComment: comment.replyToComment,
            createdAt: comment.createdAt
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
