function buildFollowUser({ UsersDB, Id, AppError, AppErrorMessages }) {
    return async function followUser({ firstUserId, secondUserId }) {

        // makes the first user to follow the second user

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

        if (await UsersDB.isFollow(firstUserId, secondUserId)) {
            throw new AppError(AppErrorMessages.alreadyFollow)
        }

        if (await UsersDB.isRequest(firstUserId, secondUserId)) {
            throw new AppError(AppErrorMessages.alreadyRequested)
        }

        await UsersDB.followUser(firstUserId, secondUserId)
    }
}

module.exports = { buildFollowUser }