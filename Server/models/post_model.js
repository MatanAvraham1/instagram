const Joi = require("joi")
const mongoose = require("mongoose")
const { getUserById, userErrors, userModel } = require("./user_model")

const postErrors = {
    postNotExistsError: "post doesn't exist!",
    invalidPostError: "invalid post!",
    alreadyLikedError: "already liked!",
    alreadyUnlikedError: 'already unliked!'
}

const postModel = mongoose.model("Post", mongoose.Schema({
    owners: {
        type: Array,
        required: true,
    },
    publisherComment: {
        type: String,
        default: "",
    },
    location: {
        type: String,
        default: "",
    },
    photosUrls: {
        type: Array,
        required: true
    },
    taggedUsers: {
        type: Array,
        default: [],
    },
    publishedAt: {
        type: Date,
        default: Date.now,
    },
    likes: {
        type: Array,
        default: []
    },

    commentsLength: {
        type: Number,
        default: 0,
    },
    likesLength: {
        type: Number,
        default: 0,
    },
}))


function isPostValidate(data) {
    const scheme = Joi.object({
        owners: Joi.array().min(1).required(),
        publisherComment: Joi.string().default(""),
        location: Joi.string().default(""),
        photosUrls: Joi.array().required().min(1),
        taggedUsers: Joi.array().default([]),
        comments: Joi.array().default([]),
        publishedAt: Joi.date().default(Date.now),
        likes: Joi.array().default([])
    })

    const value = scheme.validate(data)

    if (value.error === undefined) {
        return true
    }

    return false
}

async function getPostById(postId) {
    /*
    Returns post by id

    param 1: id of the post
    */

    try {
        const post = await postModel.aggregate([{ $match: { _id: mongoose.Types.ObjectId(postId) } }, { $project: { owners: 1, publisherComment: 1, location: 1, photosUrls: 1, comments: "$commentsLength", likes: "$likesLength", taggedUsers: 1, publishedAt: 1 } }]).limit(1)
        if (post === null) {
            throw postErrors.postNotExistsError
        }

        return post
    }
    catch (err) {
        throw err
    }
}

async function getPosts(userId, startPostIndex, quantity) {
    /*
    Returns posts of user 

    param 1: the id of the user
    param 2: from which post to start
    param 3: how much posts to return
    */

    try {
        const posts = await postModel.aggregate([{ $match: { owners: { $in: [userId] } } }, { $project: { owners: 1, publisherComment: 1, location: 1, photosUrls: 1, comments: "$commentsLength", likes: "$likesLength", taggedUsers: 1, publishedAt: 1 } }]).skip(startPostIndex).limit(quantity)
        return posts
    }
    catch (err) {
        throw err
    }
}

async function addPost(post) {
    /*
    Adds new post

    param 1: the post object

    return: created post id
    */

    try {
        if (isPostValidate(post)) {
            const postObject = new postModel(post)
            await postObject.save()

            for (const owner of post.owners) {
                await userModel.findByIdAndUpdate(owner, { $inc: { postsLength: 1 } })
            }

            return postObject._id
        }
        else {
            throw postErrors.invalidPostError
        }
    }
    catch (err) {
        throw err
    }
}

async function deletePost(postId) {
    /*
    Deletes post by id

    param 1: the id of the post 
    */

    try {
        const { owners } = await postModel.findById(postId)
        await postModel.findByIdAndDelete(postId)

        for (const owner of owners) {
            await userModel.findByIdAndUpdate(owner, { $inc: { postsLength: -1 } })
        }
    }
    catch (err) {
        if (err == "TypeError: Cannot destructure property 'owners' of '(intermediate value)' as it is null.") {
            throw postErrors.postNotExistsError
        }

        throw err
    }
}


async function doesPostExist(postId) {
    /*
    Returns if post exists true/false
    */

    if (await postModel.findById(postId, { "_id": 1 }) === null) {
        return false
    }
    else {
        return true
    }

}

async function likePost(postId, whoLikedId) {
    /*
    Likes post

    param 1: the id of the post
    param 2: the id of the user who like the post
    */

    try {

        if (await isPostLiked(postId, whoLikedId)) {
            throw postErrors.alreadyLikedError
        }

        await postModel.findByIdAndUpdate(postId, { $addToSet: { likes: whoLikedId }, $inc: { likesLength: 1 } })
    }
    catch (err) {
        throw err
    }
}

async function unlikePost(postId, whoUnlikedId) {
    /*
    UnLikes post

    param 1: the id of the post
    param 2: the id of the user who unlike the post
    */

    try {

        if (!await isPostLiked(postId, whoLikedId)) {
            throw postErrors.alreadyUnlikedError
        }

        await postModel.findByIdAndUpdate(postId, { $pull: { likes: whoUnlikedId }, $inc: { likesLength: -1 } })
    }
    catch (err) {
        throw err
    }
}

async function isPostLiked(postId, whoLikerId) {
    /*
    Checks if the user - [whoLikerId] likes the post [postId]

    param 1: the post id
    param 2: the id of the user to check
    */

    try {

        if (!await doesPostExist(postId)) {
            throw postErrors.postNotExistsError
        }

        const post = await postModel.findOne({ _id: mongoose.Types.ObjectId(postId), likes: { $in: [whoLikerId] } })
        if (post === null) {
            return false
        }
        else {
            return true
        }
    }
    catch (err) {
        throw err
    }
}

async function getFeedPosts(requesterId) {
    /*
    Returns the posts of the user's followings by date
    */

    throw "need to implement!"
    try {
        const posts = []

        const user = await getUserById(requesterId)
        for (const followingId of user.followings) {
            const following = await getUserById(followingId)
            for (const post of following.posts) {
                posts.push(post)
            }
        }

        return posts.sort(function (a, b) {
            return b.publishedAt - a.publishedAt;
        })
    }
    catch (err) {
        if (err === userErrors.userNotExistsError) {
            throw userErrors.userNotExistsError
        }

        throw err
    }
}


module.exports = { doesPostExist, isPostLiked, postModel, getFeedPosts, unlikePost, likePost, deletePost, addPost, getPosts, postErrors, getPostById }