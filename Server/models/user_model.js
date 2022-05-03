const Joi = require('joi')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const appErrors = require('../appErrors')

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
        default: null,
    },
    bio: {
        type: String,
        default: null,
    },
    photoUrl: {
        type: String,
        default: null,
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
    followersCount: {
        type: Number,
        default: 0,
    },
    followingsCount: {
        type: Number,
        default: 0,
    },
    followRequestsCount: {
        type: Number,
        default: 0,
    },
    followingRequestsCount: {
        type: Number,
        default: 0,
    },
    storiesCount: {
        type: Number,
        default: 0,
    },
    postsCount: {
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
        username: Joi.string().default(undefined),
        fullname: Joi.string().default(undefined),
        bio: Joi.string().default(undefined),
        isPrivate: Joi.boolean().default(undefined),
        photorUl: Joi.string().uri().default(undefined),
    })
    const value = scheme.validate(data)

    if (value.error === undefined) {
        return true
    }

    return false
}

async function login(username, password) {
    /*
    Logins 
    Returns the user id

    param 1: the user object
    */

    if (isLoginValid({
        username: username,
        password: password,
    })) {
        const user = await userModel.findOne({ username: username }, { password: 1 })
        if (user == null) {
            throw appErrors.wrongLoginDetailsError
        }

        if (await bcrypt.compare(password, user.password)) {
            return user._id
        }
        else {
            throw appErrors.wrongLoginDetailsError
        }
    }
    else {
        throw appErrors.invalidLoginDetailsError
    }
}

async function createUser(username, password) {
    /*
    Creates a new user (register...)
    Returns the created user id

    param 1: the user object
    */

    if (isRegisterValid({
        username: username,
        password: password
    })) {
        if (await doesUsernameAlreadyUsed(username)) {
            throw appErrors.usernameAlreadyUsedError
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ username: username, password: hashedPassword })
        const { _id } = await user.save()

        return _id
    }
    else {
        throw appErrors.invalidRegisterDetailsError
    }
}


async function updateUser(userId, username = undefined, fullname = undefined, bio = undefined, isPrivate = undefined, photoUrl = undefined) {
    /*
    Updates user

    param 1: the user id
    param 2 - 6: updateable fields
    */

    if (isUpdateValid({
        username: username,
        fullname: fullname,
        bio: bio,
        isPrivate: isPrivate,
        photoUrl: photoUrl,
    })) {

        const user = await getUserById(userId)

        if (username !== undefined && username !== user.username) {

            if (await doesUsernameAlreadyUsed(username)) {
                throw appErrors.usernameAlreadyUsedError
            }
            await userModel.findByIdAndUpdate(userId, { $set: { username: username } })
        }
        if (fullname !== undefined && fullname !== user.fullname) {
            await userModel.findByIdAndUpdate(userId, { $set: { fullname: fullname } })
        }
        if (bio !== undefined && bio !== user.bio) {
            await userModel.findByIdAndUpdate(userId, { $set: { bio: bio } })
        }
        if (photoUrl !== undefined && photoUrl !== user.photoUrl) {
            await userModel.findByIdAndUpdate(userId, { $set: { photoUrl: photoUrl } })
        }
        if (isPrivate !== undefined && isPrivate !== user.isPrivate) {

            // If changed from false to true
            // Clears the follow requests
            if (!isPrivate) {
                await clearFollowRequests(userId)
            }
            await userModel.findByIdAndUpdate(userId, { $set: { isPrivate: isPrivate } })
        }

    }
    else {
        throw appErrors.invalidUpdateDetailsError
    }
}


async function deleteUser(userId) {
    /*
    Deletes user by id

    param 1: the user id
    */

    if (! await doesUserExists(userId)) {
        throw appErrors.userNotExistsError
    }

    await userModel.findByIdAndDelete(userId)
    await userModel.updateMany({ followers: { $in: [userId] } }, { $pull: { followers: userId } })

    await deletePostsOf(userId)

    await deleteStoriesOf(userId) // TODO: fix that
    await removeViewsOf(userId)

    //TODO: add chats and messages
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

        if (err === appErrors.userNotExistsError) {
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
        const projectQuery = { posts: "$postsCount", followings: "$followingsCount", followers: "$followersCount", username: 1, fullname: 1, bio: 1, photoUrl: 1, isPrivate: 1 }
        if (!hidePrivateFields) {
            projectQuery.stories = "$storiesCount"
        }
        if (!hideOwnerFields) {
            projectQuery.followRequests = "$followRequestsCount"
            projectQuery.followingRequests = "$followingRequestsCount"
        }

        const user = await userModel.aggregate([{ $match: { _id: mongoose.Types.ObjectId(userId) } }, { $project: projectQuery }]).limit(1)

        if (user.length === 0) {
            throw appErrors.userNotExistsError
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
        const projectQuery = { posts: "$postsCount", followings: "$followingsCount", followers: "$followersCount", username: 1, fullname: 1, bio: 1, photoUrl: 1, isPrivate: 1 }
        if (!hidePrivateFields) {
            projectQuery.stories = "$storiesCount"
        }
        if (!hideOwnerFields) {
            projectQuery.followRequests = "$followRequestsCount"
            projectQuery.followingRequests = "$followingRequestsCount"
        }
        const user = await userModel.aggregate([{ $match: { username: username } }, { $project: projectQuery }]).limit(1)

        if (user.length === 0) {
            throw appErrors.userNotExistsError
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
        const projectQuery = { posts: "$postsCount", followings: "$followingsCount", followers: "$followersCount", username: 1, fullname: 1, bio: 1, photoUrl: 1, isPrivate: 1 }
        if (!hidePrivateFields) {
            projectQuery.stories = "$storiesCount"
        }
        if (!hideOwnerFields) {
            projectQuery.followRequests = "$followRequestsCount"
            projectQuery.followingRequests = "$followingRequestsCount"
        }
        const user = await userModel.aggregate([{ $match: { fullname: fullname } }, { $project: projectQuery }]).limit(1)

        if (user.length === 0) {
            throw appErrors.userNotExistsError
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
            throw appErrors.userNotExistsError
        }
        if (! await doesUserExists(secondUserId)) {
            throw appErrors.userToFollowNotExistsError
        }

        if (firstUserId === secondUserId) {
            throw appErrors.cantFollowHimself
        }
        if (await isFollow(firstUserId, secondUserId)) {
            throw appErrors.alreadyFollowedError
        }
        if (await isRequested(firstUserId, secondUserId)) {
            throw appErrors.followRequestAlreadySentError
        }

        const secondUser = await getUserById(secondUserId)

        if (!secondUser.isPrivate) {
            await userModel.findByIdAndUpdate(secondUserId, { $addToSet: { followers: firstUserId }, $inc: { followersCount: 1 } })
            await userModel.findByIdAndUpdate(firstUserId, { $inc: { followingsCount: 1 } })
        }
        else {
            await userModel.findByIdAndUpdate(secondUserId, { $addToSet: { followRequests: firstUserId }, $inc: { followRequestsCount: 1 } })
            await userModel.findByIdAndUpdate(firstUserId, { $inc: { followingRequestsCount: 1 } })
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
            throw appErrors.userNotExistsError
        }
        if (! await doesUserExists(secondUserId)) {
            throw appErrors.userToUnfollowNotExistsError
        }

        if (firstUserId === secondUserId) {
            throw appErrors.cantFollowHimself
        }
        if (!(await isFollow(firstUserId, secondUserId))) {
            throw appErrors.alreadyUnfollowedError
        }

        await userModel.findByIdAndUpdate(secondUserId, { $pull: { followers: firstUserId }, $inc: { followersCount: -1 } })
        await userModel.findByIdAndUpdate(firstUserId, { $inc: { followingsCount: -1 } })
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
            throw appErrors.followRequestNotExistsError
        }

        await userModel.findByIdAndUpdate(secondUserId, { $pull: { followRequests: firstUserId }, $inc: { followRequestsCount: -1, followersCount: 1 }, $addToSet: { followers: firstUserId } })
        await userModel.findByIdAndUpdate(firstUserId, { $inc: { followingsCount: 1, followingRequestsCount: -1 } })
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
            throw appErrors.followRequestNotExistsError
        }

        await userModel.findByIdAndUpdate(secondUserId, { $pull: { followRequests: firstUserId }, $inc: { followRequestsCount: -1 } })
        await userModel.findByIdAndUpdate(firstUserId, { $inc: { followingRequestsCount: -1 } })
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
                await userModel.findByIdAndUpdate(_id.toString(), { $inc: { followingRequestsCount: -1 } })
                await userModel.findByIdAndUpdate(userId, { $pull: { followRequests: _id.toString() }, $inc: { followRequestsCount: -1 } })
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
            throw appErrors.userNotExistsError
        }

        await userModel.updateMany({ followRequests: { $in: [userId] } }, { $pull: { followRequests: userId }, $inc: { followRequestsCount: -1 } })
        await userModel.findByIdAndUpdate(userId, { $inc: { followingRequestsCount: -1 } })
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
            throw appErrors.userNotExistsError
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
            throw appErrors.userNotExistsError
        }

        const projectQuery = { followings: "$followingsCount", followers: "$followersCount", username: 1, fullname: 1, bio: 1, photoUrl: 1, isPrivate: 1 }
        if (!hidePrivateFields) {
            projectQuery.stories = "$storiesCount"
        }
        if (!hideOwnerFields) {
            projectQuery.followRequests = "$followRequestsCount"
            projectQuery.followingRequests = "$followingRequestsCount"
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
            followers.push(await getUserById(id, hidePrivateFields, hideOwnerFields))
        }
        return followers
    }
    catch (err) {
        if (err == "TypeError: Cannot read property 'followers' of null") {
            throw appErrors.userNotExistsError
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
            throw appErrors.userNotExistsError
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

module.exports = { userModel, login, createUser, updateUser, deleteUser, doesUserExists, doesUsernameAlreadyUsed, getUserById, getUserByUsername, getUserByFullname, isFollow, isRequested, followUser, unfollowUser, acceptFollowRequest, deleteFollowRequest, clearFollowRequests, clearFollowingRequests, getFollowRequests, getFollowingRequests, getFollowers, getFollowings }