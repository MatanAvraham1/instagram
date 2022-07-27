function buildIsFollow({ UsersDB, Id, AppError, AppErrorMessages }) {
    return async function isFollow({ firstUserId, secondUserId }) {

        // checks if first user follow second user

        if (!Id.isValid(firstUserId)) {
            throw new AppError(AppErrorMessages.invalidUserId, firstUserId)
        }
        if (!Id.isValid(secondUserId)) {
            throw new AppError(AppErrorMessages.invalidUserId, secondUserId)
        }

        if (firstUserId == secondUserId) {
            throw new AppError(AppErrorMessages.userCanNotFollowHimself)
        }

        if (!(await UsersDB.doesUserExist({ userId: firstUserId }))) {
            throw new AppError(AppErrorMessages.userDoesNotExist, firstUserId)
        }

        if (!(await UsersDB.doesUserExist({ userId: secondUserId }))) {
            throw new AppError(AppErrorMessages.userDoesNotExist, secondUserId)
        }

        return await UsersDB.isFollow(firstUserId, secondUserId)
    }
}

module.exports = { buildIsFollow }