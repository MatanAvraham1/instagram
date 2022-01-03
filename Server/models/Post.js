const Joi = require("joi")
const mongoose = require("mongoose")
const { getUserById } = require("./User")

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
    const user = await getUserById(userId)

    const postIndex = user.posts.findIndex((post) => post._id == postId)
    if (postIndex == -1) {
        return null
    }

    return user.posts[postIndex];
}

module.exports = { postModel, isPostValidate, getPostById }