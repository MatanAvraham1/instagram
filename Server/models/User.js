const Joi = require('joi')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userErrors = {
    userNotExistsError: "userNotExists!",
    missingFullnameParamError: "the fullname param can't be empty!",
    alreadyUnfollowedError: "the first user doesn't follow the second user!",
    alreadyFollowedError: "the first user already followed the seconds user!",
    followRequestNotExistsError: "the follow request doesn't exists!",
    followingRequestNotExistsError: "the following request doesn't exists!",
    followRequestAlreadySentError: "follow request has been already sent!",
    usernameAlreadyUsedError: "the username is already used!",
    invalidRegisterDetailsError: "invalid register details!",
    wrongLoginDetailsError = "wrong login deatils!"
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
    stories: {
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

function isRegisterValid(data) {
    const scheme = Joi.object({
        username: Joi.string().required(),
        password: Joi.string().required(),
    })
    const value = scheme.validate(data)

    if (value.error == null) {
        return true
    }

    return false
}
const isLoginValid = isRegisterValid

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
        if (err = userErrors.userNotExistsError) {
            return false
        }
    }
}


async function getUserById(userId) {
    /*
    Returns user by id

    param 1: user id
    */

    try {
        const user = await userModel.findById(userId)
        if (user == null) {
            throw userErrors.userNotExistsError
        }
        return user
    }
    catch (err) {
        throw userErrors.userNotExistsError
    }


}

async function getUserByUsername(username) {
    try {
        const user = await userModel.findOne({ username: username })
        if (user == null) {
            throw userErrors.userNotExistsError
        }
        return user
    }
    catch (err) {
        throw userErrors.userNotExistsError
    }
}

async function getUserByFullname(fullname) {

    if (fullname == "") {
        throw userErrors.missingFullnameParam
    }

    try {
        const user = await userModel.findOne({ fullname: fullname })
        if (user == null) {
            throw userErrors.userNotExistsError
        }
        return user
    }
    catch (err) {
        throw userErrors.userNotExistsError
    }
}

async function deleteUser(userId) {
    /*
    Deletes user by his id

    param 1: the user id
    */

    try {
        await userModel.deleteOne({ _id: userId })
    }
    catch (err) {
        throw userErrors.userNotExistsError
    }
}

async function clearFollowRequests(userId) {
    /*
    Clears follow requests of the user [userId]
    
    param 1: id of the user
    */

    try {
        var user = await getUserById(userId)
        user.followRequests.forEach(async (request) => {
            var _user = await getUserById(request)
            const index = _user.followingRequests.findIndex((request) => request == userId)
            if (index == -1) {
                return
            }

            _user.followingRequests.splice(index, 1)
            await updateUser(request, _user)
        });

        user.followRequests = []
        await updateUser(userId, user)
    }
    catch (err) {
        if (err == userErrors.userNotExistsError) {
            throw userErrors.userNotExistsError
        }

        console.error(err)
    }
}

async function updateUser(userId, userObject) {
    /*
    Updates user

    param 1: the id of the user
    param 2: the updated user object
    */

    try {
        await userModel.updateOne({ _id: userId }, userObject)
    }
    catch (err) {
        throw userErrors.userNotExistsError
    }
}


async function followUser(firstUserId, secondUserId) {
    /*
    Makes the user - [firstUserId] to follow the user - [secondUserId]
 
    param 1: the first user id
    param 2: the second user id
    */

    var firstUser = await getUserById(firstUserId)
    var secondUser = await getUserById(secondUserId)

    if (secondUser.followers.includes(firstUserId)) {
        throw userErrors.alreadyFollowedError
    }
    if (secondUser.followRequests.includes(firstUserId)) {
        throw userErrors.followRequestAlreadySentError
    }

    if (secondUser.isPrivate) {
        firstUser.followingRequests.push(secondUserId)
        secondUser.followRequests.push(firstUser)
    }
    else {
        secondUser.followers.push(firstUserId)
        firstUser.following.push(secondUserId)
    }

    await updateUser(firstUserId, firstUser)
    await updateUser(secondUserId, secondUser)
}

async function unfollowUser(firstUserId, secondUserId) {
    /*
    Makes the user - [firstUserId] to unfollow the user - [secondUserId]
 
    param 1: the first user id
    param 2: the second user id
    */

    var firstUser = await getUserById(firstUserId)
    var secondUser = await getUserById(secondUserId)

    const index = secondUser.followers.findIndex((follower) => follower == firstUserId)
    if (index == -1) {
        throw userErrors.alreadyUnfollowedError
    }
    secondUser.followers.splice(index, 1)

    const _index = firstUser.following.findIndex((following) => following == secondUserId)
    if (_index == -1) {
        throw userErrors.alreadyUnfollowedError
    }
    secondUser.following.splice(index, 1)

    await updateUser(firstUserId, firstUser)
    await updateUser(secondUserId, secondUser)
}

async function acceptFollowRequest(userId, userIdToAccept) {
    /*
    Accepts the follow request of the user - [userIdToAccept] on the account of the user - [userId]

    param 1: the id of the user account
    param 2: the id of the user to accept
    */

    var user = await getUserById(userId)
    var userToAccpet = await getUserById(userIdToAccept)

    // Deletes the follow request
    const index = user.followRequests.findIndex((request) => request == userIdToAccept)
    if (index == -1) {
        throw userErrors.followRequestNotExistsError
    }
    user.followRequests.splice(index, 1)

    // Adds to the followers
    if (user.followers.includes(userId)) {
        throw userErrors.alreadyFollowedError
    }
    user.followers.push(userId)

    // Deletes the following request
    const _index = userToAccpet.followingRequests.findIndex((request) => request == userId)
    if (_index == -1) {
        throw userErrors.followingRequestNotExistsError
    }
    userToAccpet.followingRequests.splice(_index, 1)

    // Adds to the following
    if (userToAccpet.following.includes(userId)) {
        throw userErrors.alreadyFollowedError
    }
    userToAccpet.following.push(userId)

    // Saves changes
    await updateUser(userId, user)
    await updateUser(userIdToAccept, userToAccpet)
}

async function deleteFollowRequest(userId, userIdToDelete) {
    /*
    Deletes the follow request of the user - [userIdToAccept] on the account of the user - [userId]

    param 1: the id of the user account
    param 2: the id of the user to delete
    */

    var user = await getUserById(userId)
    var userToDelete = await getUserById(userIdToDelete)

    // Deletes the follow request
    const index = user.followRequests.findIndex((request) => request == userIdToDelete)
    if (index == -1) {
        throw userErrors.followRequestNotExistsError
    }
    user.followRequests.splice(index, 1)

    // Deletes the following request
    const _index = userToDelete.followingRequests.findIndex((request) => request == userId)
    if (_index == -1) {
        throw userErrors.followingRequestNotExistsError
    }
    userToDelete.followingRequests.splice(_index, 1)

    // Saves changes
    await updateUser(userId, user)
    await updateUser(userIdToDelete, userToDelete)
}

async function deleteFollowingRequest(userId, requestToDeleteId) {
    /*
    Deletes following request of the user - [requestToDelete] from the account of the user - [userId]

    param 1: the id of the user account
    param 2: the id of the request(user)
    */

    var user = await getUserById(userId)
    var requestToDelete = await getUserById(requestToDeleteId)

    // Deletes the following request
    const index = user.followingRequests.findIndex((request) => request == requestToDeleteId)
    if (index == -1) {
        throw userErrors.followingRequestNotExistsError
    }
    user.followingRequests.splice(index, 1)

    // Deletes the follow request
    const _index = requestToDelete.followRequests.findIndex((request) => request == userId)
    if (_index == -1) {
        throw userErrors.followRequestNotExistsError
    }
    requestToDelete.followRequests.splice(_index, 1)

    // Saves changes
    await updateUser(userId, user)
    await updateUser(requestToDeleteId, requestToDelete)
}

async function createUser(data) {
    /*
    Creates a new user (register...)
    Returns the created user id

    param 1: the user object
    */

    if (isRegisterValid(data)) {
        if (doesUsernameAlreadyUsed(data.username)) {
            throw userErrors.usernameAlreadyUsedError
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = new userModel({ username: data.username, password: hashedPassword })
        const { _id } = await user.save()

        return _id
    }
    else {
        throw userErrors.invalidRegisterDetailsError
    }
}

async function login(data) {
    /*
    Logins 
    Returns the user id

    param 1: the user object
    */

    if (isLoginValid(data)) {
        const user

        try {
            user = await getUserByUsername(data.username)
        }
        catch (err) {
            if (err == userErrors.userNotExistsError) {
                throw userErrors.wrongLoginDetailsError
            }
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

module.exports = { login, deleteFollowingRequest, followUser, unfollowUser, acceptFollowRequest, deleteFollowRequest, updateUser, userModel, clearFollowRequests, userErrors, createUser, doesUsernameAlreadyUsed, getUserById, getUserByUsername, getUserByFullname, deleteUser }