const express = require('express')
const { AppErrorMessages } = require('../../../app_error')
const { AuthenticationService } = require('../../../CustomHelpers/Authantication')
const { getStoryById, addStory, deleteStoryById, getLastDayStoriesByPublisherId, viewStory, isStoryLiked, getStoriesArchiveByPublisherId, likeStory, unlikeStory } = require('../../../Use_cases/story')
const { authenticateToken, doesOwnStoryObject, doesOwnUserObject } = require('../middleware')
const storiesRouter = express.Router()

// Add story
storiesRouter.post('/', authenticateToken, (req, res) => {
    const userId = req.userId

    addStory({ publisherId: userId, structure: req.body.structure })
        .then((storyId) => {
            res.status(201).json({ storyId: storyId })
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


// Gets story
storiesRouter.get('/:storyId', authenticateToken, async (req, res) => {
    const storyId = req.params.storyId


    const firstUserId = req.userId
    const secondUserId = story.publisherId
    const doesHasPermission = await AuthenticationService.hasPermission(firstUserId, secondUserId)
    if (!doesHasPermission) {
        return res.sendStatus(403)
    }

    getStoryById({ storyId }).then(async (story) => {
        const returnedObject = {
            id: story.id,
            publisherId: story.publisherId,
            structure: story.structure
        };


        // If same person
        if (firstUserId == secondUserId) {
            objectToReturn.viewers = stories.viewers
            objectToReturn.likes = stories.likes
            objectToReturn.isLikedByMe = false
        }
        else {
            // Checks if 24 hours is past
            const msBetweenDates = Math.abs(story.getTime() - now.getTime());
            // 👇️ convert ms to hours                  min  sec   ms
            const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);

            if (hoursBetweenDates > 24) {
                return res.sendStatus(403)
            }

            viewStory({ storyId, viewerId: firstUserId }).then(() => {
            }).catch((error) => {
                console.error(error)
            })

            objectToReturn.isLikedByMe = await isStoryLiked(storyId, req.userId)
        }

        res.status(200).json(returnedObject)

    }).catch((error) => {
        if (error instanceof AppError) {

            if (error.message == AppErrorMessages.storyDoesNotExist) {
                return res.sendStatus(404)
            }

            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})


// Deletes story
storiesRouter.delete('/:storyId', authenticateToken, doesOwnStoryObject, (req, res) => {
    const storyId = req.params.storyId

    deleteStoryById({ storyId: storyId }).then(() => {
        res.sendStatus(200)
    }).catch((error) => {
        if (error instanceof AppError) {

            if (error.message == AppErrorMessages.storyDoesNotExist) {
                return res.sendStatus(404)
            }

            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})

// Gets stories archive
storiesRouter.get('/archive', authenticateToken, (req, res) => {
    const startIndex = parseInt(req.query.startIndex)

    if (!Number.isInteger(startIndex)) {
        return res.status(400).json("Invalid start index.")
    }

    getStoriesArchiveByPublisherId({ publisherId: req.userId, startFromIndex: startIndex }).then(async (stories) => {

        const returnedList = []
        for (const story of stories) {

            const objectToReturn = {
                id: story.id,
                publisherId: story.publisherId,
                structure: story.structure,
                createdAt: story.createdAt,
                viewers: stories.viewers,
                likes: stories.likes
            }

            objectToReturn.isLikedByMe = false

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


// Gets last day stories
storiesRouter.get('/', authenticateToken, async (req, res) => {
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

    getLastDayStoriesByPublisherId({ publisherId: publisherId, startFromIndex: startIndex }).then(async (stories) => {
        const returnedList = []
        for (const story of stories) {

            const objectToReturn = {
                id: story.id,
                publisherId: story.publisherId,
                structure: story.structure,
                createdAt: story.createdAt
            }


            // If same person
            if (firstUserId == secondUserId) {
                objectToReturn.viewers = stories.viewers
                objectToReturn.likes = stories.likes
            }
            else {
                // Checks if 24 hours is past
                const msBetweenDates = Math.abs(story.getTime() - now.getTime());
                // 👇️ convert ms to hours                  min  sec   ms
                const hoursBetweenDates = msBetweenDates / (60 * 60 * 1000);

                if (hoursBetweenDates > 24) {
                    continue;
                }

                viewStory({ storyId: story.id, viewerId: firstUserId }).then(() => {
                }).catch((error) => {
                    console.error(error)
                })

                objectToReturn.isLikedByMe = await isStoryLiked(story.id, req.userId)
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


// Like story
storiesRouter.post('/:storyId/like', authenticateToken, (req, res) => {

    const storyId = req.params.storyId

    likeStory({ storyId: storyId, likerId: req.userId }).then(async () => {
        res.sendStatus(200)
    }).catch((error) => {
        if (error instanceof AppError) {

            if (error.message == AppErrorMessages.userDoesNotExist || error.message == AppErrorMessages.storyDoesNotExist) {
                return res.sendStatus(404).json(error.message)
            }

            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})


// Unlike story
storiesRouter.post('/:storyId/unlike', authenticateToken, (req, res) => {

    const storyId = req.params.storyId

    unlikeStory({ storyId: storyId, likerId: req.userId }).then(async () => {
        res.sendStatus(200)
    }).catch((error) => {
        if (error instanceof AppError) {

            if (error.message == AppErrorMessages.userDoesNotExist || error.message == AppErrorMessages.storyDoesNotExist) {
                return res.sendStatus(404).json(error.message)
            }

            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})



module.exports = { storiesRouter }