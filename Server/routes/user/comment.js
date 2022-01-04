const express = require('express');
const { isCommentValidate, commentModel, commentErrors, getComments, addComment, deleteComment, likeComment, unlikeComment } = require('../../models/Comment');
const { getUserById, userModel, userErrors } = require('../../models/User');
const { authenticateToken } = require('../auth');
const { doesHasPermission } = require('../../helpers/privacyHelper');
const { getPostById, postErrors } = require('../../models/Post');
const { getCommentById } = require('../../models/Comment')
const { errorCodes } = require('../../errorCodes');
const commentRouter = express.Router({ mergeParams: true })


// Gets comment 
commentRouter.get('/:commentId', authenticateToken, doesHasPermission, async (req, res) => {
    try {

        const comment = await getCommentById(req.params.userId, req.params.postId, req.params.commentId)
        res.status(200).json({
            'comment': comment.comment,
            'likes': comment.likes.length,
            'publishedAt': comment.publishedAt,
            'publisherId': comment.publisherId
        })
    }
    catch (err) {

        if (err == userErrors.userNotExistsError) {
            return res.status(400).json({ errorCode: errorCodes.userNotExist })
        }
        if (err == postErrors.postNotExistsError) {
            return res.status(400).json({ errorCode: errorCodes.postNotExist })
        }
        if (err == commentErrors.commentNotExist) {
            return res.status(400).json({ errorCode: errorCodes.postNotExist })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})


// Gets comments of post
commentRouter.get('/', authenticateToken, doesHasPermission, async (req, res) => {
    try {
        var response = []
        const comments = await getComments(req.params.userId, req.params.postId)

        comments.forEach(comment => {
            response.push({
                publisherId: comment.publisherId,
                comment: comment.comment,
                likes: comment.likes.length,
                publishedAt: comment.publishedAt
            })
        });
        res.status(200).json({ 'comments': response })
    }
    catch (err) {
        if (err == userErrors.userNotExistsError) {
            return res.status(400).json({ errorCode: errorCodes.userNotExist })
        }
        if (err == postErrors.postNotExistsError) {
            return res.status(400).json({ errorCode: errorCodes.postNotExist })
        }

        console.log(err)
        res.sendStatus(500)
    }
})


// Adds comment
commentRouter.post('/', authenticateToken, doesHasPermission, async (req, res) => {
    try {
        await addComment(req.params.userId, req.params.postId, {
            publisherId: req.userId,
            comment: req.body.comment,
            publishedAt: new Date()
        })
        return res.sendStatus(200)
    }
    catch (err) {
        if (err == userErrors.userNotExistsError) {
            return res.status(400).json({ errorCode: errorCodes.userNotExist })
        }
        if (err == postErrors.postNotExistsError) {
            return res.status(400).json({ errorCode: errorCodes.postNotExist })
        }
        if (err == commentErrors.invalidCommentError) {
            return res.status(400).json({ errorCode: errorCodes.invalidComment })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})

// Removes comment
commentRouter.delete('/:commentId', authenticateToken, doesHasPermission, async (req, res) => {
    try {
        await deleteComment(req.params.userId, req.params.postId, req.params.commentId)
        res.sendStatus(200)
    }
    catch (err) {
        if (err == userErrors.userNotExistsError) {
            return res.status(400).json({ errorCode: errorCodes.userNotExist })
        }
        if (err == postErrors.postNotExistsError) {
            return res.status(400).json({ errorCode: errorCodes.postNotExist })
        }
        if (err == commentErrors.commentNotExist) {
            return res.status(400).json({ errorCode: errorCodes.commentNotExist })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})

// Like comment
commentRouter.post('/:commentId/like', authenticateToken, doesHasPermission, async (req, res) => {

    try {
        await likeComment(req.params.userId, req.params.postId, req.params.commentId, req.userId)
        return res.sendStatus(200)
    }
    catch (err) {
        if (err == userErrors.userNotExistsError) {
            return res.status(400).json({ errorCode: errorCodes.userNotExist })
        }
        if (err == postErrors.postNotExistsError) {
            return res.status(400).json({ errorCode: errorCodes.postNotExist })
        }
        if (err == commentErrors.commentNotExist) {
            return res.status(400).json({ errorCode: errorCodes.commentNotExist })
        }
        if (err == commentErrors.alreadyLikedError) {
            return res.status(400).json({ errorCode: errorCodes.alreadyLiked })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})

// Unlike comment
commentRouter.delete('/:commentId/like', authenticateToken, doesHasPermission, async (req, res) => {

    try {
        await unlikeComment(req.params.userId, req.params.postId, req.params.commentId, req.userId)
        return res.sendStatus(200)
    }
    catch (err) {
        if (err == userErrors.userNotExistsError) {
            return res.status(400).json({ errorCode: errorCodes.userNotExist })
        }
        if (err == postErrors.postNotExistsError) {
            return res.status(400).json({ errorCode: errorCodes.postNotExist })
        }
        if (err == commentErrors.commentNotExist) {
            return res.status(400).json({ errorCode: errorCodes.commentNotExist })
        }
        if (err == commentErrors.alreadyUnlikedError) {
            return res.status(400).json({ errorCode: errorCodes.alreadyUnliked })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})

module.exports = commentRouter