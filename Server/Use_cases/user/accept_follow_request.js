function buildAcceptFollowRequest({ UsersDB, Id, AppError, AppErrorMessages }) {
    return async function acceptFollowRequest({ firstUserId, secondUserId }) {

        // accepts the follow request which firstUser sent to secondUser

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

        if (!(await UsersDB.isRequest(firstUserId, secondUserId))) {
            throw new AppError(AppErrorMessages.followRequestDoesNotExist)
        }

        await UsersDB.acceptFollowRequest(firstUserId, secondUserId)
    }
}

module.exports = { buildAcceptFollowRequest }