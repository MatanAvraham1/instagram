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
            throw new AppError("Post doesn't exist.")
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
        return post == null
    }

    static async findByPublisher(publisherId, startFromIndex, quantity) {
        /*
        Returns posts by publisher 

        param 1: publisher id
        param 2: from which post to start
        param 3: how much to return
        */

        const posts = await postModel.aggregate([{ $match: { publisherId: publisherId } }, { $project: { publisherId: 1, publisherComment: 1, location: 1, photos: 1, comments: "$commentsCount", likes: "$likesCount", taggedUsers: 1, createdAt: 1 } }]).skip(startFromIndex).limit(quantity)
        return posts
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

        comments: dbObject.commentsCount,
        likes: dbObject.likesCount,

        createdAt: dbObject.createdAt
    })
}

module.exports = { PostsDB }