const Joi = require("joi")
const mongoose = require("mongoose")
const { postErrors, getPostById } = require("./Post")

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
    comment: {
        type: String,
        required: true,
    },
    likes: {
        type: Array,
        defualt: [],
    },
    publishedAt: {
        required: true,
        type: Date,
    }
}))


function isCommentValidate(data) {
    const scheme = Joi.object({
        publisherId: Joi.string().required(),
        comment: Joi.string().required(),
        likes: Joi.array().default([]),
        publishedAt: Joi.date().required()
    })

    const value = scheme.validate(data)

    if (value.error == null) {
        return true
    }

    return false
}

async function getCommentById(userId, postId, commentId) {
    /*
    Returns the comment - [commentId] from the  post - [postId] of the user - [userId]

    param 1: id of the user
    param 2: id of the post
    param 3: the id of the comment
    */

    const post = await getPostById(userId, postId)
    const commentIndex = post.comments.findIndex((comment) => comment._id == commentId)
    if (commentIndex == -1) {
        throw commentErrors.commentNotExist
    }

    return post.comments[commentIndex];
}

async function getComments(userId, postId) {
    /*
    Returns all the comments of the post - [postIndex] of the user - [userId]

    param 1: id of the user
    param 2: id of the post
    */

    const post = await getPostById(userId, postId)
    return post.comments;
}

async function addComment(userId, postId, comment) {
    /*
    Adds new comment to the post - [postId] of the user - [userId]

    param 1: the id of the user
    param 2: the id of the post
    param 3: the comment object
    */

    if (isCommentValidate(comment)) {
        const commentObject = new commentModel(comment)
        const user = await getUserById(userId)

        const index = user.posts.findIndex((post) => post._id == postId)
        if (index == -1) {
            throw postErrors.postNotExistsError
        }
        user.posts[index].push(commentObject)
        await updateUser(userId, user)
    }
    else {
        throw commentErrors.invalidCommentError
    }
}

async function deleteComment(userId, postId, commentId) {
    /*
    Deletes the comment - [commentId] of the post - [postId] of the user - [userId]

    param 1: the id of the user
    param 2: the id of the post
    param 3: the id of the comment 
    */

    var user = await getUserById(userId)
    const postIndex = user.posts.findIndex((post) => post._id == postId)
    if (postIndex == -1) {
        throw postErrors.postNotExistsError
    }

    const commentIndex = user.posts[postIndex].comments.findIndex((comment) => comment._id == commentId)
    if (commentIndex == -1) {
        throw commentErrors.commentNotExist
    }

    user.posts[postIndex].comments[commentIndex].splice(commentIndex, 1)
    await updateUser(userId, user)
}


async function likeComment(userId, postId, commentId, whoLikedId) {
    /*
    Likes the comment - [commentId] of the post - [postId] of the user - [userId]

    param 1: the id of the user
    param 2: the id of the post
    param 3: the id of the comment
    param 4: the id of the user who like the comment
    */

    var user = await getUserById(userId)
    const postIndex = user.posts.findIndex((post) => post._id == postId)
    if (postIndex == -1) {
        throw postErrors.postNotExistsError
    }

    const commentIndex = user.posts[postIndex].comments.findIndex((comment) => comment._id == commentId)
    if (commentIndex == -1) {
        throw commentErrors.commentNotExist
    }

    if (user.posts[postIndex].comments.likes.includes(whoLikedId)) {
        throw commentErrors.alreadyLikedError
    }
    user.posts[postIndex].comments.likes.push(whoLikedId)
    await updateUser(userId, user)
}

async function unlikeComment(userId, postId, commentId, whoUnlikedId) {
    /*
    UnLikes the comment - [commentId] of the post - [postId] of the user - [userId]

    param 1: the id of the user
    param 2: the id of the post
    param 3: the id of the comment
    param 4: the id of the user who unlike the comment
    */

    var user = await getUserById(userId)
    const postIndex = user.posts.findIndex((post) => post._id == postId)
    if (postIndex == -1) {
        throw postErrors.postNotExistsError
    }

    const commentIndex = user.posts[postIndex].comments.findIndex((comment) => comment._id == commentId)
    if (commentIndex == -1) {
        throw commentErrors.commentNotExist
    }

    const likeIndex = user.posts[postIndex].comments.likes.findIndex((like) => like == whoUnlikedId)
    if (likeIndex == -1) {
        throw commentErrors.alreadyUnlikedError
    }
    user.posts[postIndex].comments.likes.splice(likeIndex, 1)
    await updateUser(userId, user)
}


module.exports = { commentModel, getComments, commentErrors, getCommentById, isCommentValidate, addComment, deleteComment, likeComment, unlikeComment }