const { bool, boolean } = require("joi")
const Joi = require("joi")
const mongoose = require("mongoose")
const { getFeedPosts } = require("./post_model")
const { getUserById, updateUser, userErrors, userModel, getFollowings, doesUserExists } = require("./user_model")

const storyErrors = {
    storyNotExist: "story doesn't exist!",
    invalidStory: "invalid story!",
    viewerNotExists: "Can't add viewer becuase the viewer doesn't exists!"
}

const storyModel = mongoose.model("Story", mongoose.Schema({
    owner: {
        type: String,
        required: true,
    },
    photoUrl: {
        type: String,
        required: true
    },
    publishedAt: {
        type: Date,
        default: Date.now,
    },
    viewers: {
        type: Array,
        default: []
    },
    deleted: { // If story has been deleted manually deleted
        type: Boolean,
        default: false,
    },

    viewersLength: {
        type: Number,
        default: 0,
    }
}))

function isStoryValidate(data) {
    const scheme = Joi.object({
        owner: Joi.string().required(),
        photoUrl: Joi.string().uri().required(),
        publishedAt: Joi.date().default(Date.now),
        viewers: Joi.array().default([]),
        deleted: Joi.boolean().default(false), // TODO : fix that
        viewersLength: Joi.number().default(0),
    })

    const value = scheme.validate(data)

    if (value.error === undefined) {
        return true
    }

    return false
}

async function doesStoryExists(storyId) {
    /*
    Returns if story exists true/false
    */

    if (await userModel.findById(storyId, { "_id": 1 }) === null) {
        return false
    }
    else {
        return true
    }

}


async function addStory(story) {
    /*
    Adds new story

    param 1: the story object

    return: created story id
    */

    try {
        if (isStoryValidate(story)) {
            if (!await doesUserExists(story.owner)) {
                throw userErrors.userNotExistsError
            }

            const storyObject = storyModel(story)
            await storyObject.save()
            await userModel.findByIdAndUpdate(story.owner, { $inc: { storiesLength: 1 } })

            return storyObject._id
        }
        else {
            throw storyErrors.invalidStory
        }
    }
    catch (err) {
        throw err
    }

}

async function deleteStory(storyId) {
    /*
    Deletes the story - [storyId] 

    param 1: the id of the story
    */

    try {

        if (!await doesStoryExists(storyId)) {
            throw storyErrors.storyNotExist
        }

        await storyModel.findByIdAndDelete(storyId)
        await userModel.findByIdAndUpdate(story.owner, { $inc: { storiesLength: -1 } })
    }
    catch (err) {
        throw err
    }

}

async function getStory(storyId) {
    /*
    Returns story by id

    param 1: the id of the story
    */

    try {
        const projectQuery = { viewers: "$viewersLength", owner: 1, photoUrl: 1, publishedAt: 1, deleted: 1 }
        const story = await storyModel.aggregate([{ $match: { _id: mongoose.Types.ObjectId(storyId) } }, { $project: projectQuery }]).limit(1)

        if (story.length === 0) {
            throw storyErrors.storyNotExist
        }

        return story
    }
    catch (err) {
        throw err
    }

}

async function addViewer(storyId, viewerId) {
    /*
    Adds viewer to story viewers

    param 1: the story id
    param 2: the id of the viewer
    */

    if (!await doesStoryExists(storyId)) {
        throw storyErrors.storyNotExist
    }

    if (!await doesUserExists(viewerId)) {
        throw storyErrors.viewerNotExists
    }

    await storyModel.findByIdAndUpdate(storyId, { $addToSet: { viewers: viewerId }, $inc: { viewersLength: 1 } })
}

async function getViewers(storyId, startViewerIndex, quantity) {
    /*
   Returns viewers of story 

   param 1: the id of the story
   param 2: from which viewer to start
   param 3: how much viewers to return
   */

    try {
        const viewers = []

        const endViewerIndex = startViewerIndex + quantity
        const viewersId = (await storyModel.findById(storyId, { _id: 0, viewers: { $slice: [startViewerIndex, endViewerIndex] } })).viewers

        for (const id of viewersId) {
            viewers.push(await getUserById(id, false, true))
        }
        return viewers
    }
    catch (err) {
        if (err == "TypeError: Cannot read property 'viewers' of null") {
            throw storyErrors.storyNotExist
        }

        throw err
    }
}


async function getStoriesArchive(userId, startStoryIndex, quantity) {
    /*
    Returns all the stories of [userId] even those who have been manually deleted

    param 1: the user id
    param 2: from which story to start
    param 3: how much stories to return
    */

    try {
        const projectQuery = { viewers: "$viewersLength", owner: 1, photoUrl: 1, publishedAt: 1, deleted: 1 }
        const stories = await storyModel.aggregate([{ $match: { owner: userId } }, { $project: projectQuery }]).skip(startStoryIndex).limit(quantity)

        return stories
    }
    catch (err) {
        throw err
    }

}

async function getLast24HoursStories(userId, deleted, startStoryIndex, quantity) {
    /*
    Returns the stories of [userId] that has been published in the last 24 hours
    
    and have not been deleted (see param 2).

    param 1: the user id
    param 2: return deleted stories?
    param 3: from which story to start
    param 4: how much stories to return
    */

    try {
        const projectQuery = { viewers: "$viewersLength", owner: 1, photoUrl: 1, publishedAt: 1, deleted: 1 }
        const stories = await storyModel.aggregate([{ $match: { owner: userId, deleted: deleted, publishedAt: { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }, { $project: projectQuery }]).skip(startStoryIndex).limit(quantity)

        return stories
    }
    catch (err) {
        throw err
    }

}

async function whichOfMyFollowingsPublishedStories(userId, startUserIndex, quantity) {
    /*
    Returns the [userId]'s followings which have published a story

    param 1: the user id
    param 2: from which following to start
    param 3: how much followings to return
    */

    try {


        // storyModel.w
        let response = []

        for (const following of await getFollowings(userId, startUserIndex, quantity, false, true)) {
            if ((await getLast24HoursStories(following._id, false, 0, 1)).length > 0) {
                response.push(following)
            }

            return response
        }
    }
    catch (err) {


        throw err
    }

}

function getHoursDifference(date1, date2) {
    return Math.abs(date1 - date2) / 36e5;
}



module.exports = { getViewers, storyModel, addViewer, getHoursDifference, addStory, getStory, whichOfMyFollowingsPublishedStories, storyErrors, deleteStory, isStoryValidate, getStoriesArchive, getLast24HoursStories }