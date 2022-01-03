const express = require('express')
const Joi = require('joi')
const { getUserById, userModel, getUserByUsername, getUserByFullname } = require('../../models/User')
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
userRouter.get('/:userId', authenticateToken, async (req, res) => {
    try {
        var user

        if (req.query.searchBy == 'byUsername') {
            user = await getUserByUsername(req.params.userId)
        }
        else if (req.query.searchBy == 'byId') {
            user = await getUserById(req.params.userId)
        }
        else if (req.query.searchBy == 'byFullname') {
            user = await getUserByFullname(req.params.userId)
        }
        else {
            return res.status(400).json({ "errorCode": errorCodes.missingQueryParam })
        }

        if (user == null) {
            return res.status(400).json({ 'errorCode': errorCodes.userNotExist })
        }

        res.status(200).json({
            username: user.username,
            fullname: user.fullname,
            bio: user.bio,
            followers: user.followers.length,
            following: user.following.length,
            posts: user.posts.length
        })
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

// Gets followers of user
userRouter.get('/:userId/followers', authenticateToken, doesHasPermission, async (req, res) => {
    try {
        const user = await getUserById(req.params.userId)
        res.status(200).json({ 'followers': user.followers })
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

// Gets following of user
userRouter.get('/:userId/following', authenticateToken, doesHasPermission, async (req, res) => {
    try {
        const user = await getUserById(req.params.userId)
        res.status(200).json({ 'following': user.following })
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


// Deletes user
userRouter.delete('/:userId', authenticateToken, doesRequesterOwn, async (req, res) => {
    try {
        await userModel.deleteOne({ _id: req.userId })
        res.sendStatus(200)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

// Updates user fields
userRouter.patch('/:userId', authenticateToken, doesRequesterOwn, async (req, res) => {
    try {
        const user = await getUserById(req.userId)

        if (req.body.username != null && req.body.username != user.username) {

            const isUsernameUsed = await userModel.findOne({ username: req.body.username })
            if (isUsernameUsed != null) {
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
                user.followRequests.forEach(async (element) => {
                    const requesterUser = await getUserById(element)
                    const index = requesterUser.followingRequests.findIndex((request) => request == req.userId)
                    requesterUser.followingRequests.splice(index, 1)
                    requesterUser.save()
                });
                user.followRequests = []
            }
            user.isPrivate = req.body.isPrivate
        }

        if (!isUpdateValid(req.body)) {
            return res.status(400).json({ errorCode: errorCodes.invalidUpdateValues })
        }

        await user.save()
        res.sendStatus(200)
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
        const user = await getUserById(req.params.userId)
        const requesterUser = await getUserById(req.userId)

        if (user.followRequests.includes(req.userId)) {
            return res.status(400).json({ 'errorCode': errorCodes.followRequestAlreadySent })
        }
        if (user.followers.includes(req.userId)) {
            return res.status(400).json({ 'errorCode': errorCodes.alreadyFollowed })
        }

        if (user.isPrivate) {
            user.followRequests.push(req.userId)
            await user.save()

            requesterUser.followingRequests.push(req.params.userId)
            await requesterUser.save()

            return res.sendStatus(200)
        }
        else {
            user.followers.push(req.userId)
            await userModel.updateOne({ _id: req.params.userId }, user)

            requesterUser.following.push(req.params.userId)
            await userModel.updateOne({ _id: req.userId }, requesterUser)

            return res.sendStatus(200)
        }
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

// Unfollow user
userRouter.delete('/:userId/followers', authenticateToken, async (req, res) => {
    try {
        if (req.userId == req.params.userId) {
            return res.status(400).json({ 'errorCode': errorCodes.cantFollowHimself })
        }
        const user = await getUserById(req.params.userId)
        if (!user.followers.includes(req.userId)) {
            return res.status(400).json({ 'errorCode': errorCodes.alreadyUnfollowed })
        }

        const followerIndex = user.followers.findIndex((follower) => follower == req.userId)
        user.followers.splice(followerIndex, 1)
        await userModel.updateOne({ _id: req.params.userId }, user)


        const requesterUser = await getUserById(req.userId)
        const followingIndex = requesterUser.following.findIndex((following) => following == req.params.userId)
        requesterUser.following.splice(followingIndex, 1)
        await userModel.updateOne({ _id: req.userId }, requesterUser)

        res.sendStatus(200)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


// Accept follow request
userRouter.post('/:userId/followRequests', authenticateToken, doesRequesterOwn, async (req, res) => {
    try {

        const idOfUserToAccept = req.query.userToAccept
        if (idOfUserToAccept == null) {
            return res.status(400).json({ 'errorCode': errorCodes.missingUserToAccept })
        }

        const user = await getUserById(req.params.userId)
        const index = user.followRequests.findIndex((request) => request == idOfUserToAccept)

        if (index == -1) {
            return res.status(400).json({ 'errorCode': errorCodes.userNotInFollowRequests })
        }

        user.followRequests.splice(index, 1)
        user.followers.push(idOfUserToAccept)
        await user.save()

        const userToAccept = await getUserById(idOfUserToAccept)
        const index_ = userToAccept.followingRequests.findIndex((request) => request == req.params.userId)
        userToAccept.followingRequests.splice(index_, 1)
        userToAccept.following.push(req.params.userId)
        await userToAccept.save()

        res.sendStatus(200)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

// Deletes follow request
userRouter.delete('/:userId/followRequests', authenticateToken, doesRequesterOwn, async (req, res) => {
    try {

        const idOfUserToDelete = req.query.userToDelete
        if (idOfUserToDelete == null) {
            return res.status(400).json({ 'errorCode': errorCodes.missingUserToDelete })
        }

        const user = await getUserById(req.params.userId)
        const index = user.followRequests.findIndex((request) => request == idOfUserToDelete)
        if (index == -1) {
            return res.status(400).json({ 'errorCode': errorCodes.userNotInFollowRequests })
        }

        user.followRequests.splice(index, 1)
        await user.save()

        const userToDelete = await getUserById(idOfUserToDelete)
        const index_ = userToDelete.followingRequests.findIndex((request) => request == req.params.userId)
        userToDelete.followingRequests.splice(index_, 1)
        await userToDelete.save()

        res.sendStatus(200)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})


// Deletes follow request
userRouter.delete('/:userId/followingRequests', authenticateToken, doesRequesterOwn, async (req, res) => {
    try {

        const idOfUserToDelete = req.query.userToDelete
        if (idOfUserToDelete == null) {
            return res.status(400).json({ 'errorCode': errorCodes.missingUserToDelete })
        }

        const user = await getUserById(req.params.userId)
        const index = user.followingRequests.findIndex((request) => request == idOfUserToDelete)
        if (index == -1) {
            return res.status(400).json({ 'errorCode': errorCodes.userNotInFollowingRequests })
        }

        user.followingRequests.splice(index, 1)
        await user.save()

        const userToDelete = await getUserById(idOfUserToDelete)
        const index_ = userToDelete.followRequests.findIndex((request) => request == req.params.userId)
        userToDelete.followRequests.splice(index_, 1)
        await userToDelete.save()

        res.sendStatus(200)
    }
    catch (err) {
        console.log(err)
        res.sendStatus(500)
    }
})

const { postsRouter } = require('./post')
userRouter.use('/:userId/posts/', postsRouter)

const { storiesRouter } = require('./story')
const { errorCodes } = require('../../errorCodes')
userRouter.use('/:userId/stories/', storiesRouter)

module.exports = { userRouter }