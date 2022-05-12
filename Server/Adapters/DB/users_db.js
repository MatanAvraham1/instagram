const { userModel } = require("./schemes/user_scheme")
const { Password } = require("../../CustomHelpers/Password_helper")
const { default: mongoose } = require("mongoose")
const { AppError } = require("../../app_error")

class UsersDB {
    static async checkLogin(username, password) {
        // Checks login details

        const user = await userModel.findOne({ username: username }, { password: 1 })
        if (user == null) {
            return null
        }

        if (await Password.checkPassword(user.password, password)) {
            return user._id.toString()
        }
        else {
            return null
        }
    }

    static async insert(user) {
        // Enters user to db

        const userObject = new userModel({
            _id: user.id,
            username: user.username,
            password: user.password,

            fullname: user.fullname,
            bio: user.bio,

            isPrivate: user.isPrivate,

            followers: [],
            followRequests: [],

            followersCount: 0,
            followingsCount: 0,
            postsCount: 0,

            storiesCount: 0,

            followRequestsCount: 0,
            followingRequestsCount: 0,

            createdAt: user.createdAt
        })
        await userObject.save()
    }


    static async deleteById(userId) {
        // Deletes user by id

        // TODO: unfollow everyone, delete posts, delete stories, delete comments

        await userModel.findByIdAndDelete(userId)
    }


    static async findById(userId) {
        // returns user by id

        const user = await userModel.findById(userId, { followers: 0, followRequests: 0 })

        if (user == null) {
            throw new AppError("User doesn't exist.")
        }

        return userObjectFromDbObject(user)
    }

    static async findByUsername(username) {
        // Returns user by username

        const user = await userModel.findOne({ username: username }, { followers: 0, followRequests: 0 })

        return userObjectFromDbObject(user)
    }

    static async isUsernameUsed(username) {
        const user = await userModel.findOne({ username: username }, { followers: 0, followRequests: 0 })

        return user == null
    }

    static async followUser(firstUserId, secondUserId) {
        // makes first user follow second user

        const user = await this.findById(secondUserId)
        if (user.isPrivate) {
            await this._sendFollowRequest(firstUserId, secondUserId)
            return
        }

        await userModel.findByIdAndUpdate(firstUserId, { $inc: { followingsCount: 1 } })
        await userModel.findByIdAndUpdate(secondUserId, { $inc: { followersCount: 1 }, $addToSet: { followers: firstUserId } })
    }

    static async unfollowUser(firstUserId, secondUserId) {
        // makes first user unfollow second user

        await userModel.findByIdAndUpdate(firstUserId, { $inc: { followingsCount: -1 } })
        await userModel.findByIdAndUpdate(secondUserId, { $inc: { followersCount: -1 }, $pull: { followers: firstUserId } })
    }


    static async _sendFollowRequest(firstUserId, secondUserId) {
        // Makes first user send follow request to the second

        await userModel.findByIdAndUpdate(firstUserId, { $inc: { followingRequestsCount: 1 } })
        await userModel.findByIdAndUpdate(secondUserId, { $inc: { followRequestsCount: 1 }, $addToSet: { followRequests: firstUserId } })
    }

    static async acceptFollowRequest(firstUserId, secondUserId) {
        // accepts follow request which first user sent to second

        await userModel.findByIdAndUpdate(firstUserId, { $inc: { followingRequestsCount: -1, followingsCount: 1 } })
        await userModel.findByIdAndUpdate(secondUserId, { $inc: { followRequestsCount: -1, followersCount: 1 }, $pull: { followRequests: firstUserId }, $addToSet: { followers: firstUserId } })
    }

    static async declineFollowRequest(firstUserId, secondUserId) {
        // decline follow request which first user sent to second

        await userModel.findByIdAndUpdate(firstUserId, { $inc: { followingRequestsCount: -1 } })
        await userModel.findByIdAndUpdate(secondUserId, { $inc: { followRequestsCount: -1 }, $pull: { followRequests: firstUserId } })
    }

    static async isFollow(firstUserId, secondUserId) {
        // Returns if the first user follow the second user

        const user = await userModel.findOne({ _id: mongoose.Types.ObjectId(secondUserId), followers: { $in: [firstUserId] } }, { followers: 0, followRequests: 0 })
        return user != null
    }

    static async getFollowers(userId, startFromIndex, quantity) {
        /*
        Returns followers of user by id

        param 1: user id
        param 2: from which follower to start
        param 3: how much to return
        */

        const followers = []

        const followersId = (await userModel.findById(userId, {
            _id: 0,
            username: 0,
            password: 0,
            fullname: 0,
            bio: 0,
            isPrivate: 0,
            followRequests: 0,
            followersCount: 0,
            followingsCount: 0,
            postsCount: 0,
            storiesCount: 0,
            createdAt: 0,
            __v: 0,
            followers: { $slice: [startFromIndex, startFromIndex + quantity] }
        }, { followRequests: 0 })).followers


        for (const id of followersId) {

            const user = await this.findById(userId)
            followers.push(Object.freeze({
                id: user.id,
                username: user.username,
                fullname: user.fullname,
                bio: user.bio,
                followers: user.followers,
                followings: user.followings,
                posts: user.posts
            }))
        }
        return followers
    }

    static async updateFields(userId, newUsername = undefined, newFullname = undefined, newBio = undefined, newIsPrivate = undefined) {

        const changes = {}


        const user = await this.findById(userId)
        if (newUsername != user.username && newUsername != undefined) {
            changes.username = newUsername
        }
        if (newFullname != user.fullname && newFullname != undefined) {
            changes.fullname = newFullname
        }
        if (newBio != user.bio && newBio != undefined) {
            changes.bio = newBio
        }
        if (newIsPrivate != user.isPrivate && newIsPrivate != undefined) {
            changes.isPrivate = newIsPrivate
        }

        await userModel.findByIdAndUpdate(userId, changes)
    }

    static async doesUserExist(userId) {
        const user = await userModel.findById(userId, { followers: 0, followRequests: 0 })

        return user == null
    }
}

function userObjectFromDbObject(dbObject) {
    // Returns user object from db user object

    return Object.freeze({
        id: dbObject._id.toString(),

        username: dbObject.username,
        password: dbObject.password,

        bio: dbObject.bio,
        fullname: dbObject.fullname,
        isPrivate: dbObject.isPrivate,

        followers: dbObject.followersCount,
        followings: dbObject.followingsCount,
        posts: dbObject.postsCount,

        stories: dbObject.storiesCount,

        followRequests: dbObject.followRequestsCount,
        followingRequests: dbObject.followingRequestsCount,

        createdAt: dbObject.createdAt,
    })
}

module.exports = { UsersDB }