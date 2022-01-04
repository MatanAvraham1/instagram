const express = require('express')
const { authenticateToken } = require('../auth')
const { isPostValidate, postModel, getPostById, getPosts, postErrors, addPost, deletePost, likePost, unlikePost } = require('../../models/Post')
const { getUserById, userModel } = require('../../models/User')
const { doesRequesterOwn, doesHasPermission } = require('../../helpers/privacyHelper')
const postsRouter = express.Router({ mergeParams: true })

// Gets posts of user
postsRouter.get('/', authenticateToken, doesHasPermission, async (req, res) => {
    try {
        var response = []
        const posts = await getPosts(req.params.userId)
        posts.forEach(post => {
            response.push({
                'photosUrls': post.photosUrls,
                'comments': post.comments.length,
                'taggedUsers': post.taggedUsers,
                'publishedAt': post.publishedAt,
                'likes': post.likes.length
            })
        });

        return res.status(200).json({ 'posts': response })

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
        if (err == postErrors.postNotExistsError) {
            return res.status(400).json({ errorCode: errorCodes.postNotExist })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})

// Adds post
postsRouter.post('/', authenticateToken, doesRequesterOwn, async (req, res) => {
    try {
        await addPost(req.userId, {
            publishedAt: new Date(),
            photosUrls: req.body.photosUrls,
            publishedAt: req.body.publishedAt,
            taggedUsers: req.body.taggedUsers
        })
        res.sendStatus(200)
    }
    catch (err) {
        if (err == postErrors.invalidPostError) {
            return res.status(400).json({ errorCode: errorCodes.invalidPost })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})

// Deletes post
postsRouter.delete('/:postId', authenticateToken, doesRequesterOwn, async (req, res) => {
    try {
        await deletePost(req.userId, req.params.postId)
        res.sendStatus(200)
    }
    catch (err) {
        if (err == postErrors.postNotExistsError) {
            return res.status(400).json({ errorCode: errorCodes.postNotExist })
        }

        console.log(err)
        res.sendStatus(500)
    }
})

// Like post
postsRouter.post('/:postId/like', authenticateToken, doesHasPermission, async (req, res) => {

    try {
        await likePost(req.params.userId, req.params.postId, req.userId)
        res.sendStatus(200)
    }
    catch (err) {
        if (err == postErrors.postNotExistsError) {
            return res.status(400).json({ errorCode: errorCodes.postNotExist })
        }
        if (err == postErrors.alreadyLikedError) {
            return res.status(400).json({ errorCode: errorCodes.alreadyLiked })
        }

        console.log(err)
        res.sendStatus(500)
    }
})

// Unlike post
postsRouter.delete('/:postId/like', authenticateToken, doesHasPermission, async (req, res) => {

    try {
        await unlikePost(req.params.userId, req.params.postId, req.userId)
        res.sendStatus(200)
    }
    catch (err) {
        if (err == postErrors.postNotExistsError) {
            return res.status(400).json({ errorCode: errorCodes.postNotExist })
        }
        if (err == postErrors.alreadyUnlikedError) {
            return res.status(400).json({ errorCode: errorCodes.alreadyUnliked })
        }

        console.log(err)
        res.sendStatus(500)
    }
})

const commentRouter = require('./comment')
const { errorCodes } = require('../../errorCodes')
postsRouter.use('/:postId/comments/', commentRouter)

module.exports = { postsRouter }