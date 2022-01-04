const express = require("express");
const { doesRequesterOwn, doesHasPermission } = require("../../helpers/privacyHelper");
const { authenticateToken } = require("../auth");
const { isStoryValidate, storyModel, getStoriesArchive, getStory, getLast24HoursStories, addStory, storyErrors, deleteStory } = require('../../models/Story');
const { getUserById, userModel, updateUser, userErrors } = require("../../models/User");
const { errorCodes } = require("../../errorCodes");
const storiesRouter = express.Router({ mergeParams: true })


// Gets which of my following has been published a story
// storiesRouter.get('/following', authenticateToken, doesRequesterOwn, (req, res) => {
//     try {
//         const user = await getUserById(req.userId)
//         user.following.forEach(_userId => {
//             var _user = await getUserById(_userId)

//         });
//     }
//     catch (err) {
//         console.log(err)
//         res.sendStatus(500)
//     }
// })


// Gets archive (all the stories from all the time)
storiesRouter.get('/archive', authenticateToken, doesRequesterOwn, async (req, res) => {
    /*
    Returns the stories from all the time even those that have been deleted.
    Will return only if the requester owns the stories
    */

    try {
        var response = []
        const stories = await getStoriesArchive(req.params.userId)

        stories.forEach(story => {
            response.push({
                'publishedAt': story.publishedAt,
                'photoUrl': story.photoUrl,
                'viewers': story.viewers.length
            })
        });

        res.status(200).json({ stories: response })
    }
    catch (err) {
        if (err == userErrors.userNotExistsError) {
            return res.status(400).json({ errorCode: errorCodes.userNotExist })
        }

        console.log(err)
        return res.sendStatus(500)
    }

})

// Gets story
storiesRouter.get('/:storyId', authenticateToken, doesHasPermission, async (req, res) => {
    /*
    Returns story by it's id

    Returns the story onlf if the requester has permission for that
    If the requester is not the owner so the story will be returned only
    if the story has been published in less than 24 hours and if the story
    has been not deleted!
    */
    try {
        const story = getStory(req.params.userId, req.params.postId, req.params.commentId)

        // If the requester doesn't own the story
        if (req.userId != req.params.userId) {
            // Checks if the story has been published in/more than 24 hours
            if (getHoursDifference(story.publishedAt, new Date()) >= 24) {
                return res.sendStatus(403)
            }

            // If the story has been deleted manually
            if (story.deleted) {
                return res.sendStatus(403)
            }

            // Adds the requester to the viewers of the story
            if (!story.viewers.includes(req.userId)) {
                story.viewers.push(req.userId)

                var user = await getUserById(req.params.userId)
                const storyIndex = user.stories.findIndex((story) => story._id == story._id)
                user.stories[storyIndex] = story

                await updateUser(req.params.userId, user)
            }

            return res.status(200).json({
                photoUrl: user.stories[index].photoUrl,
                publishedAt: user.stories[index].publishedAt,
            })
        }

        // If the requester is the owner of the story
        return res.status(200).json({
            photoUrl: story.photoUrl,
            publishedAt: story.publishedAt,
            viewers: story.viewers.length
        })
    }
    catch (err) {
        if (err == userErrors.userNotExistsError) {
            return res.status(400).json({ errorCode: errorCodes.userNotExist })
        }
        if (err == storyError.storyNotExist) {
            return res.status(400).json({ errorCode: errorCodes.storyNotExist })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})


// Returns all the last 24 hours stories
storiesRouter.get('/', authenticateToken, doesHasPermission, async (req, res) => {
    /*
    Returns only if the requester has permission for that 
    Returns all the stories which have been published in the last 24 hours and the stories
    which have not been deleted manually!
    */
    try {

        var response = []
        var stories = await getLast24HoursStories(req.params.userId)

        user.stories.forEach(async (story) => {
            // If the requester owns the story
            if (req.userId == req.params.userId) {
                response.push({
                    "publishedAt": story.publishedAt,
                    "photoUrl": story.photoUrl,
                    "viewers": story.viewers.length
                })
            }
            // If the requester doesn't own the story
            else {
                // Add the requester to the viewers of the story
                if (!story.viewers.includes(req.userId)) {
                    story.viewers.push(req.userId)
                    var user = await getUserById(req.params.userId)
                    const storyIndex = user.stories.findIndex((story) => story._id == story._id)
                    user.stories[storyIndex] = story

                    await updateUser(req.params.userId, user)

                    response.push({
                        "publishedAt": story.publishedAt,
                        "photoUrl": story.photoUrl,
                    })
                }
            }
            index++
        });


        return res.status(200).json({ stories: response })
    }
    catch (err) {
        if (err == userErrors.userNotExistsError) {
            return res.status(400).json({ errorCode: errorCodes.userNotExist })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})

// Adds story
storiesRouter.post('/', authenticateToken, doesRequesterOwn, async (req, res) => {
    /*
    Publishes new story 
    Publishing only if the requester owns this user 
    */
    try {
        await addStory(req.params.userId, {
            photoUrl: req.body.photoUrl,
            publishedAt: new Date()
        })
        return res.sendStatus(200)
    }
    catch (err) {
        if (err == userErrors.userNotExistsError) {
            return res.status(400).json({ errorCode: errorCodes.userNotExist })
        }
        if (err == storyErrors.invalidStory) {
            return res.status(400).json({ errorCode: errorCodes.invalidStory })
        }

        console.log(err)
        return res.sendStatus(500)
    }
})


// Deletes story
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
        await deleteStory(req.params.userId, req.params.storyId)
        return res.sendStatus(200)
    }
    catch (err) {
        if (err == userErrors.userNotExistsError) {
            return res.status(400).json({ errorCode: errorCodes.userNotExist })
        }
        if (err == storyErrors.storyNotExist) {
            return res.status(400).json({ errorCode: errorCodes.storyNotExist })
        }


        console.log(err)
        return res.sendStatus(500)
    }
})

module.exports = { storiesRouter }