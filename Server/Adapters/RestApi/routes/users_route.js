
const express = require('express')
const { authenticateToken, doesOwnUserObject } = require('../middleware')
const { getUserById, deleteUserById, updateFields, getUserByUsername, getUserByFullname, getFollowers, getFollowings, isFollow, isRequest } = require('../../../Use_cases/user/index')
const { AppError, AppErrorMessages } = require('../../../app_error');
const { AuthenticationService } = require('../../../CustomHelpers/Authantication');
const { getLastDayStoriesCount } = require('../../../Use_cases/story');

const userRouter = express.Router()

// Gets user
userRouter.get('/:userToSearch', authenticateToken, async (req, res) => {
    let user
    const searchBy = req.query.searchBy

    try {
        if (searchBy == "Id") {
            user = await getUserById({ userId: req.params.userToSearch })
        }
        if (searchBy == "Fullname") {
            user = await getUserByFullname({ fullname: req.params.userToSearch })
        }
        if (searchBy == "Username") {
            user = await getUserByUsername({ username: req.params.userToSearch })
        }
        else {
            return res.sendStatus(400)
        }

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

        const firstUserId = req.userId
        const secondUserId = user.id

        const doesHasPermission = await AuthenticationService.hasPermission(firstUserId, secondUserId)
        if (doesHasPermission) {
            returnedObject.lastDayStories = await getLastDayStoriesCount(secondUserId)
        }

        if (req.userId == user.id) {
            returnedObject.followRequests = user.followRequests
            returnedObject.followingRequests = user.followingRequests
            returnedObject.stories = user.stories
            returnedObject.createdAt = user.createdAt

            returnedObject.isFollowedByMe = false;
            returnedObject.isFollowMe = false;
            returnedObject.isRequestedByMe = false;
            returnedObject.isRequestMe = false;
        }
        else {
            returnedObject.isFollowedByMe = await isFollow(firstUserId, secondUserId)
            returnedObject.isFollowMe = await isFollow(secondUserId, firstUserId)

            if (returnedObject.isFollowedByMe) {
                returnedObject.isRequestedByMe = false;
            }
            else {
                returnedObject.isRequestedByMe = isRequest(firstUserId, secondUserId);
            }

            if (returnedObject.isFollowMe) {
                returnedObject.isRequestMe = false;
            }
            else {
                returnedObject.isRequestMe = isRequest(secondUserId, firstUserId);
            }
        }

        return res.status(200).json(returnedObject)
    }
    catch (error) {
        if (error instanceof AppError) {

            if (error.message == AppErrorMessages.userDoesNotExist) {
                return res.sendStatus(404)
            }

            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    }
})

// Deletes user
userRouter.delete('/:userId', authenticateToken, doesOwnUserObject, (req, res) => {
    const userId = req.params.userId

    deleteUserById({ userId }).then(() => {
        res.sendStatus(200)
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

// Update fields
userRouter.patch('/', authenticateToken, (req, res) => {

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

            if (error.message == AppErrorMessages.userDoesNotExist) {
                return res.sendStatus(404)
            }

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

        const response = [];
        for (const user of followers) {

            const userObject = {
                id: user.id,
                username: user.username,
                fullname: user.fullname,
                bio: user.bio,
                isPrivate: user.isPrivate,
                followers: user.followers,
                followings: user.followings,
                posts: user.posts,
            }

            const doesHasPermission = await AuthenticationService.hasPermission(firstUserId, user.id)
            if (doesHasPermission) {
                userObject.lastDayStories = await getLastDayStoriesCount(user.id)
            }

            userObject.isFollowedByMe = await isFollow(firstUserId, user.id);
            userObject.isFollowMe = true;
            if (userObject.isFollowedByMe) {
                userObject.isRequestedByMe = false;
            }
            else {
                userObject.isRequestedByMe = isRequest(firstUserId, user.id);
            }
            userObject.isRequestMe = false;

            response.push(userObject)
        }

        res.status(200).json(response)
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

// Gets followings of user
userRouter.get('/:userId/followings', authenticateToken, async (req, res) => {

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

    getFollowings({ userId, startIndex }).then((followings) => {
        const response = [];
        for (const user of followings) {

            const userObject = {
                id: user.id,
                username: user.username,
                fullname: user.fullname,
                bio: user.bio,
                isPrivate: user.isPrivate,
                followers: user.followers,
                followings: user.followings,
                posts: user.posts,
            }

            const doesHasPermission = await AuthenticationService.hasPermission(firstUserId, user.id)
            if (doesHasPermission) {
                userObject.lastDayStories = await getLastDayStoriesCount(user.id)
            }


            userObject.isFollowedByMe = true;
            userObject.isFollowMe = await isFollow(user.id, firstUserId);
            userObject.isRequestedByMe = false;
            if (userObject.isFollowMe) {
                userObject.isRequestMe = false;
            }
            else {
                userObject.isRequestMe = isRequest(user.id, firstUserId);
            }

            response.push(userObject)
        }

        res.status(200).json(response)
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


module.exports = { userRouter }