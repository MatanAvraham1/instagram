const express = require('express')
const postsRouter = express.Router({ mergeParams: true })

const { authenticateToken } = require('../../routes/user/auth_route')
const { getPostById, getPosts, postErrors, addPost, deletePost, likePost, unlikePost, getFeedPosts, isPostLiked } = require('../../models/post_model')
const { getUserById, userModel, isFollow } = require('../../models/user_model')
const { doesRequesterOwn, doesHasPermission } = require('../../helpers/privacyHelper')
const { getLast24HoursStories } = require('../../models/story_model')
const { errorCodes } = require('../../errorCodes')


// Returns the posts of user's followings by  date
postsRouter.get('/feed', authenticateToken, doesHasPermission, async (req, res) => {
    try {
        return res.json([]) // TODO : fix that

        const startFromPostIndex = req.query.startFrom
        const endOnPostIndex = startFromPostIndex + 15
        if (startFromPostIndex === undefined) {
            return res.sendStatus(400)
        }

        let includePublisherInResponse = false
        if (req.query.includePublisherInResponse) {
            includePublisherInResponse = true
        }

        let response = []
        const posts = await getFeedPosts(req.params.userId)

        for (const post of posts.slice(startFromPostIndex, endOnPostIndex > posts.length ? posts.length : endOnPostIndex)) {

            const _post = {
                'photosUrls': post.photosUrls,
                'comments': post.comments.length,
                'taggedUsers': post.taggedUsers,
                'publishedAt': post.publishedAt,
                'likes': post.likes.length,
                'publisherComment': post.publisherComment,
                'location': post.location,
                'isLikedByMe': post.likes.includes(req.userId),
                'id': post._id
            }
            if (includePublisherInResponse) {
                const user = await userModel.findOne({ "posts._id": post._id })
                _post['publisher'] = {
                    username: user.username,
                    fullname: user.fullname,
                    bio: user.bio,
                    photoUrl: user.photoUrl,
                    isPrivate: user.isPrivate,
                    followers: user.followers.length,
                    followings: user.followings.length,
                    posts: user.posts.length,
                    stories: (await getLast24HoursStories(user._id, false)).length,
                    isFollowMe: user.followings.includes(req.userId),
                    isFollowedByMe: user.followers.includes(req.userId),
                    isRequestedByMe: user.followRequests.includes(req.userId),
                    id: user._id
                }
            }
            response.push(_post)
        }

        return res.status(200).json(response)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

postsRouter.get('/', authenticateToken, doesHasPermission, async (req, res) => {
    /*
    Returns the posts of req.params.userId

    req.query.startFrom tells the function from which index of the posts list start returning
    If req.query.startFrom isn't an integer or ungiven, 400 will be returned
    */

    try {
        const startFromPostIndex = parseInt(req.query.startFrom)
        if (startFromPostIndex === undefined || !Number.isInteger(startFromPostIndex)) {
            return res.sendStatus(400)
        }


        let response = []
        const posts = await getPosts(req.params.userId, startFromPostIndex, 15)
        for (const post of posts) {
            response.push({
                post: post,
                isLikedByMe: await isPostLiked(post._id.toString(), req.userId)
            })
        }

        return res.status(200).json(response)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

postsRouter.get('/:postId', authenticateToken, doesHasPermission, async (req, res) => {
    /*
    Returns post by id (req.params.postId)

    req.query.includePublisherInResponse tells the function to return the publisher of the post with the post or not.
    If req.query.includePublisherInResponse isn't an bool or ungiven, 400 will be returned
    */

    try {

        const includePublisherInResponse = req.query.includePublisherInResponse
        if (includePublisherInResponse === undefined || typeof includePublisherInResponse != "boolean") {
            return res.sendStatus(400)
        }

        const post = await getPostById(req.params.postId)
        response = {
            post: post,
            isLikedByMe: await isPostLiked(post._id.toString(), req.userId)
        }

        if (includePublisherInResponse) {
            let isOwner = req.userId == req.params.userId
            let privateMode = true

            if (isOwner) {
                privateMode = false
            }
            else {
                if (await isFollow(req.userId, req.params.userId)) {
                    privateMode = false
                }
            }

            const user = await getUserById(req.params.userId, privateMode, isOwner)
            response.publisher = {
                user: user,
                isFollowedByMe: await isFollow(req.userId, req.params.userId),
                isFollowMe: await isFollow(req.params.userId, req.userId),
                isRequestedByMe: await isRequested(req.userId, req.params.userId),
                isRequestMe: await isRequested(req.params.userId, req.userId)
            }
        }

        res.status(200).json(response)
    }
    catch (err) {
        if (err === postErrors.postNotExistsError) {
            return res.sendStatus(404)
        }

        console.log(err)
        return res.sendStatus(500)
    }
})

postsRouter.post('/', authenticateToken, doesRequesterOwn, async (req, res) => {
    /*
    Publishes new post
    */

    try {
        const postId = await addPost({
            owners: [req.userId],
            photosUrls: req.body.photosUrls,
            taggedUsers: req.body.taggedUsers,
            publisherComment: req.body.publisherComment,
            location: req.body.location,
        })
        res.status(201).json({ postId: postId })
    }
    catch (err) {
        if (err === postErrors.invalidPostError) {
            return res.status(400).json({ errorCode: errorCodes.invalidPost })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})

postsRouter.delete('/:postId', authenticateToken, doesRequesterOwn, async (req, res) => {
    /*
    Deletes post by id (req.params.postId)
    */

    try {
        await deletePost(req.params.postId)
        res.sendStatus(204)
    }
    catch (err) {
        if (err === postErrors.postNotExistsError) {
            return res.sendStatus(404)
        }

        console.log(err)
        res.sendStatus(500)
    }
})

postsRouter.post('/:postId/likes', authenticateToken, doesHasPermission, async (req, res) => {
    /*
    Likes post by id (req.params.postId)
    */

    try {
        await likePost(req.params.postId, req.userId)
        return res.sendStatus(201)
    }
    catch (err) {
        if (err === postErrors.postNotExistsError) {
            return res.sendStatus(404)
        }
        if (err === postErrors.alreadyLikedError) {
            return res.status(400).json({ errorCode: errorCodes.alreadyLiked })
        }

        console.log(err)
        res.sendStatus(500)
    }
})

postsRouter.delete('/:postId/likes', authenticateToken, doesHasPermission, async (req, res) => {
    /*
    Unlikes post by id (req.params.postId)
    */

    try {
        await unlikePost(req.params.postId, req.userId)
        return res.sendStatus(204)
    }
    catch (err) {
        if (err === postErrors.postNotExistsError) {
            return res.sendStatus(404)
        }
        if (err === postErrors.alreadyUnlikedError) {
            return res.status(400).json({ errorCode: errorCodes.alreadyUnliked })
        }

        console.log(err)
        res.sendStatus(500)
    }
})

const commentRouter = require('./comment_route')
postsRouter.use('/:postId/comments/', commentRouter)

module.exports = { postsRouter }