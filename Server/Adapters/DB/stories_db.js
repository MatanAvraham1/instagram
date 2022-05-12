const { storyModel } = require("./schemes/story_scheme")


class StoriesDB {
    static async insert(story) {
        // Insert story
        const storyObject = new storyModel({
            _id: story.id,

            publisherId: story.publisherId,
            structure: story.structure,

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
            throw new AppError("Story doesn't exist.")
        }

        return storyObjectFromDbObject(story)
    }

    static async deleteById(storyId) {
        // Deletes story by id

        await storyModel.findByIdAndDelete(storyId)
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

        const stories = await storyModel.aggregate([{ $match: { publisherId: publisherId } }, { $project: { publisherId: 1, structure: 1, likes: "$likesCount", viewers: "$viewersCount", createdAt: 1 } }]).skip(startFromIndex).limit(quantity)
        return stories
    }

    static async likeStory(storyId, whoLikeId) {
        /*
        Adds like to the story [storyId] by [whoLikeId]

        param 1: the story id
        param 2: the liker id
        */

        await storyModel.findByIdAndUpdate(storyId, { $addToSet: { likes: whoLikeId } })
    }

    static async unlikePost(storyId, whoLikeId) {
        /*
        Unlikes the story [storyId] by [whoLikeId]

        param 1: the post id
        param 2: the liker id
        */

        await storyModel.findByIdAndUpdate(storyId, { $pull: { likes: whoLikeId } })
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


}


function storyObjectFromDbObject(dbObject) {
    // Returns story object from db story object

    return Object.freeze({
        id: dbObject._id.toString(),

        publisherId: dbObject.publisherId,
        structure: dbObject.structure,

        likes: dbObject.likesCount,
        viewers: dbObject.viewers,

        createdAt: dbObject.createdAt
    })
}

module.exports = { StoriesDB }