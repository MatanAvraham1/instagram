function buildAcceptFollowRequest({ UsersDB, Id, AppError }) {
    return async function acceptFollowRequest({ firstUserId, secondUserId }) {

        // accepts the follow request which firstUser sent to secondUser

        if (!Id.isValid(firstUserId)) {
            throw new AppError("Can't accept a follow request of user by invalid id (${firstUserId}).")
        }
        if (!Id.isValid(secondUserId)) {
            throw new AppError("Can't accept a follow request of user by invalid id (${secondUserId}).")
        }

        if (!(await UsersDB.doesUserExist(firstUserId))) {
            throw new AppError("User (${firstUserId}) doesn't exist.")
        }

        if (!(await UsersDB.doesUserExist(secondUserId))) {
            throw new AppError("User (${secondUserId}) doesn't exist.")
        }

        if (firstUserId == secondUserId) {
            throw new AppError("User can't have follow request of himself.")
        }

        await UsersDB.acceptFollowRequest(firstUserId, secondUserId)
    }
}

module.exports = { buildAcceptFollowRequest }