require('dotenv').config()
const mongoose = require('mongoose');
const { getCommentById, addComment, getComments } = require('../models/comment_model');
const { deletePost } = require('../models/post_model');
const { getUserByUsername, getUserById, createUser, followUser, unfollowUser, deleteFollowRequest, acceptFollowRequest, getFollowingRequests, getFollowers, getFollowRequests, clearFollowRequests, clearFollowingRequests, getFollowings, doesUserExists, deleteUser } = require('../models/user_model')

// Connects to the database
mongoose.connect(process.env.DATABASE_URL).then((result) => {
    console.log("Connected to db!");
    setTimeout(async () => {

        console.log(parseInt("fdfd") == NaN)

    }, 0)
}).catch((err) => {
    console.log(err)
})



