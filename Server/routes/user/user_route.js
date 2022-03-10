const express = require('express')
const userRouter = express.Router()

const mongoose = require('mongoose')
const { userErrors, getUserById, getUserByUsername, getUserByFullname, deleteUser, followUser, unfollowUser, acceptFollowRequest, deleteFollowRequest, getFollowers, isFollow, isRequested, getFollowings, updateUser } = require('../../models/user_model')
const { authenticateToken } = require('./auth_route')
const { doesRequesterOwn, doesHasPermission } = require('../../helpers/privacyHelper')
const { getLast24HoursStories } = require('../../models/story_model')
const { errorCodes } = require('../../errorCodes')


userRouter.get('/:userToSearch', authenticateToken, async (req, res) => {
    /*
    Returns user by id\username\fullname

    req.query.searchBy can be 
    - byUsername
    - byId
    - byFullname

    to define the search by action

    If req.query.searchBy is different from these values (or ungiven), 400 will be returned
    */

    // TODO: Checks if req.query.searchBy string\idObject\etc..

    try {
        let user

        if (req.query.searchBy === 'byUsername') {
            user = await getUserByUsername(req.params.userToSearch, false, false)
        }
        else if (req.query.searchBy === 'byId') {
            user = await getUserById(req.params.userToSearch, false, false)
        }
        else if (req.query.searchBy === 'byFullname') {
            user = await getUserById(req.params.userToSearch, false, false)
        }
        else {
            return res.sendStatus(400)
        }

        // If the requester doesn't own the user
        if (req.userId !== user._id.toString()) {
            delete user.followRequests
            delete user.followingRequests
        }
        // If the requester doesn't follow the user
        if (user.isPrivate && !await isFollow(req.userId, req.params.userId)) {
            delete user.stories
        }

        return res.status(200).json(user)
    }
    catch (err) {

        if (err === userErrors.userNotExistsError) {
            return res.sendStatus(404)
        }

        console.error(err)
        return res.sendStatus(500)
    }
})

userRouter.get('/:userId/followers', authenticateToken, doesHasPermission, async (req, res) => {
    /*
    Returns the users which follow req.params.userId

    The function return the actual users objects

    req.query.startFrom tells the function from which index of the followers list start returning
    If req.query.startFrom isn't an integer or ungiven, 400 will be returned
    */

    const howMuchUsersToReturn = 30

    try {
        const startFromUserIndex = parseInt(req.query.startFrom)
        if (startFromUserIndex === undefined || !Number.isInteger(startFromUserIndex)) {
            return res.sendStatus(400)
        }

        const response = []

        const followers = await getFollowers(req.params.userId, startFromUserIndex, howMuchUsersToReturn, false, true)
        for (const follower of followers) {

            const isFollowedByMe = await isFollow(req.userId, follower._id.toString())
            const isFollowMe = await isFollow(follower._id.toString(), req.userId)
            const isRequestedByMe = await isRequested(req.userId, follower._id.toString())
            const isRequestMe = await isRequested(follower._id.toString(), req.userId)

            if (follower.isPrivate && !isFollowedByMe) {
                delete follower.stories
            }

            response.push({
                user: follower,
                isFollowedByMe: isFollowedByMe,
                isFollowMe: isFollowMe,
                isRequestedByMe: isRequestedByMe,
                isRequestMe: isRequestMe,
            })
        }


        return res.status(200).json(response)
    }
    catch (err) {
        if (err === userErrors.userNotExistsError) {
            return res.sendStatus(404)
        }

        console.error(err)
        return res.sendStatus(500)
    }
})

userRouter.get('/:userId/followings', authenticateToken, doesHasPermission, async (req, res) => {
    /*
    Returns the users which followed by req.params.userId

    The function return the actual users objects

    req.query.startFrom tells the function from which index of the followings list start returning
    If req.query.startFrom isn't an integer or ungiven, 400 will be returned
    */


    const howMuchUsersToReturn = 30

    try {
        const startFromUserIndex = parseInt(req.query.startFrom)
        if (startFromUserIndex === undefined || !Number.isInteger(startFromUserIndex)) {
            return res.sendStatus(400)
        }


        const response = []

        const followings = await getFollowings(req.params.userId, startFromUserIndex, howMuchUsersToReturn, false, true)
        for (const following of followings) {
            response.push({
                user: following,
                isFollowMe: await isFollow(following._id.toString(), req.userId),
                isRequestMe: await isRequested(following._id.toString(), req.userId),
            })
        }


        return res.status(200).json(response)
    }
    catch (err) {
        if (err === userErrors.userNotExistsError) {
            return res.sendStatus(404)
        }

        console.error(err)
        return res.sendStatus(500)
    }
})


userRouter.delete('/:userId', authenticateToken, doesRequesterOwn, async (req, res) => {
    /*
    Deletes the user - req.params.userId
    */

    try {
        await deleteUser(req.params.userId)
        return res.sendStatus(204)
    }
    catch (err) {
        if (err === userErrors.userNotExistsError) {
            return res.sendStatus(404)
        }

        console.error(err)
        return res.sendStatus(500)
    }
})

userRouter.patch('/:userId', authenticateToken, doesRequesterOwn, async (req, res) => {
    /*
    Updates the user fields (like username, fullname etc...) of req.params.userId
    */


    try {
        await updateUser(req.params.userId, req.body)
        return res.sendStatus(204)
    }
    catch (err) {

        if (err === userErrors.userNotExistsError) {
            return res.sendStatus(404)
        }

        if (err === userErrors.invalidUpdateDetailsError) {
            return res.status(400).json({ errorCode: errorCodes.invalidUpdateValues })
        }

        if (err === userErrors.usernameAlreadyUsedError) {
            return res.status(400).json({ errorCode: errorCodes.usernameAlreadyUsed })
        }

        console.error(err)
        return res.sendStatus(500)
    }
})


userRouter.post('/:userId/followers', authenticateToken, async (req, res) => {
    /*
    Makes req.userId follows req.params.userId
    */


    try {
        // If the requester is the same user as the user to follow
        if (req.userId === req.params.userId) {
            return res.status(400).json({ 'errorCode': errorCodes.cantFollowHimself })
        }

        await followUser(req.userId, req.params.userId)
        return res.sendStatus(201)
    }
    catch (err) {

        if (err === userErrors.userNotExistsError) {
            return res.sendStatus(500) // Becuase this is the requester, and the requester must exists
        }
        if (err === userErrors.userToFollowNotExistsError) {
            return res.status(404)
        }
        if (err === userErrors.alreadyFollowedError) {
            return res.status(400).json({ errorCode: errorCodes.alreadyFollowed })
        }
        if (err === userErrors.followRequestAlreadySent) {
            return res.status(400).json({ errorCode: errorCodes.followRequestAlreadySent })
        }

        console.error(err)
        return res.sendStatus(500)
    }
})

userRouter.delete('/:userId/followers', authenticateToken, async (req, res) => {
    /*
    Makes req.userId unfollow req.params.userId
    */

    try {
        if (req.userId === req.params.userId) {
            return res.status(400).json({ 'errorCode': errorCodes.cantFollowHimself })
        }

        await unfollowUser(req.userId, req.params.userId)

        res.sendStatus(204)
    }
    catch (err) {

        if (err === userErrors.userNotExistsError) {
            return res.sendStatus(500) // Becuase this is the requester, and the requester must exists
        }
        if (err === userErrors.userToUnfollowNotExistsError) {
            return res.sendStatus(404)
        }
        if (err === userErrors.alreadyUnfollowedError) {
            return res.status(400).json({ errorCode: errorCodes.alreadyUnfollowed })
        }

        console.error(err)
        return res.sendStatus(500)
    }
})


userRouter.put('/:userId/followRequests', authenticateToken, doesRequesterOwn, async (req, res) => {
    /*
    Accepts follow request which sent to req.params.userId

    req.query.userToAccept tells the function the id of the user who sent the follow request 
    If req.query.userToAccept ungiven, 400 will be returned
    */

    try {

        const idOfUserToAccept = req.query.userToAccept
        if (idOfUserToAccept === undefined || !mongoose.Types.ObjectId.isValid(idOfUserToAccept)) {
            return res.sendStatus(400)
        }

        await acceptFollowRequest(idOfUserToAccept, req.params.userId)
        return res.sendStatus(201)
    }
    catch (err) {
        if (err === userErrors.followRequestNotExists) {
            return res.sendStatus(404)
        }

        console.error(err)
        return res.sendStatus(500)
    }
})

userRouter.delete('/:userId/followRequests', authenticateToken, doesRequesterOwn, async (req, res) => {
    /*
    Deletes follow request which sent to req.params.userId

    req.query.userToDelete tells the function the id of the user who sent the follow request 
    If req.query.userToDelete ungiven, 400 will be returned
    */

    try {

        const idOfUserToDelete = req.query.userToDelete
        if (idOfUserToDelete === undefined || !mongoose.Types.ObjectId.isValid(idOfUserToAccept)) {
            return res.sendStatus(400)
        }

        await deleteFollowRequest(idOfUserToDelete, req.params.userId)
        return res.sendStatus(200)
    }
    catch (err) {
        if (err === userErrors.followRequestNotExists) {
            return res.sendStatus(404)
        }

        console.error(err)
        return res.sendStatus(500)
    }
})


userRouter.delete('/:userId/followingRequests', authenticateToken, doesRequesterOwn, async (req, res) => {
    /*
    Deletes follow request which sent by req.params.userId

    req.query.userToDelete tells the function the id of the user who the follow request sent to
    If req.query.userToDelete ungiven, 400 will be returned
    */


    try {

        const idOfUserToDelete = req.query.userToDelete
        if (idOfUserToDelete === undefined || !mongoose.Types.ObjectId.isValid(idOfUserToAccept)) {
            return res.sendStatus(400)
        }

        await deleteFollowRequest(req.params.userId, idOfUserToDelete)

        return res.sendStatus(200)
    }
    catch (err) {
        if (err === userErrors.followginRequestNotExistsError) {
            return res.sendStatus(404)
        }

        console.log(err)
        return res.sendStatus(500)
    }
})


// // Gets chats of user
// chatRouter.get('/:userId/chats/', authenticateToken, doesHasPermission, async (req, res) => {
//     try {
//         const startFromChatIndex = req.query.startFrom
//         const endOnChatIndex = startFromChatIndex + 15
//         if (startFromCommentIndex === undefined) {
//             return res.sendStatus(400)
//         }

//         const response = []
//         const chats = await getChats(req.params.userId)

//         for (const chat of chats.slice(startFromChatIndex, endOnChatIndex > chats.length ? chats.length : endOnChatIndex)) {


//             members = []
//             for (const memberId of chats.members) {
//                 const member = await getUserById(memberId)
//                 members.push({
//                     username: member.username,
//                     fullname: member.fullname,
//                     bio: member.bio,
//                     photoUrl: member.photoUrl,
//                     isPrivate: member.isPrivate,
//                     followers: member.followers.length,
//                     followings: member.followings.length,
//                     posts: member.posts.length,
//                     stories: (await getLast24HoursStories(member._id)).length,
//                     isFollowMe: member.followings.includes(req.userId),
//                     isFollowedByMe: member.followers.includes(req.userId),
//                     isRequestedByMe: member.followRequests.includes(req.userId),
//                     id: member._id
//                 })

//             }


//             const _chat =
//             {
//                 members: members,
//                 lastMessage: chat.messages[-1],
//                 id: chat._id,
//             }

//             response.push(_chat)
//         }

//         return res.status(200).json(response)
//     }
//     catch (err) {
//         if (err === userErrors.userNotExistsError) {
//             return res.sendStatus(404)
//         }
//         if (err === chatErrors.chatNotExistsError) {
//             return res.sendStatus(404)
//         }

//         console.log(err)
//         res.sendStatus(500)
//     }
// })

const { postsRouter } = require('../post/post_route')
userRouter.use('/:userId/posts/', postsRouter)

const { storiesRouter } = require('../story/story_route')
userRouter.use('/:userId/stories/', storiesRouter)

module.exports = { userRouter }