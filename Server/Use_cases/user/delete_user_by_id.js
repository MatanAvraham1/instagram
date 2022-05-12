function buildDeleteUserById({ UsersDB, Id, AppError, AppErrorMessages }) {
    return async function deleteUserById({ userId }) {

        if (!Id.isValid(userId)) {
            throw new AppError(AppErrorMessages.invalidUserId)
        }

        if (!(await UsersDB.doesUserExist(userId))) {
            throw new AppError(AppErrorMessages.userDoesNotExist)
        }

        await UsersDB.deleteById(userId)
    }
}

module.exports = { buildDeleteUserById }