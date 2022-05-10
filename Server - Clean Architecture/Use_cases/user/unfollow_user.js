function buildUnfollowUser({ UsersDB, Id, AppError }) {
    return async function unfollowUser({ firstUserId, secondUserId }) {

        // makes the first user to unfollow the second user

        if (!Id.isValid(firstUserId)) {
            throw new AppError("Can't unfollow user by invalid id.")
        }
        if (!Id.isValid(secondUserId)) {
            throw new AppError("Can't unfollow user by invalid id.")
        }

        if (firstUserId == secondUserId) {
            throw new AppError("User can't follow himself.")
        }

        await UsersDB.unfollowUser(firstUserId, secondUserId)
    }
}

module.exports = { buildUnfollowUser }