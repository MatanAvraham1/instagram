const mongoose = require('mongoose')

const commentModel = mongoose.model("Comment", mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        required: true,
    },

    publisherId: {
        type: String,
        required: true,
    },
    postId: {
        type: String,
        required: true,
    },
    replyToComment: {
        type: String,
        default: null
    },
    comment: {
        type: String,
        required: true
    },


    likes: {
        type: Array,
        default: []
    },

    likesCount: {
        type: Number,
        default: 0
    },
    repliesCount: {
        type: Number,
        default: 0
    },

    createdAt: {
        type: Date,
        required: true
    }
}))

module.exports = { commentModel }