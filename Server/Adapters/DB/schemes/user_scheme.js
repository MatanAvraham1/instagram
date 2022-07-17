const mongoose = require('mongoose')

const userModel = mongoose.model("User", mongoose.Schema({
    _id: {
        type: mongoose.Types.ObjectId,
        required: true,
    },

    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },

    fullname: {
        type: String,
        default: null
    },
    bio: {
        type: String,
        default: null
    },
    isPrivate: {
        type: Boolean,
        default: false
    },
    profilePhoto: {
        type: String,
        defualt: null,
    },

    followers: {
        type: Array,
        default: []
    },
    followRequests: {
        type: Array,
        default: []
    },

    followersCount: {
        type: Number,
        default: 0
    },
    followingsCount: {
        type: Number,
        default: 0
    },
    postsCount: {
        type: Number,
        default: 0
    },

    storiesCount: {
        type: Number,
        default: 0
    },

    followRequestsCount: {
        type: Number,
        defualt: 0
    },
    followingRequestsCount: {
        type: Number,
        defualt: 0
    },

    createdAt: {
        type: Date,
        required: true
    }
}))

module.exports = { userModel }