const Joi = require("joi")
const mongoose = require("mongoose")
const { postErrors, getPostById, doesPostExist } = require("./post_model")
const { userErrors, getUserById, updateUser, doesUserExists } = require("./user_model")

const commentErrors = {
    commentNotExist: "comment doesn't exists!",
    invalidCommentError: "invalid comment!",
    alreadyLikedError: 'already liked!',
    alreadyUnlikedError: 'already unliked!',
}

const commentModel = mongoose.model("Comment", mongoose.Schema({
    publisherId: {
        type: String,
        required: true
    },
    postId: {
        type: String,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    likes: {
        type: Array,
        default: [],
    },
    publishedAt: {
        type: Date,
        default: Date.now,
    },

    likesLength: {
        type: Number,
        default: 0,
    }
}))


function isCommentValidate(data) {
    const scheme = Joi.object({
        publisherId: Joi.string().required(),
        postId: Joi.string().required(),
        comment: Joi.string().required(),
        likes: Joi.array().default([]),
        publishedAt: Joi.date().default(Date.now),
    })

    const value = scheme.validate(data)

    if (value.error === undefined) {
        return true
    }

    return false
}

async function getCommentById(commentId) {
    /*
    Returns the comment - [commetnId]

    param 1: id of the comment
    */

    try {
        const comment = await commentModel.findById(commentId, { publihserId: 1, postId: 1, comment: 1, likes: "$likesLength", publishedAt: 1, _id: 1 })
        if (comment === null) {
            throw commentErrors.commentNotExist
        }

        return comment
    }
    catch (err) {
        throw err
    }
}



async function getComments(postId, startFromCommentIndex, quantity) {
    /*
    Returns all the comments of post
    param 1: id of the post
    param 2: from which comment index to start?
    param 3: how much comments to return?
    */

    try {
        const comments = await commentModel.find({ postId: postId }, { publihserId: 1, postId: 1, comment: 1, likes: "$likesLength", publishedAt: 1, _id: 1 }).skip(startFromCommentIndex).limit(quantity)
        return comments
    }
    catch (err) {
        throw err
    }

}

async function addComment(comment) {
    /*
    Adds new comment

    param 1: the comment object
    */

    try {
        if (isCommentValidate(comment)) {

            if (! await doesPostExist(comment.postId)) {
                throw postErrors.postNotExistsError
            }

            if (! await doesUserExists(comment.publisherId)) {
                throw userErrors.userNotExistsError
            }

            const commentObject = new commentModel(comment)
            await commentObject.save()

            return commentObject._id
        }
        else {
            throw commentErrors.invalidCommentError
        }
    }
    catch (err) {
        throw err
    }
}


async function doesCommentExist(commentId) {
    /*
    Returns if comment exists true/false
    */

    if (await commentModel.findById(commentId, { "_id": 1 }) === null) {
        return false
    }
    else {
        return true
    }

}

async function deleteComment(commentId) {
    /*
    Deletes the comment - [commentId] 

    param 1: the id of the comment 
    */

    try {
        if (! await doesCommentExist(commentId)) {
            throw commentErrors.commentNotExist
        }

        await commentModel.findByIdAndDelete(commentId)
    }
    catch (err) {
        throw err
    }

}


async function isCommentLiked(commentId, whoLikerId) {
    /*
    Checks if the user - [whoLikerId] likes the comment [commentId]

    param 1: the comment id
    param 2: the id of the user to check
    */

    try {

        if (!await doesCommentExist(commentId)) {
            throw commentErrors.commentNotExist
        }

        const comment = await commentModel.findOne({ _id: mongoose.Types.ObjectId(commentId), likes: { $in: [whoLikerId] } })
        if (comment === null) {
            return false
        }
        else {
            return true
        }
    }
    catch (err) {
        throw err
    }
}

async function likeComment(commentId, whoLikedId) {
    /*
    Likes the comment - [commentId]

    param 1: the id of the comment
    param 2: the id of the user who like the comment
    */

    try {

        if (await isCommentLiked(commentId, whoLikedId)) {
            throw commentErrors.alreadyLikedError
        }


        await commentModel.findByIdAndUpdate(commentId, { $addToSet: { likes: whoLikedId }, $inc: { likesLength: 1 } })
    }
    catch (err) {
        throw err
    }


}

async function unlikeComment(commentId, whoUnlikedId) {
    /*
    UnLikes the comment - [commentId] 

    param 1: the id of the comment
    param 2: the id of the user who unlike the comment
    */


    try {

        if (!await isCommentLiked(commentId, whoLikedId)) {
            throw commentErrors.alreadyUnlikedError
        }

        await postModel.findByIdAndUpdate(commentId, { $pull: { likes: whoUnlikedId }, $inc: { likesLength: -1 } })
    }
    catch (err) {
        throw err
    }
}


module.exports = { commentModel, getComments, commentErrors, getCommentById, isCommentValidate, addComment, deleteComment, likeComment, unlikeComment }