const express = require('express')
const multer = require('multer')
const mime = require('mime');
const path = require('path')
const { authenticateToken, doesOwnUserObject } = require('../middleware')
const { getUserById, deleteUserById, updateFields, getUserByUsername, getUserByFullname, getFollowers, getFollowings, isFollow, isRequest } = require('../../../Use_cases/user/index')
const { AppError, AppErrorMessages } = require('../../../app_error');
const { AuthenticationService } = require('../../../CustomHelpers/Authantication');
const { getLastDayStoriesCount } = require('../../../Use_cases/story');
const { PROFILE_PHOTOS_FOLDER } = require('../../../Constants');
const { UsersDB } = require('../../DB/users_db');
const userRouter = express.Router()


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, PROFILE_PHOTOS_FOLDER);
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + '.' + mime.getExtension(file.mimetype));
    }
})

const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter,
})



// Gets user
userRouter.get('/:userToSearch', authenticateToken, async (req, res) => {
    let user
    const searchBy = req.query.searchBy

    try {
        if (searchBy == "Id") {
            user = await getUserById({ userId: req.params.userToSearch })
        }
        else if (searchBy == "Fullname") {
            user = await getUserByFullname({ fullname: req.params.userToSearch })
        }
        else if (searchBy == "Username") {
            user = await getUserByUsername({ username: req.params.userToSearch })
        }
        else {
            return res.sendStatus(400)
        }

        return res.status(200).json(await returnUserResponseObject(req.userId, user))
    }
    catch (error) {
        if (error instanceof AppError) {

            if (error.message == AppErrorMessages.userDoesNotExist) {
                return res.sendStatus(404)
            }

            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    }
})

// Deletes user
userRouter.delete('/', authenticateToken, (req, res) => {
    const userId = req.userId

    deleteUserById({ userId: userId }).then(() => {
        res.sendStatus(200)
    }).catch((error) => {
        if (error instanceof AppError) {

            if (error.message == AppErrorMessages.userDoesNotExist) {
                return res.sendStatus(404)
            }

            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})

// Update fields
userRouter.patch('/', authenticateToken, upload.single('profilePhoto'), (req, res) => {

    const userId = req.userId
    const newFields = req.body

    const newUsername = newFields.username
    const newFullname = newFields.fullname
    const newBio = newFields.bio
    const newIsPrivate = newFields.isPrivate
    const newProfilePhoto = req.file == null ? undefined : req.file.filename

    if (newUsername == undefined && newFullname == undefined && newBio == undefined && newIsPrivate == undefined && newProfilePhoto == undefined) {
        return res.sendStatus(400)
    }

    updateFields({ newProfilePhoto: newProfilePhoto, userId: userId, newUsername: newUsername, newFullname: newFullname, newBio: newBio, newIsPrivate: newIsPrivate }).then(() => {
        res.sendStatus(200)
    }).catch(async (error) => {

        await UsersDB._deleteProfilePhoto(req.file.filename)

        if (error instanceof AppError) {
            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })

})

// Gets followers of user
userRouter.get('/:userId/followers', authenticateToken, async (req, res) => {

    const startIndex = parseInt(req.query.startIndex)

    if (!Number.isInteger(startIndex)) {
        return res.status(400).json(AppErrorMessages.invalidStartIndex)
    }

    const firstUserId = req.userId
    const secondUserId = req.params.userId
    AuthenticationService.hasPermission(firstUserId, secondUserId).then((_hasPermission) => {
        if (!_hasPermission) {
            return res.sendStatus(403)
        }

        getFollowers({ userId: secondUserId, startIndex: startIndex }).then(async (followers) => {

            const response = [];
            for (const user of followers) {
                response.push(await returnUserResponseObject(req.userId, user))
            }

            return res.status(200).json(response)
        }).catch((error) => {
            if (error instanceof AppError) {

                if (error.message == AppErrorMessages.userDoesNotExist) {
                    return res.sendStatus(404)
                }

                return res.status(400).json(error.message)
            }

            res.sendStatus(500)
            console.error(error)
        })
    }).catch((error) => {
        if (error instanceof AppError) {

            if (error.message == AppErrorMessages.userDoesNotExist) {
                return res.sendStatus(404)
            }

            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})

// Gets followings of user
userRouter.get('/:userId/followings', authenticateToken, async (req, res) => {

    const startIndex = parseInt(req.query.startIndex)

    if (!Number.isInteger(startIndex)) {
        return res.status(400).json(AppErrorMessages.invalidStartIndex)
    }

    const firstUserId = req.userId
    const secondUserId = req.params.userId
    AuthenticationService.hasPermission(firstUserId, secondUserId).then((_hasPermission) => {
        if (!_hasPermission) {
            return res.sendStatus(403)
        }

        getFollowings({ userId: secondUserId, startIndex: startIndex }).then(async (followings) => {

            const response = [];
            for (const user of followings) {
                response.push(await returnUserResponseObject(req.userId, user))
            }

            return res.status(200).json(response)
        }).catch((error) => {
            if (error instanceof AppError) {

                if (error.message == AppErrorMessages.userDoesNotExist) {
                    return res.sendStatus(404)
                }

                return res.status(400).json(error.message)
            }

            res.sendStatus(500)
            console.error(error)
        })
    }).catch((error) => {
        if (error instanceof AppError) {

            if (error.message == AppErrorMessages.userDoesNotExist) {
                return res.sendStatus(404)
            }

            return res.status(400).json(error.message)
        }

        res.sendStatus(500)
        console.error(error)
    })
})


async function returnUserResponseObject(requesterUserId, secondUserObject) {
    /*

    Receives user object and convert him to some object that we can return in the http response
    
    param 1: the id of the user which sent the http request
    param 2: the user object we have to return
    */

    const returnedObject = {
        id: secondUserObject.id,
        username: secondUserObject.username,
        fullname: secondUserObject.fullname,
        bio: secondUserObject.bio,
        isPrivate: secondUserObject.isPrivate,
        profilePhoto: secondUserObject.profilePhoto,
        followers: secondUserObject.followers,
        followings: secondUserObject.followings,
        posts: secondUserObject.posts,
    }

    // We dont check errors because we cant get errors in this case
    const doesHasPermission = await AuthenticationService.hasPermission(requesterUserId, secondUserObject.id)
    if (doesHasPermission) {
        returnedObject.lastDayStories = await getLastDayStoriesCount({ publisherId: secondUserObject.id })
    }

    if (requesterUserId == secondUserObject.id) {
        returnedObject.followRequests = secondUserObject.followRequests
        returnedObject.followingRequests = secondUserObject.followingRequests
        returnedObject.stories = secondUserObject.stories
        returnedObject.createdAt = secondUserObject.createdAt
        returnedObject.isFollowMe = false
        returnedObject.isFollowedByMe = false
        returnedObject.isRequestMe = false
        returnedObject.isRequestedByMe = false
    }
    else {
        returnedObject.isFollowedByMe = await isFollow({ firstUserId: requesterUserId, secondUserId: secondUserObject.id });
        returnedObject.isFollowMe = await isFollow({ firstUserId: secondUserObject.id, secondUserId: requesterUserId });
        if (returnedObject.isFollowedByMe) {
            returnedObject.isRequestedByMe = false;
        }
        else {
            returnedObject.isRequestedByMe = await isRequest({ firstUserId: requesterUserId, secondUserId: secondUserObject.id });
        }

        if (returnedObject.isFollowMe) {
            returnedObject.isRequestMe = false;
        }
        else {
            returnedObject.isRequestMe = await isRequest({ firstUserId: secondUserObject.id, secondUserId: requesterUserId });
        }
    }


    return returnedObject
}

// TODO: delete old profile photo when changed
// Gets post photo
userRouter.get('/:userId/:photoName', authenticateToken, (req, res) => {
    const photoName = req.params.photoName

    return res.sendFile(path.join(PROFILE_PHOTOS_FOLDER, photoName))
})


module.exports = { userRouter }