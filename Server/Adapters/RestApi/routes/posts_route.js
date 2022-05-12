const express = require('express')
const { AuthenticationService } = require('../../../CustomHelpers/Authantication')
const { getPostById, addPost, deletePostById, getPostsByPublisherId } = require('../../../Use_cases/post')
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
            publisherId: post.publisherId,
            taggedUsers: post.taggedUsers,
            photos: post.photos,
            location: post.location,
            publisherComment: post.publisherComment,
            id: post.id,
            createdAt: post.createdAt,

            comments: post.comments,
            likes: post.likes,
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

    deletePostById(postId).then(() => {
        res.sendStatus(200)
    }).catch((error) => {
        if (error instanceof AppError) {
            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})


// Gets posts by publisher
postsRouter.get('/', authenticateToken, (req, res) => {
    const publisherId = req.query.publisherId
    const startIndex = parseInt(req.query.startIndex)

    if (!Number.isInteger(startIndex)) {
        return res.status(400).json("Invalid start index.")
    }

    getPostsByPublisherId(publisherId, startIndex).then(async (posts) => {

        const firstUserId = req.userId
        const secondUserId = publisherId
        const doesHasPermission = await AuthenticationService.hasPermission(firstUserId, secondUserId)
        if (!doesHasPermission) {
            return res.sendStatus(403)
        }

        const returnedList = []
        for (const post of posts) {

            const objectToReturn = {
                publisherId: post.publisherId,
                taggedUsers: post.taggedUsers,
                photos: post.photos,
                location: post.location,
                publisherComment: post.publisherComment,
                id: post.id,
                createdAt: post.createdAt,

                comments: post.comments,
                likes: post.likes,
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

module.exports = { postsRouter }