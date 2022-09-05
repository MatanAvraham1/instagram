const { userModel } = require("./schemes/user_scheme")
const { Password } = require("../../CustomHelpers/Password_helper")
const { default: mongoose } = require("mongoose")
const { AppError, AppErrorMessages } = require("../../app_error")
const { PostsDB } = require("./posts_db")
const { StoriesDB } = require("./stories_db")
const { CommentsDB } = require("./comments_db")
const fs = require('fs');
const path = require("path")
const { PROFILE_PHOTOS_FOLDER } = require("../../Constants")
const e = require("express")

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
            profilePhoto: user.profilePhoto,

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


    static async _deleteProfilePhoto(fileName) {
        return await Promise.resolve(new Promise((res, rej) => {
            const filePath = path.join(PROFILE_PHOTOS_FOLDER, fileName)
            fs.unlink(filePath, err => {
                if (err) {
                    rej(`${filePath} profile photo can't be deleted!`);
                }
                else {
                    res();
                }

            });
        }))
    }

    static async deleteById(userId) {
        // Deletes user by id

        // Deletes user profile photo file
        const user = await this.findById(userId)

        if (user.profilePhoto != null) {
            await this._deleteProfilePhoto(user.profilePhoto)
        }

        // TODO: unfollow everyone, delete posts, delete stories, delete comments
        await userModel.updateMany({ followers: { $in: [userId] } }, { $inc: { followersCount: -1 }, $pull: { followers: userId } })
        await userModel.updateMany({ followRequests: { $in: [userId] } }, { $inc: { followRequestsCount: -1 }, $pull: { followRequests: userId } })

        await StoriesDB.deleteByPublisherId(userId)
        await CommentsDB.deleteByPublisherId(userId)
        await PostsDB.deleteByPublisherId(userId)
        await userModel.findByIdAndDelete(userId)
    }


    static async findById(userId) {
        // returns user by id

        const user = await userModel.findById(userId, { followers: 0, followRequests: 0 })

        if (user == null) {
            throw new AppError(AppErrorMessages.userDoesNotExist)
        }

        return userObjectFromDbObject(user)
    }

    static async findByUsername(username) {
        // Returns user by username

        const user = await userModel.findOne({ username: username }, { followers: 0, followRequests: 0 })

        return userObjectFromDbObject(user)
    }

    static async findByFullname(fullname) {
        // Returns user by fullname

        const user = await userModel.findOne({ fullname: fullname }, { followers: 0, followRequests: 0 })

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

    static async isRequest(firstUserId, secondUserId) {
        // Returns if the first user requested the second user

        const user = await userModel.findOne({ _id: mongoose.Types.ObjectId(secondUserId), followRequests: { $in: [firstUserId] } }, { followers: 0, followRequests: 0 })
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
            profilePhoto: 0,
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

            const user = await this.findById(id)
            followers.push(user)
        }
        return followers
    }

    static async getFollowings(userId, startFromIndex, quantity) {
        /*
        Returns followings of user by id
     
        param 1: user id
        param 2: from which follower to start
        param 3: how much to return
        */

        const followings = [];

        const followingsObjects = await userModel.aggregate([{ $match: { followers: { $in: [userId] } } }, {
            $project: {
                id: 1,
                username: 1,
                bio: 1,
                fullname: 1,
                profilePhoto: 1,
                isPrivate: 1,

                followersCount: 1,
                followingsCount: 1,
                postsCount: 1,

                storiesCount: 1,

                followRequestsCount: 1,
                followingRequestsCount: 1,

                createdAt: 1,
            }
        }]).skip(startFromIndex).limit(quantity)

        for (const userObject of followingsObjects) {

            followings.push(userObjectFromDbObject(userObject))
        }

        return followings
    }

    static async updateFields(userId, newProfilePhoto = undefined, newUsername = undefined, newFullname = undefined, newBio = undefined, newIsPrivate = undefined) {

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
        if (newProfilePhoto != user.profilePhoto && newProfilePhoto != undefined) {
            changes.profilePhoto = newProfilePhoto

            if (user.profilePhoto != null) {
                await this._deleteProfilePhoto(user.profilePhoto)
            }
        }

        await userModel.findByIdAndUpdate(userId, changes)
    }

    static async doesUserExist({ userId = undefined, username = undefined, fullname = undefined }) {

        let user

        if (userId != undefined) {
            user = await userModel.findById(userId, { followers: 0, followRequests: 0 })

        }

        if (username != undefined) {
            user = await userModel.findOne({ username: username }, { followers: 0, followRequests: 0 })
        }

        if (fullname != undefined) {
            user = await userModel.findOne({ fullname: fullname }, { followers: 0, followRequests: 0 })
        }

        return user != null
    }
}

function userObjectFromDbObject(dbObject) {
    // Returns user object from db user object

    return Object.freeze({
        id: dbObject._id.toString(),

        username: dbObject.username,
        // password: dbObject.password,

        bio: dbObject.bio,
        fullname: dbObject.fullname,
        isPrivate: dbObject.isPrivate,
        profilePhoto: dbObject.profilePhoto,

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