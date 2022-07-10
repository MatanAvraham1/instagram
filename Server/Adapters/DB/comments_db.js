const { default: mongoose } = require("mongoose")
const { AppError, AppErrorMessages } = require("../../app_error")
const { commentModel } = require("./schemes/comment_scheme")


class CommentsDB {
    static async insert(comment) {
        // Insert comment

        const commentObject = new commentModel({
            _id: comment.id,

            publisherId: comment.publisherId,
            postId: comment.postId,
            replyToComment: comment.replyToComment,
            comment: comment.comment,

            likes: [],
            likesCount: 0,

            replies: 0,

            createdAt: comment.createdAt
        })
        await commentObject.save()


        if (comment.replyToComment != null) {
            await commentModel.findByIdAndUpdate(comment.replyToComment, { $inc: { repliesCount: 1 } })
        }
    }

    static async deleteById(commentId) {
        // Deletes comment by id


        const replyToCommentId = (await commentModel.findById(commentId, { replyToComment: 1 })).replyToComment
        if (replyToCommentId != null) {
            await commentModel.findByIdAndUpdate(replyToCommentId, { $inc: { repliesCount: -1 } })
        }

        await commentModel.findByIdAndDelete(commentId)
    }

    static async findById(commentId) {
        // returns comment by id

        const comment = await commentModel.findById(commentId, { likes: 0 })

        if (comment == null) {
            throw new AppError(AppErrorMessages.commentDoesNotExist)
        }

        return commentObjectFromDbObject(post)
    }

    static async findByPostId(postId, startFromIndex, quantity) {
        /*
        Returns comments by post id 

        param 1: post id
        param 2: from which comment to start
        param 3: how much to return
        */

        const comments = await commentModel.aggregate([{ $match: { postId: postId } }, { $project: { publisherId: 1, postId: 1, replyToComment: 1, comment: 1, likes: "$likesCount", replies: "$repliesCount", createdAt: 1 } }]).skip(startFromIndex).limit(quantity)
        return comments
    }

    static async deleteByPostId(postId) {
        /*
        Deletes all the comments which published on some post

        param 1: the post id
        */

        await commentModel.deleteMany({ postId: postId })
    }

    static async deleteByPublisherId(userId) {
        /*
        Deletes all the comments which published by [userId]

        param 1: the publisher id 
        */


        // TODO: check if the await wait for the function to end (because there is a callback)
        await commentModel.count({ publisherId: mongoose.Types.ObjectId(userId) }, async function (err, count) {

            for (let index = 0; index < count; index++) {
                let comment = await commentModel.findOneAndDelete({})
                await CommentsDB.deleteReplies(comment._id.toString())
            }
        })
    }

    static async deleteReplies(commentId) {
        /*
        Deletes all the replies comments to the comment[commentId]

        param 1: the comment id
        */

        await commentModel.deleteMany({ replyToComment: commentId })
    }

    static async findReplies(commentId, startFromIndex, quantity) {
        /*
        Returns replies of the comment [commentId]

        param 1: the comment id
        param 2: from which comment to start
        param 3: how much to return
        */

        const comments = await commentModel.aggregate([{ $match: { replyToComment: commentId } }, { $project: { publisherId: 1, postId: 1, replyToComment: 1, comment: 1, likes: "$likesCount", replies: "$repliesCount", createdAt: 1 } }]).skip(startFromIndex).limit(quantity)
        return comments
    }

    static async findByPublisher(publisherId, startFromIndex, quantity) {
        /*
        Returns comments by publisher id

        param 1: the publisher id
        param 2: from which comment to start
        param 3: how much to return
        */

        const comments = await commentModel.aggregate([{ $match: { publisherId: publisherId } }, { $project: { publisherId: 1, postId: 1, replyToComment: 1, comment: 1, likes: "$likesCount", replies: "$repliesCount", createdAt: 1 } }]).skip(startFromIndex).limit(quantity)
        return comments
    }

    static async isLiked(commentId, whoLikeId) {
        /*  
        Checks if comment liked by someone

        param 1: the comment id
        param 2: the liker id
        */

        const comment = await commentModel.findOne({ _id: mongoose.Types.ObjectId(commentId), likes: { $in: [whoLikeId] } }, { likes: 0, replies: 0 })
        return comment != null
    }


    static async likeComment(commentId, whoLikeId) {
        /*
        Adds like to the comment [commentId] by [whoLikeId]

        param 1: the comment id
        param 2: the liker id
        */

        await commentModel.findByIdAndUpdate(commentId, { $addToSet: { likes: whoLikeId } })
    }

    static async unlikeComment(commentId, whoLikeId) {
        /*
        Unlikes the comment [commentId] by [whoLikeId]

        param 1: the comment id
        param 2: the liker id
        */

        await commentModel.findByIdAndUpdate(commentId, { $pull: { likes: whoLikeId } })
    }

}


function commentObjectFromDbObject(dbObject) {
    // Returns post object from db post object

    return Object.freeze({
        id: dbObject._id.toString(),

        publisherId: dbObject.publisherId,
        postId: dbObject.postId,
        replyToComment: dbObject.replyToComment,
        comment: dbObject.comment,

        likes: dbObject.likesCount,
        replies: dbObject.repliesCount,

        createdAt: dbObject.createdAt
    })
}

module.exports = { CommentsDB }