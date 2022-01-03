const express = require('express');
const { isCommentValidate, commentModel } = require('../../models/Comment');
const { getUserById, userModel } = require('../../models/User');
const { authenticateToken } = require('../auth');
const { doesRequesterOwn, doesHasPermission } = require('../../helpers/privacyHelper');
const { getPostById } = require('../../models/Post');
const commentRouter = express.Router({ mergeParams: true })


// Gets comment 
commentRouter.get('/:commentId', authenticateToken, doesHasPermission, async (req, res) => {
    try {
        const post = await getPostById(req.params.userId, req.params.postId)
        if (post == null) {
            return res.status(400).json({ errorCode: errorCodes.postNotExist })
        }

        const index = post.comments.findIndex((comment) => comment._id == req.params.commentId)
        if (index == -1) {
            return res.status(400).json({ "errorCode": errorCodes.commentNotExist })
        }

        const comment = post.comments[index].comment
        res.status(200).json({
            'comment': comment.comment,
            'likes': comment.likes.length,
            'publishedAt': comment.publishedAt,
            'publisherId': comment.publisherId
        })
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


// Gets comments of post
commentRouter.get('/', authenticateToken, doesHasPermission, async (req, res) => {
    try {
        const post = await getPostById(req.params.userId, req.params.postId)
        if (post == null) {
            return res.status(400).json({ errorCode: errorCodes.postNotExist })
        }

        res.status(200).json({ 'comments': post.comments })
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


// Adds comment
commentRouter.post('/', authenticateToken, doesHasPermission, async (req, res) => {
    try {
        req.body.publisherId = req.userId;
        req.body.publishedAt = Date.now()
        if (isCommentValidate(req.body)) {
            const user = await getUserById(req.params.userId)
            const comment = new commentModel({ publisherId: req.body.publisherId, comment: req.body.comment, publishedAt: req.body.publishedAt })

            const postIndex = user.posts.findIndex((post) => post._id == req.params.postId)
            if (postIndex == -1) {
                return res.status(400).json({ errorCode: errorCodes.postNotExist })
            }

            user.posts[postIndex].comments.push(comment)
            await userModel.updateOne({ _id: req.params.userId }, user)
            res.sendStatus(200)
        }
        else {
            res.status(400).json({ "errorCode": errorCodes.invalidComment })
        }

    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

// Removes comment
commentRouter.delete('/:commentId', authenticateToken, doesHasPermission, async (req, res) => {
    try {
        const user = await getUserById(req.params.userId)

        const postIndex = user.posts.findIndex((post) => post._id == req.params.postId)
        if (postIndex == -1) {
            return res.status(400).json({ errorCode: errorCodes.postNotExist })
        }

        const commentIndex = user.posts[postIndex].comments.findIndex((comment) => comment._id == req.params.commentId)
        if (commentIndex == -1) {
            return res.status(400).json({ errorCode: errorCodes.commentNotExist })
        }

        // If the requester doesn't own the comment
        if (user.posts[postIndex].comments[commentIndex].publisherId != req.userId) {
            return res.sendStatus(403)
        }

        user.posts[postIndex].comments.splice(commentIndex, 1);
        await userModel.updateOne({ _id: req.params.userId }, user)
        res.sendStatus(200)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

// Like comment
commentRouter.post('/:commentId/like', authenticateToken, doesHasPermission, async (req, res) => {

    try {
        const user = await getUserById(req.params.userId)

        const postIndex = user.posts.findIndex((post) => post._id == req.params.postId)
        if (postIndex == -1) {
            return res.status(400).json({ errorCode: errorCodes.postNotExist })
        }

        const commentIndex = user.posts[postIndex].comments.findIndex((comment) => comment._id == req.params.commentId)
        if (commentIndex == -1) {
            return res.status(400).json({ errorCode: errorCodes.commentNotExist })
        }

        if (user.posts[postIndex].comments[commentIndex].likes.includes(req.userId)) {
            return res.status(400).json({ errorCode: errorCodes.alreadyLiked })
        }

        user.posts[postIndex].comments[commentIndex].likes.push(req.userId)
        await userModel.updateOne({ _id: req.params.userId }, user)
        res.sendStatus(200)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

// Unlike comment
commentRouter.delete('/:commentId/like', authenticateToken, doesHasPermission, async (req, res) => {

    try {
        const user = await getUserById(req.params.userId)

        const postIndex = user.posts.findIndex((post) => post._id == req.params.postId)
        if (postIndex == -1) {
            return res.status(400).json({ errorCode: errorCodes.postNotExist })
        }

        const commentIndex = user.posts[postIndex].comments.findIndex((comment) => comment._id == req.params.commentId)
        if (commentIndex == -1) {
            return res.status(400).json({ errorCode: errorCodes.commentNotExist })
        }

        if (!user.posts[postIndex].comments[commentIndex].likes.includes(req.userId)) {
            return res.status(400).json({ errorCode: errorCodes.alreadyUnliked })
        }

        const likeIndex = user.posts[postIndex].comments[commentIndex].likes.findIndex((like) => like == req.userId)
        user.posts[postIndex].comments[commentIndex].likes.splice(likeIndex, 1);

        await userModel.updateOne({ _id: req.params.userId }, user)
        res.sendStatus(200)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

module.exports = commentRouter