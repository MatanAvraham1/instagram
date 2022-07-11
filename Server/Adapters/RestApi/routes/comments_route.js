const express = require('express')
const { AppError, AppErrorMessages } = require('../../../app_error')
const { AuthenticationService } = require('../../../CustomHelpers/Authantication')
const { getCommentById, addComment, deleteCommentById, getCommentsByPublisherId, getRepliesComments, getCommentsByPostId, likeCommentById, isCommentLiked, unlikeCommentById } = require('../../../Use_cases/comment')
const { getPostById } = require('../../../Use_cases/post')
const { getLastDayStoriesCount } = require('../../../Use_cases/story')
const { getUserById } = require('../../../Use_cases/user')
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

                if (error.message == AppErrorMessages.userDoesNotExist || error.message == AppErrorMessages.postDoesNotExist) {
                    return res.sendStatus(404).json(error.message)
                }

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
        const secondUserId = (await getPostById({ postId: comment.postId })).publisherId
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

        returnedObject.isLikedByMe = await isCommentLiked({ commentId, likerId: req.userId })

        res.status(200).json(returnedObject)
    }).catch((error) => {
        if (error instanceof AppError) {

            if (error.message == AppErrorMessages.commentDoesNotExist) {
                return res.sendStatus(404)
            }

            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})


// Deletes comment
commentsRouter.delete('/:commentId', authenticateToken, doesOwnCommentObject, (req, res) => {
    const commentId = req.params.commentId

    deleteCommentById({ commentId }).then(() => {
        res.sendStatus(200)
    }).catch((error) => {
        if (error instanceof AppError) {

            if (error.message == AppErrorMessages.commentDoesNotExist) {
                return res.sendStatus(404)
            }

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

    getCommentsByPublisherId({ publisherId, startFromIndex: startIndex }).then(async (comments) => {


        const returnedList = []
        for (const comment of comments) {

            const firstUserId = req.userId
            const secondUserId = (await getPostById({ postId: comment.postId })).publisherId
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

            objectToReturn.isLikedByMe = await isCommentLiked({ commentId: comment.id, likerId: req.userId })

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

// Gets replies
commentsRouter.get('/', authenticateToken, (req, res) => {
    const replyToComment = req.query.replyToComment
    const startIndex = parseInt(req.query.startIndex)

    if (!Number.isInteger(startIndex)) {
        return res.status(400).json("Invalid start index.")
    }

    getRepliesComments({ commentId: replyToComment, startFromIndex: startIndex }).then(async (comments) => {

        const firstUserId = req.userId
        const secondUserId = (await getPostById({ postId: (await getCommentById({ commentId: replyToComment })).postId })).publisherId
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

            objectToReturn.isLikedByMe = await isCommentLiked({ commentId: comment.id, likerId: req.userId })

            returnedList.push(objectToReturn)
        }


        res.status(200).json(returnedList)
    }).catch((error) => {
        if (error instanceof AppError) {


            if (error.message == AppErrorMessages.commentDoesNotExist) {
                return res.sendStatus(404)
            }

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
    const includePublisher = req.query.includePublisher == 'true'

    if (!Number.isInteger(startIndex)) {
        return res.status(400).json("Invalid start index.")
    }

    const firstUserId = req.userId
    const secondUserId = (await getPostById({ postId })).publisherId
    const doesHasPermission = await AuthenticationService.hasPermission(firstUserId, secondUserId)
    if (!doesHasPermission) {
        return res.sendStatus(403)
    }

    getCommentsByPostId({ postId, startFromIndex: startIndex }).then(async (comments) => {
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

            objectToReturn.isLikedByMe = await isCommentLiked({ commentId: comment.id, likerId: req.userId })
            if (includePublisher) {
                const commentPublisher = await getUserById({ userId: comment.publisherId })
                const userObject = {
                    id: commentPublisher.id,
                    username: commentPublisher.username,
                    fullname: commentPublisher.fullname,
                    bio: commentPublisher.bio,
                    isPrivate: commentPublisher.isPrivate,
                    followers: commentPublisher.followers,
                    followings: commentPublisher.followings,
                    posts: commentPublisher.posts,
                }
                const firstUserId = req.userId
                const secondUserId = commentPublisher.id

                const doesHasPermission = await AuthenticationService.hasPermission(firstUserId, secondUserId)
                if (doesHasPermission) {
                    userObject.lastDayStories = await getLastDayStoriesCount({ publisherId: secondUserId })
                }

                if (req.userId == user.id) {
                    userObject.followRequests = user.followRequests
                    userObject.followingRequests = user.followingRequests
                    userObject.stories = user.stories
                    userObject.createdAt = user.createdAt

                    userObject.isFollowedByMe = false;
                    userObject.isFollowMe = false;
                    userObject.isRequestedByMe = false;
                    userObject.isRequestMe = false;
                }
                else {
                    userObject.isFollowedByMe = await isFollow({ firstUserId, secondUserId })
                    userObject.isFollowMe = await isFollow({ firstUserId: secondUserId, secondUserId: firstUserId })

                    if (userObject.isFollowedByMe) {
                        userObject.isRequestedByMe = false;
                    }
                    else {
                        userObject.isRequestedByMe = isRequest({ firstUserId, secondUserId });
                    }

                    if (userObject.isFollowMe) {
                        userObject.isRequestMe = false;
                    }
                    else {
                        userObject.isRequestMe = isRequest({ firstUserId: secondUserId, secondUserId: firstUserId });
                    }
                }

                objectToReturn.publisher = userObject
            }

            returnedList.push(objectToReturn)
        }

        res.status(200).json(returnedList)
    }).catch((error) => {
        if (error instanceof AppError) {
            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})

// Like comment
commentsRouter.post('/:commentId/like', authenticateToken, (req, res) => {

    const commentId = req.params.commentId

    likeCommentById({ commentId, likerId: req.userId }).then(async () => {
        res.sendStatus(200)
    }).catch((error) => {
        if (error instanceof AppError) {

            if (error.message == AppErrorMessages.userDoesNotExist || error.message == AppErrorMessages.commentDoesNotExist) {
                return res.sendStatus(404).json(error.message)
            }

            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})


// Unlike comment
commentsRouter.post('/:commentId/unlike', authenticateToken, (req, res) => {

    const commentId = req.params.commentId

    unlikeCommentById({ commentId, likerId: req.userId }).then(async () => {
        res.sendStatus(200)
    }).catch((error) => {
        if (error instanceof AppError) {

            if (error.message == AppErrorMessages.userDoesNotExist || error.message == AppErrorMessages.commentDoesNotExist) {
                return res.sendStatus(404).json(error.message)
            }

            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})


module.exports = { commentsRouter }