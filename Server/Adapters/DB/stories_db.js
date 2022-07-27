const { default: mongoose } = require("mongoose")
const { AppErrorMessages, AppError } = require("../../app_error")
const { storyModel } = require("./schemes/story_scheme")


class StoriesDB {
    static async insert(story) {
        // Insert story
        const storyObject = new storyModel({
            _id: story.id,

            publisherId: story.publisherId,
            widgets: story.widgets,
            photo: story.photo,

            likes: [],
            viewers: [],

            likesCount: 0,
            viewers: 0,

            createdAt: story.createdAt
        })
        await storyObject.save()
    }

    static async findById(storyId) {
        // returns story by id

        const story = await storyModel.findById(storyId, { likes: 0, viewers: 0 })

        if (story == null) {
            throw new AppError(AppErrorMessages.storyDoesNotExist)
        }

        return storyObjectFromDbObject(story)
    }

    static async deleteById(storyId) {
        // Deletes story by id

        await storyModel.findByIdAndDelete(storyId)
    }

    static async deleteByPublisherId(userId) {
        // Deletes all stories of [userId]

        await storyModel.deleteMany({ publisherId: mongoose.Types.ObjectId(userId) })
    }

    static async doesStoryExist(storyId) {
        // returns if story exists

        const story = await storyModel.findById(storyId, { likes: 0, viewers: 0 })
        return story == null
    }

    static async findByPublisher(publisherId, startFromIndex, quantity) {
        /*
        Returns stories by publisher 

        param 1: publisher id
        param 2: from which story to start
        param 3: how much to return
        */

        const stories = []

        const storiesObjects = await storyModel.aggregate([{ $match: { publisherId: publisherId } }, { $project: { likes: 0, viewers: 0 } }]).skip(startFromIndex).limit(quantity)
        for (const story of storiesObjects) {
            stories.push(storyObjectFromDbObject(story))
        }

        return stories
    }

    static async getLastDayStoriesCount(publisherId) {
        /*
        Returns how much stories the user has published in the last day
        */

        const lastDayStoriesCount = await storyModel.count({ publisherId: publisherId, "createdAt": { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } })
        return lastDayStoriesCount;
    }

    static async getLastDayStories(publisherId, startFromIndex, quantity) {
        /*
        Returns last day stories of publisher

        param 1: publisher id
        param 2: from which story to start
        param 3: how much to return
        */

        const lastDayStories = [];
        const lastDayStoriesObjects = await storyModel.aggregate([{ $match: { publisherId: publisherId, "createdAt": { $gt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } }, { $project: { likes: 0, viewers: 0 } }]).skip(startFromIndex).limit(quantity)

        for (const story of lastDayStoriesObjects) {
            lastDayStories.push(storyObjectFromDbObject(story))
        }

        return lastDayStories
    }

    static async likeStory(storyId, whoLikeId) {
        /*
        Adds like to the story [storyId] by [whoLikeId]

        param 1: the story id
        param 2: the liker id
        */

        await storyModel.findByIdAndUpdate(storyId, { $addToSet: { likes: whoLikeId } })
    }

    static async unlikeStory(storyId, whoLikeId) {
        /*
        Unlikes the story [storyId] by [whoLikeId]

        param 1: the post id
        param 2: the liker id
        */

        await storyModel.findByIdAndUpdate(storyId, { $pull: { likes: whoLikeId } })
    }

    static async isLiked(storyId, whoLikeId) {
        /*  
        Checks if story liked by someone

        param 1: the story id
        param 2: the liker id
        */

        const story = await storyModel.findOne({ _id: mongoose.Types.ObjectId(storyId), likes: { $in: [whoLikeId] } }, { likes: 0, viewers: 0 })
        return story != null
    }


    static async viewStory(storyId, viewerId) {
        /*
        Adds to the viewers of story 

        param 1: the story id
        param 2: the viewer id
        */

        await storyModel.findByIdAndUpdate(storyId, { $addToSet: { viewers: viewerId } })
    }

    static async unviewStory(storyId, viewerId) {
        /*
        Removes from the viewers of story 

        param 1: the story id
        param 2: the viewer id
        */

        await storyModel.findByIdAndUpdate(storyId, { $pull: { viewers: viewerId } })
    }


    // static async whichOfMyFollowingsHavePublishedStory() {
    //     /*
    //     Returns which users published stories

    //     */
    // }

}


function storyObjectFromDbObject(dbObject) {
    // Returns story object from db story object

    return Object.freeze({
        id: dbObject._id.toString(),

        publisherId: dbObject.publisherId,
        widgets: dbObject.widgets,
        photo: dbObject.photo,

        likes: dbObject.likesCount,
        viewers: dbObject.viewers,

        createdAt: dbObject.createdAt
    })
}

module.exports = { StoriesDB }