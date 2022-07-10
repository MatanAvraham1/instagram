function buildUpdateFields({ UsersDB, Id, Username, Fullname, Bio, AppError, AppErrorMessages }) {
    return async function updateFields({ userId, newUsername = undefined, newFullname = undefined, newBio = undefined, newIsPrivate = undefined }) {

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

        await UsersDB.updateFields(userId, newUsername, newFullname, newBio, newIsPrivate)
    }
}

module.exports = { buildUpdateFields }