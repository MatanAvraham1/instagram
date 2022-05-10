function buildDeclineFollowRequest({ UsersDB, Id, AppError }) {
    return async function declineFollowRequest({ firstUserId, secondUserId }) {

        // declines the follow request which firstUser sent to secondUser

        if (!Id.isValid(firstUserId)) {
            throw new AppError("Can't decline a follow request of user by invalid id.")
        }
        if (!Id.isValid(secondUserId)) {
            throw new AppError("Can't decline a follow request of user by invalid id.")
        }

        if (firstUserId == secondUserId) {
            throw new AppError("User can't have follow request of himself.")
        }

        await UsersDB.declineFollowRequest(firstUserId, secondUserId)
    }
}

module.exports = { buildDeclineFollowRequest }