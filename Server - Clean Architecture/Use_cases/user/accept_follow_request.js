function buildAcceptFollowRequest({ UsersDB, Id, AppError }) {
    return async function acceptFollowRequest({ firstUserId, secondUserId }) {

        // accepts the follow request which firstUser sent to secondUser

        if (!Id.isValid(firstUserId)) {
            throw new AppError("Can't accept a follow request of user by invalid id.")
        }
        if (!Id.isValid(secondUserId)) {
            throw new AppError("Can't accept a follow request of user by invalid id.")
        }

        if (firstUserId == secondUserId) {
            throw new AppError("User can't have follow request of himself.")
        }

        await UsersDB.acceptFollowRequest(firstUserId, secondUserId)
    }
}

module.exports = { buildAcceptFollowRequest }