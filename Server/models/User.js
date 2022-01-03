const { bool } = require('joi')
const Joi = require('joi')
const mongoose = require('mongoose')

const userModel = mongoose.model("User", mongoose.Schema({
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
        default: "",
    },
    bio: {
        type: String,
        default: "",
    },
    followers: {
        type: Array,
        default: [],
    },
    following: {
        type: Array,
        default: [],
    },
    posts: {
        type: Array,
        default: [],
    },
    followRequests: {
        type: Array,
        default: []
    },
    followingRequests: {
        type: Array,
        default: []
    },
    isPrivate: {
        type: Boolean,
        default: false
    }
}))

async function doesUserExist(username) {
    const user = await userModel.findOne({ username: username })
    if (user != null) {
        return true
    }

    return false
}


async function getUserById(userId) {
    try {
        const user = await userModel.findById(userId)
        return user
    }
    catch (err) {
        return null
    }
}

async function getUserByUsername(username) {
    try {
        const user = await userModel.findOne({ username: username })
        return user
    }
    catch (err) {
        return null
    }
}

async function getUserByFullname(fullname) {
    try {
        const user = await userModel.findOne({ fullname: fullname })
        return user
    }
    catch (err) {
        return null
    }
}


module.exports = { doesUserExist, userModel, getUserById, getUserByUsername, getUserByFullname }