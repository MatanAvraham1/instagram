function buildFollowUser({ UsersDB, Id, AppError }) {
    return async function followUser({ firstUserId, secondUserId }) {

        // makes the first user to follow the second user

        if (!Id.isValid(firstUserId)) {
            throw new AppError("Can't follow user by invalid id.")
        }
        if (!Id.isValid(secondUserId)) {
            throw new AppError("Can't follow user by invalid id.")
        }

        if (firstUserId == secondUserId) {
            throw new AppError("User can't follow himself.")
        }

        await UsersDB.followUser(firstUserId, secondUserId)
    }
}

module.exports = { buildFollowUser }