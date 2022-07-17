const express = require('express')
const multer = require('multer')
const mime = require('mime');
const path = require('path')
const { AppErrorMessages, AppError } = require('../../../app_error')
const { AuthenticationService } = require('../../../CustomHelpers/Authantication')
const { getPostById, addPost, deletePostById, getPostsByPublisherId, isPostLiked, likePost, unlikePost } = require('../../../Use_cases/post')
const { authenticateToken, doesOwnPostObject } = require('../middleware')
const postsRouter = express.Router()

const postsPhotosFolderPath = path.join(path.join(path.dirname(path.dirname(path.dirname(__dirname))), 'postsPhotos/'))

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, postsPhotosFolderPath);
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '.' + mime.getExtension(file.mimetype));
    }
})

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter,
})


// Add post
postsRouter.post('/', authenticateToken, upload.array('photos'), (req, res) => {
    const userId = req.userId

    const photos = []
    for (const file of req.files) {
        photos.push(file.filename)
    }

    addPost({ publisherId: userId, photos: photos, location: req.body.location, publisherComment: req.body.publisherComment, taggedUsers: req.body.taggedUsers == 0 ? req.body.taggedUsers : [] })
        .then(async (postId) => {
            res.status(201).json({ postId: postId })
        }).catch((error) => {
            if (error instanceof AppError) {

                if (error.message == AppErrorMessages.userDoesNotExist) {
                    return res.sendStatus(404)
                }

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
        const secondUserId = post.publisherId
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

        returnedObject.isLikedByMe = await isPostLiked({ postId, likerId: req.userId })

        res.status(200).json(returnedObject)
    }).catch((error) => {
        if (error instanceof AppError) {

            if (error.message == AppErrorMessages.postDoesNotExist) {
                return res.sendStatus(404)
            }

            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})


// Deletes post
postsRouter.delete('/:postId', authenticateToken, doesOwnPostObject, (req, res) => {
    const postId = req.params.postId

    deletePostById({ postId }).then(() => {
        res.sendStatus(200)
    }).catch((error) => {
        if (error instanceof AppError) {

            if (error.message == AppErrorMessages.postDoesNotExist) {
                return res.sendStatus(404)
            }

            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})


// Gets posts by publisher
postsRouter.get('/', authenticateToken, async (req, res) => {
    const publisherId = req.query.publisherId
    const startIndex = parseInt(req.query.startIndex)

    if (!Number.isInteger(startIndex)) {
        return res.status(400).json("Invalid start index.")
    }

    const firstUserId = req.userId
    const secondUserId = publisherId
    const doesHasPermission = await AuthenticationService.hasPermission(firstUserId, secondUserId)
    if (!doesHasPermission) {
        return res.sendStatus(403)
    }

    getPostsByPublisherId({ publisherId: publisherId, startFromIndex: startIndex }).then(async (posts) => {
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

            objectToReturn.isLikedByMe = await isPostLiked({ postId: post.id, likerId: req.userId })

            returnedList.push(objectToReturn)
        }


        res.status(200).json(returnedList)
    }).catch((error) => {
        if (error instanceof AppError) {

            if (error.message == AppErrorMessages.userDoesNotExist) {
                return res.sendStatus(404)
            }

            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})

// Like post
postsRouter.post('/:postId/like', authenticateToken, (req, res) => {

    const postId = req.params.postId

    likePost({ postId, likerId: req.userId }).then(async () => {
        res.sendStatus(200)
    }).catch((error) => {
        if (error instanceof AppError) {

            if (error.message == AppErrorMessages.userDoesNotExist || error.message == AppErrorMessages.postDoesNotExist) {
                return res.sendStatus(404).json(error.message)
            }

            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})


// Unlike post
postsRouter.post('/:postId/unlike', authenticateToken, (req, res) => {

    const postId = req.params.postId

    unlikePost({ postId, likerId: req.userId }).then(async () => {
        res.sendStatus(200)
    }).catch((error) => {
        if (error instanceof AppError) {

            if (error.message == AppErrorMessages.userDoesNotExist || error.message == AppErrorMessages.postDoesNotExist) {
                return res.sendStatus(404).json(error.message)
            }

            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})


// Gets post photo
postsRouter.get('/:postId/:photoName', authenticateToken, (req, res) => {
    const postId = req.params.postId
    const photoName = req.params.photoName

    getPostById({ postId }).then(async (post) => {

        const firstUserId = req.userId
        const secondUserId = post.publisherId
        const doesHasPermission = await AuthenticationService.hasPermission(firstUserId, secondUserId)
        if (!doesHasPermission) {
            return res.sendStatus(403)
        }

        return res.sendFile(path.join(postsPhotosFolderPath, photoName))

    }).catch((error) => {
        if (error instanceof AppError) {

            if (error.message == AppErrorMessages.postDoesNotExist) {
                return res.sendStatus(404)
            }

            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})


module.exports = { postsRouter }