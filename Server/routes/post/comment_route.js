const express = require('express');
const commentRouter = express.Router({ mergeParams: true })

const { commentErrors, getComments, addComment, deleteComment, likeComment, unlikeComment } = require('../../models/comment_model');
const { getUserById, userModel, userErrors, isFollow } = require('../../models/user_model');
const { authenticateToken } = require('../user/auth_route');
const { doesHasPermission } = require('../../helpers/privacyHelper');
const { postErrors } = require('../../models/post_model');
const { getCommentById } = require('../../models/comment_model')
const { getLast24HoursStories } = require('../../models/story_model')
const { errorCodes } = require('../../errorCodes');
const { isError } = require('joi');
const { response } = require('express');


commentRouter.get('/:commentId', authenticateToken, doesHasPermission, async (req, res) => {
    /*
    Returns comment by id (req.params.commentId)

    req.query.includePublisherInResponse tells the function to return the publisher of the comment with the comment or not.
    If req.query.includePublisherInResponse isn't an bool or ungiven, 400 will be returned
    */

    try {

        const includePublisherInResponse = req.query.includePublisherInResponse
        if (includePublisherInResponse === undefined || typeof includePublisherInResponse != "boolean") {
            return res.sendStatus(400)
        }

        const comment = await getCommentById(req.params.commentId)
        response = {
            comment: comment
        }

        if (includePublisherInResponse) {
            const user = await getUserById(comment.publisherId, false, false)

            if (user._id.toString() != req.userId) {
                delete user.followRequests
                delete user.followingRequests
            }
            if (user.isPrivate && !await isFollow(req.userId, user)) {
                delete user.stories
            }

            response.publisher = {
                user: user,
                isFollowedByMe: await isFollow(req.userId, user._id.toString()),
                isFollowMe: await isFollow(user._id.toString(), req.userId),
                isRequestedByMe: await isRequested(req.userId, user._id.toString()),
                isRequestMe: await isRequested(user._id.toString(), req.userId)
            }
        }

        res.status(200).json(response)
    }
    catch (err) {

        if (err === commentErrors.commentNotExist) {
            return res.sendStatus(404)
        }

        console.log(err)
        return res.sendStatus(500)
    }
})


commentRouter.get('/', authenticateToken, doesHasPermission, async (req, res) => {
    /*
    Returns comments of post (req.params.postId)

    req.query.includePublisherInResponse tells the function to return the publisher of the comment with the comment or not.
    If req.query.includePublisherInResponse isn't an bool or ungiven, 400 will be returned

    req.query.startFrom tells the function from which index of the comments list start returning
    If req.query.startFrom isn't an integer or ungiven, 400 will be returned
    */

    const howMuchCommentToReturn = 30

    try {
        const startFromCommentIndex = parseInt(req.query.startFrom)
        if (startFromCommentIndex === undefined || !Number.isInteger(startFromCommentIndex)) {
            return res.sendStatus(400)
        }

        const includePublisherInResponse = req.query.includePublisherInResponse
        if (includePublisherInResponse === undefined || typeof includePublisherInResponse != "boolean") {
            return res.sendStatus(400)
        }


        const response = []
        const comments = await getComments(req.params.postId, startFromCommentIndex, howMuchCommentToReturn)

        for (const comment of comments) {


            if (includePublisherInResponse) {
                const user = await getUserById(comment.publisherId, false, false)

                if (user._id.toString() != req.userId) {
                    delete user.followRequests
                    delete user.followingRequests
                }
                if (user.isPrivate && !await isFollow(req.userId, user)) {
                    delete user.stories
                }

                comment.publisher = {
                    user: user,
                    isFollowedByMe: await isFollow(req.userId, user._id.toString()),
                    isFollowMe: await isFollow(user._id.toString(), req.userId),
                    isRequestedByMe: await isRequested(req.userId, user._id.toString()),
                    isRequestMe: await isRequested(user._id.toString(), req.userId)
                }

                response.push(comment)
            }
        }

        return res.status(200).json(response)
    }
    catch (err) {
        if (err === userErrors.userNotExistsError) {
            return res.sendStatus(404)
        }
        if (err === postErrors.postNotExistsError) {
            return res.sendStatus(404)
        }

        console.log(err)
        res.sendStatus(500)
    }
})


commentRouter.post('/', authenticateToken, doesHasPermission, async (req, res) => {
    /*
    Publishes new comment
    */

    try {
        const commentId = await addComment({
            postId: req.params.postId,
            publisherId: req.userId,
            comment: req.body.comment,
        })
        return res.status(201).json({ commentId: commentId })
    }
    catch (err) {

        if (err === userErrors.userNotExistsError) {
            return res.sendStatus(404)
        }
        if (err === postErrors.postNotExistsError) {
            return res.sendStatus(404)
        }
        if (err === commentErrors.invalidCommentError) {
            return res.status(400).json({ errorCode: errorCodes.invalidComment })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})

commentRouter.delete('/:commentId', authenticateToken, doesHasPermission, async (req, res) => {
    /*
    Deletes comment by id (req.params.commentId)

    */
    try {
        await deleteComment(req.params.commentId)
        res.sendStatus(204)
    }
    catch (err) {
        if (err === commentErrors.commentNotExist) {
            return res.sendStatus(404)
        }

        console.log(err)
        return res.sendStatus(500)
    }
})

// Like comment
commentRouter.post('/:commentId/likes', authenticateToken, doesHasPermission, async (req, res) => {

    try {
        await likeComment(req.params.commentId, req.userId)
        return res.sendStatus(201)
    }
    catch (err) {
        if (err === commentErrors.commentNotExist) {
            return res.sendStatus(404)
        }
        if (err === commentErrors.alreadyLikedError) {
            return res.status(400).json({ errorCode: errorCodes.alreadyLiked })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})

// Unlike comment
commentRouter.delete('/:commentId/likes', authenticateToken, doesHasPermission, async (req, res) => {

    try {
        await unlikeComment(req.params.commentId, req.userId)
        return res.sendStatus(204)
    }
    catch (err) {
        if (err === commentErrors.commentNotExist) {
            return res.sendStatus(404)
        }
        if (err === commentErrors.alreadyUnlikedError) {
            return res.status(400).json({ errorCode: errorCodes.alreadyUnliked })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})

module.exports = commentRouter