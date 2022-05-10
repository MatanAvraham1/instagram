const express = require('express')
const { getPostById, addPost, deletePostById } = require('../../../Use_cases/post')
const { authenticateToken, doesOwnPostObject } = require('../middleware')
const postsRouter = express.Router()

// Add post
postsRouter.post('/', authenticateToken, (req, res) => {
    const userId = req.userId

    addPost({ publisherId: userId, photos: req.body.photos, location: req.body.location, publisherComment: req.body.publisherComment, taggedUsers: req.body.taggedUsers })
        .then(async (postId) => {
            res.status(201).json({ postId: postId })
        }).catch((error) => {
            if (error instanceof AppError) {
                return res.status(400).json(error.message)
            }

            res.sendStatus(500)
            console.error(error)
        })
})


// Gets post
postsRouter.get('/:postId', authenticateToken, (req, res) => {
    const postId = req.params.postId

    getPostById({ postId }).then(async (post) => {

        const firstUserId = req.userId
        const secondUserId = postId.publisherId
        const doesHasPermission = await AuthenticationService.hasPermission(firstUserId, secondUserId)
        if (!doesHasPermission) {
            return res.sendStatus(403)
        }

        const returnedObject = {
            id: post.id,
            taggedUsers: post.taggedUsers,
            publisherId: post.publisherId,
            photos: post.photos,
            createdAt: post.createdAt
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


// Deletes post
postsRouter.delete('/:postId', authenticateToken, doesOwnPostObject, (req, res) => {
    const postId = req.params.postId

    deletePostById(postId).then(async () => {
        res.sendStatus(200)
    }).catch((error) => {
        if (error instanceof AppError) {
            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})

// Gets posts of publisher
postsRouter.get('/', authenticateToken, (req, res) => {


    const publisherId = req.query.publisherId

    const firstUserId = req.userId
    const secondUserId = publisherId
    const doesHasPermission = await AuthenticationService.hasPermission(firstUserId, secondUserId)
    if (!doesHasPermission) {
        return res.sendStatus(403)
    }



})