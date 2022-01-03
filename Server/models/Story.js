const Joi = require("joi")
const mongoose = require("mongoose")

const storyModel = mongoose.model("Story", mongoose.Schema({
    photoUrl: {
        type: String,
        required: true
    },
    publishedAt: {
        type: Date,
        required: true
    },
    viewers: {
        type: Array,
        defualt: []
    }
}))

function isStoryValidate(data) {
    const scheme = Joi.object({
        photoUrl: Joi.string().required(),
        publishedAt: Joi.date().required(),
        viewers: Joi.array().default([])
    })

    const value = scheme.validate(data)

    if (value.error == null) {
        return true
    }

    return false
}

module.exports = { storyModel, isStoryValidate }