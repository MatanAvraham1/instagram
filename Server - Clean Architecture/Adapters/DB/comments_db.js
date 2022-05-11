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
            throw new AppError("Comment doesn't exist.")
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

    static async findByReplyTo(commentId, startFromIndex, quantity) {
        /*
        Returns comments which replied to another comment

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