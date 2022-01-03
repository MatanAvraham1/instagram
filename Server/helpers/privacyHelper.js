const { userModel, getUserById } = require("../models/User");
const { errorCodes } = require('../errorCodes')

async function isFollowing(firstUserId, secondUserId) {
    /*
    Checks if the first user follows after the second
    */

    const user = await userModel.findOne({ _id: secondUserId })
    if (user == null) {
        return false
    }

    return user.followers.includes(firstUserId)
}

function doesRequesterOwn(req, res, next) {
    /*
    Checks if the requester is the owner of the user object 

    */
    if (req.userId != req.params.userId) {
        return res.sendStatus(403)
    }

    next()
}

async function doesHasPermission(req, res, next) {
    /*
    Checks if the requester has the permission to access some user data
    */

    const user = await getUserById(req.params.userId)

    if (user == null) {
        return res.status(400).json({ 'errorCode': errorCodes.userNotExist })
    }
    if (user.isPrivate == true) {
        if (req.userId != req.params.userId) {
            if (!await isFollowing(req.userId, req.params.userId)) {
                return res.sendStatus(403)
            }
        }
    }

    next()
}



module.exports = { doesRequesterOwn, doesHasPermission }