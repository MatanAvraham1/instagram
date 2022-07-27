function buildDoesUserExist({ UsersDB, Id, AppError, AppErrorMessages }) {
    return async function doesUserExist({ userId }) {

        if (!Id.isValid(userId)) {
            throw new AppError(AppErrorMessages.invalidUserId)
        }

        return await UsersDB.doesUserExist({ userId: userId })
    }
}

module.exports = { buildDoesUserExist }