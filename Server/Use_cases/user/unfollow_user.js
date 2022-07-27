function buildUnfollowUser({ UsersDB, Id, AppError, AppErrorMessages }) {
    return async function unfollowUser({ firstUserId, secondUserId }) {

        // makes the first user to unfollow the second user

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

        if (!(await UsersDB.isFollow(firstUserId, secondUserId))) {
            throw new AppError(AppErrorMessages.alreadyUnfollow)
        }

        await UsersDB.unfollowUser(firstUserId, secondUserId)
    }
}

module.exports = { buildUnfollowUser }