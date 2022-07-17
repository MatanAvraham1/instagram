const express = require('express')
const { AppErrorMessages, AppError } = require('../../../app_error')
const { declineFollowRequest, acceptFollowRequest, followUser, unfollowUser } = require('../../../Use_cases/user')
const { authenticateToken } = require('../middleware')
const friendShipsRouter = express.Router()

// follow user
friendShipsRouter.post('/follow', authenticateToken, (req, res) => {
    const firstUserId = req.userId
    const secondUserId = req.query.userToFollow

    followUser({ firstUserId, secondUserId }).then(() => {
        res.sendStatus(200)
    }).catch((error) => {
        if (error instanceof AppError) {

            if (error == AppErrorMessages.userDoesNotExist) {
                return res.sendStatus(404);
            }

            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})

// unfollow user
friendShipsRouter.post('/unfollow', authenticateToken, (req, res) => {
    const firstUserId = req.userId
    const secondUserId = req.query.userToUnfollow

    unfollowUser({ firstUserId, secondUserId }).then(() => {
        res.sendStatus(200)
    }).catch((error) => {
        if (error instanceof AppError) {

            if (error == AppErrorMessages.userDoesNotExist) {
                return res.sendStatus(404);
            }

            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})

// accept follow request
friendShipsRouter.post('/acceptRequest', authenticateToken, (req, res) => {
    const firstUserId = req.query.userToAccept
    const secondUserId = req.userId

    acceptFollowRequest({ firstUserId, secondUserId }).then(() => {
        res.sendStatus(200)
    }).catch((error) => {
        if (error instanceof AppError) {

            if (error == AppErrorMessages.userDoesNotExist) {
                return res.sendStatus(404);
            }

            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})

// decline follow request
friendShipsRouter.post('/declineRequest', authenticateToken, (req, res) => {
    const firstUserId = req.query.userToDecline
    const secondUserId = req.userId


    declineFollowRequest({ firstUserId, secondUserId }).then(() => {
        res.sendStatus(200)
    }).catch((error) => {
        if (error instanceof AppError) {

            if (error == AppErrorMessages.userDoesNotExist) {
                return res.sendStatus(404);
            }

            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})

// delete following request
friendShipsRouter.post('/deleteRequest', authenticateToken, (req, res) => {
    const firstUserId = req.userId
    const secondUserId = req.query.requestToDelete

    declineFollowRequest({ firstUserId, secondUserId }).then(() => {
        res.sendStatus(200)
    }).catch((error) => {
        if (error instanceof AppError) {

            if (error == AppErrorMessages.userDoesNotExist) {
                return res.sendStatus(404);
            }

            return res.status(400).json(error.message)
        }



        res.sendStatus(500)
        console.error(error)
    })
})

// remove user from my followers
friendShipsRouter.post('/removeFollower', authenticateToken, (req, res) => {
    const firstUserId = req.query.userToRemove
    const secondUserId = req.userId

    unfollowUser({ firstUserId, secondUserId }).then(() => {
        res.sendStatus(200)
    }).catch((error) => {
        if (error instanceof AppError) {
            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})


// Which of my followers published story
// friendShipsRouter.get('/followersWithStories', (req, res) => {




// })

module.exports = { friendShipsRouter }