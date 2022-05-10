const express = require('express')
const { getStoryById, addStory, deleteStoryById } = require('../../../Use_cases/story')
const { authenticateToken, doesOwnPostObject } = require('../middleware')
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

    getStoryById({ storyId }).then((story) => {

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
storiesRouter.delete('/:storyId', authenticateToken, doesOwnPostObject, (req, res) => {
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
