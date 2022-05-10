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

            createdAt: comment.createdAt
        })
        await commentObject.save()
    }

    static async deleteById(commentId) {
        // Deletes comment by id
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

    static async findByPostId(postId) {
        /*
        Returns comments by post id 

        param 1: post id
        param 2: from which post to start
        param 3: how much to return
        */

        const comments = await commentModel.aggregate([{ $match: { postId: postId } }, { $project: { publisherId: 1, postId: 1, replyToComment: 1, comment: 1, likes: "$likesCount", createdAt: 1 } }]).skip(startFromIndex).limit(quantity)
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

        createdAt: dbObject.createdAt
    })
}

module.exports = { CommentsDB }