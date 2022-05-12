function buildDeclineFollowRequest({ UsersDB, Id, AppError }) {
    return async function declineFollowRequest({ firstUserId, secondUserId }) {

        // checks if first user follow second user

        if (!Id.isValid(firstUserId)) {
            throw new AppError("Can't check by invalid id (${firstUserId}).")
        }
        if (!Id.isValid(secondUserId)) {
            throw new AppError("Can't check by invalid id (${secondUserId}).")
        }

        if (!(await UsersDB.doesUserExist(firstUserId))) {
            throw new AppError("User (${firstUserId}) doesn't exist.")
        }

        if (!(await UsersDB.doesUserExist(secondUserId))) {
            throw new AppError("User (${secondUserId}) doesn't exist.")
        }

        if (firstUserId == secondUserId) {
            throw new AppError("User can't follow request of himself.")
        }

        await UsersDB.isFollow(firstUserId, secondUserId)
    }
}

module.exports = { buildDeclineFollowRequest }