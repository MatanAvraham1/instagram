const express = require('express')
const Joi = require('joi')
const { getUserById, getUserByUsername, getUserByFullname, deleteUser, userErrors, doesUsernameAlreadyUsed, clearFollowRequests, updateUser, followUser, unfollowUser, acceptFollowRequest, deleteFollowRequest, deleteFollowingRequest } = require('../../models/User')
const userRouter = express.Router()
const { authenticateToken } = require('../auth')
const { doesRequesterOwn, doesHasPermission } = require('../../helpers/privacyHelper')

function isUpdateValid(data) {
    const scheme = Joi.object({
        username: Joi.string(),
        fullname: Joi.string().min(0),
        bio: Joi.string().min(0),
        isPrivate: Joi.boolean()
    })
    const value = scheme.validate(data)

    if (value.error == null) {
        return true
    }

    return false
}



// Gets user
userRouter.get('/:userToSearch', authenticateToken, async (req, res) => {
    try {
        var user

        if (req.query.searchBy == 'byUsername') {
            user = await getUserByUsername(req.params.userToSearch)
        }
        else if (req.query.searchBy == 'byId') {
            user = await getUserById(req.params.userToSearch)
        }
        else if (req.query.searchBy == 'byFullname') {
            user = await getUserByFullname(req.params.userToSearch)
        }
        else {
            return res.status(400).json({ "errorCode": errorCodes.missingQueryParam })
        }

        return res.status(200).json({
            username: user.username,
            fullname: user.fullname,
            bio: user.bio,
            followers: user.followers.length,
            following: user.following.length,
            posts: user.posts.length
        })
    }
    catch (err) {

        if (err == userErrors.userNotExistsError) {
            return res.status(400).json({ 'errorCode': errorCodes.userNotExist })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})

// Gets followers of user
userRouter.get('/:userId/followers', authenticateToken, doesHasPermission, async (req, res) => {
    try {
        const user = await getUserById(req.params.userId)
        res.status(200).json({ 'followers': user.followers })
    }
    catch (err) {
        if (err == userErrors.userNotExistsError) {
            return res.status(400).json({ 'errorCode': errorCodes.userNotExist })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})

// Gets following of user
userRouter.get('/:userId/following', authenticateToken, doesHasPermission, async (req, res) => {
    try {
        const user = await getUserById(req.params.userId)
        return res.status(200).json({ 'following': user.following })
    }
    catch (err) {
        if (err == userErrors.userNotExistsError) {
            return res.status(400).json({ 'errorCode': errorCodes.userNotExist })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})


// Deletes user
userRouter.delete('/:userId', authenticateToken, doesRequesterOwn, async (req, res) => {
    try {
        await deleteUser(req.userId)
        return res.sendStatus(200)
    }
    catch (err) {
        if (err == userErrors.userNotExistsError) {
            return res.status(400).json({ 'errorCode': errorCodes.userNotExist })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})

// Updates user fields
userRouter.patch('/:userId', authenticateToken, doesRequesterOwn, async (req, res) => {
    try {
        const user = await getUserById(req.userId)

        if (req.body.username != null && req.body.username != user.username) {

            if (await doesUsernameAlreadyUsed(req.body.username)) {
                return res.status(400).json({ errorCode: errorCodes.usernameAlreadyUsed })
            }
            user.username = req.body.username
        }
        if (req.body.fullname != null && req.body.fullname != user.fullname) {
            user.fullname = req.body.fullname
        }
        if (req.body.bio != null && req.body.bio != user.bio) {
            user.bio = req.body.bio
        }
        if (req.body.isPrivate != null && req.body.isPrivate != user.isPrivate) {

            // If changed from false to true
            // Clears the follow requests
            if (!req.body.isPrivate) {
                await clearFollowRequests(req.userId)
            }
            user.isPrivate = req.body.isPrivate
        }

        if (!isUpdateValid(req.body)) {
            return res.status(400).json({ errorCode: errorCodes.invalidUpdateValues })
        }

        await updateUser(req.userId, user)
        return res.sendStatus(200)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


// Follow user
userRouter.post('/:userId/followers', authenticateToken, async (req, res) => {
    try {
        if (req.userId == req.params.userId) {
            return res.status(400).json({ 'errorCode': errorCodes.cantFollowHimself })
        }

        await followUser(req.userId, req.params.userId)
    }
    catch (err) {

        if (err == userErrors.alreadyFollowedError) {
            return res.status(400).json({ errorCode: errorCodes.alreadyFollowed })
        }
        if (err == userErrors.followRequestAlreadySent) {
            return res.status(400).json({ errorCode: errorCodes.followRequestAlreadySent })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})

// Unfollow user
userRouter.delete('/:userId/followers', authenticateToken, async (req, res) => {
    try {
        if (req.userId == req.params.userId) {
            return res.status(400).json({ 'errorCode': errorCodes.cantFollowHimself })
        }

        await unfollowUser(req.userId, req.params.userId)

        res.sendStatus(200)
    }
    catch (err) {
        if (err == userErrors.alreadyUnfollowedError) {
            return res.status(400).json({ errorCode: errorCodes.alreadyUnfollowed })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})


// Accept follow request
userRouter.post('/:userId/followRequests', authenticateToken, doesRequesterOwn, async (req, res) => {
    try {

        const idOfUserToAccept = req.query.userToAccept
        if (idOfUserToAccept == null) {
            return res.status(400).json({ 'errorCode': errorCodes.missingUserToAccept })
        }

        await acceptFollowRequest(req.params.userId, idOfUserToAccept)

        return res.sendStatus(200)
    }
    catch (err) {
        if (err == userErrors.followRequestNotExists) {
            return res.status(400).json({ errorCode: errorCodes.userNotInFollowRequests })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})

// Deletes follow request
userRouter.delete('/:userId/followRequests', authenticateToken, doesRequesterOwn, async (req, res) => {
    try {

        const idOfUserToDelete = req.query.userToDelete
        if (idOfUserToDelete == null) {
            return res.status(400).json({ 'errorCode': errorCodes.missingUserToDelete })
        }

        await deleteFollowRequest(req.userId, idOfUserToDelete)
        return res.sendStatus(200)
    }
    catch (err) {
        if (err == userErrors.followRequestNotExists) {
            return res.status(400).json({ errorCode: errorCodes.userNotInFollowRequests })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})


// Deletes following request
userRouter.delete('/:userId/followingRequests', authenticateToken, doesRequesterOwn, async (req, res) => {
    try {

        const idOfUserToDelete = req.query.userToDelete
        if (idOfUserToDelete == null) {
            return res.status(400).json({ 'errorCode': errorCodes.missingUserToDelete })
        }

        await deleteFollowingRequest(req.userId, idOfUserToDelete)

        return res.sendStatus(200)
    }
    catch (err) {
        if (err == userErrors.followingRequestNotExists) {
            return res.status(400).json({ errorCode: errorCodes.userNotInFollowingRequests })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})

const { postsRouter } = require('./post')
userRouter.use('/:userId/posts/', postsRouter)

const { storiesRouter } = require('./story')
const { errorCodes } = require('../../errorCodes')
userRouter.use('/:userId/stories/', storiesRouter)

module.exports = { userRouter }