function buildIsFollow({ UsersDB, Id, AppError, AppErrorMessages }) {
    return async function isFollow({ firstUserId, secondUserId }) {

        // checks if first user follow second user

        if (!Id.isValid(firstUserId)) {
            throw new AppError(AppErrorMessages.invalidUserId)
        }
        if (!Id.isValid(secondUserId)) {
            throw new AppError(AppErrorMessages.invalidUserId)
        }

        if (firstUserId == secondUserId) {
            throw new AppError(AppErrorMessages.userCanNotFollowHimself)
        }

        if (!(await UsersDB.doesUserExist({ userId: firstUserId }))) {
            throw new AppError(AppErrorMessages.userDoesNotExist)
        }

        if (!(await UsersDB.doesUserExist({ userId: secondUserId }))) {
            throw new AppError(AppErrorMessages.userDoesNotExist)
        }

        return await UsersDB.isFollow(firstUserId, secondUserId)
    }
}

module.exports = { buildIsFollow }