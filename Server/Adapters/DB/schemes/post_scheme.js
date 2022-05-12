const mongoose = require('mongoose')

const postModel = mongoose.model("Post", mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        required: true,
    },

    publisherId: {
        type: String,
        required: true,
    },
    taggedUsers: {
        type: Array,
        default: 0
    },
    photos: {
        type: Array,
        required: true
    },
    publisherComment: {
        type: String,
        default: 0,
    },

    likes: {
        type: Array,
        default: []
    },

    commentsCount: {
        type: Number,
        default: 0
    },
    likesCount: {
        type: Number,
        default: 0
    },


    createdAt: {
        type: Date,
        required: true
    }
}))

module.exports = { postModel }