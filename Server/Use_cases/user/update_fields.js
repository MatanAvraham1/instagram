const { PhotosChecker } = require("../../CustomHelpers/Photos_checker")

function buildUpdateFields({ UsersDB, Id, Username, Fullname, Bio, AppError, AppErrorMessages }) {
    return async function updateFields({ userId, newUsername = undefined, newFullname = undefined, newBio = undefined, newIsPrivate = undefined, newProfilePhoto = undefined }) {

        // makes the first user to unfollow the second user

        if (!Id.isValid(userId)) {
            throw new AppError(AppErrorMessages.invalidUserId)
        }

        if (!(await UsersDB.doesUserExist({ userId: userId }))) {
            throw new AppError(AppErrorMessages.userDoesNotExist)
        }

        if (newUsername != undefined) {
            if (!Username.isValid(newUsername)) {
                throw new AppError(AppErrorMessages.usedUsername)
            }
        }

        if (newFullname != undefined) {
            if (!Fullname.isValid(newFullname)) {
                throw new AppError(AppErrorMessages.invalidFullname)
            }
        }

        if (newBio != undefined) {
            if (!Bio.isValid(newBio)) {
                throw new AppError(AppErrorMessages.invalidBio)
            }
        }

        if (newIsPrivate != undefined) {
            if (typeof newIsPrivate != "boolean") {
                throw new AppError(AppErrorMessages.invalid_IsPrivate)
            }
        }

        if (newProfilePhoto != undefined) {
            if (!PhotosChecker.isValid(newProfilePhoto)) {
                throw new AppError(AppErrorMessages.invalidProfilePhoto)
            }
        }

        await UsersDB.updateFields(userId, newProfilePhoto, newUsername, newFullname, newBio, newIsPrivate)
    }
}

module.exports = { buildUpdateFields }