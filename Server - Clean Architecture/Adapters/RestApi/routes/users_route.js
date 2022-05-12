
const express = require('express')
const { authenticateToken, doesOwnUserObject } = require('../middleware')
const { getUserById, deleteUserById, updateFields } = require('../../../Use_cases/user/index')
const { AppError } = require('../../../app_error');
const { AuthenticationService } = require('../../../CustomHelpers/Authantication');

const userRouter = express.Router()

// Gets user
userRouter.get('/:userId', authenticateToken, (req, res) => {
    const userId = req.params.userId

    getUserById({ userId }).then(async (user) => {

        const returnedObject = {
            id: user.id,
            username: user.username,
            fullname: user.fullname,
            bio: user.bio,
            isPrivate: user.isPrivate,
            followers: user.followers,
            followings: user.followings,
            posts: user.posts,
        }

        if (req.userId == userId) {
            returnedObject.followRequests = user.followRequests
            returnedObject.followingRequests = user.followingRequests
            returnedObject.stories = user.stories
            returnedObject.createdAt = user.createdAt
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

// Deletes user
userRouter.delete('/:userId', authenticateToken, doesOwnUserObject, (req, res) => {
    const userId = req.params.userId

    deleteUserById({ userId }).then(() => {
        res.sendStatus(200)
    }).catch((error) => {
        if (error instanceof AppError) {
            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})

// Update fields
userRouter.put('/', authenticateToken, (req, res) => {

    const userId = req.userId
    const newFields = req.body

    const newUsername = newFields.username
    const newFullname = newFields.fullname
    const newBio = newFields.bio
    const newIsPrivate = newFields.isPrivate


    updateFields({ userId, newUsername, newFullname, newBio, newIsPrivate }).then(() => {
        res.sendStatus(200)
    }).catch((error) => {
        if (error instanceof AppError) {
            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })

})

// Gets followers of user
userRouter.get('/:userId/followers', authenticateToken, async (req, res) => {

    const firstUserId = req.userId
    const secondUserId = req.params.userId
    const doesHasPermission = await AuthenticationService.hasPermission(firstUserId, secondUserId)
    if (!doesHasPermission) {
        return res.sendStatus(403)
    }

    const userId = req.params.userId
    const startIndex = parseInt(req.query.startIndex)

    if (!Number.isInteger(startIndex)) {
        return res.status(400).json("Invalid start index.")
    }

    getFollowers({ userId, startIndex }).then((followers) => {
        res.status(200).json(followers)
    }).catch((error) => {
        if (error instanceof AppError) {
            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})

module.exports = { userRouter }