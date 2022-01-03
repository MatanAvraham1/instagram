const express = require('express')
const { authenticateToken } = require('../auth')
const { isPostValidate, postModel, getPostById } = require('../../models/Post')
const { getUserById, userModel } = require('../../models/User')
const { doesRequesterOwn, doesHasPermission } = require('../../helpers/privacyHelper')
const postsRouter = express.Router({ mergeParams: true })

// Gets posts of user
postsRouter.get('/', authenticateToken, doesHasPermission, async (req, res) => {
    try {
        const user = await getUserById(req.params.userId)
        res.status(200).json({ 'posts': user.posts })
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

// Gets post
postsRouter.get('/:postId', authenticateToken, doesHasPermission, async (req, res) => {
    try {
        const post = await getPostById(req.params.userId, req.params.postId)
        if (post == null) {
            return res.status(400).json({ errorCode: errorCodes.postNotExist })
        }

        res.status(200).json({
            'photosUrls': post.photosUrls,
            'taggedUsers': post.taggedUsers,
            'publishedAt': post.taggedUsers,
            'comments': post.comments.length,
            'publishedAt': post.publishedAt,
            'likes': post.likes.length,
        })
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

// Adds post
postsRouter.post('/', authenticateToken, doesRequesterOwn, async (req, res) => {
    try {
        req.body.publishedAt = Date.now()
        if (isPostValidate(req.body)) {
            const post = new postModel({ photosUrls: req.body.photosUrls, publishedAt: req.body.publishedAt, taggedUsers: req.body.taggedUsers })
            const user = await getUserById(req.params.userId)
            user.posts.push(post)
            await user.save()
            res.sendStatus(200)
        }
        else {
            res.status(400).json({ errorCode: errorCodes.invalidPost })
        }

    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

// Deletes post
postsRouter.delete('/:postId', authenticateToken, doesRequesterOwn, async (req, res) => {
    try {
        const user = await getUserById(req.params.userId)

        const postIndex = user.posts.findIndex((post) => post._id == req.params.postId)
        if (postIndex == -1) {
            return res.status(400).json({ errorCode: errorCodes.postNotExist })
        }
        user.posts.splice(postIndex, 1);
        await userModel.updateOne({ _id: req.params.userId }, user)
        res.sendStatus(200)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

// Like post
postsRouter.post('/:postId/like', authenticateToken, doesHasPermission, async (req, res) => {

    try {
        const user = await getUserById(req.params.userId)

        const postIndex = user.posts.findIndex((post) => post._id == req.params.postId)
        if (postIndex == -1) {
            return res.status(400).json({ errorCode: errorCodes.postNotExist })
        }

        if (user.posts[postIndex].likes.includes(req.userId)) {
            return res.status(400).json({ errorCode: errorCodes.alreadyLiked })
        }

        user.posts[postIndex].likes.push(req.userId)
        await userModel.updateOne({ _id: req.params.userId }, user)
        res.sendStatus(200)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

// Unlike post
postsRouter.delete('/:postId/like', authenticateToken, doesHasPermission, async (req, res) => {

    try {
        const user = await getUserById(req.params.userId)

        const postIndex = user.posts.findIndex((post) => post._id == req.params.postId)
        if (postIndex == -1) {
            return res.status(400).json({ errorCode: errorCodes.postNotExist })
        }

        if (!user.posts[postIndex].likes.includes(req.userId)) {
            return res.status(400).json({ errorCode: errorCodes.alreadyUnliked })
        }

        const likeIndex = user.posts.findIndex((like) => like == req.userId)
        user.posts[postIndex].likes.splice(likeIndex, 1);

        await userModel.updateOne({ _id: req.params.userId }, user)
        res.sendStatus(200)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

const commentRouter = require('./comment')
postsRouter.use('/:postId/comments/', commentRouter)

module.exports = { postsRouter }