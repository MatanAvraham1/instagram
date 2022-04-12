const Joi = require('joi')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
// const { deletePostsOf } = require('./post_model')
// const { deleteStoriesOf, removeViewsOf } = require('./story_model')

const userErrors = {
    userNotExistsError: "user doesn't exists!",
    usernameAlreadyUsedError: "the username is already used!",

    userToFollowNotExistsError: "The user to follow doesn't exists!",
    userToUnfollowNotExistsError: "The user to unfollow doesn't exists!",

    alreadyFollowedError: "the first user already followed the seconds user!",
    alreadyUnfollowedError: "the first user doesn't follow the second user!",
    followRequestAlreadySentError: "follow request has been already sent!",
    followRequestNotExistsError: "the follow request doesn't exists!",

    invalidRegisterDetailsError: "invalid register details!",
    invalidUpdateDetailsError: "invalid update details!",
    wrongLoginDetailsError: "wrong login deatils!",
    cantFollowHimself: "user can't follow himself"
}

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
    photoUrl: {
        type: String,
        default: "",
    },
    followers: {
        type: Array,
        default: [],
    },
    followRequests: {
        type: Array,
        default: []
    },
    isPrivate: {
        type: Boolean,
        default: false
    },

    // Length of arrays
    followersLength: {
        type: Number,
        default: 0,
    },
    followingsLength: {
        type: Number,
        default: 0,
    },
    followRequestsLength: {
        type: Number,
        default: 0,
    },
    followingRequestsLength: {
        type: Number,
        default: 0,
    },
    storiesLength: {
        type: Number,
        default: 0,
    },
    postsLength: {
        type: Number,
        default: 0,
    }
}))

function isRegisterValid(data) {
    const scheme = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    })
    const value = scheme.validate(data)

    if (value.error === undefined) {
        return true
    }

    return false
}
const isLoginValid = isRegisterValid

function isUpdateValid(data) {
    const scheme = Joi.object({
        username: Joi.string(),
        fullname: Joi.string().min(0),
        bio: Joi.string().min(0),
        isPrivate: Joi.boolean(),
        photoUrl: Joi.string().uri(),
    })
    const value = scheme.validate(data)

    if (value.error === undefined) {
        return true
    }

    return false
}

async function login(data) {
    /*
    Logins 
    Returns the user id

    param 1: the user object
    */

    try {
        if (isLoginValid(data)) {
            const user = await userModel.findOne({ username: data.username }, { password: 1 })
            if (user == null) {
                throw userErrors.wrongLoginDetailsError
            }

            if (await bcrypt.compare(data.password, user.password)) {
                return user._id
            }
            else {
                throw userErrors.wrongLoginDetailsError
            }
        }
        else {
            throw userErrors.wrongLoginDetailsError
        }
    }
    catch (err) {
        if (err === userErrors.userNotExistsError) {
            throw userErrors.wrongLoginDetailsError
        }

        throw err
    }

}

async function createUser(data) {
    /*
    Creates a new user (register...)
    Returns the created user id

    param 1: the user object
    */

    try {
        if (isRegisterValid(data)) {
            if (await doesUsernameAlreadyUsed(data.username)) {
                throw userErrors.usernameAlreadyUsedError
            }

            const hashedPassword = await bcrypt.hash(data.password, 10);
            const user = new userModel({ username: data.username, password: hashedPassword })
            const { _id } = await user.save()

            return _id.toString()
        }
        else {
            throw userErrors.invalidRegisterDetailsError
        }
    }
    catch (err) {
        throw err
    }

}

async function updateUser(userId, data) {
    /*
    Updates user

    param 1: the user id
    param 2: user object
    */

    try {
        if (isUpdateValid(data)) {
            const user = await getUserById(userId)

            if (data.username !== undefined && data.username !== user.username) {

                if (await doesUsernameAlreadyUsed(data.username)) {
                    throw userErrors.usernameAlreadyUsedError
                }
                await userModel.findByIdAndUpdate(userId, { $set: { username: data.username } })
            }
            if (data.fullname !== undefined && data.fullname !== user.fullname) {
                await userModel.findByIdAndUpdate(userId, { $set: { fullname: data.fullname } })
            }
            if (data.bio !== undefined && data.bio !== user.bio) {
                await userModel.findByIdAndUpdate(userId, { $set: { bio: data.bio } })
            }
            if (data.photoUrl !== undefined && data.photoUrl !== user.photoUrl) {
                await userModel.findByIdAndUpdate(userId, { $set: { photoUrl: data.photoUrl } })
            }
            if (data.isPrivate !== undefined && data.isPrivate !== user.isPrivate) {

                // If changed from false to true
                // Clears the follow requests
                if (!data.isPrivate) {
                    await clearFollowRequests(userId)
                }
                await userModel.findByIdAndUpdate(userId, { $set: { isPrivate: data.isPrivate } })
            }

        }
        else {
            throw userErrors.invalidUpdateDetailsError
        }
    }
    catch (err) {
        throw err
    }

}

async function deleteUser(userId) {
    /*
    Deletes user by id

    param 1: the user id
    */

    try {
        if (! await doesUserExists(userId)) {
            throw userErrors.userNotExistsError
        }

        await userModel.findByIdAndDelete(userId)
        await userModel.updateMany({ followers: { $in: [userId] } }, { $pull: { followers: userId } })

        await deletePostsOf(userId)

        await deleteStoriesOf(userId)
        await removeViewsOf(userId)

        //TODO: add chats and messages
    }
    catch (err) {
        throw err
    }
}

async function doesUserExists(userId) {
    /*
    Returns if user exists true/false
    */

    if (await userModel.findById(userId, { "_id": 1 }) === null) {
        return false
    }
    else {
        return true
    }

}

async function doesUsernameAlreadyUsed(username) {
    /*
    Returns if the username - [username] is already used

    param 1: the username to check
    */

    try {
        await getUserByUsername(username)
        return true
    }
    catch (err) {

        if (err === userErrors.userNotExistsError) {
            return false
        }

        throw err
    }
}

async function getUserById(userId, hidePrivateFields = false, hideOwnerFields = true) {
    /*
    Returns user by id

    param 1: user id
    param 2: hide private fields? (like the followRequests)
    param 3: hide owner fields? (like follow requests length)
    */

    try {
        const projectQuery = { posts: "$postsLength", followings: "$followingsLength", followers: "$followersLength", username: 1, fullname: 1, bio: 1, photoUrl: 1, isPrivate: 1 }
        if (!hidePrivateFields) {
            projectQuery.stories = "$storiesLength"
        }
        if (!hideOwnerFields) {
            projectQuery.followRequests = "$followRequestsLength"
            projectQuery.followingRequests = "$followingRequestsLength"
        }

        const user = await userModel.aggregate([{ $match: { _id: mongoose.Types.ObjectId(userId) } }, { $project: projectQuery }]).limit(1)

        if (user.length === 0) {
            throw userErrors.userNotExistsError
        }

        return user[0]
    }
    catch (err) {
        throw err
    }


}

async function getUserByUsername(username, hidePrivateFields = false, hideOwnerFields = true) {
    /*
    Returns user by username

    param 1: user id
    param 2: hide private fields? (like the followRequests)
    param 3: hide owner fields? (like follow requests length)
    */

    try {
        const projectQuery = { posts: "$postsLength", followings: "$followingsLength", followers: "$followersLength", username: 1, fullname: 1, bio: 1, photoUrl: 1, isPrivate: 1 }
        if (!hidePrivateFields) {
            projectQuery.stories = "$storiesLength"
        }
        if (!hideOwnerFields) {
            projectQuery.followRequests = "$followRequestsLength"
            projectQuery.followingRequests = "$followingRequestsLength"
        }
        const user = await userModel.aggregate([{ $match: { username: username } }, { $project: projectQuery }]).limit(1)

        if (user.length === 0) {
            throw userErrors.userNotExistsError
        }

        return user[0]
    }
    catch (err) {
        throw err
    }
}

async function getUserByFullname(fullname, hidePrivateFields = false, hideOwnerFields = true) {
    /*
    Returns user by fullname

    param 1: user id
    param 2: hide private fields? (like stories length)
    param 3: hide owner fields? (like follow requests length)
    */

    try {
        const projectQuery = { posts: "$postsLength", followings: "$followingsLength", followers: "$followersLength", username: 1, fullname: 1, bio: 1, photoUrl: 1, isPrivate: 1 }
        if (!hidePrivateFields) {
            projectQuery.stories = "$storiesLength"
        }
        if (!hideOwnerFields) {
            projectQuery.followRequests = "$followRequestsLength"
            projectQuery.followingRequests = "$followingRequestsLength"
        }
        const user = await userModel.aggregate([{ $match: { fullname: fullname } }, { $project: projectQuery }]).limit(1)

        if (user.length === 0) {
            throw userErrors.userNotExistsError
        }

        return user[0]
    }
    catch (err) {
        throw err
    }
}


async function isFollow(firstUserId, secondUserId) {
    /*
    Checks if [firstUserId] follow [secondUserId]
    */
    const user = await userModel.findOne({ _id: mongoose.Types.ObjectId(secondUserId), followers: { $in: [firstUserId] } })
    if (user === null) {
        return false
    }
    else {
        return true
    }
}

async function isRequested(firstUserId, secondUserId) {
    /*
    Checks if [firstUserId] requested to follow [secondUserId]
    */
    const user = await userModel.findOne({ _id: mongoose.Types.ObjectId(secondUserId), followRequests: { $in: [firstUserId] } })
    if (user === null) {
        return false
    }
    else {
        return true
    }
}

async function followUser(firstUserId, secondUserId) {
    /*
    Makes [firstUserId] follow [secondUserId]
 
    param 1: the first user id
    param 2: the second user id
    */

    try {

        if (! await doesUserExists(firstUserId)) {
            throw userErrors.userNotExistsError
        }
        if (! await doesUserExists(secondUserId)) {
            throw userErrors.userToFollowNotExistsError
        }

        if (firstUserId === secondUserId) {
            throw userErrors.cantFollowHimself
        }
        if (await isFollow(firstUserId, secondUserId)) {
            throw userErrors.alreadyFollowedError
        }
        if (await isRequested(firstUserId, secondUserId)) {
            throw userErrors.followRequestAlreadySentError
        }

        const secondUser = await getUserById(secondUserId)

        if (!secondUser.isPrivate) {
            await userModel.findByIdAndUpdate(secondUserId, { $addToSet: { followers: firstUserId }, $inc: { followersLength: 1 } })
            await userModel.findByIdAndUpdate(firstUserId, { $inc: { followingsLength: 1 } })
        }
        else {
            await userModel.findByIdAndUpdate(secondUserId, { $addToSet: { followRequests: firstUserId }, $inc: { followRequestsLength: 1 } })
            await userModel.findByIdAndUpdate(firstUserId, { $inc: { followingRequestsLength: 1 } })
        }
    }
    catch (err) {
        throw err
    }

}

async function unfollowUser(firstUserId, secondUserId) {
    /*
    Makes [firstUserId] unfollow [secondUserId]
 
    param 1: the first user id
    param 2: the second user id
    */

    try {
        if (! await doesUserExists(firstUserId)) {
            throw userErrors.userNotExistsError
        }
        if (! await doesUserExists(secondUserId)) {
            throw userErrors.userToUnfollowNotExistsError
        }

        if (firstUserId === secondUserId) {
            throw userErrors.cantFollowHimself
        }
        if (!(await isFollow(firstUserId, secondUserId))) {
            throw userErrors.alreadyUnfollowedError
        }

        await userModel.findByIdAndUpdate(secondUserId, { $pull: { followers: firstUserId }, $inc: { followersLength: -1 } })
        await userModel.findByIdAndUpdate(firstUserId, { $inc: { followingsLength: -1 } })
    }
    catch (err) {
        throw err
    }
}

async function acceptFollowRequest(firstUserId, secondUserId) {
    /*
    Accepts the follow request which [firstUserId] sent to [secondUserId]

    param 1: the id of the first user
    param 2: the id of the second user
    */

    try {
        if (!(await isRequested(firstUsSerId, secondUserId))) {
            throw userErrors.followRequestNotExistsError
        }

        await userModel.findByIdAndUpdate(secondUserId, { $pull: { followRequests: firstUserId }, $inc: { followRequestsLength: -1, followersLength: 1 }, $addToSet: { followers: firstUserId } })
        await userModel.findByIdAndUpdate(firstUserId, { $inc: { followingsLength: 1, followingRequestsLength: -1 } })
    }
    catch (err) {
        throw err
    }
}

async function deleteFollowRequest(firstUserId, secondUserId) {
    /*
    Deletes the follow request which [firstUserId] sent to [secondUserId]

    param 1: the first user id
    param 2: the second user id
    */

    try {
        if (!(await isRequested(firstUserId, secondUserId))) {
            throw userErrors.followRequestNotExistsError
        }

        await userModel.findByIdAndUpdate(secondUserId, { $pull: { followRequests: firstUserId }, $inc: { followRequestsLength: -1 } })
        await userModel.findByIdAndUpdate(firstUserId, { $inc: { followingRequestsLength: -1 } })
    }
    catch (err) {
        throw err
    }
}
//
async function clearFollowRequests(userId) {
    /*
    Clears all the follow requests which sent to [userId]
    
    param 1: id of the user
    */

    try {

        let users = []
        do {
            users = await getFollowRequests(userId, 0, 5)
            for (const { _id } of users) {
                await userModel.findByIdAndUpdate(_id.toString(), { $inc: { followingRequestsLength: -1 } })
                await userModel.findByIdAndUpdate(userId, { $pull: { followRequests: _id.toString() }, $inc: { followRequestsLength: -1 } })
            }
        } while (users.length > 0);
    }
    catch (err) {
        throw err
    }
}

async function clearFollowingRequests(userId) {
    /*
    Clears all the follow requests which sent by [userId]
    
    param 1: id of the user
    */

    try {
        if (! await doesUserExists(userId)) {
            throw userErrors.userNotExistsError
        }

        await userModel.updateMany({ followRequests: { $in: [userId] } }, { $pull: { followRequests: userId }, $inc: { followRequestsLength: -1 } })
        await userModel.findByIdAndUpdate(userId, { $inc: { followingRequestsLength: -1 } })
    }
    catch (err) {
        throw err
    }
}

async function getFollowRequests(userId, startRequestIndex, quantity, hidePrivateFields = false, hideOwnerFields = true) {
    /*
       Returns the users which sent follow requests to [userId] 
    
       param 1: the id of the user
       param 2: from which request to start
       param 3: how much requests to return
       param 4: hide the private fields of the followers? (like stories length)
       param 5: hide the owner field of the followers? (like followRequests length)
       */

    try {
        const users = []

        const endRequestIndex = startRequestIndex + quantity
        const usersId = (await userModel.findById(userId, { password: 0, username: 0, __v: 0, _id: 0, fullname: 0, bio: 0, photoUrl: 0, isPrivate: 0, followRequests: 0, followRequests: { $slice: [startRequestIndex, endRequestIndex] } })).followRequests

        for (const userId of usersId) {
            users.push(await getUserById(userId, hidePrivateFields, hideOwnerFields))
        }
        return users
    }
    catch (err) {

        if (err == "TypeError: Cannot read property 'followRequests' of null") {
            throw userErrors.userNotExistsError
        }

        throw err
    }
}

async function getFollowingRequests(userId, startRequestIndex, quantity, hidePrivateFields = false, hideOwnerFields = true) {
    /*
   Returns the users which received follow requests from [userId] 

   param 1: the id of the user
   param 2: from which request to start
   param 3: how much requests to return
   param 4: hide the private fields of the followers? (like stories length)
   param 5: hide the owner field of the followers? (like followRequests length)
   */

    try {
        if (! await doesUserExists(userId)) {
            throw userErrors.userNotExistsError
        }

        const projectQuery = { followings: "$followingsLength", followers: "$followersLength", username: 1, fullname: 1, bio: 1, photoUrl: 1, isPrivate: 1 }
        if (!hidePrivateFields) {
            projectQuery.stories = "$storiesLength"
        }
        if (!hideOwnerFields) {
            projectQuery.followRequests = "$followRequestsLength"
            projectQuery.followingRequests = "$followingRequestsLength"
        }

        return await userModel.aggregate([{ $match: { followRequests: { $in: [userId] } } }, { $project: projectQuery }]).skip(startRequestIndex).limit(quantity)
    }
    catch (err) {
        throw err
    }
}


async function getFollowers(userId, startFollowerIndex, quantity, hidePrivateFields = false, hideOwnerFields = true) {
    /*
   Returns followers of user 

   param 1: the id of the user
   param 2: from which follower to start
   param 3: how much followers to return
   param 4: hide the private fields of the followers? (like stories length)
   param 5: hide the owner field of the followers? (like followRequests length)
   */

    try {
        const followers = []

        const endFollowerIndex = startFollowerIndex + quantity
        const followersId = (await userModel.findById(userId, { password: 0, username: 0, __v: 0, _id: 0, fullname: 0, bio: 0, photoUrl: 0, isPrivate: 0, followRequests: 0, followers: { $slice: [startFollowerIndex, endFollowerIndex] } })).followers

        for (const id of followersId) {
            followers.push(await userModel.getUserById(id, hidePrivateFields, hideOwnerFields))
        }
        return followers
    }
    catch (err) {
        if (err == "TypeError: Cannot read property 'followers' of null") {
            throw userErrors.userNotExistsError
        }

        throw err
    }
}

async function getFollowings(userId, startFollowingIndex, quantity) {
    /*
   Returns the users which followed by the user

   param 1: the id of the user
   param 2: from which follower to start
   param 3: how much followers to return
   */

    try {
        if (! await doesUserExists(userId)) {
            throw userErrors.userNotExistsError
        }

        const followings = []

        const followingsId = await userModel.aggregate([{ $match: { followers: { $in: [userId] } } }, { $project: { _id: 1 } }]).skip(startFollowingIndex).limit(quantity);
        for (const { _id } of followingsId) {
            followings.push(await getUserById(_id, false, true))
        }

        return followings
    }
    catch (err) {
        throw err
    }
}

module.exports = { userErrors, userModel, login, createUser, updateUser, deleteUser, doesUserExists, doesUsernameAlreadyUsed, getUserById, getUserByUsername, getUserByFullname, isFollow, isRequested, followUser, unfollowUser, acceptFollowRequest, deleteFollowRequest, clearFollowRequests, clearFollowingRequests, getFollowRequests, getFollowingRequests, getFollowers, getFollowings }