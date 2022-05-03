const Joi = require("joi")
const mongoose = require("mongoose")
const appErrors = require("../appErrors")
const { getUserById, userErrors, userModel } = require("./user_model")


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


    commentsCount: {
        type: Number,
        default: 0,
    },
    likesCount: {
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
        publishedAt: Joi.date().default(Date.now),
        likes: Joi.array().default([]),
        likesCount: Joi.defaults(0),
        commentsCount: Joi.defaults(0),
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
        const post = await postModel.aggregate([{ $match: { _id: mongoose.Types.ObjectId(postId) } }, { $project: { owners: 1, publisherComment: 1, location: 1, photosUrls: 1, comments: "$commentsCount", likes: "$likesCount", taggedUsers: 1, publishedAt: 1 } }]).limit(1)
        if (post === null) {
            throw appErrors.postNotExistsError
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
        const posts = await postModel.aggregate([{ $match: { owners: { $in: [userId] } } }, { $project: { owners: 1, publisherComment: 1, location: 1, photosUrls: 1, comments: "$commentsCount", likes: "$likesCount", taggedUsers: 1, publishedAt: 1 } }]).skip(startPostIndex).limit(quantity)
        return posts
    }
    catch (err) {
        throw err
    }
}

async function addPost(owners, publisherComment, location, photoUrls, taggedUsers, comments, publishedAt) {
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
                await userModel.findByIdAndUpdate(owner, { $inc: { postsCount: 1 } })
            }

            return postObject._id
        }
        else {
            throw appErrors.invalidPostError
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
            await userModel.findByIdAndUpdate(owner, { $inc: { postsCount: -1 } })
        }
    }
    catch (err) {
        if (err == "TypeError: Cannot destructure property 'owners' of '(intermediate value)' as it is null.") {
            throw appErrors.postNotExistsError
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
            throw appErrors.alreadyLikedError
        }

        await postModel.findByIdAndUpdate(postId, { $addToSet: { likes: whoLikedId }, $inc: { likesCount: 1 } })
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
            throw appErrors.alreadyUnlikedError
        }

        await postModel.findByIdAndUpdate(postId, { $pull: { likes: whoUnlikedId }, $inc: { likesCount: -1 } })
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
            throw appErrors.postNotExistsError
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

async function deletePostsOf(userId) {
    /*
    Deletes all posts uploaded by [userId]
    */

    await postModel.deleteMany({ owners: { $in: [userId] } })
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


module.exports = { deletePostsOf, doesPostExist, isPostLiked, postModel, getFeedPosts, unlikePost, likePost, deletePost, addPost, getPosts, getPostById }