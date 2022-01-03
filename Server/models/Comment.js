const Joi = require("joi")
const mongoose = require("mongoose")

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

module.exports = { commentModel, isCommentValidate }