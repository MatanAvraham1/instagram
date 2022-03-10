const express = require("express");
const storiesRouter = express.Router({ mergeParams: true })

const { doesRequesterOwn, doesHasPermission } = require("../../helpers/privacyHelper");
const { authenticateToken } = require("../user/auth_route");
const { getStoriesArchive, getStory, getLast24HoursStories, addStory, storyErrors, deleteStory, whichOfMyFollowingsPublishedStories, getHoursDifference, addViewer } = require('../../models/story_model');
const { userErrors } = require("../../models/user_model");
const { errorCodes } = require("../../errorCodes");


storiesRouter.get('/following', authenticateToken, doesRequesterOwn, async (req, res) => {
    /*
    Returns the users which req.params.userId follows and published at least 1 story

    req.query.startFrom tells the function from which index of the users list start returning
    If req.query.startFrom isn't an integer or ungiven, 400 will be returned
    */

    try {
        const startFromUserIndex = req.query.startFrom
        if (startFromUserIndex === undefined || !Number.isInteger(startFromUserIndex)) {
            return res.sendStatus(400)
        }

        const response = []
        const users = await whichOfMyFollowingsPublishedStories(req.params.userId, startFromUserIndex, 15)

        for (const user of users) {
            response.push({
                user: user,
                isFollowMe: await isFollow(user._id.toString(), req.userId),
                isRequestMe: await isRequested(user._id.toString(), req.userId)
            })
        }

        return res.status(200).json(response)
    }
    catch (err) {
        console.error(err)
        return res.sendStatus(500)
    }
})


storiesRouter.get('/archive', authenticateToken, doesRequesterOwn, async (req, res) => {
    /*
    Returns the stories of req.params.userId from all the time, even those that have been deleted.
    Will return only if the requester owns the stories

    req.query.startFrom tells the function from which index of the stories list start returning
    If req.query.startFrom isn't an integer or ungiven, 400 will be returned
    */

    try {
        const startFromStoryIndex = req.query.startFrom
        if (startFromStoryIndex === undefined || !Number.isInteger(startFromStoryIndex)) {
            return res.sendStatus(400)
        }

        const stories = await getStoriesArchive(req.params.userId, startFromStoryIndex, 15)
        res.status(200).json(stories)
    }
    catch (err) {
        console.error(err)
        return res.sendStatus(500)
    }

})


storiesRouter.get('/:storyId', authenticateToken, doesHasPermission, async (req, res) => {
    /*
    Returns story by it's id

    Returns the story onlf if the requester has permission for that
    If the requester is not the owner so the story will be returned only
    if the story has been published in less than 24 hours and if the story
    has been not deleted!
    */
    try {
        const story = await getStory(req.params.storyId)

        // If the requester doesn't own the story
        if (req.userId !== req.params.userId) {

            // If the story has been deleted manually
            if (story.deleted) {
                return res.sendStatus(403) // TODO : to check if i have to return 403 or 404
            }

            // Checks if the story has been published in/more than 24 hours
            if (getHoursDifference(story.publishedAt, new Date()) >= 24) {
                return res.sendStatus(403)
            }

            // Adds the requester to the viewers of the story
            await addViewer(req.params.storyId, req.userId)

            delete story.viewers
        }

        // If the requester is the owner of the story
        return res.status(200).json(story)
    }
    catch (err) {

        if (err === storyErrors.storyNotExist) {
            return res.sendStatus(404)
        }

        console.log(err)
        return res.sendStatus(500)
    }
})


storiesRouter.get('/', authenticateToken, doesHasPermission, async (req, res) => {
    /*
    Returns all the stories which have been published in the last 24 hours and have not been deleted manually!
    Returns only if the requester has permission for that!

    req.query.startFrom tells the function from which index of the stories list start returning
    If req.query.startFrom isn't an integer or ungiven, 400 will be returned
    */

    try {
        const startFromStoryIndex = req.query.startFrom
        if (startFromStoryIndex === undefined || !Number.isInteger(startFromStoryIndex)) {
            return res.sendStatus(400)
        }

        const response = []
        const stories = await getLast24HoursStories(req.params.userId, false, startFromStoryIndex, 15)

        for (const story of stories) {
            // If the requester doesn't own the story
            if (req.userId !== req.params.userId) {
                delete story.viewers

                // Add the requester to the viewers of the story
                await addViewer(story._id.toString(), req.userId)
            }

            response.push(story)
        }

        return res.status(200).json(response)
    }
    catch (err) {
        console.log(err)
        return res.sendStatus(500)
    }
})


storiesRouter.post('/', authenticateToken, doesRequesterOwn, async (req, res) => {
    /*
    Publishes new story 
    Publishing only if the requester owns this user 
    */
    try {
        const storyId = await addStory({
            owner: req.params.userId,
            photoUrl: req.body.photoUrl,
        })
        return res.status(201).json({ storyId: storyId })
    }
    catch (err) {
        if (err === userErrors.userNotExistsError) {
            return res.sendStatus(404)
        }
        if (err === storyErrors.invalidStory) {
            return res.status(400).json({ errorCode: errorCodes.invalidStory })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})

storiesRouter.delete('/:storyId', authenticateToken, doesRequesterOwn, async (req, res) => {
    /*
    Deletes story
    Deleting only if the requester owns the story
    
    Note:
    When deleteing the story, the story object is not deleted we only changed his "deleted" property
    to true - this will lock the permission for this story.
    So if the "deleted" propery is true only if the requester owns the story and will request this specific
    story by the "Get one story" request it will return that
    but in others function (like the - "Get all the last 24 hours stories" request) this story will be like not exist!
    
    */
    try {
        await deleteStory(req.params.storyId)
        return res.sendStatus(204)
    }
    catch (err) {
        if (err === storyErrors.storyNotExist) {
            return res.sendStatus(404)
        }


        console.log(err)
        return res.sendStatus(500)
    }
})

module.exports = { storiesRouter }