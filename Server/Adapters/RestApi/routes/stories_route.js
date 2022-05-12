const express = require('express')
const { AuthenticationService } = require('../../../CustomHelpers/Authantication')
const { getStoryById, addStory, deleteStoryById, getStoriesByPublisherId, viewStory } = require('../../../Use_cases/story')
const { authenticateToken, doesOwnStoryObject } = require('../middleware')
const storiesRouter = express.Router()

// Add story
storiesRouter.post('/', authenticateToken, (req, res) => {
    const userId = req.userId

    addStory({ publisherId: userId, structure: req.body.structure })
        .then((storyId) => {
            res.status(201).json({ storyId: storyId })
        }).catch((error) => {
            if (error instanceof AppError) {
                return res.status(400).json(error.message)
            }

            res.sendStatus(500)
            console.error(error)
        })
})


// Gets story
storiesRouter.get('/:storyId', authenticateToken, (req, res) => {
    const storyId = req.params.storyId

    getStoryById({ storyId }).then(async (story) => {

        const firstUserId = req.userId
        const secondUserId = story.publisherId
        const doesHasPermission = await AuthenticationService.hasPermission(firstUserId, secondUserId)
        if (!doesHasPermission) {
            return res.sendStatus(403)
        }

        const returnedObject = {
            id: story.id,
            publisherId: story.publisherId,
            structure: story.structure
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


// Deletes story
storiesRouter.delete('/:storyId', authenticateToken, doesOwnStoryObject, (req, res) => {
    const storyId = req.params.storyId

    deleteStoryById(storyId).then(() => {
        res.sendStatus(200)
    }).catch((error) => {
        if (error instanceof AppError) {
            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})

// Gets stories by publisher
storiesRouter.get('/', authenticateToken, (req, res) => {
    const publisherId = req.query.publisherId
    const startIndex = parseInt(req.query.startIndex)

    if (!Number.isInteger(startIndex)) {
        return res.status(400).json("Invalid start index.")
    }

    getStoriesByPublisherId(publisherId, startIndex).then(async (stories) => {

        const firstUserId = req.userId
        const secondUserId = publisherId
        const doesHasPermission = await AuthenticationService.hasPermission(firstUserId, secondUserId)
        if (!doesHasPermission) {
            return res.sendStatus(403)
        }

        const returnedList = []
        for (const story of stories) {

            const objectToReturn = {
                id: story.id,
                publisherId: story.publisherId,
                structure: story.structure,
                createdAt: story.createdAt
            }


            // If same person
            if (firstUserId == publisherId) {
                objectToReturn.viewers = stories.viewers
                objectToReturn.likes = stories.likes
            }

            returnedList.push(objectToReturn)
        }


        res.sendStatus(200).json(returnedList)
    }).catch((error) => {
        if (error instanceof AppError) {
            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})


// View story
storiesRouter.post('/:storyId/view', authenticateToken, async (req, res) => {


    const storyId = req.params.storyId
    const viewerId = req.userId


    const firstUserId = viewerId
    const secondUserId = (await getStoryById(storyId)).publisherId
    const doesHasPermission = await AuthenticationService.hasPermission(firstUserId, secondUserId)
    if (!doesHasPermission) {
        return res.sendStatus(403)
    }

    viewStory(storyId, viewerId).then(() => {

        res.sendStatus(200).json(returnedList)

    }).catch((error) => {
        if (error instanceof AppError) {
            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})

module.exports = { storiesRouter }