const { default: mongoose } = require("mongoose")
const { AppError, AppErrorMessages } = require("../../app_error")
const { CommentsDB } = require("./comments_db")
const { postModel } = require("./schemes/post_scheme")


class PostsDB {
    static async insert(post) {
        // Insert post
        const postObject = new postModel({
            _id: post.id,

            publisherId: post.publisherId,
            taggedUsers: post.taggedUsers,
            photos: post.photos,
            publisherComment: post.publisherComment,
            location: post.location,

            likes: [],

            likesCount: 0,
            commentsoCount: 0,

            createdAt: post.createdAt
        })
        await postObject.save()
    }

    static async findById(postId) {
        // returns post by id

        const post = await postModel.findById(postId, { likes: 0 })

        if (post == null) {
            throw new AppError(AppErrorMessages.postDoesNotExist)
        }

        return postObjectFromDbObject(post)
    }

    static async deleteById(postId) {
        // Deletes post by id

        await postModel.findByIdAndDelete(postId)
    }

    static async doesPostExist(postId) {
        // returns if post exists

        const post = await postModel.findById(postId, { likes: 0 })
        return post != null
    }

    static async deleteByPublisherId(userId) {
        // Deletes all posts of [userId]

        // TODO: check if the await wait for the function to end (because there is a callback)
        await postModel.count({ publisherId: mongoose.Types.ObjectId(userId) }, async function (err, count) {

            for (let index = 0; index < count; index++) {
                let post = await postModel.findOneAndDelete({})
                await CommentsDB.deleteByPostId(post._id.toString())
            }
        })
    }


    static async findByPublisher(publisherId, startFromIndex, quantity) {
        /*
        Returns posts by publisher 

        param 1: publisher id
        param 2: from which post to start
        param 3: how much to return
        */

        const response = [];
        const posts = await postModel.aggregate([{ $match: { publisherId: publisherId } }, { $project: { likes: 0, } }]).skip(startFromIndex).limit(quantity)
        for (const post of posts) {
            response.push(postObjectFromDbObject(post))
        }

        return response
    }

    static async isLiked(postId, whoLikeId) {
        /*  
        Checks if post liked by someone

        param 1: the post id
        param 2: the liker id
        */

        const post = await postModel.findOne({ _id: mongoose.Types.ObjectId(postId), likes: { $in: [whoLikeId] } }, { comments: 0, likes: 0 })
        return post != null
    }

    static async likePost(postId, whoLikeId) {
        /*
        Adds like to the post [postId] by [whoLikeId]

        param 1: the post id
        param 2: the liker id
        */

        await postModel.findByIdAndUpdate(postId, { $addToSet: { likes: whoLikeId } })
    }

    static async unlikePost(postId, whoLikeId) {
        /*
        Unlikes the post [postId] by [whoLikeId]

        param 1: the post id
        param 2: the liker id
        */

        await postModel.findByIdAndUpdate(postId, { $pull: { likes: whoLikeId } })
    }

}


function postObjectFromDbObject(dbObject) {
    // Returns post object from db post object

    return Object.freeze({
        id: dbObject._id.toString(),

        publisherId: dbObject.publisherId,
        taggedUsers: dbObject.taggedUsers,
        photos: dbObject.photos,
        publisherComment: dbObject.publisherComment,
        location: dbObject.location,

        comments: dbObject.commentsCount,
        likes: dbObject.likesCount,

        createdAt: dbObject.createdAt
    })
}

module.exports = { PostsDB }