const express = require("express");
const { doesRequesterOwn, doesHasPermission } = require("../../helpers/privacyHelper");
const { authenticateToken } = require("../auth");
const { isStoryValidate, storyModel } = require('../../models/Story');
const { getUserById, userModel } = require("../../models/User");
const { errorCodes } = require("../../errorCodes");
const storiesRouter = express.Router({ mergeParams: true })


function getHoursDifference(date1, date2) {
    return Math.abs(date1 - date2) / 36e5;
}

// Gets story
storiesRouter.get('/:storyId', authenticateToken, doesHasPermission, async (req, res) => {
    try {
        const user = await getUserById(req.params.userId)
        const index = user.stories.findIndex((story) => story._id == req.params.storyId);
        // If story doesn't exist
        if (index == -1) {
            return res.status(400).json({ errorCode: errorCodes.storyNotExist })
        }

        // If the requester doesn't own the story
        if (req.userId != req.params.userId) {
            // Checks if the story has been uploaded 1 day ago
            if (getHoursDifference(user.stories[index].publishedAt, new Date()) >= 24) {
                return res.sendStatus(403)
            }

            // Add the requester to the viewers of the story
            if (!user.stories[index].viewers.includes(req.userId)) {
                user.stories[index].viewers.push(req.userId)
                await userModel.updateOne({ _id: req.params.userId }, user)

            }
            return res.status(200).json({
                photoUrl: user.stories[index].photoUrl,
                publishedAt: user.stories[index].publishedAt,
            })
        }

        return res.status(200).json({
            photoUrl: user.stories[index].photoUrl,
            publishedAt: user.stories[index].publishedAt,
            viewers: user.stories[index].viewers.length
        })
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
})


// Returns all the last 24 hours stories
storiesRouter.get('/', authenticateToken, doesHasPermission, async (req, res) => {
    try {
        var stories = []
        var index = 0;

        const user = await getUserById(req.params.userId)
        user.stories.forEach(async (story) => {

            // If the requester owns the story
            if (req.userId == req.params.userId) {
                // Checks if the story has been uploaded in less than 24 hours
                if (getHoursDifference(story.publishedAt, new Date()) > 24) {
                    stories.push({
                        "publishedAt": story.publishedAt,
                        "photoUrl": story.photoUrl,
                        "viewers": story.viewers.length
                    })
                }
            }
            else {
                // Checks if the story has been uploaded in less than 24 hours
                if (getHoursDifference(story.publishedAt, new Date()) > 24) {
                    // Add the requester to the viewers of the story
                    if (!user.stories[index].viewers.includes(req.userId)) {
                        user.stories[index].viewers.push(req.userId)
                        await userModel.updateOne({ _id: req.params.userId }, user)
                        stories.push({
                            "publishedAt": story.publishedAt,
                            "photoUrl": story.photoUrl,
                        })
                    }
                }
            }
            index++
        });


        return res.status(200).json({ stories: stories })
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
})

// Adds story
storiesRouter.post('/', authenticateToken, doesRequesterOwn, async (req, res) => {
    try {

        const user = await getUserById(req.userId);

        req.body.publishedAt = new Date()
        if (isStoryValidate(req.body)) {
            const story = new storyModel({ photoUrl: req.body.photoUrl, publishedAt: req.body.publishedAt })
            user.stories.push(story)
            await user.save()
            res.sendStatus(200)
        }
        else {
            return res.status(400).json({ errorCode: errorCodes.invalidStory })
        }
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
})


// Deletes story
storiesRouter.delete('/:storyId', authenticateToken, doesRequesterOwn, async (req, res) => {
    try {
        const user = await getUserById(req.userId)
        const index = user.stories.findIndex((story) => story._id == req.params.storyId)
        // If the story doesn't exist
        if (index == -1) {
            return res.status(400).json({ errorCode: errorCodes.storyNotExist })
        }

        // Deletes the story
        user.stories.splice(index, 1)
        await user.save()
        res.sendStatus(200)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
})

module.exports = { storiesRouter }