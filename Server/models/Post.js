const Joi = require("joi")
const mongoose = require("mongoose")
const { getUserById, updateUser } = require("./User")

const postErrors = {
    postNotExistsError: "post doesn't exist!",
    invalidPostError: "invalid post!",
    alreadyLikedError: "already liked!",
    alreadyUnlikedError: 'already unliked!'
}

const postModel = mongoose.model("Post", mongoose.Schema({
    photosUrls: {
        type: Array,
        required: true
    },
    comments: {
        type: Array,
        defualt: [],
    },
    taggedUsers: {
        type: Array,
        defualt: [],
    },
    publishedAt: {
        type: Date,
        required: true
    },
    likes: {
        type: Array,
        defualt: []
    }
}))


function isPostValidate(data) {
    const scheme = Joi.object({
        photosUrls: Joi.array().required().min(1),
        taggedUsers: Joi.array().default([]),
        comments: Joi.array().default([]),
        publishedAt: Joi.date().required(),
        likes: Joi.array().default([])
    })

    const value = scheme.validate(data)

    if (value.error == null) {
        return true
    }

    return false
}

async function getPostById(userId, postId) {
    /*
    Returns the post - [postId] of the user - [userId]

    param 1: id of the user
    param 2: id of the post
    */

    const user = await getUserById(userId)

    const postIndex = user.posts.findIndex((post) => post._id == postId)
    if (postIndex == -1) {
        throw postErrors.postNotExistsError
    }

    return user.posts[postIndex];
}

async function getPosts(userId) {
    /*
    Returns all the posts of the user - [userId]

    param 1: the id of the user
    */

    const user = await getUserById(userId)
    return user.posts;
}

async function addPost(userId, post) {
    /*
    Adds new post to the user - [userId]

    param 1: the id of the user
    param 2: the post object
    */

    if (isPostValidate(post)) {
        const postObject = new postModel(post)
        const user = await getUserById(userId)
        user.posts.push(postObject)
        await updateUser(userId, user)
    }
    else {
        throw postErrors.invalidPostError
    }
}

async function deletePost(userId, postId) {
    /*
    Deletes the post - [postId] to the user - [userId]

    param 1: the id of the user
    param 2: the id of the post 
    */

    var user = await getUserById(userId)
    const postIndex = user.posts.findIndex((post) => post._id == postId)
    if (postIndex == -1) {
        throw postErrors.postNotExistsError
    }

    user.posts.splice(postIndex, 1)
    await updateUser(userId, user)
}


async function likePost(userId, postId, whoLikedId) {
    /*
    Likes the post - [postId] of the user - [userId]

    param 1: the id of the user
    param 2: the id of the post
    param 3: the id of the user who like the post
    */

    var user = await getUserById(userId)
    const postIndex = user.posts.findIndex((post) => post._id == postId)
    if (postIndex == -1) {
        throw postErrors.postNotExistsError
    }

    if (user.posts[postIndex].likes.includes(whoLikedId)) {
        throw postErrors.alreadyLikedError
    }
    user.posts[postIndex].likes.push(whoLikedId)
    await updateUser(userId, user)
}

async function unlikePost(userId, postId, whoUnlikedId) {
    /*
    UnLikes the post - [postId] of the user - [userId]

    param 1: the id of the user
    param 2: the id of the post
    param 3: the id of the user who unlike the post
    */

    var user = await getUserById(userId)
    const postIndex = user.posts.findIndex((post) => post._id == postId)
    if (postIndex == -1) {
        throw postErrors.postNotExistsError
    }


    const likeIndex = user.posts[postIndex].likes.findIndex((like) => like == whoUnlikedId)
    if (likeIndex == -1) {
        throw postErrors.alreadyUnlikedError
    }
    user.posts[postIndex].likes.splice(likeIndex, 1)
    await updateUser(userId, user)
}

module.exports = { unlikePost, likePost, deletePost, addPost, getPosts, postErrors, postModel, isPostValidate, getPostById }