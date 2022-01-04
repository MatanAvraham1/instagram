const { bool, boolean } = require("joi")
const Joi = require("joi")
const mongoose = require("mongoose")
const { getUserById, updateUser } = require("./User")

const storyErrors = {
    storyNotExist: "story doesn't exist!",
    invalidStory: "invalid story!"
}

const storyModel = mongoose.model("Story", mongoose.Schema({
    photoUrl: {
        type: String,
        required: true
    },
    publishedAt: {
        type: Date,
        required: true
    },
    viewers: {
        type: Array,
        defualt: []
    },
    deleted: { // If story has been deleted manually
        type: Boolean,
        defualt: false
    }
}))

function isStoryValidate(data) {
    const scheme = Joi.object({
        photoUrl: Joi.string().required(),
        publishedAt: Joi.date().required(),
        viewers: Joi.array().default([]),
        deleted: Joi.boolean().default(false)
    })

    const value = scheme.validate(data)

    if (value.error == null) {
        return true
    }

    return false
}

function getHoursDifference(date1, date2) {
    return Math.abs(date1 - date2) / 36e5;
}


async function addStory(userId, story) {
    /*
    Adds new story to the user - [userId]

    param 1: the id of the user
    param 2: the story object
    */

    var user = await getUserById(userId)

    if (isStoryValidate(story)) {
        const storyObject = storyModel(story)
        user.stories.push(storyObject)
        await updateUser(userId, user)
    }
    else {
        throw storyErrors.invalidStory
    }
}

async function deleteStory(userId, storyId) {
    /*
    Deletes the story - [storyId]  to the user - [userId]

    param 1: the id of the user
    param 2: the id of the story
    */

    var user = await getUserById(userId)

    const storyIndex = user.stories.findIndex((story) => story._id == storyId)
    if (storyIndex == -1) {
        throw storyErrors.storyNotExist
    }
    user.stories[storyIndex].deleted = true
    await updateUser(userId, user)
}

async function getStory(userId, storyId) {
    /*
    Returns the story [stoyId] of the user [userId]

    param 1: the id of the user
    param 2: the id of the story
    */

    const user = await getUserById(userId)
    const story = user.stories.find((story) => story._id == storyId)
    if (story == null) {
        throw storyErrors.storyNotExist
    }

    return story
}

async function getStoriesArchive(userId) {
    /*
    Returns all the stories of [userId] even those who have been manually deleted

    param 1: the user id
    */

    var user = await getUserById(userId)
    return user.stories
}

async function getLast24HoursStories(userId) {
    /*
    Returns the stories of [userId] that has been published in the last 24 hours
    and have not been deleted.

    param 1: the user id
    */

    var stories = []
    var allStories = await getStoriesArchive(userId)

    allStories.forEach(story => {
        if (getHoursDifference(story.publishedAt, new Date()) < 24 && !story.deleted) {
            stories.push(story)
        }
    });

    return stories
}



module.exports = { storyModel, addStory, getStory, storyErrors, deleteStory, isStoryValidate, getStoriesArchive, getLast24HoursStories }