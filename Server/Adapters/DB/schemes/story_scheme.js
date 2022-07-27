const mongoose = require('mongoose')

const storyModel = mongoose.model("Story", mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        required: true,
    },

    publisherId: {
        type: String,
        required: true,
    },
    structure: {
        type: Object,
        required: true,
    },

    likes: {
        type: Array,
        default: []
    },
    viewers: {
        type: Array,
        default: []
    },

    likesCount: {
        type: Number,
        default: 0
    },
    viewersCount: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        required: true
    }
}))

module.exports = { storyModel }